<?php

namespace App\Http\Controllers\Vendor\Vendeurs;

use App\Http\Controllers\Controller;
use App\Http\Resources\PostResource;
use App\Models\Post;
use App\Models\PostCategory;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Str;
use Inertia\Inertia;

class StatsBlogController extends Controller
{
    public function stats(Request $request)
    {
        if (! $this->hasDashboardSchema()) {
            return Inertia::render('Vendor/blog-stats', $this->emptyDashboardPayload($request));
        }

        $user = Auth::user();
        $isSuperAdmin = $user->hasRole('super_admin');

        // Closure de filtrage commune pour toutes les requêtes de posts
        $applyCommonFilters = function ($query) use ($request, $isSuperAdmin, $user) {
            if (! $isSuperAdmin) {
                $query->where('user_id', $user->id);
            }
            $query = $this->applyDateFilters($query, $request, 'posts');

            if ($request->search) {
                $query->where('posts.title', 'like', '%'.$request->search.'%');
            }
            if ($request->status && $request->status !== 'all') {
                $query->where('posts.status', $request->status);
            }
            if ($request->category_id) {
                $query->whereHas('categories', fn ($q) => $q->where('posts_categories.id', $request->category_id));
            }
            if ($isSuperAdmin && $request->author_id) {
                $query->where('user_id', $request->author_id);
            }

            return $query;
        };

        // 1. Posts paginés
        $paginatedPosts = $applyCommonFilters(Post::with(['user', 'categories', 'media', 'tags']))
            ->orderBy($request->sort ?? 'posts.created_at', $request->direction ?? 'desc')
            ->paginate($request->per_page ?? 10);

        $posts = [
            'data' => PostResource::collection($paginatedPosts->items())->toArray($request),
            'current_page' => $paginatedPosts->currentPage(),
            'last_page' => $paginatedPosts->lastPage(),
            'from' => $paginatedPosts->firstItem(),
            'to' => $paginatedPosts->lastItem(),
            'total' => $paginatedPosts->total(),
            'per_page' => $paginatedPosts->perPage(),
        ];

        // 2. Statistiques par statut
        $postsStatusStats = Post::selectRaw('status, COUNT(*) as count')
            ->groupBy('status')
            ->tap($applyCommonFilters)
            ->get()
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
            ->values()
            ->toArray();

        // 3. Catégories (top 10 avec comptage, + total)
        $categoriesStats = $this->getCategoryStats($applyCommonFilters, 8);
        $totalCategoriesCount = $this->getTotalCategoriesCount($applyCommonFilters);

        // 4. Top articles (10)
        $topPosts = Post::with('user')
            ->where('status', 'published')
            ->orderBy('views_count', 'desc')
            ->limit(8)
            ->tap($applyCommonFilters)
            ->get()
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

        // 5. Top auteurs (super admin uniquement)
        $topAuthors = [];
        if ($isSuperAdmin) {
            $topAuthors = User::whereHas('posts', $applyCommonFilters)
                ->withCount(['posts' => $applyCommonFilters])
                ->withSum(['posts' => $applyCommonFilters], 'views_count')
                ->orderBy('posts_count', 'desc')
                ->limit(8)
                ->get()
                ->map(fn ($user) => [
                    'id' => $user->id,
                    'name' => $user->name,
                    'avatar_url' => $user->avatar_url,
                    'posts_count' => $user->posts_count,
                    'total_views' => $user->posts_sum_views_count ?? 0,
                ])
                ->values();
        }

        // 6. Taux d'engagement
        $engagementStats = $this->getEngagementStats($applyCommonFilters);

        // 7. Articles programmés (30 jours)
        $scheduledPosts = Post::where('status', 'scheduled')
            ->where('scheduled_for', '>=', now())
            ->where('scheduled_for', '<=', now()->addDays(30))
            ->orderBy('scheduled_for')
            ->tap($applyCommonFilters)
            ->get()
            ->map(fn ($post) => [
                'id' => $post->id,
                'title' => $post->title,
                'slug' => $post->slug,
                'scheduled_for' => $post->scheduled_for,
            ])
            ->values();

        // 8. Vieux brouillons (> 30 jours)
        $oldDraftsCount = Post::where('status', 'draft')
            ->where('updated_at', '<=', now()->subDays(30))
            ->tap($applyCommonFilters)
            ->count();

        // 9. Activité hebdomadaire, mensuelle, horaire
        $weeklyActivity = $this->getPeriodicActivity($applyCommonFilters, 'day');
        $monthlyPostsStats = $this->getPeriodicActivity($applyCommonFilters, 'month');
        $hourlyPostsStats = $this->getPeriodicActivity($applyCommonFilters, 'hour');

        // 10. Performance des catégories
        $categoryPerformance = $this->getCategoryPerformance($applyCommonFilters);

        // 11. Top tags (super admin)
        $topTags = $this->getTopTags($applyCommonFilters, $isSuperAdmin);

        // 12. Données du graphique principal
        $chartStats = $this->getChartStats($applyCommonFilters);

        // 13. Statistiques globales (avec comparaison période précédente)
        $stats = $this->getGlobalStats($applyCommonFilters, $request);

        // 14. Liste des auteurs et catégories pour les filtres
        $authors = $isSuperAdmin ? User::has('posts')->get(['id', 'name', 'email']) : [];
        $categoriesList = PostCategory::orderBy('nom', 'asc')->get(['id', 'nom', 'slug']);

        // 15. Jours depuis la dernière publication
        $daysSinceLastPost = $this->getDaysSinceLastPost($isSuperAdmin, $user);

        // 16. Tendance des vues sur 7 jours
        $viewsTrend = $this->getViewsTrend($applyCommonFilters);

        // Assemblage des statistiques complémentaires
        $stats['days_since_last_post'] = $daysSinceLastPost;
        $stats['views_trend'] = $viewsTrend;

        return Inertia::render('Vendor/blog-stats', [
            'posts' => $posts,
            'stats' => $stats,
            'chartStats' => $chartStats,
            'categoriesStats' => $categoriesStats,
            'totalCategoriesCount' => $totalCategoriesCount,
            'postsStatusStats' => $postsStatusStats,
            'topPosts' => $topPosts,
            'topAuthors' => $topAuthors,
            'engagementStats' => $engagementStats,
            'scheduledPosts' => $scheduledPosts,
            'weeklyActivity' => $weeklyActivity,
            'monthlyPostsStats' => $monthlyPostsStats,
            'hourlyPostsStats' => $hourlyPostsStats,
            'categoryPerformance' => $categoryPerformance,
            'topTags' => $topTags,
            'is_super_admin' => $isSuperAdmin,
            'authors' => $authors,
            'categories_list' => $categoriesList,
            'filters' => [
                'search' => $request->search,
                'status' => $request->status,
                'category_id' => $request->category_id,
                'author_id' => $request->author_id,
                'period' => $request->period,
                'start_date' => $request->start_date,
                'end_date' => $request->end_date,
                'year' => $request->year,
                'month' => $request->month,
            ],
        ]);
    }

    // ==================== MÉTHODES D'AIDE ====================

    private function getCategoryStats(\Closure $filter, int $limit): array
    {
        return PostCategory::whereHas('posts', $filter)
            ->withCount(['posts' => $filter])
            ->orderBy('posts_count', 'desc')
            ->limit($limit)
            ->get()
            ->map(fn ($cat) => [
                'id' => $cat->id,
                'nom' => $cat->nom,
                'slug' => $cat->slug,
                'color' => $cat->color,
                'posts_count' => $cat->posts_count,
            ])
            ->values()
            ->toArray();
    }

    private function getTotalCategoriesCount(\Closure $filter): int
    {
        return PostCategory::whereHas('posts', $filter)->count();
    }

    private function getEngagementStats(\Closure $filter): object
    {
        return Post::where('status', 'published')
            ->selectRaw('AVG((likes_count + comments_count) * 1.0 / NULLIF(views_count, 0) * 100) as avg_engagement')
            ->selectRaw('MAX((likes_count + comments_count) * 1.0 / NULLIF(views_count, 0) * 100) as max_engagement')
            ->tap($filter)
            ->first();
    }

    private function getPeriodicActivity(\Closure $filter, string $type): array
    {
        $query = Post::where('status', 'published')->tap($filter);
        $driver = DB::connection()->getDriverName();

        switch ($type) {
            case 'day':
                $expr = $driver === 'pgsql' ? 'EXTRACT(DOW FROM posts.created_at)' : "strftime('%w', posts.created_at)";
                $query->selectRaw($expr.' as period, COUNT(*) as count')
                    ->groupBy($driver === 'pgsql' ? 'period' : "strftime('%w', posts.created_at)")
                    ->orderBy('period');

                return $query->get()->map(fn ($item) => [
                    'day' => $this->translateDayNumber((int) $item->period),
                    'count' => (int) $item->count,
                ])->toArray();
            case 'month':
                $expr = $driver === 'pgsql' ? 'EXTRACT(MONTH FROM posts.created_at)' : "strftime('%m', posts.created_at)";
                $query->selectRaw($expr.' as period, COUNT(*) as count')
                    ->groupBy($driver === 'pgsql' ? 'period' : "strftime('%m', posts.created_at)")
                    ->orderBy('period');

                return $query->get()->map(fn ($item) => [
                    'month' => (int) $item->period,
                    'month_name' => $this->getMonthName((int) $item->period),
                    'count' => (int) $item->count,
                ])->toArray();
            case 'hour':
                $expr = $driver === 'pgsql' ? 'EXTRACT(HOUR FROM posts.created_at)' : "strftime('%H', posts.created_at)";
                $query->selectRaw($expr.' as period, COUNT(*) as count')
                    ->groupBy($driver === 'pgsql' ? 'period' : "strftime('%H', posts.created_at)")
                    ->orderBy('period');

                return $query->get()->map(fn ($item) => [
                    'hour' => (int) $item->period,
                    'count' => (int) $item->count,
                ])->toArray();
        }

        return [];
    }

    private function getCategoryPerformance(\Closure $filter): array
    {
        return PostCategory::whereHas('posts', $filter)
            ->withCount(['posts' => $filter])
            ->withSum(['posts' => $filter], 'views_count')
            ->withSum(['posts' => $filter], 'likes_count')
            ->withSum(['posts' => $filter], 'comments_count')
            ->orderBy('posts_count', 'desc')
            ->limit(8)
            ->get()
            ->map(fn ($cat) => [
                'id' => $cat->id,
                'nom' => $cat->nom,
                'slug' => $cat->slug,
                'posts_count' => $cat->posts_count,
                'total_views' => $cat->posts_sum_views_count ?? 0,
                'total_likes' => $cat->posts_sum_likes_count ?? 0,
                'total_comments' => $cat->posts_sum_comments_count ?? 0,
            ])
            ->values()
            ->toArray();
    }

    private function getTopTags(\Closure $filter, bool $isSuperAdmin): array
    {
        if (! $isSuperAdmin) {
            return [];
        }
        $postIds = Post::tap($filter)->pluck('id');
        if ($postIds->isEmpty()) {
            return [];
        }

        $tagCounts = DB::table('taggables')
            ->where('taggable_type', Post::class)
            ->whereIn('taggable_id', $postIds)
            ->select('tag_id', DB::raw('COUNT(*) as total'))
            ->groupBy('tag_id')
            ->orderBy('total', 'desc')
            ->limit(8)
            ->get();

        $tagIds = $tagCounts->pluck('tag_id')->toArray();
        $tags = DB::table('tags')->whereIn('id', $tagIds)->get()->keyBy('id');

        return $tagCounts->map(fn ($item) => [
            'id' => $item->tag_id,
            'name' => $this->extractTagName($tags[$item->tag_id]->name ?? ''),
            'slug' => $tags[$item->tag_id]->slug ?? '',
            'posts_count' => (int) $item->total,
        ])->values()->toArray();
    }

    private function getChartStats(\Closure $filter): array
    {
        $driver = DB::connection()->getDriverName();
        $dateExpr = $driver === 'pgsql' ? 'DATE(posts.created_at)' : 'date(posts.created_at)';

        return Post::selectRaw($dateExpr.' as date')
            ->selectRaw('SUM(posts.views_count) as views')
            ->selectRaw('SUM(posts.likes_count) as likes')
            ->selectRaw('SUM(posts.comments_count) as comments')
            ->tap($filter)
            ->groupBy($driver === 'pgsql' ? 'date' : 'date(posts.created_at)')
            ->orderBy('date')
            ->get()
            ->map(fn ($item) => [
                'date' => $item->date,
                'views' => (int) $item->views,
                'likes' => (int) $item->likes,
                'comments' => (int) $item->comments,
            ])
            ->toArray();
    }

    private function getGlobalStats(\Closure $filter, Request $request): array
    {
        $currentPeriodQuery = Post::query()->tap($filter);
        $current = [
            'total_posts' => $currentPeriodQuery->count(),
            'total_views' => $currentPeriodQuery->sum('views_count'),
            'total_likes' => $currentPeriodQuery->sum('likes_count'),
            'total_comments' => $currentPeriodQuery->sum('comments_count'),
        ];

        $previousPeriodQuery = $this->getPreviousPeriodQuery($filter, $request);
        $previous = [
            'total_posts' => $previousPeriodQuery->count(),
            'total_views' => $previousPeriodQuery->sum('views_count'),
            'total_likes' => $previousPeriodQuery->sum('likes_count'),
            'total_comments' => $previousPeriodQuery->sum('comments_count'),
        ];

        $viewsChange = $this->calculatePercentageChange($current['total_views'], $previous['total_views']);
        $likesChange = $this->calculatePercentageChange($current['total_likes'], $previous['total_likes']);
        $postsChange = $this->calculatePercentageChange($current['total_posts'], $previous['total_posts']);

        $thisMonth = Post::whereBetween('created_at', [now()->startOfMonth(), now()->endOfMonth()])
            ->tap($filter)
            ->count();
        $previousMonth = Post::whereBetween('created_at', [now()->subMonth()->startOfMonth(), now()->subMonth()->endOfMonth()])
            ->tap($filter)
            ->count();
        $postsThisMonthChange = $this->calculatePercentageChange($thisMonth, $previousMonth);

        $activeAuthors = User::whereHas('posts', fn ($q) => $q->tap($filter))->count();
        $activeAuthorsPrevious = User::whereHas('posts', fn ($q) => $q->tap($filter))->count();
        $activeAuthorsChange = $this->calculatePercentageChange($activeAuthors, $activeAuthorsPrevious);

        $conversionRate = $previous['total_posts'] > 0
            ? round(($current['total_posts'] / $previous['total_posts']) * 100, 1)
            : 0;

        $pendingDrafts = Post::where('status', 'draft')
            ->where('updated_at', '>=', now()->subDays(7))
            ->tap($filter)
            ->count();
        $previousDrafts = Post::where('status', 'draft')
            ->whereBetween('updated_at', [now()->subDays(14), now()->subDays(7)])
            ->tap($filter)
            ->count();
        $draftsChange = $this->calculatePercentageChange($pendingDrafts, $previousDrafts);

        return [
            'total_posts' => $current['total_posts'],
            'published_posts' => (clone $currentPeriodQuery)->where('posts.status', 'published')->count(),
            'draft_posts' => (clone $currentPeriodQuery)->where('posts.status', 'draft')->count(),
            'scheduled_posts' => (clone $currentPeriodQuery)->where('posts.status', 'scheduled')->count(),
            'archived_posts' => (clone $currentPeriodQuery)->where('posts.status', 'archived')->count(),
            'total_views' => $current['total_views'],
            'total_likes' => $current['total_likes'],
            'total_comments' => $current['total_comments'],
            'views_change' => $viewsChange,
            'likes_change' => $likesChange,
            'posts_change' => $postsChange,
            'old_drafts_count' => Post::where('status', 'draft')->where('updated_at', '<=', now()->subDays(30))->tap($filter)->count(),
            'avg_engagement' => round($this->getEngagementStats($filter)->avg_engagement ?? 0, 2),
            'max_engagement' => round($this->getEngagementStats($filter)->max_engagement ?? 0, 2),
            'posts_this_month' => $thisMonth,
            'posts_this_month_change' => $postsThisMonthChange,
            'active_authors' => $activeAuthors,
            'active_authors_change' => $activeAuthorsChange,
            'conversion_rate' => $conversionRate,
            'pending_drafts' => $pendingDrafts,
            'pending_drafts_change' => $draftsChange,
        ];
    }

    private function getPreviousPeriodQuery(\Closure $filter, Request $request): Builder
    {
        $currentStartDate = null;
        $currentEndDate = null;
        $previousStartDate = null;
        $previousEndDate = null;

        $this->computePeriodDates($request, $currentStartDate, $currentEndDate, $previousStartDate, $previousEndDate);

        $query = Post::query();
        if ($previousStartDate) {
            $query->where('created_at', '>=', $previousStartDate);
        }
        if ($previousEndDate) {
            $query->where('created_at', '<=', $previousEndDate);
        }

        return $query->tap($filter);
    }

    private function getDaysSinceLastPost(bool $isSuperAdmin, $user): ?int
    {
        $post = Post::where('status', 'published')
            ->when(! $isSuperAdmin, fn ($q) => $q->where('user_id', $user->id))
            ->latest('published_at')
            ->first();
        if (! $post) {
            return null;
        }

        return (int) Carbon::parse($post->published_at)->startOfDay()->diffInDays(now()->startOfDay());
    }

    private function getViewsTrend(\Closure $filter): float
    {
        $last7 = Post::where('status', 'published')->where('created_at', '>=', now()->subDays(7))->tap($filter)->sum('views_count');
        $prev7 = Post::where('status', 'published')->whereBetween('created_at', [now()->subDays(14), now()->subDays(7)])->tap($filter)->sum('views_count');

        return $this->calculatePercentageChange($last7, $prev7);
    }

    // ==================== MÉTHODES UTILITAIRES GÉNÉRALES ====================

    /**
     * Applique les filtres de date à une requête.
     */
    private function applyDateFilters($query, Request $request, string $table = 'posts')
    {
        $period = $request->period;
        $startDate = $request->start_date;
        $endDate = $request->end_date;
        $year = $request->year;
        $month = $request->month;

        if (! $period && ! $startDate && ! $endDate && ! $year && ! $month) {
            return $query;
        }

        switch ($period) {
            case 'today':
                $query->whereDate($table.'.created_at', today());
                break;
            case 'yesterday':
                $query->whereDate($table.'.created_at', today()->subDay());
                break;
            case 'last7days':
                $query->where($table.'.created_at', '>=', now()->subDays(7));
                break;
            case 'last30days':
                $query->where($table.'.created_at', '>=', now()->subDays(30));
                break;
            case 'last90days':
                $query->where($table.'.created_at', '>=', now()->subDays(90));
                break;
            case 'thisWeek':
                $query->whereBetween($table.'.created_at', [now()->startOfWeek(), now()->endOfWeek()]);
                break;
            case 'lastWeek':
                $query->whereBetween($table.'.created_at', [now()->subWeek()->startOfWeek(), now()->subWeek()->endOfWeek()]);
                break;
            case 'thisMonth':
                if ($month) {
                    $query->whereMonth($table.'.created_at', $month);
                } else {
                    $query->whereMonth($table.'.created_at', now()->month);
                }
                if ($year) {
                    $query->whereYear($table.'.created_at', $year);
                } else {
                    $query->whereYear($table.'.created_at', now()->year);
                }
                break;
            case 'lastMonth':
                $lastMonth = now()->subMonth();
                $query->whereMonth($table.'.created_at', $lastMonth->month)
                    ->whereYear($table.'.created_at', $lastMonth->year);
                break;
            case 'thisQuarter':
                $query->whereBetween($table.'.created_at', [now()->startOfQuarter(), now()->endOfQuarter()]);
                break;
            case 'lastQuarter':
                $lastQuarter = now()->subQuarter();
                $query->whereBetween($table.'.created_at', [$lastQuarter->startOfQuarter(), $lastQuarter->endOfQuarter()]);
                break;
            case 'thisYear':
                $query->whereYear($table.'.created_at', $year ?? now()->year);
                break;
            case 'lastYear':
                $query->whereYear($table.'.created_at', now()->subYear()->year);
                break;
            case 'custom':
                if ($startDate) {
                    $query->whereDate($table.'.created_at', '>=', $startDate);
                }
                if ($endDate) {
                    $query->whereDate($table.'.created_at', '<=', $endDate);
                }
                break;
        }

        return $query;
    }

    /**
     * Calcule les dates de début et de fin pour les périodes courante et précédente.
     */
    private function computePeriodDates(Request $request, &$currentStartDate, &$currentEndDate, &$previousStartDate, &$previousEndDate): void
    {
        $period = $request->period;
        $startDate = $request->start_date;
        $endDate = $request->end_date;

        switch ($period) {
            case 'today':
                $currentStartDate = now()->startOfDay();
                $currentEndDate = now()->endOfDay();
                $previousStartDate = now()->subDay()->startOfDay();
                $previousEndDate = now()->subDay()->endOfDay();
                break;
            case 'yesterday':
                $currentStartDate = now()->subDay()->startOfDay();
                $currentEndDate = now()->subDay()->endOfDay();
                $previousStartDate = now()->subDays(2)->startOfDay();
                $previousEndDate = now()->subDays(2)->endOfDay();
                break;
            case 'last7days':
                $currentStartDate = now()->subDays(7);
                $previousStartDate = now()->subDays(14);
                $previousEndDate = now()->subDays(7);
                break;
            case 'last30days':
                $currentStartDate = now()->subDays(30);
                $previousStartDate = now()->subDays(60);
                $previousEndDate = now()->subDays(30);
                break;
            case 'last90days':
                $currentStartDate = now()->subDays(90);
                $previousStartDate = now()->subDays(180);
                $previousEndDate = now()->subDays(90);
                break;
            case 'thisWeek':
                $currentStartDate = now()->startOfWeek();
                $currentEndDate = now()->endOfWeek();
                $previousStartDate = now()->subWeek()->startOfWeek();
                $previousEndDate = now()->subWeek()->endOfWeek();
                break;
            case 'lastWeek':
                $currentStartDate = now()->subWeek()->startOfWeek();
                $currentEndDate = now()->subWeek()->endOfWeek();
                $previousStartDate = now()->subWeeks(2)->startOfWeek();
                $previousEndDate = now()->subWeeks(2)->endOfWeek();
                break;
            case 'thisMonth':
                $currentStartDate = now()->startOfMonth();
                $currentEndDate = now()->endOfMonth();
                $previousStartDate = now()->subMonth()->startOfMonth();
                $previousEndDate = now()->subMonth()->endOfMonth();
                break;
            case 'lastMonth':
                $currentStartDate = now()->subMonth()->startOfMonth();
                $currentEndDate = now()->subMonth()->endOfMonth();
                $previousStartDate = now()->subMonths(2)->startOfMonth();
                $previousEndDate = now()->subMonths(2)->endOfMonth();
                break;
            case 'thisQuarter':
                $currentStartDate = now()->startOfQuarter();
                $currentEndDate = now()->endOfQuarter();
                $previousStartDate = now()->subQuarter()->startOfQuarter();
                $previousEndDate = now()->subQuarter()->endOfQuarter();
                break;
            case 'lastQuarter':
                $currentStartDate = now()->subQuarter()->startOfQuarter();
                $currentEndDate = now()->subQuarter()->endOfQuarter();
                $previousStartDate = now()->subQuarters(2)->startOfQuarter();
                $previousEndDate = now()->subQuarters(2)->endOfQuarter();
                break;
            case 'thisYear':
                $currentStartDate = now()->startOfYear();
                $currentEndDate = now()->endOfYear();
                $previousStartDate = now()->subYear()->startOfYear();
                $previousEndDate = now()->subYear()->endOfYear();
                break;
            case 'lastYear':
                $currentStartDate = now()->subYear()->startOfYear();
                $currentEndDate = now()->subYear()->endOfYear();
                $previousStartDate = now()->subYears(2)->startOfYear();
                $previousEndDate = now()->subYears(2)->endOfYear();
                break;
            case 'custom':
                if ($startDate) {
                    $currentStartDate = Carbon::parse($startDate)->startOfDay();
                }
                if ($endDate) {
                    $currentEndDate = Carbon::parse($endDate)->endOfDay();
                }
                if ($currentStartDate && $currentEndDate) {
                    $duration = $currentStartDate->diffInDays($currentEndDate);
                    $previousEndDate = clone $currentStartDate;
                    $previousStartDate = clone $previousEndDate;
                    $previousStartDate->subDays($duration);
                }
                break;
            default:
                $currentStartDate = now()->subDays(30);
                $previousStartDate = now()->subDays(60);
                $previousEndDate = now()->subDays(30);
                break;
        }
    }

    private function calculatePercentageChange(float $current, float $previous): float
    {
        if ($previous == 0) {
            return $current > 0 ? 100 : 0;
        }

        return round((($current - $previous) / $previous) * 100, 1);
    }

    private function hasDashboardSchema(): bool
    {
        return Schema::hasTable('posts')
            && Schema::hasTable('users')
            && Schema::hasTable('posts_categories')
            && Schema::hasTable('posts_categories_pivot');
    }

    private function emptyDashboardPayload(Request $request): array
    {
        return [
            'posts' => [
                'data' => [],
                'current_page' => 1,
                'last_page' => 1,
                'from' => null,
                'to' => null,
                'total' => 0,
                'per_page' => 10,
            ],
            'stats' => [
                'total_posts' => 0,
                'published_posts' => 0,
                'draft_posts' => 0,
                'scheduled_posts' => 0,
                'archived_posts' => 0,
                'total_views' => 0,
                'total_likes' => 0,
                'total_comments' => 0,
                'views_change' => 0,
                'likes_change' => 0,
                'posts_change' => 0,
                'old_drafts_count' => 0,
                'avg_engagement' => 0,
                'max_engagement' => 0,
                'posts_this_month' => 0,
                'posts_this_month_change' => 0,
                'active_authors' => 0,
                'active_authors_change' => 0,
                'conversion_rate' => 0,
                'days_since_last_post' => null,
                'views_trend' => 0,
                'pending_drafts' => 0,
                'pending_drafts_change' => 0,
            ],
            'chartStats' => [],
            'categoriesStats' => [],
            'postsStatusStats' => [],
            'topPosts' => [],
            'topAuthors' => [],
            'engagementStats' => null,
            'scheduledPosts' => [],
            'weeklyActivity' => [],
            'monthlyPostsStats' => [],
            'hourlyPostsStats' => [],
            'categoryPerformance' => [],
            'topTags' => [],
            'is_super_admin' => Auth::user()?->hasRole('super_admin') ?? false,
            'authors' => [],
            'categories_list' => [],
            'filters' => [
                'search' => $request->search,
                'status' => $request->status,
                'category_id' => $request->category_id,
                'author_id' => $request->author_id,
                'period' => $request->period,
                'start_date' => $request->start_date,
                'end_date' => $request->end_date,
                'year' => $request->year,
                'month' => $request->month,
            ],
        ];
    }

    // ==================== MÉTHODES DE COMPATIBILITÉ MULTI-DRIVER ====================

    private function getDayOfWeekExpression(string $driver): string
    {
        return match ($driver) {
            'pgsql' => 'EXTRACT(DOW FROM posts.created_at)',
            'sqlite' => "strftime('%w', posts.created_at)",
            default => 'EXTRACT(DOW FROM posts.created_at)',
        };
    }

    private function getMonthExpression(string $driver): string
    {
        return match ($driver) {
            'pgsql' => 'EXTRACT(MONTH FROM posts.created_at)',
            'sqlite' => "strftime('%m', posts.created_at)",
            default => 'EXTRACT(MONTH FROM posts.created_at)',
        };
    }

    private function getHourExpression(string $driver): string
    {
        return match ($driver) {
            'pgsql' => 'EXTRACT(HOUR FROM posts.created_at)',
            'sqlite' => "strftime('%H', posts.created_at)",
            default => 'EXTRACT(HOUR FROM posts.created_at)',
        };
    }

    private function translateDayNumber(int $dayNum): string
    {
        return match ($dayNum) {
            0 => 'Dimanche',
            1 => 'Lundi',
            2 => 'Mardi',
            3 => 'Mercredi',
            4 => 'Jeudi',
            5 => 'Vendredi',
            6 => 'Samedi',
            default => 'Inconnu',
        };
    }

    private function translateDay(string $day): string
    {
        return match ($day) {
            'Monday' => 'Lundi',
            'Tuesday' => 'Mardi',
            'Wednesday' => 'Mercredi',
            'Thursday' => 'Jeudi',
            'Friday' => 'Vendredi',
            'Saturday' => 'Samedi',
            'Sunday' => 'Dimanche',
            default => $day,
        };
    }

    private function getMonthName(int $month): string
    {
        return match ($month) {
            1 => 'Janvier',
            2 => 'Février',
            3 => 'Mars',
            4 => 'Avril',
            5 => 'Mai',
            6 => 'Juin',
            7 => 'Juillet',
            8 => 'Août',
            9 => 'Septembre',
            10 => 'Octobre',
            11 => 'Novembre',
            12 => 'Décembre',
            default => '',
        };
    }

    private function extractTagName($tagName): string
    {
        if (is_null($tagName)) {
            return 'Sans nom';
        }
        if (is_string($tagName) && ! str_contains($tagName, '{')) {
            return $tagName;
        }
        $decoded = json_decode($tagName, true);
        if (json_last_error() === JSON_ERROR_NONE && is_array($decoded)) {
            return $decoded['fr'] ?? $decoded['en'] ?? reset($decoded) ?? 'Tag';
        }

        return trim(preg_replace('/[{}":]/', '', $tagName));
    }

    // ==================== AUTRES MÉTHODES (SUPPRESSION, DUPLICATION, RÉORDONNANCEMENT) ====================

    public function destroy(Post $post)
    {
        $user = Auth::user();
        $isSuperAdmin = $user->hasRole('super_admin');

        if (! $isSuperAdmin && $post->user_id !== $user->id) {
            abort(403, 'Vous n\'êtes pas autorisé à supprimer cet article.');
        }

        $post->delete();

        return redirect()->back()->with('success', 'Article supprimé avec succès');
    }

    public function duplicate(Post $post)
    {
        $user = Auth::user();
        $isSuperAdmin = $user->hasRole('super_admin');

        if (! $isSuperAdmin && $post->user_id !== $user->id) {
            return redirect()->back()->with('error', 'Vous n\'êtes pas autorisé à dupliquer cet article.');
        }

        $newPost = $post->replicate();
        $newPost->title = $post->title.' (Copie)';
        $newPost->slug = Str::slug($newPost->title).'-'.Str::random(5);
        $newPost->status = 'draft';
        $newPost->published_at = null;
        $newPost->save();

        return redirect()->back()->with('success', 'Article dupliqué avec succès');
    }

    public function postsReorder(Request $request)
    {
        $request->validate([
            'ordered_ids' => 'required|array',
            'ordered_ids.*' => 'exists:posts,id',
        ]);

        foreach ($request->ordered_ids as $index => $id) {
            Post::where('id', $id)->update(['order' => $index]);
        }

        return redirect()->back()->with('success', 'Ordre mis à jour avec succès');
    }
}
