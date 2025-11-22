<?php

namespace App\Http\Controllers;

use App\Http\Resources\BrandResource;
use App\Http\Resources\ProductResource;
use App\Models\Brand;
use App\Models\Product;
use App\Traits\PriceFilterable;
use App\Traits\Sortable;
use App\Traits\StockFilterable;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;
use Inertia\Inertia;

class BrandController extends Controller
{
    use PriceFilterable, Sortable, StockFilterable;

    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $brands = BrandResource::collection(Brand::paginate(12));

        return Inertia::render('brands/index', [
            'brands' => fn () => $brands,
        ]);
    }

    /**
     * Display the specified resource.
     */
    public function show(Brand $brand, Request $request)
    {
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

        $query = $brand->products()->with(['featuredImage', 'brand']);

        $this->applyStockFilter($query, $in, $out);
        $this->applyPriceFilter($query, $minPrice, $maxPrice);
        $this->applySort($query, $sort);

        return Inertia::render('brands/show', [
            'brand' => fn () => BrandResource::make($brand),
            'products' => fn () => ProductResource::collection($query->paginate(12)),
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
