package com.meutcc.backend.content.question.dtos;

import com.meutcc.backend.content.question.QuestionType;
import jakarta.validation.constraints.Min;

import java.util.List;

public record UpdateQuestionDTO(
        QuestionType type,
        String questionText,
        String explanation,
        String imageUrl,
        String videoUrl,

        @Min(value = 1, message = "Pontos devem ser maior que 0")
        Integer points,

        @Min(value = 0, message = "Ordem deve ser maior ou igual a 0")
        Integer order,

        Boolean isRequired,
        QuestionConfigDTO config,
        List<CreateQuestionOptionDTO> options
) {
}
