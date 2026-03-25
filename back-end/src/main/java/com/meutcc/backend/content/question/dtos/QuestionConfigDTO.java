package com.meutcc.backend.content.question.dtos;

import com.fasterxml.jackson.annotation.JsonInclude;

import java.util.List;

@JsonInclude(JsonInclude.Include.NON_NULL)
public record QuestionConfigDTO(
        Boolean caseSensitive,
        Boolean partialCredit,
        Integer minWords,
        Integer maxWords,
        List<String> acceptableAnswers,
        List<String> correctOrder,
        List<MatchingPairDTO> pairs
) {
}
