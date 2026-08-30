import { useState } from "react";
import { Link } from "react-router-dom";
import { Download, Check } from "lucide-react";
import { CHECKLIST_GRUPOS, checklistAsText } from "../data/checklist";
import { CATEGORIAS } from "../data/categorias";
import { createLead } from "../lib/api";
import { track } from "../lib/analytics";
import { useDocumentTitle } from "../lib/useDocumentTitle";

function downloadChecklist() {
  const blob = new Blob([checklistAsText()], { type: "text/plain;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "checklist-digitalizacion-0km.txt";
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

export default function Checklist() {
  useDocumentTitle("Checklist de digitalización");
  const [form, setForm] = useState({ nombre: "", email: "", whatsapp: "", rubro: "" });
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);

  const update = (key) => (e) => setForm({ ...form, [key]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    await createLead({
      name: form.nombre,
      email: form.email,
      phone: form.whatsapp || null,
      business_type: form.rubro,
      needs: "Descargó el checklist de digitalización",
      source: "checklist",
    });

    track("checklist_downloaded", { rubro: form.rubro });
    downloadChecklist();
    setSubmitting(false);
    setDone(true);
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-10">
      <h1 className="text-2xl font-bold text-white mb-2">
        Checklist de digitalización para emprendedores
      </h1>
      <p className="text-slate-400 mb-8">
        13 preguntas simples para saber en qué etapa está tu negocio y qué
        te conviene mejorar primero.
      </p>

      <div className="space-y-5 mb-10">
        {CHECKLIST_GRUPOS.map((grupo) => (
          <div key={grupo.titulo} className="bg-slate-900 border border-slate-800 rounded-xl p-5">
            <h2 className="font-semibold text-white mb-3">{grupo.titulo}</h2>
            <ul className="space-y-2">
              {grupo.items.map((item) => (
                <li key={item} className="flex items-start gap-2 text-sm text-slate-300">
                  <Check size={16} className="text-brand mt-0.5 shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      {done ? (
        <div className="bg-brand-light border border-brand/20 rounded-xl p-6 text-center">
          <p className="text-white font-medium mb-3">
            ¡Listo! Descargamos tu checklist.
          </p>
          <Link to="/diagnostico" className="text-brand font-medium">
            ¿Quieres un diagnóstico más completo de tu proyecto? →
          </Link>
        </div>
      ) : (
        <form onSubmit={submit} className="bg-slate-900 border border-slate-800 rounded-xl p-6">
          <h2 className="font-semibold text-white mb-1">Descargar checklist</h2>
          <p className="text-sm text-slate-500 mb-4">
            Te lo dejamos en un archivo descargable.
          </p>
          <div className="space-y-3 mb-4">
            <input value={form.nombre} onChange={update("nombre")} required placeholder="Nombre" className="input" />
            <input value={form.email} onChange={update("email")} required type="email" placeholder="Email" className="input" />
            <input value={form.whatsapp} onChange={update("whatsapp")} placeholder="WhatsApp (opcional)" className="input" />
            <select value={form.rubro} onChange={update("rubro")} required className="input">
              <option value="">Rubro</option>
              {CATEGORIAS.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>
          <button
            type="submit"
            disabled={submitting}
            className="w-full bg-brand text-slate-900 font-medium px-5 py-2.5 rounded-lg hover:bg-brand-dark transition disabled:opacity-60 flex items-center justify-center gap-2"
          >
            <Download size={18} />
            {submitting ? "Preparando…" : "Descargar checklist"}
          </button>
        </form>
      )}
    </div>
  );
}
