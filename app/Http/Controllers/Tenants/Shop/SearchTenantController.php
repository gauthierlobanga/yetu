<?php

namespace App\Http\Controllers\Tenants\Shop;

use App\Http\Controllers\Controller;
use App\Models\Post;
use App\Models\ProductCategory;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;

class SearchTenantController extends Controller
{
    /**
     * Page de résultats de recherche
     */
    public function search(Request $request)
    {
        $query = $request->input('q', '');
        $limit = $request->input('limit', 12);

        $results = $this->performSearch($query, $limit);

        return Inertia::render('tenants/Search/Index', [
            'results' => $results,
            'query' => $query,
        ]);
    }

    /**
     * API pour les requêtes AJAX (recherche en temps réel)
     */
    public function api(Request $request)
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
            $categories = ProductCategory::where('est_active', true)
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
}
