// Lead scoring — Master Plan sección 25.
// Reglas iniciales, aplicadas sobre los datos recogidos en /diagnostico.

const KEYWORD_POINTS = [
  { keyword: "ecommerce", points: 10 },
  { keyword: "tienda", points: 10 },
  { keyword: "sistema", points: 10 },
  { keyword: "automatiza", points: 10 },
  { keyword: "whatsapp", points: 5 },
];

export function scoreLead({ fundStatus, budget, needs = "", problem = "" }) {
  let score = 0;

  if (fundStatus === "Fondo adjudicado") score += 20;
  else if (fundStatus === "Postulación") score += 15;

  if (budget && budget.trim().length > 0) score += 10;

  const texto = `${needs} ${problem}`.toLowerCase();
  for (const { keyword, points } of KEYWORD_POINTS) {
    if (texto.includes(keyword)) score += points;
  }

  if (needs.trim().length > 20 && problem.trim().length > 20) score += 5;

  return score;
}

// Estados — Master Plan sección 25.
export function scoreLabel(score) {
  if (score >= 40) return "Prioritario";
  if (score >= 25) return "Calificado";
  if (score >= 10) return "Potencial";
  return "Frío";
}
