<?php

use App\Actions\Cart\HandleProductCart;
use App\Actions\Stripe\CreateStripeCheckoutSession;
use App\Factories\CartFactory;
use App\Models\Cart;
use App\Models\Order;
use App\Models\Product;
use App\Models\User;
use Inertia\Testing\AssertableInertia as Assert;
use Laravel\Cashier\Checkout;


test('users can view their cart', function () {
    $user = User::factory()->create();
    $product = Product::factory()->create();

    $cart = $user->cart()->create();
    $cart->items()->create([
        'product_id' => $product->id,
        'quantity' => 2,
    ]);

    $this->actingAs($user)
        ->get('/')
        ->assertInertia(fn (Assert $page) => $page
            ->component('home')
            ->has('cart.items', 1)
            ->where('cart.items.0.product.id', $product->id)
        );
});

test('users can add products to cart', function () {
    $user = User::factory()->create();
    $user->cart()->create();

    $product = Product::factory()->create();

    $this->actingAs($user)->post(route('cart.add'), [
        'product_id' => $product->id,
        'quantity' => 3,
    ]);

    $this->assertDatabaseHas('cart_items', [
        'cart_id' => $user->cart->id,
        'product_id' => $product->id,
        'quantity' => 3,
    ]);
});

test('guest can add products to cart', function () {
    $product = Product::factory()->create();

    $this->post(route('cart.add'), [
        'product_id' => $product->id,
        'quantity' => 2,
    ]);

    $cart = Cart::firstOrCreate(['session_id' => session()->getId()]);

    $this->assertDatabaseHas('carts', [
        'session_id' => $cart->session_id,
    ]);

    $this->assertDatabaseHas('cart_items', [
        'cart_id' => $cart->id,
        'product_id' => $product->id,
        'quantity' => 2,
    ]);
});

it('throws exception if product is out of stock', function () {
    $product = Product::factory()->create(['stock' => 0]);

    $cart = CartFactory::make();

    $service = new HandleProductCart();

    $this->expectException(\Exception::class);
    $this->expectExceptionMessage('Produit en rupture de stock.');

    $service->add($product->id, 1, $cart);
});

test('addItem redirects back with error if product is out of stock', function () {
    $product = Product::factory()->create(['stock' => 0]);

    $cart = CartFactory::make();

    $response = $this->from('/cart')
        ->post(route('cart.add'), [
            'product_id' => $product->id,
            'quantity' => 1,
        ]);

    $response->assertRedirect('/cart');

    $response->assertSessionHasErrors([
        'product_id' => 'Produit en rupture de stock.',
    ]);
});

test('users can remove items from cart', function () {
    $user = User::factory()->create();
    $cart = $user->cart()->create();

    $product = Product::factory()->create();
    $cart->items()->create(['product_id' => $product->id, 'quantity' => 2]);

    $this->actingAs($user)->post(route('cart.remove'), [
        'product_id' => $product->id,
    ]);

    $this->assertDatabaseMissing('cart_items', [
        'cart_id' => $cart->id,
        'product_id' => $product->id,
    ]);
});

test('guest can remove items from cart', function () {
    $this->startSession();

    $cart = CartFactory::make();
    $product = Product::factory()->create();
    $cart->items()->create(['product_id' => $product->id, 'quantity' => 2]);

    $this->post(route('cart.remove'), [
        'product_id' => $product->id,
    ]);

    $updatedCart = Cart::where('session_id', session()->getId())->first();

    $this->assertDatabaseMissing('cart_items', [
        'cart_id' => $updatedCart->id,
        'product_id' => $product->id,
    ]);
});

test('guest cart items is migrated to user cart on login', function () {
    $this->startSession();

    $sessionCart = CartFactory::make();
    $product1 = Product::factory()->create();
    $product2 = Product::factory()->create();

    $sessionCart->items()->createMany([
        ['product_id' => $product1->id, 'quantity' => 1],
        ['product_id' => $product2->id, 'quantity' => 2],
    ]);

    $this->assertDatabaseHas('cart_items', [
        'cart_id' => $sessionCart->id,
        'product_id' => $product1->id,
        'quantity' => 1,
    ]);

    $this->assertDatabaseHas('cart_items', [
        'cart_id' => $sessionCart->id,
        'product_id' => $product2->id,
        'quantity' => 2,
    ]);

    $user = User::factory()->create();
    $user->cart()->create();

    $this->actingAs($user);

    (new \App\Actions\Cart\MigrateSessionCart)->migrate($sessionCart, $user->cart);

    $this->assertDatabaseHas('cart_items', [
        'cart_id' => $user->cart->id,
        'product_id' => $product1->id,
        'quantity' => 1,
    ]);

    $this->assertDatabaseHas('cart_items', [
        'cart_id' => $user->cart->id,
        'product_id' => $product2->id,
        'quantity' => 2,
    ]);

    $this->assertDatabaseMissing('cart_items', [
        'cart_id' => $sessionCart->id,
        'product_id' => $product1->id,
    ]);

    $this->assertDatabaseMissing('cart_items', [
        'cart_id' => $sessionCart->id,
        'product_id' => $product2->id,
    ]);
});

test('users can clear their cart', function () {
    $user = User::factory()->create();
    $cart = $user->cart()->create();

    $product1 = Product::factory()->create();
    $product2 = Product::factory()->create();

    $cart->items()->createMany([
        ['product_id' => $product1->id, 'quantity' => 1],
        ['product_id' => $product2->id, 'quantity' => 3],
    ]);

    $this->assertDatabaseHas('cart_items', [
        'cart_id' => $cart->id,
        'product_id' => $product1->id,
    ]);

    $this->assertDatabaseHas('cart_items', [
        'cart_id' => $cart->id,
        'product_id' => $product2->id,
    ]);

    $this->actingAs($user)->post(route('cart.clear', [$cart]));

    $this->assertDatabaseMissing('cart_items', [
        'cart_id' => $cart->id,
        'product_id' => $product1->id,
    ]);

    $this->assertDatabaseMissing('cart_items', [
        'cart_id' => $cart->id,
        'product_id' => $product2->id,
    ]);
});

test('guest can clear cart', function () {
    $this->startSession();

    $cart = CartFactory::make();

    $product1 = Product::factory()->create();
    $product2 = Product::factory()->create();

    $cart->items()->createMany([
        ['product_id' => $product1->id, 'quantity' => 1],
        ['product_id' => $product2->id, 'quantity' => 3],
    ]);

    $this->assertDatabaseHas('cart_items', [
        'cart_id' => $cart->id,
        'product_id' => $product1->id,
    ]);

    $this->assertDatabaseHas('cart_items', [
        'cart_id' => $cart->id,
        'product_id' => $product2->id,
    ]);

    $this->post(route('cart.clear', $cart->id));

    $updatedCart = Cart::where('session_id', session()->getId())->first();

    $this->assertDatabaseMissing('cart_items', [
        'cart_id' => $updatedCart->id,
        'product_id' => $product1->id
    ]);

    $this->assertDatabaseMissing('cart_items', [
        'cart_id' => $updatedCart->id,
        'product_id' => $product2->id
    ]);
});

it('increase cart item quantity', function () {
    $user = User::factory()->create();
    $cart = $user->cart()->create();

    $product = Product::factory()->create();
    $cart->items()->create(['product_id' => $product->id, 'quantity' => 1]);

    $this->actingAs($user)->put(route('cart.update'), [
        'product_id' => $product->id,
        'action' => 'increase'
    ]);

    $this->assertDatabaseHas('cart_items', [
        'cart_id' => $cart->id,
        'product_id' => $product->id,
        'quantity' => 2,
    ]);
});

it('decrease cart item quantity', function () {
    $user = User::factory()->create();
    $cart = $user->cart()->create();

    $product = Product::factory()->create();
    $cart->items()->create(['product_id' => $product->id, 'quantity' => 2]);

    $this->actingAs($user)->put(route('cart.update'), [
        'product_id' => $product->id,
        'action' => 'decrease'
    ]);

    $this->assertDatabaseHas('cart_items', [
        'cart_id' => $cart->id,
        'product_id' => $product->id,
        'quantity' => 1,
    ]);
});

it('delete cart item when decreasing quantity under 1', function () {
    $user = User::factory()->create();
    $cart = $user->cart()->create();

    $product = Product::factory()->create();
    $cart->items()->create(['product_id' => $product->id, 'quantity' => 1]);

    $this->actingAs($user)->put(route('cart.update'), [
        'product_id' => $product->id,
        'action' => 'decrease'
    ]);

    $this->assertDatabaseMissing('cart_items', [
        'cart_id' => $cart->id,
        'product_id' => $product->id,
    ]);
});

test('cart item quantity is increased for existing products on session cart migration', function () {
    $this->startSession();
    $sessionCart = CartFactory::make();
    $product = Product::factory()->create();
    $sessionCart->items()->create(['product_id' => $product->id, 'quantity' => 1]);

    $this->assertDatabaseHas('cart_items', [
        'cart_id' => $sessionCart->id,
        'product_id' => $product->id,
        'quantity' => 1,
    ]);

    $user = User::factory()->create();
    $user->cart()->create()->items()->create(['product_id' => $product->id, 'quantity' => 2]);

    $this->actingAs($user);

    (new \App\Actions\Cart\MigrateSessionCart)->migrate($sessionCart, $user->cart);

    $this->assertDatabaseHas('cart_items', [
        'cart_id' => $user->cart->id,
        'product_id' => $product->id,
        'quantity' => 3,
    ]);

    $this->assertDatabaseMissing('cart_items', [
        'cart_id' => $sessionCart->id,
        'product_id' => $product->id,
    ]);
});

test('can get cart as json', function () {
    $user = User::factory()->create();
    $this->actingAs($user);

    $product = Product::factory()->create([
        'name' => 'Test Product',
        'price' => 1000,
        'stock' => 5,
    ]);

    $cart = $user->cart()->create();

    $cart->items()->create([
        'product_id' => $product->id,
        'quantity' => 2,
    ]);

    $response = $this->getJson(route('cart.index'));

    $response->assertOk();

    $response->assertJsonStructure([
        'cart' => [
            'id',
            'items' => [
                [
                    'id',
                    'quantity',
                    'product' => [
                        'id',
                        'name',
                        'price',
                        'image',
                        'brand' => [
                            'id',
                            'name',
                            'slug',
                            'logo_url',
                            'created_at',
                            'updated_at',
                            'products_count',
                        ]
                    ],
                ],
            ],
            'total',
        ],
    ]);

    $response->assertJsonFragment([
        'name' => 'Test Product',
        'quantity' => 2,
    ]);
});

test('checkout redirects to stripe checkout url', function () {
    $mockSession = \Mockery::mock(Checkout::class);
    $mockSession->url = 'https://stripe.test/session';

    $mockStripe = \Mockery::mock(CreateStripeCheckoutSession::class);
    $mockStripe->shouldReceive('createSessionFromCart')
        ->once()
        ->andReturn($mockSession);

    $this->app->instance(CreateStripeCheckoutSession::class, $mockStripe);

    $response = $this->actingAs(User::factory()->create())
        ->get(route('cart.checkout'));

    $response->assertRedirect('https://stripe.test/session');
});

test('buy single item redirects to stripe checkout url', function () {
    $mockSession = \Mockery::mock(Checkout::class);
    $mockSession->url = 'https://stripe.test/session';

    $mockStripe = \Mockery::mock(CreateStripeCheckoutSession::class);
    $mockStripe->shouldReceive('createSessionFromSingleItem')
        ->once()
        ->andReturn($mockSession);

    $this->app->instance(CreateStripeCheckoutSession::class, $mockStripe);

    $response = $this->actingAs(User::factory()->create())
        ->get(route('cart.buy', Product::factory()->create()));

    $response->assertRedirect('https://stripe.test/session');
});

test('cannot access success page without valid sessionId', function () {
    $user = User::factory()->create();
    $this->actingAs($user);

    $response = $this->get(route('checkout.success'), [
        'session_id' => 'invalid_session_id',
    ]);

    $response->assertRedirect(route('home'));
    $response->assertSessionHasErrors(['session_id' => "L'id de session n'est pas fourni."]);
});

test('can access success page with valid sessionId', function () {
    $user = User::factory()->create();
    $this->actingAs($user);

    $order = Order::factory()->create([
        'user_id' => $user->id,
    ]);

    $response = $this->get(route('checkout.success') . '?session_id=' . $order->stripe_checkout_session_id);

    $response->assertOk();
    $response->assertInertia(fn (Assert $page) => $page
        ->component('checkout/success')
        ->has('order')
    );
});
