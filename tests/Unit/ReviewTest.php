<?php

use App\Models\Product;
use App\Models\User;
use App\Modules\Review\Models\Review;

beforeEach(function () {
    if (!config('swell.review.enabled')) {
        $this->markTestSkipped('La fonctionnalité review est désactivée.');
    }
});

it('can create a review', function () {
    $product = Product::factory()->create();
    $user =  User::factory()->create();

    $review = Review::factory()->create([
        'product_id' => $product->id,
        'user_id' => $user->id,
        'comment' => 'This is a great product!',
    ]);

    expect($review)->toBeInstanceOf(Review::class)
        ->and($review->product_id)->toBe($product->id)
        ->and($review->user_id)->toBe($user->id)
        ->and($review->comment)->toBe('This is a great product!');
});

it('can retrieve reviews for a product', function () {
    $product = Product::factory()->create();
    $user = User::factory()->create();

    $review1 = Review::factory()->create([
        'product_id' => $product->id,
        'user_id' => $user->id,
        'comment' => 'First comment',
    ]);

    $review2 = Review::factory()->create([
        'product_id' => $product->id,
        'user_id' => $user->id,
        'comment' => 'Second comment',
    ]);

    $reviews = $product->reviews;

    expect($reviews)->toBeInstanceOf(\Illuminate\Database\Eloquent\Collection::class)
        ->and($reviews->count())->toBe(2)
        ->and($reviews->contains($review1))->toBeTrue()
        ->and($reviews->contains($review2))->toBeTrue();
});

it('can delete a review', function () {
    $product = Product::factory()->create();
    $user = User::factory()->create();

    $review = Review::factory()->create([
        'product_id' => $product->id,
        'user_id' => $user->id,
        'comment' => 'This is a comment to be deleted',
    ]);

    $review->delete();

    expect(Review::find($review->id))->toBeNull();
});

it('can update a review', function () {
    $product = Product::factory()->create();
    $user = User::factory()->create();

    $review = Review::factory()->create([
        'product_id' => $product->id,
        'user_id' => $user->id,
        'comment' => 'Original comment',
    ]);

    $review->update(['comment' => 'Updated comment']);

    expect($review->comment)->toBe('Updated comment');
});

it('can retrieve the user who made the review', function () {
    $product = Product::factory()->create();
    $user = User::factory()->create();

    $review = Review::factory()->create([
        'product_id' => $product->id,
        'user_id' => $user->id,
        'comment' => 'This is a comment',
    ]);

    expect($review->user)->toBeInstanceOf(User::class)
        ->and($review->user->id)->toBe($user->id);
});

it('can retrieve the product for a review', function () {
    $product = Product::factory()->create();
    $user = User::factory()->create();

    $review = Review::factory()->create([
        'product_id' => $product->id,
        'user_id' => $user->id,
        'comment' => 'This is a comment',
    ]);

    expect($review->product)->toBeInstanceOf(Product::class)
        ->and($review->product->id)->toBe($product->id);
});

it('can get the average rating for a product', function () {
    $product = Product::factory()->create();

    Review::factory()->create([
        'product_id' => $product->id,
        'rating' => 5,
    ]);

    Review::factory()->create([
        'product_id' => $product->id,
        'rating' => 3,
    ]);

    Review::factory()->create([
        'product_id' => $product->id,
        'rating' => 4,
    ]);

    $averageRating = $product->reviews()->avg('rating');

    expect($averageRating)->toBe(4.0);
});
