package com.meutcc.backend.auth.dto;

import jakarta.validation.constraints.NotNull;

//responsavel por transporta dados entre camadas
// esse recebe a requisição e envia para o controller
public record RegisterRequest(
        @NotNull(message = "O nome precisa ser preenchido")
        String fullName,
        @NotNull(message = "O E-mail precisa ser preenchido")
        String email,
        @NotNull(message = "A senha precisa ser preenchida")
        String password) {
}
