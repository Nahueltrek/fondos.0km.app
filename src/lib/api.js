import { FONDOS_PLACEHOLDER } from "../data/fondosPlaceholder";

// Capa de acceso a datos. Fase D: conectada a la API real Laravel (api/,
// ver DEPLOY_API.md), que sirve solo fondos verification_status=verified
// (filtrado en el servidor, nunca confiado al cliente). Si VITE_API_URL
// no está configurada, cae a datos de ejemplo marcados como placeholder —
// nunca se presentan como fondos reales (ver src/data/fondosPlaceholder.js).
const API_URL = import.meta.env.VITE_API_URL;

function apiFetch(path, options = {}) {
  return fetch(`${API_URL}${path}`, {
    ...options,
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      ...options.headers,
    },
  });
}

export async function fetchFondos() {
  if (!API_URL) return FONDOS_PLACEHOLDER;

  try {
    const res = await apiFetch("/api/funds");
    if (!res.ok) throw new Error(`La API respondió ${res.status}`);
    return await res.json();
  } catch (error) {
    console.error("Error cargando fondos desde la API:", error.message);
    return FONDOS_PLACEHOLDER;
  }
}

export async function fetchFondoBySlug(slug) {
  if (!API_URL) {
    return FONDOS_PLACEHOLDER.find((f) => f.slug === slug) ?? null;
  }

  try {
    const res = await apiFetch(`/api/funds/${encodeURIComponent(slug)}`);
    if (res.status === 404) return null;
    if (!res.ok) throw new Error(`La API respondió ${res.status}`);
    return await res.json();
  } catch (error) {
    console.error("Error cargando fondo desde la API:", error.message);
    return FONDOS_PLACEHOLDER.find((f) => f.slug === slug) ?? null;
  }
}

// Captura de leads (Master Plan, sección 24). El scoring se calcula en el
// servidor (LeadScoringService) — nunca se envía un score calculado en el
// cliente, para no depender de un valor que el backend igual recalcula e
// ignora (ver StoreLeadRequest: 'score' no es un campo aceptado).
export async function createLead(lead) {
  if (!API_URL) {
    console.warn(
      "VITE_API_URL no configurada: el lead no se guardó en ningún backend.",
      lead
    );
    return { saved: false, lead };
  }

  const endpoint = lead.source === "diagnostic" ? "/api/diagnostics" : "/api/leads";

  try {
    const res = await apiFetch(endpoint, {
      method: "POST",
      body: JSON.stringify(lead),
    });
    const data = await res.json().catch(() => null);

    if (!res.ok) {
      console.error("Error guardando lead en la API:", data?.message ?? res.status);
      return { saved: false, lead, error: data?.message ?? `Error ${res.status}` };
    }
    return { saved: true, lead: data?.lead ?? lead };
  } catch (error) {
    console.error("Error guardando lead en la API:", error.message);
    return { saved: false, lead, error: error.message };
  }
}
