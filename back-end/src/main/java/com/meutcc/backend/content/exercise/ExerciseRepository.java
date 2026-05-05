package com.meutcc.backend.content.exercise;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ExerciseRepository extends JpaRepository<Exercise, Long> {
    List<Exercise> findByLessonId(Long lessonId);

    @Query("""
                SELECT e FROM Exercise e
                LEFT JOIN FETCH e.questions
                WHERE e.id = :id
            """)
    Optional<Exercise> findByIdWithQuestions(Long id);



}
