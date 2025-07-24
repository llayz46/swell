<?php

namespace App\Console\Commands;

use App\Models\User;
use Illuminate\Console\Command;
use Spatie\Permission\Models\Role;

class MakeAdminCommand extends Command
{
    protected $signature = 'make:admin';

    protected $description = 'Créer un utilisateur administrateur';

    public function handle(): void
    {
        $email = $this->ask('Entrez l\'email de l\'administrateur');
        $password = $this->secret('Entrez le mot de passe de l\'administrateur');
        $name = $this->ask('Entrez le nom de l\'administrateur');

        Role::firstOrCreate(['name' => 'admin']);

        User::create([
            'email' => $email,
            'password' => bcrypt($password),
            'name' => $name,
        ])->assignRole('admin');

        $this->info('Utilisateur administrateur créé avec succès !');
    }
}
