<?php

namespace App\Http\Controllers\Vendor\Boutique\Pages\Help;

use App\Http\Controllers\Controller;
use Inertia\Inertia;

class HelpController extends Controller
{

    public function help()
    {
        return Inertia::render('Vendor/pages/help/Help');
    }

}
