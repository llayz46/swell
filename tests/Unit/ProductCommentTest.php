<?php

use App\Models\Product;
use App\Models\ProductComment;
use App\Models\User;

it('can create a product comment', function () {
    $product = Product::factory()->create();
    $user =  User::factory()->create();

    $comment = ProductComment::factory()->create([
        'product_id' => $product->id,
        'user_id' => $user->id,
        'comment' => 'This is a great product!',
    ]);

    expect($comment)->toBeInstanceOf(ProductComment::class)
        ->and($comment->product_id)->toBe($product->id)
        ->and($comment->user_id)->toBe($user->id)
        ->and($comment->comment)->toBe('This is a great product!');
});

it('can retrieve comments for a product', function () {
    $product = Product::factory()->create();
    $user = User::factory()->create();

    $comment1 = ProductComment::factory()->create([
        'product_id' => $product->id,
        'user_id' => $user->id,
        'comment' => 'First comment',
    ]);

    $comment2 = ProductComment::factory()->create([
        'product_id' => $product->id,
        'user_id' => $user->id,
        'comment' => 'Second comment',
    ]);

    $comments = $product->comments;

    expect($comments)->toBeInstanceOf(\Illuminate\Database\Eloquent\Collection::class)
        ->and($comments->count())->toBe(2)
        ->and($comments->contains($comment1))->toBeTrue()
        ->and($comments->contains($comment2))->toBeTrue();
});

it('can delete a product comment', function () {
    $product = Product::factory()->create();
    $user = User::factory()->create();

    $comment = ProductComment::factory()->create([
        'product_id' => $product->id,
        'user_id' => $user->id,
        'comment' => 'This is a comment to be deleted',
    ]);

    $comment->delete();

    expect(ProductComment::find($comment->id))->toBeNull();
});

it('can update a product comment', function () {
    $product = Product::factory()->create();
    $user = User::factory()->create();

    $comment = ProductComment::factory()->create([
        'product_id' => $product->id,
        'user_id' => $user->id,
        'comment' => 'Original comment',
    ]);

    $comment->update(['comment' => 'Updated comment']);

    expect($comment->comment)->toBe('Updated comment');
});

it('can retrieve the user who made the comment', function () {
    $product = Product::factory()->create();
    $user = User::factory()->create();

    $comment = ProductComment::factory()->create([
        'product_id' => $product->id,
        'user_id' => $user->id,
        'comment' => 'This is a comment',
    ]);

    expect($comment->user)->toBeInstanceOf(User::class)
        ->and($comment->user->id)->toBe($user->id);
});

it('can retrieve the product for a comment', function () {
    $product = Product::factory()->create();
    $user = User::factory()->create();

    $comment = ProductComment::factory()->create([
        'product_id' => $product->id,
        'user_id' => $user->id,
        'comment' => 'This is a comment',
    ]);

    expect($comment->product)->toBeInstanceOf(Product::class)
        ->and($comment->product->id)->toBe($product->id);
});

it('can get the average rating for a product', function () {
    $product = Product::factory()->create();

    ProductComment::factory()->create([
        'product_id' => $product->id,
        'rating' => 5,
    ]);

    ProductComment::factory()->create([
        'product_id' => $product->id,
        'rating' => 3,
    ]);

    ProductComment::factory()->create([
        'product_id' => $product->id,
        'rating' => 4,
    ]);

    $averageRating = $product->comments()->avg('rating');

    expect($averageRating)->toBe(4.0)
        ->and($product->averageRating())->toBe(4.0);
});
