const API_URL = import.meta.env.VITE_API_URL;
const TOKEN_KEY = "fondos_admin_token";

export function getAdminToken() {
  return localStorage.getItem(TOKEN_KEY);
}

export function setAdminToken(token) {
  localStorage.setItem(TOKEN_KEY, token);
}

export function clearAdminToken() {
  localStorage.removeItem(TOKEN_KEY);
}

export class AdminApiError extends Error {
  constructor(message, status, errors) {
    super(message);
    this.status = status;
    this.errors = errors;
  }
}

async function adminFetch(path, options = {}) {
  if (!API_URL) {
    throw new AdminApiError("VITE_API_URL no está configurada.", 0);
  }

  const token = getAdminToken();
  const res = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
  });

  if (res.status === 401) {
    clearAdminToken();
  }

  if (res.status === 204) return null;

  const data = await res.json().catch(() => null);

  if (!res.ok) {
    throw new AdminApiError(
      data?.message ?? `La API respondió ${res.status}.`,
      res.status,
      data?.errors
    );
  }

  return data;
}

export function adminLogin(email, password) {
  return adminFetch("/api/auth/login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });
}

export function adminLogout() {
  return adminFetch("/api/auth/logout", { method: "POST" });
}

export function fetchMe() {
  return adminFetch("/api/auth/me");
}

export function fetchDashboard() {
  return adminFetch("/api/admin/dashboard");
}

export function fetchAdminFondos({ verification_status } = {}) {
  const params = new URLSearchParams();
  if (verification_status) params.set("verification_status", verification_status);
  const qs = params.toString();
  return adminFetch(`/api/admin/funds${qs ? `?${qs}` : ""}`);
}

export function fetchAdminFondo(id) {
  return adminFetch(`/api/admin/funds/${id}`);
}

export function createAdminFondo(data) {
  return adminFetch("/api/admin/funds", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export function updateAdminFondo(id, data) {
  return adminFetch(`/api/admin/funds/${id}`, {
    method: "PUT",
    body: JSON.stringify(data),
  });
}

export function verifyAdminFondo(id, data) {
  return adminFetch(`/api/admin/funds/${id}/verify`, {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export function fetchAdminLeads({ status, sort, direction, page } = {}) {
  const params = new URLSearchParams();
  if (status) params.set("status", status);
  if (sort) params.set("sort", sort);
  if (direction) params.set("direction", direction);
  if (page) params.set("page", page);
  const qs = params.toString();
  return adminFetch(`/api/admin/leads${qs ? `?${qs}` : ""}`);
}

export function fetchAdminLead(id) {
  return adminFetch(`/api/admin/leads/${id}`);
}

export function updateAdminLeadStatus(id, status) {
  return adminFetch(`/api/admin/leads/${id}`, {
    method: "PATCH",
    body: JSON.stringify({ status }),
  });
}
