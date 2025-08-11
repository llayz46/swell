<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;

class SwellEnableFeatureCommand extends Command
{
    protected $signature = 'swell:enable {feature?}';

    protected $description = 'Active une fonctionnalité de Swell';

    public function handle(): void
    {
        $feature = $this->argument('feature');

        if ($feature === null) {
            $feature = $this->ask('Quelle fonctionnalité souhaitez-vous activer ?');
        }

        $ucFeature = ucfirst($feature);

        if (!class_exists("App\\Modules\\{$ucFeature}\\{$ucFeature}ServiceProvider")) {
            $this->error("La fonctionnalité {$ucFeature} de Swell n'existe pas.");
            return;
        }

        if (!config("swell." . strtolower($ucFeature) . ".enabled", false)) {
            $this->error("La fonctionnalité {$ucFeature} de Swell n'est pas activée dans la configuration. Activez-la depuis votre .env");
            return;
        }

        $this->info("Activation de la fonctionnalité {$ucFeature} de Swell...");

        $this->call('vendor:publish', [
            '--provider' => "App\\Modules\\{$ucFeature}\\{$ucFeature}ServiceProvider",
            '--tag' => "swell-{$feature}",
            '--force' => true,
        ]);

        $this->callSilent('route:clear');
        $this->callSilent('route:cache');
        $this->info("Les routes de la fonctionnalité {$ucFeature} de Swell ont été mises à jour.");

        if ($this->confirm('Souhaitez-vous lancer les migrations maintenant ?', true)) {
            $this->call('migrate');
        }

        $this->info("La fonctionnalité {$ucFeature} de Swell a été activée avec succès.");
    }
}
