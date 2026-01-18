<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Product;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class SearchController extends Controller
{
    public function __invoke(Request $request): JsonResponse
    {
        $query = $request->input('q', '');

        if (strlen($query) < 2) {
            return response()->json(['products' => []]);
        }

        $products = Product::search($query)
            ->query(function ($builder) {
                $builder->where('status', true)
                    ->with('brand:id,name');
            })
            ->take(6)
            ->get();
            
        return response()->json([
            'products' => $products->toResourceCollection(),
        ]);
    }
}
