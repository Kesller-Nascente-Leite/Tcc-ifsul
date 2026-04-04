package com.meutcc.backend.content.courses;

import com.meutcc.backend.user.security.AuthenticationService;
import com.meutcc.backend.user.security.SecurityService;
import com.meutcc.backend.teacher.Teacher;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.RequestBody;

import java.util.List;

@Service
@RequiredArgsConstructor
public class CourseService {

    private final CourseRepository courseRepository;
    private final CourseMapper courseMapper;
    private final SecurityService securityService;
    private final AuthenticationService authenticationService;

    @Transactional(readOnly = true, propagation = Propagation.REQUIRED)
    public List<CourseDTO> findAllCourses() {
        List<Course> listCourse = courseRepository.findAll().stream().toList();
        return courseMapper.toDTOList(listCourse);
    }

    @Transactional
    public CourseDTO createCourse(@RequestBody CourseDTO courseDTO) {
        Teacher teacher = authenticationService.getAuthenticatedTeacher();
        Course course = courseMapper.toEntity(courseDTO, teacher);
        Course savedCourse = courseRepository.save(course);
        return courseMapper.toDTO(savedCourse);

    }

    @Transactional(readOnly = true)
    public List<CourseDTO> findAllTeacherCourses() {
        Teacher teacher = authenticationService.getAuthenticatedTeacher();

        List<Course> coursesList = courseRepository.findByTeacherId(teacher.getId()).stream().toList();

        if (coursesList.isEmpty()) {
            throw new CourseException("Nenhuma curso encontrada.");
        }
        return courseMapper.toDTOList(coursesList);
    }


    public CourseDTO getCourseById(Long courseId) throws CourseException {
        Course course = courseRepository.findById(courseId).orElseThrow(() -> new CourseException("Curso não encontrado"));
        securityService.validateCourseOwner(course.getId());
        return courseMapper.toDTO(course);
    }

    @Transactional
    public CourseResponse updateCourse(Long id, CourseDTO dto) {
        Teacher teacher = authenticationService.getAuthenticatedTeacher();
        Course course = courseRepository.findById(id).orElseThrow(() -> new CourseException("Nenhum curso encontrada."));
        securityService.validateCourseOwner(id);

        courseMapper.updateEntity(course, dto);
        courseRepository.save(course);

        return new CourseResponse("Curso atualizado com sucesso!");
    }

    @Transactional
    public void deleteCourse(Long id) throws CourseException {
        Teacher teacher = authenticationService.getAuthenticatedTeacher();
        Course course = courseRepository.findById(id).orElseThrow(() ->
                new CourseException("Nenhum curso encontrada."));
        securityService.validateCourseOwner(id);
        courseRepository.delete(course);
    }


}
