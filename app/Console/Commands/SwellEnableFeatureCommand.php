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

        $feature = ucfirst($feature);

        if (!class_exists("App\\Modules\\{$feature}\\{$feature}ServiceProvider")) {
            $this->error("La fonctionnalité {$feature} de Swell n'existe pas.");
            return;
        }

        if (!config("swell." . strtolower($feature) . ".enabled", false)) {
            $this->error("La fonctionnalité {$feature} de Swell n'est pas activée dans la configuration. Activez-la depuis votre .env");
            return;
        }

        $this->info("Activation de la fonctionnalité {$feature} de Swell...");

        $this->call('vendor:publish', [
            '--provider' => "App\\Modules\\{$feature}\\{$feature}ServiceProvider",
            '--tag' => "swell-{$feature}",
            '--force' => true,
        ]);

        $this->callSilent('route:clear');
        $this->callSilent('route:cache');
        $this->info("Les routes de la fonctionnalité {$feature} de Swell ont été mises à jour.");

        if ($this->confirm('Souhaitez-vous lancer les migrations maintenant ?', true)) {
            $this->call('migrate');
        }

        $this->info("La fonctionnalité {$feature} de Swell a été activée avec succès.");
    }
}
