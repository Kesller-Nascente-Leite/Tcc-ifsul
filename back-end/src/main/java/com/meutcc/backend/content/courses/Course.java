package com.meutcc.backend.content.courses;

import com.meutcc.backend.common.model.BaseEntity;
import com.meutcc.backend.content.module.Module;
import com.meutcc.backend.user.Teacher;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.*;

import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "tb_courses")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Course extends BaseEntity {
    @NotBlank(message = "Título é obrigatorio")
    @Size(min = 10, max = 255, message = "")
    private String title;

    @Column(columnDefinition = "TEXT")
    @NotBlank(message = "Título é obrigatorio")
    @Size(min = 10, max = 255, message = "")
    private String description;

    private boolean published;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "teacher_id", nullable = false)
    private Teacher teacher;

    @OneToMany(mappedBy = "course", cascade = CascadeType.ALL, orphanRemoval = true)
    @OrderBy("orderIndex ASC")
    @Builder.Default
    private List<Module> modules = new ArrayList<>();

    public void addModule(Module module) {
        modules.add(module);
        module.setCourse(this);
    }

    public void removeModule(Module module) {
        modules.remove(module);
        module.setCourse(null);
    }
}