import { createBrowserRouter, RouterProvider } from "react-router";
import { Login } from "../pages/auth/Login";
import { Register } from "../pages/auth/Register";
import { Welcome } from "../pages/Welcome";
import { PublicMainLayout } from "../components/layout/public/PublicMainLayout";
import { ProtectedRoute } from "./ProtectedRoute";
import { AdminRoutes } from "./AdminRoutes";
import { ROLES } from "../constants/ROLES";
import Unauthorized from "../pages/Unauthorized";
import { StudentRoutes } from "./StudentRoutes";
import { GuestRoutes } from "./GuestRoutes";

const router = createBrowserRouter([
  {
    element: <PublicMainLayout />,
    children: [
      { path: "/", element: <Welcome /> },
      {
        element: <GuestRoutes />,
        children: [
          { path: "/login", element: <Login /> },
          { path: "/register", element: <Register /> },
        ],
      },
    ],
  },
  {
    element: <ProtectedRoute allowedRoles={[ROLES.STUDENT]} />,
    children: [...StudentRoutes],
  },
  {
    element: <ProtectedRoute allowedRoles={[ROLES.ADMIN]} />,
    children: [...AdminRoutes],
  },

  {
    path: "*",
    element: <h1>404 - Página não encontrada</h1>,
  },
  {
    path: "/unauthorized",
    element: <Unauthorized />,
  },
]);

export function AppRoutes() {
  return <RouterProvider router={router} />;
}
