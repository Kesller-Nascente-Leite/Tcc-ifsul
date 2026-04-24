package com.meutcc.backend.content.attempt;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ExerciseAttemptRepository extends JpaRepository<ExerciseAttempt,Long> {
    @Query("""
        SELECT DISTINCT ea FROM ExerciseAttempt ea
        JOIN FETCH ea.exercise e
        JOIN FETCH ea.student s
        LEFT JOIN FETCH ea.answers a
        LEFT JOIN FETCH a.question q
        WHERE e.id = :exerciseId
        ORDER BY ea.createdAt DESC
    """)
    List<ExerciseAttempt> findByExerciseIdWithAnswers(@Param("exerciseId") Long exerciseId);


    @Query("""
                SELECT
                    ea.exercise.title,
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
                INNER JOIN ea.exercise e
                WHERE ea.exercise.id = :exerciseId
                AND ea.status = 'GRADED'
                GROUP BY ea.exercise.title
            """)
    List<Object[]> getStatistics(@Param("exerciseId") Long exerciseId);
}
