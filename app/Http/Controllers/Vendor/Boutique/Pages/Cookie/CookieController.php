<?php

namespace App\Http\Controllers\Vendor\Boutique\Pages\Cookie;

use App\Http\Controllers\Controller;
use Inertia\Inertia;

class CookieController extends Controller
{

    public function cookie()
    {
        return Inertia::render('Vendor/pages/cookies/Cookies');
    }

}
