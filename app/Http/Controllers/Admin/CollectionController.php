<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Collection\StoreCollectionRequest;
use App\Http\Requests\Collection\UpdateCollectionRequest;
use App\Http\Requests\Collection\DeleteCollectionRequest;
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
                ['title' => 'Collections', 'href' => route('admin.collections.index')],
            ],
            'collections' => fn () => CollectionResource::collection(Collection::withCount('products')->get()),
        ]);
    }

    public function store(StoreCollectionRequest $request)
    {
        $data = $request->validated();

        Collection::create($data);

        return redirect()->back()->with('success', 'Collection créé avec succès.');
    }

    public function update(UpdateCollectionRequest $request, Collection $collection)
    {
        $data = $request->validated();

        $collection->update($data);

        return redirect()->route('admin.collections.index');
    }

    public function destroy(DeleteCollectionRequest $request, Collection $collection)
    {
        $request->validated();

        try {
            $collection->delete();
        } catch (\Exception $e) {
            return redirect()->back()->withErrors(['error' => 'Impossible de supprimer la collection.']);
        }

        return redirect()->route('admin.collections.index');
    }
}
