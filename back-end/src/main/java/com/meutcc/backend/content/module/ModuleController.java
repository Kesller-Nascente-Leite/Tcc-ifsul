package com.meutcc.backend.content.module;

import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class ModuleController {

    private final ModuleService moduleService;

    // resolver bug: error 500.
    @PreAuthorize("hasAuthority('TEACHER')")
    @GetMapping("/teacher/courses/{courseId}/modules")
    @ResponseStatus(HttpStatus.OK)
    public List<Module> listByCourses(@PathVariable Long  courseId) {
        return moduleService.listByCourses(courseId);
    }

}
