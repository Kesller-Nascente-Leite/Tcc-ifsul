package com.meutcc.backend.content.courses;

import com.meutcc.backend.common.exceptions.CourseNotFoundException;
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
    public List<Course> listMyCourses() {
        return Collections.emptyList();
    }

    @GetMapping("/student/all")
    public List<CourseDTO> listAllCourses() throws CourseNotFoundException {
        return courseService.findAllCourses();
    }

    @GetMapping("/teacher/{id}")
    @ResponseStatus(HttpStatus.OK)
    public CourseDTO getCourseById(@PathVariable Long id) throws CourseNotFoundException {
        return courseService.checkIfTheCourseExistsByID(id);
    }

    @GetMapping("/teacher/list-all-teacher-courses")
    public List<CourseDTO> listAllTeacherCourses() throws CourseNotFoundException {
        return courseService.findAllTeacherCourses();
    }

    @PostMapping("/teacher/create")
    @ResponseStatus(HttpStatus.CREATED)
    public CourseResponse createCourse(@RequestBody @Valid CourseDTO courseDTO) {
        return courseService.createCourse(courseDTO);
    }

    @PutMapping("/teacher/{id}")
    @ResponseStatus(HttpStatus.OK)
    public CourseResponse updateCourse(@PathVariable Long id, @RequestBody @Valid CourseDTO courseDTO) throws Exception {
        return courseService.updateCourse(id, courseDTO);
    }
}