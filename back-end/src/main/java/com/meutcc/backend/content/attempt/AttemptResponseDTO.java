package com.meutcc.backend.content.attempt;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.meutcc.backend.content.answer.AnswerResponseDTO;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@JsonInclude(JsonInclude.Include.NON_NULL)
public record AttemptResponseDTO(
        Long id,
        Long exerciseId,
        String exerciseTitle,
        Long studentId,
        String studentName,
        String studentEmail,
        Integer attemptNumber,
        String status,
        LocalDateTime startedAt,
        LocalDateTime submittedAt,
        LocalDateTime gradedAt,
        Integer timeSpent,
        Integer remainingTime,
        BigDecimal score,
        BigDecimal percentage,
        Boolean passed,
        String teacherFeedback,
        Integer totalQuestions,
        Integer answeredQuestions,
        List<AnswerResponseDTO> answers,
        LocalDateTime createdAt
) {}