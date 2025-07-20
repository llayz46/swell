<?php

namespace App\Traits;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Relations\Relation;

trait Sortable
{
    /**
     * Applique le tri à la requête en fonction du paramètre de tri
     *
     * @param Builder|Relation $query
     * @param string $sort
     * @return void
     */
    public function applySort(Builder|Relation $query, string $sort): void
    {
        switch ($sort) {
            case 'price_asc':
                $query->orderByRaw('COALESCE(discount_price, price) ASC');
                break;
            case 'price_desc':
                $query->orderByRaw('COALESCE(discount_price, price) DESC');
                break;
            case 'news':
            default:
                $query->latest();
                break;
        }
    }
}
