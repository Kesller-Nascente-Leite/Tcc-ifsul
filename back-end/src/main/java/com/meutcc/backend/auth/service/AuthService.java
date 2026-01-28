package com.meutcc.backend.auth.service;

import com.meutcc.backend.auth.dto.ApiResponse;
import com.meutcc.backend.auth.dto.RegisterRequest;
import com.meutcc.backend.auth.mapper.UserMapper;
import com.meutcc.backend.common.exceptions.UserAlreadyExistException;
import com.meutcc.backend.user.*;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.ArrayList;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final RoleRepository roleRepository;
    private final UserRepository userRepository;
    private final UserMapper mapper;
    private final StudentRepository studentRepository;
    private final PasswordEncoder passwordEncoder;

    public ApiResponse register(RegisterRequest dto) {

        if (userRepository.existsByEmail(dto.email())) {
            throw new UserAlreadyExistException("Email já cadastrado");
        }

        User user = mapper.toEntity(dto);

        Roles StudentRole = roleRepository.findById((byte) 3).orElseThrow(() -> new RuntimeException("Role não encontrado"));

        user.setPassword(passwordEncoder.encode(dto.password()));
        user.setRole(StudentRole);

        User savedUser = userRepository.save(user);

        Student student = Student.builder()
                .user(savedUser)
                .subjects(new ArrayList<>())
                .build();
        studentRepository.save(student);
        return new ApiResponse("Usuário cadastrado com sucesso");
    }


}
