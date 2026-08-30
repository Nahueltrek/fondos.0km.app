import { useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { CATEGORIAS } from "../data/categorias";
import { SOLUCIONES } from "../data/soluciones";
import MatchingDisclaimer from "../components/MatchingDisclaimer";
import { fundWhatsAppMessage } from "../components/WhatsAppButton";
import { createLead } from "../lib/api";
import { scoreLead } from "../lib/scoring";
import { track } from "../lib/analytics";

const ETAPAS = ["Idea", "Postulación", "Fondo adjudicado", "Ejecución", "Negocio funcionando"];

const STEPS = [
  "tipo",
  "etapa",
  "mejorar",
  "problema",
  "recursos",
  "contacto",
];

const initialForm = {
  tipo: "",
  etapa: "",
  mejorar: "",
  problema: "",
  recursos: "",
  nombre: "",
  email: "",
  whatsapp: "",
};

function nivelDigitalizacion(form) {
  if (form.etapa === "Negocio funcionando" || form.etapa === "Ejecución") return "Avanzado";
  if (form.etapa === "Fondo adjudicado" || form.etapa === "Postulación") return "Intermedio";
  return "Inicial";
}

function solucionesRecomendadas(form) {
  const texto = `${form.mejorar} ${form.problema}`.toLowerCase();
  return SOLUCIONES.filter(
    (s) => s.categorias.includes(form.tipo) || texto.includes(s.nombre.toLowerCase())
  ).slice(0, 4);
}

export default function Diagnostico() {
  const [searchParams] = useSearchParams();
  const fondoRelacionado = searchParams.get("fondo");
  const [step, setStep] = useState(0);
  const [form, setForm] = useState(initialForm);
  const [done, setDone] = useState(false);
  const [leadResult, setLeadResult] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const update = (key) => (e) => setForm({ ...form, [key]: e.target.value });
  const next = () => {
    if (step === 0) track("diagnostic_started", { tipo: form.tipo });
    setStep((s) => Math.min(s + 1, STEPS.length - 1));
  };
  const back = () => setStep((s) => Math.max(s - 1, 0));

  const submit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    const score = scoreLead({
      fundStatus: form.etapa,
      budget: form.recursos,
      needs: form.mejorar,
      problem: form.problema,
    });

    const result = await createLead({
      name: form.nombre,
      email: form.email,
      phone: form.whatsapp || null,
      business_type: form.tipo,
      fund_status: form.etapa,
      needs: form.mejorar,
      problem: form.problema,
      budget: form.recursos,
      score,
      status: "nuevo",
      source: "diagnostico",
      fund_slug: fondoRelacionado || null,
    });

    setLeadResult(result);
    track("diagnostic_completed", { tipo: form.tipo, score });
    setSubmitting(false);
    setDone(true);
  };

  if (done) {
    const soluciones = solucionesRecomendadas(form);
    return (
      <div className="max-w-2xl mx-auto px-4 py-10">
        <h1 className="text-2xl font-bold text-brand-dark mb-6">Tu diagnóstico</h1>

        <div className="bg-white border border-gray-200 rounded-xl p-5 mb-4">
          <h2 className="font-semibold text-brand-dark mb-1">Perfil del proyecto</h2>
          <p className="text-sm text-gray-700">
            Tipo: {form.tipo || "—"} · Etapa: {form.etapa || "—"}
          </p>
          <p className="text-sm text-gray-700 mt-1">
            Nivel de digitalización estimado:{" "}
            <strong>{nivelDigitalizacion(form)}</strong>
          </p>
        </div>

        <div className="bg-white border border-gray-200 rounded-xl p-5 mb-4">
          <h2 className="font-semibold text-brand-dark mb-2">Soluciones recomendadas</h2>
          {soluciones.length === 0 ? (
            <p className="text-sm text-gray-500">
              No encontramos una coincidencia clara todavía — cuéntanos más por WhatsApp.
            </p>
          ) : (
            <ul className="space-y-2 mb-3">
              {soluciones.map((s) => (
                <li key={s.slug} className="text-sm">
                  <strong>{s.nombre}</strong> — {s.descripcion}
                </li>
              ))}
            </ul>
          )}
          <MatchingDisclaimer />
        </div>

        {leadResult && !leadResult.saved && (
          <p className="text-xs text-amber-600 bg-amber-50 border border-amber-200 rounded-md p-3 mb-4">
            Tus respuestas no se guardaron en un sistema todavía (no hay backend
            de leads configurado en este ambiente). Escríbenos por WhatsApp
            para que no se pierdan.
          </p>
        )}

        {fondoRelacionado && (
          <div className="bg-white border border-gray-200 rounded-xl p-5 mb-4">
            <h2 className="font-semibold text-brand-dark mb-1">Fondo relacionado</h2>
            <p className="text-sm text-gray-700">
              Este diagnóstico se originó desde el fondo{" "}
              <Link to={`/fondos/${fondoRelacionado}`} className="text-brand font-medium">
                {fondoRelacionado}
              </Link>
              .
            </p>
          </div>
        )}

        <div className="bg-brand text-white rounded-xl p-6 text-center">
          <p className="mb-3 font-medium">Próximo paso: conversemos sobre tu proyecto.</p>
          <a
            href={`https://wa.me/?text=${encodeURIComponent(
              fondoRelacionado ? fundWhatsAppMessage(fondoRelacionado) : "Hola, quiero evaluar un proyecto con 0km."
            )}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block bg-white text-brand font-semibold px-5 py-2.5 rounded-lg hover:bg-brand-light transition"
          >
            Escribir por WhatsApp
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-xl mx-auto px-4 py-10">
      <h1 className="text-2xl font-bold text-brand-dark mb-2">Diagnóstico de tu proyecto</h1>
      <p className="text-sm text-gray-500 mb-8">
        Paso {step + 1} de {STEPS.length}
      </p>

      <form onSubmit={step === STEPS.length - 1 ? submit : (e) => { e.preventDefault(); next(); }}>
        {step === 0 && (
          <Step label="¿Qué tipo de proyecto tienes?">
            <select value={form.tipo} onChange={update("tipo")} required className="input">
              <option value="">Selecciona una categoría</option>
              {CATEGORIAS.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </Step>
        )}

        {step === 1 && (
          <Step label="¿En qué etapa estás?">
            <select value={form.etapa} onChange={update("etapa")} required className="input">
              <option value="">Selecciona una etapa</option>
              {ETAPAS.map((e) => (
                <option key={e} value={e}>{e}</option>
              ))}
            </select>
          </Step>
        )}

        {step === 2 && (
          <Step label="¿Qué quieres mejorar?">
            <textarea value={form.mejorar} onChange={update("mejorar")} required className="input" rows={3} />
          </Step>
        )}

        {step === 3 && (
          <Step label="¿Qué problema tienes?">
            <textarea value={form.problema} onChange={update("problema")} required className="input" rows={3} />
          </Step>
        )}

        {step === 4 && (
          <Step label="¿Qué recursos tienes?">
            <textarea value={form.recursos} onChange={update("recursos")} required className="input" rows={3} />
          </Step>
        )}

        {step === 5 && (
          <Step label="Datos de contacto">
            <input value={form.nombre} onChange={update("nombre")} required placeholder="Nombre" className="input mb-2" />
            <input value={form.email} onChange={update("email")} required type="email" placeholder="Email" className="input mb-2" />
            <input value={form.whatsapp} onChange={update("whatsapp")} placeholder="WhatsApp (opcional)" className="input" />
          </Step>
        )}

        <div className="flex justify-between mt-8">
          <button type="button" onClick={back} disabled={step === 0} className="text-sm text-gray-500 disabled:opacity-0">
            Atrás
          </button>
          <button
            type="submit"
            disabled={submitting}
            className="bg-brand text-white font-medium px-5 py-2.5 rounded-lg hover:bg-brand-dark transition disabled:opacity-60"
          >
            {step === STEPS.length - 1 ? (submitting ? "Guardando…" : "Ver resultado") : "Siguiente"}
          </button>
        </div>
      </form>
    </div>
  );
}

function Step({ label, children }) {
  return (
    <div>
      <label className="block font-medium text-brand-dark mb-2">{label}</label>
      {children}
    </div>
  );
}
