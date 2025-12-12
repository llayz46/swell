<?php

namespace App\Modules\Workspace\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class IssuePriority extends Model
{
    /** @use HasFactory<\Database\Factories\IssuePriorityFactory> */
    use HasFactory;

    protected $fillable = [
        'slug',
        'name',
        'color',
        'order',
    ];

    protected $casts = [
        'order' => 'integer',
    ];

    public function issues(): HasMany
    {
        return $this->hasMany(Issue::class, 'priority_id');
    }
}
