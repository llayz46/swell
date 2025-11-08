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
        $totalUsers = User::all()->count();
        $newUsers = User::where('created_at', '>=', now()->startOfMonth())->count();
        $activeProducts = Product::where('status', true)->count();

        $totalOrders = Order::all();
        $currentMonthOrders = Order::where('created_at', '>=', now()->startOfMonth())->count();
        $lastMonthOrders = Order::whereBetween('created_at', [now()->subMonth()->startOfMonth(), now()->subMonth()->endOfMonth()])->count();
        $ordersPercentageChange = $lastMonthOrders > 0 ? round((($currentMonthOrders - $lastMonthOrders) / $lastMonthOrders) * 100, 2) : 0;

        $totalRevenue = $totalOrders->sum('amount_total');
        $currentMonthRevenue = Order::where('created_at', '>=', now()->startOfMonth())->sum('amount_total');
        $lastMonthRevenue = Order::whereBetween('created_at', [now()->subMonth()->startOfMonth(), now()->subMonth()->endOfMonth()])->sum('amount_total');
        $revenuePercentageChange = $lastMonthRevenue > 0 ? round((($currentMonthRevenue - $lastMonthRevenue) / $lastMonthRevenue) * 100, 2) : 0;

        $lastProducts = Product::orderBy('created_at', 'desc')->with(['brand:id,name', 'category:id,name'])->take(5)->get();
        $lastOrders = Order::orderBy('created_at', 'desc')->with('user:id,name')->take(5)->get();

        return Inertia::render('admin/dashboard', [
            'totalUsers' => fn () => $totalUsers,
            'newUsers' => fn () => $newUsers,
            'activeProducts' => fn () => $activeProducts,
            'totalOrders' => fn () => $totalOrders->count(),
            'ordersPercentageChange' => fn () => $ordersPercentageChange,
            'totalRevenue' => fn () => $totalRevenue,
            'revenuePercentageChange' => fn () => $revenuePercentageChange,
            'lastProducts' => fn () => ProductResource::collection($lastProducts),
            'lastOrders' => fn () => OrderResource::collection($lastOrders),
        ]);
    }
}
