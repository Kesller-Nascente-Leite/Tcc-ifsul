package com.meutcc.backend.content.attempt;

import com.meutcc.backend.common.model.BaseEntity;
import com.meutcc.backend.content.exercise.Exercise;
import com.meutcc.backend.content.answer.Answer;
import com.meutcc.backend.user.User;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@EqualsAndHashCode(callSuper = true)
@Entity
@Table(name = "tb_exercise_attempts", uniqueConstraints = @UniqueConstraint(columnNames = {"exercise_id", "student_id", "attempt_number"}))
@Data
@NoArgsConstructor
@AllArgsConstructor
public class ExerciseAttempt extends BaseEntity {

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "exercise_id", nullable = false)
    private Exercise exercise;

    // acho que está errado e deveria ser Student student
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "student_id", nullable = false)
    private User student;

    @Column(name = "attempt_number", nullable = false)
    private Integer attemptNumber;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private AttemptStatus status = AttemptStatus.IN_PROGRESS;

    @Column(name = "started_at")
    private LocalDateTime startedAt;

    @Column(name = "submitted_at")
    private LocalDateTime submittedAt;

    @Column(name = "graded_at")
    private LocalDateTime gradedAt;

    @Column(name = "time_spent")
    private Integer timeSpent; // em segundos

    @Column(precision = 5, scale = 2)
    private BigDecimal score = BigDecimal.ZERO;

    @Column(precision = 5, scale = 2)
    private BigDecimal percentage = BigDecimal.ZERO;

    @Column(nullable = false)
    private Boolean passed = false;

    @Column(name = "teacher_feedback", columnDefinition = "TEXT")
    private String teacherFeedback;

    // Metadados (IP, browser, etc)
    @JdbcTypeCode(SqlTypes.JSON)
    @Column(columnDefinition = "jsonb")
    private Map<String, Object> metadata = new HashMap<>();

    // Relacionamentos
    @OneToMany(mappedBy = "attempt", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Answer> answers = new ArrayList<>();

    // Métodos auxiliares
    public void addAnswer(Answer answer) {
        answers.add(answer);
        answer.setAttempt(this);
    }

    public void removeAnswer(Answer answer) {
        answers.remove(answer);
        answer.setAttempt(null);
    }

    public void start() {
        this.startedAt = LocalDateTime.now();
        this.status = AttemptStatus.IN_PROGRESS;
    }

    public void submit() {
        this.submittedAt = LocalDateTime.now();
        this.status = AttemptStatus.SUBMITTED;
        calculateTimeSpent();
    }

    public void grade() {
        this.gradedAt = LocalDateTime.now();
        this.status = AttemptStatus.GRADED;
        calculateScore();
    }

    public void expire() {
        this.status = AttemptStatus.EXPIRED;
        this.submittedAt = LocalDateTime.now();
        calculateTimeSpent();
    }

    private void calculateTimeSpent() {
        if (startedAt != null && submittedAt != null) {
            long seconds = java.time.Duration.between(startedAt, submittedAt).getSeconds();
            this.timeSpent = (int) seconds;
        }
    }

    private void calculateScore() {
        BigDecimal totalPoints = answers.stream().map(Answer::getPointsEarned).reduce(BigDecimal.ZERO, BigDecimal::add);

        this.score = totalPoints;

        if (exercise != null && exercise.getTotalPoints() > 0) {
            this.percentage = totalPoints.multiply(BigDecimal.valueOf(100)).divide(BigDecimal.valueOf(exercise.getTotalPoints()), 2, java.math.RoundingMode.HALF_UP);

            this.passed = this.percentage.compareTo(BigDecimal.valueOf(exercise.getPassingScore())) >= 0;
        }
    }

    public boolean isTimeLimitExpired() {
        if (exercise == null || exercise.getTimeLimit() == null || startedAt == null) {
            return false;
        }

        LocalDateTime expirationTime = startedAt.plusMinutes(exercise.getTimeLimit());
        return LocalDateTime.now().isAfter(expirationTime);
    }

    public boolean canBeRetaken() {
        if (exercise == null) {
            return false;
        }

        // Se maxAttempts = 0, tentativas ilimitadas
        if (exercise.getMaxAttempts() == 0) {
            return true;
        }

        // Verificar se atingiu o limite
        return attemptNumber < exercise.getMaxAttempts();
    }

    public Integer getRemainingTime() {
        if (exercise == null || exercise.getTimeLimit() == null || startedAt == null) {
            return null;
        }

        LocalDateTime expirationTime = startedAt.plusMinutes(exercise.getTimeLimit());
        long remainingSeconds = java.time.Duration.between(LocalDateTime.now(), expirationTime).getSeconds();

        return remainingSeconds > 0 ? (int) remainingSeconds : 0;
    }

}

