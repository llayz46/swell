<?php

namespace App\Modules\Workspace\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class IssueLabel extends Model
{
    /** @use HasFactory<\Database\Factories\IssueLabelFactory> */
    use HasFactory;

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
