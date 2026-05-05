package com.meutcc.backend.content.attachment;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

import java.time.LocalDateTime;

public record AttachmentDTO(
        Long id,

        @NotBlank(message = "Título é obrigatorio.")
        @Size(min = 5, max = 255)
        String title,

        @NotBlank(message = "Descrição é obrigatorio.")
        @Size(min = 5, max = 700)
        String description,

        String fileName,

        String fileUrl,

        AttachmentType type,

        LocalDateTime deliveryDate,
        Long lessonId
) {
}