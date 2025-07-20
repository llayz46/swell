<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\BannerMessage;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;
use Inertia\Inertia;

class BannerController extends Controller
{
    public function index()
    {
        return Inertia::render('admin/banners', [
            'breadcrumbs' => [
                ['title' => 'Admin', 'href' => route('admin.dashboard')],
                ['title' => 'Bannières', 'href' => route('admin.banners.index')],
            ]
        ]);
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'message' => 'required|string|max:255'
        ]);

        $banner = BannerMessage::create([
            'message' => $data['message'],
            'is_active' => true,
            'order' => BannerMessage::max('order') + 1,
        ]);

        Cache::forget('infoBanner');

        return back()->with([
            'flash' => [
                'banner' => $banner->toArray(),
            ],
        ]);
    }

    public function update(Request $request, BannerMessage $bannerMessage)
    {
        $request->validate([
            'message' => 'sometimes|required|string|max:255',
            'is_active' => 'sometimes|boolean',
            'order' => 'sometimes|integer|min:0',
        ]);

        $bannerMessage->update($request->only('message', 'is_active', 'order'));

        Cache::forget('infoBanner');

        return redirect()->back()->with('success', 'Bannière mise à jour avec succès.');
    }

    public function ordering(Request $request)
    {
        $banners = $request->input('infoBanner', []);

        foreach ($banners as $banner) {
            $bannerMessage = BannerMessage::find($banner['id']);

            if ($bannerMessage) {
                $bannerMessage->update([
                    'message' => $banner['message'],
                    'is_active' => $banner['is_active'] ?? false,
                    'order' => $banner['order'] ?? 0,
                ]);
            }
        }

        Cache::forget('infoBanner');

        return redirect()->back()->with('success', 'Bannières mises à jour avec succès.');
    }

    public function destroy(BannerMessage $banner)
    {
        $banner->delete();

        Cache::forget('infoBanner');

        return redirect()->back()->with('success', 'Bannière supprimée avec succès.');
    }
}
