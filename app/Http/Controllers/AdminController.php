<?php

namespace App\Http\Controllers;

use App\Http\Resources\OrderResource;
use App\Http\Resources\ProductResource;
use App\Models\Order;
use App\Models\Product;
use App\Models\User;
use Inertia\Inertia;

class AdminController extends Controller
{
    public function __invoke()
    {
        $clients = User::where('created_at', '>=', now()->startOfMonth())->count();
        $products = Product::where('status', true)->count();
        $orders = Order::where('created_at', '>=', now()->startOfMonth())->count();
        $lastProducts = Product::orderBy('created_at', 'desc')->with(['brand:id,name', 'category:id,name'])->take(5)->get();
        $lastOrders = Order::orderBy('created_at', 'desc')->with('user:id,name')->take(5)->get();

        return Inertia::render('admin/dashboard', [
            'clients' => fn () => $clients,
            'products' => fn () => $products,
            'orders' => fn () => $orders,
            'lastProducts' => fn () => ProductResource::collection($lastProducts),
            'lastOrders' => fn () => OrderResource::collection($lastOrders),
        ]);
    }
}
