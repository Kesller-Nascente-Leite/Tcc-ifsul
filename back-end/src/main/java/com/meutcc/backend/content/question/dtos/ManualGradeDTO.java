package com.meutcc.backend.content.question.dtos;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotNull;

import java.math.BigDecimal;

public record ManualGradeDTO(
        @NotNull(message = "ID da resposta é obrigatório")
        Long answerId,

        @NotNull(message = "Deve indicar se está correto")
        Boolean isCorrect,

        @NotNull(message = "Pontos obtidos é obrigatório")
        @DecimalMin(value = "0.0", message = "Pontos devem ser maior ou igual a 0")
        BigDecimal pointsEarned,

        String feedback
) {}