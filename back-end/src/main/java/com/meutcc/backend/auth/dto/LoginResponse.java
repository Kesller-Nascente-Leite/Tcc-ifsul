package com.meutcc.backend.auth.dto;

public record LoginResponse(
        String accessToken,
        String refreshToken, // Normalmente vai ser null
        UserDTO user,
        String message) {

}
