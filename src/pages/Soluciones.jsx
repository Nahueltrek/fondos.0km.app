import { useEffect } from "react";
import { Link } from "react-router-dom";
import { SOLUCIONES } from "../data/soluciones";
import { PACKS } from "../data/packs";
import { track } from "../lib/analytics";
import { useDocumentTitle } from "../lib/useDocumentTitle";

export default function Soluciones() {
  useDocumentTitle("Soluciones 0km");
  useEffect(() => {
    track("solution_viewed", { page: "soluciones" });
  }, []);

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <h1 className="text-2xl font-bold text-white mb-2">Soluciones 0km</h1>
      <p className="text-slate-400 mb-8">
        Soluciones digitales que pueden acompañar el proyecto que financies.
      </p>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
        {SOLUCIONES.map((s) => (
          <div key={s.slug} className="bg-slate-900 border border-slate-800 rounded-xl p-5">
            <h3 className="font-semibold text-white mb-1">{s.nombre}</h3>
            <p className="text-sm text-slate-400 mb-3">{s.descripcion}</p>
            <div className="flex flex-wrap gap-1.5">
              {s.categorias.map((c) => (
                <span key={c} className="text-xs bg-brand-light text-brand px-2 py-0.5 rounded-full">
                  {c}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>

      <Link
        to="/soluciones/turismo"
        className="block bg-brand-light border border-brand/20 rounded-xl p-5 mb-10 hover:border-brand transition"
      >
        <h3 className="font-semibold text-white mb-1">Digitaliza tu experiencia turística →</h3>
        <p className="text-sm text-slate-300">
          Vertical dedicada para operadores, guías, alojamientos y agencias.
        </p>
      </Link>

      <h2 className="text-xl font-bold text-white mb-4">Packs</h2>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {PACKS.map((p) => (
          <div key={p.slug} className="bg-slate-900 border border-slate-800 rounded-xl p-5">
            <h3 className="font-semibold text-white mb-1">{p.nombre}</h3>
            <p className="text-sm text-slate-400 mb-3">{p.descripcion}</p>
            <ul className="text-sm text-slate-300 list-disc list-inside mb-2">
              {p.incluye.map((i) => <li key={i}>{i}</li>)}
            </ul>
            <p className="text-xs text-slate-500">
              {p.precio ?? "Precio a definir según proyecto"}
            </p>
          </div>
        ))}
      </div>

      <div className="mt-10 bg-brand text-slate-900 rounded-xl p-6 text-center">
        <p className="mb-3 font-medium">¿No sabes qué solución necesita tu proyecto?</p>
        <Link
          to="/diagnostico"
          className="inline-block bg-slate-950 text-brand font-semibold px-5 py-2.5 rounded-lg hover:bg-brand-light transition"
        >
          Diseñar mi proyecto
        </Link>
      </div>
    </div>
  );
}
