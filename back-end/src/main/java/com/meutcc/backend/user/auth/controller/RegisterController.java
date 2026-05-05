package com.meutcc.backend.user.auth.controller;

import com.meutcc.backend.user.auth.dto.ApiResponse;
import com.meutcc.backend.user.auth.dto.RegisterRequest;
import com.meutcc.backend.user.auth.service.AuthService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class RegisterController {

    private final AuthService authService;

    @PostMapping("/register")
    @ResponseStatus(HttpStatus.CREATED)
    public ResponseEntity<ApiResponse> register(@RequestBody @Valid RegisterRequest data) {
        ApiResponse response = authService.register(data);
            return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }
}
