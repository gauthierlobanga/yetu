<?php

namespace App\Events;

use App\Models\DeliveryEvent;
use App\Models\DeliveryTracking;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class DeliveryTrackingUpdated implements ShouldBroadcast
{
    use Dispatchable, SerializesModels;

    public string $commandeId;

    public DeliveryEvent $event;

    public DeliveryTracking $tracking;

    public function __construct(string $commandeId, DeliveryEvent $event, DeliveryTracking $tracking)
    {
        $this->commandeId = $commandeId;
        $this->event = $event;
        $this->tracking = $tracking;
    }

    public function broadcastOn(): array
    {
        return [
            new PrivateChannel('orders.'.$this->commandeId),
        ];
    }

    public function broadcastAs(): string
    {
        return 'delivery.tracking.updated';
    }

    public function broadcastWith(): array
    {
        return [
            'event' => [
                'id' => $this->event->id,
                'type' => $this->event->type,
                'title' => $this->event->title,
                'description' => $this->event->description,
                'location' => $this->event->location,
                'metadata' => $this->event->metadata,
                'occurred_at' => $this->event->occurred_at->toIso8601String(),
            ],
            'tracking' => [
                'id' => $this->tracking->id,
                'status' => $this->tracking->status,
                'current_location' => $this->tracking->current_location,
                'estimated_delivery_at' => $this->tracking->estimated_delivery_at?->toIso8601String(),
                'carrier' => $this->tracking->carrier,
                'tracking_number' => $this->tracking->tracking_number,
            ],
        ];
    }
}
