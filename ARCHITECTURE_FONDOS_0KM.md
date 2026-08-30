# ARCHITECTURE_FONDOS_0KM.md

> **Nota (2026-08-30):** este documento se escribió originalmente dentro de
> `Nahueltrek/nahueltrek-site` (Fase 0). La copia canónica vive ahora acá,
> en `Nahueltrek/fondos.0km.app`.

**Estado:** Decisión provisional (ver `AUDIT_FONDOS_0KM.md` sección 4.1 —
tomada sin acceso a `0km.app` ni `go.0km.app`). Aprobada explícitamente por
Nahuel para avanzar ("audita y crea uno nuevo").

## 1. Opciones consideradas (Master Plan, sección 64)

| Opción | Descripción | Veredicto |
|---|---|---|
| A. Compartir infraestructura con `0km.app` | Requiere acceso al repo/infra de `0km.app`, no disponible. | Descartada por ahora. |
| B. Independiente | Proyecto nuevo, stack propio, sin dependencia de otros repos. | **Elegida.** |
| C. Compartir solo APIs/servicios | Requiere que `0km.app` exponga APIs; no verificable. | Diferida a fase futura, si se habilita acceso. |
| Adoptar Laravel (patrón mencionado en sección 64) | No hay evidencia disponible de que `go.0km.app` u otros proyectos 0km usen Laravel; no se puede confirmar ni descartar. | No adoptada por falta de evidencia — se prioriza velocidad de desarrollo y consistencia con lo único auditable. |

## 2. Stack elegido para `fondos-0km-app`

- **Frontend:** React 18 + Vite 5 (SPA con `react-router-dom` para rutas
  cliente). Mismo par framework/bundler que `nahueltrek-site`, la única
  referencia auditable dentro del ecosistema, lo que reduce fricción de
  mantenimiento si en el futuro un mismo equipo administra ambos.
- **Estilos:** Tailwind CSS. `nahueltrek-site` usa CSS plano, pero
  `fondos.0km.app` tiene muchas más vistas (buscador, filtros, fichas,
  diagnóstico multistep, dashboard futuro) donde un sistema de utilidades
  acelera consistencia visual y mobile-first (sección 40).
- **Datos:** Supabase (Postgres + RLS), mismo proveedor que
  `nahueltrek-site`, pero en un **proyecto Supabase separado** — nunca la
  misma instancia ni las mismas credenciales (independencia, sección 42/65).
- **Routing:** `react-router-dom` (necesario: es multi-página con rutas
  dinámicas `/fondos/[slug]`, cosa que `nahueltrek-site` no requiere por ser
  de una sola página).
- **Hosting:** Vercel o Netlify, igual patrón que `nahueltrek-site`
  (cabeceras de seguridad replicadas: HSTS, CSP, X-Frame-Options,
  Referrer-Policy, Permissions-Policy), en un proyecto de hosting
  **separado** con su propio dominio (`fondos.0km.app`).
- **Auth (fase CRM/admin):** Supabase Auth con roles (sección 60), no
  contraseña hardcodeada — se aprende de la advertencia explícita que el
  propio README de `nahueltrek-site` deja sobre su mecanismo actual.

## 3. Por qué NO se comparte código con `nahueltrek-site`

- Dominios de negocio distintos (turismo vs. financiamiento/CRM).
- Cumple REGLA de independencia: un error en `fondos-0km-app` no debe poder
  romper el build o el runtime de `nahueltrek-site`, y viceversa.
- Cada uno tiene su propio `package.json`, su propio `vite.config.js`, sus
  propias variables de entorno y su propio despliegue.

## 4. Estructura del nuevo proyecto

```
fondos-0km-app/
├── index.html
├── package.json
├── vite.config.js
├── tailwind.config.js
├── postcss.config.js
├── .env.example
├── README.md
└── src/
    ├── main.jsx
    ├── App.jsx                 (router + layout)
    ├── index.css                (tailwind entrypoint)
    ├── lib/
    │   ├── supabaseClient.js
    │   └── api.js
    ├── data/
    │   ├── categorias.js
    │   └── fondosPlaceholder.js  (⚠️ datos de ejemplo, no reales — REGLA 9)
    ├── components/
    │   ├── DisclaimerBanner.jsx
    │   ├── MatchingDisclaimer.jsx
    │   ├── SearchBar.jsx
    │   ├── FundCard.jsx
    │   ├── FundStatusBadge.jsx
    │   ├── WhatsAppButton.jsx
    │   └── Header.jsx / Footer.jsx
    └── pages/
        ├── Home.jsx
        ├── FondosExplorer.jsx     (/fondos)
        ├── FondoDetail.jsx        (/fondos/:slug)
        ├── Diagnostico.jsx        (/diagnostico)
        └── Soluciones.jsx         (/soluciones)
```

## 5. Modelo de datos inicial (fondos)

Implementado como *forma de los datos* (constantes/objetos JS) — no como
backend real todavía, porque no existen datos reales curados. Sigue los
campos de las secciones 9 y 57 del Master Plan:

```js
{
  // sección 9
  name, slug, institution, description, objective, beneficiaries,
  regions, communes, amount, cofinancing,
  application_start, application_end, status, categories,
  eligible_expenses, official_url, source, last_verified_at,
  // sección 57 (gobernanza)
  source_name, source_url, source_type, source_reference,
  next_review_at, verified_by, verification_status, verification_notes,
}
```

La tabla `fund_verifications` (sección 58) y los roles (sección 60) se
documentan en `DATA_GOVERNANCE_FONDOS_0KM.md` como esquema SQL preparado
para cuando exista Supabase real conectado — no se crea infraestructura
Supabase en este pase (no hay credenciales ni proyecto provisto).

## 6. Qué queda explícitamente fuera de este MVP

CRM completo, scoring automático conectado a base de datos, generación de
PDF de propuestas, dashboard `/admin`, blog con CMS, analítica real,
matching con IA. Ver `EVOLUTION_FONDOS_0KM.md` para el roadmap por fases.

## 7. Deuda a reconciliar cuando haya acceso a `0km.app` / `go.0km.app`

- Confirmar si el ecosistema 0km usa Laravel en algún componente central
  y si `fondos.0km.app` debería exponer una API compatible.
- Confirmar convenciones de diseño (colores, tipografías, componentes) de
  `0km.app` para alinear la identidad visual (sección 38) — por ahora se
  usa una paleta propia neutra, sin inventar la de `0km.app`.
- Confirmar si existe un sistema de autenticación/roles centralizado a
  reutilizar en vez de Supabase Auth propio.
