<?php

namespace App\Http\Controllers;

use App\Http\Resources\ProductResource;
use App\Models\Product;
use App\Traits\Sortable;
use App\Traits\StockFilterable;
use Illuminate\Http\Request;
use Inertia\Inertia;

class PromotionController extends Controller
{
    use StockFilterable, Sortable;

    public function __invoke(Request $request)
    {
        $query = Product::with(['featuredImage', 'brand'])
            ->whereNotNull('discount_price');
        $in = $request->boolean('in');
        $out = $request->boolean('out');

        if ($query->count() === 0) {
            return redirect()->route('home')->withErrors('Aucune promotion n\'est actuellement disponible.');
        }

        $sort = $request->query('sort', 'news');

        $this->applyStockFilter($query, $in, $out);
        $this->applySort($query, $sort);

        return Inertia::render('promotions/show', [
            'products' => fn() => ProductResource::collection($query->paginate(12)),
            'stock' => [
                'in' => $in,
                'out' => $out,
            ],
        ]);
    }
}
