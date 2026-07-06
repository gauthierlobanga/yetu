<?php

namespace App\Mail;

use App\Models\Produit;
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

    public function __construct(RelancePanier $relance, string $recoverUrl)
    {
        $this->relance = $relance;
        $this->recoverUrl = $recoverUrl;
    }

    public function envelope(): Envelope
    {
        $firstName = $this->relance->abandonPanier->panier->client->prenom ?? 'client';

        return new Envelope(
            subject: "🎁 {$firstName}, vos articles vous attendent – offre spéciale à l’intérieur",
        );
    }

    public function content(): Content
    {
        $panier = $this->relance->abandonPanier->panier;
        $panier->loadMissing([
            'items.produit.media',        // pour les images
            'items.variante',             // caractéristiques (couleur, taille…)
            'client',
        ]);

        // On peut ajouter une recommandation de produit complémentaire si tu le souhaites
        $produitPhare = Produit::published()
            ->inStock()
            ->where('id', '!=', $panier->items->pluck('produit_id'))
            ->inRandomOrder()
            ->first();

        return new Content(
            view: 'emails.cart.reminder',
            with: [
                'relance' => $this->relance,
                'recoverUrl' => $this->recoverUrl,
                'panier' => $panier,
                'produitPhare' => $produitPhare,   // nouveauté : cross-sell
            ]
        );
    }

    public function attachments(): array
    {
        return [];
    }
}
// namespace App\Mail;

// use App\Models\RelancePanier;
// use Illuminate\Bus\Queueable;
// use Illuminate\Contracts\Queue\ShouldQueue;
// use Illuminate\Mail\Mailable;
// use Illuminate\Mail\Mailables\Content;
// use Illuminate\Mail\Mailables\Envelope;
// use Illuminate\Queue\SerializesModels;

// class CartReminderMail extends Mailable implements ShouldQueue
// {
//     use Queueable, SerializesModels;

//     public RelancePanier $relance;

//     public string $recoverUrl;

//     /**
//      * Create a new message instance.
//      */
//     public function __construct(RelancePanier $relance, string $recoverUrl)
//     {
//         $this->relance = $relance;
//         $this->recoverUrl = $recoverUrl;
//     }

//     /**
//      * Get the message envelope.
//      */
//     public function envelope(): Envelope
//     {
//         return new Envelope(
//             subject: 'N\'oubliez pas votre panier !',
//         );
//     }

//     /**
//      * Get the message content definition.
//      */
//     public function content(): Content
//     {
//         return new Content(
//             markdown: 'emails.cart.reminder',
//             with: [
//                 'relance' => $this->relance,
//                 'recoverUrl' => $this->recoverUrl,
//                 'panier' => $this->relance->abandonPanier->panier,
//             ]
//         );
//     }

//     /**
//      * Get the attachments for the message.
//      */
//     public function attachments(): array
//     {
//         return [];
//     }
// }
