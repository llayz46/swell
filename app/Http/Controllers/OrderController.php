<?php

namespace App\Http\Controllers;

use App\Http\Resources\OrderResource;
use App\Models\Order;
use Illuminate\Http\Request;
use Inertia\Inertia;

class OrderController extends Controller
{
    public function index()
    {
        return Inertia::render('dashboard/orders', [
            'orders' => fn () => OrderResource::collection(auth()->user()->orders->load('items.product.featuredImage')),
        ]);
    }
}
