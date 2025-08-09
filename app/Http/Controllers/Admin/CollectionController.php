<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\CollectionRequest;
use App\Http\Resources\CollectionResource;
use App\Models\Collection;
use Illuminate\Http\Request;
use Inertia\Inertia;

class CollectionController extends Controller
{
    public function index()
    {
        return Inertia::render('admin/collections', [
            'breadcrumbs' => [
                ['title' => 'Admin', 'href' => route('admin.dashboard')],
                ['title' => 'Collections', 'href' => route('admin.categories.index')],
            ],
            'collections' => fn () => CollectionResource::collection(Collection::withCount('products')->get()),
        ]);
    }

    public function store(CollectionRequest $request)
    {
        $data = $request->validated();

        Collection::create($data);

        return redirect()->back()->with('success', 'Collection créé avec succès.');
    }

    public function update(CollectionRequest $request, Collection $collection)
    {
        $data = $request->validated();

        $collection->update($data);

        return redirect()->route('admin.collections.index');
    }

    public function destroy(Request $request, Collection $collection)
    {
        $request->validate(
            ['name' => 'required|in:' . $collection->title],
            [
                'name.required' => 'Le nom de la collection est requis.',
                'name.in' => 'Le nom saisi ne correspond pas au nom de la collection à supprimer.',
            ]
        );

        try {
            $collection->delete();
        } catch (\Exception $e) {
            return redirect()->back()->withErrors(['error' => 'Impossible de supprimer la collection car elle est associée à des produits.']);
        }

        return redirect()->route('admin.collections.index');
    }
}
