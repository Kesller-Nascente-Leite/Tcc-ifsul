package com.meutcc.backend.student;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.meutcc.backend.content.attempt.AttemptSummaryDTO;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@JsonInclude(JsonInclude.Include.NON_NULL)
public record StudentProgressDTO(
        Long studentId,
        String studentName,
        Integer totalAttempts,
        BigDecimal bestScore,
        BigDecimal bestPercentage,
        Boolean hasPassed,
        LocalDateTime lastSubmission,
        List<AttemptSummaryDTO> attempts
) {
}
