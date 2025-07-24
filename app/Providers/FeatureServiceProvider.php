<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;

class FeatureServiceProvider extends ServiceProvider
{
    public function register(): void
    {
        $features = config('swell');

        foreach ($features as $feature => $options) {
            if (!empty($options['enabled'])) {
                $providerClass = "App\\Modules\\" . ucfirst($feature) . "\\" . ucfirst($feature) . "ServiceProvider";
                if (class_exists($providerClass)) {
                    $this->app->register($providerClass);
                }
            }
        }
    }
}
