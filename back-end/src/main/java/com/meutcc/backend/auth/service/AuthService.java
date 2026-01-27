package com.meutcc.backend.auth.service;

import com.meutcc.backend.auth.dto.RegisterRequest;
import com.meutcc.backend.auth.dto.UserResponse;
import com.meutcc.backend.auth.mapper.UserMapper;
import com.meutcc.backend.common.exceptions.UserAlreadyExistException;
import com.meutcc.backend.user.User;
import com.meutcc.backend.user.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthService {
    private final UserRepository repository;
    private final UserMapper mapper;
    private final PasswordEncoder passwordEncoder;

    public UserResponse register(RegisterRequest dto) {
        if (repository.existsByEmail(dto.email())) {
            throw new UserAlreadyExistException("Email já cadastrado");
        }

        User user = mapper.toEntity(dto);

        user.setPassword(passwordEncoder.encode(user.getPassword()));

        User savedUser = repository.save(user);

        return mapper.toResponse(savedUser);
    }


}
