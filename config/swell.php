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

    /*
     * Enable or disable the review product feature.
     * This can be controlled via the SWELL_REVIEW_ENABLED environment variable.
     */
    'review' => [
        'enabled' => env('SWELL_REVIEW_ENABLED', false),
    ],

    /*
     * Enable or disable the loyalty points feature.
     * This can be controlled via the SWELL_LOYALTY_ENABLED environment variable.
     */
    'loyalty' => [
        'enabled' => env('SWELL_LOYALTY_ENABLED', false),

        // Points earned per euro spent
        'points_per_euro' => env('SWELL_LOYALTY_POINTS_PER_EURO', 10),

        // Points expiration in days (null = never expire)
        'points_expiration_days' => env('SWELL_LOYALTY_EXPIRATION_DAYS', 365),

        // Minimum points required to redeem
        'minimum_redeem_points' => env('SWELL_LOYALTY_MIN_REDEEM', 100),

        // Maximum discount percentage using points
        'max_discount_percentage' => env('SWELL_LOYALTY_MAX_DISCOUNT', 50),
    ],
];
