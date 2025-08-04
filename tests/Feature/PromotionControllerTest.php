<?php

use Inertia\Testing\AssertableInertia as Assert;

it('can visit promotion page', function () {
    $this->get(route('promotions'))
        ->assertInertia(fn (Assert $page) => $page
            ->component('promotions/show')
            ->has('products')
            ->has('stock')
        );
});
