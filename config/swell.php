<?php

return [
    /*
     * Enable or disable the wishlist feature.
     * This can be controlled via the SWELL_WISHLIST_ENABLED environment variable.
     */
    'wishlist' => [
        'enabled' => env('SWELL_WISHLIST_ENABLED', false),
    ],
];
