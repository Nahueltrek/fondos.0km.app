# CURADURIA_FONDOS_2026.md

> Informe de la fase "Carga y curaduría de 15 oportunidades de
> financiamiento 2026". Fecha de curación: **2026-08-30**.

## 0. Limitación metodológica importante

Esta curación se hizo con acceso a internet restringido: el sandbox donde
corre Claude solo puede usar **búsqueda web** (que devuelve fragmentos de
texto de las páginas indexadas), y **no puede abrir páginas completas**
de `sercotec.cl` ni `corfo.cl` (el proxy de red del entorno las bloquea
directamente). Las búsquedas se restringieron a esos dos dominios
oficiales (`allowed_domains`) para asegurar que los fragmentos vistos son
texto real de la página oficial y no de blogs o notas de prensa — pero
siguen siendo fragmentos, no el documento completo.

Consecuencia concreta: de los 15 registros cargados, **solo 2 quedaron
`verification_status = verified`** (los que tenían fechas y montos
exactos, verificables sin ambigüedad en el fragmento visible). Los otros
13 quedan en **`needs_review`**, con su URL oficial y una nota exacta de
qué falta confirmar — visibles y editables en `/admin/fondos`, pero
**no públicos todavía** (la API pública solo devuelve fondos
`verified`, por diseño — ver `Fund::scopeVerified`).

**Para llegar a "15 oportunidades públicas"** (objetivo de la sección 20
de la instrucción original), hace falta un paso que Claude no puede
hacer por esta limitación de red: que alguien con acceso normal a
internet abra cada URL de la columna "Fuente" de la tabla de abajo,
confirme que los datos (sobre todo las fechas de postulación) siguen
siendo correctos, y presione "Registrar verificación" en
`/admin/fondos/{id}` con estado `verified`. Es el mismo flujo que ya
usa el panel para cualquier fondo — no requiere tocar código ni base de
datos directamente.

## 1. Los 15 registros cargados

| # | Convocatoria | Institución | Región | Estado | Monto | Cierre | Potencial 0km | Verificación | Fuente |
|---|---|---|---|---|---|---|---|---|---|
| 1 | Ruta Digital – Kit Digital, RM 2026 | Sercotec | Región Metropolitana | Cerrado | $1.200.000 | 26-06-2026 | A | ✅ Verified | [sercotec.cl](https://www.sercotec.cl/convocatoria/ruta-digital-kit-digital-region-metropolitana-de-santiago-2026/) |
| 2 | Ruta Digital – Kit Digital, Biobío 2026 | Sercotec | Biobío | Por confirmar | $1.200.000 (mismo instrumento nacional) | No confirmado | A | ⏳ Needs review | [sercotec.cl](https://www.sercotec.cl/convocatoria/ruta-digital-kit-digital-region-del-biobio-2026/) |
| 3 | Ruta Digital – Kit Digital, La Araucanía 2026 | Sercotec | La Araucanía | Por confirmar | $1.200.000 (mismo instrumento nacional) | No confirmado | A | ⏳ Needs review | [sercotec.cl](https://www.sercotec.cl/convocatoria/ruta-digital-kit-digital-region-de-la-araucania-2026/) |
| 4 | Ruta Digital – Kit Digital, Ñuble 2026 | Sercotec | Ñuble | Por confirmar | $1.200.000 (mismo instrumento nacional) | No confirmado | A | ⏳ Needs review | [sercotec.cl](https://www.sercotec.cl/convocatoria/ruta-digital-kit-digital-region-de-nuble-2026/) |
| 5 | Digitaliza tu Almacén, Antofagasta 2026 | Sercotec | Antofagasta | Por confirmar | $3.000.000 | No confirmado | A | ⏳ Needs review | [sercotec.cl](https://www.sercotec.cl/digitaliza-tu-almacen-region-de-antofagasta-2026/) |
| 6 | Capital Semilla Emprende, RM 2026 | Sercotec | Región Metropolitana | Por confirmar | $3.000.000–$3.300.000 | No confirmado | B | ⏳ Needs review | [sercotec.cl](https://www.sercotec.cl/convocatoria/capital-semilla-emprende-region-metropolitana-de-santiago-2026/) |
| 7 | Capital Semilla Emprende, Los Ríos 2026 | Sercotec | Los Ríos | Por confirmar | $3.000.000–$3.300.000 | No confirmado | B | ⏳ Needs review | [sercotec.cl](https://www.sercotec.cl/convocatoria/capital-semilla-emprende-region-de-los-rios-2026/) |
| 8 | Capital Semilla Modo Empleo, RM | Sercotec | Región Metropolitana | Por confirmar | $3.000.000 | No confirmado | B | ⏳ Needs review | [sercotec.cl](https://www.sercotec.cl/convocatoria/capital-semilla-modo-empleo-region-metropolitana/) |
| 9 | Capital Abeja Emprende, RM 2026 | Sercotec | Región Metropolitana | Cerrado | $3.500.000 | 27-05-2026 | B | ✅ Verified | [sercotec.cl](https://www.sercotec.cl/convocatoria/capital-abeja-emprende-region-metropolitana-de-santiago-2026/) |
| 10 | Crece Sostenible, RM 2026 | Sercotec | Región Metropolitana | Por confirmar | $7.000.000–$9.000.000 | No confirmado | B | ⏳ Needs review | [sercotec.cl](https://www.sercotec.cl/convocatoria/crece-sostenible-region-metropolitana-2026/) |
| 11 | Innova Región | Corfo | Nacional | Por confirmar | Hasta $60.000.000 | No confirmado | A | ⏳ Needs review | [corfo.cl](https://www.corfo.cl/sites/cpp/innova-region) |
| 12 | Semilla Expande | Corfo | Nacional | Por confirmar | Hasta $28,3M + $22,7M (2 etapas) | No confirmado | A | ⏳ Needs review | [corfo.cl](https://www.corfo.cl/sites/cpp/movil/semilla-expande) |
| 13 | Crea y Valida (I+D+i) | Corfo | Nacional | Por confirmar | Hasta $180M / $220M colaborativo | No confirmado | B | ⏳ Needs review | [corfo.cl](https://www.corfo.cl/sites/cpp/crea-y-valida) |
| 14 | Innova Alta Tecnología | Corfo | Nacional | Por confirmar | Hasta $400M (relanzamiento) | No confirmado | B | ⏳ Needs review | [corfo.cl](https://www.corfo.cl/sites/cpp/convocatorias/movil/alta_tecnologia_innova) |
| 15 | Viraliza – Transformación Digital | Corfo | Nacional | Por confirmar | No confirmado | No confirmado | A | ⏳ Needs review | [corfo.cl](https://www.corfo.cl/sites/cpp/convocatorias/viraliza_transformacion_digital) |

Potencial 0km: **A** = alto (financia o se relaciona directamente con
digitalización/software/ecommerce/plataformas), **B** = medio (componente
digital indirecto o alto ticket con barrera técnica mayor). Ninguno de
los 15 quedó en C — se descartaron los candidatos de bajo potencial
antes de llegar a esta tabla (ver sección 3).

Los campos completos de cada registro (descripción, objetivo,
beneficiarios, gastos elegibles, categorías, notas de verificación)
están en `api/database/data/curaduria_fondos_2026.json` — es la fuente
de verdad que carga `php artisan app:import-fondos-2026`, y sirve como
respaldo auditable de exactamente qué se cargó y por qué.

## 2. Fondos investigados pero descartados de los 15

| Candidato | Motivo de descarte |
|---|---|
| Crece (convocatoria nacional 2026) | Cerrada desde el 11-06-2026; la línea nacional ya no está vigente y no se encontró una nueva fecha oficial anunciada. Se prefirió incluir la variante regional "Crece Sostenible RM 2026" en su lugar, con datos propios confirmados. |
| Capital Pioneras | Confirmado cerrado (postulación 01-07-2026 al 15-07-2026, ya vencida). Se priorizó Capital Abeja Emprende para mantener la diversidad de enfoque de género sin duplicar dos fondos ya cerrados. |
| Digitaliza tu Almacén, Región Metropolitana | Se encontró la página oficial, pero el único monto disponible en el fragmento correspondía a una convocatoria de un año anterior — cargarlo como dato 2026 hubiera sido inventar información. Se usó en su lugar la versión de Antofagasta, que sí trajo cifras propias de 2026. |
| Crece Multisectorial / Crece Urbano / Crece 26 Comunas (varias regiones) | Existen y tienen URL oficial, pero no se investigaron fechas específicas por límite de tiempo de esta pasada — quedan como universo para una próxima ronda de curaduría (no se cargaron para no exceder los 15 ni diluir la revisión inicial). |
| Otras líneas de Viraliza (Formación, Eventos) | Se encontró que aparecían cerradas en los fragmentos de búsqueda vistos; se priorizó "Viraliza – Transformación Digital" por su nombre explícitamente ligado al objetivo comercial de 0km, aunque su estado tampoco pudo confirmarse (ver riesgos). |

## 3. Fuentes

Todas las fuentes son las páginas oficiales de `sercotec.cl` o
`corfo.cl` listadas en la columna "Fuente" de la tabla de la sección 1
— no se usaron blogs, medios de prensa ni artículos SEO como fuente
primaria de ningún dato cargado (sí aparecieron en los resultados de
búsqueda de apoyo, pero solo se tomaron datos de fragmentos del dominio
oficial).

## 4. Riesgos / datos que requieren revisión posterior

- **Los 13 registros `needs_review`** son el riesgo principal: sus
  fechas de postulación específicas para la región indicada no están
  confirmadas. Antes de promocionarlos activamente (redes, WhatsApp,
  etc.), alguien debe abrir la URL oficial y confirmar que la
  convocatoria sigue vigente con esos datos.
- **Viraliza – Transformación Digital**: hay evidencia indirecta (otras
  líneas de Viraliza aparecían cerradas en la misma búsqueda) de que
  esta línea también podría estar cerrada. Revisar con prioridad.
- **Kit Digital (Biobío, Araucanía, Ñuble)**: el monto de $1.200.000 se
  asumió igual al de la Región Metropolitana por ser el mismo
  instrumento nacional replicado por región — es una inferencia
  razonable (mismas bases del programa), no un dato leído
  independientemente para cada región. Confirmar si alguna región tiene
  variaciones.
- **Capital Semilla Emprende (RM y Los Ríos)**: mismo caso — montos
  tomados del instrumento nacional, no confirmados región por región.
- **CORFO en general** (Innova Región, Semilla Expande, Crea y Valida,
  Innova Alta Tecnología): son programas con múltiples líneas/variantes
  activas simultáneamente (ej. "Crea y Valida" tiene versión Eureka,
  sostenibilidad, colaborativa con Alemania) — el registro cargado
  describe el programa general, no una convocatoria específica con
  fecha de cierre. Puede requerir desdoblarse en registros más
  específicos una vez identificada la convocatoria vigente exacta.

## 5. Próxima revisión sugerida

| Registro | Próxima revisión sugerida | Motivo |
|---|---|---|
| Kit Digital RM 2026, Capital Abeja RM 2026 | Mayo–junio 2027 | Patrón anual observado en las fechas confirmadas de 2026. |
| Resto de los 13 `needs_review` | Inmediata (antes de publicar) | Requieren confirmación de fecha antes de marcarse `verified`. |
| Todos | Cada 90 días una vez `verified` | Alineado con `next_review_at` del modelo (no seteado automáticamente en esta carga — se recomienda definirlo manualmente desde `/admin/fondos` al verificar cada uno). |

## 6. Cómo se cargaron

Los 15 registros están en `api/database/data/curaduria_fondos_2026.json`
(un array con los 20 campos del modelo `Fund` para cada uno, más las
notas de verificación con el potencial y prioridad comercial 0km). Se
cargan con un comando de Artisan de un solo uso:

```bash
php artisan app:import-fondos-2026 --dry-run   # ver qué haría, sin escribir
php artisan app:import-fondos-2026             # cargar de verdad
```

Es idempotente (usa `updateOrCreate` por `slug`), así que correrlo de
nuevo actualiza los mismos 15 registros en vez de duplicarlos — sirve
también para futuras actualizaciones de esta misma curaduría. Cada
carga además deja un registro en `fund_verifications` (historial
append-only), igual que si se hubiera cargado a mano desde el panel.

**No se modificó el schema.** Los 20 campos usados son exactamente los
que ya existían en el modelo `Fund`. El "potencial 0km" (A/B/C) y la
"prioridad comercial" (1/2/3) pedidos en las secciones 9 y 10 de la
instrucción original se documentaron en `verification_notes` de cada
registro, tal como sugería la instrucción, sin crear columnas nuevas.

## 7. Estado de las restricciones de la instrucción original

Todas se respetaron: no se creó Supabase, no se tocó `0km.app`, no se
cambió Laravel/MySQL/React, no se rediseñó el frontend, no se inventaron
fondos/fechas/montos/requisitos, no se marcó como `verified` nada que no
tuviera una fuente oficial comprobable en el fragmento visto, no se
implementó scraping automático ni IA como funcionalidad de la
plataforma (el comando de importación es una carga de datos ya
curados manualmente, no un scraper).
