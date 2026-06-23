<?php

namespace App\Http\Controllers\Vendor\Boutique\Ecommerce;

use App\Http\Controllers\Controller;
use App\Models\Post;
use App\Models\PostCategory;
use App\Models\ProductCategory;
use App\Models\Produit;
use Spatie\Sitemap\Sitemap;
use Spatie\Sitemap\Tags\Url;

class SitemapController extends Controller
{
    public function index()
    {
        $sitemap = Sitemap::create()
            ->add(Url::create(route('tenant.home'))->setPriority(1.0)->setChangeFrequency(Url::CHANGE_FREQUENCY_DAILY));

        $sitemap->add(Produit::published()->get());
        $sitemap->add(ProductCategory::where('est_active', true)->get());
        $sitemap->add(Post::published()->get());
        $sitemap->add(PostCategory::all());

        return $sitemap->toResponse(request());
    }
}
