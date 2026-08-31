import { useEffect, useMemo, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Landmark, MapPin, Tags, ShieldCheck, Sparkles, ArrowRight } from "lucide-react";
import SearchBar from "../components/SearchBar";
import FundCard from "../components/FundCard";
import StatCard from "../components/StatCard";
import { CATEGORIAS } from "../data/categorias";
import { fetchFondos } from "../lib/api";

export default function Home() {
  useEffect(() => {
    document.title = "fondos.0km.app — Encuentra la oportunidad para hacer crecer tu proyecto";
  }, []);
  const [query, setQuery] = useState("");
  const [heroVisible, setHeroVisible] = useState(false);
  const [fondos, setFondos] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const t = setTimeout(() => setHeroVisible(true), 60);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    fetchFondos().then(setFondos);
  }, []);

  const goToSearch = (e) => {
    e.preventDefault();
    navigate(query ? `/fondos?q=${encodeURIComponent(query)}` : "/fondos");
  };

  // Estadísticas reales, derivadas de los fondos que ya devuelve la API
  // pública (solo verificados). Nunca se muestra un número fijo/inventado
  // — sección 9/Regla 9 del Master Plan.
  const stats = useMemo(() => {
    const instituciones = new Set(fondos.map((f) => f.institution).filter(Boolean));
    const regiones = new Set(fondos.flatMap((f) => f.regions ?? []));
    const categorias = new Set(fondos.flatMap((f) => f.categories ?? []));
    return [
      { icon: ShieldCheck, value: fondos.length, label: "Fondos verificados" },
      { icon: Landmark, value: instituciones.size, label: "Instituciones" },
      { icon: MapPin, value: regiones.size, label: "Regiones cubiertas" },
      { icon: Tags, value: categorias.size, label: "Categorías cubiertas" },
    ];
  }, [fondos]);

  const destacados = fondos.slice(0, 3);

  return (
    <div>
      <section className="bg-gradient-to-b from-brand-light to-slate-950">
        <div className="max-w-3xl mx-auto px-4 pt-16 pb-14 text-center">
          <span
            className="inline-flex items-center gap-1.5 text-xs font-semibold tracking-wide text-brand bg-slate-900 border border-brand/20 rounded-full px-3 py-1.5 mb-4 transition-all duration-500"
            style={{
              opacity: heroVisible ? 1 : 0,
              transform: heroVisible ? "translateY(0)" : "translateY(6px)",
            }}
          >
            <Sparkles size={13} />
            FONDOS + PROYECTOS + TECNOLOGÍA
          </span>
          <h1
            className="text-3xl sm:text-4xl font-bold text-white leading-tight mb-4 transition-all duration-500"
            style={{
              opacity: heroVisible ? 1 : 0,
              transform: heroVisible ? "translateY(0)" : "translateY(8px)",
              transitionDelay: "80ms",
            }}
          >
            Encuentra la oportunidad para hacer crecer tu proyecto.
          </h1>
          <p
            className="text-slate-400 mb-8 transition-all duration-500"
            style={{
              opacity: heroVisible ? 1 : 0,
              transform: heroVisible ? "translateY(0)" : "translateY(8px)",
              transitionDelay: "140ms",
            }}
          >
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
                className="text-xs bg-slate-900 border border-slate-800 hover:border-brand text-slate-300 px-3.5 py-2 rounded-full transition"
              >
                {c}
              </Link>
            ))}
          </div>

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              to="/diagnostico"
              className="bg-brand hover:bg-brand-dark text-slate-900 font-medium px-6 py-3 rounded-2xl transition"
            >
              Evaluar mi proyecto
            </Link>
            <Link
              to="/fondos"
              className="bg-slate-900 border border-slate-800 hover:border-brand text-white font-medium px-6 py-3 rounded-2xl transition"
            >
              Explorar fondos
            </Link>
          </div>
        </div>
      </section>

      <section className="max-w-3xl mx-auto px-4 py-10">
        <div className="flex items-center gap-1.5 mb-3">
          <ShieldCheck size={14} className="text-brand" />
          <span className="text-xs text-slate-500">
            Datos verificados por curadores 0km
          </span>
        </div>
        <div className="grid grid-cols-2 gap-3 mb-12">
          {stats.map((s) => (
            <StatCard key={s.label} icon={s.icon} value={s.value} label={s.label} />
          ))}
        </div>

        {destacados.length > 0 && (
          <>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-white">Fondos destacados</h2>
              <Link to="/fondos" className="text-sm text-brand flex items-center gap-1">
                Ver todos <ArrowRight size={13} />
              </Link>
            </div>
            <div className="grid sm:grid-cols-2 gap-3 mb-12">
              {destacados.map((f) => (
                <FundCard key={f.slug} fondo={f} />
              ))}
            </div>
          </>
        )}

        <Link
          to="/checklist"
          className="block bg-slate-900 border border-slate-800 rounded-xl p-5 hover:border-brand transition text-center"
        >
          <p className="font-semibold text-white mb-1">
            Checklist de digitalización para emprendedores →
          </p>
          <p className="text-sm text-slate-400">
            13 preguntas gratis para saber en qué etapa está tu negocio.
          </p>
        </Link>
      </section>
    </div>
  );
}
