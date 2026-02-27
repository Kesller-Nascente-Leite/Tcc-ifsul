package com.meutcc.backend.auth.controller;

import com.meutcc.backend.auth.dto.LoginResponse;
import com.meutcc.backend.auth.service.AuthService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    AuthService authService;

    @GetMapping("/validate")
    public ResponseEntity<Map<String, String>> validate() {
        return ResponseEntity.ok(Map.of("message", "É valido"));
    }

    @PostMapping("/refresh")
    public LoginResponse refresh(@RequestBody Map<String, String> request) {
        String refreshToken = request.get("refreshToken");
        return authService.refreshToken(refreshToken);

    }
}