<?php

namespace App\Http\Controllers\Central\Pages\Support;

use App\Http\Controllers\Controller;
use Inertia\Inertia;

class SupportController extends Controller
{

    public function support()
    {
        return Inertia::render('app/support/Support');
    }
}
