<?php

// app/Models/PlanAbonnement.php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;

class PlanAbonnement extends Model
{
    use HasUuids,SoftDeletes;

    /**
     * Indique que les clés primaires sont de type string (UUID)
     *
     * @var string
     */
    protected $keyType = 'string';

    /**
     * Indique que les clés primaires ne sont pas auto-incrémentées
     *
     * @var bool
     */
    public $incrementing = false;

    protected $table = 'plan_abonnements';

    protected $fillable = [
        'nom',
        'description',
        'prix_ht',
        'prix_ttc',
        'periodicite',
        'caracteristiques',
        'est_actif',
    ];

    protected function casts(): array
    {
        return [
            'caracteristiques' => 'array',
            'prix_ht' => 'decimal:2',
            'prix_ttc' => 'decimal:2',
            'est_actif' => 'boolean',
            'created_at' => 'datetime',
            'updated_at' => 'datetime',
        ];
    }

    // Constantes
    const PERIODICITE_MOIS = 'mois';

    const PERIODICITE_AN = 'an';

    public static function getPeriodicites(): array
    {
        return [
            self::PERIODICITE_MOIS,
            self::PERIODICITE_AN,
        ];
    }

    // Relations
    public function tenant(): BelongsTo
    {
        return $this->belongsTo(Tenant::class);
    }

    public function abonnements(): HasMany
    {
        return $this->hasMany(Abonnement::class);
    }

    // Accessors
    public function getLibellePeriodiciteAttribute(): string
    {
        return match ($this->periodicite) {
            self::PERIODICITE_MOIS => 'Mensuel',
            self::PERIODICITE_AN => 'Annuel',
            default => $this->periodicite,
        };
    }

    public function getPrixFormatteAttribute(): string
    {
        return number_format($this->prix_ttc, 2).'€';
    }

    public function getPrixMensuelAttribute(): float
    {
        if ($this->periodicite === self::PERIODICITE_AN) {
            return $this->prix_ttc / 12;
        }

        return $this->prix_ttc;
    }

    public function getCaracteristique(string $key, $default = null)
    {
        return data_get($this->caracteristiques, $key, $default);
    }

    // Méthodes utilitaires
    public function activer(): void
    {
        $this->est_actif = true;
        $this->save();
    }

    public function desactiver(): void
    {
        $this->est_actif = false;
        $this->save();
    }

    public function aLaCaracteristique(string $caracteristique): bool
    {
        return in_array($caracteristique, $this->caracteristiques ?? []);
    }

    // Scopes
    public function scopeActifs($query)
    {
        return $query->where('est_actif', true);
    }

    public function scopeParPeriodicite($query, $periodicite)
    {
        return $query->where('periodicite', $periodicite);
    }
}
