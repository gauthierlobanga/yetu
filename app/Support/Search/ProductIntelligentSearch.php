<?php

namespace App\Support\Search;

use App\Models\Produit;
use App\Services\EmbeddingService;
use Illuminate\Contracts\JsonSchema\JsonSchema;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Str;
use Laravel\Ai\Embeddings;
use Laravel\Ai\Files\Image;
use thiagoalessio\TesseractOCR\TesseractOCR;
use Throwable;

use function Laravel\Ai\agent;

/**
 * Moteur de recherche intelligente de produits combinant recherche textuelle et vectorielle.
 *
 * Cette classe orchestre la recherche hybride : recherche full-text classique (LIKE / Scout)
 * et recherche sémantique via embeddings vectoriels (pgvector). Elle gère également
 * la recherche par image via OCR (Tesseract) et analyse IA, ainsi que la synchronisation
 * des index de recherche pour chaque produit.
 *
 * @see Produit
 * @see EmbeddingService
 */
class ProductIntelligentSearch
{
    /** @var int Nombre de dimensions des vecteurs d'embedding générés */
    private const int EMBEDDING_DIMENSIONS = 1536;

    /**
     * Effectue une recherche hybride (textuelle + sémantique) sur les produits.
     *
     * Combine les résultats de la recherche full-text Scout et de la recherche
     * vectorielle pgvector via un algorithme de fusion par scores pondérés.
     * En cas d'échec de la recherche vectorielle, le fallback textuel est utilisé.
     *
     * @param  Builder  $query  Le query builder pré-filtré (scopes publiés, en stock, etc.)
     * @param  string  $term  Le terme de recherche saisi par l'utilisateur
     * @param  int  $limit  Nombre maximum de résultats à retourner
     * @return array{ids: array<int|string>, semantic: bool} IDs ordonnés et indicateur de recherche sémantique
     */
    public function search(Builder $query, string $term, int $limit = 120): array
    {
        $normalizedTerm = Str::squish($term);

        if ($normalizedTerm === '') {
            return [
                'ids' => [],
                'semantic' => false,
            ];
        }

        $textIds = (clone $query)
            ->search($normalizedTerm)
            ->limit($limit)
            ->pluck('produits.id')
            ->all();

        $embedding = $this->embed($normalizedTerm);

        if (! $embedding || ! $this->supportsVectorSearch()) {
            return [
                'ids' => $textIds,
                'semantic' => false,
            ];
        }

        try {
            $vectorIds = (clone $query)
                ->whereNotNull('search_embedding')
                ->orderByVectorDistance('search_embedding', $embedding)
                ->limit($limit)
                ->pluck('produits.id')
                ->all();

            return [
                'ids' => $this->mergeRankedIds($textIds, $vectorIds),
                'semantic' => ! empty($vectorIds),
            ];
        } catch (Throwable $e) {
            Log::warning('Recherche vectorielle produit indisponible, fallback texte activé.', [
                'message' => $e->getMessage(),
            ]);

            return [
                'ids' => $textIds,
                'semantic' => false,
            ];
        }
    }

    /**
     * Recherche des produits à partir d'une image uploadée.
     *
     * Analyse l'image via IA (description, catégorie, couleurs) et OCR (Tesseract),
     * puis injecte le texte combiné dans le moteur de recherche hybride.
     *
     * @param  Builder  $query  Le query builder pré-filtré
     * @param  string  $fullPath  Chemin absolu vers le fichier image temporaire
     * @param  int  $limit  Nombre maximum de résultats
     * @return array{query: string, analysis: array, ocr_text: string, ids: array, semantic: bool}
     */
    public function searchByImage(Builder $query, string $fullPath, int $limit = 120): array
    {
        $analysis = $this->describeImage($fullPath);
        $ocrText = $this->extractTextFromImage($fullPath);

        $queryText = Str::squish(collect([
            $analysis['optimized_query'] ?? null,
            $analysis['description'] ?? null,
            $analysis['detected_category'] ?? null,
            $analysis['detected_colors'] ?? null,
            $ocrText,
        ])->filter()->implode(' '));

        $result = $this->search($query, $queryText, $limit);

        return [
            'query' => $queryText,
            'analysis' => $analysis,
            'ocr_text' => $ocrText,
            'ids' => $result['ids'],
            'semantic' => $result['semantic'],
        ];
    }

    /**
     * Synchronise le document de recherche et l'embedding vectoriel d'un produit.
     *
     * Reconstruit le champ `search_document` (texte indexable) et, si activé,
     * régénère le vecteur `search_embedding` via l'API d'embeddings.
     * Le vecteur est stocké directement en SQL comme type pgvector.
     *
     * @param  Produit  $product  Le produit à indexer
     * @param  bool  $withEmbedding  Générer également le vecteur d'embedding
     */
    public function syncProductIndex(Produit $product, bool $withEmbedding = true): void
    {
        $product->loadMissing(['brand', 'categories']);

        $document = $product->buildSearchDocument();

        if (! $withEmbedding || ! $this->supportsVectorSearch()) {
            $product->forceFill([
                'search_document' => $document,
            ])->saveQuietly();

            return;
        }

        $embedding = $this->embed($document);

        if (! $embedding) {
            $product->forceFill([
                'search_document' => $document,
                'search_embedding_synced_at' => null,
            ])->saveQuietly();

            return;
        }

        $table = DB::connection()->getQueryGrammar()->wrapTable($product->getTable());

        DB::update(
            "update {$table} set search_document = ?, search_embedding = ?::vector, search_embedding_synced_at = ?, updated_at = ? where id = ?",
            [$document, $this->toPgVector($embedding), now(), now(), $product->getKey()],
        );
    }

    /**
     * Vérifie si la recherche vectorielle textuelle est disponible.
     *
     * Contrôle que le driver est PostgreSQL, que l'extension pgvector est installée
     * et que la colonne `search_embedding` existe dans la table produits.
     *
     * @return bool True si la recherche vectorielle textuelle est opérationnelle
     */
    public function supportsVectorSearch(): bool
    {
        if (DB::getDriverName() !== 'pgsql') {
            return false;
        }

        try {
            $extensionInstalled = DB::scalar("select exists (select 1 from pg_extension where extname = 'vector')");
            $columnExists = Schema::hasColumn((new Produit)->getTable(), 'search_embedding');

            return (bool) $extensionInstalled && $columnExists;
        } catch (Throwable $e) {
            Log::warning('Impossible de valider pgvector.', [
                'message' => $e->getMessage(),
            ]);

            return false;
        }
    }

    /**
     * Vérifie si la recherche vectorielle par image est disponible.
     *
     * Contrôle que le driver est PostgreSQL, que l'extension pgvector est installée
     * et que la colonne `image_search_metadata` existe dans la table produits.
     *
     * @return bool True si la recherche vectorielle par image est opérationnelle
     */
    public function supportsImageVectorSearch(): bool
    {
        if (DB::getDriverName() !== 'pgsql') {
            return false;
        }

        try {
            $extensionInstalled = DB::scalar("select exists (select 1 from pg_extension where extname = 'vector')");
            $columnExists = Schema::hasColumn((new Produit)->getTable(), 'image_search_metadata');

            return (bool) $extensionInstalled && $columnExists;
        } catch (Throwable $e) {
            Log::warning('Impossible de valider pgvector image.', [
                'message' => $e->getMessage(),
            ]);

            return false;
        }
    }

    /**
     * Génère un vecteur d'embedding à partir d'un texte via l'API Laravel AI.
     *
     * Retourne null si le texte est vide, si aucun provider d'embeddings n'est
     * configuré, ou en cas d'erreur de l'API.
     *
     * @param  string  $text  Le texte à vectoriser
     * @return array<float>|null Le vecteur d'embedding ou null en cas d'échec
     */
    protected function embed(string $text): ?array
    {
        $text = Str::squish($text);

        if ($text === '' || blank(config('ai.default_for_embeddings'))) {
            return null;
        }

        try {
            return Embeddings::for([$text])
                ->dimensions(self::EMBEDDING_DIMENSIONS)
                ->timeout(15)
                ->generate()
                ->first();
        } catch (Throwable $e) {
            Log::warning('Génération d’embedding impossible, fallback texte activé.', [
                'message' => $e->getMessage(),
            ]);

            return null;
        }
    }

    /**
     * Analyse une image de produit via un agent IA multimodal.
     *
     * L'agent retourne un JSON structuré contenant : une requête de recherche
     * optimisée, une description du produit, la catégorie détectée et les couleurs.
     *
     * @param  string  $fullPath  Chemin absolu vers le fichier image
     * @return array{optimized_query?: string, description?: string, detected_category?: string, detected_colors?: string}
     */
    protected function describeImage(string $fullPath): array
    {
        if (blank(config('ai.default_for_images'))) {
            return [];
        }

        try {
            $response = agent(
                instructions: 'Tu analyses une image de produit e-commerce et retournes un objet JSON concis pour lancer une recherche catalogue fiable.',
                schema: fn (JsonSchema $schema): array => [
                    'optimized_query' => $schema->string()->required(),
                    'description' => $schema->string(),
                    'detected_category' => $schema->string(),
                    'detected_colors' => $schema->string(),
                ],
            )->prompt(
                prompt: 'Décris le produit principal visible, sa catégorie probable, ses caractéristiques distinctives et reformule une requête de recherche e-commerce courte en français.',
                attachments: [Image::fromPath($fullPath)],
                provider: config('ai.default_for_images'),
            );

            return [
                'optimized_query' => (string) ($response['optimized_query'] ?? ''),
                'description' => (string) ($response['description'] ?? ''),
                'detected_category' => (string) ($response['detected_category'] ?? ''),
                'detected_colors' => (string) ($response['detected_colors'] ?? ''),
            ];
        } catch (Throwable $e) {
            Log::warning('Analyse IA d’image indisponible, fallback OCR activé.', [
                'message' => $e->getMessage(),
            ]);

            return [];
        }
    }

    /**
     * Extrait le texte visible dans une image via OCR (Tesseract).
     *
     * Utilise la reconnaissance optique de caractères en français et anglais.
     * Le résultat est tronqué aux 10 premiers mots significatifs.
     *
     * @param  string  $fullPath  Chemin absolu vers le fichier image
     * @return string Le texte extrait (vide si OCR indisponible ou image illisible)
     */
    protected function extractTextFromImage(string $fullPath): string
    {
        try {
            $text = (new TesseractOCR($fullPath))
                ->lang('fra', 'eng')
                ->run();

            return Str::words(Str::squish($text), 10, '');
        } catch (Throwable $e) {
            return '';
        }
    }

    /**
     * Fusionne et classe les résultats textuels et vectoriels par score pondéré.
     *
     * Attribue un score décroissant à chaque résultat selon sa position dans chaque
     * liste source. Les résultats textuels reçoivent un bonus de pondération (150)
     * supérieur aux vectoriels (100) pour favoriser la pertinence lexicale.
     *
     * @param  array<int|string>  $textIds  IDs issus de la recherche textuelle
     * @param  array<int|string>  $vectorIds  IDs issus de la recherche vectorielle
     * @return array<int|string> IDs fusionnés et triés par score décroissant
     */
    protected function mergeRankedIds(array $textIds, array $vectorIds): array
    {
        $scores = [];

        foreach ($vectorIds as $index => $id) {
            $scores[$id] = ($scores[$id] ?? 0) + max(1, 100 - $index);
        }

        foreach ($textIds as $index => $id) {
            $scores[$id] = ($scores[$id] ?? 0) + max(1, 150 - $index);
        }

        arsort($scores);

        return array_keys($scores);
    }

    /**
     * Convertit un tableau PHP de floats en chaîne compatible pgvector.
     *
     * Formate chaque valeur avec 8 décimales et les joint dans le format
     * attendu par PostgreSQL : `[0.12345678,0.98765432,...]`.
     *
     * @param  array<float>  $embedding  Le vecteur d'embedding
     * @return string La représentation pgvector (ex: '[0.10000000,0.20000000]')
     */
    protected function toPgVector(array $embedding): string
    {
        return '['.collect($embedding)
            ->map(fn ($value) => number_format((float) $value, 8, '.', ''))
            ->implode(',').']';
    }

    /**
     * Recherche des produits similaires par comparaison vectorielle d'image.
     *
     * Génère un embedding à partir de l'image fournie via le service dédié,
     * puis effectue une recherche par distance vectorielle sur la colonne
     * `image_search_metadata` des produits publiés.
     *
     * @param  string  $imagePath  Chemin absolu vers le fichier image
     * @param  int  $limit  Nombre maximum de résultats
     * @return array<int|string> IDs des produits similaires ordonnés par proximité
     */
    public function searchByImageSimilarity(string $imagePath, int $limit = 48): array
    {
        if (! $this->supportsImageVectorSearch() || ! is_file($imagePath)) {
            return [];
        }

        $imageService = app(EmbeddingService::class);
        $embedding = $imageService->embedImage(
            new UploadedFile(
                $imagePath,
                basename($imagePath),
                mime_content_type($imagePath) ?: null,
                null,
                true,
            )
        );

        return Produit::query()
            ->whereNotNull('image_search_metadata',true)
            ->published()
            ->orderByVectorDistance('image_search_metadata', $embedding)
            ->limit($limit)
            ->pluck('produits.id')
            ->all();
    }

    /**
     * Génère un embedding vectoriel pour un texte donné.
     *
     * @return array<float>|null
     */
    public function embedText(string $text): ?array
    {
        return $this->embed($text);
    }
}
