package com.meutcc.backend.content.module;

import com.meutcc.backend.content.lesson.Lesson;
import com.meutcc.backend.content.mapper.BaseEntity;
import com.meutcc.backend.content.subject.Subject;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import java.util.List;

@Entity
@Table(name = "tb_module")
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class Module extends BaseEntity {

    @ManyToOne
    @JoinColumn(name = "subject_id")
    private Subject subject;

    @OneToMany(mappedBy = "module", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<Lesson> lessons;

    private String title;
    private String description;
    private Integer orderIndex;


}
