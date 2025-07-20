<?php

namespace App\Actions\Category;

use App\Enums\CategoryStatus;
use App\Models\Category;
use Illuminate\Support\Facades\Cache;

class HandleCategory
{
    public function create(array $data)
    {
        Category::create([
            'name' => $data['name'],
            'slug' => $data['slug'],
            'description' => $data['description'] ?? null,
            'parent_id' => $data['parent_id'] ?? null,
            'status' => $data['status'] ?? CategoryStatus::Inactive,
        ]);

        Cache::forget("categories");
    }

    public function update(Category $category, array $data)
    {
        $category->update([
            'name' => $data['name'],
            'slug' => $data['slug'],
            'description' => $data['description'] ?? null,
            'parent_id' => $data['parent_id'] ?? null,
            'status' => $data['status'] ?? CategoryStatus::Inactive,
        ]);

        Cache::forget("categories");
    }

    public function delete($category)
    {
        $category->products()->detach();

        $category->delete();

        Cache::forget("categories");
    }
}
