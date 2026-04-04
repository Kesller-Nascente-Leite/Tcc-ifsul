package com.meutcc.backend.common.config;

import com.meutcc.backend.user.role.RoleRepository;
import com.meutcc.backend.user.role.Roles;
import com.meutcc.backend.user.User;
import com.meutcc.backend.user.UserRepository;
import lombok.AllArgsConstructor;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.core.annotation.Order;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
@AllArgsConstructor
@Order(1) // Run after RoleSeeder
public class UserSeeder implements ApplicationRunner {

    private UserRepository userRepository;
    private RoleRepository roleRepository;
    private PasswordEncoder passwordEncoder;

    @Override
    public void run(ApplicationArguments args) {
        if (userRepository.count() == 0) {
            Roles adminRole = roleRepository.findByName("ADMIN").orElseThrow();
            Roles teacherRole = roleRepository.findByName("TEACHER").orElseThrow();
            Roles studentRole = roleRepository.findByName("STUDENT").orElseThrow();

            User admin = new User();
            admin.setFullName("Admin User");
            admin.setEmail("admin@example.com");
            admin.setPassword(passwordEncoder.encode("password"));
            admin.setRole(adminRole);
            userRepository.save(admin);

            User mainTeacher = new User();
            mainTeacher.setFullName("Professor Principal");
            mainTeacher.setEmail("teacher@example.com");
            mainTeacher.setPassword(passwordEncoder.encode("password"));
            mainTeacher.setRole(teacherRole);

            User teacher1 = new User();
            teacher1.setFullName("Professor João Silva");
            teacher1.setEmail("joao.silva@school.com");
            teacher1.setPassword(passwordEncoder.encode("password"));
            teacher1.setRole(teacherRole);

            User teacher2 = new User();
            teacher2.setFullName("Professora Maria Santos");
            teacher2.setEmail("maria.santos@school.com");
            teacher2.setPassword(passwordEncoder.encode("password"));
            teacher2.setRole(teacherRole);

            User teacher3 = new User();
            teacher3.setFullName("Professor Carlos Oliveira");
            teacher3.setEmail("carlos.oliveira@school.com");
            teacher3.setPassword(passwordEncoder.encode("password"));
            teacher3.setRole(teacherRole);

            User teacher4 = new User();
            teacher4.setFullName("Professora Ana Pereira");
            teacher4.setEmail("ana.pereira@school.com");
            teacher4.setPassword(passwordEncoder.encode("password"));
            teacher4.setRole(teacherRole);

            User teacher5 = new User();
            teacher5.setFullName("Professor Roberto Lima");
            teacher5.setEmail("roberto.lima@school.com");
            teacher5.setPassword(passwordEncoder.encode("password"));
            teacher5.setRole(teacherRole);

            userRepository.saveAll(List.of(mainTeacher,teacher1, teacher2, teacher3, teacher4, teacher5));

            // Create 5 students
            User student1 = new User();
            student1.setFullName("Aluno Pedro Alves");
            student1.setEmail("pedro.alves@student.com");
            student1.setPassword(passwordEncoder.encode("password"));
            student1.setRole(studentRole);

            User student2 = new User();
            student2.setFullName("Aluna Sofia Costa");
            student2.setEmail("sofia.costa@student.com");
            student2.setPassword(passwordEncoder.encode("password"));
            student2.setRole(studentRole);

            User student3 = new User();
            student3.setFullName("Aluno Lucas Ferreira");
            student3.setEmail("lucas.ferreira@student.com");
            student3.setPassword(passwordEncoder.encode("password"));
            student3.setRole(studentRole);

            User student4 = new User();
            student4.setFullName("Aluna Beatriz Rodrigues");
            student4.setEmail("beatriz.rodrigues@student.com");
            student4.setPassword(passwordEncoder.encode("password"));
            student4.setRole(studentRole);

            User student5 = new User();
            student5.setFullName("Aluno Gabriel Martins");
            student5.setEmail("gabriel.martins@student.com");
            student5.setPassword(passwordEncoder.encode("password"));
            student5.setRole(studentRole);

            userRepository.saveAll(List.of(student1, student2, student3, student4, student5));

            System.out.println("✅ Users seeded");
        }
    }
}
