<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Spatie\Permission\Models\Role;

class SwellMakeRoleCommand extends Command
{
    protected $signature = 'swell:make-role';

    protected $description = 'Créer un rôle';

    public function handle(): void
    {
        $roleName = $this->ask('Entrez le nom du rôle');

        if (empty($roleName)) {
            $this->error('Le nom du rôle ne peut pas être vide.');
            return;
        }

        if (Role::where('name', $roleName)->exists()) {
            $this->error("Un rôle avec le nom '{$roleName}' existe déjà.");
            return;
        }

        Role::create(['name' => $roleName]);

        $this->info("Rôle '{$roleName}' créé avec succès !");
    }
}
