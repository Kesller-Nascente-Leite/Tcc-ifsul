package com.meutcc.backend.common.config;

import com.meutcc.backend.user.role.RoleRepository;
import com.meutcc.backend.user.role.Roles;
import com.meutcc.backend.user.User;
import com.meutcc.backend.user.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Profile;
import org.springframework.core.annotation.Order;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
@Profile("!prod")
@Order(1)
public class DatabaseSeeder implements CommandLineRunner {

    private final RoleRepository roleRepository;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Value("${SEED_ADMIN_PASSWORD:password}")
    private String adminPassword;

    @Value("${SEED_TEACHER_PASSWORD:password}")
    private String teacherPassword;

    @Value("${SEED_STUDENT_PASSWORD:password}")
    private String studentPassword;

    @Override
    public void run(String... args) throws Exception {
        seedRoles();
        seedUsers();
        System.out.println("✅ Database seeding completed!");
    }

    private void seedRoles() {
        if (roleRepository.count() == 0) {
            roleRepository.save(new Roles((byte) 1, "ADMIN"));
            roleRepository.save(new Roles((byte) 2, "TEACHER"));
            roleRepository.save(new Roles((byte) 3, "STUDENT"));
            System.out.println("✅ Roles seeded");
        }
    }

    private void seedUsers() {
        if (userRepository.count() == 0) {
            // Buscar roles
            Roles adminRole = roleRepository.findById((byte) 1).orElseThrow();
            Roles teacherRole = roleRepository.findById((byte) 2).orElseThrow();
            Roles studentRole = roleRepository.findById((byte) 3).orElseThrow();

            // Admin user
            User admin = new User();
            admin.setFullName("Administrador");
            admin.setEmail("admin@tcc.com");
            admin.setPassword(passwordEncoder.encode(adminPassword));
            admin.setRole(adminRole);
            userRepository.save(admin);

            // Teacher users
            User mainTeacher = new User();
            mainTeacher.setFullName("Professor Principal");
            mainTeacher.setEmail("teacher@example.com");
            mainTeacher.setPassword(passwordEncoder.encode(teacherPassword));
            mainTeacher.setRole(teacherRole);
            userRepository.save(mainTeacher);
            for (int i = 1; i <= 5; i++) {
                User teacher = new User();
                teacher.setFullName("Professor " + i);
                teacher.setEmail("Professor" + i + "@tcc.com");
                teacher.setPassword(passwordEncoder.encode(teacherPassword));
                teacher.setRole(teacherRole);
                userRepository.save(teacher);
            }

            // Student users
            for (int i = 1; i <= 5; i++) {
                User student = new User();
                student.setFullName("Aluno " + i);
                student.setEmail("aluno" + i + "@tcc.com");
                student.setPassword(passwordEncoder.encode(studentPassword));
                student.setRole(studentRole);
                userRepository.save(student);
            }

            System.out.println("✅ Users seeded");
        }
    }
}
