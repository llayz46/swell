<?php

use App\Models\User;
use App\Modules\Workspace\Models\Issue;
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('issue_comments', function (Blueprint $table) {
            $table->id();
            $table->foreignIdFor(Issue::class)->constrained()->cascadeOnDelete();
            $table->foreignIdFor(User::class)->constrained()->cascadeOnDelete();
            $table->foreignId('parent_id')->nullable()->constrained('issue_comments')->cascadeOnDelete();
            $table->text('content');
            $table->timestamp('edited_at')->nullable();
            $table->timestamps();

            $table->index(['issue_id', 'created_at']);
            $table->index('parent_id');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('issue_comments');
    }
};
