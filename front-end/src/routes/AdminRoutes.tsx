import type { RouteObject } from "react-router";
import { AdminDashboard } from "../pages/admin/AdminDashboard";

export const AdminRoutes: RouteObject[] = [
  // Add rotas de admin
  {
    path: "/admin",
    children: [
      {
        path: "dashboard",
        element: <AdminDashboard />,
      },
    ],
  },
];
