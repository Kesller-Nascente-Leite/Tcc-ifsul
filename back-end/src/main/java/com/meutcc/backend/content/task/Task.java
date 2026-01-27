package com.meutcc.backend.content.task;

import com.meutcc.backend.common.model.BaseEntity;
import com.meutcc.backend.content.subject.Subject;
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
@Table(name = "tb_tasks")
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class Task extends BaseEntity {
    private String title;
    private String description;
    private LocalDateTime deadline; // Seria o prazo final, mas não sei se chamar assim estária certo
    private boolean isDone;

    @ManyToOne
    @JoinColumn(name = "student_id")
    private Student student;

    @ManyToOne
    @JoinColumn(name = "subject_id")
    private Subject subject;
}
