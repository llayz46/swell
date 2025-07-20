<?php

namespace App\Http\Controllers\Admin;

use App\Actions\Product\HandleProduct;
use App\Http\Controllers\Controller;
use App\Http\Requests\ProductRequest;
use App\Http\Resources\ProductResource;
use App\Models\Brand;
use App\Models\Product;
use App\Models\ProductGroup;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;

class ProductController extends Controller
{
    /**
     * @var HandleProduct
     */
    protected HandleProduct $handleProduct;

    /**
     * Admin\ProductController constructor.
     *
     * @param HandleProduct $handleProduct
     */
    public function __construct(HandleProduct $handleProduct)
    {
        $this->handleProduct = $handleProduct;
    }

    public function index(Request $request)
    {
        $search = $request->input('search');
        $groupId = $request->input('group_id');

        if ($search) {
            $products = Product::search($search)
                ->query(function ($query) use ($groupId) {
                    $query->where('status', true)
                        ->with('brand', 'group:id');

                    if ($groupId) {
                        $query->where('product_group_id', $groupId);
                    }
                })->paginate(16)->withQueryString();
        } else {
            $query = Product::query()
                ->where('status', true)
                ->with('brand', 'group:id');

            if ($groupId) {
                $query->where('product_group_id', $groupId);
            }

            $products = $query->paginate(16)->withQueryString();
        }

        return Inertia::render('admin/products/index', [
            'breadcrumbs' => [
                ['title' => 'Admin', 'href' => route('admin.dashboard')],
                ['title' => 'Produits', 'href' => route('admin.products.index')],
            ],
            'search' => fn () => $search,
            'groupId' => fn () => $groupId,
            'products' => Inertia::defer(fn () => ProductResource::collection($products)),
        ]);
    }

    public function create(Request $request)
    {
        $product = Product::find($request->input('duplicate'));

        return Inertia::render('admin/products/create', [
            'breadcrumbs' => [
                ['title' => 'Admin', 'href' => route('admin.dashboard')],
                ['title' => 'Produits', 'href' => route('admin.products.index')],
                ['title' => 'Créer un produit', 'href' => route('admin.products.create')],
            ],
            'brands' => fn () => Brand::select('id', 'name')->orderBy('name')->get(),
            'groups' => fn () => ProductGroup::select('id', 'name')->orderBy('name')->get()->load('products:id,name,product_group_id'),
            'duplicate' => (bool)$product,
            'product' => fn () => $product ? ProductResource::make($product->load(['images', 'brand:id,name', 'categories:id,parent_id', 'group:id,name'])) : null
        ]);
    }

    public function show(Product $product)
    {
        return Inertia::render('admin/products/show', [
            'breadcrumbs' => [
                ['title' => 'Admin', 'href' => route('admin.dashboard')],
                ['title' => 'Produits', 'href' => route('admin.products.index')],
                ['title' => $product->name, 'href' => route('admin.products.show', $product)],
            ],
            'product' => fn () => ProductResource::make($product->load([
                'images' => function($query) {
                    $query->orderBy('order');
                },
                'brand',
                'categories',
                'group'
            ])),
        ]);
    }

    public function store(ProductRequest $request)
    {
        $data = $request->validated();

        try {
            $product = $this->handleProduct->create($data);
        } catch (\Exception $e) {
            Log::error($e->getMessage());
            return redirect()->back()->withErrors(['error' => 'Une erreur est survenue lors de la création du produit.']);
        }

        return redirect()->route('admin.products.show', $product)->with('success', 'Produit créé avec succès.');
    }

    public function edit(Product $product)
    {
        return Inertia::render('admin/products/edit', [
            'breadcrumbs' => [
                ['title' => 'Admin', 'href' => route('admin.dashboard')],
                ['title' => 'Produits', 'href' => route('admin.products.index')],
                ['title' => $product->name, 'href' => route('admin.products.show', $product)],
                ['title' => 'Modifier', 'href' => route('admin.products.edit', $product)],
            ],
            'product' => fn () => ProductResource::make($product->load(['images', 'brand:id,name', 'categories:id,parent_id', 'group:id,name'])),
            'brands' => fn () => Brand::select('id', 'name')->orderBy('name')->get(),
            'groups' => fn () => ProductGroup::select('id', 'name')->orderBy('name')->get()->load('products:id,name,product_group_id'),
        ]);
    }

    public function update(ProductRequest $request, Product $product)
    {
        $data = $request->validated();

        try {
            $this->handleProduct->update($product, $data);
        } catch (\Exception $e) {
            Log::error($e->getMessage());
            return redirect()->back()->withErrors(['error' => 'Une erreur est survenue lors de la mise à jour du produit.']);
        }

        return redirect()->route('admin.products.edit', $product);
    }

    public function destroy(Request $request, Product $product)
    {
        $request->validate(
            ['name' => 'required|in:' . $product->name],
            [
                'name.required' => 'Le nom du produit est requis.',
                'name.in' => 'Le nom saisi ne correspond pas au nom du produit à supprimer.',
            ]
        );

        try {
            $product->delete();
        } catch (\Exception $e) {
            Log::error($e->getMessage());
            return redirect()->back()->withErrors(['error' => 'Impossible de supprimer le produit.']);
        }

        return redirect()->route('admin.products.index')->with('success', 'Produit supprimé avec succès.');
    }
}
