import { createBrowserRouter, RouterProvider } from "react-router";
import { Login } from "../pages/auth/Login";
import { Register } from "../pages/auth/Register";
import { Welcome } from "../pages/Welcome";
import { PublicMainLayout } from "../components/public/PublicMainLayout";
import { ProtectedRoute } from "./ProtectedRoute";
import { AdminRoutes } from "./AdminRoutes";
import { StudentRoutes } from "./studentRoutes";

const router = createBrowserRouter([

  {
    element: <PublicMainLayout />,
    children: [
      { path: "/", element: <Welcome /> },
      { path: "/login", element: <Login /> },
      { path: "/register", element: <Register /> },
    ],
  },
  {
    element: <ProtectedRoute allowedRoles={["ESTUDANTE"]} />,
    children: [...StudentRoutes], 
  },
  {
    element: <ProtectedRoute allowedRoles={["ADMIN"]} />,
    children: [...AdminRoutes],
  },

  {
    path: "*",
    element: <h1>404 - Página não encontrada</h1>,
  },
]);

export function AppRoutes() {
  return <RouterProvider router={router} />;
}
