<?php

namespace App\Http\Controllers\Central\Pages\Term;

use App\Http\Controllers\Controller;
use Inertia\Inertia;

class TermController extends Controller
{


    public function terms()
    {
        return Inertia::render('app/terms/Terms');
    }

}
