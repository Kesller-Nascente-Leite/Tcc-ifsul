import type { RouteObject } from "react-router";
import { Navigate } from "react-router";
import Settings from "@/features/settings/pages/Settings";
import { TeacherDashboard } from "@/features/teacher/pages/TeacherDashboard";
import { TeacherCourse } from "@/features/teacher/pages/TeacherCourses";
import { TeacherLayout } from "@/features/teacher/components/TeacherLayout";
import { EditCourses } from "@/features/teacher/pages/EditCourses";
import { TeacherModules } from "@/features/teacher/pages/TeacherModule";
import { ManageCourseStudents } from "@/features/teacher/pages/ManageCourseStudents";
import { EditModule } from "@/features/teacher/pages/EditModule";
import { TeacherLessons } from "@/features/teacher/pages/TeacherLesson";
import { VideoPlayerPage } from "@/features/teacher/pages/video/VideoPlayerPage";
import { EditLesson } from "@/features/teacher/pages/EditLesson";
import { TeacherExercises } from "@/features/teacher/pages/exercise/TeacherExercises";
import { ExerciseStatistics } from "@/features/teacher/pages/exercise/ExerciseStatistics";
import { CreateExercise } from "@/features/teacher/pages/exercise/CreateExercise";
import { ExerciseEdit } from "@/features/teacher/pages/exercise/ExerciseEdit";

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
        path: "courses/:courseId/modules/:moduleId/edit",
        element: <EditModule />,
      },
      {
        path: "settings",
        element: <Settings />,
      },
      {
        path: "courses/:courseId/modules/:moduleId/lessons",
        element: <TeacherLessons />,
      },
      {
        path: "courses/:courseId/modules/:moduleId/lessons/:lessonId/edit",
        element: <EditLesson />,
      },
      {
        path: "courses/:courseId/modules/:moduleId/lessons/:lessonId/videos/:videoId/watch",
        element: <VideoPlayerPage />,
      },
      {
        path: "/teacher/lessons/:lessonId/exercises",
        element: <TeacherExercises />,
      },
      {
        path: "courses/:courseId/modules/:moduleId/lessons/:lessonId/exercises",
        element: <TeacherExercises />,
      },
      {
        path: "courses/:courseId/modules/:moduleId/lessons/:lessonId/exercises/create",
        element: <CreateExercise />,
      },
      {
        path: "courses/:courseId/modules/:moduleId/lessons/:lessonId/exercises/:exerciseId/edit",
        element: <ExerciseEdit />,
      },
      {
        path: "courses/:courseId/modules/:moduleId/lessons/:lessonId/exercises/:exerciseId/stats",
        element: <ExerciseStatistics />,
      },
    ],
  },
];
