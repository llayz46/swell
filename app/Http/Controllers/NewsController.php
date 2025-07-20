<?php

namespace App\Http\Controllers;

use App\Http\Resources\ProductResource;
use App\Models\Product;
use App\Traits\Sortable;
use App\Traits\StockFilterable;
use Illuminate\Http\Request;
use Inertia\Inertia;

class NewsController extends Controller
{
    use StockFilterable, Sortable;

    public function __invoke(Request $request)
    {
        $query = Product::with(['featuredImage', 'brand'])
            ->where('created_at', '>=', now()->subDays(7));

        $sort = $request->query('sort', 'news');
        $in = $request->boolean('in');
        $out = $request->boolean('out');

        $this->applyStockFilter($query, $in, $out);
        $this->applySort($query, $sort);

        return Inertia::render('news/show', [
            'products' => fn() => ProductResource::collection($query->paginate(12)),
            'stock' => [
                'in' => $in,
                'out' => $out,
            ],
        ]);
    }
}
