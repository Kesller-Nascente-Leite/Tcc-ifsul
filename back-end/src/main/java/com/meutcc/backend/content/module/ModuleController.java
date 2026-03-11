package com.meutcc.backend.content.module;

import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class ModuleController {

    private final ModuleService moduleService;

    @GetMapping("/teacher/courses/{courseId}/modules")
    @ResponseStatus(HttpStatus.OK)
    public List<ModuleDTO> listByCourses(@PathVariable Long  courseId) {
        return moduleService.listByCourses(courseId);
    }

    @GetMapping("/teacher/modules/{id}")
    @ResponseStatus(HttpStatus.OK)
    public ModuleDTO getModuleById(@PathVariable Long id){
        return moduleService.getModuleById(id);
    }

    @PostMapping("/teacher/modules/create")
    @ResponseStatus(HttpStatus.CREATED)
    public ModuleDTO create(@RequestBody ModuleDTO moduleDTO) {
        return moduleService.create(moduleDTO);
    }

    @PutMapping("/teacher/modules/{id}")
    @ResponseStatus(HttpStatus.OK)
    public ModuleDTO update(@PathVariable Long id, @RequestBody ModuleDTO moduleDTO) {
        return moduleService.update(id,moduleDTO);
    }

    @DeleteMapping("/teacher/modules/{id}")
    @ResponseStatus(HttpStatus.OK)
    public void delete(@PathVariable Long id) {
        moduleService.delete(id);
    }

}
