<?php

use App\Http\Controllers\Admin\DashboardController;
use App\Http\Controllers\Admin\FundController as AdminFundController;
use App\Http\Controllers\Admin\LeadController as AdminLeadController;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\FundController;
use App\Http\Controllers\LeadController;
use Illuminate\Support\Facades\Route;

// Público (sección 19-20). Rate limit propio, más laxo que el de admin,
// para no bloquear tráfico real de visitantes (sección 22 pide rate
// limiting, sin especificar valores — se ajustan si hace falta).
Route::middleware('throttle:60,1')->group(function () {
    Route::get('/funds', [FundController::class, 'index']);
    Route::get('/funds/{slug}', [FundController::class, 'show']);
    Route::post('/leads', [LeadController::class, 'store']);
    Route::post('/diagnostics', [LeadController::class, 'storeDiagnostic']);
});

// Login del admin, throttling estricto (fuerza bruta).
Route::post('/auth/login', [AuthController::class, 'login'])->middleware('throttle:5,1');

// Admin — todo detrás de Sanctum. La autorización fina (por rol) vive en
// las Policies; acá solo se exige "estar autenticado".
Route::middleware('auth:sanctum')->group(function () {
    Route::post('/auth/logout', [AuthController::class, 'logout']);
    Route::get('/auth/me', [AuthController::class, 'me']);

    Route::prefix('admin')->group(function () {
        Route::get('/dashboard', [DashboardController::class, 'index']);

        Route::get('/funds', [AdminFundController::class, 'index']);
        Route::get('/funds/{fund}', [AdminFundController::class, 'show']);
        Route::post('/funds', [AdminFundController::class, 'store']);
        Route::put('/funds/{fund}', [AdminFundController::class, 'update']);
        Route::patch('/funds/{fund}', [AdminFundController::class, 'update']);
        Route::post('/funds/{fund}/verify', [AdminFundController::class, 'verify']);

        Route::get('/leads', [AdminLeadController::class, 'index']);
        Route::get('/leads/{lead}', [AdminLeadController::class, 'show']);
        Route::patch('/leads/{lead}', [AdminLeadController::class, 'update']);
    });
});
