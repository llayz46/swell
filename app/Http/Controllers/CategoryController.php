<?php

namespace App\Http\Controllers;

use App\Http\Resources\CategoryResource;
use App\Http\Resources\ProductResource;
use App\Models\Category;
use App\Models\Product;
use App\Traits\PriceFilterable;
use App\Traits\Sortable;
use App\Traits\StockFilterable;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;
use Inertia\Inertia;

class CategoryController extends Controller
{
    use PriceFilterable, Sortable, StockFilterable;

    /**
     * Handle the incoming request.
     *
     * @return \Inertia\Response
     */
    public function __invoke(Category $category, Request $request)
    {
        if (! $category->status) {
            abort(404);
        }

        $sort = $request->query('sort', 'news');
        $in = $request->boolean('in');
        $out = $request->boolean('out');
        $minPrice = $request->has('min_price') ? (float) $request->input('min_price') : null;
        $maxPrice = $request->has('max_price') ? (float) $request->input('max_price') : null;

        // Récupère le prix max pour le slider (en cache)
        $maxProductPrice = Cache::remember('products:max_price', now()->addHour(), function () {
            return Product::where('status', true)
                ->selectRaw('MAX(COALESCE(discount_price, price)) as max_price')
                ->value('max_price') ?? 1000;
        });

        $query = $category->products()->where('status', true)->with(['featuredImage', 'brand']);

        $this->applyStockFilter($query, $in, $out);
        $this->applyPriceFilter($query, $minPrice, $maxPrice);
        $this->applySort($query, $sort);

        return Inertia::render('categories/show', [
            'category' => fn () => CategoryResource::make($category->load('parent')),
            'data' => fn () => ProductResource::collection($query->paginate(12)),
            'sort' => $sort,
            'stock' => [
                'in' => $in,
                'out' => $out,
            ],
            'price' => [
                'min' => $minPrice,
                'max' => $maxPrice,
                'max_available' => $maxProductPrice,
            ],
        ]);
    }
}
