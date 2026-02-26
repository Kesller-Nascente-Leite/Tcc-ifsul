package com.meutcc.backend.auth.service;

import com.meutcc.backend.auth.dto.*;
import com.meutcc.backend.auth.mapper.UserMapper;
import com.meutcc.backend.common.exceptions.UserException;
import com.meutcc.backend.common.security.RoleIds;
import com.meutcc.backend.role.RoleRepository;
import com.meutcc.backend.role.Roles;
import com.meutcc.backend.student.Student;
import com.meutcc.backend.student.StudentRepository;
import com.meutcc.backend.user.*;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
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
    private final AuthenticationManager authenticationManager;
    private final JwtService jwtService;

    public ApiResponse register(RegisterRequest dto) {

        existsByEmail(dto.email());

        User user = mapper.toEntity(dto);

        Roles StudentRole = roleRepository.findById(RoleIds.STUDENT)
                .orElseThrow(() -> new IllegalStateException("role não encontrado"));

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

    public LoginResponse login(LoginRequest dto) {
        authenticationManager.authenticate(
                //isso valida as crendenciais
                new UsernamePasswordAuthenticationToken(dto.email(), dto.password())
        );
        User user = userRepository.findByEmail(dto.email())
                .orElseThrow(() -> new UsernameNotFoundException("Usuário não encontrado"));

        String accessToken = jwtService.generateTokenForUser(user);

        UserDTO userDTO = new UserDTO(
                user.getId(),
                user.getFullName(),
                user.getEmail(),
                user.getRole().getName()
        );

        return new LoginResponse(
                accessToken,
                null,
                userDTO,
                "Login realizado com sucesso"

        );
    }

    private void existsByEmail(String email) {
        if (userRepository.existsByEmail(email)) {
            throw new UserException("Email já cadastrado");
        }
    }

}
