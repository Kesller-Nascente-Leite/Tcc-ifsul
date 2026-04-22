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
}
