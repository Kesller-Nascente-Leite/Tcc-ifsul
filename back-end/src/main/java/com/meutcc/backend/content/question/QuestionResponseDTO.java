package com.meutcc.backend.content.question;

import com.meutcc.backend.content.question.dtos.QuestionOptionResponseDTO;

import java.util.List;
public record QuestionResponseDTO(
        Long id,
        String statement,
        QuestionType type,
        Integer points,
        List<QuestionOptionResponseDTO> options,
        String explanation
) {}