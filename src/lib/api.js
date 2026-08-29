import { supabase } from "./supabaseClient";
import { FONDOS_PLACEHOLDER } from "../data/fondosPlaceholder";

// Capa de acceso a datos de fondos. Si hay un Supabase real configurado,
// se usa la tabla `funds` (ver DATA_GOVERNANCE_FONDOS_0KM.md). Si no,
// cae a datos de ejemplo marcados como placeholder — nunca se presentan
// como fondos reales (ver src/data/fondosPlaceholder.js).
export async function fetchFondos() {
  if (!supabase) return FONDOS_PLACEHOLDER;

  const { data, error } = await supabase
    .from("funds")
    .select("*")
    .order("name");

  if (error) {
    console.error("Error cargando fondos desde Supabase:", error.message);
    return FONDOS_PLACEHOLDER;
  }
  return data ?? [];
}

export async function fetchFondoBySlug(slug) {
  if (!supabase) {
    return FONDOS_PLACEHOLDER.find((f) => f.slug === slug) ?? null;
  }

  const { data, error } = await supabase
    .from("funds")
    .select("*")
    .eq("slug", slug)
    .maybeSingle();

  if (error) {
    console.error("Error cargando fondo desde Supabase:", error.message);
    return FONDOS_PLACEHOLDER.find((f) => f.slug === slug) ?? null;
  }
  return data;
}
