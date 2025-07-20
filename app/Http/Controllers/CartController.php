<?php

namespace App\Http\Controllers;

use App\Actions\Cart\HandleProductCart;
use App\Actions\Stripe\CreateStripeCheckoutSession;
use App\Factories\CartFactory;
use App\Http\Resources\CartResource;
use App\Models\Cart;
use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
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
            'cart' => CartResource::make(CartFactory::make()->load('items.product')),
        ]);
    }

    /**
     * Add item to the cart.
     *
     * @param Request $request
     * @param HandleProductCart $handleProductCart
     * @return \Illuminate\Http\RedirectResponse
     */
    public function addItem(Request $request)
    {
        $request->validate([
            'product_id' => 'required|exists:products,id',
            'quantity' => 'integer|min:1',
        ]);

        try {
            $this->handleProductCart->add(
                $request->product_id,
                $request->quantity ?? 1,
                $request->user()?->cart
            );
        } catch (\Exception $e) {
            return redirect()->back()->withErrors([
                'product_id' => $e->getMessage()
            ]);
        }

        return redirect()->back();
    }

    /**
     * Remove an item from the cart.
     *
     * @param Request $request
     * @param HandleProductCart $handleProductCart
     * @return \Illuminate\Http\RedirectResponse
     */
    public function removeItem(Request $request)
    {
        $request->validate([
            'product_id' => 'required|exists:products,id',
        ]);

        $this->handleProductCart->remove(
            $request->product_id,
            $request->user()?->cart
        );

        return redirect()->back();
    }

    /**
     * Clear the cart.
     *
     * @param Cart $cart
     * @param HandleProductCart $handleProductCart
     * @return \Illuminate\Http\RedirectResponse
     */
    public function clear(Request $request)
    {
        $this->handleProductCart->clear($request->user()?->cart);

        return redirect()->back();
    }

    /**
     * Handle item quantity increase or decrease.
     *
     * @param Request $request
     * @return \Illuminate\Http\RedirectResponse
     */
    public function handleItemQuantity(Request $request)
    {
        $request->validate([
            'product_id' => 'required|exists:products,id',
            'action' => 'required|in:increase,decrease',
        ]);

        $cart = $request->user()?->cart;

        if ($request->action === 'increase') {
            $this->handleProductCart->increase($request->product_id, $cart);
        } elseif ($request->action === 'decrease') {
            $this->handleProductCart->decrease($request->product_id, $cart);
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
            return redirect()->route('home')->withErrors(['session_id' => 'Session ID is required.']);
        }

        return Inertia::render('checkout/success', [
            'order' => auth()->user()->orders()->where('stripe_checkout_session_id', $sessionId)->with('items')->firstOrFail(),
        ]);
    }
}
