<?php

namespace App\Http\Controllers;

use App\Http\Resources\ProductOptionValueResource;
use App\Models\ProductOptionValue;
use Illuminate\Http\Request;

class ProductOptionValueController extends Controller
{
    public function index()
    {
        return ProductOptionValueResource::collection(ProductOptionValue::all());
    }

    public function store(Request $request)
    {
        $data = $request->validate([

        ]);

        return new ProductOptionValueResource(ProductOptionValue::create($data));
    }

    public function show(ProductOptionValue $productOptionValue)
    {
        return new ProductOptionValueResource($productOptionValue);
    }

    public function update(Request $request, ProductOptionValue $productOptionValue)
    {
        $data = $request->validate([

        ]);

        $productOptionValue->update($data);

        return new ProductOptionValueResource($productOptionValue);
    }

    public function destroy(ProductOptionValue $productOptionValue)
    {
        $productOptionValue->delete();

        return response()->json();
    }
}
