package com.meutcc.backend.user.auth.controller;

import com.meutcc.backend.user.auth.dto.LoginRequest;
import com.meutcc.backend.user.auth.dto.LoginResponse;
import com.meutcc.backend.user.auth.service.AuthService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class LoginController {
    private final AuthService authService;

    @PostMapping("/login")
    @ResponseStatus(HttpStatus.OK)
    @ResponseBody
    public LoginResponse login(@Valid @RequestBody LoginRequest data) {
        System.out.println("EMAIL: " + data.email());
        System.out.println("PASSWORD: " + data.password());
        return authService.login(data);
    }
}
