package com.meutcc.backend.content.exercise.dtos;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.meutcc.backend.content.question.dtos.QuestionResultDTO;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@JsonInclude(JsonInclude.Include.NON_NULL)
public record ExerciseResultDTO(
        Long attemptId,
        BigDecimal score,
        BigDecimal percentage,
        Boolean passed,
        Integer timeSpent,
        Integer totalQuestions,
        Integer correctAnswers,
        Integer incorrectAnswers,
        Integer unansweredQuestions,
        List<QuestionResultDTO> questionResults,
        String teacherFeedback,
        LocalDateTime submittedAt,
        LocalDateTime gradedAt
) {}