package com.meutcc.backend.auth.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/auth")
public class AuthController {
    @GetMapping("/validate")
    public ResponseEntity<Map<String, String>> validate() {
        return ResponseEntity.ok(Map.of("message", "É valido"));
    }

    @PostMapping("/refresh")
    public ResponseEntity<?> refresh(@RequestBody Map<String, String> request) {
        String refreshToken = request.get("refreshToken");

        // Aqui você deve implementar a lógica para:
        // 1. Validar o refresh token no banco de dados ou via JWT
        // 2. Gerar um novo Access Token

        // Exemplo de retorno esperado pelo seu frontend:
        // return ResponseEntity.ok(new LoginResponse(newAccessToken, refreshToken));
        return ResponseEntity.ok().build();
    }
}