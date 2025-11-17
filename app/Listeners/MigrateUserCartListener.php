<?php

namespace App\Listeners;

use App\Actions\Cart\MigrateSessionCart;
use App\Factories\CartFactory;
use Illuminate\Auth\Events\Login;

class MigrateUserCartListener
{
    public function handle(Login $event): void
    {
        $user = $event->user;

        (new MigrateSessionCart)->migrate(
            CartFactory::make(),

            $user->cart ?: $user->cart()->create()
        );
    }
}
