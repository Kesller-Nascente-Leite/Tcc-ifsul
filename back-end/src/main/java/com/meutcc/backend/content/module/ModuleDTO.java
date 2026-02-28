package com.meutcc.backend.content.module;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record ModuleDTO(

        Long id,

        @NotBlank(message = "Título obrigatorio.")
        @Size(min = 3, max = 100, message = "Título deve ter entre 3 e 100 caracteres.")
        String title,

        @NotBlank(message = "Descrição necessaria para a criação do módulo.")
        @Size(min = 10, message = "Descrição deve ter pelo menos 10 caracteres")
        String description,

        Long courseId
) {
}
