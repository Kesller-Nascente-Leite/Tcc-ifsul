package com.meutcc.backend.common.config;

import com.meutcc.backend.content.courses.Course;
import com.meutcc.backend.content.courses.CourseRepository;
import com.meutcc.backend.teacher.Teacher;
import com.meutcc.backend.teacher.TeacherRepository;
import lombok.AllArgsConstructor;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.core.annotation.Order;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
@AllArgsConstructor
@Order(3)
public class CourseSeeder implements ApplicationRunner {

    private CourseRepository courseRepository;
    private TeacherRepository teacherRepository;

    @Override
    public void run(ApplicationArguments args) {
        if (courseRepository.count() == 0) {
            Teacher teacher = teacherRepository.findAll().stream().findFirst().orElse(null);
            if (teacher != null) {
                List<Course> courses = List.of(
                        Course.builder()
                                .title("Introdução à Programação")
                                .description("Conceitos básicos de lógica, variáveis e estruturas de controle.")
                                .published(true)
                                .teacher(teacher)
                                .build(),
                        Course.builder()
                                .title("Java e Spring Boot")
                                .description("Curso prático sobre Java moderno e desenvolvimento com Spring Boot.")
                                .published(true)
                                .teacher(teacher)
                                .build(),
                        Course.builder()
                                .title("Estruturas de Dados e Algoritmos")
                                .description("Fundamentos de estruturas de dados, complexidade e algoritmos comuns.")
                                .published(false)
                                .teacher(teacher)
                                .build(),
                        Course.builder()
                                .title("Desenvolvimento Front-end")
                                .description("HTML, CSS, JavaScript e frameworks modernos para interfaces web.")
                                .published(true)
                                .teacher(teacher)
                                .build(),
                        Course.builder()
                                .title("Banco de Dados e SQL")
                                .description("Modelagem relacional, consultas SQL e boas práticas em bancos de dados.")
                                .published(false)
                                .teacher(teacher)
                                .build(),
                        Course.builder()
                                .title("DevOps Básico")
                                .description("Introdução a CI/CD, containers e automação de deploy.")
                                .published(false)
                                .teacher(teacher)
                                .build()
                );

                courseRepository.saveAll(courses);
            }
        }
    }
}

