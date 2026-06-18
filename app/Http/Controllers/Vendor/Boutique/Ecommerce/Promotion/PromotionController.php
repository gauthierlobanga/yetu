<?php

namespace App\Http\Controllers\Vendor\Boutique\Ecommerce\Promotion;

use App\Http\Controllers\Controller;
use App\Models\Promotion;
use Inertia\Inertia;

class PromotionController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function promotionsIndex()
    {
        $promotions = Promotion::where('est_active', true)
            ->where('date_debut', '<=', now())
            ->where(function ($q) {
                $q->whereNull('date_fin')->orWhere('date_fin', '>=', now());
            })
            ->get();

        return Inertia::render('Vendor/boutique/Promotions/Index', [
            'promotions' => $promotions,
        ]);
    }
}
