// src/routes/ProtectedRoute.tsx
import { Navigate, Outlet } from "react-router";

interface ProtectedRouteProps {
  allowedRoles: string[];
}

export function ProtectedRoute({ allowedRoles }: ProtectedRouteProps) {
  // Aqui você buscaria do seu Contexto de Auth ou LocalStorage
  const user = JSON.parse(localStorage.getItem("user") || "null");

  if (!user) return <Navigate to="/login" replace />;

  if (!allowedRoles.includes(user.role)) {
    return <Navigate to="/login" replace />; 
  }

  return <Outlet />;
}
