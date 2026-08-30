import { Routes, Route } from "react-router-dom";
import { AdminAuthProvider } from "./AuthContext";
import ProtectedRoute from "./ProtectedRoute";
import AdminLogin from "./AdminLogin";
import AdminLayout from "./AdminLayout";
import AdminDashboard from "./AdminDashboard";
import AdminFondosList from "./AdminFondosList";
import AdminFondoForm from "./AdminFondoForm";
import AdminLeadsList from "./AdminLeadsList";
import AdminLeadDetail from "./AdminLeadDetail";

export default function AdminApp() {
  return (
    <AdminAuthProvider>
      <Routes>
        <Route path="login" element={<AdminLogin />} />
        <Route
          element={
            <ProtectedRoute>
              <AdminLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<AdminDashboard />} />
          <Route path="fondos" element={<AdminFondosList />} />
          <Route path="fondos/nuevo" element={<AdminFondoForm />} />
          <Route path="fondos/:id" element={<AdminFondoForm />} />
          <Route path="leads" element={<AdminLeadsList />} />
          <Route path="leads/:id" element={<AdminLeadDetail />} />
        </Route>
      </Routes>
    </AdminAuthProvider>
  );
}
