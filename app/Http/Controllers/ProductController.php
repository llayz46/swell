<?php

namespace App\Http\Controllers;

use App\Http\Resources\ProductResource;
use App\Models\Category;
use App\Models\Product;
use App\Modules\Review\Http\Resources\ReviewResource;
use App\Traits\PriceFilterable;
use App\Traits\Sortable;
use App\Traits\StockFilterable;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;
use Inertia\Inertia;

class ProductController extends Controller
{
    use PriceFilterable, Sortable, StockFilterable;

    /**
     * Display a listing of the resource.
     *
     * @return \Inertia\Response
     */
    public function index(Request $request)
    {
        $sort = $request->query('sort', 'news');
        $search = $request->input('search');
        $in = $request->boolean('in');
        $out = $request->boolean('out');
        $minPrice = $request->has('min_price') ? (float) $request->input('min_price') : null;
        $maxPrice = $request->has('max_price') ? (float) $request->input('max_price') : null;

        $maxProductPrice = Cache::remember('products:max_price', now()->addHour(), function () {
            return Product::where('status', true)
                ->selectRaw('MAX(COALESCE(NULLIF(discount_price, 0), price)) as max_price')
                ->value('max_price') ?? 1000;
        });

        if ($search) {
            $searchBuilder = Product::search($search, function ($algolia, $query, $options) use ($minPrice, $maxPrice, $sort) {
                $numericFilters = [];
                if ($minPrice !== null) {
                    $numericFilters[] = "effective_price >= {$minPrice}";
                }
                if ($maxPrice !== null) {
                    $numericFilters[] = "effective_price <= {$maxPrice}";
                }

                $options['numericFilters'] = array_merge(
                    (array) ($options['numericFilters'] ?? []),
                    $numericFilters
                );

                $indexName = match($sort) {
                    'price_asc' => 'products_price_asc',
                    'price_desc' => 'products_price_desc',
                    'news' => 'products_created_at_desc',
                    default => (new Product)->searchableAs(),
                };

                return $algolia->searchSingleIndex(
                    $indexName,
                    array_merge(['query' => $query], $options)
                );
            });

            $products = $searchBuilder->query(function ($query) use ($in, $out) {
                $query->where('status', true)
                    ->with('featuredImage', 'brand');

                $this->applyStockFilter($query, $in, $out);
            })->paginate(16)->withQueryString();
        } else {
            $query = Product::query()
                ->where('status', true)
                ->with('featuredImage', 'brand');

            $this->applyStockFilter($query, $in, $out);
            $this->applyPriceFilter($query, $minPrice, $maxPrice);
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
            'price' => [
                'min' => $minPrice,
                'max' => $maxPrice,
                'max_available' => $maxProductPrice,
            ],
        ]);
    }

    /**
     * Display the specified resource.
     */
    public function show(Product $product)
    {
        if (! $product->status) abort(404);

        $cacheKey = "product:{$product->id}:details";

        $productResource = Cache::remember($cacheKey, now()->addHour(), fn () => ProductResource::make(
            $product->load([
                'brand',
                'collection.products.featuredImage',
                'images' => function ($query) {
                    $query->orderBy('order');
                },
                'category',
                'options.values',
            ])
        ));

        $similarProducts = Cache::remember("product:{$product->id}:similar", now()->addHour(), fn () => ProductResource::collection(
            Category::find($product->category->pluck('id')->toArray())
                ->load(['products' => function ($query) use ($product) {
                    $query->where('id', '!=', $product->id)
                        ->orderBy('created_at', 'desc')
                        ->with('brand', 'featuredImage')
                        ->take(4);
                }])
                ->flatten()
        ));

        return Inertia::render('products/show', [
            'product' => fn () => $productResource,
            'reviews' => fn () => ReviewResource::collection(config('swell.review.enabled', true) ? $product->reviews()->with('user')->latest()->take(5)->get() : []),
            'similarProducts' => fn () => $similarProducts[0]->products ?? [],
        ]);
    }
}
