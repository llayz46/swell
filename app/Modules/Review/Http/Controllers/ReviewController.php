<?php

namespace App\Modules\Review\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Modules\Review\Http\Requests\ReviewRequest;
use App\Modules\Review\Models\Review;
use Illuminate\Support\Facades\Auth;

class ReviewController extends Controller
{
    public function store(ReviewRequest $request)
    {
        $data = $request->validated();

        if (!Auth::user()->orders()->whereHas('items', function ($query) use ($data) {
            $query->where('product_id', $data['product_id']);
        })->exists()) {
            return redirect()->back()->withErrors(['Vous devez avoir acheté ce produit pour pouvoir le commenter.']);
        }

        $comment = Auth::user()->reviews()->where('product_id', $data['product_id'])->get();

        if ($comment->isNotEmpty()) {
            return redirect()->back()->withErrors(['Vous avez déjà commenté ce produit.']);
        }

        Auth::user()->reviews()->create($data);

        return redirect()->back();
    }

    public function update(Review $review, ReviewRequest $request)
    {
        if ($review->user_id !== Auth::id()) {
            return redirect()->back()->withErrors(['Vous n\'êtes pas autorisé à modifier ce commentaire.']);
        }

        $data = $request->validated();

        if (array_diff($data, $review->only(['title', 'comment', 'rating', 'product_id'])) === []) {
            return redirect()->back()->withErrors(['Aucune modification n\'a été apportée.']);
        }

        $review->update($data);

        return redirect()->back();
    }
}
