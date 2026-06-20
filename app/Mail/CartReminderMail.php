<?php

namespace App\Mail;

use App\Models\RelancePanier;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class CartReminderMail extends Mailable implements ShouldQueue
{
    use Queueable, SerializesModels;

    public RelancePanier $relance;
    public string $recoverUrl;

    /**
     * Create a new message instance.
     */
    public function __construct(RelancePanier $relance, string $recoverUrl)
    {
        $this->relance = $relance;
        $this->recoverUrl = $recoverUrl;
    }

    /**
     * Get the message envelope.
     */
    public function envelope(): Envelope
    {
        return new Envelope(
            subject: 'N\'oubliez pas votre panier !',
        );
    }

    /**
     * Get the message content definition.
     */
    public function content(): Content
    {
        return new Content(
            markdown: 'emails.cart.reminder',
            with: [
                'relance' => $this->relance,
                'recoverUrl' => $this->recoverUrl,
                'panier' => $this->relance->abandonPanier->panier,
            ]
        );
    }

    /**
     * Get the attachments for the message.
     */
    public function attachments(): array
    {
        return [];
    }
}
