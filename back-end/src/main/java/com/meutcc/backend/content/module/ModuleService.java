package com.meutcc.backend.content.module;

import com.meutcc.backend.common.exceptions.CourseException;
import com.meutcc.backend.common.exceptions.ModuleException;
import com.meutcc.backend.common.exceptions.TeacherException;
import com.meutcc.backend.content.courses.Course;
import com.meutcc.backend.content.courses.CourseMapper;
import com.meutcc.backend.content.courses.CourseRepository;
import com.meutcc.backend.security.AuthenticationService;
import com.meutcc.backend.security.SecurityService;
import com.meutcc.backend.teacher.Teacher;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ModuleService {

    private final ModuleRepository moduleRepository;
    private final AuthenticationService authenticationService;
    private final SecurityService securityService;
    private final ModuleMapper moduleMapper;
    private final CourseRepository courseRepository;

    @Transactional(readOnly = true)
    public List<ModuleDTO> listByCourses(Long courseId) {
        List<Module> modules = moduleRepository.findByCourseId(courseId);
        return moduleMapper.toDTOs(modules);
    }

    @Transactional
    public ModuleDTO create(ModuleDTO dto) {
        Teacher teacher = authenticationService.getAuthenticatedTeacher();
        Course course = courseRepository.findById(dto.courseId()).orElseThrow(()
                -> new CourseException("Curso não encontrado"));
        if(!course.getTeacher().getId().equals(teacher.getId())) {
            throw new TeacherException("Você não tem permissão para criar esse módulo.");
        }

        Module module = moduleMapper.toEntity(dto);
        module.setCourse(course);

        Module savedModule = moduleRepository.save(module);

        return moduleMapper.toDTO(savedModule);
    }

    @Transactional
    public void delete(Long id) {
        Teacher teacher = authenticationService.getAuthenticatedTeacher();
        Course course = courseRepository.findById(id).orElseThrow(() ->  new CourseException("Nenhum curso encontrada."));
        securityService.validateCourseOwner(course, teacher);
        Module module = moduleRepository.findById(id).orElseThrow(
                () -> new ModuleException("Nenhum módulo encontrado.")
        );
        moduleRepository.delete(module);
    }
}
