<?php

namespace App\Http\Controllers\Tenants\Seller;

use App\Http\Controllers\Controller;
use Inertia\Inertia;

class FournisseurTenantController extends Controller
{
    public function index()
    {
        return Inertia::render('tenants/seller/Index');
    }
}
