<?php

use Illuminate\Support\Facades\Route;

// API-only backend. La interfaz pública vive en el React de la raíz del
// repo; acá solo dejamos un endpoint informativo para confirmar que el
// backend está arriba (además del healthcheck en /up).
Route::get('/', fn () => response()->json([
    'app' => 'fondos.0km.app API',
    'status' => 'ok',
]));
