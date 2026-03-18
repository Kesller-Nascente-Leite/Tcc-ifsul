package com.meutcc.backend.content.exercise;

import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class ExerciseController {

    private final ExerciseService exerciseService;

    @GetMapping("/teacher/exercises/lesson/{lessonId}")
    @ResponseStatus(HttpStatus.OK)
    public List<ExerciseResponseDTO> getAllExercises(@PathVariable("lessonId") Long lessonId) {
       return exerciseService.getAllExercises(lessonId);
        //return null;
    }


}
