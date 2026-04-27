<?php

namespace App\Models;

use Stancl\Tenancy\Database\Concerns\BelongsToTenant;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Model;

class Abonnement extends Model
{
    use BelongsToTenant,HasUuids;

    /**
     * Indique que les clés primaires sont de type string (UUID)
     *
     * @var string
     */
    protected $keyType = 'string';
}
