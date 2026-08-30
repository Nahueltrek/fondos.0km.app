# ENVIRONMENT.md — variables de entorno de `api/`

Nunca subir `.env` a git (ya está en `.gitignore`) ni pegar valores reales
en commits, PRs, o chats. Este documento explica **qué es cada variable**,
no sus valores.

## Frontend (raíz del repo, `fondos-0km-app`)

| Variable | Para qué |
|---|---|
| `VITE_API_URL` | URL base de esta API Laravel (ej. `https://api.fondos.0km.app` o `https://fondos.0km.app/api` según cómo quede publicada). Se agrega en Fase D, cuando el frontend deje de usar Supabase. |
| `VITE_WHATSAPP_NUMBER` | Número de WhatsApp real de 0km, en formato internacional sin `+` (ej. `56912345678`). Mientras esté vacío, el botón de WhatsApp debe quedar oculto/desactivado — nunca mostrar un link roto (Fase 1, punto 28). |

## Backend (`api/.env`)

| Variable | Para qué |
|---|---|
| `APP_ENV` | `local` en desarrollo, `production` en el hosting real. Determina si los seeders de desarrollo pueden correr (`DatabaseSeeder.php` los bloquea fuera de `local`/`testing`). |
| `APP_KEY` | Clave de cifrado de Laravel. Se genera con `php artisan key:generate`, nunca se escribe a mano. |
| `APP_DEBUG` | `true` en desarrollo (muestra stack traces). **Debe ser `false` en producción** — si no, cualquier error expone rutas del servidor y detalles internos. |
| `APP_URL` | URL pública de esta API. |
| `DB_CONNECTION` | `sqlite` en desarrollo local (no requiere nada más), `mysql` en producción. |
| `DB_HOST`, `DB_PORT`, `DB_DATABASE`, `DB_USERNAME`, `DB_PASSWORD` | Credenciales de la base MySQL del hosting. Las provee quien administra el hosting (Nahuel) — ver DEPLOY_API.md para cómo se entregan de forma segura. |
| `DEV_ADMIN_PASSWORD` | Solo usado por `RoleSeeder` (que nunca corre fuera de `local`/`testing`). Contraseña de los usuarios `dev-<rol>@fondos.0km.app` que se crean para probar el admin localmente. Sin efecto en producción. |
| `SESSION_DRIVER`, `CACHE_STORE`, `QUEUE_CONNECTION` | Configurados en `database` — usan las tablas que ya vienen migradas de fábrica (`cache`, `jobs`, `sessions`), no requieren Redis ni nada adicional en el hosting. |

## Cómo se entregan las credenciales reales

Nunca por chat en texto plano si se puede evitar, y nunca en un archivo
versionado. Camino recomendado: quien administra el hosting (Nahuel) crea
el archivo `api/.env` directamente en el servidor a partir de
`api/.env.example` (o lo edita ahí mismo), sin que ese archivo pase por
git en ningún momento.
