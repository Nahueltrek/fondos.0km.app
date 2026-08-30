// ⚠️ DATOS DE EJEMPLO — NO SON FONDOS REALES.
//
// Master Plan (sección 11, REGLA 9): nunca inventar fechas, montos,
// requisitos ni condiciones de convocatorias reales. Estos registros usan
// institución y URL ficticias a propósito, para que sea imposible
// confundirlos con una convocatoria real mientras no exista un flujo de
// curación manual con fuentes oficiales verificadas
// (ver DATA_GOVERNANCE_FONDOS_0KM.md).
//
// Cuando VITE_API_URL apunta a la API real (Fase D) y hay fondos
// verificados cargados, este archivo deja de usarse — src/lib/api.js
// solo cae acá si la API no está configurada o falla.

export const FONDOS_PLACEHOLDER = [
  {
    name: "[EJEMPLO] Fondo Digitaliza tu Negocio",
    slug: "ejemplo-fondo-digitaliza-tu-negocio",
    institution: "Institución de Ejemplo (dato ficticio)",
    description:
      "Este es un registro de ejemplo para probar el explorador de fondos. No representa una convocatoria real.",
    objective: "Dato de ejemplo — pendiente de reemplazo por curación oficial.",
    beneficiaries: "Dato de ejemplo",
    regions: ["Región Metropolitana"],
    communes: [],
    amount: "Dato de ejemplo",
    cofinancing: "Dato de ejemplo",
    application_start: null,
    application_end: null,
    status: "por_confirmar",
    categories: ["Digitalización", "Tecnología"],
    eligible_expenses: "Dato de ejemplo",
    official_url: null,
    source_name: "Placeholder interno",
    source_url: null,
    verification_status: "pending",
    last_verified_at: null,
  },
  {
    name: "[EJEMPLO] Fondo Turismo y Territorio",
    slug: "ejemplo-fondo-turismo-y-territorio",
    institution: "Institución de Ejemplo (dato ficticio)",
    description:
      "Registro de ejemplo orientado a operadores turísticos, usado solo para validar filtros por categoría y región.",
    objective: "Dato de ejemplo — pendiente de reemplazo por curación oficial.",
    beneficiaries: "Dato de ejemplo",
    regions: ["La Araucanía", "Los Lagos"],
    communes: [],
    amount: "Dato de ejemplo",
    cofinancing: "Dato de ejemplo",
    application_start: null,
    application_end: null,
    status: "por_confirmar",
    categories: ["Turismo", "Sostenibilidad"],
    eligible_expenses: "Dato de ejemplo",
    official_url: null,
    source_name: "Placeholder interno",
    source_url: null,
    verification_status: "pending",
    last_verified_at: null,
  },
  {
    name: "[EJEMPLO] Fondo Emprende Comercio Digital",
    slug: "ejemplo-fondo-emprende-comercio-digital",
    institution: "Institución de Ejemplo (dato ficticio)",
    description:
      "Registro de ejemplo para probar la ficha de fondo y el flujo hacia diagnóstico/matching.",
    objective: "Dato de ejemplo — pendiente de reemplazo por curación oficial.",
    beneficiaries: "Dato de ejemplo",
    regions: ["Valparaíso"],
    communes: [],
    amount: "Dato de ejemplo",
    cofinancing: "Dato de ejemplo",
    application_start: null,
    application_end: null,
    status: "por_confirmar",
    categories: ["Emprendimiento", "Comercio"],
    eligible_expenses: "Dato de ejemplo",
    official_url: null,
    source_name: "Placeholder interno",
    source_url: null,
    verification_status: "pending",
    last_verified_at: null,
  },
];
