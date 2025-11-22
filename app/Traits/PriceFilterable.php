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
        if ($minPrice !== null || $maxPrice !== null) {
            $query->where(function ($q) use ($minPrice, $maxPrice) {
                $priceColumn = 'COALESCE(discount_price, price)';

                if ($minPrice !== null) {
                    $q->whereRaw("{$priceColumn} >= ?", [$minPrice]);
                }

                if ($maxPrice !== null) {
                    $q->whereRaw("{$priceColumn} <= ?", [$maxPrice]);
                }
            });
        }

        return $query;
    }
}
