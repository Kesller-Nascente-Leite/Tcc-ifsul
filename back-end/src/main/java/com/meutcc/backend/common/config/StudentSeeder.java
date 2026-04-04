package com.meutcc.backend.common.config;

import com.meutcc.backend.content.courses.Course;
import com.meutcc.backend.content.courses.CourseRepository;
import com.meutcc.backend.student.Student;
import com.meutcc.backend.student.StudentRepository;
import com.meutcc.backend.user.User;
import com.meutcc.backend.user.UserRepository;
import lombok.AllArgsConstructor;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.context.annotation.Profile;
import org.springframework.core.annotation.Order;
import org.springframework.stereotype.Component;

import java.util.List;

/**
 * DESABILITADO: Use ComprehensiveDataSeeder em vez disso.
 * Este seeder foi substituído por ComprehensiveDataSeeder que oferece funcionalidades aprimoradas.
 */
@Component
@AllArgsConstructor
@Order(6)
@Profile("disabled-student-seeder")
public class StudentSeeder implements ApplicationRunner {

    private StudentRepository studentRepository;
    private UserRepository userRepository;
    private CourseRepository courseRepository;

    @Override
    public void run(ApplicationArguments args) {
        if (studentRepository.count() == 0) {
            List<User> studentUsers = userRepository.findAll().stream()
                    .filter(user -> user.getRole() != null && "STUDENT".equals(user.getRole().getName()))
                    .toList();

            List<Course> courses = courseRepository.findAll();

            for (User user : studentUsers) {
                Student student = Student.builder()
                        .user(user)
                        .courses(courses)
                        .build();
                studentRepository.save(student);
            }
            System.out.println("✅ Students seeded and enrolled");
        }
    }
}


