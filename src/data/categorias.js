// Categorías administrables (Master Plan, sección 14).
// En producción esta lista vive en la base de datos, no hardcodeada aquí.
export const CATEGORIAS = [
  "Emprendimiento",
  "Digitalización",
  "Innovación",
  "Turismo",
  "Comercio",
  "Agricultura",
  "Sostenibilidad",
  "Economía Circular",
  "Marketing",
  "Tecnología",
  "Cultura",
  "Organizaciones",
];

export const ESTADOS_FONDO = [
  "proximo",
  "abierto",
  "cerrado",
  "finalizado",
  "permanente",
  "por_confirmar",
];

export const ESTADO_LABELS = {
  proximo: "Próximo",
  abierto: "Abierto",
  cerrado: "Cerrado",
  finalizado: "Finalizado",
  permanente: "Permanente",
  por_confirmar: "Por confirmar",
};

export const ESTADO_COLORS = {
  proximo: "bg-blue-500/10 text-blue-300 border border-blue-500/30",
  abierto: "bg-green-500/10 text-green-300 border border-green-500/30",
  cerrado: "bg-slate-500/10 text-slate-400 border border-slate-500/30",
  finalizado: "bg-slate-500/10 text-slate-500 border border-slate-500/20",
  permanente: "bg-purple-500/10 text-purple-300 border border-purple-500/30",
  por_confirmar: "bg-yellow-500/10 text-yellow-300 border border-yellow-500/30",
};

export const REGIONES = [
  "Región Metropolitana",
  "Valparaíso",
  "Biobío",
  "La Araucanía",
  "Los Lagos",
  "Coquimbo",
  "O'Higgins",
  "Maule",
  "Ñuble",
  "Los Ríos",
  "Antofagasta",
  "Atacama",
  "Tarapacá",
  "Arica y Parinacota",
  "Aysén",
  "Magallanes",
];
