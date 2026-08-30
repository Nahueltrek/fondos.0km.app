import { useEffect, useState } from "react";
import { fetchDashboard, AdminApiError } from "../lib/adminApi";

function StatCard({ label, value }) {
  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
      <p className="text-sm text-slate-400 mb-1">{label}</p>
      <p className="text-3xl font-bold text-white">{value}</p>
    </div>
  );
}

export default function AdminDashboard() {
  const [data, setData] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchDashboard()
      .then(setData)
      .catch((err) => {
        setError(
          err instanceof AdminApiError && err.status === 403
            ? "Tu rol no tiene acceso al dashboard."
            : "No se pudo cargar el dashboard."
        );
      });
  }, []);

  if (error) return <p className="text-red-400">{error}</p>;
  if (!data) return <p className="text-slate-500">Cargando…</p>;

  return (
    <div>
      <h1 className="text-2xl font-bold text-white mb-6">Dashboard</h1>

      <h2 className="text-sm font-semibold text-slate-400 uppercase tracking-wide mb-3">Fondos</h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-8">
        <StatCard label="Activos (abiertos)" value={data.funds.activos} />
        <StatCard label="Pendientes de verificar" value={data.funds.pendientes} />
        <StatCard label="Por revisar" value={data.funds.por_revisar} />
      </div>

      <h2 className="text-sm font-semibold text-slate-400 uppercase tracking-wide mb-3">Leads</h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        <StatCard label="Nuevos" value={data.leads.nuevos} />
        <StatCard label="Calificados" value={data.leads.calificados} />
        <StatCard label="Prioritarios" value={data.leads.prioritarios} />
      </div>
    </div>
  );
}
