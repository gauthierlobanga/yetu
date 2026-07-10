<?php

namespace App\Models;

use Database\Factories\DeliveryEventFactory;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class DeliveryEvent extends Model
{
    /** @use HasFactory<DeliveryEventFactory> */
    use HasFactory;

    protected $fillable = [
        'delivery_tracking_id', 'type', 'title', 'description',
        'location', 'metadata', 'occurred_at',
    ];

    protected $casts = [
        'location' => 'array',
        'metadata' => 'array',
        'occurred_at' => 'datetime',
    ];

    public function tracking(): BelongsTo
    {
        return $this->belongsTo(DeliveryTracking::class, 'delivery_tracking_id');
    }
}
