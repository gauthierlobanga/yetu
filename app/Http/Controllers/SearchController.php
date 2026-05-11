<?php

namespace App\Http\Controllers;

use App\Models\Post;
use App\Models\PostCategory;
use App\Models\Produit;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;

class SearchController extends Controller
{
    /**
     * Page de résultats de recherche
     */
    public function shopSearch(Request $request)
    {
        $query = $request->input('q', '');
        $limit = $request->input('limit', 12);

        $results = $this->performSearch($query, $limit);

        return Inertia::render('Search/Index', [
            'results' => $results,
            'query' => $query,
        ]);
    }

    /**
     * API pour les requêtes AJAX (recherche en temps réel)
     */
    public function shopApi(Request $request)
    {
        $query = $request->input('q', '');
        $limit = $request->input('limit', 8);

        $results = $this->performSearch($query, $limit);

        return response()->json([
            'results' => $results,
            'query' => $query,
            'total' => count($results),
        ]);
    }

    /**
     * Logique de recherche commune
     */
    private function performSearch(string $query, int $limit): array
    {
        $results = [];

        if (strlen($query) >= 2) {
            // Recherche dans les articles
            $posts = Post::with(['user', 'categories', 'media'])
                ->where('status', 'published')
                ->where(function ($q) use ($query) {
                    $q->where('title', 'LIKE', "%{$query}%")
                        ->orWhere('content', 'LIKE', "%{$query}%")
                        ->orWhere('excerpt', 'LIKE', "%{$query}%");
                })
                ->limit($limit)
                ->get();

            foreach ($posts as $post) {
                $results[] = [
                    'id' => $post->id,
                    'title' => $post->title,
                    'slug' => $post->slug,
                    'excerpt' => $post->excerpt,
                    'featured_image_thumb' => $post->featured_image_thumb,
                    'categories' => $post->categories->map(fn ($c) => [
                        'id' => $c->id,
                        'nom' => $c->nom,
                        'slug' => $c->slug,
                    ]),
                    'published_at' => $post->published_at,
                    '_type' => 'post',
                ];
            }

            // Recherche dans les catégories
            $categories = PostCategory::where('est_active', true)
                ->where('nom', 'LIKE', "%{$query}%")
                ->limit(3)
                ->get();

            foreach ($categories as $category) {
                $results[] = [
                    'id' => $category->id,
                    'nom' => $category->nom,
                    'slug' => $category->slug,
                    'posts_count' => $category->posts()->published()->count(),
                    '_type' => 'category',
                ];
            }

            // Recherche dans les utilisateurs
            $users = User::where('name', 'LIKE', "%{$query}%")
                ->limit(3)
                ->get();

            foreach ($users as $user) {
                $results[] = [
                    'id' => $user->id,
                    'name' => $user->name,
                    'avatar_url' => $user->avatar_url,
                    'views_count' => Post::where('user_id', $user->id)->count(),
                    '_type' => 'user',
                ];
            }

            // Trier par pertinence
            usort($results, function ($a, $b) {
                $order = ['post' => 1, 'category' => 2, 'user' => 3];

                return $order[$a['_type']] <=> $order[$b['_type']];
            });

            $results = array_slice($results, 0, $limit);
        }

        return $results;
    }

    /**
     * Suggestions de produits pour la recherche instantanée.
     */
    public function suggestions(Request $request)
    {
        $query = $request->input('q', '');
        if (strlen($query) < 2) {
            return response()->json(['suggestions' => []]);
        }

        $produits = Produit::where('statut', Produit::STATUS_PUBLISHED)
            ->where(function ($q) use ($query) {
                $q->where('nom', 'like', "%{$query}%")
                    ->orWhere('description_longue', 'like', "%{$query}%")
                    ->orWhere('short_description', 'like', "%{$query}%");
            })
            ->limit(5)
            ->get()
            ->map(fn ($p) => [
                'id' => $p->id,
                'nom' => $p->nom,
                'slug' => $p->slug,
                'prix' => $p->prix_actuel,          // accesseur
                'image' => $p->getImageUrl('thumb') ?? '/storage/images/Vue-Storefront.png',
            ]);

        return response()->json(['suggestions' => $produits]);
    }
}
