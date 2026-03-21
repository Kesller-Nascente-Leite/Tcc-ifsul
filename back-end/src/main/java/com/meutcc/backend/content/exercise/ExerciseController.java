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
    public List<ExerciseRequestDTO> getAllExercises(@PathVariable("lessonId") Long lessonId) {
       return exerciseService.getAllExercises(lessonId);
    }

    @PostMapping("/teacher/exercises/create")
    @ResponseStatus(HttpStatus.CREATED)
    public void createExerciseAndQuestions(@RequestBody CreateExerciseDTO createExerciseDTO) {
        exerciseService.createExercise(createExerciseDTO);
    }

    @DeleteMapping("/teacher/exercises/{exerciseId}")
    public void deleteExercises(@PathVariable("exerciseId") Long exerciseId) {
        exerciseService.delete(exerciseId);
    }


}
