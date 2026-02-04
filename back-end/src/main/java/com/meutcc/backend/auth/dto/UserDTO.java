package com.meutcc.backend.auth.dto;


public record UserDTO(
        Long id,
        String fullName,
        String email,
        String role
) {
}
