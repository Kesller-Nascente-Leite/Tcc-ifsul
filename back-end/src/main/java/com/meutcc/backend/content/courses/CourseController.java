package com.meutcc.backend.content.courses;

import com.meutcc.backend.student.Student;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.Collections;
import java.util.List;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class CourseController {

    private final CourseService courseService;

    @GetMapping("/student/courses")
    @ResponseStatus(HttpStatus.OK)
    public List<Course> listMyCourses() {
        return Collections.emptyList();
    }

    @GetMapping("/student/courses/public/all")
    @ResponseStatus(HttpStatus.OK)
    public List<CourseDTO> listAllPublicCourses() {
        return courseService.findAllPublicCourses();
    }

    @GetMapping("/teacher/courses/{courseId}")
    @ResponseStatus(HttpStatus.OK)
    public CourseDTO getCourseById(@PathVariable("courseId") Long courseId) {
        return courseService.getCourseById(courseId);
    }

    @GetMapping("/teacher/courses/list-all-teacher-courses")
    @ResponseStatus(HttpStatus.OK)
    public List<CourseDTO> listAllTeacherCourses() {
        return courseService.findAllTeacherCourses();
    }

    @PostMapping("/teacher/courses/create")
    @ResponseStatus(HttpStatus.CREATED)
    public CourseDTO createCourse(@RequestBody @Valid CourseDTO courseDTO) {
        return courseService.createCourse(courseDTO);
    }

    @PutMapping("/teacher/courses/{id}")
    @ResponseStatus(HttpStatus.OK)
    public CourseResponse updateCourse(@PathVariable Long id, @RequestBody @Valid CourseDTO courseDTO) throws Exception {
        return courseService.updateCourse(id, courseDTO);
    }

    @DeleteMapping("/teacher/courses/{id}/delete")
    @ResponseStatus(HttpStatus.OK)
    public void deleteCourse(@PathVariable Long id) {
        courseService.deleteCourse(id);
    }

    @GetMapping("/teacher/courses/{id}/students")
    @ResponseStatus(HttpStatus.OK)
    public List<Student> listStudentCourses(@PathVariable Long id) {
        return courseService.listStudentByCourses(id);
    }

    @PostMapping("/teacher/courses/{id}/students/add")
    @ResponseStatus(HttpStatus.CREATED)
    public CourseResponse enrollStudent(@PathVariable Long id, @RequestParam String emailStudent){
        return courseService.enrollStudent(id, emailStudent);
    }

}
