package com.meutcc.backend.content.attempt;

import com.fasterxml.jackson.annotation.JsonInclude;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@JsonInclude(JsonInclude.Include.NON_NULL)
public record AttemptSummaryDTO(
        Long id,
        Integer attemptNumber,
        String status,
        BigDecimal score,
        BigDecimal percentage,
        Boolean passed,
        Integer timeSpent,
        LocalDateTime submittedAt
) {}