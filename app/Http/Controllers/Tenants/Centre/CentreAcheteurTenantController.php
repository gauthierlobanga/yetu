<?php

namespace App\Http\Controllers\Tenants\Centre;

use App\Http\Controllers\Controller;
use Inertia\Inertia;

class CentreAcheteurTenantController extends Controller
{
    public function index()
    {
        return Inertia::render('tenants/acheteur/Index');
    }
}
