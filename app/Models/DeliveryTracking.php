<?php

namespace App\Models;

use App\Events\DeliveryTrackingUpdated;
use App\Notifications\DeliveryUpdateNotification;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;

class DeliveryTracking extends Model
{
    /** @use HasFactory<DeliveryTrackingFactory> */
    use HasFactory;

    use HasUuids, SoftDeletes;

    protected $fillable = [
        'commande_id', 'tracking_number', 'carrier', 'status',
        'current_location', 'route_geometry', 'estimated_delivery_at',
    ];

    protected $casts = [
        'current_location' => 'array',
        'route_geometry' => 'array',
        'estimated_delivery_at' => 'datetime',
    ];

    public function commande(): BelongsTo
    {
        return $this->belongsTo(Commande::class);
    }

    public function events(): HasMany
    {
        return $this->hasMany(DeliveryEvent::class);
    }

    /**
     * Ajoute un événement de suivi et diffuse la mise à jour.
     */
    public function addEvent(
        string $type,
        string $title,
        ?string $description = null,
        ?array $location = null,
        ?array $metadata = null
    ): DeliveryEvent {
        $event = $this->events()->create([
            'type' => $type,
            'title' => $title,
            'description' => $description,
            'location' => $location,
            'metadata' => $metadata,
            'occurred_at' => now(),
        ]);

        // Mettre à jour la localisation courante si fournie
        $updates = [];
        if ($location) {
            $updates['current_location'] = $location;
        }

        // Mettre à jour le statut du tracking si c'est une étape de base (ex: pickup, in_transit, out_for_delivery, delivered)
        if (in_array($type, ['pickup', 'in_transit', 'out_for_delivery', 'delivered'])) {
            $updates['status'] = $type;
        }

        if (! empty($updates)) {
            $this->update($updates);
        }

        // Si l'événement est 'delivered', synchroniser la commande en statut Livrée
        if ($type === 'delivered' && $this->commande && $this->commande->statut !== Commande::STATUT_LIVREE) {
            $this->commande->marquerLivree();
        }

        // Diffuser l'événement temps réel
        broadcast(new DeliveryTrackingUpdated($this->commande_id, $event, $this->fresh()))->toOthers();

        // Notification à l'acheteur (le client de la commande)
        $client = $this->commande->client;
        if ($client && $client->user) {
            $client->user->notify(new DeliveryUpdateNotification($this, $event));
        }

        return $event;
    }
}
