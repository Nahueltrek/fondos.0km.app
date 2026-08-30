import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { fetchAdminFondos } from "../lib/adminApi";
import { VERIFICATION_LABELS } from "./constants";

export default function AdminFondosList() {
  const [page, setPage] = useState(null);
  const [filter, setFilter] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    setLoading(true);
    fetchAdminFondos({ verification_status: filter || undefined })
      .then((data) => {
        setPage(data);
        setError("");
      })
      .catch(() => setError("No se pudieron cargar los fondos."))
      .finally(() => setLoading(false));
  }, [filter]);

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-white">Fondos</h1>
        <Link
          to="/admin/fondos/nuevo"
          className="bg-brand text-slate-900 text-sm font-medium px-4 py-2 rounded-lg hover:bg-brand-dark transition"
        >
          + Nuevo fondo
        </Link>
      </div>

      <select
        value={filter}
        onChange={(e) => setFilter(e.target.value)}
        className="border border-slate-700 bg-slate-900 text-slate-300 rounded-lg px-3 py-2 text-sm mb-4"
      >
        <option value="">Todos los estados de verificación</option>
        {Object.entries(VERIFICATION_LABELS).map(([value, label]) => (
          <option key={value} value={value}>{label}</option>
        ))}
      </select>

      {error && <p className="text-red-400">{error}</p>}
      {loading && <p className="text-slate-500">Cargando…</p>}

      {!loading && page && (
        <div className="overflow-x-auto border border-slate-800 rounded-xl">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-800 text-left text-slate-400">
                <th className="px-4 py-3">Nombre</th>
                <th className="px-4 py-3">Estado</th>
                <th className="px-4 py-3">Verificación</th>
                <th className="px-4 py-3"></th>
              </tr>
            </thead>
            <tbody>
              {page.data.length === 0 && (
                <tr>
                  <td colSpan={4} className="px-4 py-6 text-center text-slate-500">
                    No hay fondos con ese filtro.
                  </td>
                </tr>
              )}
              {page.data.map((fund) => (
                <tr key={fund.id} className="border-b border-slate-800 last:border-0">
                  <td className="px-4 py-3 text-white">{fund.name}</td>
                  <td className="px-4 py-3 text-slate-400">{fund.status}</td>
                  <td className="px-4 py-3 text-slate-400">
                    {VERIFICATION_LABELS[fund.verification_status] ?? fund.verification_status}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <Link to={`/admin/fondos/${fund.id}`} className="text-brand font-medium">
                      Editar
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {!loading && page && page.last_page > 1 && (
        <p className="text-xs text-slate-500 mt-3">
          Página {page.current_page} de {page.last_page} · {page.total} fondos en total
        </p>
      )}
    </div>
  );
}
