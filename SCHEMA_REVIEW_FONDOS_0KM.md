# SCHEMA_REVIEW_FONDOS_0KM.md

> **✅ Aprobado por Nahuel (2026-08-30).** Se suma como requisito de
> aceptación adicional la prueba de seguridad RLS de la sección 9. El
> código de la aplicación permanece intacto hasta tener las credenciales
> de Supabase — nada de este documento se aplica todavía.

Auditoría de `supabase-schema.sql` previa a su ejecución en el proyecto
Supabase real, según lo pedido en la Fase 1 (punto 2). **No se ejecutó ni
se modificó el archivo todavía** — este documento solo describe hallazgos
y propone el diff exacto. Se aplica recién cuando lleguen las credenciales
y se apruebe.

## 1. Tablas — estado

| Tabla | Verificación |
|---|---|
| `funds` | Campos completos según secciones 9 y 57 del Master Plan. ✅ |
| `fund_verifications` | Campos completos según sección 58. ✅ |
| `user_roles` | Campos completos según sección 60. ✅ |
| `leads` | Campos completos según sección 24, **más los aprobados en esta fase** (`company`, `region`, `commune` ya estaban). Falta 1 campo nuevo — ver hallazgo 3. |

## 2. Relaciones (foreign keys)

| Relación | Estado |
|---|---|
| `fund_verifications.fund_id → funds.id` | ✅ Con `on delete cascade`. |
| `leads.fund_id → funds.id` | ✅ Presente (sin cascade — correcto, un lead no debe borrarse si se borra el fondo). |
| `user_roles.user_id → auth.users.id` | ✅ Con `on delete cascade`. |
| `funds.verified_by` | ⚠️ **Hallazgo 1**: es `uuid` suelto, sin `references auth.users(id)`. Debería tener la misma FK que `user_roles.user_id` para integridad referencial y para poder hacer `join` con el nombre del curador en el admin. |
| `fund_verifications.verified_by` | ⚠️ Mismo hallazgo 1. |

## 3. Índices

Hoy solo existen los implícitos (primary keys + `unique` en `funds.slug`).
No es crítico con 5-10 fondos, pero el Admin (Fase 1, punto 9) va a hacer
consultas frecuentes por estos campos, así que conviene agregarlos ahora
que es gratis y evita un problema cuando crezca el volumen:

⚠️ **Hallazgo 2**: faltan índices en `leads.status`, `leads.created_at`,
`leads.fund_id`, `funds.verification_status`, `funds.status`.

## 4. Constraints

Los `check` de `status`, `verification_status` y `source_type` están bien
definidos y cubren exactamente los valores que usa el código
(`categorias.js`, `scoring.js`). Sin cambios necesarios acá.

⚠️ **Hallazgo 3 (bloqueante para el punto 4 de tu mensaje — scoring de
"empresa formalizada")**: la tabla `leads` **no tiene ningún campo** para
registrar si el usuario declaró que su empresa está formalizada. Sin este
campo no se puede implementar "Empresa formalizada +15" sin inferirlo, que
es exactamente lo que pediste evitar. Se necesita agregar:

```sql
alter table leads add column business_formalized boolean;
-- null = no se preguntó / no contestó (nunca se infiere)
-- true/false = el usuario lo declaró explícitamente
```

## 5. RLS — hallazgos importantes

⚠️ **Hallazgo 4 (el más importante — conflicto con tu punto 6):**
la política actual es

```sql
create policy "funds_public_read" on funds for select using (true);
```

Esto permite que **cualquier visitante lea todos los fondos, sin importar
su `verification_status`** — incluidos los `pending`, `needs_review` o
`archived`. Vos pediste explícitamente: *"Los registros deben desaparecer
de la experiencia pública... solo los fondos verified deben aparecer... los
pendientes pueden permanecer ocultos del frontend"* (esto también estaba en
la sección 16 de tu instrucción anterior). Tal como está escrita hoy, la
política **no cumple esa regla** — hay que corregirla:

```sql
-- Reemplaza a funds_public_read:
create policy "funds_public_read" on funds for select using (
  verification_status = 'verified'
);
```

Los curadores/admins igual pueden ver todo (pending incluido), porque la
política `funds_write_curadores` es `for all` y las políticas RLS se
combinan con OR — así que no hace falta nada adicional para ellos.
Esto **no requiere ningún cambio en `api.js`**: como Supabase aplica RLS
a nivel de base de datos, el mismo `select("*")` que ya existe empieza a
devolver solo fondos verificados automáticamente.

⚠️ **Hallazgo 5**: `fund_verifications_curadores` es `for all`, es decir
permite `UPDATE` y `DELETE` sobre el historial de verificación. Eso
contradice el principio de la sección 58 y de `DATA_GOVERNANCE_FONDOS_0KM.md`:
*"no sobrescribir silenciosamente información crítica"* — el historial
debería ser de solo-inserción para curadores (nadie debería poder editar o
borrar una verificación pasada). Propuesta:

```sql
-- Reemplaza a fund_verifications_curadores por dos políticas:
create policy "fund_verifications_curadores_insert" on fund_verifications
  for insert with check (
    exists (select 1 from user_roles
      where user_roles.user_id = auth.uid()
        and user_roles.role in ('curador','administrador','super_admin'))
  );
create policy "fund_verifications_curadores_read" on fund_verifications
  for select using (
    exists (select 1 from user_roles
      where user_roles.user_id = auth.uid()
        and user_roles.role in ('curador','administrador','super_admin'))
  );
-- Sin política de UPDATE/DELETE para curador: solo super_admin podría
-- corregir un registro histórico, y solo si en el futuro se decide que
-- hace falta (hoy ni eso — se deja fuera de esta fase).
```

**Sin cambios necesarios** en: `leads_public_insert`, `leads_comercial_manage`,
`leads_comercial_update`, `user_roles_self_read`, `user_roles_super_admin_manage`
— estas ya cumplen exactamente lo que pediste (público solo puede
insertar leads, nunca leerlos; solo comercial/admin gestiona).

## 6. Permisos / roles

Los 5 roles (`super_admin`, `administrador`, `curador`, `comercial`,
`editor`) coinciden con la sección 60. El rol `editor` está definido en el
`check` pero **no tiene ninguna política que lo use todavía** — es
esperable, porque el blog (`/blog`) hoy es contenido estático en el
código, no gestionado desde Supabase. No es un error, es simplemente
alcance futuro (fuera de esta fase).

⚠️ **Hallazgo 6 (no es un bug, es un paso manual a documentar):** para
asignar el primer `super_admin`, alguien tiene que insertar esa fila en
`user_roles` directamente desde el SQL Editor de Supabase (con tu usuario
ya registrado en Supabase Auth) — no hay forma de que la propia app lo
haga sola, porque toda escritura en `user_roles` requiere ya ser
`super_admin` (es el comportamiento correcto y esperado, pero hay que
hacerlo a mano una vez). Documento el comando exacto para cuando lleguemos
a ese paso.

## 7. Compatibilidad con el código actual

| Archivo | Impacto de los cambios propuestos |
|---|---|
| `src/lib/api.js` (`fetchFondos`, `fetchFondoBySlug`) | Ninguno — sigue haciendo `select("*")`, la RLS filtra transparentemente. |
| `src/lib/api.js` (`createLead`) | Hay que agregar `business_formalized` al objeto que se inserta, una vez que el formulario lo capture. |
| `src/lib/scoring.js` | Hay que agregar el parámetro `businessFormalized` y sumar +15 solo si es explícitamente `true` (nunca inferido de otro campo). |
| `src/pages/Diagnostico.jsx` | Hay que agregar los inputs de `company`, `region`, `commune` y una pregunta explícita sí/no de formalización — sin alargar los 6 pasos (se integran en pasos existentes, según lo pediste en el punto 3). |
| `.env.example` | Ya tiene los nombres correctos (`VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`) — coincide con lo que vas a entregar. |

Ningún archivo de UI pública (`Home.jsx`, `FondosExplorer.jsx`,
`FondoDetail.jsx`, `Soluciones.jsx`, `Blog.jsx`, etc.) se ve afectado por
estos cambios.

## 8. Resumen de cambios propuestos al `supabase-schema.sql`

1. FK `references auth.users(id)` en `funds.verified_by` y
   `fund_verifications.verified_by`.
2. Índices en `leads.status`, `leads.created_at`, `leads.fund_id`,
   `funds.verification_status`, `funds.status`.
3. Nueva columna `leads.business_formalized boolean`.
4. Corrección de `funds_public_read` para exponer solo `verified`.
5. Reemplazo de `fund_verifications_curadores` por dos políticas
   (insert + select), sin update/delete para curador.
6. (Documentación, no SQL) Paso manual para crear el primer `super_admin`.

**No se aplica nada de esto todavía.** Cuando tengas las credenciales,
aviso, aplico este diff al archivo, y recién ahí te paso el SQL final para
correr en el SQL Editor de Supabase (o lo corro yo si en algún momento
preferís darme un método de ejecución — por ahora asumo que lo pegás vos
ahí, como hiciste con nahueltrek-site).

## 9. Requisito de aceptación: prueba de seguridad RLS

Agregado por decisión de Nahuel (2026-08-30). Los pasos 2-4 del orden de
implementación (Schema+RLS, persistencia de leads, diagnóstico) **no se
consideran terminados** hasta que estas pruebas pasen contra el proyecto
Supabase real — no alcanza con que el schema "se vea bien", hay que
verificar que las políticas efectivamente bloquean lo que deben bloquear.

Se corren desde el SQL Editor de Supabase, alternando entre el rol `anon`
(usuario público, sin sesión) y usuarios autenticados con cada rol de
`user_roles`. Cada fila es un caso pass/fail, no una sugerencia:

| # | Caso | Actor | Acción | Resultado esperado |
|---|---|---|---|---|
| 1 | Lectura pública de fondos verificados | `anon` | `select * from funds where verification_status = 'verified'` | ✅ Devuelve filas |
| 2 | Lectura pública de fondos NO verificados | `anon` | `select * from funds where verification_status != 'verified'` | ✅ Devuelve **0 filas** (aunque existan en la tabla) |
| 3 | Escritura pública de fondos | `anon` | `insert`/`update`/`delete` sobre `funds` | ❌ Rechazado por RLS |
| 4 | Creación pública de leads | `anon` | `insert into leads (...)` con datos válidos | ✅ Se inserta correctamente |
| 5 | Lectura pública de leads | `anon` | `select * from leads` | ✅ Devuelve **0 filas** (nunca debe poder leer leads ajenos) |
| 6 | Modificación pública de leads | `anon` | `update leads set status = 'ganado'` | ❌ Rechazado por RLS |
| 7 | Lectura pública de historial de verificación | `anon` | `select * from fund_verifications` | ✅ Devuelve **0 filas** |
| 8 | Curador ve fondos no verificados | usuario con `role = 'curador'` | `select * from funds` | ✅ Devuelve **todas** las filas, incluidas `pending`/`needs_review` |
| 9 | Curador edita fondos | usuario con `role = 'curador'` | `update funds set ...` | ✅ Permitido |
| 10 | Curador inserta verificación | usuario con `role = 'curador'` | `insert into fund_verifications (...)` | ✅ Permitido |
| 11 | Curador edita/borra historial pasado | usuario con `role = 'curador'` | `update`/`delete` sobre `fund_verifications` | ❌ Rechazado (historial de solo-inserción, hallazgo 5) |
| 12 | Comercial ve y gestiona leads | usuario con `role = 'comercial'` | `select`/`update` sobre `leads` | ✅ Permitido |
| 13 | Comercial no puede escribir fondos | usuario con `role = 'comercial'` | `insert`/`update` sobre `funds` | ❌ Rechazado |
| 14 | Usuario autenticado sin rol asignado | usuario en `auth.users` pero sin fila en `user_roles` | `select` sobre `leads` o `funds` no-verificados | ❌ Rechazado (se comporta igual que `anon`) |
| 15 | Un usuario lee el rol de otro | cualquier usuario autenticado | `select * from user_roles where user_id != auth.uid()` | ❌ Rechazado (solo `super_admin` puede ver todos) |
| 16 | Escalar el propio rol | usuario sin rol `super_admin` | `update user_roles set role = 'super_admin' where user_id = auth.uid()` | ❌ Rechazado |

**Cómo documentar el resultado:** al ejecutar estas pruebas, se anota acá
mismo (o en un archivo `RLS_TEST_RESULTS.md`) fecha, resultado de cada
caso y capturas/output si algo falla. Si cualquier caso falla, se corrige
la política antes de pasar al paso 5 (WhatsApp) — no se avanza con RLS
roto, aunque el resto de la app ya funcione.
