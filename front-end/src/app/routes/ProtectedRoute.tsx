import { Navigate, Outlet } from "react-router";

interface ProtectedRouteProps {
  allowedRoles: string[];
}

export function ProtectedRoute({ allowedRoles }: ProtectedRouteProps) {
  const user = JSON.parse(localStorage.getItem("user") || "null");

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (!allowedRoles.includes(user.role)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return <Outlet />;
}
