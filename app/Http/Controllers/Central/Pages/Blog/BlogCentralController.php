<?php

namespace App\Http\Controllers\Central\Pages\Blog;

use App\Http\Controllers\Controller;
use App\Http\Resources\CategoryResource;
use App\Http\Resources\PostResource;
use App\Models\Post;
use App\Models\PostCategory;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Inertia\Response;

/**
 * Contrôleur responsable de la gestion de la section Blog du panel central.
 *
 * Il gère l'affichage de la liste des articles (avec filtres, recherche et pagination),
 * l'affichage des détails d'un article spécifique, ainsi que les interactions
 * utilisateur telles que les likes et l'ajout aux favoris (bookmarks).
 */
class BlogCentralController extends Controller
{
    /**
     * Affiche la liste des articles de blog publiés.
     *
     * Cette méthode gère de multiples fonctionnalités :
     * - Redirection des anciennes requêtes de catégorie vers le format par tag.
     * - Validation et application des filtres de recherche (recherche textuelle, statut, tag).
     * - Tri dynamique (par date de publication, titre, nombre de vues, etc.).
     * - Récupération paginée des articles avec leurs relations (catégories, médias, auteur).
     *
     * @param  Request  $request  Objet contenant les paramètres de requête (filtres, tri, pagination).
     * @return Response Vue Inertia contenant les articles, les catégories disponibles et les filtres actuels.
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
            ->orderBy('nom', 'asc')
            ->get();

        return Inertia::render('app/blog/list/List', [
            'posts' => PostResource::collection($posts),
            'categories' => CategoryResource::collection($categories),
            'filters' => $filters,
            'statuses' => Post::getStatuses(),
        ]);
    }

    /**
     * Affiche les détails d'un article de blog spécifique.
     *
     * Cette méthode incrémente le compteur de vues de l'article, charge ses relations
     * nécessaires (catégories, médias, auteur, tags) et récupère des articles connexes
     * (article précédent, suivant, et articles liés). Elle vérifie également si l'utilisateur
     * connecté a aimé ou mis en favori l'article.
     *
     * @param  Post  $post  L'article de blog à afficher.
     * @param  Request  $request  Objet de requête courant.
     * @return Response Vue Inertia affichant l'article en détail avec ses métadonnées.
     */
    public function blogShow(Post $post, Request $request)
    {
        $user = Auth::user();
        $post->incrementViews();
        $post->load(['categories', 'media', 'user', 'tags']);

        $previousPost = $post->getPreviousPublished();
        $nextPost = $post->getNextPublished();
        $relatedPosts = $post->getRelatedPosts(3);

        $postResource = (new PostResource($post))->resolve();

        return Inertia::render('app/blog/show/Show', [
            'post' => [
                'data' => array_merge($postResource, [
                    'is_liked' => $post->isLikedBy($user),
                    'is_bookmarked' => $post->isBookmarkedBy($user),
                    'likes_count' => $post->likes()->count(),
                    'bookmarks_count' => $post->bookmarkedBy()->count(),
                ]),
            ],
            'previousPost' => $previousPost ? (new PostResource($previousPost))->resolve() : null,
            'nextPost' => $nextPost ? (new PostResource($nextPost))->resolve() : null,
            'relatedPosts' => PostResource::collection($relatedPosts)->resolve(),
        ]);
    }

    /**
     * Redirige vers la liste des articles filtrée par une catégorie spécifique.
     *
     * Permet d'accéder aux articles via l'identifiant ou le slug de la catégorie.
     *
     * @param  PostCategory  $category  La catégorie sélectionnée.
     * @return RedirectResponse Redirection vers la route blog.index avec le paramètre tag.
     */
    public function blogByCategory(PostCategory $category)
    {
        return route('blog.index', ['tag' => $category->slug]);
    }

    /**
     * Gère la soumission d'un commentaire sur un article.
     *
     * (Méthode actuellement vide, à implémenter pour le support des commentaires)
     */
    public function blogComment() {}

    /**
     * Ajoute ou retire un "J'aime" (Like) sur un article de blog.
     *
     * Action réservée aux utilisateurs authentifiés. Si l'utilisateur a déjà aimé
     * l'article, son "Like" est supprimé (toggle). Sinon, il est ajouté.
     *
     * @param  Post  $post  L'article sur lequel porte l'action.
     * @return JsonResponse Un JSON indiquant le succès, un message de confirmation, l'état actuel et le nouveau compteur.
     */
    public function blogLike(Post $post)
    {
        $user = Auth::user();
        if (! $user) {
            return response()->json(['message' => 'Authentification requise'], 401);
        }

        $existing = $post->likes()->where('user_id', $user->id)->first();
        if ($existing) {
            $existing->delete();
            $message = 'Like retiré';
            $isLiked = false;
        } else {
            $post->likes()->create(['user_id' => $user->id]);
            $message = 'Article aimé';
            $isLiked = true;
        }

        return response()->json([
            'success' => true,
            'message' => $message,
            'is_liked' => $isLiked,
            'likes_count' => $post->likes()->count(),
        ]);
    }

    /**
     * Ajoute ou retire un article de blog des favoris (Bookmarks) de l'utilisateur.
     *
     * Action réservée aux utilisateurs authentifiés. Permet à un utilisateur de sauvegarder
     * des articles pour les retrouver plus tard. Fonctionne sur un système de bascule (toggle).
     *
     * @param  Post  $post  L'article à ajouter ou retirer des favoris.
     * @return JsonResponse Un JSON indiquant l'état actuel du favori et le compteur total.
     */
    public function blogBookmark(Post $post)
    {
        $user = Auth::user();
        if (! $user) {
            return response()->json(['message' => 'Authentification requise'], 401);
        }

        $existing = $post->bookmarkedBy()->where('user_id', $user->id)->first();
        if ($existing) {
            $existing->delete();
            $message = 'Favori retiré';
            $isBookmarked = false;
        } else {
            $post->bookmarkedBy()->attach($user->id);
            $message = 'Article ajouté aux favoris';
            $isBookmarked = true;
        }

        return response()->json([
            'success' => true,
            'message' => $message,
            'is_bookmarked' => $isBookmarked,
            'bookmarks_count' => $post->bookmarkedBy()->count(),
        ]);
    }
}
