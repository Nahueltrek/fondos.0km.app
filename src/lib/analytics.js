// Analytics — Master Plan sección 36.
// Eventos: fund_viewed, fund_search, filter_used, diagnostic_started,
// diagnostic_completed, solution_viewed, lead_created, whatsapp_clicked,
// proposal_requested, checklist_downloaded.
//
// No se integra ningún proveedor concreto (Google Analytics, Plausible,
// etc.) todavía porque no hay credenciales/ID de medición reales — inventar
// uno sería falso. Este helper solo define el contrato de eventos y los
// despacha a cualquier proveedor que ya esté cargado en `window`, para que
// conectar uno real en el futuro sea un cambio de una línea.
export function track(eventName, payload = {}) {
  if (import.meta.env.DEV) {
    console.debug("[analytics]", eventName, payload);
  }

  if (typeof window === "undefined") return;

  if (typeof window.gtag === "function") {
    window.gtag("event", eventName, payload);
  }

  if (typeof window.plausible === "function") {
    window.plausible(eventName, { props: payload });
  }
}
