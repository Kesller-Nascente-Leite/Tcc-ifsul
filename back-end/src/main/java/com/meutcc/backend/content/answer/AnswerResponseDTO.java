package com.meutcc.backend.content.answer;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.meutcc.backend.content.question.QuestionType;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

@JsonInclude(JsonInclude.Include.NON_NULL)
public record AnswerResponseDTO(
        Long id,
        Long questionId,
        String questionText,
        QuestionType questionType,
        List<Long> selectedOptions,
        String textAnswer,
        List<Long> orderAnswer,
        Map<Long, String> matchAnswer,
        Boolean isCorrect,
        BigDecimal pointsEarned,
        Integer maxPoints,
        String feedback,
        LocalDateTime answeredAt
) {}