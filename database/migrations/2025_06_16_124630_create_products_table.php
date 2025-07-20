<?php

use App\Models\Brand;
use App\Models\ProductGroup;
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
        Schema::create('products', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('slug')->unique();
            $table->string('sku')->unique();
            $table->text('description');
            $table->string('short_description', 500);

            $table->decimal('price', 10, 2);
            $table->decimal('discount_price', 10, 2)->nullable();
            $table->decimal('cost_price', 10, 2);

            $table->unsignedInteger('stock')->default(0);
            $table->unsignedInteger('reorder_level')->default(10);

            $table->boolean('status')->default(true);

            $table->string('meta_title')->nullable();
            $table->string('meta_description', 255)->nullable();
            $table->string('meta_keywords', 255)->nullable();

            $table->foreignIdFor(Brand::class)->constrained()->restrictOnDelete();
            $table->foreignIdFor(ProductGroup::class)->nullable()->constrained()->nullOnDelete();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('products');
    }
};
