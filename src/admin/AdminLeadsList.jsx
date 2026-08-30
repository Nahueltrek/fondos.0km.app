import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { fetchAdminLeads } from "../lib/adminApi";
import { LEAD_STATUS_LABELS } from "./constants";

export default function AdminLeadsList() {
  const [page, setPage] = useState(null);
  const [status, setStatus] = useState("");
  const [sort, setSort] = useState("created_at");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    setLoading(true);
    fetchAdminLeads({ status: status || undefined, sort, direction: "desc" })
      .then((data) => {
        setPage(data);
        setError("");
      })
      .catch(() => setError("No se pudieron cargar los leads."))
      .finally(() => setLoading(false));
  }, [status, sort]);

  return (
    <div>
      <h1 className="text-2xl font-bold text-white mb-6">Leads</h1>

      <div className="flex flex-wrap gap-3 mb-4">
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="border border-slate-700 bg-slate-900 text-slate-300 rounded-lg px-3 py-2 text-sm"
        >
          <option value="">Todos los estados</option>
          {Object.entries(LEAD_STATUS_LABELS).map(([value, label]) => (
            <option key={value} value={value}>{label}</option>
          ))}
        </select>

        <select
          value={sort}
          onChange={(e) => setSort(e.target.value)}
          className="border border-slate-700 bg-slate-900 text-slate-300 rounded-lg px-3 py-2 text-sm"
        >
          <option value="created_at">Más recientes primero</option>
          <option value="score">Mayor score primero</option>
        </select>
      </div>

      {error && <p className="text-red-400">{error}</p>}
      {loading && <p className="text-slate-500">Cargando…</p>}

      {!loading && page && (
        <div className="overflow-x-auto border border-slate-800 rounded-xl">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-800 text-left text-slate-400">
                <th className="px-4 py-3">Nombre</th>
                <th className="px-4 py-3">Contacto</th>
                <th className="px-4 py-3">Score</th>
                <th className="px-4 py-3">Estado</th>
                <th className="px-4 py-3">Fuente</th>
                <th className="px-4 py-3"></th>
              </tr>
            </thead>
            <tbody>
              {page.data.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-4 py-6 text-center text-slate-500">
                    No hay leads con ese filtro.
                  </td>
                </tr>
              )}
              {page.data.map((lead) => (
                <tr key={lead.id} className="border-b border-slate-800 last:border-0">
                  <td className="px-4 py-3 text-white">{lead.name || "—"}</td>
                  <td className="px-4 py-3 text-slate-400">{lead.email || lead.phone || "—"}</td>
                  <td className="px-4 py-3 text-slate-300">{lead.score}</td>
                  <td className="px-4 py-3 text-slate-400">{LEAD_STATUS_LABELS[lead.status] ?? lead.status}</td>
                  <td className="px-4 py-3 text-slate-400">{lead.source || "—"}</td>
                  <td className="px-4 py-3 text-right">
                    <Link to={`/admin/leads/${lead.id}`} className="text-brand font-medium">Ver</Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {!loading && page && page.last_page > 1 && (
        <p className="text-xs text-slate-500 mt-3">
          Página {page.current_page} de {page.last_page} · {page.total} leads en total
        </p>
      )}
    </div>
  );
}
