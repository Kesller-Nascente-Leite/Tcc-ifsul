package com.meutcc.backend.auth.controller;

import com.meutcc.backend.auth.dto.LoginRequest;
import com.meutcc.backend.auth.dto.LoginResponse;
import com.meutcc.backend.auth.service.AuthService;
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
    @ResponseBody
    public ResponseEntity<LoginResponse> login(@RequestBody LoginRequest data) {
        LoginResponse response = authService.login(data);
        return ResponseEntity.status(HttpStatus.OK).body(response);
    }
}
