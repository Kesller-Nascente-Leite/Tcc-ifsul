package com.meutcc.backend.user.security;

import com.meutcc.backend.content.courses.Course;
import com.meutcc.backend.teacher.Teacher;
import com.meutcc.backend.teacher.TeacherRepository;
import com.meutcc.backend.user.User;
import com.meutcc.backend.user.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class AuthenticationService {

    private final UserRepository userRepository;
    private final TeacherRepository teacherRepository;

    @Transactional(readOnly = true)
    public Teacher getAuthenticatedTeacher() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

        if (authentication == null || !authentication.isAuthenticated()) {
            throw new IllegalStateException("Usuário não autenticado");
        }

        String email = authentication.getName();

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new IllegalStateException("Usuário não encontrado: " + email));

        return teacherRepository.findByUser(user)
                .orElseThrow(() -> new IllegalStateException("Professor não encontrado para o usuário: " + email));
    }

    @Transactional(readOnly = true)
    public User getAuthenticatedUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

        if (authentication == null || !authentication.isAuthenticated()) {
            throw new IllegalStateException("Usuário não autenticado");
        }

        String email = authentication.getName();

        return userRepository.findByEmail(email)
                .orElseThrow(() -> new IllegalStateException("Usuário não encontrado: " + email));
    }

    public String getAuthenticatedUserEmail() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

        if (authentication == null || !authentication.isAuthenticated()) {
            throw new IllegalStateException("Usuário não autenticado");
        }

        return authentication.getName();
    }
}