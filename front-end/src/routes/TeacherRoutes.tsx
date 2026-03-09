import type { RouteObject } from "react-router";
import { Navigate } from "react-router";
import Settings from "../pages/Settings";
import { TeacherDashboard } from "../pages/teacher/TeacherDashboard";
import { TeacherCourse } from "../pages/teacher/TeacherCourses";
import { TeacherLayout } from "../components/layout/teacher/TeacherLayout";
import { EditCourses } from "../pages/teacher/EditCourses";
import { TeacherModules } from "../pages/teacher/TeacherModule";
import { ManageCourseStudents } from "../pages/teacher/ManageCourseStudents";
import { EditModule } from "../pages/teacher/EditModule";
import { TeacherLessons } from "../pages/teacher/TeacherLesson";
import { VideoPlayerPage } from "../pages/videoplayer/VideoPlayerPage";

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
        path: "course",
        element: <TeacherCourse />,
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
        path: "settings",
        element: <Settings />,
      },
      {
        path: "/teacher/courses/:courseId/modules/:moduleId/lessons",
        element: <TeacherLessons />,
      },
      {
        path: "courses/:courseId/modules/:moduleId/lessons/:lessonId/videos/:videoId/watch",
        element: <VideoPlayerPage />,
      },
    ],
  },
];
