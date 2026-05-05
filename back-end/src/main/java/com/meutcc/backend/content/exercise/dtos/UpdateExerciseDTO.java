package com.meutcc.backend.content.exercise.dtos;

import com.meutcc.backend.content.question.QuestionDisplayMode;
import com.meutcc.backend.content.question.dtos.UpdateQuestionDTO;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.Size;

import java.time.LocalDateTime;
import java.util.List;

public record UpdateExerciseDTO(
        @Size(max = 255, message = "Título deve ter no máximo 255 caracteres")
        String title,

        String description,
        String instructions,

        @Min(value = 0, message = "Pontuação total deve ser maior ou igual a 0")
        Integer totalPoints,

        @Min(value = 0, message = "Nota mínima deve ser maior ou igual a 0")
        @Max(value = 100, message = "Nota mínima deve ser menor ou igual a 100")
        Integer passingScore,

        @Min(value = 1, message = "Tempo limite deve ser maior que 0")
        Integer timeLimit,

        @Min(value = 0, message = "Máximo de tentativas deve ser maior ou igual a 0")
        Integer maxAttempts,

        Boolean shuffleQuestions,
        Boolean shuffleOptions,
        Boolean showCorrectAnswers,
        Boolean showScore,
        Boolean allowReview,

        QuestionDisplayMode questionDisplayMode,

        LocalDateTime availableFrom,
        LocalDateTime availableUntil,

        Boolean isActive,

        List<UpdateQuestionDTO> questions
) {
}
