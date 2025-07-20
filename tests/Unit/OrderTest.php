<?php

use App\Models\Order;
use App\Models\User;

test('can create an order belongs to an user', function () {
    $user = User::factory()->create();

    $order = $user->orders()->create(Order::factory()->make()->toArray());

    expect($order->user_id)->toBe($user->id);
});
