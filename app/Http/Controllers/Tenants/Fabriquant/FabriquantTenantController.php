<?php

namespace App\Http\Controllers\Tenants\Fabriquant;

use App\Http\Controllers\Controller;
use Inertia\Inertia;

class FabriquantTenantController extends Controller
{
    public function index()
    {
        return Inertia::render('tenants/fabriquant/Index', []);
    }
}
