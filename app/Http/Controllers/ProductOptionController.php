<?php

namespace App\Http\Controllers;

use App\Http\Resources\ProductOptionResource;
use App\Models\ProductOption;
use Illuminate\Http\Request;

class ProductOptionController extends Controller
{
    public function index()
    {
        return ProductOptionResource::collection(ProductOption::all());
    }

    public function store(Request $request)
    {
        $data = $request->validate([

        ]);

        return new ProductOptionResource(ProductOption::create($data));
    }

    public function show(ProductOption $productOption)
    {
        return new ProductOptionResource($productOption);
    }

    public function update(Request $request, ProductOption $productOption)
    {
        $data = $request->validate([

        ]);

        $productOption->update($data);

        return new ProductOptionResource($productOption);
    }

    public function destroy(ProductOption $productOption)
    {
        $productOption->delete();

        return response()->json();
    }
}
