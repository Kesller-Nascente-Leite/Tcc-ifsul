package com.meutcc.backend.content.exercise;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.meutcc.backend.content.question.QuestionDisplayMode;
import com.meutcc.backend.content.question.QuestionResponseDTO;

import java.time.LocalDateTime;
import java.util.List;

@JsonInclude(JsonInclude.Include.NON_NULL)
public record ExerciseResponseDTO(
        Long id,
        String title,
        String description,
        String instructions,
        Integer totalPoints,
        Integer passingScore,
        Integer timeLimit,
        Integer maxAttempts,
        Boolean shuffleQuestions,
        Boolean shuffleOptions,
        Boolean showCorrectAnswers,
        Boolean showScore,
        Boolean allowReview,
        QuestionDisplayMode questionDisplayMode,
        Boolean isActive,
        LocalDateTime availableFrom,
        LocalDateTime availableUntil,
        Boolean isAvailable,
        Integer questionsCount,
        List<QuestionResponseDTO> questions,
        ExerciseStatisticsDTO statistics,
        LocalDateTime createdAt,
        LocalDateTime updatedAt
) {}
