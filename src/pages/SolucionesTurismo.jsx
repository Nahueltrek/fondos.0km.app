import { Link } from "react-router-dom";
import { useDocumentTitle } from "../lib/useDocumentTitle";

// Master Plan, sección 23.
const ITEMS = [
  "Sitio web",
  "Experiencias",
  "Reservas",
  "Calendario",
  "Mapa",
  "Pagos",
  "WhatsApp",
  "SEO",
  "Blog",
  "CRM",
];

export default function SolucionesTurismo() {
  useDocumentTitle("Turismo Digital");
  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      <span className="inline-block text-xs font-semibold tracking-wide text-brand bg-brand-light rounded-full px-3 py-1 mb-4">
        TURISMO DIGITAL
      </span>
      <h1 className="text-2xl sm:text-3xl font-bold text-brand-dark mb-3">
        Digitaliza tu experiencia turística.
      </h1>
      <p className="text-gray-600 mb-8">
        Para operadores, guías, alojamientos, agencias y experiencias de
        turismo rural o de aventura.
      </p>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-10">
        {ITEMS.map((item) => (
          <div
            key={item}
            className="bg-white border border-gray-200 rounded-lg px-4 py-3 text-sm font-medium text-brand-dark text-center"
          >
            {item}
          </div>
        ))}
      </div>

      <div className="bg-brand text-white rounded-xl p-6 text-center">
        <p className="mb-3 font-medium">¿Tienes un proyecto turístico y quieres evaluarlo?</p>
        <Link
          to="/diagnostico"
          className="inline-block bg-white text-brand font-semibold px-5 py-2.5 rounded-lg hover:bg-brand-light transition"
        >
          Evaluar mi proyecto
        </Link>
      </div>
    </div>
  );
}
