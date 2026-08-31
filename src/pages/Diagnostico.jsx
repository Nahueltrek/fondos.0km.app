import { useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import {
  Lightbulb, FileText, Trophy, Hammer, TrendingUp,
  Rocket, Cpu, Zap, MountainSnow, ShoppingBag, Wheat, Leaf, Recycle,
  Megaphone, Laptop, Palette, Users, Check, ChevronLeft,
} from "lucide-react";
import { CATEGORIAS } from "../data/categorias";
import { SOLUCIONES } from "../data/soluciones";
import MatchingDisclaimer from "../components/MatchingDisclaimer";
import { fundWhatsAppMessage } from "../components/WhatsAppButton";
import { createLead } from "../lib/api";
import { track } from "../lib/analytics";
import { useDocumentTitle } from "../lib/useDocumentTitle";

const ETAPAS = [
  { label: "Idea", desc: "Todavía no arranca", icon: Lightbulb },
  { label: "Postulación", desc: "Preparando una postulación", icon: FileText },
  { label: "Fondo adjudicado", desc: "Ya tienes financiamiento", icon: Trophy },
  { label: "Ejecución", desc: "Desarrollando el proyecto", icon: Hammer },
  { label: "Negocio funcionando", desc: "Ya estás operando", icon: TrendingUp },
];

const CATEGORIA_ICONS = {
  Emprendimiento: Rocket,
  Digitalización: Cpu,
  Innovación: Zap,
  Turismo: MountainSnow,
  Comercio: ShoppingBag,
  Agricultura: Wheat,
  Sostenibilidad: Leaf,
  "Economía Circular": Recycle,
  Marketing: Megaphone,
  Tecnología: Laptop,
  Cultura: Palette,
  Organizaciones: Users,
};

// "perfil" reemplaza los antiguos pasos separados "tipo" y "etapa": misma
// información, un paso menos y selección por tarjetas en vez de <select>.
const STEPS = ["perfil", "mejorar", "problema", "recursos", "contacto"];

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

function SelectableCard({ icon: Icon, label, desc, compact, selected, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`relative text-left rounded-2xl border transition-all duration-150 ${
        compact ? "p-3.5 flex flex-col gap-2.5" : "p-4 flex items-center gap-3.5"
      } ${
        selected
          ? "bg-brand-light border-brand"
          : "bg-slate-900 border-slate-800 hover:border-slate-700"
      }`}
    >
      <div
        className={`shrink-0 rounded-xl flex items-center justify-center transition-colors ${
          compact ? "w-9 h-9" : "w-11 h-11"
        } ${selected ? "bg-brand text-slate-900" : "bg-slate-800 text-brand"}`}
      >
        <Icon size={compact ? 17 : 20} strokeWidth={2} />
      </div>
      <div className="flex-1 min-w-0">
        <div className={`font-medium text-white ${compact ? "text-[13px] leading-snug" : "text-[15px]"}`}>
          {label}
        </div>
        {desc && !compact && <div className="text-[13px] text-slate-500 mt-0.5">{desc}</div>}
      </div>
      {!compact && (
        <div
          className={`shrink-0 w-5 h-5 rounded-full border flex items-center justify-center ${
            selected ? "bg-brand border-brand" : "border-slate-700"
          }`}
        >
          {selected && <Check size={12} strokeWidth={3} className="text-slate-900" />}
        </div>
      )}
      {compact && selected && (
        <div className="absolute top-2.5 right-2.5 w-4 h-4 rounded-full bg-brand flex items-center justify-center">
          <Check size={10} strokeWidth={3} className="text-slate-900" />
        </div>
      )}
    </button>
  );
}

export default function Diagnostico() {
  useDocumentTitle("Diagnóstico de tu proyecto");
  const [searchParams] = useSearchParams();
  const fondoRelacionado = searchParams.get("fondo");
  const [step, setStep] = useState(0);
  const [form, setForm] = useState(initialForm);
  const [done, setDone] = useState(false);
  const [leadResult, setLeadResult] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const update = (key) => (e) => setForm({ ...form, [key]: e.target.value });
  const set = (key) => (value) => setForm({ ...form, [key]: value });

  const canAdvance = step !== 0 || (!!form.tipo && !!form.etapa);

  const next = () => {
    if (step === 0) track("diagnostic_started", { tipo: form.tipo });
    setStep((s) => Math.min(s + 1, STEPS.length - 1));
  };
  const back = () => setStep((s) => Math.max(s - 1, 0));

  const submit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    const result = await createLead({
      name: form.nombre,
      email: form.email,
      phone: form.whatsapp || null,
      business_type: form.tipo,
      fund_status: form.etapa,
      needs: form.mejorar,
      problem: form.problema,
      budget: form.recursos,
      source: "diagnostic",
      fund_slug: fondoRelacionado || null,
    });

    setLeadResult(result);
    track("diagnostic_completed", { tipo: form.tipo });
    setSubmitting(false);
    setDone(true);
  };

  if (done) {
    const soluciones = solucionesRecomendadas(form);
    return (
      <div className="max-w-2xl mx-auto px-4 py-10">
        <h1 className="text-2xl font-bold text-white mb-6">Tu diagnóstico</h1>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 mb-4">
          <h2 className="font-semibold text-white mb-1">Perfil del proyecto</h2>
          <p className="text-sm text-slate-300">
            Tipo: {form.tipo || "—"} · Etapa: {form.etapa || "—"}
          </p>
          <p className="text-sm text-slate-300 mt-1">
            Nivel de digitalización estimado:{" "}
            <strong>{nivelDigitalizacion(form)}</strong>
          </p>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 mb-4">
          <h2 className="font-semibold text-white mb-2">Soluciones recomendadas</h2>
          {soluciones.length === 0 ? (
            <p className="text-sm text-slate-500">
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
          <p className="text-xs text-amber-400 bg-amber-950/40 border border-amber-800/40 rounded-md p-3 mb-4">
            Tus respuestas no se guardaron en un sistema todavía (no hay backend
            de leads configurado en este ambiente). Escríbenos por WhatsApp
            para que no se pierdan.
          </p>
        )}

        {fondoRelacionado && (
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 mb-4">
            <h2 className="font-semibold text-white mb-1">Fondo relacionado</h2>
            <p className="text-sm text-slate-300">
              Este diagnóstico se originó desde el fondo{" "}
              <Link to={`/fondos/${fondoRelacionado}`} className="text-brand font-medium">
                {fondoRelacionado}
              </Link>
              .
            </p>
          </div>
        )}

        <div className="bg-brand text-slate-900 rounded-xl p-6 text-center">
          <p className="mb-3 font-medium">Próximo paso: conversemos sobre tu proyecto.</p>
          <a
            href={`https://wa.me/?text=${encodeURIComponent(
              fondoRelacionado ? fundWhatsAppMessage(fondoRelacionado) : "Hola, quiero evaluar un proyecto con 0km."
            )}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block bg-slate-950 text-brand font-semibold px-5 py-2.5 rounded-lg hover:bg-brand-light transition"
          >
            Escribir por WhatsApp
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-xl mx-auto px-4 py-10">
      {/* Progreso */}
      <div className="flex items-center gap-2 mb-6">
        {step > 0 ? (
          <button
            type="button"
            onClick={back}
            aria-label="Volver"
            className="w-9 h-9 -ml-1 rounded-full flex items-center justify-center text-slate-400 hover:text-white hover:bg-slate-900 transition-colors"
          >
            <ChevronLeft size={20} />
          </button>
        ) : (
          <div className="w-9" />
        )}
        <div className="flex-1 flex gap-1.5">
          {STEPS.map((s, i) => (
            <div
              key={s}
              className={`h-1 flex-1 rounded-full transition-colors duration-300 ${
                i <= step ? "bg-brand" : "bg-slate-800"
              }`}
            />
          ))}
        </div>
        <span className="text-xs text-slate-500 tabular-nums w-10 text-right">
          {step + 1}/{STEPS.length}
        </span>
      </div>

      <form onSubmit={step === STEPS.length - 1 ? submit : (e) => { e.preventDefault(); next(); }}>
        {step === 0 && (
          <div>
            <h1 className="text-xl font-semibold text-white mb-1">Cuéntanos de tu proyecto</h1>
            <p className="text-sm text-slate-500 mb-6">Elige el tipo y la etapa en la que estás.</p>

            <p className="text-sm font-medium text-slate-300 mb-2.5">¿Qué tipo de proyecto tienes?</p>
            <div className="grid grid-cols-2 gap-2.5 mb-7">
              {CATEGORIAS.map((c) => (
                <SelectableCard
                  key={c}
                  icon={CATEGORIA_ICONS[c] ?? Rocket}
                  label={c}
                  compact
                  selected={form.tipo === c}
                  onClick={() => set("tipo")(c)}
                />
              ))}
            </div>

            <p className="text-sm font-medium text-slate-300 mb-2.5">¿En qué etapa estás?</p>
            <div className="flex flex-col gap-2.5">
              {ETAPAS.map((e) => (
                <SelectableCard
                  key={e.label}
                  icon={e.icon}
                  label={e.label}
                  desc={e.desc}
                  selected={form.etapa === e.label}
                  onClick={() => set("etapa")(e.label)}
                />
              ))}
            </div>
          </div>
        )}

        {step === 1 && (
          <Step label="¿Qué quieres mejorar?">
            <textarea value={form.mejorar} onChange={update("mejorar")} required className="input" rows={3} />
          </Step>
        )}

        {step === 2 && (
          <Step label="¿Qué problema tienes?">
            <textarea value={form.problema} onChange={update("problema")} required className="input" rows={3} />
          </Step>
        )}

        {step === 3 && (
          <Step label="¿Qué recursos tienes?">
            <textarea value={form.recursos} onChange={update("recursos")} required className="input" rows={3} />
          </Step>
        )}

        {step === 4 && (
          <Step label="Datos de contacto">
            <input value={form.nombre} onChange={update("nombre")} required placeholder="Nombre" className="input mb-2" />
            <input value={form.email} onChange={update("email")} required type="email" placeholder="Email" className="input mb-2" />
            <input value={form.whatsapp} onChange={update("whatsapp")} placeholder="WhatsApp (opcional)" className="input" />
          </Step>
        )}

        <button
          type="submit"
          disabled={submitting || !canAdvance}
          className="w-full mt-8 bg-brand text-slate-900 font-medium py-3.5 rounded-2xl hover:bg-brand-dark transition disabled:opacity-40 disabled:cursor-not-allowed"
        >
          {step === STEPS.length - 1 ? (submitting ? "Guardando…" : "Ver resultado") : "Continuar"}
        </button>
      </form>
    </div>
  );
}

function Step({ label, children }) {
  return (
    <div>
      <label className="block font-medium text-white mb-2">{label}</label>
      {children}
    </div>
  );
}
