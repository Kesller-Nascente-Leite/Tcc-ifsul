import type { RouteObject } from "react-router";
import { StudentDashboard } from "../pages/students/StudentDashboard";

export const StudentRoutes: RouteObject[] = [
  {
    path: "/student",
    children: [
      {
        path: "/dashboard",
        element: <StudentDashboard />,
      },
    ],
  },
];
