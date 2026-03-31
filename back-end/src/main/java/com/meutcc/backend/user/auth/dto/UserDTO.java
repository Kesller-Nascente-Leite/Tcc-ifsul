package com.meutcc.backend.user.auth.dto;


public record UserDTO(
        Long id,
        String fullName,
        String email,
        String role
) {
}
