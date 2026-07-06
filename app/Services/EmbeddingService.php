<?php

namespace App\Services;

use App\Jobs\GenerateProductEmbedding;
use App\Support\Search\ProductIntelligentSearch;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Str;
use Laravel\Ai\Embeddings;
use RuntimeException;
use Throwable;

/**
 * Service centralisé de génération et manipulation d'embeddings vectoriels.
 *
 * Gère la vectorisation d'images (via microservice HTTP externe) et de texte
 * (via Laravel AI Embeddings). Fournit des utilitaires de conversion entre
 * tableaux PHP et format pgvector PostgreSQL.
 *
 * @see GenerateProductEmbedding
 * @see ProductIntelligentSearch
 */
class EmbeddingService
{
    /** @var string URL du microservice de vectorisation d'images */
    protected string $endpoint;

    /** @var int Timeout HTTP en secondes pour les requêtes d'embedding */
    protected int $timeout;

    /** @var int Timeout de connexion HTTP en secondes */
    protected int $connectTimeout;

    /** @var int Nombre de tentatives de retry en cas d'échec HTTP */
    protected int $retries;

    /** @var int Nombre de dimensions des vecteurs générés */
    protected int $dimensions;

    /**
     * Initialise le service avec la configuration de l'application.
     *
     * Les valeurs sont lues depuis `config('services.embedding.*')`.
     */
    public function __construct()
    {
        $this->endpoint = config('services.embedding.endpoint', 'http://localhost:8001/embed-image');
        $this->timeout = (int) config('services.embedding.timeout', 30);
        $this->connectTimeout = (int) config('services.embedding.connect_timeout', 5);
        $this->retries = (int) config('services.embedding.retries', 2);
        $this->dimensions = (int) config('services.embedding.dimensions', 1536);
    }

    /**
     * Génère un vecteur à partir d'une image (fichier UploadedFile).
     *
     * @return array<float>
     *
     * @throws RuntimeException
     */
    public function embedImage(UploadedFile $file): array
    {
        $path = $file->getRealPath();

        if ($path === false || ! is_file($path)) {
            throw new RuntimeException('Image introuvable pour la génération d’embedding.');
        }

        $response = Http::timeout($this->timeout)
            ->connectTimeout($this->connectTimeout)
            ->retry($this->retries, 100)
            ->attach(
                'image',
                file_get_contents($path),
                $file->getClientOriginalName()
            )
            ->post($this->endpoint);

        if ($response->failed()) {
            Log::error('Embedding image service error', [
                'status' => $response->status(),
                'body' => $response->body(),
            ]);

            throw new RuntimeException(
                "Embedding image service returned {$response->status()}: {$response->body()}"
            );
        }

        $data = $response->json();

        if (! isset($data['embedding']) || ! is_array($data['embedding'])) {
            throw new RuntimeException('Invalid embedding response from image service.');
        }

        return $this->normalizeEmbedding($data['embedding']);
    }

    /**
     * Génère un vecteur à partir d'un texte via ProductIntelligentSearch.
     *
     * @return array<float>
     *
     * @throws RuntimeException
     */
    public function embedText(string $text): array
    {
        $text = Str::squish($text);

        if ($text === '' || blank(config('ai.default_for_embeddings'))) {
            throw new RuntimeException('Échec de la génération d’embedding texte.');
        }

        try {
            $embedding = Embeddings::for([$text])
                ->dimensions($this->dimensions)
                ->timeout($this->timeout)
                ->generate()
                ->first();
        } catch (Throwable $e) {
            Log::warning('Génération d’embedding texte impossible.', [
                'message' => $e->getMessage(),
            ]);

            throw new RuntimeException('Échec de la génération d’embedding texte.', previous: $e);
        }

        if (! is_array($embedding)) {
            throw new RuntimeException('Réponse embedding texte invalide.');
        }

        return $this->normalizeEmbedding($embedding);
    }

    /**
     * Convertit un tableau de floats en chaîne pgvector (ex: '[0.1,0.2,0.3]').
     *
     * @param  array<float>  $embedding
     */
    public function toVector(array $embedding): string
    {
        $values = array_map(function (float|int|string $value): string {
            return rtrim(rtrim(number_format((float) $value, 8, '.', ''), '0'), '.');
        }, $this->normalizeEmbedding($embedding));

        return '['.implode(',', $values).']';
    }

    /**
     * Lit un vecteur stocké dans PostgreSQL et le convertit en tableau de floats.
     *
     * @return array<float>
     */
    public function fromVector(string $pgVector): array
    {
        $json = trim($pgVector, '[]');
        if (empty($json)) {
            return [];
        }

        return array_map('floatval', explode(',', $json));
    }

    /**
     * @param  array<int, mixed>  $embedding
     * @return array<int, float>
     */
    private function normalizeEmbedding(array $embedding): array
    {
        if ($embedding === []) {
            throw new RuntimeException('Embedding vide.');
        }

        return array_map(function (mixed $value): float {
            $float = (float) $value;

            if (! is_finite($float)) {
                throw new RuntimeException('Embedding invalide.');
            }

            return $float;
        }, array_values($embedding));
    }
}
