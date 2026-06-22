<?php

namespace App\Http\Controllers\Central;

use App\Http\Controllers\Controller;
use App\Models\Post;
use App\Models\PostCategory;
use Illuminate\Http\Request;
use Spatie\Sitemap\Sitemap;
use Spatie\Sitemap\Tags\Url;

class SitemapController extends Controller
{
    public function index()
    {
        $sitemap = Sitemap::create()
            ->add(Url::create(route('home'))->setPriority(1.0)->setChangeFrequency(Url::CHANGE_FREQUENCY_DAILY))
            ->add(Url::create(route('blog.index'))->setPriority(0.9)->setChangeFrequency(Url::CHANGE_FREQUENCY_DAILY))
            ->add(Url::create(route('contact'))->setPriority(0.5)->setChangeFrequency(Url::CHANGE_FREQUENCY_MONTHLY))
            ->add(Url::create(route('about'))->setPriority(0.5)->setChangeFrequency(Url::CHANGE_FREQUENCY_MONTHLY))
            ->add(Url::create(route('terms'))->setPriority(0.1)->setChangeFrequency(Url::CHANGE_FREQUENCY_YEARLY))
            ->add(Url::create(route('privacy'))->setPriority(0.1)->setChangeFrequency(Url::CHANGE_FREQUENCY_YEARLY))
            ->add(Url::create(route('support'))->setPriority(0.5)->setChangeFrequency(Url::CHANGE_FREQUENCY_MONTHLY))
            ->add(Url::create(route('faq'))->setPriority(0.5)->setChangeFrequency(Url::CHANGE_FREQUENCY_MONTHLY));

        $sitemap->add(Post::published()->get());
        $sitemap->add(PostCategory::all());

        return $sitemap->toResponse(request());
    }
}
