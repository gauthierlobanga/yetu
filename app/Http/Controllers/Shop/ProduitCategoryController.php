<?php

namespace App\Http\Controllers\Shop;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreProduitCategoryRequest;
use App\Http\Requests\UpdateProduitCategoryRequest;
use App\Models\ProductCategory;

class ProduitCategoryController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        //
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreProduitCategoryRequest $request)
    {
        //
    }

    /**
     * Display the specified resource.
     */
    public function show(ProductCategory $produitCategory)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(ProductCategory $produitCategory)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateProduitCategoryRequest $request, ProductCategory $produitCategory)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(ProductCategory $produitCategory)
    {
        //
    }
}
