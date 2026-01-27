package com.meutcc.backend.content.lesson;

import com.meutcc.backend.common.model.BaseEntity;
import com.meutcc.backend.user.Student;
import jakarta.persistence.Entity;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

@Entity
@Table(name = "tb_lesson_progress")
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class LessonProgress extends BaseEntity {

    @ManyToOne
    @JoinColumn(name = "student_id")
    private Student student;

    @ManyToOne
    @JoinColumn(name = "lesson_id")
    private Lesson lesson;

    private boolean isCompleted = false;
    private LocalDateTime completedAt;
}
