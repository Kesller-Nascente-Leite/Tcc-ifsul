package com.meutcc.backend.content.question;

import com.meutcc.backend.common.model.BaseEntity;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

@EqualsAndHashCode(callSuper = true)
@Entity
@Table(name = "tb_question_options")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class QuestionOption extends BaseEntity {

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "question_id", nullable = false)
    private Question question;

    @Column(name = "option_text", nullable = false, columnDefinition = "TEXT")
    private String optionText;

    @Column(name = "image_url", length = 500)
    private String imageUrl;

    @Column(name = "is_correct", nullable = false)
    private Boolean isCorrect = false;

    @Column(name = "\"order\"", nullable = false)
    private Integer order = 0;

    @Column(columnDefinition = "TEXT")
    private String feedback;

    // Para questões de correspondência (matching)
    @Column(name = "match_pair", length = 255)
    private String matchPair;

    // Para questões de ordenação (ordering)
    @Column(name = "correct_position")
    private Integer correctPosition;

    // Métodos auxiliares
    public boolean isCorrectForMatching(String matchedPair) {
        if (matchPair == null) {
            return false;
        }
        return matchPair.equalsIgnoreCase(matchedPair);
    }

    public boolean isCorrectForOrdering(Integer position) {
        if (correctPosition == null) {
            return false;
        }
        return correctPosition.equals(position);
    }
}

