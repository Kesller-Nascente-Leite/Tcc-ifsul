import type { RouteObject } from "react-router";
import { StudentDashboard } from "../pages/students/StudentDashboard";
import { StudentLayout } from "../components/layout/student/StudentLayout";

export const StudentRoutes: RouteObject[] = [
  {
    element: <StudentLayout />,
    path: "/student",
    children: [
      {
        path: "dashboard",
        element: <StudentDashboard />,
      },
    ],
  },
];
