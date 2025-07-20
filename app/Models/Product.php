<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Support\Str;
use Laravel\Scout\Searchable;

class Product extends Model
{
    /**
     * @use HasFactory<\Database\Factories\ProductFactory>
     * @use Searchable<\App\Models\Product>
     */
    use HasFactory, Searchable;

    protected $fillable = [
        'name',
        'slug',
        'description',
        'short_description',
        'price',
        'discount_price',
        'cost_price',
        'stock',
        'reorder_level',
        'status',
        'meta_title',
        'meta_description',
        'meta_keywords',
        'brand_id',
        'product_group_id',
    ];

    protected $casts = [
        'price' => 'float',
        'discount_price' => 'float',
        'cost_price' => 'float',
    ];

    protected static function booted()
    {
        static::creating(function ($product) {
            if (!$product->sku) {
                $product->sku = 'LO-' .
                    collect(explode(' ', $product->name))
                        ->filter()
                        ->map(fn($word) => strtoupper($word[0]))
                        ->take(6)
                        ->implode('') .
                    '-' . strtoupper(Str::random(4));
            }
        });
    }

    public function categories(): BelongsToMany
    {
        return $this->belongsToMany(Category::class, 'category_product', 'product_id', 'category_id');
    }

    public function brand(): BelongsTo
    {
        return $this->belongsTo(Brand::class, 'brand_id');
    }

    public function images(): HasMany
    {
        return $this->hasMany(ProductImage::class);
    }

    public function featuredImage(): HasOne
    {
        return $this->hasOne(ProductImage::class)->where('is_featured', true);
    }

    public function group(): BelongsTo
    {
        return $this->belongsTo(ProductGroup::class, 'product_group_id');
    }

    public function wishlists(): BelongsToMany
    {
        return $this->belongsToMany(Wishlist::class, 'wishlist_items');
    }

    public function comments(): HasMany
    {
        return $this->hasMany(ProductComment::class);
    }

    public function averageRating(): float
    {
        return round($this->comments()->avg('rating') ?? 0, 1);
    }

    public function getPrice(): Attribute
    {
        return Attribute::make(
            get: fn () => $this->discount_price ?? $this->price
        );
    }

    public function isOutOfStock(): bool
    {
        return $this->stock <= 0;
    }
}
