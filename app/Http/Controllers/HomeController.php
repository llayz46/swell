<?php

namespace App\Http\Controllers;

use App\Http\Resources\ProductResource;
use App\Models\Product;
use Inertia\Inertia;

class HomeController extends Controller
{
    public function __invoke()
    {
        $products = Product::latest()
            ->take(4)->with(['featuredImage', 'brand'])
            ->where('status', true)
            ->get();

        return Inertia::render('home', [
            'products' => fn () => ProductResource::collection($products),
        ]);
    }
}
