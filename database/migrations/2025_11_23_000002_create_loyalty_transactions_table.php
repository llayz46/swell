<?php

use App\Models\Order;
use App\Modules\Loyalty\Models\LoyaltyAccount;
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
        Schema::create('loyalty_transactions', function (Blueprint $table) {
            $table->id();
            $table->foreignIdFor(LoyaltyAccount::class)->constrained()->cascadeOnDelete();
            $table->string('type'); // enum: earned, spent, expired, refunded, admin_adjustment
            $table->integer('points'); // Can be positive or negative
            $table->unsignedInteger('balance_after')->default(0);
            $table->string('description')->nullable();
            $table->foreignIdFor(Order::class)->nullable()->constrained()->nullOnDelete();
            $table->timestamp('expires_at')->nullable();
            $table->timestamps();

            $table->index(['loyalty_account_id', 'created_at']);
            $table->index('type');
            $table->index('expires_at');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('loyalty_transactions');
    }
};
