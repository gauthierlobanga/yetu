<?php

namespace App\Http\Controllers\Central\Pages\Faq;

use App\Http\Controllers\Controller;
use Inertia\Inertia;

class FaqController extends Controller
{
    public function faq()
    {
        return Inertia::render('app/faq/Faq');
    }

}
