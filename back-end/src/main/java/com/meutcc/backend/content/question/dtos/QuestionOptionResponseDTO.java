package com.meutcc.backend.content.question.dtos;


import com.fasterxml.jackson.annotation.JsonInclude;

@JsonInclude(JsonInclude.Include.NON_NULL)
public record QuestionOptionResponseDTO(
        Long id,
        String optionText,
        String imageUrl,
        Boolean isCorrect,
        Integer order,
        String feedback,
        String matchPair,
        Integer correctPosition
) {
}