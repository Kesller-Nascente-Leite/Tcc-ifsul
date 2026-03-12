package com.meutcc.backend.content.question;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.util.ArrayList;
import java.util.List;

public record CreateQuestionDTO(
        @NotNull(message = "Tipo da questão é obrigatório")
        QuestionType type,

        @NotBlank(message = "Texto da questão é obrigatório")
        String questionText,

        String explanation,
        String imageUrl,
        String videoUrl,

        @Min(value = 1, message = "Pontos devem ser maior que 0")
        Integer points,

        Integer order,
        Boolean isRequired,

        QuestionConfigDTO config,

        List<CreateQuestionOptionDTO> options
) {
    // Construtor compacto
    public CreateQuestionDTO {
        if (points == null) points = 1;
        if (order == null) order = 0;
        if (isRequired == null) isRequired = true;
        if (options == null) options = new ArrayList<>();
    }
}
