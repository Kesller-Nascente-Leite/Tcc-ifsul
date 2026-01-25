import { createBrowserRouter, RouterProvider } from "react-router";
import { Login } from "../pages/Login";
import { Welcome } from "../pages/Welcome";

const router = createBrowserRouter([
  //Passa todas as rotas aq
  {
    path: "/",
    element: <Welcome />,
  },
  {
    path: "/login",
    element: <Login />,
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
