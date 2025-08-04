<?php

use Inertia\Testing\AssertableInertia as Assert;

it('can visit news page', function () {
    $this->get(route('news'))
        ->assertInertia(fn (Assert $page) => $page
            ->component('news/show')
            ->has('products')
            ->has('stock')
        );
});
