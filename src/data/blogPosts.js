// Blog — Master Plan secciones 29-30.
// Contenido educativo genérico (SEO + educación), sin datos específicos de
// convocatorias reales (fechas, montos, requisitos): eso vive únicamente en
// las fichas de fondo curadas, nunca en el blog (REGLA 9/10).

export const BLOG_CATEGORIAS = [
  "Fondos",
  "Emprendimiento",
  "Digitalización",
  "Tecnología",
  "Marketing",
  "Ecommerce",
  "Turismo",
  "Automatización",
];

export const BLOG_POSTS = [
  {
    slug: "que-son-los-fondos-concursables",
    title: "¿Qué son los fondos concursables?",
    category: "Fondos",
    excerpt:
      "Una introducción a cómo funcionan los fondos concursables, quién los entrega y qué esperar del proceso.",
    content: `
Un fondo concursable es un mecanismo de financiamiento —público o privado—
en el que distintos postulantes compiten por acceder a recursos, evaluados
según criterios definidos previamente en las bases de la convocatoria. A
diferencia de un crédito, normalmente no hay que devolver el dinero, pero
tampoco está garantizado: se accede si el proyecto es evaluado
favorablemente frente a otros postulantes.

En Chile, distintas instituciones públicas administran fondos de este tipo
orientados a emprendimiento, innovación, digitalización o desarrollo de
sectores específicos como el turismo. Cada convocatoria tiene su propio
objetivo, plazos, beneficiarios elegibles y gastos permitidos — por eso es
clave revisar siempre las bases oficiales de cada fondo antes de postular,
en vez de asumir que todos funcionan igual.

Postular no es solo llenar un formulario: normalmente implica describir el
problema que se busca resolver, el objetivo del proyecto, un presupuesto y,
en muchos casos, cómo se va a medir el resultado. Prepararse con tiempo
mejora las probabilidades de presentar una propuesta sólida.
    `.trim(),
  },
  {
    slug: "como-digitalizar-una-pyme",
    title: "¿Cómo digitalizar una Pyme?",
    category: "Digitalización",
    excerpt:
      "Por dónde empezar cuando un negocio decide dar el salto a lo digital, sin perderse en tecnología innecesaria.",
    content: `
Digitalizar una Pyme no significa necesariamente construir un sistema
complejo desde el día uno. En la mayoría de los casos, el camino tiene
sentido cuando se ordena en etapas:

1. **Presencia básica**: un sitio web simple y un canal de contacto claro
   (WhatsApp, formulario) suelen ser el primer paso, antes que cualquier
   automatización.
2. **Orden interno**: llevar clientes, ventas o inventario en una
   herramienta digital en vez de planillas sueltas o papel.
3. **Venta o reserva online**: cuando el negocio ya tiene tráfico o
   demanda, habilitar ecommerce o reservas reduce fricción y trabajo manual.
4. **Automatización**: recién en esta etapa tiene sentido invertir en
   integraciones, respuestas automáticas o reportería avanzada.

El error más común es saltarse etapas: comprar un sistema complejo antes de
tener procesos ordenados suele generar herramientas caras que terminan sin
usarse. Un diagnóstico honesto del nivel de digitalización actual del
negocio ayuda a decidir qué construir primero.
    `.trim(),
  },
  {
    slug: "web-o-sistema-que-necesita-mi-negocio",
    title: "Web o sistema: ¿qué necesita mi negocio?",
    category: "Tecnología",
    excerpt:
      "Una guía rápida para distinguir cuándo basta con un sitio web y cuándo conviene invertir en un sistema a medida.",
    content: `
Una pregunta frecuente al planificar un proyecto digital es si conviene
partir con un sitio web o directamente con un sistema de gestión. La
respuesta depende del problema que se quiere resolver, no de la moda
tecnológica del momento.

**Un sitio web** tiene sentido cuando el objetivo principal es dar a
conocer el negocio, mostrar productos o servicios, y facilitar el primer
contacto con un cliente potencial. Es la base de cualquier presencia
digital y, en general, la inversión inicial más baja.

**Un sistema** (CRM, gestión de inventario, reservas, etc.) tiene sentido
cuando el problema ya no es "que me encuentren", sino "cómo ordeno lo que
ya tengo": muchos clientes, muchas reservas, mucho stock, o procesos
repetitivos que hoy se hacen a mano y generan errores.

Muchos proyectos terminan necesitando ambas cosas, pero en momentos
distintos. Priorizar según el problema real —y no según lo que "se ve
mejor"— evita gastar en herramientas que el negocio todavía no necesita.
    `.trim(),
  },
];
