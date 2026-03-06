package com.meutcc.backend.content.module;

import com.meutcc.backend.common.exceptions.CourseException;
import com.meutcc.backend.common.exceptions.ModuleException;
import com.meutcc.backend.content.courses.Course;
import com.meutcc.backend.content.courses.CourseRepository;
import com.meutcc.backend.security.AuthenticationService;
import com.meutcc.backend.security.SecurityService;
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
    public ModuleDTO getModuleById(Long id) {
        securityService.validateCourseOwner(id);
        Module modules = moduleRepository.findById(id).orElseThrow(
                () -> new ModuleException("Esse módulo não existe!")
        );
        return moduleMapper.toDTO(modules);
    }

    @Transactional
    public ModuleDTO create(ModuleDTO dto) {
        securityService.validateCourseOwner(dto.courseId());
        Course course = courseRepository.findById(dto.courseId()).orElseThrow(()
                -> new CourseException("Curso não encontrado."));

        Module module = moduleMapper.toEntity(dto);
        module.setCourse(course);

        Module savedModule = moduleRepository.save(module);

        return moduleMapper.toDTO(savedModule);
    }

    @Transactional
    public ModuleDTO update(Long id, ModuleDTO dto) {
        securityService.validateCourseOwner(id);
        Module module = moduleRepository.findById(id).orElseThrow(
                () -> new ModuleException("Curso não encontrado.")
        );

        moduleMapper.updateEntityFromDTO(dto, module);
        Module updateModule = moduleRepository.save(module);

        return moduleMapper.toDTO(updateModule);

    }

    @Transactional
    public void delete(Long id) {
        authenticationService.getAuthenticatedTeacher();
        courseRepository.findById(id).orElseThrow(() -> new CourseException("Nenhum curso encontrada."));
        securityService.validateCourseOwner(id);
        Module module = moduleRepository.findById(id).orElseThrow(
                () -> new ModuleException("Nenhum módulo encontrado.")
        );
        moduleRepository.delete(module);
    }

}
