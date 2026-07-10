<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Support\Str;

class Commande extends Model
{
    use HasFactory, SoftDeletes;
    use HasUuids;

    protected static function boot()
    {
        parent::boot();

        static::creating(function ($model) {
            if (! $model->statut) {
                $model->statut = self::STATUT_EN_ATTENTE;
            }
        });
    }

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

    protected $fillable = [
        'client_id',
        'panier_id',
        'adresse_facturation_id',
        'adresse_livraison_id',
        'numero_commande',
        'statut',
        'sous_total',
        'taxe',
        'frais_livraison',
        'total',
        'mode_paiement',
        'notes',
        'date_commande',
        'date_paiement',
        'date_expedition',
        'date_livraison',
        'metadata',
    ];

    protected $casts = [
        'metadata' => 'array',
        'sous_total' => 'decimal:2',
        'taxe' => 'decimal:2',
        'frais_livraison' => 'decimal:2',
        'total' => 'decimal:2',
        'date_commande' => 'datetime',
        'date_paiement' => 'datetime',
        'date_expedition' => 'datetime',
        'date_livraison' => 'datetime',
    ];

    const STATUT_EN_ATTENTE = 'en_attente';

    const STATUT_PAYEE = 'payee';

    const STATUT_EN_PREPARATION = 'en_preparation';

    const STATUT_EXPEDIEE = 'expediee';

    const STATUT_LIVREE = 'livree';

    const STATUT_ANNULEE = 'annulee';

    const STATUT_REMBOURSEE = 'remboursee';

    const STATUT_ECHEC_PAIEMENT = 'echec_paiement';

    const STATUT_TERMINEE = 'termine';

    const STATUT_EN_COURS = 'en_cours';

    const STATUT_REJETEE = 'rejete';

    public static function getStatuts(): array
    {
        return [
            self::STATUT_EN_ATTENTE => 'En attente',
            self::STATUT_PAYEE => 'Payée',
            self::STATUT_EN_PREPARATION => 'En préparation',
            self::STATUT_EXPEDIEE => 'Expédiée',
            self::STATUT_LIVREE => 'Livrée',
            self::STATUT_ANNULEE => 'Annulée',
            self::STATUT_REMBOURSEE => 'Remboursée',
            self::STATUT_ECHEC_PAIEMENT => 'Echec paiement',
            self::STATUT_TERMINEE => 'Terminée',
            self::STATUT_EN_COURS => 'En cours',
            self::STATUT_REJETEE => 'Rejetée',
        ];
    }

    /**
     * Relations
     */
    public function deliveryTracking(): HasOne
    {
        return $this->hasOne(DeliveryTracking::class, 'commande_id');
    }

    public function client(): BelongsTo
    {
        return $this->belongsTo(Client::class);
    }

    public function panier(): BelongsTo
    {
        return $this->belongsTo(Panier::class);
    }

    public function adresseFacturation(): BelongsTo
    {
        return $this->belongsTo(Adresse::class, 'adresse_facturation_id');
    }

    public function adresseLivraison(): BelongsTo
    {
        return $this->belongsTo(Adresse::class, 'adresse_livraison_id');
    }

    public function lignes(): HasMany
    {
        return $this->hasMany(LigneCommande::class);
    }

    public function paiements(): HasMany
    {
        return $this->hasMany(Paiement::class);
    }

    /**
     * Accessors
     */
    public function getLibelleStatutAttribute(): string
    {
        return self::getStatuts()[$this->statut] ?? $this->statut;
    }

    public function getTotalPayeAttribute(): float
    {
        return $this->paiements()->where('statut', 'valide')->sum('montant');
    }

    public function getMontantRestantAttribute(): float
    {
        return max(0, $this->total - $this->total_paye);
    }

    /**
     * Méthodes métier
     */
    public function marquerPayee(): void
    {
        $this->statut = self::STATUT_PAYEE;
        $this->date_paiement = now();
        $this->save();
    }

    public function marquerExpediee(): void
    {
        $this->statut = self::STATUT_EXPEDIEE;
        $this->date_expedition = now();
        $this->save();
    }

    public function marquerLivree(): void
    {
        $this->statut = self::STATUT_LIVREE;
        $this->date_livraison = now();
        $this->save();
    }

    public function annuler(): void
    {
        $this->statut = self::STATUT_ANNULEE;
        $this->save();
    }

    public function enPreparation(): void
    {
        $this->statut = self::STATUT_EN_PREPARATION;
        $this->save();
    }

    public function remboursee(): void
    {
        $this->statut = self::STATUT_REMBOURSEE;
        $this->save();
    }

    public function terminee(): void
    {
        $this->statut = self::STATUT_TERMINEE;
        $this->save();
    }

    public function rejetee(): void
    {
        $this->statut = self::STATUT_REJETEE;
        $this->save();
    }

    public function enCours(): void
    {
        $this->statut = self::STATUT_EN_COURS;
        $this->save();
    }

    protected static function booted(): void
    {
        static::updated(function (Commande $commande) {
            // Vérifier que le statut vient de passer à 'expediee' et qu'aucun suivi n'existe déjà
            if ($commande->wasChanged('statut') && $commande->statut === self::STATUT_EXPEDIEE) {
                if ($commande->deliveryTracking()->exists()) {
                    return;
                }

                $tracking = $commande->deliveryTracking()->create([
                    'tracking_number' => 'TRK-'.strtoupper(Str::random(8)),
                    'carrier' => 'DHL', // à adapter selon le transporteur
                    'status' => 'pickup',
                ]);

                $tracking->addEvent(
                    'status_change',
                    'Commande expédiée',
                    'Votre commande a été confiée au transporteur',
                    null
                );
            }
        });
    }
}
