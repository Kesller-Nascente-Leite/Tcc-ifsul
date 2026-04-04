package com.meutcc.backend.common.config;

import com.meutcc.backend.teacher.Teacher;
import com.meutcc.backend.teacher.TeacherRepository;
import com.meutcc.backend.user.User;
import com.meutcc.backend.user.UserRepository;
import lombok.AllArgsConstructor;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.core.annotation.Order;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.List;

@Component
@AllArgsConstructor
@Order(2)
public class TeacherSeeder implements ApplicationRunner {

    private TeacherRepository teacherRepository;
    private UserRepository userRepository;

    @Override
    public void run(ApplicationArguments args) {
        List<User> teacherUsers = userRepository.findAll().stream()
                .filter(user -> user.getRole() != null)
                .filter(user -> "TEACHER".equalsIgnoreCase(user.getRole().getName()))
                .toList();

        int createdTeachers = 0;

        for (User user : teacherUsers) {
            if (teacherRepository.findByUser(user).isPresent()) {
                continue;
            }

            teacherRepository.save(Teacher.builder()
                    .user(user)
                    .courses(new ArrayList<>())
                    .build());
            createdTeachers++;
        }

        if (createdTeachers > 0) {
            System.out.println("Teachers seeded: " + createdTeachers);
        }
    }
}
