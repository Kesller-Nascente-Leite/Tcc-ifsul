package com.meutcc.backend.content.courses;

import com.meutcc.backend.teacher.Teacher;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface CourseRepository extends JpaRepository<Course, Long> {

    List<Course> findByTeacher(Teacher teacher);

    boolean existsByTitle(String title);
}

