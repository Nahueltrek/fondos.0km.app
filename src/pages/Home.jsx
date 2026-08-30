import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import SearchBar from "../components/SearchBar";
import { CATEGORIAS } from "../data/categorias";

export default function Home() {
  useEffect(() => {
    document.title = "fondos.0km.app — Encuentra la oportunidad para hacer crecer tu proyecto";
  }, []);
  const [query, setQuery] = useState("");
  const navigate = useNavigate();

  const goToSearch = (e) => {
    e.preventDefault();
    navigate(query ? `/fondos?q=${encodeURIComponent(query)}` : "/fondos");
  };

  return (
    <div>
      <section className="bg-gradient-to-b from-brand-light to-white">
        <div className="max-w-3xl mx-auto px-4 pt-16 pb-14 text-center">
          <span className="inline-block text-xs font-semibold tracking-wide text-brand bg-white border border-brand/20 rounded-full px-3 py-1 mb-4">
            FONDOS + PROYECTOS + TECNOLOGÍA
          </span>
          <h1 className="text-3xl sm:text-4xl font-bold text-brand-dark leading-tight mb-4">
            Encuentra la oportunidad para hacer crecer tu proyecto.
          </h1>
          <p className="text-gray-600 mb-8">
            Explora fondos y oportunidades de financiamiento, descubre qué
            necesita tu negocio y encuentra soluciones para convertir tu
            idea en un proyecto real.
          </p>

          <form onSubmit={goToSearch} className="mb-4">
            <SearchBar value={query} onChange={setQuery} />
          </form>

          <div className="flex flex-wrap justify-center gap-2 mb-8">
            {CATEGORIAS.slice(0, 6).map((c) => (
              <Link
                key={c}
                to={`/fondos?categoria=${encodeURIComponent(c)}`}
                className="text-xs bg-white border border-gray-200 hover:border-brand text-gray-700 px-3 py-1.5 rounded-full transition"
              >
                {c}
              </Link>
            ))}
          </div>

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              to="/fondos"
              className="bg-brand hover:bg-brand-dark text-white font-medium px-6 py-3 rounded-xl transition"
            >
              Explorar oportunidades
            </Link>
            <Link
              to="/diagnostico"
              className="bg-white border border-brand text-brand font-medium px-6 py-3 rounded-xl hover:bg-brand-light transition"
            >
              Evaluar mi proyecto
            </Link>
          </div>
        </div>
      </section>

      <section className="max-w-3xl mx-auto px-4 py-10">
        <Link
          to="/checklist"
          className="block bg-white border border-gray-200 rounded-xl p-5 hover:border-brand transition text-center"
        >
          <p className="font-semibold text-brand-dark mb-1">
            Checklist de digitalización para emprendedores →
          </p>
          <p className="text-sm text-gray-600">
            13 preguntas gratis para saber en qué etapa está tu negocio.
          </p>
        </Link>
      </section>
    </div>
  );
}
