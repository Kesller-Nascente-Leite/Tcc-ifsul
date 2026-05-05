package com.meutcc.backend.content.question;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.meutcc.backend.content.question.dtos.QuestionConfigDTO;
import com.meutcc.backend.content.question.dtos.QuestionOptionResponseDTO;

import java.util.List;

@JsonInclude(JsonInclude.Include.NON_NULL)
public record QuestionRequestDTO(
        Long id,
        Long exerciseId,
        QuestionType type,
        String questionText,
        String explanation,
        String imageUrl,
        String videoUrl,
        Integer points,
        Integer order,
        Boolean isRequired,
        QuestionConfigDTO config,
        List<QuestionOptionResponseDTO> options
) {}