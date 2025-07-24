<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;

class AddWislishtCommand extends Command
{
    protected $signature = 'swell:add-wishlist';

    protected $description = 'Ajoute la fonctionnalité Wishlist de Swell';

    public function handle(): void
    {
        if (!config('swell.wishlist.enabled', false)) {
            $this->error('La fonctionnalité Wishlist de Swell n\'est pas activée dans la configuration. Activez-la depuis votre .env');
            return;
        }

        $this->info('Ajout de la fonctionnalité Wishlist de Swell...');

        $this->call('vendor:publish', [
            '--provider' => 'App\Modules\Wishlist\WishlistServiceProvider',
            '--tag' => 'swell-wishlist',
            '--force' => true,
        ]);

        $this->callSilent('route:clear');
        $this->callSilent('route:cache');
        $this->info('Les routes de la fonctionnalité Wishlist de Swell ont été mises à jour.');

        if ($this->confirm('Souhaitez-vous lancer les migrations maintenant ?', true)) {
            $this->call('migrate');
        }

        $this->info('La fonctionnalité Wishlist de Swell a été ajoutée avec succès.');
    }
}
