package com.meutcc.backend.user.auth.dto;

public record LoginResponse(
        String accessToken,
        String refreshToken,
        UserDTO user,
        String message) {
}
