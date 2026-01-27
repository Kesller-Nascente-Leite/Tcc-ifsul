package com.meutcc.backend.auth.dto;

// esse envia a requisição e envia de volta para o front
public record UserResponse(Long id, String fullName, String email) {
}
