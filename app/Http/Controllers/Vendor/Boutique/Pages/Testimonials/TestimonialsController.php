<?php

namespace App\Http\Controllers\Vendor\Boutique\Pages\Testimonials;

use App\Http\Controllers\Controller;

class TestimonialsController extends Controller
{
    public function index()
    {
        return inertia('Shop/Testimonials/Index', []);
    }
}
