<?php

namespace App\Jobs;

use App\Models\VendorRequest;
use App\Services\VendorRegistrationService;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Queue\Queueable;
use Illuminate\Support\Facades\Log;

/**
 * Job responsable de l'approbation d'une demande de vendeur.
 *
 * Ce job exécute l'approbation de manière asynchrone pour éviter de bloquer
 * le processus principal, en utilisant le service d'enregistrement des vendeurs.
 */
class ApproveVendorRequest implements ShouldQueue
{
    use Queueable;

    public $tries = 3;

    public $backoff = [60, 300, 900];

    /**
     * Crée une nouvelle instance du job.
     *
     * @param  VendorRequest  $vendorRequest  La demande de vendeur à approuver.
     */
    public function __construct(
        private readonly VendorRequest $vendorRequest,
    ) {
        $this->onQueue('default');
    }

    /**
     * Exécute le job.
     *
     * @param  VendorRegistrationService  $service  Le service gérant l'enregistrement des vendeurs.
     *
     * @throws \Exception Si une erreur survient lors de l'approbation.
     */
    public function handle(VendorRegistrationService $service): void
    {
        try {
            Log::info('Starting vendor approval job', [
                'vendor_request_id' => $this->vendorRequest->id,
            ]);

            $service->approve($this->vendorRequest);

            Log::info('Vendor approved successfully via job', [
                'vendor_request_id' => $this->vendorRequest->id,
            ]);
        } catch (\Exception $e) {
            Log::error('Failed to approve vendor in job', [
                'vendor_request_id' => $this->vendorRequest->id,
                'error' => $e->getMessage(),
            ]);

            throw $e;
        }
    }
}
