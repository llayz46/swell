<?php

namespace App\Console\Commands;

use App\Models\User;
use Illuminate\Console\Command;
use Spatie\Permission\Models\Role;

class SwellMakeUserCommand extends Command
{
    protected $signature = 'swell:make-user
        {--email= : Email de l\'utilisateur}
        {--password= : Mot de passe}
        {--name= : Nom de l\'utilisateur}
        {--role= : Rôle à attribuer}';

    protected $description = 'Créer un utilisateur';

    public function handle(): void
    {
        $email = $this->option('email') ?? $this->ask('Entrez l\'email de l\'utilisateur');
        $password = $this->option('password') ?? $this->secret('Entrez le mot de passe de l\'utilisateur');
        $name = $this->option('name') ?? $this->ask('Entrez le nom de l\'utilisateur');
        $role = $this->option('role');

        if (User::where('email', $email)->exists()) {
            $this->error('Un utilisateur avec cet email existe déjà.');
            return;
        }

        $user = User::create([
            'email' => $email,
            'password' => bcrypt($password),
            'name' => $name,
        ]);

        if (!$role) {
            $availableRoles = Role::all()->pluck('name')->toArray();

            $role = $this->choice(
                'Choisissez un rôle à attribuer à l\'utilisateur',
                $availableRoles,
                'user'
            );
        }

        if ($role) {
            $user->syncRoles([$role]);
            $this->info("Rôle '{$role}' attribué à l'utilisateur.");
        }

        $this->info('Utilisateur créé avec succès !');
    }
}
