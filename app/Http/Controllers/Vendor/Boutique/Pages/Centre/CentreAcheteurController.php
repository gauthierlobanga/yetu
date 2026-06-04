<?php

namespace App\Http\Controllers\Vendor\Boutique\Pages\Centre;

use App\Http\Controllers\Controller;
use Inertia\Inertia;

class CentreAcheteurController extends Controller
{
    public function index()
    {
        return Inertia::render('Shop/Acheteur/Index', []);
    }
}
