package com.meutcc.backend.content.courses;

import com.meutcc.backend.common.exceptions.CourseException;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.Collections;
import java.util.List;

@RestController
@RequestMapping("/api/courses")
@RequiredArgsConstructor
public class CourseController {

    private final CourseService courseService;

    @PreAuthorize("hasAuthority('STUDENT')")
    @GetMapping("/student")
    @ResponseStatus(HttpStatus.OK)
    public List<Course> listMyCourses() {
        return Collections.emptyList();
    }

    @PreAuthorize("hasAuthority('STUDENT')")
    @GetMapping("/student/all")
    @ResponseStatus(HttpStatus.OK)
    public List<CourseDTO> listAllCourses() throws CourseException {
        return courseService.findAllCourses();
    }

    @PreAuthorize("hasAuthority('TEACHER')")
    @GetMapping("/teacher/{id}")
    @ResponseStatus(HttpStatus.OK)
    public CourseDTO getCourseById(@PathVariable Long id) throws CourseException {
        return courseService.checkIfTheCourseExistsByID(id);
    }

    @PreAuthorize("hasAuthority('TEACHER')")
    @GetMapping("/teacher/list-all-teacher-courses")
    @ResponseStatus(HttpStatus.OK)
    public List<CourseDTO> listAllTeacherCourses() throws CourseException {
        return courseService.findAllTeacherCourses();
    }

    @PreAuthorize("hasAuthority('TEACHER')")
    @PostMapping("/teacher/create")
    @ResponseStatus(HttpStatus.CREATED)
    public CourseDTO createCourse(@RequestBody @Valid CourseDTO courseDTO) {
        return courseService.createCourse(courseDTO);
    }

    @PreAuthorize("hasAuthority('TEACHER')")
    @PutMapping("/teacher/{id}")
    @ResponseStatus(HttpStatus.OK)
    public CourseResponse updateCourse(@PathVariable Long id, @RequestBody @Valid CourseDTO courseDTO) throws Exception {
        return courseService.updateCourse(id, courseDTO);
    }

    @PreAuthorize("hasAuthority('TEACHER')")
    @DeleteMapping("/teacher/{id}/delete")
    @ResponseStatus(HttpStatus.OK)
    public void deleteCourse(@PathVariable Long id) throws CourseException {
        courseService.deleteCourse(id);
    }
}