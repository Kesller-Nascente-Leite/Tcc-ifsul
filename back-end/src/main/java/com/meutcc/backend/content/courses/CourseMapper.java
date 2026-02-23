package com.meutcc.backend.content.courses;

import com.meutcc.backend.teacher.Teacher;

public class CourseMapper {

    public static CourseDTO toDTO(Course course) {
        if (course == null) {
            return null;
        }

        return new CourseDTO(
                course.getId(),
                course.getTitle(),
                course.getDescription(),
                course.isPublished(),
                course.getTeacher() != null ? course.getTeacher().getId() : null,
                course.getTeacher() != null ? course.getTeacher().getUser().getFullName() : "Professor não definido"
        );
    }

    public static Course toEntity(CourseDTO dto) {
        if (dto == null) {
            return null;
        }

        Course course = new Course();
        course.setTitle(dto.title());
        course.setDescription(dto.description());
        course.setPublished(dto.published());

        return course;
    }

    public static Course toEntity(CourseDTO dto, Teacher teacher) {
        if (dto == null) {
            return null;
        }

        Course course = toEntity(dto);
        course.setTeacher(teacher);

        return course;
    }

    public static void updateEntity(Course course, CourseDTO dto) {
        if (course == null || dto == null) {
            return;
        }

        course.setTitle(dto.title());
        course.setDescription(dto.description());
        course.setPublished(dto.published());
        // Teacher não é atualizado
    }
}