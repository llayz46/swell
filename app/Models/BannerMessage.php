<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class BannerMessage extends Model
{
    protected $fillable = [
        'message',
        'is_active',
        'order'
    ];

    protected function casts(): array
    {
        return [
            'is_active' => 'boolean',
        ];
    }
}
