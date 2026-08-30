# INVENTARIO_FONDOS_0KM.md

**Fecha:** 2026-08-30
**Repositorio auditado:** `Nahueltrek/fondos.0km.app` (rama `main`, commit `0e2534c`)
**Referencia:** `MASTER_PLAN_FONDOS_0KM.md`

## 0. Nota metodológica

Este documento audita el **código fuente** del repositorio, que es lo que
se compiló (`npm run build`) y se entregó para subir al hosting de
`fondos.0km.app`. **No pude verificar el sitio en vivo directamente**: el
entorno donde corro tiene bloqueada la salida de red hacia `fondos.0km.app`
(política de egress de la organización, 403). Si algo de lo subido al
hosting difiere de lo que hay en `main` (por ejemplo, si se subió una
build vieja o quedó una carpeta mal ubicada), este inventario no lo va a
reflejar — avísame si ves algo distinto en el sitio real y lo reviso.

---

## 1. Resumen ejecutivo

El proyecto cubre el **flujo completo de UX de cara al usuario** descrito
en el Master Plan (Home → Fondos → Diagnóstico → Matching → Soluciones →
Blog → Lead), con datos de ejemplo donde todavía no hay información real
curada. **No cubre nada de lo que requiere backend real con credenciales**
(base de datos conectada, autenticación, panel admin, CRM funcional,
PDF, IA) — esas piezas están *diseñadas* (esquema SQL, contrato de datos)
pero no *construidas* como funcionalidad operativa, porque construirlas sin
credenciales reales produciría algo que aparenta funcionar pero no guarda
nada de verdad.

Estimación gruesa de cobertura del Master Plan:

| Bloque | Cobertura |
|---|---|
| UX/UI pública (fondos, diagnóstico, soluciones, blog) | 🟢 Alta |
| Datos y gobernanza (modelo, esquema) | 🟡 Diseñado, no operativo |
| Comercial (leads, scoring) | 🟡 Captura básica, sin backend real conectado |
| Administración (CRM, panel, roles) | 🔴 No existe |
| Contenido (blog, SEO) | 🟡 Básico, falta volumen |
| Seguridad/Auth | 🔴 No existe |
| IA / Automatización | 🔴 No existe (fases futuras explícitas del plan) |

---

## 2. Inventario por área funcional

### 2.1 Arquitectura técnica (secciones 41, 64, 65)

**Existe:**
- React 18 + Vite 5 (SPA), `react-router-dom` para rutas.
- Tailwind CSS.
- Cliente Supabase (`@supabase/supabase-js`) preparado pero **sin proyecto
  Supabase real creado** — `supabase.js` retorna `null` si no hay
  `VITE_SUPABASE_URL`/`VITE_SUPABASE_ANON_KEY`, y toda la capa de datos
  (`api.js`) cae a datos de ejemplo en memoria cuando eso pasa.
- Proyecto 100% independiente de `nahueltrek-site` y de `0km.app` (nunca
  se pudo auditar este último — ver `AUDIT_FONDOS_0KM.md`).

**Conservar:** el stack, la separación de proyecto, el patrón de "cae a
placeholder si no hay Supabase" (evita mostrar errores rotos, pero deja
clarísimo que no es dato real).

**Deuda pendiente / Agregar:**
- Crear el proyecto Supabase real y correr `supabase-schema.sql`.
- Variables de entorno de producción configuradas en el hosting.
- Reconciliar con `0km.app`/`go.0km.app` si algún día se obtiene acceso
  (sigue sin poder auditarse, sección 72).

### 2.2 Identidad visual y UX general (secciones 38-40)

**Existe:** paleta propia (`brand`, `brand-dark`, `brand-accent`,
`brand-light` en `tailwind.config.js`), mobile-first con Tailwind
responsive, componentes reutilizables (`Header`, `Footer`,
`WhatsAppButton`, badges, cards).

**No existe:** no se pudo contrastar contra la identidad real de
`0km.app` (sección 38 pide usarla como referencia) — la paleta es una
decisión propia, documentada como provisional en `ARCHITECTURE_FONDOS_0KM.md`.

**Mejorar:** una vez haya acceso a `0km.app`, revisar si la paleta/tipografía
debe alinearse.

### 2.3 Homepage (secciones 12-13)

**Existe:** hero con etiqueta, título, subtítulo y CTAs exactos del plan
(`Explorar oportunidades` / `Evaluar mi proyecto`), buscador principal con
el placeholder `¿Qué quieres financiar?`, categorías rápidas, CTA al
checklist.

**Falta:** el buscador de Home solo redirige a `/fondos?q=...` — no tiene
autocompletado ni sugerencias. Los filtros completos (institución, monto)
del buscador (sección 13) están en `/fondos`, no en Home.

### 2.4 Explorador y ficha de fondos (secciones 14-16)

**Existe:**
- `/fondos`: buscador + filtros (categoría, región, estado), cards con
  institución, región, monto, categorías, badge de estado.
- `/fondos/:slug`: estructura completa de la sección 16 (qué es, quiénes
  postulan, cuánto financia, qué busca, fechas, info oficial, CTA).
- Datos: 3 fondos **de ejemplo**, marcados explícitamente `[EJEMPLO]` con
  institución ficticia — nunca se inventó un fondo real (REGLA 9).

**Falta / Agregar:**
- Filtro por institución y por monto (el plan los pide en sección 13; hoy
  solo hay categoría/región/estado).
- Datos reales: **cero fondos reales curados todavía** — esto es lo más
  importante para que la plataforma cumpla su propósito real.
- Páginas regionales dinámicas (`/fondos/region-metropolitana`, sección 33)
  — no implementadas.
- Panel de administración para cargar/editar fondos (depende de 2.9).

### 2.5 Matching (sección 17)

**Existe:** en el resultado del diagnóstico, matching client-side simple
(por categoría declarada + palabras clave en las respuestas) contra el
catálogo de soluciones, con el disclaimer obligatorio de la sección 67.

**Limitación:** es una heurística básica de texto, no un motor de matching
real que cruce fondo + rubro + necesidad + presupuesto + región (como
describe la sección 17 con el ejemplo del operador turístico). Funciona
como demo del concepto, no como matching robusto.

**Mejorar:** ampliar reglas de matching; eventualmente esto es candidato a
IA (sección 44), pero se puede mejorar con reglas simples antes.

### 2.6 Diagnóstico (secciones 18-20)

**Existe:** flujo multistep de 6 pasos exactos del plan (tipo de proyecto,
etapa, qué mejorar, qué problema, qué recursos, contacto), resultado con
perfil, nivel de digitalización, soluciones recomendadas, fondo
relacionado si vino de una ficha, CTA a WhatsApp. Disclaimer de matching
presente.

**Conservar** tal cual — es de las partes más completas del proyecto.

**Mejorar:** el "nivel de digitalización" se calcula solo a partir de la
etapa declarada (una regla simple); podría enriquecerse con más señales
del formulario.

### 2.7 Soluciones, Packs, Turismo (secciones 21-23)

**Existe:** catálogo de 8 categorías de soluciones (sección 21 completa),
5 Packs con contenido pero **sin precio** (`precio: null` explícito — no se
inventó una tarifa), vertical `/soluciones/turismo` con los 10 ítems de la
sección 23.

**Falta:** precios reales de los packs (decisión de negocio, no técnica);
integración futura con el ecosistema turístico de 0km (sección 23, "fase
futura", no se esperaba en esta etapa).

### 2.8 Leads y scoring (secciones 24-25)

**Existe:**
- `api.createLead()`: si hay Supabase configurado, inserta en la tabla
  `leads` real; si no, **avisa explícitamente en pantalla** que no se
  guardó (nunca simula éxito — REGLA 11).
- `scoring.js`: implementa las reglas de puntaje de la sección 25
  (fondo adjudicado +20, postulando +15, presupuesto definido +10,
  palabras clave ecommerce/sistema/automatización/whatsapp) y los 4
  estados (Frío/Potencial/Calificado/Prioritario).
- Dos puntos de captura: `/diagnostico` (paso 6) y `/checklist` (lead
  magnet, sección 31).

**Falta:**
- **El proyecto Supabase real no existe** → hoy, en producción, ningún
  lead se está guardando de verdad. Esto es crítico: cada visita que
  completa el diagnóstico o descarga el checklist se pierde.
- El campo `score` se calcula pero no se usa para nada visible todavía
  (no hay panel donde verlo).

### 2.9 CRM (sección 26)

**Existe:** solo el esquema SQL (`leads`, `user_roles` con roles y RLS).

**No existe:** ninguna interfaz. No hay `/admin`, no hay forma de ver,
filtrar, cambiar estado o dejar notas sobre un lead. Los 9 estados del
pipeline (Nuevo → ... → Ganado/Perdido/Seguimiento) están definidos en la
base de datos (`check constraint`) pero nada los usa todavía.

**Agregar (prioridad alta una vez haya Supabase real):** panel `/admin`
mínimo viable — lista de leads, cambio de estado, notas.

### 2.10 Propuestas (sección 27) y Proyectos (sección 28)

**No existe nada.** Ni modelo de datos ni UI. Dependen de que exista CRM
funcional primero. Esperado según el roadmap (fases 6→7).

### 2.11 Blog (secciones 29-30)

**Existe:** `/blog` y `/blog/:slug`, categorías, 3 de los 10 artículos
sugeridos por el plan («¿Qué son los fondos concursables?», «¿Cómo
digitalizar una Pyme?», «Web o sistema: ¿qué necesita mi negocio?»),
contenido genérico y educativo sin datos de fondos inventados.

**Falta:** 7 artículos más de la lista de la sección 30 (ecommerce,
automatización para pymes, digitalización turística, cómo preparar un
proyecto tecnológico, errores al ejecutar un fondo, etc.).

### 2.12 Lead magnet — Checklist (sección 31)

**Existe completo:** `/checklist`, 13 preguntas reales agrupadas en 4
etapas, formulario de captura (nombre, email, WhatsApp, rubro), descarga
real de un archivo de texto generado en el navegador, evento de analítica
`checklist_downloaded`. Mismo problema que 2.8: sin Supabase real, el lead
no queda guardado, solo se descarga el archivo.

### 2.13 SEO (secciones 32-33)

**Existe:** meta description, Open Graph, Twitter Card, `sitemap.xml`,
`robots.txt`, `<title>` dinámico por página vía `useDocumentTitle`.

**Falta:**
- `og:image` real (no se inventó un placeholder genérico como si fuera la
  imagen de marca oficial).
- Páginas por región (sección 33) — no implementadas, dependen de tener
  fondos reales con región asignada.
- Fichas de fondo individuales no están en el sitemap (solo datos de
  ejemplo, no tiene sentido indexarlas todavía).

### 2.14 Dashboard administrativo (secciones 34-35)

**No existe.** Cero código de `/admin`. Esto incluye el módulo de alertas
de verificación de fondos (sección 62) y el dashboard principal con
métricas (sección 35) — ninguno de los dos tiene ni esquema ni UI más allá
de lo que ya está en `leads`/`funds` a nivel de base de datos.

### 2.15 Analytics (sección 36)

**Existe:** `analytics.js` define y despacha los eventos
`fund_viewed`, `fund_search`, `filter_used`, `diagnostic_started`,
`diagnostic_completed`, `solution_viewed`, `whatsapp_clicked`,
`checklist_downloaded` — cableados en la UI real.

**Falta:** `proposal_requested` (no aplica todavía, no existe la
funcionalidad), y **ningún proveedor conectado** (GA/Plausible/etc.) — hoy
los eventos solo se ven en `console.debug` en desarrollo. En producción no
se está midiendo nada todavía.

### 2.16 WhatsApp (sección 37)

**Existe completo:** botón flotante, los dos mensajes exactos del plan
(genérico y con nombre de fondo), evento de analítica al click.

**Pendiente de configuración:** el número de WhatsApp está **vacío**
(`WHATSAPP_NUMBER = ""` en `WhatsAppButton.jsx`) — hoy el botón no
funciona en producción hasta que se cargue el número real.

### 2.17 Seguridad (sección 43)

**Existe:** nada de autenticación/autorización todavía porque no hay
backend real conectado (no hay nada que proteger aún). RLS ya está escrito
en el esquema SQL para cuando exista Supabase real.

**Falta:** todo lo que requiere un backend activo — rate limiting, CSRF,
logs, backups. No aplica hasta que haya infraestructura real desplegada.

### 2.18 IA (sección 44) y Automatización (sección 45)

**No existe**, tal como el plan lo marca como fase futura explícita
(Fase 11). Nada que auditar acá todavía.

### 2.19 Gobernanza de datos (secciones 53-63)

**Existe (diseño, no operación):** modelo de datos completo en
`supabase-schema.sql` (`funds` con todos los campos de gobernanza —
`source_type`, `verification_status`, `next_review_at`, etc. — más
`fund_verifications` para historial), roles definidos con RLS.
`DATA_GOVERNANCE_FONDOS_0KM.md` documenta el proceso de curación manual
asistida completo.

**No existe:** ningún dato real siguiendo este proceso todavía — es un
diseño listo para usarse, no un proceso corriendo. No hay curador humano
asignado ni fondos verificados.

### 2.20 Disclaimers (secciones 66-69)

**Existe y se cumple estrictamente:** disclaimer general (footer de toda
página + Home), disclaimer de matching (en cada resultado de diagnóstico),
textos literales del plan, ningún lenguaje de garantía prohibido detectado
en el código (verificado por grep: no aparecen frases tipo "te aseguramos"
ni similares).

**Falta:** el disclaimer de propuestas (sección 68) — no aplica todavía
porque no existe la funcionalidad de propuestas.

---

## 3. Mapa Conservar / Mejorar / Agregar

| Prioridad | Acción | Área |
|---|---|---|
| 🔴 Alta | **Agregar**: crear proyecto Supabase real y correr `supabase-schema.sql` | Todo lo demás depende de esto |
| 🔴 Alta | **Agregar**: número de WhatsApp real en `WhatsAppButton.jsx` | El CTA principal del sitio hoy no funciona |
| 🔴 Alta | **Agregar**: al menos 5-10 fondos reales curados manualmente | Es el activo central del producto (sección 75) |
| 🟠 Media | **Agregar**: panel `/admin` mínimo (fondos + leads) | Fase 3/6 |
| 🟠 Media | **Agregar**: proveedor de analítica real conectado | Fase 9 |
| 🟠 Media | **Mejorar**: matching (hoy es heurística simple de texto) | Sección 17 |
| 🟡 Baja | **Agregar**: 7 artículos de blog restantes | Sección 30 |
| 🟡 Baja | **Agregar**: filtros por institución/monto en `/fondos` | Sección 13 |
| 🟡 Baja | **Agregar**: `og:image` real | Sección 32 |
| 🟢 — | **Conservar**: diagnóstico multistep, disclaimers, checklist, estructura de ficha de fondo, esquema SQL/gobernanza | Ya cumplen el plan |
| ⬜ Futuro | **Agregar**: propuestas/PDF, IA, automatización, páginas regionales | Fases 7, 10, 11, sección 33 — explícitamente futuras en el plan |

---

## 4. Riesgo más importante ahora mismo

**El sitio en producción hoy no guarda ningún lead ni tiene WhatsApp
funcional**, porque no hay proyecto Supabase conectado ni número de
WhatsApp cargado. Visualmente el sitio está completo y funciona, pero el
objetivo comercial del embudo (sección 6 y 75: visitante → lead → cliente)
está roto en el punto de conversión hasta que se resuelvan esos dos ítems.
Sugiero priorizarlos antes que cualquier otra mejora.

---

## 5. No se tocó código

Este documento es puramente de auditoría, como se pidió. No se modificó
ningún archivo de la aplicación.
