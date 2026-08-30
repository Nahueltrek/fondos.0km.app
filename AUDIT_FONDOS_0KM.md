# AUDIT_FONDOS_0KM.md

> **Nota (2026-08-30):** este documento se escribió originalmente dentro de
> `Nahueltrek/nahueltrek-site` (Fase 0, antes de que existiera este
> repositorio). El código y la copia canónica de este documento viven ahora
> acá, en `Nahueltrek/fondos.0km.app`; `nahueltrek-site` conserva una copia
> histórica de solo lectura.

**Fecha de auditoría:** 2026-08-29
**Rama:** `claude/fondos-0km-master-plan-epndgr`
**Repositorio auditado:** `Nahueltrek/nahueltrek-site`

## 1. Resumen ejecutivo

El MASTER_PLAN_FONDOS_0KM.md describe dos proyectos de referencia:

- **`0km.app`** — ecosistema principal de 0km. Regla absoluta: no modificar.
- **`fondos.0km.app`** — plataforma a construir, complementaria e independiente.

Ninguno de los dos existe en el repositorio al que esta sesión tiene acceso
(`Nahueltrek/nahueltrek-site`). Este documento registra exactamente qué se
pudo y qué no se pudo auditar, y por qué.

## 2. Qué se intentó auditar

| Objetivo | Resultado |
|---|---|
| `nahueltrek-site` (este repo) | ✅ Auditado — ver sección 3. |
| `Nahueltrek/nahueltrek.0km.app` | ⚠️ Detectado en el listado de repos accesibles, pero no se inspeccionó (el usuario indicó que no era el repo correcto). |
| `0km/go.0km.app` (mencionado por el usuario como referencia de configuración) | ❌ No accesible. El intento de `add_repo` bajo el owner `nahueltrek` devolvió "not found"; bajo el owner `0km` devolvió una restricción de "cross-tier" (esta sesión solo puede agregar repos del mismo owner que la fuente inicial). Un intento posterior de crear una sesión nueva apuntando directamente a `https://github.com/0km/go.0km.app` falló con `github_repo_access_denied`: la GitHub App de Claude no tiene autorización sobre ese repositorio, o el repo no existe con ese nombre/owner, o fue renombrado/movido. |
| `0km.app` (repo textual) | ❌ No se encontró ningún repositorio con ese nombre exacto en los repos accesibles a esta cuenta. |
| `fondos.0km.app` (repo textual) | ❌ No se encontró ningún repositorio con ese nombre exacto en los repos accesibles a esta cuenta. |

**Consecuencia directa (regla del Master Plan, sección 72):** no se puede
tomar una decisión de stack basada en "qué existe en 0km.app" ni en
"go.0km.app" porque ninguno de los dos es inspeccionable desde esta sesión.
La decisión de arquitectura (ver `ARCHITECTURE_FONDOS_0KM.md`) se basa
exclusivamente en lo que sí es observable (`nahueltrek-site`) más buenas
prácticas generales, y queda marcada como **provisional, pendiente de
reconciliación** el día en que se otorgue acceso a los repos de referencia.

## 3. Auditoría de `nahueltrek-site` (este repositorio)

Es importante dejar constancia de que **este proyecto es un sitio de turismo
de trekking ("Nahueltrek") y no tiene relación funcional con "fondos" ni con
financiamiento**. Se audita solo para decidir si algo de su configuración es
reutilizable como referencia técnica (patrón, no producto).

### 3.1 Stack

- **Frontend:** React 18 + Vite 5, JSX sin TypeScript.
- **Estilos:** CSS plano en `src/index.css` + estilos inline (paleta de
  colores definida como constante `COLORS` en `App.jsx`), sin framework de
  utilidades (no Tailwind).
- **Backend/datos:** Supabase (Postgres gestionado) vía `@supabase/supabase-js`,
  acceso directo desde el navegador (sin API propia).
- **Icons:** `lucide-react`.
- **Hosting:** Vercel o Netlify (README documenta ambos; incluye
  `vercel.json` y `public/_headers` con cabeceras de seguridad —
  HSTS, CSP, X-Frame-Options, Referrer-Policy, Permissions-Policy).
- **Auth:** Ninguna auth real. El panel admin usa una contraseña estática
  hardcodeada en el código (`ADMIN_PASSCODE` en `App.jsx`), documentada en
  el propio README como protección básica, no segura, con nota explícita
  de migrar a Supabase Auth.

### 3.2 Estructura

```
nahueltrek-site/
├── index.html
├── package.json
├── vite.config.js
├── vercel.json
├── supabase-schema.sql
├── public/
│   └── _headers
└── src/
    ├── main.jsx
    ├── App.jsx           (sitio público + panel admin, todo en un archivo)
    ├── index.css
    └── lib/
        ├── supabaseClient.js
        └── api.js
```

### 3.3 Modelo de datos (`supabase-schema.sql`)

4 tablas: `destinos`, `agenda`, `mensajes`, `productos`. RLS habilitado con
lectura pública. No hay tablas relacionadas con fondos, leads, diagnósticos
ni CRM.

### 3.4 Qué es reutilizable como patrón (no como código compartido)

- El patrón "Vite + React + Supabase, sin backend propio" es simple, barato
  y ya funciona en el ecosistema Nahueltrek/0km observable. Es una opción
  válida por defecto ante la falta de más contexto.
- El patrón de cabeceras de seguridad (`vercel.json` / `public/_headers`)
  es reutilizable tal cual.
- **No** se reutiliza código de `nahueltrek-site` directamente: es un
  dominio de negocio distinto (turismo vs. financiamiento) y mezclar los
  proyectos violaría el principio de independencia (secciones 42 y 65 del
  Master Plan).

## 4. Riesgos y advertencias

1. **Riesgo de arquitectura huérfana:** la decisión de stack en
   `ARCHITECTURE_FONDOS_0KM.md` se toma sin poder comparar contra
   `0km.app` ni `go.0km.app`. Si esos proyectos usan Laravel u otro stack
   con patrones distintos (el propio Master Plan, sección 64, menciona
   Laravel como patrón usado en otros proyectos 0km), podría haber
   divergencia de convenciones dentro del ecosistema. Se documenta como
   deuda a resolver cuando haya acceso.
2. **No se ejecuta scraping ni se inventan datos de fondos** (REGLA 9,
   sección 55): cualquier dato de fondos en el MVP inicial se marca
   explícitamente como `PLACEHOLDER` / dato de ejemplo, nunca como
   información real de una convocatoria.
3. **No se modifica nada de `nahueltrek-site` existente** (`src/`,
   `public/`, `supabase-schema.sql`, etc.). El nuevo proyecto se crea en un
   directorio nuevo y aislado, `fondos-0km-app/`, con su propio
   `package.json` y su propio ciclo de build, para cumplir la regla de
   independencia (una falla en uno no debe afectar al otro).

## 5. Decisión registrada

Siguiendo instrucción explícita del responsable del proyecto (Nahuel,
2026-08-29: "audita y crea uno nuevo"), se procede a construir
`fondos-0km-app` desde cero dentro de este mismo repositorio, en la rama
`claude/fondos-0km-master-plan-epndgr`, sin esperar acceso a los repos de
referencia. Esto se documenta como aprobación explícita del checkpoint de
la sección 73 del Master Plan, bajo el entendimiento de que la arquitectura
podrá ajustarse más adelante si se obtiene acceso a `0km.app` / `go.0km.app`
y se detectan incompatibilidades relevantes.
