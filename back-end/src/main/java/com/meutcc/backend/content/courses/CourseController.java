package com.meutcc.backend.content.courses;

import com.meutcc.backend.common.exceptions.CourseException;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.Collections;
import java.util.List;

@RestController
@RequestMapping("/api/courses")
@RequiredArgsConstructor
public class CourseController {

    private final CourseService courseService;

    @GetMapping("/student")
    @ResponseStatus(HttpStatus.OK)
    public List<Course> listMyCourses() {
        return Collections.emptyList();
    }

    @GetMapping("/student/all")
    @ResponseStatus(HttpStatus.OK)
    public List<CourseDTO> listAllCourses() throws CourseException {
        return courseService.findAllCourses();
    }

    @GetMapping("/teacher/{id}")
    @ResponseStatus(HttpStatus.OK)
    public CourseDTO getCourseById(@PathVariable Long id) throws CourseException {
        return courseService.checkIfTheCourseExistsByID(id);
    }

    @GetMapping("/teacher/list-all-teacher-courses")
    @ResponseStatus(HttpStatus.OK)
    public List<CourseDTO> listAllTeacherCourses() throws CourseException {
        return courseService.findAllTeacherCourses();
    }

    @PostMapping("/teacher/create")
    @ResponseStatus(HttpStatus.CREATED)
    public CourseDTO createCourse(@RequestBody @Valid CourseDTO courseDTO) {
        return courseService.createCourse(courseDTO);
    }

    @PutMapping("/teacher/{id}")
    @ResponseStatus(HttpStatus.OK)
    public CourseResponse updateCourse(@PathVariable Long id, @RequestBody @Valid CourseDTO courseDTO) throws CourseException {
        return courseService.updateCourse(id, courseDTO);
    }

    @DeleteMapping("/teacher/{id}/delete")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteCourse(@PathVariable Long id) throws CourseException {
        courseService.deleteCourse(id);
    }
}