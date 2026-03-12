package com.meutcc.backend.content.Exercise;

import com.meutcc.backend.common.model.BaseEntity;
import com.meutcc.backend.content.question.Question;
import com.meutcc.backend.content.question.QuestionOption;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Entity
@Table(name = "tb_answers")
@EqualsAndHashCode(callSuper = true)
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Answer extends BaseEntity {
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "attempt_id", nullable = false)
    private ExerciseAttempt attempt;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "question_id", nullable = false)
    private Question question;

    // Resposta para múltipla escolha (IDs das opções selecionadas)
    @JdbcTypeCode(SqlTypes.JSON)
    @Column(name = "selected_options", columnDefinition = "jsonb")
    private List<Long> selectedOptions = new ArrayList<>();

    // Resposta dissertativa ou preencher lacunas
    @Column(name = "text_answer", columnDefinition = "TEXT")
    private String textAnswer;

    // Resposta para ordenação (ordem dos IDs das opções)
    @JdbcTypeCode(SqlTypes.JSON)
    @Column(name = "order_answer", columnDefinition = "jsonb")
    private List<Long> orderAnswer = new ArrayList<>();

    // Resposta para correspondência (mapa de opção -> par correspondente)
    @JdbcTypeCode(SqlTypes.JSON)
    @Column(name = "match_answer", columnDefinition = "jsonb")
    private Map<Long, String> matchAnswer = new HashMap<>();

    @Column(name = "is_correct", nullable = false)
    private Boolean isCorrect = false;

    @Column(name = "points_earned", precision = 5, scale = 2, nullable = false)
    private BigDecimal pointsEarned = BigDecimal.ZERO;

    @Column(columnDefinition = "TEXT")
    private String feedback;

    @Column(name = "answered_at")
    private LocalDateTime answeredAt;
    // Métodos auxiliares para diferentes tipos de questões

    /**
     * Corrige questão de múltipla escolha (uma resposta)
     */
    public void gradeMultipleChoiceSingle() {
        if (question == null || selectedOptions == null || selectedOptions.isEmpty()) {
            this.isCorrect = false;
            this.pointsEarned = BigDecimal.ZERO;
            return;
        }

        // Obter a opção correta
        QuestionOption correctOption = question.getOptions().stream()
                .filter(QuestionOption::getIsCorrect)
                .findFirst()
                .orElse(null);

        if (correctOption == null) {
            this.isCorrect = false;
            this.pointsEarned = BigDecimal.ZERO;
            return;
        }

        // Verificar se selecionou a opção correta
        boolean correct = selectedOptions.size() == 1 &&
                selectedOptions.getFirst().equals(correctOption.getId());

        this.isCorrect = correct;
        this.pointsEarned = correct ? BigDecimal.valueOf(question.getPoints()) : BigDecimal.ZERO;

        // Adicionar feedback da opção
        if (!selectedOptions.isEmpty()) {
            question.getOptions().stream()
                    .filter(opt -> opt.getId().equals(selectedOptions.get(0)))
                    .findFirst()
                    .ifPresent(opt -> this.feedback = opt.getFeedback());
        }
    }

    /**
     * Corrige questão de múltipla escolha (várias respostas)
     */
    public void gradeMultipleChoiceMultiple() {
        if (question == null || selectedOptions == null) {
            this.isCorrect = false;
            this.pointsEarned = BigDecimal.ZERO;
            return;
        }

        // Obter todas as opções corretas
        List<Long> correctOptionIds = question.getOptions().stream()
                .filter(QuestionOption::getIsCorrect)
                .map(QuestionOption::getId)
                .toList();

        // Verificar se selecionou exatamente as opções corretas
        boolean correct = selectedOptions.size() == correctOptionIds.size() &&
                selectedOptions.containsAll(correctOptionIds);

        this.isCorrect = correct;

        // Pontuação parcial (opcional)
        if (question.getConfig() != null &&
                Boolean.TRUE.equals(question.getConfig().partialCredit())) {

            long correctlySelected = selectedOptions.stream()
                    .filter(correctOptionIds::contains)
                    .count();

            long totalCorrect = correctOptionIds.size();

            if (totalCorrect > 0) {
                double percentage = (double) correctlySelected / totalCorrect;
                this.pointsEarned = BigDecimal.valueOf(question.getPoints())
                        .multiply(BigDecimal.valueOf(percentage))
                        .setScale(2, java.math.RoundingMode.HALF_UP);
            }
        } else {
            this.pointsEarned = correct ? BigDecimal.valueOf(question.getPoints()) : BigDecimal.ZERO;
        }
    }

    /**
     * Corrige questão verdadeiro/falso
     */
    public void gradeTrueFalse() {
        gradeMultipleChoiceSingle(); // Funciona da mesma forma
    }

    /**
     * Corrige questão de preencher lacunas
     */
    public void gradeFillBlanks() {
        if (question == null || textAnswer == null || textAnswer.isBlank()) {
            this.isCorrect = false;
            this.pointsEarned = BigDecimal.ZERO;
            return;
        }

        if (question.getConfig() == null ||
                question.getConfig().acceptableAnswers() == null ||
                question.getConfig().acceptableAnswers().isEmpty()) {
            // Aguarda correção manual
            this.isCorrect = null;
            this.pointsEarned = BigDecimal.ZERO;
            return;
        }

        List<String> acceptableAnswers = question.getConfig().acceptableAnswers();
        boolean caseSensitive = question.getConfig().caseSensitive() != null &&
                question.getConfig().caseSensitive();

        boolean correct = acceptableAnswers.stream()
                .anyMatch(acceptable -> caseSensitive ?
                        textAnswer.equals(acceptable) :
                        textAnswer.equalsIgnoreCase(acceptable));

        this.isCorrect = correct;
        this.pointsEarned = correct ? BigDecimal.valueOf(question.getPoints()) : BigDecimal.ZERO;
    }

    /**
     * Corrige questão de ordenação
     */
    public void gradeOrdering() {
        if (question == null || orderAnswer == null || orderAnswer.isEmpty()) {
            this.isCorrect = false;
            this.pointsEarned = BigDecimal.ZERO;
            return;
        }

        List<QuestionOption> options = question.getOptions();
        boolean correct = true;

        for (int i = 0; i < orderAnswer.size(); i++) {
            Long optionId = orderAnswer.get(i);
            QuestionOption option = options.stream()
                    .filter(opt -> opt.getId().equals(optionId))
                    .findFirst()
                    .orElse(null);

            if (option == null || !option.isCorrectForOrdering(i + 1)) {
                correct = false;
                break;
            }
        }

        this.isCorrect = correct;
        this.pointsEarned = correct ? BigDecimal.valueOf(question.getPoints()) : BigDecimal.ZERO;
    }

    /**
     * Corrige questão de correspondência
     */
    public void gradeMatching() {
        if (question == null || matchAnswer == null || matchAnswer.isEmpty()) {
            this.isCorrect = false;
            this.pointsEarned = BigDecimal.ZERO;
            return;
        }

        List<QuestionOption> options = question.getOptions();
        long correctMatches = 0;

        for (Map.Entry<Long, String> entry : matchAnswer.entrySet()) {
            Long optionId = entry.getKey();
            String matchedPair = entry.getValue();

            QuestionOption option = options.stream()
                    .filter(opt -> opt.getId().equals(optionId))
                    .findFirst()
                    .orElse(null);

            if (option != null && option.isCorrectForMatching(matchedPair)) {
                correctMatches++;
            }
        }

        boolean allCorrect = correctMatches == options.size();
        this.isCorrect = allCorrect;

        // Pontuação parcial (opcional)
        if (question.getConfig() != null &&
                Boolean.TRUE.equals(question.getConfig().partialCredit())) {

            double percentage = (double) correctMatches / options.size();
            this.pointsEarned = BigDecimal.valueOf(question.getPoints())
                    .multiply(BigDecimal.valueOf(percentage))
                    .setScale(2, java.math.RoundingMode.HALF_UP);
        } else {
            this.pointsEarned = allCorrect ? BigDecimal.valueOf(question.getPoints()) : BigDecimal.ZERO;
        }
    }

    /**
     * Corrige a resposta baseado no tipo de questão
     */
    public void autoGrade() {
        if (question == null) {
            return;
        }

        this.answeredAt = LocalDateTime.now();

        switch (question.getType()) {
            case MULTIPLE_CHOICE_SINGLE:
                gradeMultipleChoiceSingle();
                break;
            case MULTIPLE_CHOICE_MULTIPLE:
                gradeMultipleChoiceMultiple();
                break;
            case TRUE_FALSE:
                gradeTrueFalse();
                break;
            case FILL_BLANKS:
                gradeFillBlanks();
                break;
            case ORDERING:
                gradeOrdering();
                break;
            case MATCHING:
                gradeMatching();
                break;
            case ESSAY:
                // Aguarda correção manual
                this.isCorrect = null;
                this.pointsEarned = BigDecimal.ZERO;
                break;
        }
    }

    /**
     * Correção manual (para questões dissertativas)
     */
    public void manualGrade(boolean correct, BigDecimal points, String feedback) {
        this.isCorrect = correct;
        this.pointsEarned = points;
        this.feedback = feedback;
    }

}
