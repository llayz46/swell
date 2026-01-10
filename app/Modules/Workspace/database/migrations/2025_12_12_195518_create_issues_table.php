<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use App\Modules\Workspace\Models\IssueStatus;
use App\Modules\Workspace\Models\IssuePriority;
use App\Models\User;
use App\Modules\Workspace\Models\Team;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('issues', function (Blueprint $table) {
            $table->id();
            
            $table->string('identifier', 50)->unique();
            $table->string('title', 255);
            $table->text('description')->nullable();
            
            $table->foreignIdFor(IssueStatus::class, 'status_id')->constrained()->cascadeOnUpdate();
            $table->foreignIdFor(IssuePriority::class, 'priority_id')->constrained()->cascadeOnUpdate();
            $table->foreignIdFor(User::class, 'assignee_id')->nullable()->constrained()->nullOnDelete()->cascadeOnUpdate();
            $table->foreignIdFor(User::class, 'creator_id')->constrained()->restrictOnDelete()->cascadeOnUpdate();
            $table->foreignIdFor(Team::class, 'team_id')->constrained()->cascadeOnDelete()->cascadeOnUpdate();
            
            $table->timestamp('due_date')->nullable();
            
            $table->string('rank', 50);
            
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('issues');
    }
};
