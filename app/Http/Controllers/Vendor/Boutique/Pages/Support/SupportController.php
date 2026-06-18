<?php

namespace App\Http\Controllers\Vendor\Boutique\Pages\Support;

use App\Http\Controllers\Controller;
use Inertia\Inertia;

class SupportController extends Controller
{

    public function support()
    {
        return Inertia::render('Vendor/pages/support/Support');
    }
}
