<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use App\Models\User;
use App\Modules\Workspace\Models\Team;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('team_user', function (Blueprint $table) {
            $table->id();
            
            $table->foreignIdFor(Team::class, 'team_id')
                ->constrained('teams')
                ->cascadeOnUpdate()
                ->cascadeOnDelete();
                
            $table->foreignIdFor(User::class, 'user_id')
                ->constrained('users')
                ->cascadeOnUpdate()
                ->cascadeOnDelete();
                
            $table->enum('role', ['lead', 'member']);
    
            $table->timestamp('joined_at')->useCurrent(); 
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('team_user');
    }
};
