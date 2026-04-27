<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class TypeDocumentLegal extends Model
{
    use HasUuids;

    protected $table = 'type_documents_legaux';

    protected $fillable = [
        'code',
        'nom',
        'description',
        'autorite_emettrice',
        'est_obligatoire',
        'ordre',
    ];

    protected $casts = [
        'est_obligatoire' => 'boolean',
        'ordre' => 'integer',
    ];

    public function tenants(): BelongsToMany
    {
        return $this->belongsToMany(Tenant::class, 'tenant_documents_legaux')
            ->withPivot([
                'numero_document',
                'date_delivrance',
                'date_expiration',
                'lieu_delivrance',
                'autorite_delivrance',
                'metadata',
                'est_verifie',
                'verifie_le',
                'verifie_par',
            ])
            ->withTimestamps();
    }

    public function scopeObligatoires($query)
    {
        return $query->where('est_obligatoire', true);
    }

    public function scopeOptionnels($query)
    {
        return $query->where('est_obligatoire', false);
    }
}
