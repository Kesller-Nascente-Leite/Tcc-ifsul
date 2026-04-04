package com.meutcc.backend.user.auth.service;

import com.meutcc.backend.user.auth.dto.*;
import com.meutcc.backend.user.auth.mapper.UserMapper;
import com.meutcc.backend.common.exceptions.UserAlreadyExistException;
import com.meutcc.backend.common.security.RoleIds;
import com.meutcc.backend.user.role.RoleRepository;
import com.meutcc.backend.user.role.Roles;
import com.meutcc.backend.student.Student;
import com.meutcc.backend.student.StudentRepository;
import com.meutcc.backend.user.User;
import com.meutcc.backend.user.UserException;
import com.meutcc.backend.user.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.oauth2.jwt.*;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.ArrayList;
import java.util.stream.Collectors;

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

    private final JwtDecoder jwtDecoder;

    private final JwtEncoder jwtEncoder;


    public ApiResponse register(RegisterRequest dto) {

        existsByEmail(dto.email());
        validatedEmail(dto.email());

        User user = mapper.toEntity(dto);

        Roles StudentRole = roleRepository.findById(RoleIds.STUDENT)
                .orElseThrow(() -> new IllegalStateException("role não encontrado"));

        user.setPassword(passwordEncoder.encode(dto.password()));
        user.setRole(StudentRole);

        User savedUser = userRepository.save(user);

        Student student = Student.builder()
                .user(savedUser)
                .courses(new ArrayList<>())
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

        String accessToken = jwtService.generateTokenForUser(user, 900L);
        String refreshToken = jwtService.generateTokenForUser(user, 86400L);
        UserDTO userDTO = new UserDTO(
                user.getId(),
                user.getFullName(),
                user.getEmail(),
                user.getRole().getName()
        );

        return new LoginResponse(
                accessToken,
                refreshToken,
                userDTO,
                "Login realizado com sucesso"

        );
    }

    public LoginResponse refreshToken(String refreshToken) {
        // Aqui você deve implementar a lógica para:
        // 1. Validar o refresh token no banco de dados ou via JWT
        Jwt decoderToken = jwtDecoder.decode(refreshToken);
        String username = decoderToken.getSubject();
        User user = userRepository.findByEmail(username)
                .orElseThrow(() -> new UserException("Usuário não está ativo"));

        String newAccessToken = jwtService.generateTokenForUser(user, 900L);
        String newRefreshToken = jwtService.generateTokenForUser(user, 86400L);

        return new LoginResponse(newAccessToken, newRefreshToken, null, null);
    }

    private void existsByEmail(String email) {
        if (userRepository.existsByEmail(email)) {
            throw new UserAlreadyExistException("Email já cadastrado");
        }
    }

    private void validatedEmail(String dataEmail) {
        if (dataEmail == null || dataEmail.isBlank()) {
            throw new UserException("Email não pode estar vazio");
        }
        int atIndex = dataEmail.indexOf("@");
        int lastDotIndex = dataEmail.lastIndexOf(".");
        if (atIndex < 1 || lastDotIndex <= atIndex + 1 || lastDotIndex == dataEmail.length() - 1) {
            throw new UserException("Email inválido.");
        }
    }

}
