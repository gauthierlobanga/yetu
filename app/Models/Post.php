<?php

namespace App\Models;

use App\Traits\HasComments;
use Carbon\Carbon;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Str;
use Spatie\Image\Enums\Fit;
use Spatie\MediaLibrary\HasMedia;
use Spatie\MediaLibrary\InteractsWithMedia;
use Spatie\MediaLibrary\MediaCollections\Models\Media;
use Spatie\Tags\HasTags;

#[Fillable([
    'user_id',
    'title',
    'slug',
    'excerpt',
    'content',
    'embedding',
    'featured_image',
    'status',
    'is_pinned',
    'views_count',
    'likes_count',
    'comments_count',
    'reading_time_minutes',
    'meta_title',
    'meta_description',
    'meta_keywords',
    'published_at',
    'scheduled_for',
    'expires_at',
    'order',
])]
class Post extends Model implements HasMedia
{
    use HasComments, HasFactory, HasTags, InteractsWithMedia , SoftDeletes;
    use HasUuids;

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

    protected function casts(): array
    {
        return [
            // 'embedding' => 'array',
            'content' => 'array',
            'excerpt' => 'array',
            'meta_keywords' => 'array',
            'is_pinned' => 'boolean',
            'views_count' => 'integer',
            'likes_count' => 'integer',
            'comments_count' => 'integer',
            'reading_time_minutes' => 'integer',
            'published_at' => 'datetime',
            'scheduled_for' => 'datetime',
            'expires_at' => 'datetime',
            'created_at' => 'datetime',
            'updated_at' => 'datetime',
            'deleted_at' => 'datetime',
        ];
    }

    // Constantes de statut
    public const string STATUS_DRAFT = 'draft';

    public const string STATUS_PUBLISHED = 'published';

    public const string STATUS_SCHEDULED = 'scheduled';

    public const string STATUS_EXPIRED = 'expired';

    public const string STATUS_ARCHIVED = 'archived';

    // Tailles d'images optimisées
    private const array IMAGE_SIZES = [
        'thumb' => ['width' => 150, 'height' => 150, 'fit' => Fit::Crop],
        'card' => ['width' => 400, 'height' => 300, 'fit' => Fit::Crop],
        'small' => ['width' => 600, 'height' => 400, 'fit' => Fit::Contain],
        'medium' => ['width' => 1200, 'height' => 800, 'fit' => Fit::Contain],
        'large' => ['width' => 1920, 'height' => 1080, 'fit' => Fit::Max],
    ];

    public static function getStatuses(): array
    {
        return [
            self::STATUS_DRAFT => 'Brouillon',
            self::STATUS_PUBLISHED => 'Publié',
            self::STATUS_SCHEDULED => 'Programmé',
            self::STATUS_EXPIRED => 'Expiré',
            self::STATUS_ARCHIVED => 'Archivé',
        ];
    }

    // ========== RELATIONS ==========

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function categories(): BelongsToMany
    {
        return $this->belongsToMany(PostCategory::class, 'posts_categories_pivot')
            ->using(PostCategoryPivot::class)
            ->withPivot('id', 'is_primary', 'est_principale', 'order')
            ->withTimestamps()
            ->orderByPivot('order');
    }

    public function categoriePrincipale()
    {
        return $this->belongsToMany(PostCategory::class, 'posts_categories_pivot')
            ->wherePivot('est_principale', true)
            ->first();
    }

    public function primaryCategory()
    {
        return $this->belongsToMany(PostCategory::class, 'posts_categories_pivot')
            ->wherePivot('is_primary', true)
            ->first();
    }

    // ========== MEDIA CONFIGURATION ==========

    public function registerMediaCollections(): void
    {
        // Collection principale pour l'image à la une
        $this->addMediaCollection('featured')
            ->singleFile()
            ->useDisk('public')
            ->acceptsMimeTypes(['image/jpeg', 'image/png', 'image/webp'])
            ->withResponsiveImages();

        // Collection pour la galerie
        $this->addMediaCollection('gallery')
            ->useDisk('public')
            ->acceptsMimeTypes(['image/jpeg', 'image/png', 'image/webp'])
            ->withResponsiveImages();

        // Collection pour les fichiers joints
        $this->addMediaCollection('attachments')
            ->useDisk('public')
            ->acceptsMimeTypes([
                'application/pdf',
                'application/msword',
                'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
                'text/plain',
            ]);
    }

    public function registerMediaConversions(?Media $media = null): void
    {
        // Conversion pour miniatures
        $this->addMediaConversion('thumb')
            ->width(self::IMAGE_SIZES['thumb']['width'])
            ->height(self::IMAGE_SIZES['thumb']['height'])
            ->fit(self::IMAGE_SIZES['thumb']['fit'], self::IMAGE_SIZES['thumb']['width'], self::IMAGE_SIZES['thumb']['height'])
            ->format('webp')
            ->quality(80)
            ->optimize()
            ->nonQueued()
            ->performOnCollections('featured', 'gallery');

        // Conversion pour les cards (blog, liste produits)
        $this->addMediaConversion('card')
            ->width(self::IMAGE_SIZES['card']['width'])
            ->height(self::IMAGE_SIZES['card']['height'])
            ->fit(self::IMAGE_SIZES['card']['fit'], self::IMAGE_SIZES['card']['width'], self::IMAGE_SIZES['card']['height'])
            ->format('webp')
            ->quality(85)
            ->withResponsiveImages()
            ->optimize()
            ->nonQueued()
            ->performOnCollections('featured');

        // Conversion small - pour aperçus
        $this->addMediaConversion('small')
            ->width(self::IMAGE_SIZES['small']['width'])
            ->height(self::IMAGE_SIZES['small']['height'])
            ->fit(self::IMAGE_SIZES['small']['fit'])
            ->format('webp')
            ->quality(85)
            ->withResponsiveImages()
            ->optimize()
            ->nonQueued()
            ->performOnCollections('featured', 'gallery');

        // Conversion medium - pour l'affichage principal (file d'attente)
        $this->addMediaConversion('medium')
            ->width(self::IMAGE_SIZES['medium']['width'])
            ->height(self::IMAGE_SIZES['medium']['height'])
            ->fit(self::IMAGE_SIZES['medium']['fit'])
            ->format('webp')
            ->quality(90)
            ->withResponsiveImages()
            ->optimize()
            ->queued()
            ->performOnCollections('featured', 'gallery');

        // Conversion large - pour les écrans haute résolution (file d'attente)
        $this->addMediaConversion('large')
            ->width(self::IMAGE_SIZES['large']['width'])
            ->height(self::IMAGE_SIZES['large']['height'])
            ->fit(self::IMAGE_SIZES['large']['fit'])
            ->format('webp')
            ->quality(90)
            ->withResponsiveImages()
            ->optimize()
            ->queued()
            ->performOnCollections('featured', 'gallery');
    }

    // ========== MEDIA ACCESSORS AVEC CACHE ==========

    /**
     * Accessor dynamique pour les différentes conversions
     * Usage: $post->featured_image_thumb, $post->featured_image_card, etc.
     */
    public function __get($key)
    {
        if (str_starts_with($key, 'featured_image_')) {
            $conversion = str_replace('featured_image_', '', $key);
            if (array_key_exists($conversion, self::IMAGE_SIZES)) {
                return $this->getFeaturedImageUrl($conversion);
            }
        }

        return parent::__get($key);
    }

    // ========== MEDIA ACCESSORS AVEC CACHE ==========

    /**
     * Récupère l'URL de l'image à la une avec une conversion spécifique
     * Avec mise en cache pour éviter les appels répétés
     */
    public function getFeaturedImageUrl(string $conversion = 'card'): ?string
    {
        $cacheKey = "post_{$this->id}_featured_image_{$conversion}";

        return Cache::remember($cacheKey, 3600, function () use ($conversion) {
            $media = $this->getFirstMedia('featured');

            if (! $media || ! $media->disk) {
                return null;
            }

            return $this->getMediaUrlSafely($media, $conversion);
        });
    }

    /**
     * Vérifie si un média est valide - Version corrigée
     */
    private function isMediaValid(?Media $media): bool
    {
        if (! $media || ! $media->disk) {
            return false;
        }

        try {
            // Vérifier simplement si le média existe en base et a un disque
            // La méthode getUrl() échouera si le fichier n'existe pas physiquement
            return true;
        } catch (\Exception $e) {
            Log::warning("Erreur lors de la vérification du média {$media->id}: ".$e->getMessage());

            return false;
        }
    }

    /**
     * Récupère l'URL d'un média de manière sécurisée - Version améliorée
     */
    private function getMediaUrlSafely(Media $media, string $conversion): string
    {
        try {
            // Vérifier si la conversion existe et est générée
            if ($media->hasGeneratedConversion($conversion)) {
                return $media->getUrl($conversion);
            }

            // Fallback: retourner l'original si conversion inexistante
            if (! $media->getUrl()) {
                Log::warning("Média {$media->id} sans URL valide");

                return '';
            }

            Log::info("Conversion '{$conversion}' non générée pour le média {$media->id}, utilisation de l'original");

            return $media->getUrl();
        } catch (\Exception $e) {
            Log::error("Erreur lors de la récupération de l'URL du média {$media->id}: ".$e->getMessage());

            return $media->getUrl(); // Fallback sur l'original en cas d'erreur
        }
    }

    /**
     * Récupère tous les médias de la galerie avec leurs URLs optimisées - Version corrigée
     */
    public function getGalleryImagesAttribute(): array
    {
        $cacheKey = "post_{$this->id}_gallery_images";

        return Cache::remember($cacheKey, 3600, function () {
            return $this->getMedia('gallery')->map(function ($media) {
                if (! $media || ! $media->disk) {
                    Log::warning("Média galerie invalide pour le post {$this->id}, media_id: {$media->id}");

                    return null;
                }

                try {
                    return [
                        'id' => $media->id,
                        'url' => $media->getUrl(),
                        'thumb' => $media->hasGeneratedConversion('thumb') ? $media->getUrl('thumb') : $media->getUrl(),
                        'small' => $media->hasGeneratedConversion('small') ? $media->getUrl('small') : $media->getUrl(),
                        'medium' => $media->hasGeneratedConversion('medium') ? $media->getUrl('medium') : $media->getUrl(),
                        'large' => $media->hasGeneratedConversion('large') ? $media->getUrl('large') : $media->getUrl(),
                        'name' => $media->name,
                        'size' => $media->size,
                        'mime_type' => $media->mime_type,
                        'alt_text' => $media->getCustomProperty('alt_text', $this->title),
                    ];
                } catch (\Exception $e) {
                    Log::error("Erreur galerie pour media {$media->id}: ".$e->getMessage());

                    return null;
                }
            })->filter()->values()->toArray();
        });
    }

    /**
     * Récupère l'URL de l'image à la une avec une conversion spécifique
     * Avec mise en cache pour éviter les appels répétés
     * Version améliorée avec plus de logs et de vérifications
     */
    public function getFeaturedImageUrlAttribute(): ?string
    {
        try {
            $media = $this->getFirstMedia('featured');

            // AJOUT DE LA VÉRIFICATION DU DISQUE ICI
            if (! $media || ! $media->disk) {
                Log::info('No media or disk found for post: '.$this->id);

                return null;
            }

            // Vérifier si la conversion existe
            $hasMedium = $media->hasGeneratedConversion('medium');
            Log::info('Has medium conversion: '.($hasMedium ? 'yes' : 'no'));

            if ($hasMedium) {
                $url = $media->getUrl('medium');
            } else {
                $url = $media->getUrl(); // L'erreur 500 se déclenchait ici
            }

            Log::info('Generated URL: '.$url);

            return $url;
        } catch (\Exception $e) {
            Log::error('Error in getFeaturedImageUrlAttribute: '.$e->getMessage());

            return null;
        }
    }

    public function getFeaturedImageDetailAttribute(): ?string
    {
        $media = $this->getFirstMedia('featured');

        // AJOUT DE LA MÊME VÉRIFICATION ICI
        if (! $media || ! $media->disk) {
            return null;
        }

        return $media->hasGeneratedConversion('large')
            ? $media->getUrl('large')
            : $media->getUrl();
    }

    public function getFeaturedImageCardAttribute(): ?string
    {
        $media = $this->getFirstMedia('featured');

        if (! $media || ! $media->disk) {
            return null;
        }

        return $media->hasGeneratedConversion('card')
            ? $media->getUrl('card')
            : $media->getUrl();
    }

    /**
     * Invalide le cache des images après mise à jour des médias
     */
    public function clearMediaCache(): void
    {
        Cache::forget("post_{$this->id}_featured_image_card");
        Cache::forget("post_{$this->id}_gallery_images");

        foreach (array_keys(self::IMAGE_SIZES) as $conversion) {
            Cache::forget("post_{$this->id}_featured_image_{$conversion}");
        }
    }

    // ========== ACCESSORS EXISTANTS AMÉLIORÉS ==========

    public function getReadingTimeAttribute(): int
    {
        if ($this->reading_time_minutes) {
            return $this->reading_time_minutes;
        }
        $words = str_word_count(strip_tags($this->content ?? ''));

        return (int) ceil($words / 200);
    }

    public function getUrlAttribute(): string
    {
        return route('posts.show', $this->slug);
    }

    public function getUrlBlogAttribute(): string
    {
        return route('blog.show', $this->slug);
    }

    public function getStatusLabelAttribute(): string
    {
        return self::getStatuses()[$this->status] ?? $this->status;
    }

    public function getStatusColorAttribute(): string
    {
        return match ($this->status) {
            self::STATUS_DRAFT => 'gray',
            self::STATUS_PUBLISHED => 'green',
            self::STATUS_SCHEDULED => 'yellow',
            self::STATUS_EXPIRED => 'red',
            self::STATUS_ARCHIVED => 'gray',
            default => 'gray',
        };
    }

    public function getIsPublishedAttribute(): bool
    {
        return $this->status === self::STATUS_PUBLISHED &&
            $this->published_at &&
            $this->published_at->isPast() &&
            (! $this->expires_at || $this->expires_at->isFuture());
    }

    public function getIsScheduledAttribute(): bool
    {
        return $this->status === self::STATUS_SCHEDULED ||
            ($this->scheduled_for && $this->scheduled_for->isFuture());
    }

    public function getIsExpiredAttribute(): bool
    {
        return $this->expires_at && $this->expires_at->isPast();
    }

    public function getMetaTitleAttribute($value): string
    {
        return $value ?? $this->title;
    }

    public function getMetaDescriptionAttribute($value): string
    {
        return $value ?? $this->excerpt;
    }

    public function getExcerptAttribute()
    {
        $content = is_array($this->content)
            ? json_encode($this->content)
            : $this->content;

        return Str::limit(strip_tags($content), 120);
    }

    public function getContentTextAttribute()
    {
        $content = is_array($this->content)
            ? json_encode($this->content)
            : $this->content;

        return Str::limit(strip_tags($content), 120);
    }

    public function getRouteKeyName()
    {
        return 'slug';
    }

    // ========== SCOPES ==========

    public function scopePublished($query)
    {
        return $query->where('status', self::STATUS_PUBLISHED)
            ->where('published_at', '<=', now())
            ->where(function ($q) {
                $q->whereNull('expires_at')
                    ->orWhere('expires_at', '>', now());
            });
    }

    public function scopeDraft($query)
    {
        return $query->where('status', self::STATUS_DRAFT);
    }

    public function scopeScheduled($query)
    {
        return $query->where('status', self::STATUS_SCHEDULED)
            ->orWhere('scheduled_for', '>', now());
    }

    public function scopeExpired($query)
    {
        return $query->where('expires_at', '<=', now());
    }

    public function scopePinned($query)
    {
        return $query->where('is_pinned', true);
    }

    public function scopeByUser($query, $userId)
    {
        return $query->where('user_id', $userId);
    }

    public function scopeByCategory($query, $categoryId)
    {
        return $query->whereHas('categories', fn ($q) => $q->where('posts_categories.id', $categoryId));
    }

    public function scopeSearch($query, string $term)
    {
        return $query->whereFullText(['title', 'content'], $term);
    }

    public function scopePopular($query)
    {
        return $query->orderBy('views_count', 'desc');
    }

    public function scopeRecent($query)
    {
        return $query->orderBy('published_at', 'desc');
    }

    public function scopeBetweenDates($query, $start, $end)
    {
        return $query->whereBetween('published_at', [$start, $end]);
    }

    // ========== MÉTHODES PUBLIQUES ==========

    public function publish(): void
    {
        $this->status = self::STATUS_PUBLISHED;
        $this->published_at = now();
        $this->scheduled_for = null;
        $this->save();
        $this->clearMediaCache(); // Nettoyer le cache après modification
    }

    public function schedule(Carbon $date): void
    {
        $this->status = self::STATUS_SCHEDULED;
        $this->scheduled_for = $date;
        $this->save();
        $this->clearMediaCache();
    }

    public function archive(): void
    {
        $this->status = self::STATUS_ARCHIVED;
        $this->save();
        $this->clearMediaCache();
    }

    public function incrementViews(): void
    {
        $this->increment('views_count');
    }

    public function incrementLikes(): void
    {
        $this->increment('likes_count');
    }

    public function decrementLikes(): void
    {
        $this->decrement('likes_count');
    }

    public function incrementComments(): void
    {
        $this->increment('comments_count');
    }

    public function decrementComments(): void
    {
        $this->decrement('comments_count');
    }

    public function hasCategory($categoryId): bool
    {
        return $this->categories()->where('posts_categories.id', $categoryId)->exists();
    }

    public function syncCategories(array $categoryIds, ?int $mainCategoryId = null): void
    {
        $syncData = [];
        foreach ($categoryIds as $index => $categoryId) {
            $syncData[$categoryId] = [
                'is_primary' => $categoryId === $mainCategoryId,
                'order' => $index,
            ];
        }
        $this->categories()->sync($syncData);
    }

    public function getPreviousPublished(): ?self
    {
        if (is_null($this->published_at)) {
            return null;
        }

        return self::published()
            ->where('published_at', '<', $this->published_at)
            ->orderBy('published_at', 'desc')
            ->first();
    }

    public function getNextPublished(): ?self
    {
        if (is_null($this->published_at)) {
            return null;
        }

        return self::published()
            ->where('published_at', '>', $this->published_at)
            ->orderBy('published_at', 'asc')
            ->first();
    }

    public function getRelatedPosts(int $limit = 3)
    {
        $categoryIds = $this->categories()->pluck('posts_categories.id');

        if ($categoryIds->isEmpty()) {
            return collect();
        }

        return self::published()
            ->where('id', '!=', $this->id)
            ->whereHas('categories', fn ($q) => $q->whereIn('posts_categories.id', $categoryIds))
            ->orderBy('published_at', 'desc')
            ->limit($limit)
            ->get();
    }

    // ========== BOOT ==========

    protected static function boot()
    {
        parent::boot();

        static::creating(function ($post) {
            if (empty($post->slug)) {
                $post->slug = Str::slug($post->title);
            }
            if (empty($post->reading_time_minutes)) {
                $post->reading_time_minutes = $post->reading_time;
            }
            if (empty($post->excerpt)) {
                $post->excerpt = Str::limit(strip_tags($post->content ?? ''), 150);
            }
        });

        static::updating(function ($post) {
            if ($post->isDirty('content') && empty($post->reading_time_minutes)) {
                $post->reading_time_minutes = $post->reading_time;
            }
        });

        // Nettoyer le cache après suppression
        static::deleted(function ($post) {
            $post->clearMediaCache();
        });
    }
}
