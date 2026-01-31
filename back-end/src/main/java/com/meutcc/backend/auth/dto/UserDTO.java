package com.meutcc.backend.auth.dto;

import com.meutcc.backend.user.Roles;

public record UserDTO(
        Long id,
        String fullName,
        String email,
        String role
) {
}
