<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Facades\Storage;

class ProductImage extends Model
{
    /** @use HasFactory<\Database\Factories\ProductImageFactory> */
    use HasFactory;

    protected $fillable = [
        'product_id',
        'image_url',
        'alt_text',
        'is_featured',
        'order',
    ];

    public function getUrlAttribute(): string
    {
        return Storage::url($this->image_url);
    }

    protected $appends = ['url'];

    public function product(): belongsTo
    {
        return $this->belongsTo(Product::class);
    }
}
