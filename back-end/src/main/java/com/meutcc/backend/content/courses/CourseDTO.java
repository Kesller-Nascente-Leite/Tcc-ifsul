package com.meutcc.backend.content.courses;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public record CourseDTO(

        Long id,

        @NotBlank(message = "Título é obrigatorio.")
        @Size(min = 3, max = 255, message = "Título deve ter entre 3 e 255 caracteres.")
        String title,

        @NotBlank(message = "Descrição necessaria para a criação de curso.")
        @Size(min = 10, message = "Descrição deve ter pelo menos 10 caracteres")
        String description,

        @NotNull(message = "Status de publicação deve ser informado")
        boolean published,

        Long teacherId,

        String teacherName
) {
}

