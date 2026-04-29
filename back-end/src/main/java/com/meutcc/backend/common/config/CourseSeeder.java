package com.meutcc.backend.common.config;

import com.meutcc.backend.content.courses.Course;
import com.meutcc.backend.content.courses.CourseRepository;
import com.meutcc.backend.teacher.Teacher;
import com.meutcc.backend.teacher.TeacherRepository;
import com.meutcc.backend.user.UserRepository;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.jspecify.annotations.NonNull;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.core.annotation.Order;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Component
@AllArgsConstructor
@Order(3)
@Slf4j
public class CourseSeeder implements ApplicationRunner {

    private CourseRepository courseRepository;
    private TeacherRepository teacherRepository;
    private UserRepository userRepository;

    @Override
    @Transactional
    public void run(@NonNull ApplicationArguments args) {
        if (courseRepository.count() == 0) {
            List<Teacher> teachers = teacherRepository.findAll();
            if (!teachers.isEmpty()) {
                // Busca o professor principal de preferência
                Teacher mainTeacher = getMainTeacher(teachers);

                List<Course> courses = List.of(
                        Course.builder()
                                .title("Introdução à Programação")
                                .description("Conceitos básicos de lógica, variáveis e estruturas de controle.")
                                .published(true)
                                .isPrivate(false)
                                .teacher(mainTeacher)
                                .build(),
                        Course.builder()
                                .title("Java e Spring Boot")
                                .description("Curso prático sobre Java moderno e desenvolvimento com Spring Boot.")
                                .published(true)
                                .isPrivate(false)
                                .teacher(teachers.get(1 % teachers.size()))
                                .build(),
                        Course.builder()
                                .title("Estruturas de Dados e Algoritmos")
                                .description("Fundamentos de estruturas de dados, complexidade e algoritmos comuns.")
                                .published(false)
                                .isPrivate(true)
                                .teacher(teachers.get(2 % teachers.size()))
                                .build(),
                        Course.builder()
                                .title("Desenvolvimento Front-end")
                                .description("HTML, CSS, JavaScript e frameworks modernos para interfaces web.")
                                .published(true)
                                .isPrivate(false)
                                .teacher(teachers.get(3 % teachers.size()))
                                .build(),
                        Course.builder()
                                .title("Banco de Dados e SQL")
                                .description("Modelagem relacional, consultas SQL e boas práticas em bancos de dados.")
                                .published(false)
                                .isPrivate(false)
                                .teacher(mainTeacher)
                                .build(),
                        Course.builder()
                                .title("DevOps Básico")
                                .description("Introdução a CI/CD, containers e automação de deploy.")
                                .published(false)
                                .isPrivate(true)
                                .teacher(mainTeacher)
                                .build()
                );

                courseRepository.saveAll(courses);
                log.info("✅ {} cursos criados (Banco de Dados atribuído ao Professor Principal)", courses.size());
            }
        }
    }

    private Teacher getMainTeacher(List<Teacher> teachers) {
        // Busca o professor com usuário chamado "Professor Principal"
        for (Teacher teacher : teachers) {
            if (teacher.getUser() != null && "Professor Principal".equalsIgnoreCase(teacher.getUser().getFullName())) {
                log.info("Professor Principal encontrado: {}", teacher.getUser().getFullName());
                return teacher;
            }
        }

        // Se não encontrar, retorna o primeiro
        log.warn("Professor Principal não encontrado. Usando primeiro professor da lista.");
        return teachers.getFirst();
    }
}

