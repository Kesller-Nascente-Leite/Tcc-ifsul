package com.meutcc.backend.content.attempt;

import java.time.LocalDateTime;

public record AttemptFilterDTO(
        Long exerciseId,
        Long studentId,
        String status,
        Boolean passed,
        LocalDateTime startDate,
        LocalDateTime endDate
) {}