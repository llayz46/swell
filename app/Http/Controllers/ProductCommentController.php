<?php

namespace App\Http\Controllers;

use App\Http\Requests\ProductCommentRequest;
use App\Http\Resources\ProductCommentResource;
use App\Models\ProductComment;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class ProductCommentController extends Controller
{
    public function store(ProductCommentRequest $request)
    {
        $data = $request->validated();

        if (!Auth::user()->orders()->whereHas('items', function ($query) use ($data) {
            $query->where('product_id', $data['product_id']);
        })->exists()) {
            return redirect()->back()->withErrors(['Vous devez avoir acheté ce produit pour pouvoir le commenter.']);
        }

        $comment = Auth::user()->comments()->where('product_id', $data['product_id'])->get();

        if ($comment->isNotEmpty()) {
            return redirect()->back()->withErrors(['Vous avez déjà commenté ce produit.']);
        }

        Auth::user()->comments()->create($data);

        return redirect()->back();
    }

    public function update(ProductComment $productComment, ProductCommentRequest $request)
    {
        if ($productComment->user_id !== Auth::id()) {
            return redirect()->back()->withErrors(['Vous n\'êtes pas autorisé à modifier ce commentaire.']);
        }

        $data = $request->validated();

        if (array_diff($data, $productComment->only(['title', 'comment', 'rating', 'product_id'])) === []) {
            return redirect()->back()->withErrors(['Aucune modification n\'a été apportée.']);
        }

        $productComment->update($data);

        return redirect()->back();
    }
}
