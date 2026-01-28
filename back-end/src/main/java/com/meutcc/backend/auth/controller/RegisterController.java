package com.meutcc.backend.auth.controller;

import com.meutcc.backend.auth.dto.ApiResponse;
import com.meutcc.backend.auth.dto.RegisterRequest;
import com.meutcc.backend.auth.service.AuthService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@CrossOrigin(origins = "*")
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class RegisterController {

    private final AuthService authService;

    @PostMapping("/register")
    public ResponseEntity<ApiResponse> register(@RequestBody @Valid RegisterRequest data) {
        ApiResponse response = authService.register(data);
            return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }
}
