<?php

namespace App\Http\Controllers;

use App\Actions\Wishlist\HandleProductWishlist;
use App\Factories\WishlistFactory;
use App\Http\Resources\ProductResource;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use Illuminate\Http\Request;

class WishlistController extends Controller
{
    /**
     * @var HandleProductWishlist
     */
    protected HandleProductWishlist $handleProductWishlist;

    /**
     * WishlistController constructor.
     *
     * @param HandleProductWishlist $handleProductWishlist
     */
    public function __construct(HandleProductWishlist $handleProductWishlist)
    {
        $this->handleProductWishlist = $handleProductWishlist;
    }

    /**
     * Display the wishlist.
     *
     * @return \Inertia\Response
     */
    public function index()
    {

        return Inertia::render('dashboard/wishlist', [
            'items' => fn () => auth()->user()->wishlist?->products
                ? ProductResource::collection(auth()->user()->wishlist->products->load('brand', 'featuredImage'))
                : [],
        ]);
    }

    public function store(Request $request)
    {
        $wishlist = WishlistFactory::make();

        $existingProductIds = $wishlist->products()->pluck('products.id')->toArray();

        $request->validate([
            'product_id' => [
                'required',
                'exists:products,id',
                Rule::notIn($existingProductIds),
            ],
        ]);

        $this->handleProductWishlist->add($request->product_id, $wishlist);

        return redirect()->back();
    }

    public function update(Request $request)
    {
        $wishlist = WishlistFactory::make();

        $request->validate([
            'product_id' => [
                'required',
                'exists:products,id',
                Rule::in($wishlist->products()->pluck('products.id')->toArray()),
            ],
        ]);

        $this->handleProductWishlist->remove($request->product_id, $wishlist);

        return redirect()->back();
    }

    public function destroy()
    {
        $wishlist = WishlistFactory::make();

        $this->handleProductWishlist->clear($wishlist);

        return redirect()->back();
    }
}
