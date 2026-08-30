# DESIGN_SYSTEM_0KM.md

> **⚠️ Documento parcial / primera pasada.** Basado en **una sola
> captura de pantalla** de `0km.app` (el hero y el arranque de la
> sección "Qué hacemos", en escritorio, tema oscuro). No cubre:
> formularios, cards de servicio completas, footer, estados hover/focus,
> versión mobile, ni la paleta exacta en hex (se estiman por inspección
> visual, no por inspector de CSS real). Se actualiza cuando lleguen más
> capturas o acceso directo al sitio/repositorio de `0km.app`.

## 1. Qué es `0km.app` (contexto, de la propia captura)

Sitio de **Pablo Medina M.**, ingeniero con 20+ años en TI & ecommerce.
Propuesta de valor: "Tu negocio, listo para rodar." — cuatro servicios
digitales (ecommerce, campañas, branding, automatización con IA)
implementados por el mismo equipo. Esto confirma que `0km.app` es un
sitio de servicios/agencia personal, y `fondos.0km.app` es una extensión
de ese mismo ecosistema hacia financiamiento — coherente con la sección
47 del Master Plan.

## 2. Paleta de colores (estimada visualmente)

| Uso | Color aproximado | Notas |
|---|---|---|
| Fondo general | Negro/azul muy oscuro (`#0a0e14` – `#0d1117` aprox.) | Tema oscuro consistente en toda la página |
| Acento primario | Teal/cian brillante (`#2dd4bf` – `#22d3ee` aprox.) | Logo, badges, botón CTA primario, bullets de la lista de servicios |
| Acento secundario | Violeta/lavanda (`#a78bfa` – `#c4b5fd` aprox.) | Gradiente en el hero (fondo y parte del H1: "listo para rodar") |
| Texto principal | Blanco / casi blanco | Headings |
| Texto secundario | Gris medio (`#9ca3af` aprox.) | Subtítulos, texto de apoyo |
| Botón primario | Fondo teal sólido, texto oscuro | "Cotizar proyecto" |
| Botón secundario | Fondo oscuro, borde sutil, texto blanco | "Ver servicios" |

**Contraste con la paleta actual de `fondos-0km-app`** (`tailwind.config.js`):
hoy usamos `brand: #0B3B63` (azul oscuro) sobre **fondo claro**
(`bg-gray-50`, cards blancas). `0km.app` es **tema oscuro** con
teal+violeta. Son paletas visualmente opuestas — esto es lo más
importante que este documento revela: no alcanza con "ajustar un color",
`fondos.0km.app` necesitaría migrar de tema claro a oscuro para sentirse
del mismo ecosistema. Es una decisión de diseño grande, no un ajuste
menor — se recomienda decidirla explícitamente con Nahuel antes de
tocar componentes (ver sección 5).

## 3. Tipografía

- Headings: sans-serif bold/black, tamaños grandes (H1 ~56-64px
  estimado), buen line-height, sin serifas.
- El wordmark "0km.app" en el header usa un tratamiento más geométrico/
  monoespaciado para "0km" (la barra del "0" sugiere una fuente técnica
  tipo mono o un logo custom), con ".app" en el color de acento.
- Cuerpo/subtítulos: sans-serif regular, gris, tamaño medio, buena
  legibilidad sobre fondo oscuro.

No se puede confirmar la familia tipográfica exacta (Inter, Manrope,
Space Grotesk, etc.) sin inspeccionar el CSS real — pendiente.

## 4. Componentes observados

| Componente | Descripción |
|---|---|
| Badge/pill | Fondo oscuro, borde sutil color acento, punto (●) teal a la izquierda, texto uppercase pequeño. Ej: "● SERVICIOS DIGITALES · 0KM.APP", "01 · QUÉ HACEMOS" |
| Botón primario | Fondo teal sólido, texto oscuro, esquinas redondeadas, flecha "→" al final del label |
| Botón secundario | Fondo oscuro/transparente, borde, texto blanco, sin flecha |
| Header/nav | Fondo oscuro, logo a la izquierda, links centrados ("Servicios", "Blog", "Contacto"), CTA a la derecha con botón outline |
| Hero | Fondo con gradiente diagonal (teal oscuro → violeta oscuro) + líneas/puntos decorativos tipo red neuronal (motivo "tech") |
| Card de autor/testimonio | Fondo levemente más claro que el general, bordes redondeados, avatar circular + nombre + rol + link de acento a la derecha |
| Lista de tags/servicios | Fila horizontal de palabras separadas por punto (•), texto gris pequeño — probablemente un marquee/scroll infinito |

## 5. Recomendación para `fondos.0km.app`

**No migrar a tema oscuro todavía sin decisión explícita.** El Master
Plan (Fase 1, punto 30 y regla del punto 34) pide preservar la UX actual
y no degradarla, y evolucionar gradualmente. Migrar de tema claro a
oscuro es un cambio de fondo real (no cosmético), afecta legibilidad,
contraste y todos los componentes existentes — se recomienda:

1. Mostrarle esta comparación a Nahuel explícitamente.
2. Decidir: ¿tema oscuro completo, o solo adoptar los acentos (teal +
   badges + botones) sobre la base clara actual, como paso intermedio?
3. Recién con eso definido, tocar `tailwind.config.js` y los componentes
   compartidos (`Header`, `Footer`, `FundCard`, botones).

## 6. Qué falta para completar este documento

- Capturas de: `/servicios`, `/blog`, `/contacto`, footer completo,
  formularios, versión mobile.
- Valores hex reales (inspector del navegador) en vez de estimados.
- Nombre de la fuente tipográfica real.
- Iconografía (esta captura no muestra iconos más allá de flechas y el
  punto de los badges).
