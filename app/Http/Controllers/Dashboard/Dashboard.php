<?php

namespace App\Http\Controllers\Dashboard;

use App\Http\Controllers\Controller;
use App\Http\Resources\PostResource;
use App\Models\Post;
use App\Models\PostCategory;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

class DashboardController extends Controller
{
    public function index(Request $request)
    {
        $user = Auth::user();
        $isSuperAdmin = $user->hasRole('super_admin');

        // Appliquer les filtres de date à la requête principale
        $query = Post::with(['user', 'categories', 'media', 'tags']);

        // Si ce n'est pas un super admin, filtrer par ses propres posts
        if (! $isSuperAdmin) {
            $query->where('user_id', $user->id);
        }

        $query = $this->applyDateFilters($query, $request, 'posts');

        // Filtrage par recherche
        if ($request->search) {
            $query->where('posts.title', 'like', '%'.$request->search.'%');
        }

        // Filtrage par statut
        if ($request->status && $request->status !== 'all') {
            $query->where('posts.status', $request->status);
        }

        // Filtrage par catégorie (si fourni)
        if ($request->category_id) {
            $query->whereHas('categories', function ($q) use ($request) {
                $q->where('posts_categories.id', $request->category_id);
            });
        }

        // Filtrage par auteur (seulement pour super admin)
        if ($isSuperAdmin && $request->author_id) {
            $query->where('user_id', $request->author_id);
        }

        // Tri
        if ($request->sort) {
            $direction = $request->direction ?? 'desc';
            $query->orderBy('posts.'.$request->sort, $direction);
        } else {
            $query->latest('posts.created_at');
        }

        $paginatedPosts = $query->paginate($request->per_page ?? 10);

        $posts = [
            'data' => PostResource::collection($paginatedPosts->items())->toArray($request),
            'current_page' => $paginatedPosts->currentPage(),
            'last_page' => $paginatedPosts->lastPage(),
            'from' => $paginatedPosts->firstItem(),
            'to' => $paginatedPosts->lastItem(),
            'total' => $paginatedPosts->total(),
            'per_page' => $paginatedPosts->perPage(),
        ];

        // ==================== 1. STATISTIQUES DES POSTS PAR STATUT ====================
        $postsStatusQuery = Post::select('status', DB::raw('count(*) as count'))
            ->groupBy('status');

        if (! $isSuperAdmin) {
            $postsStatusQuery->where('user_id', $user->id);
        }

        $postsStatusQuery = $this->applyDateFilters($postsStatusQuery, $request, 'posts');

        if ($request->status && $request->status !== 'all') {
            $postsStatusQuery->where('posts.status', $request->status);
        }

        if ($request->category_id) {
            $postsStatusQuery->whereHas('categories', function ($q) use ($request) {
                $q->where('posts_categories.id', $request->category_id);
            });
        }

        if ($isSuperAdmin && $request->author_id) {
            $postsStatusQuery->where('user_id', $request->author_id);
        }

        $postsStatusStats = $postsStatusQuery->get()
            ->map(fn ($item) => [
                'status' => $item->status,
                'status_label' => $item->status_label,
                'count' => (int) $item->count,
                'fill' => match ($item->status) {
                    'published' => 'var(--chart-1)',
                    'draft' => 'var(--chart-2)',
                    'scheduled' => 'var(--chart-3)',
                    'archived' => 'var(--chart-4)',
                    'expired' => 'var(--chart-5)',
                    default => 'var(--chart-1)',
                },
            ])
            ->toArray();

        // ==================== 2. STATISTIQUES DES CATÉGORIES ====================
        $categoriesStatsQuery = PostCategory::whereHas('posts', function ($query) use ($request, $isSuperAdmin, $user) {
            if (! $isSuperAdmin) {
                $query->where('user_id', $user->id);
            }
            $query = $this->applyDateFilters($query, $request, 'posts');
            if ($request->status && $request->status !== 'all') {
                $query->where('posts.status', $request->status);
            }
            if ($request->category_id) {
                $query->whereHas('categories', function ($q) use ($request) {
                    $q->where('posts_categories.id', $request->category_id);
                });
            }
            if ($isSuperAdmin && $request->author_id) {
                $query->where('user_id', $request->author_id);
            }
        })
            ->withCount(['posts' => function ($query) use ($request, $isSuperAdmin, $user) {
                if (! $isSuperAdmin) {
                    $query->where('user_id', $user->id);
                }
                $query = $this->applyDateFilters($query, $request, 'posts');
                if ($request->status && $request->status !== 'all') {
                    $query->where('posts.status', $request->status);
                }
                if ($request->category_id) {
                    $query->whereHas('categories', function ($q) use ($request) {
                        $q->where('posts_categories.id', $request->category_id);
                    });
                }
                if ($isSuperAdmin && $request->author_id) {
                    $query->where('user_id', $request->author_id);
                }
            }])
            ->orderBy('posts_count', 'desc');

        $categoriesStats = $categoriesStatsQuery->get()
            ->map(fn ($category) => [
                'id' => $category->id,
                'nom' => $category->nom,
                'slug' => $category->slug,
                'color' => $category->color,
                'posts_count' => $category->posts_count,
            ])
            ->toArray();

        // ==================== 3. TOP 10 DES ARTICLES ====================
        $topPostsQuery = Post::with(['user'])
            ->where('posts.status', 'published')
            ->orderBy('posts.views_count', 'desc')
            ->limit(10);

        if (! $isSuperAdmin) {
            $topPostsQuery->where('user_id', $user->id);
        }

        $topPostsQuery = $this->applyDateFilters($topPostsQuery, $request, 'posts');

        if ($request->category_id) {
            $topPostsQuery->whereHas('categories', function ($q) use ($request) {
                $q->where('posts_categories.id', $request->category_id);
            });
        }

        if ($isSuperAdmin && $request->author_id) {
            $topPostsQuery->where('user_id', $request->author_id);
        }

        $topPosts = $topPostsQuery->get()
            ->map(fn ($post) => [
                'id' => $post->id,
                'title' => $post->title,
                'slug' => $post->slug,
                'views_count' => $post->views_count,
                'likes_count' => $post->likes_count,
                'comments_count' => $post->comments_count,
                'user' => [
                    'id' => $post->user->id,
                    'name' => $post->user->name,
                    'email' => $post->user->email,
                    'avatar_url' => $post->user->avatar_url,
                ],
                'published_at' => $post->published_at?->format('Y-m-d'),
            ])
            ->toArray();

        // ==================== 4. TOP CONTRIBUTEURS ====================
        $topAuthors = [];
        if ($isSuperAdmin) {
            $topAuthorsQuery = User::whereHas('posts', function ($query) use ($request) {
                $query = $this->applyDateFilters($query, $request, 'posts');
                if ($request->status && $request->status !== 'all') {
                    $query->where('posts.status', $request->status);
                }
                if ($request->category_id) {
                    $query->whereHas('categories', function ($q) use ($request) {
                        $q->where('posts_categories.id', $request->category_id);
                    });
                }
            })
                ->withCount(['posts' => function ($query) use ($request) {
                    $query = $this->applyDateFilters($query, $request, 'posts');
                    if ($request->status && $request->status !== 'all') {
                        $query->where('posts.status', $request->status);
                    }
                    if ($request->category_id) {
                        $query->whereHas('categories', function ($q) use ($request) {
                            $q->where('posts_categories.id', $request->category_id);
                        });
                    }
                }])
                ->withSum(['posts' => function ($query) use ($request) {
                    $query = $this->applyDateFilters($query, $request, 'posts');
                    if ($request->status && $request->status !== 'all') {
                        $query->where('posts.status', $request->status);
                    }
                    if ($request->category_id) {
                        $query->whereHas('categories', function ($q) use ($request) {
                            $q->where('posts_categories.id', $request->category_id);
                        });
                    }
                }], 'views_count')
                ->orderBy('posts_count', 'desc')
                ->limit(10);

            $topAuthors = $topAuthorsQuery->get()
                ->map(fn ($user) => [
                    'id' => $user->id,
                    'name' => $user->name,
                    'avatar_url' => $user->avatar_url,
                    'posts_count' => $user->posts_count,
                    'total_views' => $user->posts_sum_views_count ?? 0,
                ]);
        }

        // ==================== 5. TAUX D'ENGAGEMENT ====================
        $engagementQuery = Post::where('posts.status', 'published')
            ->selectRaw('AVG((posts.likes_count + posts.comments_count) / NULLIF(posts.views_count, 0) * 100) as avg_engagement')
            ->selectRaw('MAX((posts.likes_count + posts.comments_count) / NULLIF(posts.views_count, 0) * 100) as max_engagement');

        if (! $isSuperAdmin) {
            $engagementQuery->where('user_id', $user->id);
        }

        $engagementQuery = $this->applyDateFilters($engagementQuery, $request, 'posts');

        if ($request->category_id) {
            $engagementQuery->whereHas('categories', function ($q) use ($request) {
                $q->where('posts_categories.id', $request->category_id);
            });
        }

        if ($isSuperAdmin && $request->author_id) {
            $engagementQuery->where('user_id', $request->author_id);
        }

        $engagementStats = $engagementQuery->first();

        // ==================== 6. ARTICLES PROGRAMMÉS ====================
        $scheduledQuery = Post::where('posts.status', 'scheduled')
            ->where('posts.scheduled_for', '>=', now())
            ->where('posts.scheduled_for', '<=', now()->addDays(30))
            ->orderBy('posts.scheduled_for');

        if (! $isSuperAdmin) {
            $scheduledQuery->where('user_id', $user->id);
        }

        $scheduledQuery = $this->applyDateFilters($scheduledQuery, $request, 'posts');

        if ($request->category_id) {
            $scheduledQuery->whereHas('categories', function ($q) use ($request) {
                $q->where('posts_categories.id', $request->category_id);
            });
        }

        if ($isSuperAdmin && $request->author_id) {
            $scheduledQuery->where('user_id', $request->author_id);
        }

        $scheduledPosts = $scheduledQuery->get()
            ->map(fn ($post) => [
                'id' => $post->id,
                'title' => $post->title,
                'slug' => $post->slug,
                'scheduled_for' => $post->scheduled_for,
            ]);

        // ==================== 7. BROUILLONS ANCIENS ====================
        $oldDraftsQuery = Post::where('posts.status', 'draft')
            ->where('posts.updated_at', '<=', now()->subDays(30));

        if (! $isSuperAdmin) {
            $oldDraftsQuery->where('user_id', $user->id);
        }

        $oldDraftsQuery = $this->applyDateFilters($oldDraftsQuery, $request, 'posts');

        if ($request->category_id) {
            $oldDraftsQuery->whereHas('categories', function ($q) use ($request) {
                $q->where('posts_categories.id', $request->category_id);
            });
        }

        if ($isSuperAdmin && $request->author_id) {
            $oldDraftsQuery->where('user_id', $request->author_id);
        }

        $oldDraftsCount = $oldDraftsQuery->count();

        // ==================== 8. ACTIVITÉ PAR JOUR ====================
        $weeklyQuery = Post::selectRaw('EXTRACT(DOW FROM posts.created_at) as day_num, COUNT(*) as count')
            ->where('posts.status', 'published')
            ->groupBy('day_num')
            ->orderBy('day_num');

        if (! $isSuperAdmin) {
            $weeklyQuery->where('user_id', $user->id);
        }

        $weeklyQuery = $this->applyDateFilters($weeklyQuery, $request, 'posts');

        if ($request->category_id) {
            $weeklyQuery->whereHas('categories', function ($q) use ($request) {
                $q->where('posts_categories.id', $request->category_id);
            });
        }

        if ($isSuperAdmin && $request->author_id) {
            $weeklyQuery->where('user_id', $request->author_id);
        }

        $weeklyActivity = $weeklyQuery->get()
            ->map(fn ($item) => [
                'day' => $this->translateDayNumber((int) $item->day_num),
                'count' => (int) $item->count,
            ]);

        // ==================== 9. PUBLICATIONS PAR MOIS ====================
        $monthlyQuery = Post::selectRaw('EXTRACT(MONTH FROM posts.created_at) as month, COUNT(*) as count')
            ->where('posts.status', 'published')
            ->groupBy('month')
            ->orderBy('month');

        if (! $isSuperAdmin) {
            $monthlyQuery->where('user_id', $user->id);
        }

        $monthlyQuery = $this->applyDateFilters($monthlyQuery, $request, 'posts');

        if ($request->category_id) {
            $monthlyQuery->whereHas('categories', function ($q) use ($request) {
                $q->where('posts_categories.id', $request->category_id);
            });
        }

        if ($isSuperAdmin && $request->author_id) {
            $monthlyQuery->where('user_id', $request->author_id);
        }

        $monthlyPostsStats = $monthlyQuery->get()
            ->map(fn ($item) => [
                'month' => (int) $item->month,
                'month_name' => $this->getMonthName((int) $item->month),
                'count' => (int) $item->count,
            ]);

        // ==================== 10. HEURES DE PUBLICATION ====================
        $hourlyQuery = Post::selectRaw('EXTRACT(HOUR FROM posts.created_at) as hour, COUNT(*) as count')
            ->where('posts.status', 'published')
            ->groupBy('hour')
            ->orderBy('hour');

        if (! $isSuperAdmin) {
            $hourlyQuery->where('user_id', $user->id);
        }

        $hourlyQuery = $this->applyDateFilters($hourlyQuery, $request, 'posts');

        if ($request->category_id) {
            $hourlyQuery->whereHas('categories', function ($q) use ($request) {
                $q->where('posts_categories.id', $request->category_id);
            });
        }

        if ($isSuperAdmin && $request->author_id) {
            $hourlyQuery->where('user_id', $request->author_id);
        }

        $hourlyPostsStats = $hourlyQuery->get()
            ->map(fn ($item) => [
                'hour' => (int) $item->hour,
                'count' => (int) $item->count,
            ]);

        // ==================== 11. PERFORMANCE DES CATÉGORIES ====================
        $categoryPerformanceQuery = PostCategory::whereHas('posts', function ($query) use ($request, $isSuperAdmin, $user) {
            if (! $isSuperAdmin) {
                $query->where('user_id', $user->id);
            }
            $query = $this->applyDateFilters($query, $request, 'posts');
            if ($request->status && $request->status !== 'all') {
                $query->where('posts.status', $request->status);
            }
            if ($request->category_id) {
                $query->whereHas('categories', function ($q) use ($request) {
                    $q->where('posts_categories.id', $request->category_id);
                });
            }
            if ($isSuperAdmin && $request->author_id) {
                $query->where('user_id', $request->author_id);
            }
        })
            ->withCount(['posts' => function ($query) use ($request, $isSuperAdmin, $user) {
                if (! $isSuperAdmin) {
                    $query->where('user_id', $user->id);
                }
                $query = $this->applyDateFilters($query, $request, 'posts');
                if ($request->status && $request->status !== 'all') {
                    $query->where('posts.status', $request->status);
                }
                if ($request->category_id) {
                    $query->whereHas('categories', function ($q) use ($request) {
                        $q->where('posts_categories.id', $request->category_id);
                    });
                }
                if ($isSuperAdmin && $request->author_id) {
                    $query->where('user_id', $request->author_id);
                }
            }])
            ->withSum(['posts' => function ($query) use ($request, $isSuperAdmin, $user) {
                if (! $isSuperAdmin) {
                    $query->where('user_id', $user->id);
                }
                $query = $this->applyDateFilters($query, $request, 'posts');
                if ($request->status && $request->status !== 'all') {
                    $query->where('posts.status', $request->status);
                }
                if ($request->category_id) {
                    $query->whereHas('categories', function ($q) use ($request) {
                        $q->where('posts_categories.id', $request->category_id);
                    });
                }
                if ($isSuperAdmin && $request->author_id) {
                    $query->where('user_id', $request->author_id);
                }
            }], 'views_count')
            ->withSum(['posts' => function ($query) use ($request, $isSuperAdmin, $user) {
                if (! $isSuperAdmin) {
                    $query->where('user_id', $user->id);
                }
                $query = $this->applyDateFilters($query, $request, 'posts');
                if ($request->status && $request->status !== 'all') {
                    $query->where('posts.status', $request->status);
                }
                if ($request->category_id) {
                    $query->whereHas('categories', function ($q) use ($request) {
                        $q->where('posts_categories.id', $request->category_id);
                    });
                }
                if ($isSuperAdmin && $request->author_id) {
                    $query->where('user_id', $request->author_id);
                }
            }], 'likes_count')
            ->withSum(['posts' => function ($query) use ($request, $isSuperAdmin, $user) {
                if (! $isSuperAdmin) {
                    $query->where('user_id', $user->id);
                }
                $query = $this->applyDateFilters($query, $request, 'posts');
                if ($request->status && $request->status !== 'all') {
                    $query->where('posts.status', $request->status);
                }
                if ($request->category_id) {
                    $query->whereHas('categories', function ($q) use ($request) {
                        $q->where('posts_categories.id', $request->category_id);
                    });
                }
                if ($isSuperAdmin && $request->author_id) {
                    $query->where('user_id', $request->author_id);
                }
            }], 'comments_count')
            ->orderBy('posts_count', 'desc')
            ->limit(10);

        $categoryPerformance = $categoryPerformanceQuery->get()
            ->map(fn ($category) => [
                'id' => $category->id,
                'nom' => $category->nom,
                'slug' => $category->slug,
                'posts_count' => $category->posts_count,
                'total_views' => $category->posts_sum_views_count ?? 0,
                'total_likes' => $category->posts_sum_likes_count ?? 0,
                'total_comments' => $category->posts_sum_comments_count ?? 0,
            ]);

        // ==================== 12. TAGS LES PLUS UTILISÉS ====================
        $topTags = [];
        if ($isSuperAdmin) {
            $postsQuery = Post::query();

            if (! $isSuperAdmin) {
                $postsQuery->where('user_id', $user->id);
            }

            $postsQuery = $this->applyDateFilters($postsQuery, $request, 'posts');

            if ($request->status && $request->status !== 'all') {
                $postsQuery->where('posts.status', $request->status);
            }

            if ($request->category_id) {
                $postsQuery->whereHas('categories', function ($q) use ($request) {
                    $q->where('posts_categories.id', $request->category_id);
                });
            }

            if ($isSuperAdmin && $request->author_id) {
                $postsQuery->where('user_id', $request->author_id);
            }

            $postIds = $postsQuery->pluck('posts.id');

            if ($postIds->isNotEmpty()) {
                $tagCounts = DB::table('taggables')
                    ->where('taggable_type', Post::class)
                    ->whereIn('taggable_id', $postIds)
                    ->select('tag_id', DB::raw('COUNT(*) as total'))
                    ->groupBy('tag_id')
                    ->orderBy('total', 'desc')
                    ->limit(20)
                    ->get();

                $tagIds = $tagCounts->pluck('tag_id')->toArray();

                if (! empty($tagIds)) {
                    $tags = DB::table('tags')
                        ->whereIn('id', $tagIds)
                        ->get()
                        ->keyBy('id');

                    $topTags = $tagCounts->map(fn ($item) => [
                        'id' => $item->tag_id,
                        'name' => $this->extractTagName($tags[$item->tag_id]->name ?? ''),
                        'slug' => $tags[$item->tag_id]->slug ?? '',
                        'posts_count' => (int) $item->total,
                    ])->values()->toArray();
                }
            }
        }

        // ==================== 13. DONNÉES POUR LE GRAPHIQUE ====================
        $chartStatsQuery = Post::selectRaw('DATE(posts.created_at) as date')
            ->selectRaw('SUM(posts.views_count) as views')
            ->selectRaw('SUM(posts.likes_count) as likes')
            ->selectRaw('SUM(posts.comments_count) as comments')
            ->groupBy('date')
            ->orderBy('date');

        if (! $isSuperAdmin) {
            $chartStatsQuery->where('user_id', $user->id);
        }

        $chartStatsQuery = $this->applyDateFilters($chartStatsQuery, $request, 'posts');

        if ($request->status && $request->status !== 'all') {
            $chartStatsQuery->where('posts.status', $request->status);
        }

        if ($request->category_id) {
            $chartStatsQuery->whereHas('categories', function ($q) use ($request) {
                $q->where('posts_categories.id', $request->category_id);
            });
        }

        if ($isSuperAdmin && $request->author_id) {
            $chartStatsQuery->where('user_id', $request->author_id);
        }

        $chartStats = $chartStatsQuery->get()
            ->map(fn ($item) => [
                'date' => $item->date,
                'views' => (int) $item->views,
                'likes' => (int) $item->likes,
                'comments' => (int) $item->comments,
            ])
            ->toArray();

        if (empty($chartStats)) {
            $chartStats = [];
        }

        // ==================== 14. STATISTIQUES GLOBALES ====================
        $statsQuery = Post::query();

        if (! $isSuperAdmin) {
            $statsQuery->where('user_id', $user->id);
        }

        $statsQuery = $this->applyDateFilters($statsQuery, $request, 'posts');

        if ($request->status && $request->status !== 'all') {
            $statsQuery->where('posts.status', $request->status);
        }

        if ($request->category_id) {
            $statsQuery->whereHas('categories', function ($q) use ($request) {
                $q->where('posts_categories.id', $request->category_id);
            });
        }

        if ($isSuperAdmin && $request->author_id) {
            $statsQuery->where('user_id', $request->author_id);
        }

        // Calcul des statistiques de la période actuelle

        // Calcul des statistiques de la période précédente

    }
}
