package com.meutcc.backend.common.config;

import com.meutcc.backend.user.*;
import com.meutcc.backend.content.courses.Course;
import com.meutcc.backend.content.courses.CourseRepository;
import lombok.AllArgsConstructor;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Component;
import org.springframework.core.annotation.Order;

@Component
@AllArgsConstructor
@Order(2)
public class TeacherSeeder implements ApplicationRunner {

    private TeacherRepository teacherRepository;
    private UserRepository userRepository;
    private RoleRepository roleRepository;
    private BCryptPasswordEncoder bCryptPasswordEncoder;
    private CourseRepository courseRepository;

    public void run(ApplicationArguments args) {
        if (teacherRepository.count() == 0) {
            // Busca o role de TEACHER
            Roles teacherRole = roleRepository.findAll().stream()
                    .filter(role -> "TEACHER".equals(role.getName()))
                    .findFirst()
                    .orElse(null);

            if (teacherRole != null) {
                // Cria um usuário padrão para o teacher
                User teacherUser = new User();
                teacherUser.setFullName("Professor Padrão");
                teacherUser.setEmail("teacher@example.com");
                teacherUser.setPassword(bCryptPasswordEncoder.encode("password"));
                teacherUser.setAvatarUrl(null);
                teacherUser.setRole(teacherRole);

                // Salva o usuário
                User savedUser = userRepository.save(teacherUser);

                // Cria o teacher
                Teacher teacher = Teacher.builder()
                        .user(savedUser)
                        .build();

                // Salva o teacher e cria uma turma (Course) padrão associada
                Teacher savedTeacher = teacherRepository.save(teacher);

                Course defaultCourse = Course.builder()
                        .title("Turma Padrão")
                        .description("Turma inicial criada automaticamente")
                        .published(false)
                        .teacher(savedTeacher)
                        .build();

                courseRepository.save(defaultCourse);
            }
        }
    }
}
