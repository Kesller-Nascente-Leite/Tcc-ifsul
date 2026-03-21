package com.meutcc.backend.content.question;

import com.fasterxml.jackson.annotation.JsonInclude;

import java.util.List;

@JsonInclude(JsonInclude.Include.NON_NULL)
public record QuestionResponseDTO(
        Long id,
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