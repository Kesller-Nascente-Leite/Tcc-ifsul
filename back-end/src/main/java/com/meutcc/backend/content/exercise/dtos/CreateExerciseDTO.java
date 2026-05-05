package com.meutcc.backend.content.exercise.dtos;

import com.meutcc.backend.content.question.dtos.CreateQuestionDTO;
import com.meutcc.backend.content.question.QuestionDisplayMode;
import jakarta.validation.constraints.*;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;


public record CreateExerciseDTO(
        @NotBlank(message = "Título é obrigatório")
        @Size(max = 255, message = "Título deve ter no máximo 255 caracteres")
        String title,

        String description,
        String instructions,

        @NotNull(message = "ID da aula é obrigatório")
        Long lessonId,

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

        @NotEmpty(message = "O exercício deve ter pelo menos uma questão")
        List<CreateQuestionDTO> questions
) {
    // Construtor compacto - aplica valores padrão
    public CreateExerciseDTO {
        if (totalPoints == null) totalPoints = 100;
        if (passingScore == null) passingScore = 60;
        if (maxAttempts == null) maxAttempts = 0;
        if (shuffleQuestions == null) shuffleQuestions = true;
        if (shuffleOptions == null) shuffleOptions = true;
        if (showCorrectAnswers == null) showCorrectAnswers = false;
        if (showScore == null) showScore = true;
        if (allowReview == null) allowReview = false;
        if (questionDisplayMode == null) questionDisplayMode = QuestionDisplayMode.ALL_AT_ONCE;
        if (questions == null) questions = new ArrayList<>();
    }
}