// Lead magnet — Master Plan sección 31.
// Checklist genérico y real (no depende de datos de fondos específicos),
// organizado en las mismas etapas del artículo "¿Cómo digitalizar una Pyme?".
export const CHECKLIST_GRUPOS = [
  {
    titulo: "Presencia básica",
    items: [
      "Tengo un sitio web (aunque sea simple) con mis datos de contacto.",
      "Tengo un canal de contacto claro (WhatsApp Business, formulario o email).",
      "Mi negocio aparece en Google (nombre, dirección, horario si aplica).",
      "Tengo al menos una red social activa donde muestro lo que hago.",
    ],
  },
  {
    titulo: "Orden interno",
    items: [
      "Llevo el registro de mis clientes en algún lugar digital (no solo papel).",
      "Sé, sin tener que buscar mucho, cuánto stock o disponibilidad tengo.",
      "Tengo un lugar único donde ver mis ventas o reservas (no en 3 planillas distintas).",
    ],
  },
  {
    titulo: "Venta o reserva online",
    items: [
      "Un cliente puede comprar o reservar sin tener que escribirme primero.",
      "Puedo cobrar con algún medio de pago digital (transferencia, tarjeta, etc.).",
      "Tengo forma de confirmar automáticamente una compra o reserva.",
    ],
  },
  {
    titulo: "Automatización",
    items: [
      "Tengo respuestas automáticas para las preguntas más frecuentes.",
      "Uso algún sistema que conecta ventas, clientes o inventario entre sí.",
      "Reviso reportes o números del negocio de forma regular, no solo por sensación.",
    ],
  },
];

export function checklistAsText() {
  const lines = [
    "CHECKLIST DE DIGITALIZACIÓN PARA EMPRENDEDORES",
    "fondos.0km.app",
    "",
  ];
  for (const grupo of CHECKLIST_GRUPOS) {
    lines.push(grupo.titulo.toUpperCase());
    for (const item of grupo.items) {
      lines.push(`[ ] ${item}`);
    }
    lines.push("");
  }
  lines.push(
    "Cuantos más ítems tengas marcados, más avanzado está tu nivel de",
    "digitalización. Si quieres ayuda para avanzar en los que te faltan,",
    "escríbenos: https://fondos.0km.app/diagnostico"
  );
  return lines.join("\n");
}
