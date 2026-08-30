import { useEffect, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import {
  fetchAdminFondo,
  createAdminFondo,
  updateAdminFondo,
  verifyAdminFondo,
  AdminApiError,
} from "../lib/adminApi";
import { ESTADOS_FONDO, ESTADO_LABELS } from "../data/categorias";
import { VERIFICATION_LABELS, SOURCE_TYPE_LABELS } from "./constants";

const emptyForm = {
  name: "",
  slug: "",
  institution: "",
  description: "",
  objective: "",
  beneficiaries: "",
  regions: "",
  communes: "",
  amount: "",
  cofinancing: "",
  application_start: "",
  application_end: "",
  status: "por_confirmar",
  categories: "",
  eligible_expenses: "",
  official_url: "",
  source_name: "",
  source_url: "",
  source_type: "",
  source_reference: "",
  verification_status: "pending",
};

function slugify(text) {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

function toCommaText(value) {
  return Array.isArray(value) ? value.join(", ") : "";
}

function fromCommaText(value) {
  return value
    .split(",")
    .map((v) => v.trim())
    .filter(Boolean);
}

function toDateInput(value) {
  return value ? String(value).slice(0, 10) : "";
}

function fundToForm(fund) {
  return {
    name: fund.name ?? "",
    slug: fund.slug ?? "",
    institution: fund.institution ?? "",
    description: fund.description ?? "",
    objective: fund.objective ?? "",
    beneficiaries: fund.beneficiaries ?? "",
    regions: toCommaText(fund.regions),
    communes: toCommaText(fund.communes),
    amount: fund.amount ?? "",
    cofinancing: fund.cofinancing ?? "",
    application_start: toDateInput(fund.application_start),
    application_end: toDateInput(fund.application_end),
    status: fund.status ?? "por_confirmar",
    categories: toCommaText(fund.categories),
    eligible_expenses: fund.eligible_expenses ?? "",
    official_url: fund.official_url ?? "",
    source_name: fund.source_name ?? "",
    source_url: fund.source_url ?? "",
    source_type: fund.source_type ?? "",
    source_reference: fund.source_reference ?? "",
    verification_status: fund.verification_status ?? "pending",
  };
}

function buildPayload(form) {
  return {
    name: form.name,
    slug: form.slug,
    institution: form.institution || null,
    description: form.description || null,
    objective: form.objective || null,
    beneficiaries: form.beneficiaries || null,
    regions: fromCommaText(form.regions),
    communes: fromCommaText(form.communes),
    amount: form.amount || null,
    cofinancing: form.cofinancing || null,
    application_start: form.application_start || null,
    application_end: form.application_end || null,
    status: form.status,
    categories: fromCommaText(form.categories),
    eligible_expenses: form.eligible_expenses || null,
    official_url: form.official_url || null,
    source_name: form.source_name || null,
    source_url: form.source_url || null,
    source_type: form.source_type || null,
    source_reference: form.source_reference || null,
  };
}

export default function AdminFondoForm() {
  const { id } = useParams();
  const isEdit = !!id;
  const navigate = useNavigate();

  const [form, setForm] = useState(emptyForm);
  const [verifications, setVerifications] = useState([]);
  const [loading, setLoading] = useState(isEdit);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [fieldErrors, setFieldErrors] = useState({});
  const [notice, setNotice] = useState("");

  const [verifyForm, setVerifyForm] = useState({
    verification_status: "verified",
    verification_notes: "",
  });
  const [verifying, setVerifying] = useState(false);
  const [verifyError, setVerifyError] = useState("");

  useEffect(() => {
    if (!isEdit) return;
    fetchAdminFondo(id)
      .then((fund) => {
        setForm(fundToForm(fund));
        setVerifications(fund.verifications ?? []);
      })
      .catch(() => setError("No se pudo cargar el fondo."))
      .finally(() => setLoading(false));
  }, [id, isEdit]);

  const update = (key) => (e) => setForm({ ...form, [key]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError("");
    setFieldErrors({});
    setNotice("");

    try {
      const payload = buildPayload(form);
      if (isEdit) {
        const fund = await updateAdminFondo(id, payload);
        setForm(fundToForm(fund));
        setNotice("Cambios guardados.");
      } else {
        const fund = await createAdminFondo(payload);
        navigate(`/admin/fondos/${fund.id}`, { replace: true });
      }
    } catch (err) {
      if (err instanceof AdminApiError && err.errors) {
        setFieldErrors(err.errors);
        setError("Revisa los campos marcados.");
      } else {
        setError(err.message ?? "No se pudo guardar el fondo.");
      }
    } finally {
      setSaving(false);
    }
  };

  const submitVerify = async (e) => {
    e.preventDefault();
    setVerifying(true);
    setVerifyError("");
    try {
      const fund = await verifyAdminFondo(id, {
        verification_status: verifyForm.verification_status,
        verification_notes: verifyForm.verification_notes || null,
      });
      setForm(fundToForm(fund));
      setVerifications(fund.verifications ?? verifications);
      setVerifyForm({ verification_status: verifyForm.verification_status, verification_notes: "" });
      setNotice("Verificación registrada.");
    } catch (err) {
      setVerifyError(err.message ?? "No se pudo registrar la verificación.");
    } finally {
      setVerifying(false);
    }
  };

  if (loading) return <p className="text-slate-500">Cargando…</p>;

  return (
    <div className="max-w-2xl">
      <Link to="/admin/fondos" className="text-sm text-slate-500 hover:text-brand">← Volver a fondos</Link>
      <h1 className="text-2xl font-bold text-white mt-2 mb-6">
        {isEdit ? `Editar: ${form.name || "fondo"}` : "Nuevo fondo"}
      </h1>

      {notice && (
        <p className="text-xs text-brand bg-brand-light border border-brand/20 rounded-md p-3 mb-4">{notice}</p>
      )}
      {error && (
        <p className="text-xs text-red-400 bg-red-950/40 border border-red-800/40 rounded-md p-3 mb-4">{error}</p>
      )}

      <form onSubmit={submit} className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4 mb-8">
        <div>
          <label className="block text-sm text-slate-300 mb-1">Nombre</label>
          <input value={form.name} onChange={update("name")} required className="input" />
          {fieldErrors.name && <p className="text-xs text-red-400 mt-1">{fieldErrors.name[0]}</p>}
        </div>

        <div>
          <label className="block text-sm text-slate-300 mb-1">Slug</label>
          <div className="flex gap-2">
            <input value={form.slug} onChange={update("slug")} required className="input" />
            <button
              type="button"
              onClick={() => setForm({ ...form, slug: slugify(form.name) })}
              className="text-xs text-slate-400 border border-slate-700 rounded-lg px-3 whitespace-nowrap hover:text-white"
            >
              Generar
            </button>
          </div>
          {fieldErrors.slug && <p className="text-xs text-red-400 mt-1">{fieldErrors.slug[0]}</p>}
        </div>

        <div>
          <label className="block text-sm text-slate-300 mb-1">Institución</label>
          <input value={form.institution} onChange={update("institution")} className="input" />
        </div>

        <div>
          <label className="block text-sm text-slate-300 mb-1">Descripción</label>
          <textarea value={form.description} onChange={update("description")} rows={3} className="input" />
        </div>

        <div>
          <label className="block text-sm text-slate-300 mb-1">Objetivo</label>
          <textarea value={form.objective} onChange={update("objective")} rows={2} className="input" />
        </div>

        <div>
          <label className="block text-sm text-slate-300 mb-1">Beneficiarios</label>
          <textarea value={form.beneficiaries} onChange={update("beneficiaries")} rows={2} className="input" />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-sm text-slate-300 mb-1">Regiones (separadas por coma)</label>
            <input value={form.regions} onChange={update("regions")} className="input" />
          </div>
          <div>
            <label className="block text-sm text-slate-300 mb-1">Comunas (separadas por coma)</label>
            <input value={form.communes} onChange={update("communes")} className="input" />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-sm text-slate-300 mb-1">Monto</label>
            <input value={form.amount} onChange={update("amount")} className="input" />
          </div>
          <div>
            <label className="block text-sm text-slate-300 mb-1">Cofinanciamiento</label>
            <input value={form.cofinancing} onChange={update("cofinancing")} className="input" />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-sm text-slate-300 mb-1">Inicio postulación</label>
            <input type="date" value={form.application_start} onChange={update("application_start")} className="input" />
          </div>
          <div>
            <label className="block text-sm text-slate-300 mb-1">Cierre postulación</label>
            <input type="date" value={form.application_end} onChange={update("application_end")} className="input" />
          </div>
        </div>

        <div>
          <label className="block text-sm text-slate-300 mb-1">Estado</label>
          <select value={form.status} onChange={update("status")} required className="input">
            {ESTADOS_FONDO.map((s) => (
              <option key={s} value={s}>{ESTADO_LABELS[s]}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm text-slate-300 mb-1">Categorías (separadas por coma)</label>
          <input value={form.categories} onChange={update("categories")} className="input" />
        </div>

        <div>
          <label className="block text-sm text-slate-300 mb-1">Gastos elegibles</label>
          <textarea value={form.eligible_expenses} onChange={update("eligible_expenses")} rows={2} className="input" />
        </div>

        <div>
          <label className="block text-sm text-slate-300 mb-1">URL oficial</label>
          <input type="url" value={form.official_url} onChange={update("official_url")} className="input" />
        </div>

        <div className="pt-2 border-t border-slate-800">
          <p className="text-xs text-slate-500 mb-3">Gobernanza de la fuente</p>
          <div className="grid grid-cols-2 gap-3 mb-3">
            <div>
              <label className="block text-sm text-slate-300 mb-1">Nombre de la fuente</label>
              <input value={form.source_name} onChange={update("source_name")} className="input" />
            </div>
            <div>
              <label className="block text-sm text-slate-300 mb-1">Tipo de fuente</label>
              <select value={form.source_type} onChange={update("source_type")} className="input">
                <option value="">—</option>
                {Object.entries(SOURCE_TYPE_LABELS).map(([value, label]) => (
                  <option key={value} value={value}>{label}</option>
                ))}
              </select>
            </div>
          </div>
          <div>
            <label className="block text-sm text-slate-300 mb-1">URL de la fuente</label>
            <input type="url" value={form.source_url} onChange={update("source_url")} className="input mb-3" />
          </div>
          <div>
            <label className="block text-sm text-slate-300 mb-1">Referencia de la fuente</label>
            <input value={form.source_reference} onChange={update("source_reference")} className="input" />
          </div>
        </div>

        <button
          type="submit"
          disabled={saving}
          className="bg-brand text-slate-900 font-medium px-5 py-2.5 rounded-lg hover:bg-brand-dark transition disabled:opacity-60"
        >
          {saving ? "Guardando…" : isEdit ? "Guardar cambios" : "Crear fondo"}
        </button>
      </form>

      {isEdit && (
        <>
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 mb-8">
            <h2 className="font-semibold text-white mb-1">Verificar fondo</h2>
            <p className="text-sm text-slate-500 mb-4">
              Estado actual de verificación: <strong className="text-slate-300">{VERIFICATION_LABELS[form.verification_status] ?? "—"}</strong>
            </p>

            {verifyError && (
              <p className="text-xs text-red-400 bg-red-950/40 border border-red-800/40 rounded-md p-3 mb-4">{verifyError}</p>
            )}

            <form onSubmit={submitVerify} className="space-y-3">
              <div>
                <label className="block text-sm text-slate-300 mb-1">Nuevo estado de verificación</label>
                <select
                  value={verifyForm.verification_status}
                  onChange={(e) => setVerifyForm({ ...verifyForm, verification_status: e.target.value })}
                  className="input"
                >
                  {Object.entries(VERIFICATION_LABELS).map(([value, label]) => (
                    <option key={value} value={value}>{label}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm text-slate-300 mb-1">Notas</label>
                <textarea
                  value={verifyForm.verification_notes}
                  onChange={(e) => setVerifyForm({ ...verifyForm, verification_notes: e.target.value })}
                  rows={2}
                  className="input"
                />
              </div>
              <button
                type="submit"
                disabled={verifying}
                className="bg-brand text-slate-900 font-medium px-5 py-2.5 rounded-lg hover:bg-brand-dark transition disabled:opacity-60"
              >
                {verifying ? "Registrando…" : "Registrar verificación"}
              </button>
            </form>
          </div>

          <div>
            <h2 className="font-semibold text-white mb-3">Historial de verificación</h2>
            {verifications.length === 0 ? (
              <p className="text-sm text-slate-500">Todavía no tiene verificaciones registradas.</p>
            ) : (
              <ul className="space-y-2">
                {[...verifications].reverse().map((v) => (
                  <li key={v.id} className="bg-slate-900 border border-slate-800 rounded-lg p-3 text-sm">
                    <p className="text-slate-300">
                      <strong className="text-white">{VERIFICATION_LABELS[v.status] ?? v.status}</strong>
                      {" — "}
                      {new Date(v.verified_at).toLocaleString("es-CL")}
                    </p>
                    {v.notes && <p className="text-slate-400 mt-1">{v.notes}</p>}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </>
      )}
    </div>
  );
}
