package com.meutcc.backend.auth.dto;

//responsavel por transporta dados entre camadas
// esse recebe a requisição e envia para o controller
public record RegisterRequest(String fullName, String email, String password) {
}
