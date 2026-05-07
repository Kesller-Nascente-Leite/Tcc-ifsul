package com.meutcc.backend.content.courses;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CourseRepository extends JpaRepository<Course, Long> {

    List<Course> findByTeacherId(Long teacherId);

    @Query("SELECT c FROM Course c WHERE c.isPrivate = false")
    List<Course> findAllPublicCourses();

    @Query("SELECT c FROM Course c WHERE c.teacher.id = :teacherId AND c.isPrivate = false AND c.published = true")
    List<Course> findPublicCoursesByTeacherId(@Param("teacherId") Long teacherId);

    @Query("SELECT c FROM Course c WHERE c.isPrivate = true AND c.teacher.id = :teacherId")
    List<Course> findPrivateCoursesByTeacherId(@Param("teacherId") Long teacherId);
}

