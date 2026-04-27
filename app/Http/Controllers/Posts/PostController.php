<?php

namespace App\Http\Controllers\Posts;

use App\Http\Controllers\Controller;
use App\Http\Requests\Posts\StorePostRequest;
use App\Http\Requests\Posts\UpdatePostRequest;
use App\Http\Resources\CategoryResource;
use App\Http\Resources\PostResource;
use App\Models\Post;
use App\Models\PostCategory;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\Str;
use Inertia\Inertia;

// use Inertia\Response;

class PostController extends Controller
{
    /**
     * Affiche la liste des posts de l'utilisateur connecté.
     */
    public function index(Request $request)
    {
        $user = Auth::user();

        $filters = $request->validate([
            'search' => 'nullable|string|max:100',
            'status' => 'nullable|string|in:'.implode(',', array_keys(Post::getStatuses())),
            'category_id' => 'nullable|exists:posts_categories,id',
            'sort' => 'nullable|string|in:created_at,published_at,title,views_count',
            'direction' => 'nullable|string|in:asc,desc',
            'page' => 'nullable|integer|min:1',
            'per_page' => 'nullable|integer|min:1|max:100',
        ]);

        $query = Post::with([
            'categories' => fn ($q) => $q->select('posts_categories.id', 'nom', 'slug', 'color'),
            'media',
            'tags',
            'user' => fn ($q) => $q->select('id', 'name', 'email'),
        ])->where('user_id', $user->id);

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

        if (! empty($filters['category_id'])) {
            $query->whereHas('categories', fn ($q) => $q->where('posts_categories.id', $filters['category_id']));
        }

        // Tri
        $sort = $filters['sort'] ?? 'published_at';
        $direction = $filters['direction'] ?? 'desc';
        $query->orderBy($sort, $direction);

        $perPage = $filters['per_page'] ?? 8;
        $posts = $query->paginate($perPage);

        // 🔥 N'ajouter query string que s'il y a des filtres ou si pas page 1
        if (count(array_filter($filters)) > 0 || ($posts->currentPage() > 1)) {
            $posts->withQueryString();
        }

        $categories = PostCategory::select('id', 'nom', 'slug')
            ->where('est_active', true)
            ->orderBy('nom')
            ->get();

        return Inertia::render('Posts/List', [
            'posts' => PostResource::collection($posts),
            'categories' => CategoryResource::collection($categories),
            'filters' => $filters,
            'statuses' => Post::getStatuses(),
        ]);
    }

    /**
     * Affiche le formulaire de création d'un nouveau post.
     */
    public function create()
    {
        // Récupérer les catégories actives pour le formulaire
        $categories = PostCategory::select('id', 'nom', 'slug', 'parent_id', 'color')
            ->where('est_active', true)
            ->orderBy('nom')
            ->get(); // Si vous avez une méthode pour organiser en arbre

        return Inertia::render('Posts/Create', [
            'categories' => CategoryResource::collection($categories),
            'statuses' => Post::getStatuses(),
        ]);
    }

    /**
     * Enregistre un nouveau post.
     */
    public function store(StorePostRequest $request)
    {
        try {
            DB::beginTransaction();

            // Créer le post avec les données validées
            $post = Post::create([
                ...$request->validated(),
                'user_id' => Auth::id(),
                'slug' => $request->slug ?? Str::slug($request->title),
            ]);

            // Synchroniser les catégories
            if ($request->has('categories')) {
                $post->syncCategories(
                    $request->categories,
                    $request->primary_category_id
                );
            }

            // Gérer l'image à la une
            if ($request->hasFile('featured_image')) {
                $post->addMedia($request->file('featured_image'))
                    ->toMediaCollection('featured');
            }

            // Gérer la galerie d'images
            if ($request->hasFile('gallery')) {
                foreach ($request->file('gallery') as $image) {
                    $post->addMedia($image)->toMediaCollection('gallery');
                }
            }

            // Gérer les pièces jointes
            if ($request->hasFile('attachments')) {
                foreach ($request->file('attachments') as $file) {
                    $post->addMedia($file)->toMediaCollection('attachments');
                }
            }

            DB::commit();

            return redirect()
                ->route('post.show', $post->slug)
                ->with('success', 'Post créé avec succès.');
        } catch (\Exception $e) {
            DB::rollBack();

            return redirect()
                ->back()
                ->withInput()
                ->with('error', 'Erreur lors de la création du post: '.$e->getMessage());
        }
    }

    /**
     * Affiche un post spécifique.
     */
    public function show(Post $post)
    {
        // Vérifier les permissions
        Gate::authorize('view', $post);

        // Incrémenter le compteur de vues
        $post->incrementViews();

        // Charger les relations nécessaires
        $post->load([
            'categories' => fn ($q) => $q->select('posts_categories.id', 'nom', 'slug', 'color'),
            'media' => fn ($q) => $q->select('id', 'model_id', 'collection_name', 'name', 'file_name', 'mime_type', 'size'),
            'user' => fn ($q) => $q->select('id', 'name', 'email'),
            'tags' => fn ($q) => $q->select('id', 'name', 'slug', 'order_column'),
        ]);

        // Récupérer les posts précédent/suivant
        $previousPost = $post->getPreviousPublished();
        $nextPost = $post->getNextPublished();

        // Récupérer les posts liés
        $relatedPosts = $post->getRelatedPosts(3);

        return Inertia::render('Posts/Show', [
            'post' => new PostResource($post),
            'previousPost' => $previousPost ? new PostResource($previousPost) : null,
            'nextPost' => $nextPost ? new PostResource($nextPost) : null,
            'relatedPosts' => PostResource::collection($relatedPosts),
        ]);
    }

    /**
     * Affiche le formulaire d'édition.
     */
    public function edit(Post $post)
    {
        Gate::authorize('update', $post);

        // Charger les relations
        $post->load(['categories', 'media', 'tags']);

        // Récupérer toutes les catégories actives
        $categories = PostCategory::select('id', 'nom', 'slug', 'parent_id', 'color')
            ->where('est_active', true)
            ->orderBy('nom')
            ->get();

        return Inertia::render('Posts/Edit', [
            'post' => new PostResource($post),
            'categories' => CategoryResource::collection($categories),
            'statuses' => Post::getStatuses(),
        ]);
    }

    /**
     * Met à jour un post existant.
     */
    public function update(UpdatePostRequest $request, Post $post)
    {
        Gate::authorize('update', $post);

        try {
            DB::beginTransaction();

            // Mettre à jour le post
            $post->update($request->validated());

            // Mettre à jour les catégories
            if ($request->has('categories')) {
                $post->syncCategories(
                    $request->categories,
                    $request->primary_category_id
                );
            }

            // Gérer l'image à la une
            if ($request->hasFile('featured_image')) {
                $post->clearMediaCollection('featured');
                $post->addMedia($request->file('featured_image'))
                    ->toMediaCollection('featured');
            }

            // Gérer la galerie d'images
            if ($request->hasFile('gallery')) {
                foreach ($request->file('gallery') as $image) {
                    $post->addMedia($image)->toMediaCollection('gallery');
                }
            }

            DB::commit();

            return redirect()
                ->route('post.show', $post->slug)
                ->with('success', 'Post mis à jour avec succès.');
        } catch (\Exception $e) {
            DB::rollBack();

            return redirect()
                ->back()
                ->withInput()
                ->with('error', 'Erreur lors de la mise à jour: '.$e->getMessage());
        }
    }

    /**
     * Supprime un post.
     */
    public function destroy(Post $post)
    {
        Gate::authorize('delete', $post);

        try {
            DB::beginTransaction();

            // Détacher les catégories
            $post->categories()->detach();

            // Supprimer les médias associés
            $post->clearMediaCollection('featured');
            $post->clearMediaCollection('gallery');
            $post->clearMediaCollection('attachments');

            // Supprimer le post (soft delete)
            $post->delete();

            DB::commit();

            return redirect()
                ->route('post.list')
                ->with('success', 'Post supprimé avec succès.');
        } catch (\Exception $e) {
            DB::rollBack();

            return redirect()
                ->back()
                ->with('error', 'Erreur lors de la suppression: '.$e->getMessage());
        }
    }

    /**
     * Méthodes supplémentaires pour les actions en masse
     */
    public function bulkDelete(Request $request)
    {
        $request->validate([
            'ids' => 'required|array',
            'ids.*' => 'exists:posts,id',
        ]);

        Gate::authorize('bulkDelete', Post::class);

        $count = Post::whereIn('id', $request->ids)
            ->where('user_id', Auth::id())
            ->delete();

        return redirect()
            ->route('post.list')
            ->with('success', "{$count} post(s) supprimé(s) avec succès.");
    }

    public function bulkStatus(Request $request): RedirectResponse
    {
        $request->validate([
            'ids' => 'required|array',
            'ids.*' => 'exists:posts,id',
            'status' => 'required|string|in:'.implode(',', array_keys(Post::getStatuses())),
        ]);

        Gate::authorize('bulkUpdate', Post::class);

        $count = Post::whereIn('id', $request->ids)
            ->where('user_id', Auth::id())
            ->update(['status' => $request->status]);

        return redirect()
            ->route('post.list')
            ->with('success', "{$count} post(s) mis à jour avec succès.");
    }

    /**
     * Toggle pin/unpin
     */
    public function togglePin(Post $post)
    {
        Gate::authorize('update', $post);

        $post->update(['is_pinned' => ! $post->is_pinned]);

        return redirect()
            ->back()
            ->with('success', $post->is_pinned ? 'Post épinglé' : 'Post désépinglé');
    }

    /**
     * Duplique un post existant
     */
    public function duplicate(Post $post)
    {
        Gate::authorize('update', $post);

        try {
            DB::beginTransaction();

            // Créer une copie du post
            $newPost = $post->replicate();
            $newPost->title = $post->title.' (copie)';
            $newPost->slug = Str::slug($newPost->title).'-'.uniqid();
            $newPost->status = Post::STATUS_DRAFT;
            $newPost->is_pinned = false;
            $newPost->views_count = 0;
            $newPost->likes_count = 0;
            $newPost->comments_count = 0;
            $newPost->published_at = null;
            $newPost->scheduled_for = null;
            $newPost->expires_at = null;
            $newPost->created_at = now();
            $newPost->updated_at = now();
            $newPost->save();

            // Dupliquer les catégories
            $categoryIds = $post->categories()->pluck('posts_categories.id')->toArray();
            $newPost->categories()->sync($categoryIds);

            // Dupliquer les médias (featured image)
            $featuredMedia = $post->getFirstMedia('featured');
            if ($featuredMedia) {
                $featuredMedia->copy($newPost, 'featured');
            }

            // Dupliquer la galerie
            $galleryMedia = $post->getMedia('gallery');
            foreach ($galleryMedia as $media) {
                $media->copy($newPost, 'gallery');
            }

            DB::commit();

            if (request()->wantsJson()) {
                return response()->json([
                    'message' => 'Post dupliqué avec succès',
                    'new_post_id' => $newPost->id,
                ]);
            }

            return redirect()
                ->back()
                ->with('success', 'Post dupliqué avec succès. Vous pouvez maintenant modifier la copie.');
        } catch (\Exception $e) {
            DB::rollBack();

            if (request()->wantsJson()) {
                return response()->json(['error' => $e->getMessage()], 500);
            }

            return redirect()
                ->back()
                ->with('error', 'Erreur lors de la duplication: '.$e->getMessage());
        }
    }
}
