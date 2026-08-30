# EVOLUTION_FONDOS_0KM.md

> **Nota (2026-08-30):** este documento se escribió originalmente dentro de
> `Nahueltrek/nahueltrek-site` (Fase 0-1). La copia canónica vive ahora acá,
> en `Nahueltrek/fondos.0km.app`, y se sigue actualizando con el estado real
> del proyecto.

Roadmap de `fondos.0km.app` adaptado al estado real encontrado en la
auditoría (proyecto inexistente, se parte de cero) y a las fases del
Master Plan (sección 48).

## Estado de cada fase

| Fase | Contenido (Master Plan) | Estado |
|---|---|---|
| 0 — Auditoría | Auditar `fondos.0km.app`, `0km.app`, infraestructura, datos, stack | ✅ Completada dentro de lo accesible. Ver `AUDIT_FONDOS_0KM.md` — `0km.app`/`go.0km.app` quedaron fuera de alcance por falta de acceso. |
| 1 — Mapa de evolución | 4 documentos de gobernanza/arquitectura | ✅ Completada (este set de 4 archivos). |
| 2 — UX/UI | Navegación, homepage, buscador, fichas, diagnóstico, soluciones, CTA | 🟡 Implementado a nivel de componentes funcionales (no de diseño final pulido). |
| 3 — Fondos | Base de datos, buscador, filtros, fichas, estados, administración, curación manual asistida | 🟡 UI de buscador/filtros/fichas completa. `supabase-schema.sql` define la tabla `funds` real (con gobernanza) y `api.js` ya intenta leer de Supabase si hay credenciales, cayendo a datos placeholder si no. **Falta:** crear el proyecto Supabase real, cargar datos curados, y el panel de administración (`/admin`). |
| 4 — Diagnóstico | Multistep, scoring, recomendaciones, captación | ✅ Flujo de 6 pasos con matching client-side. El paso final ahora llama a `createLead()` (real si hay Supabase, si no avisa honestamente que no se guardó — nunca simula éxito). Lead magnet de la sección 31 (`/checklist`) también implementado, con captura de contacto y descarga real del checklist (archivo generado en el cliente, sin backend). |
| 5 — Soluciones | Catálogo, categorías, packs, turismo | ✅ Catálogo (sección 21), Packs (sección 22, precios `null` hasta definir tarifas reales) y vertical `/soluciones/turismo` (sección 23) implementados. |
| 6 — CRM | Leads, scoring, seguimiento, estados, roles | 🟡 Base creada: `supabase-schema.sql` con tablas `leads` y `user_roles` + RLS por rol, `src/lib/scoring.js` con las reglas de la sección 25, y captura de leads desde `/diagnostico`. **Falta:** panel `/admin` para gestionar el pipeline (Nuevo → Contactar → ... → Ganado/Perdido), autenticación real, notas/tareas/historial. |
| 7 — Propuestas | Lead → Diagnóstico → Proyecto → Propuesta → PDF | ⬜ No iniciada. Depende de fase 6 (CRM con auth real). |
| 8 — Blog + SEO | Contenido, posicionamiento | ✅ `/blog` y `/blog/[slug]` con categorías (sección 29) y 3 artículos educativos genéricos (sección 30) — sin datos de fondos reales. `document.title` dinámico en todas las páginas (vía `useDocumentTitle`), meta tags Open Graph/Twitter Card, `sitemap.xml` y `robots.txt`. Pendiente: el resto de los 10 artículos sugeridos y un `og:image` real (no se inventó uno genérico). |
| 9 — Analytics | Eventos de medición | 🟡 `src/lib/analytics.js` define el contrato de eventos de la sección 36 (fund_viewed, fund_search, filter_used, diagnostic_started/completed, solution_viewed, whatsapp_clicked) y ya están cableados en la UI. **No** hay proveedor real conectado (GA/Plausible) porque no existe un ID de medición real — conectar uno es un cambio de una línea en `analytics.js`. |
| 10 — Automatización | Procesos comerciales | ⬜ No iniciada. |
| 11 — IA | Asistente de proyecto, matching inteligente, generador de propuestas | ⬜ No iniciada (fase futura explícita en el Master Plan). |

## Qué se construye en esta iteración (MVP funcional, front-end)

1. Proyecto `fondos-0km-app/` independiente (Vite + React + Tailwind).
2. Home con hero, buscador y disclaimer general.
3. `/fondos` — explorador con filtros (región, categoría, estado,
   institución) sobre datos placeholder.
4. `/fondos/:slug` — ficha de fondo con la estructura de la sección 16 y
   CTA "Evaluar mi proyecto".
5. `/diagnostico` — flujo de 6 pasos (sección 18) con resultado (sección
   19) y matching básico hacia soluciones, con disclaimer de matching.
6. `/soluciones` — catálogo de categorías (sección 21), Packs (sección 22)
   y vertical `/soluciones/turismo` (sección 23).
7. Botón flotante de WhatsApp (sección 37) con los dos mensajes definidos,
   con evento de analítica al hacer clic.
8. Disclaimers de las secciones 66 y 67 integrados como componentes
   reutilizables, no como texto suelto copiado por página.
9. `/blog` y `/blog/:slug` (secciones 29-30) con 3 artículos educativos
   genéricos y `document.title` dinámico por página.
10. `supabase-schema.sql`: esquema real de `funds`, `fund_verifications`,
    `leads` y `user_roles` con RLS por rol, listo para crear en un proyecto
    Supabase nuevo.
11. `src/lib/scoring.js` (sección 25) y `api.createLead()` — el diagnóstico
    ahora intenta guardar un lead real; si no hay Supabase configurado, lo
    dice explícitamente en pantalla en vez de simular que se guardó.
12. `src/lib/analytics.js` — contrato de eventos de la sección 36, cableado
    en búsqueda, filtros, vista de fondo, diagnóstico, soluciones y
    WhatsApp. Sin proveedor real conectado (ver "Explícitamente diferido").

## Explícitamente diferido (no se improvisa para "completar" el Master Plan)

No se construye en esta iteración: proyecto Supabase real (el esquema SQL
está listo pero no hay credenciales para crearlo), autenticación/roles
funcionando, panel `/admin` (Fondos, Leads, CRM, Blog, Config), generación
de PDF de propuestas, proveedor de analítica real conectado (GA/Plausible
— no se inventa un ID de medición), integraciones de IA, páginas regionales
dinámicas, precios reales de los packs. Construir estas piezas sin datos ni
credenciales reales produciría funcionalidad de apariencia completa pero
falsa (contraviene REGLA 9 y REGLA 11: no inventar datos ni resultados).
Quedan como próximos pasos concretos, priorizables por Nahuel.

## Próximos pasos sugeridos (orden recomendado)

1. Aprobar o corregir la decisión de arquitectura (`ARCHITECTURE_FONDOS_0KM.md`).
2. Resolver acceso a `0km.app` / `go.0km.app` si se quiere alinear stack e
   identidad visual antes de invertir más en UI definitiva.
3. Crear proyecto Supabase real para `fondos-0km-app` y migrar los datos
   placeholder a un esquema real vacío (sin datos ficticios).
4. Definir el primer lote de fondos reales a curar manualmente (Fase 3
   real, con curador humano).
5. Recién ahí: CRM, propuestas, blog, analytics, IA — en ese orden, cada
   fase probada antes de pasar a la siguiente (REGLA 13).
