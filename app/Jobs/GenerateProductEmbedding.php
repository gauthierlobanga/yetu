<?php

namespace App\Jobs;

use App\Models\Produit;
use App\Services\EmbeddingService;
use App\Support\Search\ProductIntelligentSearch;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldBeUnique;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Http\UploadedFile;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\DB;
use Throwable;

/**
 * Job asynchrone de génération des embeddings vectoriels pour un produit.
 *
 * Ce job gère deux types d'embeddings :
 * - **Image** : via un service externe de vectorisation d'image (microservice dédié)
 * - **Texte** : via le moteur de recherche intelligente (API Laravel AI Embeddings)
 *
 * Le job est unique par produit (ShouldBeUnique) pour éviter les doublons
 * en file d'attente. Il marque le timestamp `search_embedding_synced_at`
 * après synchronisation réussie.
 *
 * @see EmbeddingService
 * @see ProductIntelligentSearch
 */
class GenerateProductEmbedding implements ShouldBeUnique, ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    /** @var int Nombre maximum de tentatives avant échec définitif */
    public int $tries = 3;

    /** @var int Délai maximum d'exécution en secondes */
    public int $timeout = 120;

    /** @var int Durée d'unicité du job en secondes (10 minutes) */
    public int $uniqueFor = 600;

    /** @var bool Dispatcher le job uniquement après le commit de la transaction */
    public bool $afterCommit = true;

    /**
     * Crée une nouvelle instance du job.
     *
     * @param  Produit  $produit  Le produit dont les embeddings doivent être générés
     */
    public function __construct(public Produit $produit) {}

    /**
     * Exécute la génération des embeddings image et texte.
     *
     * Tente d'abord la vectorisation de l'image principale du produit via le
     * microservice d'embedding, puis synchronise l'index de recherche textuel.
     * Les deux opérations sont indépendantes : un échec de l'une n'empêche pas l'autre.
     *
     * @param  EmbeddingService  $imageService  Service de vectorisation d'images
     * @param  ProductIntelligentSearch  $searchService  Moteur de recherche intelligente
     */
    public function handle(EmbeddingService $imageService, ProductIntelligentSearch $searchService): void
    {
        $this->produit->refresh()->loadMissing(['brand', 'categories']);

        $imageOk = false;
        $textOk = false;

        $imagePath = $this->produit->getFirstMediaPath('image_principale')
                     ?? $this->produit->getFirstMediaPath('images');

        if ($imagePath && is_file($imagePath) && config('services.embedding.enabled', false) && $searchService->supportsImageVectorSearch()) {
            try {
                $file = new UploadedFile(
                    $imagePath,
                    basename($imagePath),
                    mime_content_type($imagePath) ?: null,
                    null,
                    true,
                );
                $embedding = $imageService->embedImage($file);
                $vector = $imageService->toVector($embedding);

                $table = DB::connection()->getQueryGrammar()->wrapTable($this->produit->getTable());

                DB::update(
                    "update {$table} set image_search_metadata = ?::vector, updated_at = ? where id = ?",
                    [$vector, now(), $this->produit->getKey()],
                );

                $imageOk = true;
            } catch (Throwable $e) {
                report($e);
            }
        }

        try {
            $searchService->syncProductIndex($this->produit, true);
            $textOk = true;
        } catch (Throwable $e) {
            report($e);
        }

        if ($imageOk || $textOk) {
            $this->produit->forceFill([
                'search_embedding_synced_at' => now(),
            ])->saveQuietly();
        }
    }

    /**
     * Définit les délais de retry progressifs entre chaque tentative.
     *
     * @return array<int> Délais en secondes : 10s, 60s, puis 5min
     */
    public function backoff(): array
    {
        return [10, 60, 300];
    }

    /**
     * Retourne l'identifiant unique du job pour éviter les doublons en file d'attente.
     *
     * @return string La clé primaire du produit
     */
    public function uniqueId(): string
    {
        return (string) $this->produit->getKey();
    }

    /**
     * Gère l'échec définitif du job après épuisement des tentatives.
     *
     * @param  Throwable|null  $exception  L'exception ayant causé l'échec
     */
    public function failed(?Throwable $exception): void
    {
        if ($exception) {
            report($exception);
        }
    }
}
