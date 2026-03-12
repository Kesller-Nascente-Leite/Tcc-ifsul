package com.meutcc.backend.content.exercise;


import com.meutcc.backend.content.question.QuestionType;

import java.time.LocalDateTime;

public record ExerciseFilterDTO(
        Long lessonId,
        Boolean isActive,
        Boolean isAvailable,
        QuestionType questionType,
        LocalDateTime startDate,
        LocalDateTime endDate
) {}