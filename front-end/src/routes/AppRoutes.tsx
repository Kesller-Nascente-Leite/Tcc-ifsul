import { createBrowserRouter, RouterProvider } from "react-router";
import { Login } from "../pages/auth/Login";
import { Register } from "../pages/auth/Register";
import { Welcome } from "../pages/Welcome";
import { adminRoutes } from "./AdminRoutes";
import { PublicMainLayout } from "../components/public/PublicMainLayout";

const router = createBrowserRouter([
  //Passa todas as rotas aq
  {
    element: <PublicMainLayout />,
    children: [
      {
        path: "/",
        element: <Welcome />,
      },
      {
        path: "/login",
        element: <Login />,
      },
      {
        path: "/register",
        element: <Register />,
      },
    ],
  },
  // Rota de admin
  ...adminRoutes,
  {
    // Not found se faz assim
    path: "*",
    element: <h1>Not Found</h1>,
  },
]);

export function AppRoutes() {
  return <RouterProvider router={router} />;
}
