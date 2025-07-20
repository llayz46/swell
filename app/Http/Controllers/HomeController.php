<?php

namespace App\Http\Controllers;

use App\Http\Resources\ProductCommentResource;
use App\Http\Resources\ProductResource;
use App\Models\Product;
use App\Models\ProductComment;
use Inertia\Inertia;

class HomeController extends Controller
{
    public function __invoke()
    {
        $products = Product::latest()
            ->take(4)->with(['featuredImage', 'brand'])
            ->where('status', true)
            ->get();

        $comments = ProductComment::with(['user:id,name,avatar', 'product:id,name'])->latest()->take(3)->get();

        return Inertia::render('home', [
            'products' => fn () => ProductResource::collection($products),
            'comments' => fn () => ProductCommentResource::collection($comments),
        ]);
    }
}
