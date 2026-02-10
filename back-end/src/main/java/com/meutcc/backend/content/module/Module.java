package com.meutcc.backend.content.module;

import com.meutcc.backend.common.model.BaseEntity;
import com.meutcc.backend.content.courses.Course;
import com.meutcc.backend.content.lesson.Lesson;
import com.meutcc.backend.content.subject.Subject;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "tb_module")
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class Module extends BaseEntity {
    private String title;
    private Integer orderIndex;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "course_id", nullable = false)
    private Course course;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "subject_id")
    private Subject subject;

    @OneToMany(mappedBy = "module", cascade = CascadeType.ALL, orphanRemoval = true)
    @OrderBy("orderIndex ASC")
    private List<Lesson> lessons = new ArrayList<>();
}