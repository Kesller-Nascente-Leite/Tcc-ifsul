package com.meutcc.backend.content.subject;

import com.meutcc.backend.content.mapper.BaseEntity;
import com.meutcc.backend.content.module.Module;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Entity
@Table(name = "tb_subject")
@Getter
@Setter
public class Subject extends BaseEntity {

    @Column(nullable = false)
    private String name;
    @Column(nullable = false)
    private String color; //Colocar aq cor aqui, para puxar no front e deixar bonitinho
    @Column(nullable = false)
    private String description;

    @OneToMany(mappedBy = "subject", cascade = CascadeType.ALL)
    private List<Module> modules;
}
