<?php

namespace App\Modules\Workspace\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class IssueLabel extends Model
{
    use HasFactory;
    
    protected static function newFactory()
    {
        return \App\Modules\Workspace\database\factories\IssueLabelFactory::new();
    }

    protected $fillable = [
        'slug',
        'name',
        'color',
    ];

    public function issues(): BelongsToMany
    {
        return $this->belongsToMany(Issue::class, 'issue_label');
    }
}
