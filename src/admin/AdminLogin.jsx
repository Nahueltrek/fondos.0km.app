import { useState } from "react";
import { Navigate, useLocation, useNavigate } from "react-router-dom";
import { useAdminAuth } from "./AuthContext";
import { AdminApiError } from "../lib/adminApi";

export default function AdminLogin() {
  const { user, login } = useAdminAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  if (user) {
    const from = location.state?.from ?? "/admin";
    return <Navigate to={from} replace />;
  }

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      await login(email, password);
      navigate(location.state?.from ?? "/admin", { replace: true });
    } catch (err) {
      if (err instanceof AdminApiError && err.status === 422) {
        setError("Credenciales incorrectas.");
      } else if (err instanceof AdminApiError && err.status === 0) {
        setError(err.message);
      } else {
        setError("No se pudo iniciar sesión. Intenta de nuevo.");
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-950 px-4">
      <form onSubmit={submit} className="w-full max-w-sm bg-slate-900 border border-slate-800 rounded-xl p-6">
        <h1 className="text-xl font-bold text-white mb-1">
          fondos<span className="text-brand-accent">.0km</span>.app
        </h1>
        <p className="text-sm text-slate-500 mb-6">Panel de administración</p>

        {error && (
          <p className="text-xs text-red-400 bg-red-950/40 border border-red-800/40 rounded-md p-3 mb-4">
            {error}
          </p>
        )}

        <label className="block text-sm text-slate-300 mb-1" htmlFor="email">Email</label>
        <input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          autoFocus
          className="input mb-4"
        />

        <label className="block text-sm text-slate-300 mb-1" htmlFor="password">Contraseña</label>
        <input
          id="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="input mb-6"
        />

        <button
          type="submit"
          disabled={submitting}
          className="w-full bg-brand text-slate-900 font-medium px-5 py-2.5 rounded-lg hover:bg-brand-dark transition disabled:opacity-60"
        >
          {submitting ? "Ingresando…" : "Ingresar"}
        </button>
      </form>
    </div>
  );
}
