export interface StudentDTO {
  id: number;
  fullName: string;
  email: string;
  userId: number;
  enrolledAt?: string;
}

export interface CourseEnrollmentDTO {
  courseId: number;
  studentId: number;
  studentEmail?: string;
}