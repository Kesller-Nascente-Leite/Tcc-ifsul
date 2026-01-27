package com.meutcc.backend.study;

import com.meutcc.backend.content.mapper.BaseEntity;
import com.meutcc.backend.content.subject.Subject;
import com.meutcc.backend.user.Students;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "tb_study_session")
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class StudySession extends BaseEntity {
    //Essa tabela serve para ver o quanto o aluno fez o curso, utilização futura:criar graficos e mostrar estastistica

    @ManyToOne
    @JoinColumn(name = "student_id")
    private Students student;

    @ManyToOne
    @JoinColumn(name = "subject_id")
    private Subject subject;

    private LocalDateTime startTime;
    private LocalDateTime endTime;

    @Column(columnDefinition = "TEXT")
    private String notes;
}
