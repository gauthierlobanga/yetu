<?php

namespace App\Http\Controllers\Vendor\Boutique\Pages\Privacy;

use App\Http\Controllers\Controller;
use Inertia\Inertia;

class PrivacyController extends Controller
{

    public function privacy()
    {
        return Inertia::render('Vendor/pages/privacy/Privacy');
    }

}
