import {
  createBrowserRouter,
  Outlet,
  RouterProvider,
  ScrollRestoration,
} from "react-router";
import { Login } from "@/features/auth/pages/Login";
import { Register } from "@/features/auth/pages/Register";
import { HomePage } from "@/features/public/pages/HomePage";
import { PublicMainLayout } from "@/features/public/components/PublicMainLayout";
import { ProtectedRoute } from "@/app/routes/ProtectedRoute";
import { AdminRoutes } from "@/app/routes/AdminRoutes";
import { ROLES } from "@/shared/constants/ROLES";
import Unauthorized from "@/features/public/pages/Unauthorized";
import { GuestRoutes } from "@/app/routes/GuestRoutes";
import { TeacherRoutes } from "@/app/routes/TeacherRoutes";
import { AuthGuard } from "@/app/guards/AuthGuard";
import { AboutPage } from "@/features/public/pages/AboutPage";
import { FeaturesPage } from "@/features/public/pages/FeaturesPage";
import { PricingPage } from "@/features/public/pages/PricingPage";
import { AuthProvider } from "@/app/providers/AuthContext";
import { StudentRoutes } from "./StudentRoutes";

const RootLayout = () => {
  return (
    <AuthProvider>
      <ScrollRestoration />
      <Outlet />
    </AuthProvider>
  );
};

const router = createBrowserRouter([
  {
    element: <RootLayout />,
    children: [
      {
        element: <AuthGuard />,
        children: [
          {
            element: <PublicMainLayout />,
            children: [
              {
                element: <GuestRoutes />,
                children: [
                  { path: "/", element: <HomePage /> },
                  { path: "/features", element: <FeaturesPage /> },
                  { path: "/pricing", element: <PricingPage /> },
                  { path: "/about", element: <AboutPage /> },
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
            element: <ProtectedRoute allowedRoles={[ROLES.TEACHER]} />,
            children: [...TeacherRoutes],
          },
          {
            element: <ProtectedRoute allowedRoles={[ROLES.ADMIN]} />,
            children: [...AdminRoutes],
          },
          {
            path: "*",
            element: <h1>404 - P�gina n�o encontrada</h1>,
          },
          {
            path: "/unauthorized",
            element: <Unauthorized />,
          },
        ],
      },
    ],
  },
]);

export function AppRoutes() {
  return <RouterProvider router={router} />;
}
