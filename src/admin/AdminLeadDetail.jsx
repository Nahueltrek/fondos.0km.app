import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { fetchAdminLead, updateAdminLeadStatus } from "../lib/adminApi";
import { LEAD_STATUS_LABELS } from "./constants";

function Field({ label, value }) {
  if (!value) return null;
  return (
    <div className="mb-3">
      <p className="text-xs text-slate-500 uppercase tracking-wide">{label}</p>
      <p className="text-sm text-slate-300">{value}</p>
    </div>
  );
}

export default function AdminLeadDetail() {
  const { id } = useParams();
  const [lead, setLead] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchAdminLead(id)
      .then(setLead)
      .catch(() => setError("No se pudo cargar el lead."))
      .finally(() => setLoading(false));
  }, [id]);

  const changeStatus = async (e) => {
    const status = e.target.value;
    setSaving(true);
    try {
      const updated = await updateAdminLeadStatus(id, status);
      setLead(updated);
    } catch {
      setError("No se pudo actualizar el estado.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <p className="text-slate-500">Cargando…</p>;
  if (error && !lead) return <p className="text-red-400">{error}</p>;
  if (!lead) return null;

  return (
    <div className="max-w-2xl">
      <Link to="/admin/leads" className="text-sm text-slate-500 hover:text-brand">← Volver a leads</Link>
      <h1 className="text-2xl font-bold text-white mt-2 mb-6">{lead.name || "Lead sin nombre"}</h1>

      {error && (
        <p className="text-xs text-red-400 bg-red-950/40 border border-red-800/40 rounded-md p-3 mb-4">{error}</p>
      )}

      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 mb-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <p className="text-xs text-slate-500 uppercase tracking-wide">Score</p>
            <p className="text-2xl font-bold text-white">{lead.score}</p>
          </div>
          <div className="w-56">
            <label className="block text-xs text-slate-500 uppercase tracking-wide mb-1">Estado</label>
            <select value={lead.status} onChange={changeStatus} disabled={saving} className="input">
              {Object.entries(LEAD_STATUS_LABELS).map(([value, label]) => (
                <option key={value} value={value}>{label}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-x-6">
          <Field label="Email" value={lead.email} />
          <Field label="Teléfono" value={lead.phone} />
          <Field label="Empresa" value={lead.company} />
          <Field label="Tipo de negocio" value={lead.business_type} />
          <Field label="Región" value={lead.region} />
          <Field label="Comuna" value={lead.commune} />
          <Field label="Estado del fondo" value={lead.fund_status} />
          <Field label="Fuente" value={lead.source} />
          <Field label="Presupuesto" value={lead.budget} />
          <Field
            label="Formalizado"
            value={lead.business_formalized === null ? null : lead.business_formalized ? "Sí" : "No"}
          />
        </div>

        <Field label="Necesidades" value={lead.needs} />
        <Field label="Problema" value={lead.problem} />

        {lead.fund && (
          <div className="mt-4 pt-4 border-t border-slate-800">
            <p className="text-xs text-slate-500 uppercase tracking-wide mb-1">Fondo relacionado</p>
            <Link to={`/admin/fondos/${lead.fund.id}`} className="text-brand font-medium text-sm">
              {lead.fund.name}
            </Link>
          </div>
        )}

        <p className="text-xs text-slate-500 mt-4 pt-4 border-t border-slate-800">
          Creado el {new Date(lead.created_at).toLocaleString("es-CL")}
        </p>
      </div>
    </div>
  );
}
