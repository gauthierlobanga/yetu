<?php

namespace App\Notifications;

use App\Models\Tenant;
use App\Services\VendorRegistrationService;
use chillerlan\QRCode\QRCode;
use chillerlan\QRCode\QROptions;
use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class VendorApproved extends Notification
{
    use Queueable;

    public function __construct(public Tenant $tenant) {}

    public function via($notifiable): array
    {
        return ['mail', 'database'];
    }

    public function toMail($notifiable): MailMessage
    {
        $service = app(VendorRegistrationService::class);
        $shopUrl = $service->getTenantSsoLoginUrl($this->tenant, $notifiable);

        // --- QR Code avec chillerlan/php-qrcode ---
        $options = new QROptions([
            'outputType' => 'png',   // chaîne simple : 'png', 'gif', 'jpg', 'svg', etc.
            'scale' => 10,
            'imageBase64' => true,        // retourne directement une chaîne base64
        ]);
        $qrBase64 = (new QRCode($options))->render($shopUrl);
        // -------------------------------------------

        $logoUrl = $this->tenant->getFirstMediaUrl('tenant_avatar', 'card')
                   ?: $this->tenant->getFirstMediaUrl('tenant_avatar');

        $data = [
            'user' => $notifiable,
            'tenant' => $this->tenant,
            'shopName' => $this->tenant->raison_sociale,
            'shopUrl' => $shopUrl,
            'qrCode' => $qrBase64,               // déjà en base64
            'logoUrl' => $logoUrl,
            'planName' => $this->tenant->subscription?->plan->name ?? 'N/C',
            'expiration' => $this->tenant->date_expiration?->format('d/m/Y') ?? null,
            'supportEmail' => config('mail.from.address'),
            'helpUrl' => route('help'),
        ];

        return (new MailMessage)
            ->subject('🎉 Votre boutique "'.$this->tenant->raison_sociale.'" est en ligne !')
            ->view('emails.vendor.approved', $data);
    }

    public function toArray($notifiable): array
    {
        return [
            'tenant_id' => $this->tenant->id,
            'shop_name' => $this->tenant->raison_sociale,
            'message' => 'Votre boutique a été créée avec succès.',
        ];
    }
}
