<?php

namespace App\Http\Controllers\Central\Pages\Help;

use App\Http\Controllers\Controller;
use Inertia\Inertia;

class HelpController extends Controller
{

    public function help()
    {
        return Inertia::render('app/help/Help');
    }

}
