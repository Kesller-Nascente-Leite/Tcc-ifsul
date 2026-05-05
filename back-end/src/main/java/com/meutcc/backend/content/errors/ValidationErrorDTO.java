package com.meutcc.backend.content.errors;

public record ValidationErrorDTO(
        String field,
        String message,
        Object rejectedValue
) {}