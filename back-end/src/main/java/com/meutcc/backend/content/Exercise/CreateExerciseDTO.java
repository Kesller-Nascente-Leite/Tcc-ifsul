package com.meutcc.backend.content.Exercise;

import jakarta.validation.constraints.*;

import java.time.LocalDateTime;

public record CreateExerciseDTO(
        @NotBlank(message = "Título é obrigatório")
        @Size(max = 255, message = "Título deve ter no máximo 255 caracteres")
        String title,

        String description,
        String instructions,

        @NotNull(message = "ID da aula é obrigatório")
        Long lessonId,

        @Min(value = 0, message = "Pontuação total deve ser maior ou igual a 0")
        Integer totalPoints = 100,

        @Min(value = 0, message = "Nota mínima deve ser maior ou igual a 0")
        @Max(value = 100, message = "Nota mínima deve ser menor ou igual a 100")
        Integer passingScore = 60,

        @Min(value = 1, message = "Tempo limite deve ser maior que 0") Integer timeLimit,

        @Min(value = 0, message = "Máximo de tentativas deve ser maior ou igual a 0") Integer maxAttempts=0,

        Boolean shuffleQuestions=true,
        Boolean shuffleOptions=true,
        Boolean showCorrectAnswers=false,
        Boolean showScore=true,
        Boolean allowReview=false,

        QuestionDisplayMode questionDisplayMode = Exercise.QuestionDisplayMode.ALL_AT_ONCE,

        LocalDateTime availableFrom,
        LocalDateTime availableUntil,

        @NotEmpty(message = "O exercício deve ter pelo menos uma questão") List<CreateQuestionDTO> questions=new ArrayList<>()

){
        }
