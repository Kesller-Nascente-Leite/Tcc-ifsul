package com.meutcc.backend.content.module;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.PathVariable;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ModuleService {

    ModuleRepository moduleRepository;

    @Transactional(readOnly = true)
    public List<Module> listByCourses(Long courseId) {
        return moduleRepository.findByCourseId(courseId).stream().toList();
    }

}
