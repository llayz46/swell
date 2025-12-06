<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Brand\StoreBrandRequest;
use App\Http\Requests\Brand\UpdateBrandRequest;
use App\Http\Requests\Brand\DeleteBrandRequest;
use App\Http\Resources\BrandResource;
use App\Models\Brand;
use Illuminate\Http\Request;
use Inertia\Inertia;

class BrandController extends Controller
{
    public function index()
    {
        return Inertia::render('admin/brands', [
            'breadcrumbs' => [
                ['title' => 'Admin', 'href' => route('admin.dashboard')],
                ['title' => 'Marques', 'href' => route('admin.brands.index')],
            ],
            'brands' => fn () => BrandResource::collection(Brand::withCount('products')->get()),
        ]);
    }

    public function store(StoreBrandRequest $request)
    {
        $brand = Brand::create($request->validated());

        if ($request->hasFile('logo_url')) {
            $brand->update(['logo_url' => $request->file('logo_url')->store('brands', 'public')]);
        }

        return redirect()->back();
    }

    public function update(UpdateBrandRequest $request, Brand $brand)
    {
        $data = $request->validated();

        if ($request->hasFile('logo_url')) {
            $brand->update($data);
        } else {
             $brand->update(collect($data)->except('logo_url')->toArray());
        }

        if ($request->hasFile('logo_url')) {
            if ($brand->logo_url) {
                \Storage::disk('public')->delete($brand->logo_url);
            }

            $brand->update([
                'logo_url' => $request->file('logo_url')->store('brands', 'public'),
            ]);
        }

        return redirect()->route('admin.brands.index');
    }

    public function destroy(DeleteBrandRequest $request, Brand $brand)
    {
        $request->validated();

        try {
            $brand->delete();
        } catch (\Exception $e) {
            return redirect()->back()->withErrors(['error' => 'Impossible de supprimer la marque car elle est associée à des produits.']);
        }

        return redirect()->route('admin.brands.index');
    }
}
