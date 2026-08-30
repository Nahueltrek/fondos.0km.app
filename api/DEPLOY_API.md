# DEPLOY_API.md — desplegar el backend Laravel en el hosting real

> **✅ Ya desplegado (2026-08-30)**: `https://api.fondos.0km.app` está en
> producción, confirmado con `/up`, `/api/funds`, login de admin y
> `/api/admin/dashboard` reales. Esta guía queda para la próxima vez que
> haga falta reinstalar desde cero, o como referencia de lo que se hizo.
> Ver la sección "Problemas reales que aparecieron" al final — dos cosas
> no obvias que costó diagnosticar la primera vez.

Esta sesión **no tiene acceso SSH** al hosting (comprobado antes, al
intentar desplegar el frontend). Todo lo de acá lo tenés que correr vos
en el servidor. Si algo falla, pegame el mensaje de error exacto y lo
resolvemos juntos.

Todo lo de `api/` fue validado localmente (35 tests en verde, `php artisan
serve` + pruebas manuales con curl) antes de escribir esto — el código
funciona, lo que falta es la parte de infraestructura que solo vos podés
hacer.

## 0. Requisitos del hosting

Antes de nada, confirmá esto en tu panel (cPanel u otro):

- **PHP 8.3 o superior** (Laravel 13 lo exige). Muchos hostings compartidos
  traen una versión más vieja por default — buscá "Select PHP Version" o
  "MultiPHP Manager" en cPanel y cambiala para este dominio/subdominio.
- **Composer disponible por SSH.** Probá `composer --version` en tu
  terminal SSH. Si no está, algunos cPanel lo traen como
  `/opt/cpanel/composer/bin/composer` o similar — si no aparece, avisame.
- **Una base de datos MySQL** (la mayoría de los hostings compartidos ya
  la incluyen). La creás en cPanel → "MySQL Databases".
- **Extensiones PHP**: mbstring, openssl, pdo_mysql, tokenizer, xml, ctype,
  json, bcmath — casi todos los hostings las traen activadas por default
  para Laravel; si algo falla al correr composer, suele ser por acá.

## 1. Subir el código

Igual que hicimos con el frontend: no puedo hacer `git clone` en tu
servidor. Opciones:

- **Si tu hosting tiene git por SSH**: `git clone https://github.com/Nahueltrek/fondos.0km.app.git`
  y después trabajás dentro de la carpeta `api/`.
- **Si no**: te paso un `.zip` de la carpeta `api/` (sin `vendor/` ni
  `.env`, para que pese poco) y lo subís por SFTP, igual que el `dist/`
  del frontend.

## 2. Ubicación en el servidor — importante

Laravel sirve la app desde la carpeta `api/public/`, **no** desde `api/`
directamente. Si apuntás el dominio a `api/` vas a exponer el código
fuente (`.env` incluido) en vez de la aplicación — un problema de
seguridad real, no solo estético.

Dos formas de resolverlo, de mejor a peor:

**Opción A (recomendada): subdominio dedicado.**
Creá un subdominio, por ejemplo `api.fondos.0km.app`, y en cPanel →
"Subdomains" o "Domains", apuntá su **document root** directamente a
`api/public/`. Así `https://api.fondos.0km.app/` sirve la API limpia.

**Opción B: sin subdominio, con redirect.**
Si no podés crear un subdominio, algunos hostings permiten servir Laravel
desde una subcarpeta con un `.htaccess` que redirige todo hacia
`public/`. Es más frágil y depende de la configuración exacta de Apache
de tu hosting — si tenés que usar esta opción, avisame y armamos el
`.htaccess` específico una vez que sepamos cómo responde tu servidor.

## 3. Crear la base de datos MySQL

En cPanel → "MySQL Databases":

1. Creá una base (ej. `usuario_fondos_api`).
2. Creá un usuario MySQL con contraseña fuerte.
3. Asignale al usuario **todos los privilegios** sobre esa base
   específica (no hace falta más que eso).

Guardá: nombre de la base, usuario, contraseña, host (normalmente
`localhost` o `127.0.0.1` en hosting compartido) y puerto (`3306` por
defecto).

## 4. Configurar `.env`

En el servidor, dentro de `api/`:

```bash
cp .env.example .env
```

Editá `.env` (con el editor de archivos de cPanel o `nano`/`vi` por SSH)
y completá, como mínimo:

```
APP_ENV=production
APP_DEBUG=false
APP_URL=https://api.fondos.0km.app

DB_CONNECTION=mysql
DB_HOST=localhost
DB_PORT=3306
DB_DATABASE=el_nombre_que_creaste
DB_USERNAME=el_usuario_que_creaste
DB_PASSWORD=la_contraseña_que_creaste

# Fase D: config/cors.php lee esta variable para el origen permitido.
# Sin ella cae al default embebido (https://fondos.0km.app), que ya es
# correcto para este proyecto — pero conviene fijarla explícitamente.
FRONTEND_URL=https://fondos.0km.app
```

**`APP_DEBUG=false` es obligatorio en producción** — con `true`, un error
cualquiera expone rutas de archivos y detalles internos del servidor a
quien sea que lo vea (ver ENVIRONMENT.md).

## 5. Instalar dependencias y preparar la app

Todo esto desde SSH, parado en `api/`:

```bash
composer install --no-dev --optimize-autoloader
php artisan key:generate
php artisan config:cache
php artisan route:cache
```

Si `composer install` falla por versión de PHP o memoria, pegame el error
completo.

## 6. Migrar la base de datos

```bash
php artisan migrate --force
```

El `--force` es necesario porque `APP_ENV=production` — es la
confirmación de que sabés que estás corriendo migraciones en producción,
no un typo.

**Nunca corras `php artisan db:seed` en este entorno** — igual no haría
nada (`DatabaseSeeder` está bloqueado fuera de `local`/`testing`), pero
ni siquiera hace falta intentarlo: los datos de desarrollo `[DEV]` no
deben existir acá.

## 7. Crear el primer super_admin

Una sola vez, después de migrar:

```bash
php artisan app:make-super-admin
```

Te va a pedir nombre, email y contraseña interactivamente (la contraseña
no se muestra en pantalla mientras la escribís). Con eso ya podés hacer
login en `/api/auth/login` y vas a tener acceso completo al futuro panel
`/admin`.

## 8. Permisos de archivos

Las carpetas `storage/` y `bootstrap/cache/` tienen que ser escribibles
por el proceso PHP del servidor:

```bash
chmod -R 775 storage bootstrap/cache
```

Si tu hosting usa un usuario/grupo específico para PHP (común en cPanel),
puede que necesites ajustar el owner también — si `storage/logs` no se
puede escribir vas a ver un error 500 apenas algo intente loguear.

## 9. Verificar que quedó arriba

```bash
curl https://api.fondos.0km.app/up
```

Debería responder `200`. Después probá un endpoint real:

```bash
curl https://api.fondos.0km.app/api/funds
```

Debería responder `[]` (array vacío) si todavía no cargaste fondos
reales — eso es correcto, no un error.

## 10. Actualizaciones futuras

Cada vez que haya cambios nuevos en `api/` para desplegar:

```bash
git pull origin main   # o volver a subir el zip actualizado
composer install --no-dev --optimize-autoloader
php artisan migrate --force
php artisan config:cache
php artisan route:cache
```

## Checklist rápido

- [ ] PHP 8.3+ confirmado en el hosting.
- [ ] Subdominio (o subcarpeta) apuntando a `api/public/`, no a `api/`.
- [ ] Base MySQL creada, con usuario y privilegios.
- [ ] `.env` completo, con `APP_ENV=production` y `APP_DEBUG=false`.
- [ ] `composer install --no-dev` corrido sin errores.
- [ ] `php artisan migrate --force` corrido sin errores.
- [ ] `php artisan app:make-super-admin` corrido una vez.
- [ ] `storage/` y `bootstrap/cache/` escribibles.
- [ ] `GET /up` responde 200.
- [ ] `GET /api/funds` responde `[]` (o los fondos reales, si ya cargaste alguno).

## Problemas reales que aparecieron en el primer deploy

Ninguno de estos estaba en la guía original — quedan documentados acá
para la próxima vez.

### 1. `composer install` fallaba: "your php version (8.3.30) does not satisfy that requirement"

El `composer.lock` se había generado en un entorno con PHP 8.4, y
Composer resolvió versiones de Symfony (8.1.x) que exigen PHP 8.4+,
aunque `composer.json` pide `^8.3`. Se corrigió fijando
`platform.php: 8.3.30` en `composer.json` y regenerando el lock con
`composer update` — ya está corregido en el repo, no debería volver a
pasar. Si alguna vez actualizás dependencias (`composer update`) desde
una máquina con PHP distinto al del hosting (8.3.x), puede volver a
pasar — correlo con el mismo `platform.php` seteado, o directamente en
un entorno con PHP 8.3.

### 2. `composer install` interrumpido: "The Process class relies on proc_open, which is not available"

Este hosting tiene `proc_open` deshabilitado (restricción de seguridad
normal en hosting compartido). Composer lo necesita para el hook
automático `@php artisan package:discover` que corre al final de la
instalación. Los paquetes sí se instalan bien — solo falla ese último
paso automático. Se soluciona corriendo el comando a mano después,
directo desde la terminal (no como sub-proceso de Composer, así no
necesita `proc_open`):

```bash
php artisan package:discover --ansi
```

### 3. Document root mal armado en cPanel → carpeta anidada

cPanel en este hosting no deja poner una ruta de Document Root
arbitraria al crear un subdominio: fuerza `<public_html del dominio
padre>/<nombre del subdominio>`. Si subís el código a otro lado y
después lo movés con `mv origen destino` cuando `destino` ya existe
(porque cPanel ya creó esa carpeta con una página de parking), `mv` NO
reemplaza el contenido — mete la carpeta origen **un nivel más adentro**
de lo esperado (`destino/origen/` en vez de reemplazar `destino/`).

Lección: antes de crear el subdominio, primero mirá con `ls -la` qué
document root te va a asignar cPanel (suele ser
`domains/<dominio>/public_html/<subdominio>/`), y subí o mové el código
**directo a esa ruta exacta**, en vez de subirlo a otro lado y mover
después. Si igual movés una carpeta, verificá con `pwd` que tu terminal
esté realmente parada donde pensás — si movés la carpeta en la que estás
parado, `pwd` (en bash) sigue mostrando la ruta vieja aunque la carpeta
física ya esté en otro lado, lo que puede hacer que comandos posteriores
(`rm -rf`, etc.) actúen sobre el lugar equivocado sin avisar.

### 4. Sin `config/cors.php`, la API respondía bien pero el navegador bloqueaba todo igual

Detectado antes de desplegar Fase D, no en producción — pero hubiera
pasado igual si no se revisaba. Laravel registra `HandleCors` en el
middleware global por defecto, pero ese middleware lee
`config('cors.paths', [])`: sin un `config/cors.php` publicado en la
app (no viene por defecto fuera del skeleton inicial), esa config
nunca existe y el default es `[]` — ninguna ruta hace match, así que
nunca se agregan headers `Access-Control-Allow-Origin`. La API
responde 200 perfecto por Postman/curl, pero un fetch real desde
`fondos.0km.app` hacia `api.fondos.0km.app` lo bloquea el navegador
**en silencio** — el error aparece solo en la consola del navegador
del visitante, nunca en los logs del servidor, lo que lo hace muy
difícil de diagnosticar a distancia.

Se agregó `api/config/cors.php` con los orígenes de `fondos.0km.app`
permitidos (ver también `FRONTEND_URL` en el paso 4 de arriba) y un
test (`FundApiTest::test_public_endpoint_sends_cors_header_for_frontend_origin`)
que falla en CI si este archivo vuelve a faltar. **Importante:** este
archivo es código de la app (`api/config/cors.php`), así que un
`git pull`/subida normal ya lo incluye — no requiere ningún paso
manual adicional en el servidor, más allá de lo que dice el paso 10.
