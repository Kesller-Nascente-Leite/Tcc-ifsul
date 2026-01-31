package com.meutcc.backend.auth.controller;

import com.meutcc.backend.auth.dto.LoginRequest;
import com.meutcc.backend.auth.service.AuthService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "*")
@RequiredArgsConstructor
public class LoginController {
    private final AuthService authService;

    @PostMapping("/login")
    @ResponseBody
    public ResponseEntity<UserDetails> login(@RequestBody LoginRequest data) {
        UserDetails userDetails = authService.loadUserByUsername(data.email());
        return ResponseEntity.status(HttpStatus.OK).body(userDetails);
    }
}
