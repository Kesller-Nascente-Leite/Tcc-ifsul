package com.meutcc.backend.security;

import com.meutcc.backend.content.courses.Course;
import com.meutcc.backend.teacher.Teacher;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class SecurityService {


    private final AuthenticationService authenticationService;

    public void validateCourseOwner(Course course, Teacher teacher) throws AccessDeniedException {
        if (!course.getTeacher().getId().equals(teacher.getId())) {
            throw new AccessDeniedException("Nenhum curso encontrada para atualizar.");
        }
    }
}
