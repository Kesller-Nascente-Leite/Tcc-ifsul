package com.meutcc.backend.content.answer;

import jakarta.validation.constraints.NotNull;

import java.util.List;
import java.util.Map;

public record SubmitAnswerDTO(
        @NotNull(message = "ID da tentativa é obrigatório")
        Long attemptId,

        @NotNull(message = "ID da questão é obrigatório")
        Long questionId,

        List<Long> selectedOptions,
        String textAnswer,
        List<Long> orderAnswer,
        Map<Long, String> matchAnswer
) {}