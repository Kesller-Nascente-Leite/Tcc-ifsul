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

    @Query("""
                SELECT
                    COUNT(DISTINCT ea.student),
                    COUNT(ea),
                    AVG(ea.score),
                    AVG(ea.percentage),
                    SUM(CASE WHEN ea.passed = true THEN 1 ELSE 0 END),
                    SUM(CASE WHEN ea.passed = false THEN 1 ELSE 0 END),
                    AVG(ea.timeSpent),
                    MAX(ea.score),
                    MIN(ea.score)
                FROM ExerciseAttempt ea
                WHERE ea.exercise.id = :exerciseId
                AND ea.status = 'GRADED'
            """)
    List<Object[]> getStatistics(@Param("exerciseId") Long exerciseId);

}
