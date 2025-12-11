<?php

namespace App\Http\Controllers;

use App\Actions\Stripe\CreateStripeCheckoutSession;
use App\Factories\CartFactory;
use App\Http\Requests\Cart\AddItemRequest;
use App\Http\Requests\Cart\BuyRequest;
use App\Http\Requests\Cart\HandleItemQuantityByIdRequest;
use App\Http\Requests\Cart\HandleItemQuantityRequest;
use App\Http\Requests\Cart\RemoveItemByIdRequest;
use App\Http\Requests\Cart\RemoveItemRequest;
use App\Http\Resources\CartResource;
use App\Models\Product;
use App\Services\CartService;
use Illuminate\Http\Request;
use Inertia\Inertia;

class CartController extends Controller
{
    /**
     * CartController constructor.
     *
     * @param CartService $cartService
     */
    public function __construct(
        private CartService $cartService
    ) {}

    /**
     * Display the cart.
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function index()
    {
        return response()->json([
            'cart' => $this->cartService->getCart()->toResource(),
        ]);
    }

    /**
     * Add item to the cart.
     *
     * @param AddItemRequest $request
     * @return \Illuminate\Http\JsonResponse|\Illuminate\Http\RedirectResponse
     */
    public function addItem(AddItemRequest $request)
    {
        try {
            $this->cartService->addProduct(
                productId: $request->validated('product_id'),
                quantity: $request->validated('quantity', 1),
                options: $request->validated('options')
            );
        } catch (\Exception $e) {
            return redirect()->back()->withErrors(['product_id' => $e->getMessage()]);
        }

        if ($request->wantsJson()) {
            return response()->json([
                'cart' => $this->cartService->getCart()->toResource(),
            ]);
        }

        return redirect()->back();
    }

    /**
     * Remove an item from the cart by product ID.
     *
     * @param RemoveItemRequest $request
     * @return \Illuminate\Http\JsonResponse|\Illuminate\Http\RedirectResponse
     */
    public function removeItem(RemoveItemRequest $request)
    {
        $this->cartService->removeProduct($request->validated('product_id'));

        if ($request->wantsJson()) {
            return response()->json([
                'cart' => $this->cartService->getCart()->toResource(),
            ]);
        }

        return redirect()->back();
    }

    /**
     * Remove an item from the cart by cart_item_id.
     *
     * @param RemoveItemByIdRequest $request
     * @return \Illuminate\Http\RedirectResponse
     */
    public function removeItemById(RemoveItemByIdRequest $request)
    {
        $this->cartService->removeItem($request->validated('item_id'));

        return redirect()->back();
    }

    /**
     * Clear the cart.
     *
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse|\Illuminate\Http\RedirectResponse
     */
    public function clear(Request $request)
    {
        $this->cartService->clearCart();

        if ($request->wantsJson()) {
            return response()->json([
                'cart' => $this->cartService->getCart()->toResource(),
            ]);
        }

        return redirect()->back();
    }

    /**
     * Handle item quantity increase or decrease by product ID.
     *
     * @param HandleItemQuantityRequest $request
     * @return \Illuminate\Http\JsonResponse|\Illuminate\Http\RedirectResponse
     */
    public function handleItemQuantity(HandleItemQuantityRequest $request)
    {
        $productId = $request->validated('product_id');

        if ($request->validated('action') === 'increase') {
            $this->cartService->increaseQuantityByProduct($productId);
        } elseif ($request->validated('action') === 'decrease') {
            $this->cartService->decreaseQuantityByProduct($productId);
        }

        if ($request->wantsJson()) {
            return response()->json([
                'cart' => $this->cartService->getCart()->toResource(),
            ]);
        }

        return redirect()->back();
    }

    /**
     * Handle item quantity increase or decrease by cart_item_id.
     *
     * @param HandleItemQuantityByIdRequest $request
     * @return \Illuminate\Http\RedirectResponse
     */
    public function handleItemQuantityById(HandleItemQuantityByIdRequest $request)
    {
        $itemId = $request->validated('item_id');

        if ($request->validated('action') === 'increase') {
            $this->cartService->increaseQuantity($itemId);
        } else {
            $this->cartService->decreaseQuantity($itemId);
        }

        return redirect()->back();
    }

    /**
     * Redirect to Stripe checkout session.
     *
     * @param CreateStripeCheckoutSession $createStripeCheckoutSession
     * @return \Symfony\Component\HttpFoundation\Response
     */
    public function checkout(CreateStripeCheckoutSession $createStripeCheckoutSession)
    {
        $session = $createStripeCheckoutSession->createSessionFromCart(CartFactory::make());

        return Inertia::location($session->url);
    }

    /**
     * Redirect to Stripe checkout session for one or multiple products.
     *
     * @param BuyRequest $request
     * @param CreateStripeCheckoutSession $createStripeCheckoutSession
     * @return \Symfony\Component\HttpFoundation\Response
     */
    public function buy(BuyRequest $request, CreateStripeCheckoutSession $createStripeCheckoutSession)
    {
        $productsData = collect($request->getProducts())->map(function ($item) {
            return [
                'product' => Product::findOrFail($item['id']),
                'quantity' => $item['quantity'],
            ];
        });

        $session = $createStripeCheckoutSession->createSessionFromItems($productsData);

        return Inertia::location($session->url);
    }

    /**
     * Handle successful checkout.
     *
     * @param Request $request
     * @return \Inertia\Response|\Illuminate\Http\RedirectResponse
     */
    public function success(Request $request)
    {
        $sessionId = $request->get('session_id');

        if (!$sessionId) {
            return redirect()->route('home')->withErrors([
                'session_id' => "L'id de session n'est pas fourni.",
            ]);
        }

        return Inertia::render('checkout/success', [
            'order' => auth()->user()
                ->orders()
                ->where('stripe_checkout_session_id', $sessionId)
                ->with('items')
                ->firstOrFail(),
        ]);
    }
}
