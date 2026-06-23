<?php

namespace App\Console\Commands;

use App\Models\AbandonPanier;
use App\Models\Tenant;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Log;
use Stancl\Tenancy\Facades\Tenancy;

class SendCartReminders extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'cart:remind';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Send email reminders for abandoned carts';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $this->info('Starting to process cart reminders...');

        $tenants = Tenant::all();
        $totalCount = 0;
        $maxRelances = 3;

        foreach ($tenants as $tenant) {
            Tenancy::initialize($tenant);

            // Find abandoned carts that are not recovered, have < 3 reminders
            // and last reminder was sent more than 24 hours ago (or never sent)
            $abandons = AbandonPanier::with('panier.client')
                ->where('recupere', false)
                ->where('nombre_relances', '<', $maxRelances)
                ->where(function ($query) {
                    $query->whereNull('derniere_relance')
                          ->orWhere('derniere_relance', '<=', now()->subHours(24));
                })
                ->get();

            foreach ($abandons as $abandon) {
                try {
                    if ($abandon->panier && $abandon->panier->client && $abandon->panier->client->email) {
                        $abandon->enregistrerRelance('email');
                        $totalCount++;
                        $this->line("Tenant {$tenant->id} - Reminder sent for cart {$abandon->panier_id}. (Attempt: {$abandon->nombre_relances})");
                    }
                } catch (\Exception $e) {
                    Log::error("Failed to send reminder for cart {$abandon->panier_id} in tenant {$tenant->id}: " . $e->getMessage());
                    $this->error("Failed to send reminder for cart {$abandon->panier_id}.");
                }
            }

            Tenancy::end();
        }

        $this->info("Successfully sent {$totalCount} cart reminders across all tenants.");
    }
}
