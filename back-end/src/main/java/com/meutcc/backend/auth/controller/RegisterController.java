package com.meutcc.backend.auth.controller;

import com.meutcc.backend.auth.dto.RegisterRequest;
import com.meutcc.backend.auth.dto.UserResponse;
import com.meutcc.backend.auth.service.AuthService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class RegisterController {

    private final AuthService authService;

    @PostMapping("/register")
    @ResponseStatus(HttpStatus.CREATED)
    public UserResponse register(@RequestBody RegisterRequest dto) {
        return authService.register(dto);
    }
}
