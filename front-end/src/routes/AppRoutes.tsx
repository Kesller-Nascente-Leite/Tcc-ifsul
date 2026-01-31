import { createBrowserRouter, RouterProvider } from "react-router";
import { Login } from "../pages/auth/Login";
import { Register } from "../pages/auth/Register";
import { Welcome } from "../pages/Welcome";
import { AdminRoutes } from "./AdminRoutes";
import { PublicMainLayout } from "../components/public/PublicMainLayout";
import { StudentRoutes } from "./studentRoutes";

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
    ...StudentRoutes,
    // Rota de admin
    ...AdminRoutes,
  },
  {
    // Not found se faz assim
    path: "*",
    element: <h1>Not Found</h1>,
  },
]);

export function AppRoutes() {
  return <RouterProvider router={router} />;
}
