export interface CourseDTO {
  id?: number | null;
  title: string;
  description: string;
  published: boolean;
  teacherId: number;          // ID da tabela tb_teachers
  teacherName: string;
  teacherUserId?: number;     // ID da tabela tb_users (novo: usar para validações)
}
