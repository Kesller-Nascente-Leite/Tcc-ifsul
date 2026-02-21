package com.meutcc.backend.auth.dto;

import jakarta.validation.constraints.NotNull;

public record LoginRequest(
        @NotNull(message = "E-mail precisa ser preenchido")
        String email,
        @NotNull(message = "Senha precisa ser preenchida")
        String password) {
}
