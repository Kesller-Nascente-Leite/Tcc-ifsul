package com.meutcc.backend.content.module;

import com.meutcc.backend.content.courses.Course;
import com.meutcc.backend.user.security.SecurityService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ModuleService {

    private final ModuleRepository moduleRepository;
    private final SecurityService securityService;
    private final ModuleMapper moduleMapper;

    @Transactional(readOnly = true)
    public List<ModuleDTO> listByCourses(Long courseId) {
        securityService.validateCourseOwner(courseId);
        List<Module> modules = moduleRepository.findByCourseId(courseId);
        return moduleMapper.toDTOs(modules);
    }

    @Transactional(readOnly = true)
    public ModuleDTO getModuleById(Long id) {
        Module module = securityService.getModuleIfOwner(id);
        return moduleMapper.toDTO(module);
    }

    @Transactional
    public ModuleDTO create(ModuleDTO dto) {
        Course course = securityService.getCourseIfOwner(dto.courseId());

        Module module = moduleMapper.toEntity(dto);
        module.setCourse(course);

        Module savedModule = moduleRepository.save(module);

        return moduleMapper.toDTO(savedModule);
    }

    @Transactional
    public ModuleDTO update(Long id, ModuleDTO dto) {
        Module module = securityService.getModuleIfOwner(id);
        moduleMapper.updateEntityFromDTO(dto, module);
        Module updateModule = moduleRepository.save(module);

        return moduleMapper.toDTO(updateModule);

    }

    @Transactional
    public void delete(Long id) {
        Module module = securityService.getModuleIfOwner(id);
        moduleRepository.delete(module);
    }

}
