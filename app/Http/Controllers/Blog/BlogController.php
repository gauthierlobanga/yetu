<?php

namespace App\Http\Controllers\Blog;

use App\Http\Controllers\Controller;
use App\Http\Resources\CategoryResource;
use App\Http\Resources\PostResource;
use App\Models\Post;
use App\Models\PostCategory;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;

class BlogController extends Controller
{
    /**
     * Affiche la liste des posts de l'utilisateur connecté.
     */
    public function blogIndex(Request $request)
    {
        if ($request->filled('category_id') && ! $request->filled('tag')) {
            $legacyCategory = PostCategory::query()
                ->select('slug')
                ->find($request->integer('category_id'));

            if ($legacyCategory) {
                return redirect()->route('blog.index', [
                    'tag' => $legacyCategory->slug,
                    ...$request->except('category_id'),
                ]);
            }
        }

        $filters = $request->validate([
            'search' => 'nullable|string|max:100',
            'status' => 'nullable|string|in:'.implode(',', array_keys(Post::getStatuses())),
            'tag' => 'nullable|exists:posts_categories,slug',
            'sort' => 'nullable|string|in:created_at,published_at,title,views_count',
            'direction' => 'nullable|string|in:asc,desc',
            'page' => 'nullable|integer|min:1',
            'per_page' => 'nullable|integer|min:1|max:100',
        ]);

        // S'assurer que les clés existent toujours
        $filters = array_merge([
            'search' => null,
            'status' => null,
            'tag' => null,
            'sort' => 'published_at',
            'direction' => 'desc',
        ], $filters);

        // Nettoyer les valeurs nulles ou vides
        $filters = array_filter($filters, function ($value) {
            return $value !== null && $value !== '';
        });

        $query = Post::with([
            'categories' => fn ($q) => $q->select('posts_categories.id', 'nom', 'slug', 'color'),
            'media',
            'user' => fn ($q) => $q->select('id', 'name', 'email'),
        ])->where('status', Post::STATUS_PUBLISHED);

        // Appliquer les filtres...
        if (! empty($filters['search'])) {
            $query->where(function ($q) use ($filters) {
                $q->where('title', 'like', "%{$filters['search']}%")
                    ->orWhere('content', 'like', "%{$filters['search']}%");
            });
        }

        if (! empty($filters['status'])) {
            $query->where('status', $filters['status']);
        }

        if (! empty($filters['tag'])) {
            $query->whereHas('categories', fn ($q) => $q->where('posts_categories.slug', $filters['tag']));
        }

        // Tri
        $sort = $filters['sort'] ?? 'published_at';
        $direction = $filters['direction'] ?? 'desc';
        $query->orderBy($sort, $direction);

        $perPage = $filters['per_page'] ?? 9;
        $posts = $query->paginate($perPage);

        // N'ajouter query string que s'il y a des filtres ou si pas page 1
        if (count(array_filter($filters)) > 0 || ($posts->currentPage() > 1)) {
            $posts->withQueryString();
        }

        $categories = PostCategory::select('id', 'nom', 'slug', 'color')
            ->where('est_active', true)
            ->orderBy('nom')
            ->get();

        return Inertia::render('main/blog/list/List', [
            'posts' => PostResource::collection($posts),
            'categories' => CategoryResource::collection($categories),
            'filters' => $filters,
            'statuses' => Post::getStatuses(),
        ]);
    }

    /**
     * Affiche un post spécifique.
     */
    public function blogShow(Post $post, Request $request)
    {
        $post->incrementViews();
        $post->load(['categories', 'media', 'user', 'tags']);

        $previousPost = $post->getPreviousPublished();
        $nextPost = $post->getNextPublished();
        $relatedPosts = $post->getRelatedPosts(3);

        $data = [
            'post' => new PostResource($post),
            'previousPost' => $previousPost ? new PostResource($previousPost) : null,
            'nextPost' => $nextPost ? new PostResource($nextPost) : null,
            'relatedPosts' => PostResource::collection($relatedPosts),
        ];

        Log::info('Données envoyées à Inertia', $data);

        return Inertia::render('main/blog/show/Show', $data);
    }

    public function blogByCategory(PostCategory $category)
    {
        return route('blog.index', ['tag' => $category->slug]);
    }

    public function blogComment() {}

    public function blogLike() {}
}
