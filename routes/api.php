<?php
namespace App\Http\Controllers;
use Illuminate\Support\Facades\RateLimiter;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;

RateLimiter::for('api', function ($request) {
    return \Illuminate\Cache\RateLimiting\Limit::perMinute(60)->by($request->ip());
});

Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);
Route::post('/logout', [AuthController::class, 'logout'])->middleware('auth:sanctum');