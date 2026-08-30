# DATA_GOVERNANCE_FONDOS_0KM.md

> **Nota (2026-08-30):** este documento se escribió originalmente dentro de
> `Nahueltrek/nahueltrek-site` (Fase 0). La copia canónica vive ahora acá,
> en `Nahueltrek/fondos.0km.app`, junto con `supabase-schema.sql`, que
> implementa este modelo de datos.

Este documento define cómo se obtienen, verifican, publican y auditan los
datos de fondos y convocatorias en `fondos.0km.app`, según las secciones
53–75 del Master Plan. Es el documento que gobierna la confiabilidad del
activo más importante de la plataforma (sección 75: los datos confiables
son el punto de partida de todo el embudo comercial).

## 1. Principio rector

**Ningún dato de un fondo (fechas, montos, requisitos, beneficiarios,
gastos elegibles, condiciones) puede ser generado, inferido o completado
por el sistema o por un modelo de IA.** Todo dato publicado debe provenir
de una fuente oficial verificable y quedar trazado.

Consecuencia práctica para esta primera versión: el MVP entregado en esta
iteración usa **datos de ejemplo (`PLACEHOLDER`)**, visualmente marcados
como tales en la UI, hasta que exista un flujo de curación real con datos
oficiales. Nunca se presenta un placeholder como si fuera un fondo real.

## 2. Fuentes (sección 53–54)

Fuentes válidas: sitios oficiales de instituciones públicas (Sercotec,
Corfo, Fosis, Gobiernos Regionales, municipalidades, programas
sectoriales), documentos oficiales, bases, resoluciones, plataformas
oficiales de postulación, APIs oficiales cuando existan.

## 3. Modelo de ingesta v1: Curación Manual Asistida

```
FUENTE OFICIAL → CURADOR 0KM → VERIFICACIÓN → REGISTRO/ACTUALIZACIÓN
              → FICHA DEL FONDO → PUBLICACIÓN
```

**Explícitamente prohibido en v1** (sección 55, REGLA 14/15):
scraping automático como mecanismo de publicación, y publicación
automática de información crítica sin revisión humana.

El scraping/automatización puede evaluarse después únicamente como
*detector de cambios que dispara una alerta al curador*, nunca como
publicador directo:

```
Fuente externa → Detector de cambios → Alerta al curador → Revisión → Actualización
```

## 4. Modelo de datos

### 4.1 Tabla `funds` (secciones 9 y 57)

| Campo | Tipo | Notas |
|---|---|---|
| id | uuid | PK |
| name | text | |
| slug | text | único |
| institution | text | |
| description | text | |
| objective | text | |
| beneficiaries | text | |
| regions | text[] | |
| communes | text[] | |
| amount | text | texto libre (rangos, "hasta $X") |
| cofinancing | text | |
| application_start | date | nullable |
| application_end | date | nullable |
| status | enum | `proximo, abierto, cerrado, finalizado, permanente, por_confirmar` (sección 10) |
| categories | text[] | FK lógica a `categories.slug` |
| eligible_expenses | text | |
| official_url | text | |
| source_name | text | sección 57 |
| source_url | text | |
| source_type | enum | `official_web, official_document, official_api, official_platform, other` |
| source_reference | text | |
| last_verified_at | timestamptz | |
| next_review_at | timestamptz | calculado según sección 61 |
| verified_by | uuid | FK a `users` |
| verification_status | enum | `pending, verified, needs_review, expired, archived` |
| verification_notes | text | |
| created_at / updated_at | timestamptz | |

### 4.2 Tabla `fund_verifications` (sección 58) — historial, nunca se sobrescribe

| Campo | Tipo |
|---|---|
| id | uuid |
| fund_id | uuid (FK) |
| verified_by | uuid (FK) |
| verified_at | timestamptz |
| changes | jsonb (diff de campos modificados) |
| source | text |
| notes | text |
| status | enum (mismo set que `verification_status`) |

Regla: cada vez que un curador modifica un campo crítico de un fondo
(montos, fechas, requisitos, estado), se inserta una fila nueva en
`fund_verifications` antes o junto con el `UPDATE` de `funds`. Nunca se
pierde el valor anterior.

## 5. Roles (sección 59–60)

| Rol | Alcance |
|---|---|
| Super Admin | Acceso completo al sistema. |
| Administrador | Gestión general (no necesariamente config de sistema). |
| Curador | Crear/editar/verificar fondos, cambiar estados, revisar fuentes, marcar vencidos, actualizar fechas, agregar notas, solicitar revisión. **No** requiere permisos de admin completo. |
| Comercial | Leads, diagnósticos, propuestas, seguimiento (CRM). |
| Editor | Blog y contenidos. |

Implementación futura: tabla `users` + `role` enum, con Row Level Security
en Supabase restringiendo `UPDATE`/`INSERT` en `funds` a `curador`,
`administrador` y `super_admin` únicamente.

## 6. Frecuencia de verificación (sección 61)

| Estado del fondo | Frecuencia mínima de revisión |
|---|---|
| Abierto | cada 7 días |
| Próximo a abrir | semanal |
| Cerrado | revisar y actualizar estado |
| Permanente | mensual |
| Alerta de fuente modificada | inmediata |

`next_review_at` se recalcula automáticamente al verificar, según esta
tabla (configurable desde administración a futuro).

## 7. Alertas de verificación (sección 62)

El dashboard admin (fase futura) debe mostrar un contador de fondos
pendientes de revisión, clasificados:

- 🔴 Revisión vencida (`next_review_at < now()`)
- 🟠 Próxima revisión (`next_review_at` dentro de 3 días)
- 🟢 Verificado (revisado dentro del ciclo vigente)

## 8. Trazabilidad (sección 63)

Cada ficha de fondo publicada debe permitir responder, como mínimo en el
panel admin (y opcionalmente en la ficha pública de forma resumida, p.ej.
"Verificado el DD/MM/AAAA"):

1. ¿De dónde viene? → `source_name`, `source_url`, `source_type`.
2. ¿Quién lo verificó? → `verified_by`.
3. ¿Cuándo? → `last_verified_at`.
4. ¿Cuándo se revisa de nuevo? → `next_review_at`.
5. ¿Qué cambios tuvo? → historial en `fund_verifications`.

## 9. Disclaimers obligatorios (secciones 66–69)

Estos tres textos son literales del Master Plan y deben renderizarse
exactamente así (no parafrasear), en los componentes indicados:

- **General** (`DisclaimerBanner`, visible en home/fondos/ficha): ver
  sección 66 del Master Plan.
- **Matching** (`MatchingDisclaimer`, en cada recomendación): sección 67.
- **Propuestas** (fase CRM futura): sección 68.

Frases prohibidas (sección 69): nunca afirmar aprobación, adjudicación o
financiamiento garantizado. Usar siempre lenguaje condicional ("podría ser
pertinente", "sujeto a las condiciones de la convocatoria").

## 10. Futuras APIs

Cuando existan APIs oficiales de instituciones (Sercotec, Corfo, etc.), el
flujo pasa a:

```
API oficial → Importador → Validación → Revisión humana → Publicación
```

Nunca `API oficial → Publicación` directa para campos críticos.

## 11. Responsabilidades

| Responsabilidad | Rol |
|---|---|
| Calidad y veracidad de los datos de fondos | Curador |
| Cumplimiento de disclaimers y lenguaje legal | Todo el equipo (revisión editorial antes de publicar) |
| Aprobación de cambios estructurales/arquitectura | Nahuel (checkpoint sección 73) |
| Gestión de leads y CRM | Rol Comercial |
| Seguridad y roles de acceso | Super Admin / Administrador |
