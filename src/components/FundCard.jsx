import { Link } from "react-router-dom";
import { MapPin, Building2 } from "lucide-react";
import FundStatusBadge from "./FundStatusBadge";

export default function FundCard({ fondo }) {
  return (
    <Link
      to={`/fondos/${fondo.slug}`}
      className="block bg-slate-900 border border-slate-800 rounded-xl p-5 hover:border-brand hover:shadow-md hover:shadow-brand/10 transition"
    >
      <div className="flex items-start justify-between gap-2 mb-2">
        <h3 className="font-semibold text-white leading-snug">{fondo.name}</h3>
        <FundStatusBadge status={fondo.status} />
      </div>
      <p className="text-sm text-slate-400 flex items-center gap-1 mb-1">
        <Building2 size={14} /> {fondo.institution}
      </p>
      {fondo.regions?.length > 0 && (
        <p className="text-sm text-slate-500 flex items-center gap-1 mb-2">
          <MapPin size={14} /> {fondo.regions.join(", ")}
        </p>
      )}
      <p className="text-sm text-slate-300 line-clamp-2">{fondo.description}</p>
      <div className="flex flex-wrap gap-1.5 mt-3">
        {fondo.categories?.map((cat) => (
          <span key={cat} className="text-xs bg-brand-light text-brand px-2 py-0.5 rounded-full">
            {cat}
          </span>
        ))}
      </div>
    </Link>
  );
}
