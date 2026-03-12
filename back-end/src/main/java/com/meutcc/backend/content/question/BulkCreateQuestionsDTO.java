package com.meutcc.backend.content.question;

import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;

import java.util.List;

public record BulkCreateQuestionsDTO(
        @NotNull(message = "ID do exercício é obrigatório")
        Long exerciseId,

        @NotEmpty(message = "Deve ter pelo menos uma questão")
        List<CreateQuestionDTO> questions
) {}