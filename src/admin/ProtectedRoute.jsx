import { Navigate, useLocation } from "react-router-dom";
import { useAdminAuth } from "./AuthContext";

export default function ProtectedRoute({ children }) {
  const { user, loading } = useAdminAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-950 text-slate-500 text-sm">
        Cargando…
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/admin/login" state={{ from: location.pathname }} replace />;
  }

  return children;
}
