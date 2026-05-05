export interface CourseDTO {
  id?: number | null;
  title: string;
  description: string;
  published: boolean;
  teacherId: number;
  teacherName: string;
  isPrivate: boolean;
}
