package com.meutcc.backend.content.question.dtos;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.meutcc.backend.content.question.QuestionType;

@JsonInclude(JsonInclude.Include.NON_NULL)
public record QuestionStatisticsDTO(
        Long questionId,
        String questionText,
        QuestionType type,
        Integer totalAnswers,
        Integer correctAnswers,
        Integer incorrectAnswers,
        Double errorRate,
        Integer averageTimeSpent
) {}