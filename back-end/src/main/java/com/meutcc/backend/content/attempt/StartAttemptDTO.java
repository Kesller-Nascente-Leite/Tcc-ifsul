package com.meutcc.backend.content.attempt;

import jakarta.validation.constraints.NotNull;

import java.util.Map;

public record StartAttemptDTO(
        @NotNull(message = "ID do exercício é obrigatório")
        Long exerciseId,

        Map<String, Object> metadata
) {}