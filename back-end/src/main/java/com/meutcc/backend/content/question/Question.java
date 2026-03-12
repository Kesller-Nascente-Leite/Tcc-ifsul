package com.meutcc.backend.content.question;

import com.meutcc.backend.common.model.BaseEntity;
import com.meutcc.backend.content.Exercise.Answer;
import com.meutcc.backend.content.Exercise.Exercise;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;

import java.util.ArrayList;
import java.util.List;

@EqualsAndHashCode(callSuper = true)
@Entity
@Table(name = "tb_question")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Question extends BaseEntity {

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "exercise_id", nullable = false)
    private Exercise exercise;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 50)
    private QuestionType type;

    @Column(name = "question_text", nullable = false, columnDefinition = "TEXT")
    private String questionText;

    @Column(columnDefinition = "TEXT")
    private String explanation;

    @Column(name = "image_url", length = 500)
    private String imageUrl;

    @Column(name = "video_url", length = 500)
    private String videoUrl;

    @Column(nullable = false)
    private Integer points = 1;

    @Column(name = "\"order\"", nullable = false)
    private Integer order = 0;

    @Column(name = "is_required", nullable = false)
    private Boolean isRequired = true;

    // Configurações específicas (armazenado como JSON)
    @JdbcTypeCode(SqlTypes.JSON)
    @Column(columnDefinition = "jsonb")
    private QuestionConfigDTO config;

    // Relacionamentos
    @OneToMany(mappedBy = "question", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<QuestionOption> options = new ArrayList<>();

    @OneToMany(mappedBy = "question")
    private List<Answer> answers = new ArrayList<>();

    // Métodos auxiliares
    public void addOption(QuestionOption option) {
        options.add(option);
        option.setQuestion(this);
    }

    public void removeOption(QuestionOption option) {
        options.remove(option);
        option.setQuestion(null);
    }

    public List<QuestionOption> getCorrectOptions() {
        return options.stream()
                .filter(QuestionOption::getIsCorrect)
                .toList();
    }

    public boolean isObjective() {
        return type == QuestionType.MULTIPLE_CHOICE_SINGLE ||
                type == QuestionType.MULTIPLE_CHOICE_MULTIPLE ||
                type == QuestionType.TRUE_FALSE ||
                type == QuestionType.ORDERING ||
                type == QuestionType.MATCHING;
    }

    public boolean isSubjective() {
        return type == QuestionType.ESSAY ||
                type == QuestionType.FILL_BLANKS;
    }


}
