package com.meutcc.backend.content.lesson;

import com.meutcc.backend.content.mapper.BaseEntity;
import com.meutcc.backend.content.module.Module;
import jakarta.persistence.Entity;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "tb_lessons")
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class Lesson extends BaseEntity {

    private String title;
    private String videoUrl; // Link do YouTube ou outra plataforma
    private Integer orderIndex; // Para ordenar as aulas

    @ManyToOne
    @JoinColumn(name = "module_id")
    private Module module;
}