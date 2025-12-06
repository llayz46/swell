<?php

namespace App\Http\Controllers;

use App\Actions\Cart\HandleProductCart;
use App\Actions\Stripe\CreateStripeCheckoutSession;
use App\Factories\CartFactory;
use App\Http\Resources\CartResource;
use App\Models\Cart;
use App\Models\Product;
use Illuminate\Http\Request;
use Inertia\Inertia;

class CartController extends Controller
{
    /**
     * @var HandleProductCart
     */
    protected HandleProductCart $handleProductCart;

    /**
     * CartController constructor.
     *
     * @param HandleProductCart $handleProductCart
     */
    public function __construct(HandleProductCart $handleProductCart)
    {
        $this->handleProductCart = $handleProductCart;
    }

    /**
     * Display the cart.
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function index()
    {
        return response()->json([
            'cart' => CartResource::make(
                CartFactory::make()->load(
                    'items.product.images',
                    'items.product.brand',
                    'items.product.options.values'
                )
            ),
        ]);
    }

    /**
     * Add item to the cart.
     *
     * @param AddItemRequest $request
     * @param HandleProductCart $handleProductCart
     * @return \Illuminate\Http\RedirectResponse
     */
    public function addItem(AddItemRequest $request)
    {
        $request->validated();

        try {
            $this->handleProductCart->add(
                $request->product_id,
                $request->quantity ?? 1,
                $request->user()?->cart,
                $request->options ?? null,
            );
        } catch (\Exception $e) {
            return redirect()->back()->withErrors([
                'product_id' => $e->getMessage()
            ]);
        }

        // Retour JSON pour resync côté front
        if ($request->wantsJson()) {
            return response()->json([
                'cart' => CartResource::make(CartFactory::make()->load('items.product')),
            ]);
        }

        return redirect()->back();
    }

    /**
     * Remove an item from the cart.
     *
     * @param RemoveItemRequest $request
     * @param HandleProductCart $handleProductCart
     * @return \Illuminate\Http\RedirectResponse
     */
    public function removeItem(RemoveItemRequest $request)
    {
        $request->validated();

        $this->handleProductCart->remove(
            $request->product_id,
            $request->user()?->cart
        );

        if ($request->wantsJson()) {
            return response()->json([
                'cart' => CartResource::make(CartFactory::make()->load('items.product')),
            ]);
        }

        return redirect()->back();
    }

    /**
     * Remove an item from the cart by cart_item_id.
     *
     * @param RemoveItemByIdRequest $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function removeItemById(RemoveItemByIdRequest $request)
    {
        $request->validated();

        $this->handleProductCart->removeByItemId($request->item_id, $request->user()?->cart);

        return redirect()->back();
    }

    /**
     * Clear the cart.
     *
     * @param Cart $cart
     * @param HandleProductCart $handleProductCart
     * @return \Illuminate\Http\JsonResponse
     */
    public function clear(Request $request)
    {
        $this->handleProductCart->clear($request->user()?->cart);

        if ($request->wantsJson()) {
            return response()->json([
                'cart' => CartResource::make(CartFactory::make()->load('items.product')),
            ]);
        }

        return redirect()->back();
    }

    /**
     * Handle item quantity increase or decrease.
     *
     * @param HandleItemQuantityRequest $request
     * @return \Illuminate\Http\RedirectResponse
     */
    public function handleItemQuantity(HandleItemQuantityRequest $request)
    {
        $request->validated();

        $cart = $request->user()?->cart;

        if ($request->action === 'increase') {
            $this->handleProductCart->increase($request->product_id, $cart);
        } elseif ($request->action === 'decrease') {
            $this->handleProductCart->decrease($request->product_id, $cart);
        }

        if ($request->wantsJson()) {
            return response()->json([
                'cart' => CartResource::make(CartFactory::make()->load('items.product')),
            ]);
        }

        return redirect()->back();
    }

    /**
     * Handle item quantity increase or decrease by cart_item_id.
     *
     * @param HandleItemQuantityByIdRequest $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function handleItemQuantityById(HandleItemQuantityByIdRequest $request)
    {
        $request->validated();

        if ($request->action === 'increase') {
            $this->handleProductCart->increaseByItemId($request->item_id, $request->user()?->cart);
        } else {
            $this->handleProductCart->decreaseByItemId($request->item_id, $request->user()?->cart);
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
     * Redirect to Stripe checkout session for a single product.
     *
     * @param Product $product
     * @param CreateStripeCheckoutSession $createStripeCheckoutSession
     * @return \Symfony\Component\HttpFoundation\Response
     */
    public function buy(Product $product, CreateStripeCheckoutSession $createStripeCheckoutSession)
    {
        $session = $createStripeCheckoutSession->createSessionFromSingleItem($product);

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
            return redirect()->route('home')->withErrors(['session_id' => "L'id de session n'est pas fourni."]);
        }

        return Inertia::render('checkout/success', [
            'order' => auth()->user()->orders()->where('stripe_checkout_session_id', $sessionId)->with('items')->firstOrFail(),
        ]);
    }
}
