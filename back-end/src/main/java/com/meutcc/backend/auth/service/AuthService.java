package com.meutcc.backend.auth.service;

import com.meutcc.backend.auth.dto.ApiResponse;
import com.meutcc.backend.auth.dto.RegisterRequest;
import com.meutcc.backend.auth.mapper.UserMapper;
import com.meutcc.backend.common.exceptions.UserAlreadyExistException;
import com.meutcc.backend.user.*;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class AuthService implements UserDetailsService {

    private final RoleRepository roleRepository;
    private final UserRepository userRepository;
    private final UserMapper mapper;
    private final StudentRepository studentRepository;
    private final PasswordEncoder passwordEncoder;

    public ApiResponse register(RegisterRequest dto) {

        existsByEmail(dto.email());

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

    /*
        public LoginResponse login(LoginRequest dto) {
            loadUserByUsername(dto.email());
        }
    */
    private void existsByEmail(String email) {
        if (userRepository.existsByEmail(email)) {
            throw new UserAlreadyExistException("Email já cadastrado");
        }
    }

    @Override
    //Configurado no SecurityConfig para ser email no loadUserByUsername em vez de username
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        Optional<User> user = userRepository.findByEmail(email);
        if (!user.isPresent()) {
            throw new UsernameNotFoundException("Usuário não cadastrado.");
        }

        var userObj = user.get();
        return org.springframework.security.core.userdetails.User.builder()
                .username(userObj.getEmail())
                .password(userObj.getPassword())
                .roles(userObj.getRole().getName())
                .build();
    }
}
