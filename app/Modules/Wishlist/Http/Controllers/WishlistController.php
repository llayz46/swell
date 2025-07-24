<?php

namespace App\Modules\Wishlist\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Http\Resources\ProductResource;
use App\Modules\Wishlist\Actions\Wishlist\HandleProductWishlist;
use App\Modules\Wishlist\Factories\WishlistFactory;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Inertia\Inertia;

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
        if (!config('swell.wishlist.enabled', false)) abort(404);

        return Inertia::render('dashboard/wishlist', [
            'items' => Inertia::defer(fn () => auth()->user()->wishlist?->products
                ? ProductResource::collection(auth()->user()->wishlist->products->load('brand', 'featuredImage'))
                : []
            )
        ]);
    }

    /**
     * Store a new product in the wishlist.
     *
     * @param Request $request
     * @return \Illuminate\Http\RedirectResponse
     */
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

    /**
     * Update the wishlist by removing a product.
     *
     * @param Request $request
     * @return \Illuminate\Http\RedirectResponse
     */
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

    /**
     * Clear the wishlist.
     *
     * @return \Illuminate\Http\RedirectResponse
     */
    public function destroy()
    {
        $wishlist = WishlistFactory::make();

        $this->handleProductWishlist->clear($wishlist);

        return redirect()->back();
    }
}
