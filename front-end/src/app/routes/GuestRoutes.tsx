import { Navigate, Outlet } from "react-router";

export function GuestRoutes() {
  const token = localStorage.getItem("access_token");
  const userJson = localStorage.getItem("user");
  const user = userJson ? JSON.parse(userJson) : null;

  if (!token || !user) {
    return <Outlet />;
  }

  switch (user.role) {
    case "STUDENT":
      return <Navigate to="/student/dashboard" replace />;
    case "TEACHER":
      return <Navigate to="/teacher/dashboard" replace />;
    case "ADMIN":
      return <Navigate to="/admin/dashboard" replace />;
    default:
      return <Navigate to="/" replace />;
  }
}
