import { Link, NavLink } from "react-router-dom";

const NAV = [
  { to: "/fondos", label: "Fondos" },
  { to: "/diagnostico", label: "Diagnóstico" },
  { to: "/soluciones", label: "Soluciones" },
  { to: "/blog", label: "Blog" },
];

export default function Header() {
  return (
    <header className="border-b border-slate-800 bg-slate-950 sticky top-0 z-40">
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
        <Link to="/" className="font-bold text-white text-lg">
          fondos<span className="text-brand-accent">.0km</span>.app
        </Link>
        <nav className="hidden sm:flex items-center gap-6 text-sm font-medium">
          {NAV.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                isActive ? "text-brand" : "text-slate-400 hover:text-brand"
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>
        <Link
          to="/diagnostico"
          className="bg-brand text-slate-900 text-sm font-medium px-4 py-2 rounded-lg hover:bg-brand-dark transition"
        >
          Evaluar mi proyecto
        </Link>
      </div>
    </header>
  );
}
