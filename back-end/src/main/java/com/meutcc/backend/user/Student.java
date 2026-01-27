package com.meutcc.backend.user;

import com.meutcc.backend.content.subject.Subject;
import com.meutcc.backend.common.model.BaseEntity;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.util.List;

@Entity
@Table(name = "tb_studants")
@AllArgsConstructor
@NoArgsConstructor
@Getter
public class Student extends BaseEntity {

    @OneToOne(fetch = FetchType.EAGER, optional = false)
    @JoinColumn(name = "user_id", nullable = false, unique = true)
    private User studantId;

    @ManyToMany(fetch = FetchType.EAGER)
    @JoinTable(
            name = "tb_student_subjects",
            joinColumns = @JoinColumn(name = "student_id"),
            inverseJoinColumns = @JoinColumn(name = "subject_id")
    )
    private List<Subject> subjects;
}
