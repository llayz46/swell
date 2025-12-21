<?php

namespace App\Modules\Workspace\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class IssuePriority extends Model
{
    use HasFactory;
    
    protected static function newFactory()
    {
        return \App\Modules\Workspace\database\factories\IssuePriorityFactory::new();
    }

    protected $fillable = [
        'slug',
        'name',
        'color',
        'icon_type',
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
