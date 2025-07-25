<?php

return [
    /*
     * Enable or disable the wishlist feature.
     * This can be controlled via the SWELL_WISHLIST_ENABLED environment variable.
     */
    'wishlist' => [
        'enabled' => env('SWELL_WISHLIST_ENABLED', false),
    ],

    /*
     * Enable or disable the banner feature.
     * This can be controlled via the SWELL_BANNER_ENABLED environment variable.
     */
    'banner' => [
        'enabled' => env('SWELL_BANNER_ENABLED', false),
    ],
];
