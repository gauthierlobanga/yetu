<?php

namespace App\Console\Commands;

use App\Models\Wishlist;
use App\Notifications\WishlistReminderNotification;
use Illuminate\Console\Attributes\Description;
use Illuminate\Console\Attributes\Signature;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Notification;

#[Signature('wishlist:send-reminders {--days=1 : Nombre de jours depuis le dernier ajout}')]
#[Description('Envoie des rappels aux clients qui ont des articles en wishlist depuis un certain temps')]
class SendWishlistReminders extends Command
{
    protected $signature = '';

    protected $description = '';

    public function handle()
    {
        $days = (int) $this->option('days');
        $dateLimit = now()->subDays($days);

        // Récupérer les wishlists ayant des items ajoutés avant la date limite
        $wishlists = Wishlist::whereHas('items', function ($query) use ($dateLimit) {
            $query->where('created_at', '<', $dateLimit);
        })
            ->with('client.user')
            ->get();

        foreach ($wishlists as $wishlist) {
            $user = $wishlist->client->user ?? null;
            if ($user) {
                Notification::send($user, new WishlistReminderNotification($wishlist));
            }
        }

        $this->info('Rappels envoyés avec succès.');
    }
}
