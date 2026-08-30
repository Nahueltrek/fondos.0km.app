import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { useAdminAuth, canManageFunds, canManageLeads } from "./AuthContext";

const navClass = ({ isActive }) =>
  `px-3 py-2 rounded-lg text-sm font-medium transition ${
    isActive ? "bg-brand text-slate-900" : "text-slate-400 hover:text-white hover:bg-slate-800"
  }`;

export default function AdminLayout() {
  const { user, logout } = useAdminAuth();
  const navigate = useNavigate();

  const doLogout = async () => {
    await logout();
    navigate("/admin/login", { replace: true });
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-300 flex">
      <aside className="w-56 shrink-0 border-r border-slate-800 flex flex-col">
        <div className="h-16 flex items-center px-4 border-b border-slate-800">
          <span className="font-bold text-white text-lg">
            fondos<span className="text-brand-accent">.0km</span>.app
          </span>
        </div>
        <nav className="flex-1 p-3 space-y-1">
          <NavLink to="/admin" end className={navClass}>Dashboard</NavLink>
          {canManageFunds(user) && (
            <NavLink to="/admin/fondos" className={navClass}>Fondos</NavLink>
          )}
          {canManageLeads(user) && (
            <NavLink to="/admin/leads" className={navClass}>Leads</NavLink>
          )}
        </nav>
        <div className="p-3 border-t border-slate-800">
          <p className="text-xs text-slate-500 mb-2 truncate">
            {user?.name} · {user?.role}
          </p>
          <button
            onClick={doLogout}
            className="w-full text-sm text-slate-400 hover:text-white border border-slate-800 rounded-lg px-3 py-2 transition"
          >
            Cerrar sesión
          </button>
        </div>
      </aside>
      <main className="flex-1 p-6 overflow-x-auto">
        <Outlet />
      </main>
    </div>
  );
}
