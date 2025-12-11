<?php

namespace App\Services;

use App\Actions\Cart\AddItemToCart;
use App\Actions\Cart\RemoveItemFromCart;
use App\Actions\Cart\UpdateCartItemQuantity;
use App\Factories\CartFactory;
use App\Models\Cart;

class CartService
{
    /**
     * CartService constructor.
     *
     * @param AddItemToCart $addItemToCart
     * @param RemoveItemFromCart $removeItemFromCart
     * @param UpdateCartItemQuantity $updateCartItemQuantity
     */
    public function __construct(
        private AddItemToCart $addItemToCart,
        private RemoveItemFromCart $removeItemFromCart,
        private UpdateCartItemQuantity $updateCartItemQuantity,
    ) {}

    /**
     * Add a product to the cart (guest or authenticated user).
     *
     * @param int $productId
     * @param int $quantity
     * @param array|null $options
     * @return Cart
     */
    public function addProduct(int $productId, int $quantity = 1, ?array $options = null): Cart
    {
        $cart = CartFactory::make();

        $this->addItemToCart->execute($cart, $productId, $quantity, $options);

        return $cart->fresh(['items.product']);
    }

    /**
     * Remove an item from the cart by cart item ID.
     *
     * @param int $cartItemId
     * @return Cart
     */
    public function removeItem(int $cartItemId): Cart
    {
        $cart = CartFactory::make();

        $this->removeItemFromCart->execute($cart, $cartItemId);

        return $cart->fresh(['items.product']);
    }

    /**
     * Remove all items of a specific product from the cart.
     *
     * @param int $productId
     * @return Cart
     */
    public function removeProduct(int $productId): Cart
    {
        $cart = CartFactory::make();

        $this->removeItemFromCart->removeByProductId($cart, $productId);

        return $cart->fresh(['items.product']);
    }

    /**
     * Clear the entire cart.
     *
     * @return Cart
     */
    public function clearCart(): Cart
    {
        $cart = CartFactory::make();

        $this->removeItemFromCart->clear($cart);

        return $cart->fresh(['items.product']);
    }

    /**
     * Increase the quantity of a cart item by 1.
     *
     * @param int $cartItemId
     * @return Cart
     */
    public function increaseQuantity(int $cartItemId): Cart
    {
        $cart = CartFactory::make();

        $this->updateCartItemQuantity->increment($cart, $cartItemId);

        return $cart->fresh(['items.product']);
    }

    /**
     * Decrease the quantity of a cart item by 1.
     * If quantity reaches 0, the item will be removed.
     *
     * @param int $cartItemId
     * @return Cart
     */
    public function decreaseQuantity(int $cartItemId): Cart
    {
        $cart = CartFactory::make();

        $this->updateCartItemQuantity->decrement($cart, $cartItemId);

        return $cart->fresh(['items.product']);
    }

    /**
     * Set the exact quantity of a cart item.
     *
     * @param int $cartItemId
     * @param int $quantity
     * @return Cart
     */
    public function setQuantity(int $cartItemId, int $quantity): Cart
    {
        $cart = CartFactory::make();

        $this->updateCartItemQuantity->execute($cart, $cartItemId, $quantity);

        return $cart->fresh(['items.product']);
    }

    /**
     * Increase quantity by product ID.
     * Finds the first cart item for this product and increments it.
     *
     * @param int $productId
     * @return Cart
     */
    public function increaseQuantityByProduct(int $productId): Cart
    {
        $cart = CartFactory::make();
        $item = $cart->items->firstWhere('product_id', $productId);

        if ($item) {
            $this->updateCartItemQuantity->increment($cart, $item->id);
        }

        return $cart->fresh(['items.product']);
    }

    /**
     * Decrease quantity by product ID.
     * Finds the first cart item for this product and decrements it.
     *
     * @param int $productId
     * @return Cart
     */
    public function decreaseQuantityByProduct(int $productId): Cart
    {
        $cart = CartFactory::make();
        $item = $cart->items->firstWhere('product_id', $productId);

        if ($item) {
            $this->updateCartItemQuantity->decrement($cart, $item->id);
        }

        return $cart->fresh(['items.product']);
    }

    /**
     * Get the current cart with all relations loaded.
     *
     * @return Cart
     */
    public function getCart(): Cart
    {
        return CartFactory::make()->load([
            'items.product.images',
            'items.product.brand',
            'items.product.options.values',
        ]);
    }
}
