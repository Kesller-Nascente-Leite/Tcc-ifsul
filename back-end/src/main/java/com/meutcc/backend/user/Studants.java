package com.meutcc.backend.user;

import com.meutcc.backend.content.course.Course;
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
public class Studants {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne(fetch = FetchType.EAGER, optional = false)
    @JoinColumn(name = "studant_id", nullable = false)
    private Long studantId;

    private List<Course> courses;
}
