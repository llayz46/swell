<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;

class AddBannerCommand extends Command
{
    protected $signature = 'swell:add-banner';

    protected $description = 'Ajoute la fonctionnalité Banner de Swell';

    public function handle(): void
    {
        if (!config('swell.banner.enabled', false)) {
            $this->error('La fonctionnalité Banner de Swell n\'est pas activée dans la configuration. Activez-la depuis votre .env');
            return;
        }

        $this->info('Ajout de la fonctionnalité Banner de Swell...');

        $this->call('vendor:publish', [
            '--provider' => 'App\Modules\Banner\BannerServiceProvider',
            '--tag' => 'swell-banner',
            '--force' => true,
        ]);

        $this->callSilent('route:clear');
        $this->callSilent('route:cache');
        $this->info('Les routes de la fonctionnalité Banner de Swell ont été mises à jour.');

        if ($this->confirm('Souhaitez-vous lancer la migration maintenant ?', true)) {
            $this->call('migrate');
        }

        $this->info('La fonctionnalité Banner de Swell a été ajoutée avec succès.');
    }
}
