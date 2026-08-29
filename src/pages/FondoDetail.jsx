import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Building2, MapPin, Calendar, ExternalLink } from "lucide-react";
import FundStatusBadge from "../components/FundStatusBadge";
import DisclaimerBanner from "../components/DisclaimerBanner";
import { fetchFondoBySlug } from "../lib/api";

export default function FondoDetail() {
  const { slug } = useParams();
  const [fondo, setFondo] = useState(undefined); // undefined = cargando, null = no existe

  useEffect(() => {
    fetchFondoBySlug(slug).then(setFondo);
  }, [slug]);

  if (fondo === undefined) {
    return <p className="max-w-3xl mx-auto px-4 py-10 text-gray-500">Cargando…</p>;
  }

  if (fondo === null) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-10">
        <p className="text-gray-600">No encontramos este fondo.</p>
        <Link to="/fondos" className="text-brand font-medium">Volver al explorador</Link>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      <div className="flex items-start justify-between gap-3 mb-3">
        <h1 className="text-2xl font-bold text-brand-dark">{fondo.name}</h1>
        <FundStatusBadge status={fondo.status} />
      </div>

      <p className="text-gray-600 flex items-center gap-1 mb-1">
        <Building2 size={16} /> {fondo.institution}
      </p>
      {fondo.regions?.length > 0 && (
        <p className="text-gray-600 flex items-center gap-1 mb-6">
          <MapPin size={16} /> {fondo.regions.join(", ")}
        </p>
      )}

      <div className="space-y-6">
        <section>
          <h2 className="font-semibold text-brand-dark mb-1">¿De qué se trata?</h2>
          <p className="text-gray-700 text-sm">{fondo.description}</p>
        </section>

        <section>
          <h2 className="font-semibold text-brand-dark mb-1">¿Quiénes pueden postular?</h2>
          <p className="text-gray-700 text-sm">{fondo.beneficiaries}</p>
        </section>

        <section>
          <h2 className="font-semibold text-brand-dark mb-1">¿Cuánto financia?</h2>
          <p className="text-gray-700 text-sm">
            {fondo.amount} {fondo.cofinancing ? `· Cofinanciamiento: ${fondo.cofinancing}` : ""}
          </p>
        </section>

        <section>
          <h2 className="font-semibold text-brand-dark mb-1">¿Qué tipo de proyecto busca?</h2>
          <div className="flex flex-wrap gap-1.5">
            {fondo.categories?.map((c) => (
              <span key={c} className="text-xs bg-brand-light text-brand-dark px-2 py-0.5 rounded-full">
                {c}
              </span>
            ))}
          </div>
        </section>

        {(fondo.application_start || fondo.application_end) && (
          <section>
            <h2 className="font-semibold text-brand-dark mb-1 flex items-center gap-1">
              <Calendar size={16} /> Fechas
            </h2>
            <p className="text-gray-700 text-sm">
              {fondo.application_start ?? "?"} — {fondo.application_end ?? "?"}
            </p>
          </section>
        )}

        {fondo.official_url && (
          <section>
            <h2 className="font-semibold text-brand-dark mb-1">Información oficial</h2>
            <a
              href={fondo.official_url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-brand text-sm font-medium flex items-center gap-1"
            >
              Ver bases oficiales <ExternalLink size={14} />
            </a>
          </section>
        )}
      </div>

      <DisclaimerBanner compact />

      <div className="mt-8 bg-brand text-white rounded-xl p-6 text-center">
        <p className="mb-3 font-medium">¿Quieres convertir esta oportunidad en un proyecto?</p>
        <Link
          to={`/diagnostico?fondo=${fondo.slug}`}
          className="inline-block bg-white text-brand font-semibold px-5 py-2.5 rounded-lg hover:bg-brand-light transition"
        >
          Evaluar mi proyecto
        </Link>
      </div>
    </div>
  );
}
