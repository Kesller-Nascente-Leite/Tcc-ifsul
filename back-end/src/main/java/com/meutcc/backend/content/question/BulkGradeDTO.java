package com.meutcc.backend.content.question;

import jakarta.validation.constraints.NotEmpty;

import java.util.List;

public record BulkGradeDTO(
        @NotEmpty(message = "Deve ter pelo menos uma correção")
        List<ManualGradeDTO> grades
) {}