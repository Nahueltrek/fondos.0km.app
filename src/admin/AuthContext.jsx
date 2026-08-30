import { createContext, useCallback, useContext, useEffect, useState } from "react";
import {
  adminLogin as apiAdminLogin,
  adminLogout as apiAdminLogout,
  clearAdminToken,
  fetchMe,
  getAdminToken,
  setAdminToken,
} from "../lib/adminApi";

const AdminAuthContext = createContext(null);

export function AdminAuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!getAdminToken()) {
      setLoading(false);
      return;
    }
    fetchMe()
      .then(setUser)
      .catch(() => {
        clearAdminToken();
        setUser(null);
      })
      .finally(() => setLoading(false));
  }, []);

  const login = useCallback(async (email, password) => {
    const data = await apiAdminLogin(email, password);
    setAdminToken(data.token);
    setUser(data.user);
    return data.user;
  }, []);

  const logout = useCallback(async () => {
    try {
      await apiAdminLogout();
    } catch {
      // El token puede ya estar vencido/inválido — igual limpiamos localmente.
    }
    clearAdminToken();
    setUser(null);
  }, []);

  return (
    <AdminAuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AdminAuthContext.Provider>
  );
}

export function useAdminAuth() {
  const ctx = useContext(AdminAuthContext);
  if (!ctx) throw new Error("useAdminAuth debe usarse dentro de AdminAuthProvider");
  return ctx;
}

// Sección 60: mismos grupos de roles que el backend (User::isFundManager /
// isLeadManager) — solo para mostrar/ocultar nav; la autorización real
// siempre la decide la API.
const FUND_MANAGER_ROLES = ["curador", "administrador", "super_admin"];
const LEAD_MANAGER_ROLES = ["comercial", "administrador", "super_admin"];

export function canManageFunds(user) {
  return !!user && FUND_MANAGER_ROLES.includes(user.role);
}

export function canManageLeads(user) {
  return !!user && LEAD_MANAGER_ROLES.includes(user.role);
}
