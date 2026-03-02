package com.meutcc.backend.content.module;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ModuleService {

    private final ModuleRepository moduleRepository;

    @Transactional(readOnly = true)
    public List<Module> listByCourses(Long courseId) {
        return moduleRepository.findByCourseId(courseId).stream().toList();
    }

}
