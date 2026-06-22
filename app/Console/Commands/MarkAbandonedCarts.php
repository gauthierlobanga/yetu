<?php

namespace App\Console\Commands;

use App\Models\Panier;
use App\Models\Tenant;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Log;
use Stancl\Tenancy\Facades\Tenancy;

class MarkAbandonedCarts extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'cart:abandon';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Mark inactive carts as abandoned';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $this->info('Starting to process abandoned carts...');

        $tenants = Tenant::all();
        $totalCount = 0;

        foreach ($tenants as $tenant) {
            Tenancy::initialize($tenant);

            // Find active carts that have not been modified in the last 24 hours
            // and have at least 1 item
            $carts = Panier::where('statut', Panier::STATUT_ACTIF)
                ->where('date_modification', '<', now()->subHours(24))
                ->whereHas('items')
                ->get();

            foreach ($carts as $cart) {
                try {
                    // Determine step (for analytics)
                    $etape = 'inconnu';
                    if ($cart->livraison()->exists()) {
                        $etape = 'livraison';
                    } elseif ($cart->client_id) {
                        $etape = 'authentification';
                    }

                    $cart->marquerAbandonne($etape, 'Inactivité > 24h');
                    $totalCount++;

                    $this->line("Tenant {$tenant->id} - Cart {$cart->id} marked as abandoned.");
                } catch (\Exception $e) {
                    Log::error("Failed to mark cart {$cart->id} as abandoned for tenant {$tenant->id}: ".$e->getMessage());
                    $this->error("Failed to mark cart {$cart->id} for tenant {$tenant->id}.");
                }
            }

            Tenancy::end();
        }

        $this->info("Successfully marked {$totalCount} carts as abandoned across all tenants.");
    }
}
