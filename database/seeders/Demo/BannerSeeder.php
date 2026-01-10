<?php

namespace Database\Seeders\Demo;

use App\Modules\Banner\Models\BannerMessage;
use Illuminate\Database\Seeder;

class BannerSeeder extends Seeder
{
    /**
     * Seed demo banner messages.
     */
    public function run(): void
    {
        $messages = [
            'Livraison gratuite dès 50€',
            'Retours gratuits sous 30 jours',
            'Nouvelle collection disponible',
            'Jusqu\'à -50% sur une sélection d\'articles',
        ];

        foreach ($messages as $index => $message) {
            BannerMessage::create([
                'message' => $message,
                'is_active' => true,
                'order' => $index + 1,
            ]);
        }
    }
}
