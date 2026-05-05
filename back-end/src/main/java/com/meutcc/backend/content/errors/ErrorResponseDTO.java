package com.meutcc.backend.content.errors;

import com.fasterxml.jackson.annotation.JsonInclude;

import java.time.LocalDateTime;
import java.util.List;

@JsonInclude(JsonInclude.Include.NON_NULL)
public record ErrorResponseDTO(
        Integer status,
        String message,
        String error,
        String path,
        LocalDateTime timestamp,
        List<ValidationErrorDTO> validationErrors
) {}