package com.meutcc.backend.content.question.dtos;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.meutcc.backend.content.question.QuestionType;

import java.math.BigDecimal;
import java.util.List;

@JsonInclude(JsonInclude.Include.NON_NULL)
public record QuestionResultDTO(
        Long questionId,
        String questionText,
        QuestionType type,
        Boolean isCorrect,
        BigDecimal pointsEarned,
        Integer maxPoints,
        String feedback,
        String explanation,
        List<Long> correctOptionIds,
        List<Long> selectedOptionIds
) {}