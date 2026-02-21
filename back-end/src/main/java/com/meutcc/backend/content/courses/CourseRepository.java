package com.meutcc.backend.content.courses;

import com.meutcc.backend.user.Teacher;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CourseRepository extends JpaRepository<Course, Long> {

    List<Course> findByTeacher(Teacher teacher);
}

