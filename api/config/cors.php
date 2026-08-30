<?php

// Fase D: sin este archivo, HandleCors (registrado por defecto en el
// middleware global) queda inerte — lee config('cors.paths', []), que sin
// este archivo publicado es [], así que ninguna ruta hace match y nunca se
// agregan headers CORS. El navegador bloquea entonces cualquier fetch
// cross-origin desde fondos.0km.app hacia api.fondos.0km.app aunque el
// backend responda bien (el error solo se ve en la consola del navegador,
// no en los logs del servidor).
//
// Auth es por token Sanctum (Authorization: Bearer, no cookies de sesión),
// por eso supports_credentials queda en false — no hace falta credentials
// para que el navegador acepte la respuesta.

return [

    'paths' => ['api/*'],

    'allowed_methods' => ['*'],

    'allowed_origins' => array_filter([
        env('FRONTEND_URL', 'https://fondos.0km.app'),
        'https://www.fondos.0km.app',
    ]),

    // Vite dev server local (puerto variable según lo que esté libre).
    'allowed_origins_patterns' => [
        '#^http://localhost:\d+$#',
    ],

    'allowed_headers' => ['*'],

    'exposed_headers' => [],

    'max_age' => 0,

    'supports_credentials' => false,

];
