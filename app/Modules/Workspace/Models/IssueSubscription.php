<?php

namespace App\Modules\Workspace\Models;

use App\Models\User;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class IssueSubscription extends Model
{
    public $timestamps = false;

    public $incrementing = false;

    protected $primaryKey = ['issue_id', 'user_id'];

    protected $fillable = [
        'issue_id',
        'user_id',
        'created_at',
    ];

    protected $casts = [
        'created_at' => 'datetime',
    ];

    public function issue(): BelongsTo
    {
        return $this->belongsTo(Issue::class);
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    protected function setKeysForSaveQuery($query)
    {
        return $query
            ->where('issue_id', $this->getAttribute('issue_id'))
            ->where('user_id', $this->getAttribute('user_id'));
    }
}
