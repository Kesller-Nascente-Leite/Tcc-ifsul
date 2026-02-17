package com.meutcc.backend.content.courses;

public record CourseDTO(
        Long id,
        String title,
        String description,
        boolean published,
        Long teacherId,
        String teacherName
) {
}

