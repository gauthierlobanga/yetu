<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Stancl\Tenancy\Database\Concerns\CentralConnection;

class CookieConsent extends Model
{
    use CentralConnection, HasUuids;

    protected $table = 'public.cookie_consents';

    protected $fillable = [
        'tenant_id',
        'ip_address',
        'user_id',
        'session_id',
        'preferences',
        'user_agent',
    ];

    protected $casts = [
        'preferences' => 'array',
    ];

    public function tenant(): BelongsTo
    {
        return $this->belongsTo(Tenant::class);
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}
