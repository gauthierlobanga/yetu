<?php

namespace App\Models;

use Stancl\Tenancy\Database\Concerns\BelongsToTenant;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class CommentReport extends Model
{
    use BelongsToTenant,HasFactory;
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

    protected $table = 'comment_reports';

    protected $fillable = [
        'tenant_id',
        'comment_id',
        'user_id',
        'reason',
        'details',
        'status',
    ];

    protected $casts = [
        'status' => 'string',
    ];

    const STATUS_PENDING = 'pending';

    const STATUS_REVIEWED = 'reviewed';

    const STATUS_DISMISSED = 'dismissed';

    public function comment(): BelongsTo
    {
        return $this->belongsTo(Comment::class);
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}
