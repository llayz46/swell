<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Collection;
use Illuminate\Http\Request;

class CollectionController extends Controller
{
    public function __invoke(Request $request)
    {
        $slug = str($request->input('title'))->slug()->toString();

        $request->merge(['slug' => $slug]);

        $request->validate([
            'title' => 'required|string|max:255',
            'slug' => 'required|string|max:255|unique:collections,slug',
        ]);

        Collection::create($request->only(['title', 'slug']));

        return redirect()->back()->with('success', 'Collection créé avec succès.');
    }
}
