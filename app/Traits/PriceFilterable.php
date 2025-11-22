<?php

namespace App\Traits;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Relations\Relation;

trait PriceFilterable
{
    /**
     * Applique le filtre de prix à la requête
     *
     * @param  float|null  $minPrice  Prix minimum
     * @param  float|null  $maxPrice  Prix maximum
     */
    protected function applyPriceFilter(Builder|Relation $query, ?float $minPrice, ?float $maxPrice): Builder|Relation
    {
        $priceColumn = 'COALESCE(NULLIF(discount_price, 0), price)';

        if ($minPrice !== null) {
            $query->whereRaw("$priceColumn >= " . (float) $minPrice);
        }

        if ($maxPrice !== null) {
            $query->whereRaw("$priceColumn <= " . (float) $maxPrice);
        }

        return $query;
    }
}
