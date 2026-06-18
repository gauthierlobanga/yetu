<?php

namespace App\Http\Controllers\Vendor\Boutique\Pages\Term;

use App\Http\Controllers\Controller;
use Inertia\Inertia;

class TermController extends Controller
{


    public function terms()
    {
        return Inertia::render('Vendor/pages/terms/Terms');
    }

}
