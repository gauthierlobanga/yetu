<?php

namespace App\Http\Controllers\Central\Pages\Cookie;

use App\Http\Controllers\Controller;
use Inertia\Inertia;

class CookieController extends Controller
{

    public function cookie()
    {
        return Inertia::render('app/cookies/Cookies');
    }

}
