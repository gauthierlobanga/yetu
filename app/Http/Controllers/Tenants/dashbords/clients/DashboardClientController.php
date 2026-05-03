<?php

namespace App\Http\Controllers\Tenants\dashbords\clients;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;

class DashboardClientController extends Controller
{
    public function index(Request $request)
    {
        return Inertia::render('tenants/dashboard/clients/dashboard');
    }
}
