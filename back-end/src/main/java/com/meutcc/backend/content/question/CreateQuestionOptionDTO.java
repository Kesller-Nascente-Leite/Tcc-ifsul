package com.meutcc.backend.content.question;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public record CreateQuestionOptionDTO(
        @NotBlank(message = "Texto da opção é obrigatório")
        String optionText,

        String imageUrl,

        @NotNull(message = "Deve indicar se é a resposta correta")
        Boolean isCorrect,

        Integer order,
        String feedback,
        String matchPair,
        Integer correctPosition
) {
    public CreateQuestionOptionDTO {
        if (order == null) order = 0;
    }
}