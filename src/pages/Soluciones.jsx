import { Link } from "react-router-dom";
import { SOLUCIONES } from "../data/soluciones";

export default function Soluciones() {
  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <h1 className="text-2xl font-bold text-brand-dark mb-2">Soluciones 0km</h1>
      <p className="text-gray-600 mb-8">
        Soluciones digitales que pueden acompañar el proyecto que financies.
      </p>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {SOLUCIONES.map((s) => (
          <div key={s.slug} className="bg-white border border-gray-200 rounded-xl p-5">
            <h3 className="font-semibold text-brand-dark mb-1">{s.nombre}</h3>
            <p className="text-sm text-gray-600 mb-3">{s.descripcion}</p>
            <div className="flex flex-wrap gap-1.5">
              {s.categorias.map((c) => (
                <span key={c} className="text-xs bg-brand-light text-brand-dark px-2 py-0.5 rounded-full">
                  {c}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-10 bg-brand text-white rounded-xl p-6 text-center">
        <p className="mb-3 font-medium">¿No sabes qué solución necesita tu proyecto?</p>
        <Link
          to="/diagnostico"
          className="inline-block bg-white text-brand font-semibold px-5 py-2.5 rounded-lg hover:bg-brand-light transition"
        >
          Diseñar mi proyecto
        </Link>
      </div>
    </div>
  );
}
