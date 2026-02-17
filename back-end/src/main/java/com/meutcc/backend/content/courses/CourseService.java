package com.meutcc.backend.content.courses;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.RequestBody;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class CourseService {

    private final CourseRepository courseRepository;

    public List<CourseDTO> findAllCourses() {
        return courseRepository.findAll().stream()
                .map(c -> new CourseDTO(
                        c.getId(),
                        c.getTitle(),
                        c.getDescription(),
                        c.isPublished(),
                        c.getTeacher() != null ? c.getTeacher().getId() : null,
                        c.getTeacher() != null ? c.getTeacher().getUser().getFullName() : null
                ))
                .collect(Collectors.toList());
    }

    public CourseDTO createCourse(@RequestBody CourseDTO courseDTO) {
        Course savedCourse = new Course();
        //Criar mapper para chamar e add os valores do DTO
        savedCourse.
        return courseRepository.save(courseDTO);
    }
}

