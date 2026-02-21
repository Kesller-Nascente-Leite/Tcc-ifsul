package com.meutcc.backend.content.courses;

import com.meutcc.backend.common.exceptions.CourseNotFoundException;
import com.meutcc.backend.user.Teacher;
import com.meutcc.backend.user.TeacherRepository;
import com.meutcc.backend.user.User;
import com.meutcc.backend.user.UserRepository;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class CourseService {

    private final CourseRepository courseRepository;
    private final TeacherRepository teacherRepository;
    private final UserRepository userRepository;

    public List<CourseDTO> findAllCourses() {
        List<Course> courses = courseRepository.findAll();
        try {
            if (courses.isEmpty()) {
                throw new CourseNotFoundException("Nenhuma curso encontrada.");
            }
            return courses.stream().map(CourseMapper::toDTO).toList();
        } catch (CourseNotFoundException e) {
            throw new CourseNotFoundException(e.getMessage());
        }
    }

    public CourseResponse createCourse(@RequestBody CourseDTO courseDTO) {
        try {
            if (courseDTO.teacherId() == null) {
                throw new IllegalArgumentException("Nenhum Professor(a) encontrada.");
            }

            Teacher teacher = teacherRepository.findById(courseDTO.teacherId()).orElseThrow(() -> new IllegalArgumentException("Nenhum professor encontrada."));


            Course course = CourseMapper.toEntity(courseDTO, teacher);
            Course savedCourse = courseRepository.save(course);
            return new CourseResponse("Curso criado com sucesso!");
        } catch (Exception e) {
            throw new IllegalArgumentException(e);
        }
    }

    public List<CourseDTO> findAllTeacherCourses() {
        try {

            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            String email = authentication.getName();

            User user = userRepository.findByEmail(email).orElseThrow(() -> new IllegalStateException("Usuário não encontrado"));

            Teacher teacher = teacherRepository.findByUser(user).orElseThrow(() -> new IllegalStateException("Professor não encontrado"));

            List<Course> courses = courseRepository.findByTeacher(teacher);

            if (courses.isEmpty()) {
                throw new CourseNotFoundException("Nenhuma curso encontrada.");
            }
            return courses.stream().map(CourseMapper::toDTO).toList();
        } catch (CourseNotFoundException e) {
            throw new CourseNotFoundException(e.getMessage());
        } catch (IllegalStateException e) {
            throw new IllegalArgumentException(e);
        }

    }

    public CourseDTO checkIfTheCourseExistsByID(@PathVariable Long id) throws CourseNotFoundException {
        if (courseRepository.findById(id) == null) {
            throw new CourseNotFoundException("Nenhum course encontrada.");
        }
        return courseRepository.findById(id)
                .map(CourseMapper::toDTO)
                .orElseThrow(() -> new CourseNotFoundException("Curso não encontrado"));
    }

    //falta dar o set em cada um ainda
    public CourseResponse updateCourse(@PathVariable Long id, @RequestBody @Valid CourseDTO dto) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String email = authentication.getName();
        User user = userRepository.findByEmail(email).orElseThrow(() -> new IllegalStateException("Usuário não encontrado"));
        Teacher teacher = teacherRepository.findByUser(user).orElseThrow(() -> new IllegalStateException("Professor não encontrado"));
        Course course = courseRepository.findById(id).orElseThrow(() -> new IllegalArgumentException("Nenhum curso encontrada."));

        if (!course.getTeacher().getId().equals(teacher.getId())) {
            throw new IllegalArgumentException("Nenhum curso encontrado para atualizar.");
        }

        CourseMapper.toEntity(dto, teacher);
        courseRepository.save(course);

        return new CourseResponse("Curso atualizado com sucesso!");
    }
}

