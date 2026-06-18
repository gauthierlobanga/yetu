<?php

namespace App\Http\Controllers\Central\Pages\Privacy;

use App\Http\Controllers\Controller;
use Inertia\Inertia;

class PrivacyController extends Controller
{

    public function privacy()
    {
        return Inertia::render('app/privacy/Privacy');
    }

}
