package com.meutcc.backend.content.courses;

import com.meutcc.backend.common.exceptions.CourseNotFoundException;
import com.meutcc.backend.teacher.Teacher;
import com.meutcc.backend.teacher.TeacherRepository;
import com.meutcc.backend.user.User;
import com.meutcc.backend.user.UserRepository;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;

import java.util.List;

@Service
@RequiredArgsConstructor
public class CourseService {

    private final CourseRepository courseRepository;
    private final TeacherRepository teacherRepository;
    private final UserRepository userRepository;

    @Transactional(readOnly = true, propagation = Propagation.REQUIRED)
    public List<CourseDTO> findAllCourses() {   
        return courseRepository.findAll().stream().map(CourseMapper::toDTO).toList();
    }

    @Transactional
    public CourseDTO createCourse(@RequestBody CourseDTO courseDTO) {
        Teacher teacher = getAuthenticatedTeacher();
        Course course = CourseMapper.toEntity(courseDTO, teacher);
        Course savedCourse = courseRepository.save(course);
        return CourseMapper.toDTO(savedCourse);

    }

    @Transactional(readOnly = true, propagation = Propagation.REQUIRED)
    public List<CourseDTO> findAllTeacherCourses() {
        Teacher teacher = getAuthenticatedTeacher();

        List<Course> courses = courseRepository.findByTeacher(teacher);

        if (courses.isEmpty()) {
            throw new CourseNotFoundException("Nenhuma curso encontrada.");
        }
        return courses.stream().map(CourseMapper::toDTO).toList();
    }

    @Transactional(readOnly = true, propagation = Propagation.REQUIRED)
    public CourseDTO checkIfTheCourseExistsByID(@PathVariable Long id) throws CourseNotFoundException {
        return courseRepository.findById(id)
                .map(CourseMapper::toDTO)
                .orElseThrow(() -> new CourseNotFoundException("Curso não encontrado"));
    }

    public CourseResponse updateCourse(@PathVariable Long id, @RequestBody @Valid CourseDTO dto) {
        Teacher teacher = getAuthenticatedTeacher();
        Course course = courseRepository.findById(id).orElseThrow(() -> new IllegalArgumentException("Nenhum curso encontrada."));

        if (!course.getTeacher().getId().equals(teacher.getId())) {
            throw new IllegalArgumentException("Nenhum curso encontrado para atualizar.");
        }

        CourseMapper.updateEntity(course, dto);
        courseRepository.save(course);

        return new CourseResponse("Curso atualizado com sucesso!");
    }

    @Transactional(readOnly = true, propagation = Propagation.REQUIRED)
    private Teacher getAuthenticatedTeacher() throws CourseNotFoundException {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String email = authentication.getName();
        User user = userRepository.findByEmail(email).orElseThrow(() -> new IllegalStateException("Usuário não encontrado"));
        Teacher teacher = teacherRepository.findByUser(user).orElseThrow(() -> new IllegalStateException("Professor não encontrado"));
        return teacher;
    }
}
