package com.meutcc.backend.content.courses;

import com.meutcc.backend.common.exceptions.CourseException;
import com.meutcc.backend.security.AuthenticationService;
import com.meutcc.backend.teacher.Teacher;
import com.meutcc.backend.teacher.TeacherRepository;
import com.meutcc.backend.user.UserRepository;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
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
    private final AuthenticationService authenticationService;

    @Transactional(readOnly = true, propagation = Propagation.REQUIRED)
    public List<CourseDTO> findAllCourses() {   
        return courseRepository.findAll().stream().map(CourseMapper::toDTO).toList();
    }

    @Transactional
    public CourseDTO createCourse(@RequestBody CourseDTO courseDTO) {
        Teacher teacher = authenticationService.getAuthenticatedTeacher();
        Course course = CourseMapper.toEntity(courseDTO, teacher);
        Course savedCourse = courseRepository.save(course);
        return CourseMapper.toDTO(savedCourse);

    }

    @Transactional(readOnly = true, propagation = Propagation.REQUIRED)
    public List<CourseDTO> findAllTeacherCourses() {
        Teacher teacher = authenticationService.getAuthenticatedTeacher();

        List<Course> courses = courseRepository.findByTeacher(teacher);

        if (courses.isEmpty()) {
            throw new CourseException("Nenhuma curso encontrada.");
        }
        return courses.stream().map(CourseMapper::toDTO).toList();
    }

    @Transactional(readOnly = true, propagation = Propagation.REQUIRED)
    public CourseDTO checkIfTheCourseExistsByID(@PathVariable Long id) throws CourseException {
        return courseRepository.findById(id)
                .map(CourseMapper::toDTO)
                .orElseThrow(() -> new CourseException("Curso não encontrado"));
    }

    public CourseResponse updateCourse(@PathVariable Long id, @RequestBody @Valid CourseDTO dto) {
        Teacher teacher = authenticationService.getAuthenticatedTeacher();
        Course course = courseRepository.findById(id).orElseThrow(() -> new CourseException("Nenhum curso encontrada."));

        if (!course.getTeacher().getId().equals(teacher.getId())) {
            throw new IllegalArgumentException("Nenhum curso encontrado para atualizar.");
        }

        CourseMapper.updateEntity(course, dto);
        courseRepository.save(course);

        return new CourseResponse("Curso atualizado com sucesso!");
    }

    public void deleteCourse(@PathVariable Long id) throws CourseException {
        Teacher teacher = authenticationService.getAuthenticatedTeacher();
        Course course = courseRepository.findById(id).orElseThrow(() ->  new CourseException("Nenhum curso encontrada."));
        if(!course.getTeacher().getId().equals(teacher.getId())) {
            throw new IllegalArgumentException("Nenhum curso encontrada para atualizar.");
        }
        courseRepository.delete(course);
    }

}
