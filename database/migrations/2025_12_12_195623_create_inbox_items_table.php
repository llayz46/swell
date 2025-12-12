<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use App\Models\User;
use App\Modules\Workspace\Models\Issue;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('inbox_items', function (Blueprint $table) {
            $table->id();
            
            $table->foreignIdFor(User::class, 'user_id')
                ->constrained()
                ->cascadeOnUpdate()
                ->cascadeOnDelete();

            $table->foreignIdFor(Issue::class, 'issue_id')
                ->constrained()
                ->cascadeOnUpdate()
                ->cascadeOnDelete();

            $table->enum('type', [
                'comment',
                'mention',
                'assignment',
                'status',
                'reopened',
                'closed',
                'edited',
                'created',
            ]);

            $table->text('content')->nullable();

            $table->foreignIdFor(User::class, 'actor_id')
                ->constrained()
                ->cascadeOnUpdate()
                ->restrictOnDelete();

            $table->boolean('read')->default(false);
            $table->timestamp('read_at')->nullable();
            
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('inbox_items');
    }
};
