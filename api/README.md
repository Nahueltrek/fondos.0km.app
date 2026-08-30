# fondos.0km.app — API

Backend Laravel 13 (API-only, MySQL en producción) del proyecto
`fondos.0km.app`. El frontend público vive en la raíz de este mismo
repositorio (`../src`, React + Vite).

Ver también, en la raíz del repo: `MASTER_PLAN_FONDOS_0KM.md`,
`ARCHITECTURE_FONDOS_0KM.md`, `DATA_GOVERNANCE_FONDOS_0KM.md`,
`SCHEMA_REVIEW_FONDOS_0KM.md`.

## Stack

- Laravel 13 (PHP ^8.3), API-only — sin Blade/Vite propio, sin sesiones
  web (autenticación del admin vía Sanctum, tokens Bearer).
- MySQL en producción; SQLite para desarrollo local y tests.
- Autorización con Laravel Policies (no RLS — ver `SCHEMA_REVIEW_FONDOS_0KM.md`).

## Desarrollo local

```bash
cd api
composer install
cp .env.example .env
php artisan key:generate
touch database/database.sqlite   # sqlite alcanza en local
php artisan migrate
php artisan db:seed              # solo en local: usuarios dev-<rol>@... + fondos [DEV]
php artisan serve
```

Los seeders de desarrollo (`RoleSeeder`, `FundDevSeeder`) están
bloqueados fuera de `local`/`testing` por `DatabaseSeeder` — no hace
falta acordarse de no correrlos en producción, la app misma lo impide.

## Tests

```bash
php artisan test
```

Corren contra sqlite en memoria (configurado en `phpunit.xml`), aislados
de tu base de desarrollo. Cubren los 4 grupos de la sección 38 del Master
Plan: fondos (solo `verified` público), leads (validación + scoring
server-side), autorización (por rol) y verificación (historial
append-only).

## Estructura relevante

```
api/
├── app/
│   ├── Console/Commands/MakeSuperAdmin.php   # bootstrap del primer admin
│   ├── Enums/                                # FundStatus, VerificationStatus, etc.
│   ├── Http/Controllers/                     # públicos + Admin/
│   ├── Http/Requests/                        # validación, Admin/ para el panel
│   ├── Models/                               # Fund, FundVerification, Lead, UserRole, User
│   ├── Policies/                              # autorización por rol
│   └── Services/LeadScoringService.php        # scoring centralizado (sección 25)
├── database/
│   ├── migrations/
│   └── seeders/                               # RoleSeeder, FundDevSeeder (solo dev)
├── routes/api.php
└── tests/Feature/
```

## Rutas principales

Públicas: `GET /api/funds`, `GET /api/funds/{slug}`, `POST /api/leads`,
`POST /api/diagnostics`, `POST /api/auth/login`.

Admin (requieren `Authorization: Bearer <token>` de Sanctum):
`GET /api/admin/dashboard`, `/api/admin/funds`, `/api/admin/leads`.

## Desplegar en producción

Ver `DEPLOY_API.md` — instrucciones paso a paso para el hosting real,
incluyendo por qué `APP_DEBUG` debe ir en `false` y cómo crear el primer
`super_admin` de forma segura (`php artisan app:make-super-admin`, nunca
con SQL a mano).

Variables de entorno documentadas en `ENVIRONMENT.md` (sin secretos).
