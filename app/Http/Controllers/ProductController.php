<?php

namespace App\Http\Controllers;

use App\Http\Resources\ProductCommentResource;
use App\Http\Resources\ProductResource;
use App\Models\Category;
use App\Models\Product;
use App\Traits\Sortable;
use App\Traits\StockFilterable;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;
use Inertia\Inertia;

class ProductController extends Controller
{
    use StockFilterable, Sortable;

    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $sort = $request->query('sort', 'news');
        $search = $request->input('search');
        $in = $request->boolean('in');
        $out = $request->boolean('out');

        if ($search) {
            $products = Product::search($search)
                ->query(function ($query) use ($in, $out, $sort) {
                    $query->where('status', true)
                        ->with('featuredImage', 'brand');

                    $this->applyStockFilter($query, $in, $out);
                    $this->applySort($query, $sort);
                })->paginate(16)->withQueryString();
        } else {
            $query = Product::query()
                ->where('status', true)
                ->with('featuredImage', 'brand');

            $this->applyStockFilter($query, $in, $out);
            $this->applySort($query, $sort);

            $products = $query->paginate(16)->withQueryString();
        }

        return Inertia::render('products/index', [
            'search' => fn () => $search,
            'data' => fn () => ProductResource::collection($products),
            'stock' => [
                'in' => $in,
                'out' => $out,
            ],
        ]);
    }

    /**
     * Display the specified resource.
     */
    public function show(Product $product)
    {
        if(!$product->status) abort(404);

        $cacheKey = "product:{$product->id}:details";

        $productResource = Cache::remember($cacheKey, now()->addHour(), function () use ($product) {
            return ProductResource::make(
                $product->load([
                    'brand',
                    'group.products.featuredImage',
                    'images' => function ($query) {
                        $query->orderBy('order');
                    },
                    'categories'
                ])
            );
        });

        $similarProducts = Cache::remember("product:{$product->id}:similar", now()->addHour(), function () use ($product) {
            return ProductResource::collection(
                Category::find($product->categories->pluck('id'))
                    ->load(['products' => function ($query) use ($product) {
                        $query->where('id', '!=', $product->id)
                            ->orderBy('created_at', 'desc')
                            ->with('brand', 'featuredImage')
                            ->take(4);
                    }])
                    ->flatten()
            );
        });

        return Inertia::render('products/show', [
            'product' => fn () => $productResource,
            'comments' => fn () => ProductCommentResource::collection($product->comments()->with('user')->latest()->take(5)->get()),
            'similarProducts' => fn () => $similarProducts[0]->products,
        ]);
    }
}
