import { CATEGORIAS, REGIONES, ESTADOS_FONDO, ESTADO_LABELS } from "../data/categorias";

export default function Filters({ filters, onChange }) {
  const set = (key) => (e) => onChange({ ...filters, [key]: e.target.value });

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
      <select
        value={filters.categoria}
        onChange={set("categoria")}
        className="border border-gray-300 rounded-lg px-3 py-2 text-sm"
      >
        <option value="">Todas las categorías</option>
        {CATEGORIAS.map((c) => (
          <option key={c} value={c}>{c}</option>
        ))}
      </select>

      <select
        value={filters.region}
        onChange={set("region")}
        className="border border-gray-300 rounded-lg px-3 py-2 text-sm"
      >
        <option value="">Todas las regiones</option>
        {REGIONES.map((r) => (
          <option key={r} value={r}>{r}</option>
        ))}
      </select>

      <select
        value={filters.estado}
        onChange={set("estado")}
        className="border border-gray-300 rounded-lg px-3 py-2 text-sm"
      >
        <option value="">Todos los estados</option>
        {ESTADOS_FONDO.map((s) => (
          <option key={s} value={s}>{ESTADO_LABELS[s]}</option>
        ))}
      </select>
    </div>
  );
}
