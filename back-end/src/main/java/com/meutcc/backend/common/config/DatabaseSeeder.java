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
@Order(5)
public class DatabaseSeeder implements CommandLineRunner {

    private final RoleRepository roleRepository;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Value("${SEED_ADMIN_PASSWORD:admin123}")
    private String adminPassword;

    @Value("${SEED_TEACHER_PASSWORD:professor123}")
    private String teacherPassword;

    @Value("${SEED_STUDENT_PASSWORD:aluno123}")
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

            // Teacher user
            User teacher = new User();
            teacher.setFullName("Professor João");
            teacher.setEmail("professor@tcc.com");
            teacher.setPassword(passwordEncoder.encode(teacherPassword));
            teacher.setRole(teacherRole);
            userRepository.save(teacher);

            // Student users
            User student1 = new User();
            student1.setFullName("Aluno Maria");
            student1.setEmail("maria@tcc.com");
            student1.setPassword(passwordEncoder.encode(studentPassword));
            student1.setRole(studentRole);
            userRepository.save(student1);

            User student2 = new User();
            student2.setFullName("Aluno Pedro");
            student2.setEmail("pedro@tcc.com");
            student2.setPassword(passwordEncoder.encode(studentPassword));
            student2.setRole(studentRole);
            userRepository.save(student2);

            System.out.println("✅ Users seeded");
        }
    }
}
