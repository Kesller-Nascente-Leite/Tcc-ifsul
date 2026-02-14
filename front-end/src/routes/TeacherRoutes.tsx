import type { RouteObject } from "react-router";
import { Navigate } from "react-router";
import Settings from "../pages/Settings.";
import { TeacherDashboard } from "../pages/teacher/TeacherDashboard";
import { TeacherSubjects } from "../pages/teacher/TeacherSubjects";
import { TeacherClasses } from "../pages/teacher/TeacherClasses";
import { TeacherLayout } from "../components/layout/teacher/TeacherLayout";

export const TeacherRoutes: RouteObject[] = [
  {
    element: <TeacherLayout />,
    path: "/teacher",
    children: [
      {
        index: true,
        element: <Navigate to="dashboard" replace />,
      },
      {
        path: "dashboard",
        element: <TeacherDashboard />,
      },
      {
        path: "classes",
        element: <TeacherClasses />,
      },
      {
        path: "subjects",
        element: <TeacherSubjects />,
      },
      {
        path: "settings",
        element: <Settings />,
      },
    ],
  },
];
