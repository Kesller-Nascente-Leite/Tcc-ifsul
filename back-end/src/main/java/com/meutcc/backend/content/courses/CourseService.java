package com.meutcc.backend.content.courses;

import com.meutcc.backend.student.Student;
import com.meutcc.backend.user.security.AuthenticationService;
import com.meutcc.backend.user.security.SecurityService;
import com.meutcc.backend.teacher.Teacher;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.RequestBody;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class CourseService {

    private final CourseRepository courseRepository;
    private final CourseMapper courseMapper;
    private final SecurityService securityService;
    private final AuthenticationService authenticationService;

    @Transactional(readOnly = true, propagation = Propagation.REQUIRED)
    public List<CourseDTO> findAllPublicCourses() {
        List<Course> listCourse = courseRepository.findAllPublicCourses();
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

    @Transactional(readOnly = true)
    public CourseDTO getCourseById(Long courseId) throws CourseException {
        Course course = courseRepository.findById(courseId).orElseThrow(() -> new CourseException("Curso não encontrado"));

        try {
            // Tenta obter professor autenticado - se for um professor, valida se é dono
            authenticationService.getAuthenticatedTeacher();
            securityService.validateCourseOwner(courseId);
        } catch (Exception e) {
            // Se não for professor ou não for dono, verifica se o curso é público
            if (course.isPrivate()) {
                throw new CourseException("Acesso negado. Este curso é privado.");
            }
        }

        return courseMapper.toDTO(course);
    }

    @Transactional
    public CourseResponse updateCourse(Long id, CourseDTO dto) {
        authenticationService.getAuthenticatedTeacher();
        Course course = courseRepository.findById(id).orElseThrow(() -> new CourseException("Nenhum curso encontrada."));
        securityService.validateCourseOwner(id);

        courseMapper.updateEntity(course, dto);
        courseRepository.save(course);

        return new CourseResponse("Curso atualizado com sucesso!");
    }

    @Transactional
    public void deleteCourse(Long id) throws CourseException {
        authenticationService.getAuthenticatedTeacher();
        Course course = courseRepository.findById(id).orElseThrow(() ->
                new CourseException("Nenhum curso encontrada."));
        securityService.validateCourseOwner(id);
        courseRepository.delete(course);
    }


    public List<Student> listStudentCourses(Long id) {
        authenticationService.getAuthenticatedTeacher();
        Optional<Course> course = courseRepository.findById(id);
        if (course.isEmpty()) {
            return null;
        }
        List<Student> listStudentByCourse = course.get().getStudents();
        return listStudentByCourse.stream().toList();

    }
}
