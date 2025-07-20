<?php

namespace App\Http\Controllers;

use App\Enums\CategoryStatus;
use App\Http\Resources\CategoryResource;
use App\Http\Resources\ProductResource;
use App\Models\Category;
use App\Traits\Sortable;
use App\Traits\StockFilterable;
use Illuminate\Http\Request;
use Inertia\Inertia;

class CategoryController extends Controller
{
    use StockFilterable, Sortable;

    /**
     * Handle the incoming request.
     *
     * @param Category $category
     * @param Request $request
     * @return \Inertia\Response
     */
    public function __invoke(Category $category, Request $request)
    {
        if($category->status->value === CategoryStatus::Inactive->value) abort(404);

        $sort = $request->query('sort', 'news');
        $in = $request->boolean('in');
        $out = $request->boolean('out');

        $query = $category->products()->where('status', true)->with(['featuredImage', 'brand']);

        $this->applyStockFilter($query, $in, $out);
        $this->applySort($query, $sort);

        return Inertia::render('categories/show', [
            'category' => fn () => CategoryResource::make($category->load('parent')),
            'data' => fn () => ProductResource::collection($query->paginate(12)),
            'sort' => $sort,
            'stock' => [
                'in' => $in,
                'out' => $out,
            ],
        ]);
    }
}

