import type { RouteObject } from "react-router";
import { Navigate } from "react-router";
import { StudentDashboard } from "@/features/student/pages/StudentDashboard";
import { StudentLayout } from "@/features/student/components/StudentLayout";
import Settings from "@/features/settings/pages/Settings";
import { AvailableCourses } from "@/features/student/pages/AvailableCourses";

export const StudentRoutes: RouteObject[] = [
  {
    element: <StudentLayout />,
    path: "/student",
    children: [
      {
        index: true,
        element: <Navigate to="dashboard" replace />,
      },
      {
        path: "dashboard",
        element: <StudentDashboard />,
      },
      {
        path: "settings",
        element: <Settings />,
      },
      {
        path: "available-courses",
        element: <AvailableCourses />,
      },
    ],
  },
];
