package com.meutcc.backend.content.Exercise;

import com.meutcc.backend.common.model.BaseEntity;
import com.meutcc.backend.content.lesson.Lesson;
import com.meutcc.backend.content.question.Question;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "tb_exercise")
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class Exercise extends BaseEntity {

    @Column(nullable = false, length = 100)
    private String title;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(columnDefinition = "TEXT")
    private String instructions;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "lesson_id", nullable = false)
    private Lesson lesson;

    // Configurações dos exercicios
    @Column(name = "total_points", nullable = false)
    private Integer totalPoints = 100;

    @Column(name = "passing_score", nullable = false)
    private Integer passingScore = 60;

    @Column(name = "time_limit")
    private Integer timeLimit; // em minutos, null = sem limite

    @Column(name = "max_attempts", nullable = false)
    private Integer maxAttempts = 0; // 0 = ilimitado

    @Column(name = "shuffle_questions", nullable = false)
    private Boolean shuffleQuestions = true;

    @Column(name = "shuffle_options", nullable = false)
    private Boolean shuffleOptions = true;

    @Column(name = "show_correct_answers", nullable = false)
    private Boolean showCorrectAnswers = false;

    @Column(name = "show_score", nullable = false)
    private Boolean showScore = true;

    @Column(name = "allow_review", nullable = false)
    private Boolean allowReview = false;

    @Enumerated(EnumType.STRING)
    @Column(name = "question_display_mode", length = 20, nullable = false)
    private QuestionDisplayMode questionDisplayMode = QuestionDisplayMode.ALL_AT_ONCE;

    @Column(name = "\"order\"", nullable = false)
    private Integer order = 0;

    @Column(name = "is_active", nullable = false)
    private Boolean isActive = true;

    @Column(name = "available_from")
    private LocalDateTime availableFrom;

    @Column(name = "available_until")
    private LocalDateTime availableUntil;

    //Relacionamentos
    @OneToMany(mappedBy = "exercise", cascade = CascadeType.ALL, orphanRemoval = true)
    List<Question> questions = new ArrayList<>();

    @OneToMany(mappedBy = "exercise", cascade = CascadeType.ALL, orphanRemoval = true)
    List<ExerciseAttempt> attempts = new ArrayList<>();

    // Métodos auxiliares
    public void addQuestion(Question question) {
        questions.add(question);
        question.setExercise(this);
    }

    public void removeQuestion(Question question) {
        questions.remove(question);
        question.setExercise(null);
    }

    public boolean isAvailable() {
        if (!isActive) {
            return false;
        }

        LocalDateTime now = LocalDateTime.now();

        if (availableFrom != null && now.isBefore(availableFrom)) {
            return false;
        }

        if (availableUntil != null && now.isAfter(availableUntil)) {
            return false;
        }

        return true;
    }

    public boolean hasTimeLimitExpired(LocalDateTime startTime) {
        if (timeLimit == null) {
            return false;
        }

        LocalDateTime expirationTime = startTime.plusMinutes(timeLimit);
        return LocalDateTime.now().isAfter(expirationTime);
    }
}