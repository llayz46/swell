<?php

namespace App\Http\Controllers\Admin;

use App\Actions\Category\HandleCategory;
use App\Http\Controllers\Controller;
use App\Http\Requests\Category\StoreCategoryRequest;
use App\Http\Requests\Category\UpdateCategoryRequest;
use App\Http\Requests\Category\DeleteCategoryRequest;
use App\Models\Category;
use Illuminate\Http\Request;
use Inertia\Inertia;

class CategoryController extends Controller
{
    /**
     * @var HandleCategory
     */
    protected HandleCategory $handleCategory;

    /**
     * Admin\CategoryController constructor.
     *
     * @param HandleCategory $handleCategory
     */
    public function __construct(HandleCategory $handleCategory)
    {
        $this->handleCategory = $handleCategory;
    }

    public function index()
    {
        return Inertia::render('admin/categories', [
            'breadcrumbs' => [
                ['title' => 'Admin', 'href' => route('admin.dashboard')],
                ['title' => 'Catégories', 'href' => route('admin.categories.index')],
            ],
        ]);
    }

    public function store(StoreCategoryRequest $request)
    {
        $this->handleCategory->create($request->validated());

        return redirect()->route('admin.categories.index');
    }

    public function update(UpdateCategoryRequest $request, Category $category)
    {
        $this->handleCategory->update($category, $request->validated());

        return redirect()->route('admin.categories.index');
    }

    public function destroy(DeleteCategoryRequest $request, Category $category)
    {
        $request->validated();

        $this->handleCategory->delete($category);

        return redirect()->route('admin.categories.index');
    }
}
