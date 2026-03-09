package com.meutcc.backend.content.lesson;

import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/teacher")
@RequiredArgsConstructor
public class LessonController {

    private final LessonService lessonService;

    @GetMapping("/modules/{moduleId}/lessons")
    @ResponseStatus(HttpStatus.OK)
    public List<LessonDTO> listByModule(@PathVariable Long moduleId) {
        return lessonService.listByModule(moduleId);
    }

    @GetMapping("/lessons/{id}")
    @ResponseStatus(HttpStatus.OK)
    public LessonDTO getById(@PathVariable Long id) {
        return lessonService.getById(id);
    }

    @PostMapping("/lessons")
    @ResponseStatus(HttpStatus.CREATED)
    public LessonDTO create(@RequestBody LessonDTO dto) {
        return lessonService.create(dto);
    }

    @PutMapping("/lessons/{id}")
    @ResponseStatus(HttpStatus.OK)
    public LessonDTO update(@PathVariable Long id, @RequestBody LessonDTO dto) {
        return lessonService.update(id, dto);
    }

    @DeleteMapping("/lessons/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable Long id) {
        lessonService.delete(id);
    }

}