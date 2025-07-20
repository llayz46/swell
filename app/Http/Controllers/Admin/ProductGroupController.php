<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\ProductGroup;
use Illuminate\Http\Request;

class ProductGroupController extends Controller
{
    public function __invoke(Request $request)
    {
        $slug = str($request->input('name'))->slug()->toString();

        $request->merge(['slug' => $slug]);

        $request->validate([
            'name' => 'required|string|max:255',
            'slug' => 'required|string|max:255|unique:product_groups,slug',
        ]);

        ProductGroup::create($request->only(['name', 'slug']));

        return redirect()->back()->with('success', 'Groupe créé avec succès.');
    }
}
