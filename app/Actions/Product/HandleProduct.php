<?php

namespace App\Actions\Product;

use App\Enums\CategoryStatus;
use App\Models\Category;
use App\Models\Product;
use App\Models\ProductImage;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Storage;

class HandleProduct
{
    public function delete(Product $product)
    {
        $product->delete();
    }

    public function update(Product $product, array $data): Product
    {
        $product->update([
            'name' => $data['name'],
            'slug' => $data['slug'],
            'description' => $data['description'] ?? null,
            'short_description' => $data['short_description'] ?? null,
            'price' => $data['price'],
            'discount_price' => $data['discount_price'] ?? null,
            'cost_price' => $data['cost_price'],
            'stock' => $data['stock'],
            'reorder_level' => $data['reorder_level'],
            'status' => $data['status'],
            'meta_title' => $data['meta_title'] ?? null,
            'meta_description' => $data['meta_description'] ?? null,
            'meta_keywords' => $data['meta_keywords'] ?? null,
            'brand_id' => $data['brand_id'] ?? null,
            'product_group_id' => $data['group_id'] ?? null,
        ]);

        if (isset($data['category_id'])) {
            $this->handleCategories($data['category_id'], $product);
        }

        if (isset($data['images']) && is_array($data['images'])) {
            $this->handleImages($product, $data['images']);
        }

        Cache::forget("product:{$product->id}:details");
        Cache::forget("product:{$product->id}:similar");

        return $product;
    }

    public function create(array $data): Product
    {
        $product = Product::create([
            'name' => $data['name'],
            'slug' => $data['slug'],
            'description' => $data['description'] ?? null,
            'short_description' => $data['short_description'] ?? null,
            'price' => $data['price'],
            'discount_price' => $data['discount_price'] ?? null,
            'cost_price' => $data['cost_price'],
            'stock' => $data['stock'],
            'reorder_level' => $data['reorder_level'],
            'status' => $data['status'],
            'meta_title' => $data['meta_title'] ?? null,
            'meta_description' => $data['meta_description'] ?? null,
            'meta_keywords' => $data['meta_keywords'] ?? null,
            'brand_id' => $data['brand_id'] ?? null,
            'product_group_id' => $data['group_id'] ?? null,
        ]);

        if (isset($data['category_id'])) {
            $this->handleCategories($data['category_id'], $product);
        }

        if (isset($data['images']) && is_array($data['images'])) {
            $this->handleImages($product, $data['images']);
        }

        return $product;
    }

    protected function handleImages(Product $product, array $images): void
    {
        $handledIds = [];

        foreach ($images as $imgData) {
            $imageFile = $imgData['image_file'] ?? null;

            if ($imageFile instanceof UploadedFile) {
                $path = $imageFile->store('product-images', 'public');

                if (!empty($imgData['id'])) {
                    $productImage = ProductImage::find($imgData['id']);

                    if ($productImage) {
                        if ($productImage->image_url) {
                            Storage::disk('public')->delete($productImage->image_url);
                        }

                        $productImage->update([
                            'image_url' => $path,
                            'alt_text' => $imgData['alt_text'] ?? '',
                            'is_featured' => $imgData['is_featured'] ?? false,
                            'order' => $imgData['order'] ?? 1,
                        ]);

                        $handledIds[] = $productImage->id;
                        continue;
                    }
                }

                $newImage = $product->images()->create([
                    'image_url' => $path,
                    'alt_text' => $imgData['alt_text'] ?? '',
                    'is_featured' => $imgData['is_featured'] ?? false,
                    'order' => $imgData['order'] ?? 1,
                ]);

                $handledIds[] = $newImage->id;
            }

            elseif (!empty($imgData['id'])) {
                $productImage = ProductImage::find($imgData['id']);

                if ($productImage) {
                    $productImage->update([
                        'alt_text' => $imgData['alt_text'] ?? '',
                        'is_featured' => $imgData['is_featured'] ?? false,
                        'order' => $imgData['order'] ?? 1,
                    ]);

                    $handledIds[] = $productImage->id;
                }
            }
        }

        $existingIds = $product->images()->pluck('id')->toArray();
        $idsToDelete = array_diff($existingIds, $handledIds);

        if (!empty($idsToDelete)) {
            $imagesToDelete = ProductImage::whereIn('id', $idsToDelete)->get();

            foreach ($imagesToDelete as $img) {
                if ($img->image_url) {
                    Storage::disk('public')->delete($img->image_url);
                }

                $img->delete();
            }
        }

        $hasFeatured = $product->images()->where('is_featured', true)->exists();

        if (!$hasFeatured && $product->images()->count() > 0) {
            $firstImage = $product->images()->orderBy('order', 'asc')->first();
            if ($firstImage) {
                $firstImage->update(['is_featured' => true]);
            }
        }
    }

    protected function handleCategories(int $categoryId, Product $product): void
    {
        $category = Category::findOrFail($categoryId);

        if ($category->status !== CategoryStatus::Active) throw new \Exception('La catégorie est inactive.');

        $product->categories()->sync($categoryId);
    }
}
