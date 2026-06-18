<?php

namespace App\Http\Controllers\Vendor\Boutique\Pages\Faq;

use App\Http\Controllers\Controller;
use Inertia\Inertia;

class FaqController extends Controller
{
    public function faq()
    {
        return Inertia::render('Vendor/pages/faq/Faq');
    }

}
