<?php

namespace App\Notifications;

use App\Models\Tenant;
use App\Services\VendorRegistrationService;
use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

/**
 * Notification confirmant l'approbation d'un vendeur.
 *
 * Envoie un email de bienvenue au vendeur avec l'URL SSO pour accéder à sa boutique.
 */
class VendorApproved extends Notification
{
    use Queueable;

    /**
     * Crée une nouvelle instance de la notification.
     *
     * @param  Tenant  $tenant  Le tenant approuvé.
     */
    public function __construct(public Tenant $tenant) {}

    /**
     * Détermine les canaux de distribution de la notification.
     *
     * @param  object  $notifiable  L'entité notifiable.
     * @return array<int, string>
     */
    public function via($notifiable): array
    {
        return ['mail', 'database'];
    }

    /**
     * Construit la représentation e-mail de la notification.
     *
     * @param  object  $notifiable  L'entité notifiable.
     */
    public function toMail($notifiable): MailMessage
    {
        $shopUrl = app(VendorRegistrationService::class)
            ->getTenantSsoLoginUrl($this->tenant, $notifiable);

        return (new MailMessage)
            ->subject('Votre boutique est prête !')
            ->greeting('Félicitations '.$notifiable->name.' !')
            ->line('Votre boutique "'.$this->tenant->raison_sociale.'" a été créée avec succès.')
            ->line('Vous pouvez maintenant commencer à configurer votre boutique et ajouter vos produits.')
            ->action('Accéder à ma boutique', $shopUrl)
            ->line('Merci d\'avoir choisi notre plateforme !');
    }

    /**
     * Construit la représentation en base de données de la notification.
     *
     * @param  object  $notifiable  L'entité notifiable.
     * @return array<string, mixed>
     */
    public function toArray($notifiable): array
    {
        return [
            'tenant_id' => $this->tenant->id,
            'shop_name' => $this->tenant->raison_sociale,
            'message' => 'Votre boutique a été créée avec succès.',
        ];
    }
}
