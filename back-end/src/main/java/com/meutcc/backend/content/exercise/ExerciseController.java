package com.meutcc.backend.content.exercise;

import com.meutcc.backend.content.exercise.dtos.CreateExerciseDTO;
import com.meutcc.backend.content.exercise.dtos.UpdateExerciseDTO;
import jakarta.validation.Valid;
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
    }

    @GetMapping("/teacher/exercises/{exerciseId}")
    @ResponseStatus(HttpStatus.OK)
    public ExerciseResponseDTO getExerciseById(
            @PathVariable("exerciseId") Long exerciseId,
            @RequestParam(value = "includeQuestions", defaultValue = "false") Boolean includeQuestions) {
        return exerciseService.getById(exerciseId, includeQuestions);
    }

    @PostMapping("/teacher/exercises/create")
    @ResponseStatus(HttpStatus.CREATED)
    public void createExerciseAndQuestions(@RequestBody @Valid CreateExerciseDTO createExerciseDTO) {
        exerciseService.createExercise(createExerciseDTO);
    }

    @PutMapping("/teacher/exercises/{exerciseId}")
    public void update(@PathVariable("exerciseId") Long exerciseId, @RequestBody @Valid UpdateExerciseDTO updateExerciseDTO) {
        exerciseService.updateExercise(exerciseId, updateExerciseDTO);
    }

    @DeleteMapping("/teacher/exercises/{exerciseId}")
    public void deleteExercises(@PathVariable("exerciseId") Long exerciseId) {
        exerciseService.delete(exerciseId);
    }

}
