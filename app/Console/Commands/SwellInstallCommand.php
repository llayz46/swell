<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;

class SwellInstallCommand extends Command
{
    protected $signature = 'swell:install';

    protected $description = 'Installer Swell';

    public function handle(): void
    {
        $this->info('Installation de Swell...');

        $this->info('Lancement des migrations...');
        $this->call('migrate', ['--force' => true]);
        $this->info('Migrations terminées.');

        $this->info('Seeding de la base de données...');
        $this->call('db:seed', ['--force' => true, '--class' => 'RoleSeeder']);
        $this->call('db:seed', ['--force' => true, '--class' => 'LocalSeeder']);
        $this->info('Base de données seed avec succès.');

        $this->info('Installation de Swell terminée avec succès !');

        $this->info('N\'oubliez pas de configurer votre fichier .env avec les paramètres nécessaires pour Swell.');
    }
}
