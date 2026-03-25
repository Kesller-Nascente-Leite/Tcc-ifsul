package com.meutcc.backend.content.exercise.dtos;

import com.fasterxml.jackson.annotation.JsonInclude;

import java.math.BigDecimal;

@JsonInclude(JsonInclude.Include.NON_NULL)
public record ExerciseStatisticsDTO(
        Integer totalStudents,
        Integer totalAttempts,
        BigDecimal averageScore,
        BigDecimal averagePercentage,
        Integer passedCount,
        Integer failedCount,
        Double passRate,
        Integer averageTimeSpent,
        BigDecimal highestScore,
        BigDecimal lowestScore
) {
}