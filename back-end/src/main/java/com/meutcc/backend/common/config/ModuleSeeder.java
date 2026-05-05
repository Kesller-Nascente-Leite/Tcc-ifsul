package com.meutcc.backend.common.config;

import com.meutcc.backend.content.courses.Course;
import com.meutcc.backend.content.courses.CourseRepository;
import com.meutcc.backend.content.module.Module;
import com.meutcc.backend.content.module.ModuleRepository;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.core.annotation.Order;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
@AllArgsConstructor
@Order(5)
@Slf4j
public class ModuleSeeder implements ApplicationRunner {

    private ModuleRepository moduleRepository;
    private CourseRepository courseRepository;

    @Override
    public void run(ApplicationArguments args) {
        if (moduleRepository.count() == 0) {
            List<Course> courses = courseRepository.findAll();

            for (Course course : courses) {
                // Pula "Banco de Dados e SQL" pois já tem seus módulos criados pelo DatabaseCourseSeeder
                if (course.getTitle().equals("Banco de Dados e SQL")) {
                    log.info("Pulando '{}' - já possui módulos do DatabaseCourseSeeder", course.getTitle());
                    continue;
                }

                Module module = new Module();
                module.setTitle("Módulo Básico de " + course.getTitle());
                module.setDescription("Introdução aos conceitos fundamentais de " + course.getTitle() + ".");
                module.setOrderIndex(1);
                module.setCourse(course);
                moduleRepository.save(module);

                log.info("Módulo criado para: {}", course.getTitle());
            }

            log.info("✅ Módulos seeded para cursos");
        }
    }
}


