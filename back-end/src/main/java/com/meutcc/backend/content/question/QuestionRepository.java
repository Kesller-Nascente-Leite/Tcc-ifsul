package com.meutcc.backend.content.question;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface QuestionRepository extends JpaRepository<Question, Long> {

    List<Question> findByExerciseId(Long exerciseId);

    List<Question> findByExerciseIdOrderByOrderAsc(Long exerciseId);
}