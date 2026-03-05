import type { RouteObject } from "react-router";
import { Navigate } from "react-router";
import Settings from "../pages/Settings";
import { TeacherDashboard } from "../pages/teacher/TeacherDashboard";
import { TeacherSubjects } from "../pages/teacher/TeacherSubjects";
import { CreateCourse } from "../pages/teacher/CreateCourses";
import { TeacherLayout } from "../components/layout/teacher/TeacherLayout";
import { EditCourses } from "../pages/teacher/EditCourses";
import { TeacherModules } from "../pages/teacher/TeacherModule";
import { ManageCourseStudents } from "../pages/teacher/ManageCourseStudents";
import { EditModule } from "../pages/teacher/EditModule";

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
        path: "create-course",
        element: <CreateCourse />,
      },
      {
        path: "courses/:id/edit",
        element: <EditCourses />,
      },
      {
        path: "courses/:courseId/students",
        element: <ManageCourseStudents />,
      },
      {
        path: "modules",
        element: <TeacherModules />,
      },
      {
        path: "/teacher/courses/:courseId/modules/:moduleId/edit",
        element: <EditModule />,
      },
      {
        path: "subjects",
        element: <TeacherSubjects />,
      },
      {
        path: "settings",
        element: <Settings />,
      }
    ],
  },
];
