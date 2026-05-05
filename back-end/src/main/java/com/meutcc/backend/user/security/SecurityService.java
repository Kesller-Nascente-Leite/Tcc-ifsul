package com.meutcc.backend.user.security;

import com.meutcc.backend.content.courses.CourseException;
import com.meutcc.backend.content.lesson.LessonException;
import com.meutcc.backend.content.lesson.LessonRepository;
import com.meutcc.backend.content.module.ModuleException;
import com.meutcc.backend.content.courses.Course;
import com.meutcc.backend.content.courses.CourseRepository;
import com.meutcc.backend.content.module.Module;
import com.meutcc.backend.content.module.ModuleRepository;
import com.meutcc.backend.teacher.Teacher;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class SecurityService {

    private final ModuleRepository moduleRepository;
    private final AuthenticationService authenticationService;
    private final CourseRepository courseRepository;
    private final LessonRepository lessonRepository;

    public void validateCourseOwner(Long id) throws AccessDeniedException {
        Teacher teacher = authenticationService.getAuthenticatedTeacher();
        Course course = courseRepository.findById(id).orElseThrow(
                () -> new CourseException("Nenhum curso encontrado.")
        );
        if (!course.getTeacher().getId().equals(teacher.getId())) {
            throw new AccessDeniedException("Você não tem permissão para acessar este curso.");
        }
    }

    public Course getCourseIfOwner(Long courseId) {
        Teacher teacher = authenticationService.getAuthenticatedTeacher();

        Course course = courseRepository.findById(courseId)
                .orElseThrow(() -> new CourseException("Curso não encontrado com ID: " + courseId));

        if (!course.getTeacher().getId().equals(teacher.getId())) {
            throw new AccessDeniedException("Você não tem permissão para acessar este curso.");
        }

        return course;
    }

    public void validateModuleOwnership(Long moduleId) {
        Teacher teacher = authenticationService.getAuthenticatedTeacher();

        Module module = moduleRepository.findById(moduleId)
                .orElseThrow(() -> new ModuleException("Módulo não encontrado com ID: " + moduleId));

        if (!module.getCourse().getTeacher().getId().equals(teacher.getId())) {
            throw new AccessDeniedException("Você não tem permissão para acessar este módulo.");
        }
    }

    public Module getModuleIfOwner(Long moduleId) {
        Teacher teacher = authenticationService.getAuthenticatedTeacher();

        Module module = moduleRepository.findById(moduleId)
                .orElseThrow(() -> new ModuleException("Módulo não encontrado com ID: " + moduleId));

        if (!module.getCourse().getTeacher().getId().equals(teacher.getId())) {
            throw new AccessDeniedException("Você não tem permissão para acessar este módulo.");
        }

        return module;
    }

    public boolean isCourseOwner(Long courseId) {
        try {
            Teacher teacher = authenticationService.getAuthenticatedTeacher();
            return courseRepository.findById(courseId)
                    .map(course -> course.getTeacher().getId().equals(teacher.getId()))
                    .orElse(false);
        } catch (Exception e) {
            return false;
        }
    }

}
