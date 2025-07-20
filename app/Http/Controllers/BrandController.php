<?php

namespace App\Http\Controllers;

use App\Http\Resources\BrandResource;
use App\Http\Resources\ProductResource;
use App\Models\Brand;
use App\Traits\Sortable;
use App\Traits\StockFilterable;
use Illuminate\Http\Request;
use Inertia\Inertia;

class BrandController extends Controller
{
    use StockFilterable, Sortable;

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

        $query = $brand->products()->with(['featuredImage', 'brand']);

        $this->applyStockFilter($query, $in, $out);
        $this->applySort($query, $sort);

        return Inertia::render('brands/show', [
            'brand' => fn () => BrandResource::make($brand),
            'products' => fn () => ProductResource::collection($query->paginate(12)),
            'stock' => [
                'in' => $in,
                'out' => $out,
            ],
        ]);
    }
}
