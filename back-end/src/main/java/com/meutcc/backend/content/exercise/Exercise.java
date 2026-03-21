package com.meutcc.backend.content.exercise;

import com.meutcc.backend.content.lesson.Lesson;
import com.meutcc.backend.content.question.Question;
import com.meutcc.backend.content.question.QuestionDisplayMode;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "tb_exercise")
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class Exercise {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 100)
    private String title;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(columnDefinition = "TEXT")
    private String instructions;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "lesson_id", nullable = false)
    private Lesson lesson;

    @Column(name = "total_points", nullable = false)
    private Integer totalPoints;

    @Column(name = "passing_score", nullable = false)
    private Integer passingScore;

    @Column(name = "time_limit")
    private Integer timeLimit;

    @Column(name = "max_attempts", nullable = false)
    @Builder.Default
    private Integer maxAttempts = 0;

    @Column(name = "shuffle_questions", nullable = false)
    @Builder.Default
    private Boolean shuffleQuestions = true;

    @Column(name = "shuffle_options", nullable = false)
    @Builder.Default
    private Boolean shuffleOptions = true;

    @Column(name = "show_correct_answers", nullable = false)
    @Builder.Default
    private Boolean showCorrectAnswers = false;

    @Column(name = "show_score", nullable = false)
    @Builder.Default
    private Boolean showScore = true;

    @Column(name = "allow_review", nullable = false)
    @Builder.Default
    private Boolean allowReview = false;

    @Enumerated(EnumType.STRING)
    @Column(name = "question_display_mode", nullable = false)
    @Builder.Default
    private QuestionDisplayMode questionDisplayMode = QuestionDisplayMode.ALL_AT_ONCE;

    @Column(name = "is_active", nullable = false)
    @Builder.Default
    private Boolean isActive = true;

    @Column(name = "available_from")
    private LocalDateTime availableFrom;

    @Column(name = "available_until")
    private LocalDateTime availableUntil;

    @Column(name = "\"order\"", nullable = false)
    @Builder.Default
    private Integer order = 0;

    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @OneToMany(mappedBy = "exercise", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    private List<Question> questions = new ArrayList<>();

    @PrePersist
    protected void onCreate() {
        if (this.isActive == null) {
            this.isActive = true;
        }
        if (this.maxAttempts == null) {
            this.maxAttempts = 0;
        }
        if (this.shuffleQuestions == null) {
            this.shuffleQuestions = true;
        }
        if (this.shuffleOptions == null) {
            this.shuffleOptions = true;
        }
        if (this.showCorrectAnswers == null) {
            this.showCorrectAnswers = false;
        }
        if (this.showScore == null) {
            this.showScore = true;
        }
        if (this.allowReview == null) {
            this.allowReview = false;
        }
        if (this.questionDisplayMode == null) {
            this.questionDisplayMode = QuestionDisplayMode.ALL_AT_ONCE;
        }
        if (this.order == null) {
            this.order = 0;
        }
    }

    @Transient
    public Boolean isAvailable() {
        if (Boolean.FALSE.equals(isActive)) return false;
        LocalDateTime now = LocalDateTime.now();
        if (availableFrom != null && now.isBefore(availableFrom)) return false;
        if (availableUntil != null && now.isAfter(availableUntil)) return false;
        return true;
    }
}