package com.meutcc.backend.content.exercise;

import com.meutcc.backend.content.answer.AnswerResponseDTO;
import com.meutcc.backend.content.attempt.AttemptResponseDTO;
import com.meutcc.backend.content.attempt.ExerciseAttempt;
import com.meutcc.backend.content.attempt.ExerciseAttemptRepository;
import com.meutcc.backend.content.exercise.dtos.CreateExerciseDTO;
import com.meutcc.backend.content.exercise.dtos.ExerciseStatisticsDTO;
import com.meutcc.backend.content.exercise.dtos.UpdateExerciseDTO;
import com.meutcc.backend.content.lesson.Lesson;
import com.meutcc.backend.content.lesson.LessonException;
import com.meutcc.backend.content.lesson.LessonRepository;
import com.meutcc.backend.content.question.Question;
import com.meutcc.backend.content.question.QuestionException;
import com.meutcc.backend.content.question.QuestionMapper;
import com.meutcc.backend.content.question.QuestionOption;
import com.meutcc.backend.user.security.SecurityService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.EnableTransactionManagement;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class ExerciseService {

    private final ExerciseRepository exerciseRepository;
    private final ExerciseMapper exerciseMapper;
    private final QuestionMapper questionMapper;
    private final LessonRepository lessonRepository;
    private final SecurityService securityService;
    private final ExerciseAttemptRepository exerciseAttemptRepository;

    @Transactional(readOnly = true)
    public List<ExerciseResponseDTO> getAllExercises(Long lessonId) {
        Lesson lesson = lessonRepository.findById(lessonId)
                .orElseThrow(() -> new LessonException("Nenhuma lição encontrada"));

        securityService.validateCourseOwner(lesson.getModule().getCourse().getId());

        List<Exercise> exercises = exerciseRepository.findByLessonId(lessonId);
        return exerciseMapper.toResponseDTOList(exercises);
    }

    @Transactional(readOnly = true)
    public ExerciseResponseDTO getById(Long exerciseId, Boolean includeQuestions) {
        Exercise exercise;
        if (Boolean.TRUE.equals(includeQuestions)) {
            exercise = exerciseRepository.findByIdWithQuestions(exerciseId)
                    .orElseThrow(() -> new ExerciseException("Nenhum exercício encontrado"));

            exercise.getQuestions().forEach(q -> q.getOptions().size());

            return exerciseMapper.toResponseDTOWithQuestions(exercise);
        }

        exercise = exerciseRepository.findById(exerciseId)
                .orElseThrow(() -> new ExerciseException("Nenhum exercício encontrado"));
        securityService.validateCourseOwner(exercise.getLesson().getModule().getCourse().getId());

        return exerciseMapper.toResponseDTO(exercise);
    }

    @Transactional
    public void createExercise(CreateExerciseDTO createExerciseDTO) {
        if (createExerciseDTO.lessonId() == null) {
            throw new ExerciseException("lessonId é obrigatório");
        }

        Lesson lesson = lessonRepository.findById(createExerciseDTO.lessonId())
                .orElseThrow(() -> new LessonException("Lição não encontrada"));

        securityService.validateCourseOwner(lesson.getModule().getCourse().getId());

        if (createExerciseDTO.questions() == null || createExerciseDTO.questions().isEmpty()) {
            throw new ExerciseException("Adicione pelo menos uma questão");
        }

        Exercise exercise = exerciseMapper.toEntity(createExerciseDTO);
        exercise.setLesson(lesson);

        int nextOrder = exerciseRepository.findByLessonId(lesson.getId())
                .stream()
                .mapToInt(Exercise::getOrder)
                .max()
                .orElse(-1) + 1;
        exercise.setOrder(nextOrder);

        if (exercise.getIsActive() == null) {
            exercise.setIsActive(true);
        }

        List<Question> questions = createExerciseDTO.questions().stream()
                .map(qDTO -> {
                    Question question = questionMapper.toEntity(qDTO);
                    question.setExercise(exercise);

                    validateQuestion(question);

                    if (question.getOptions() != null) {
                        question.getOptions().forEach(option -> {
                            option.setQuestion(question);
                        });
                    }

                    return question;
                })
                .toList();

        exercise.setQuestions(questions);

        Exercise saved = exerciseRepository.save(exercise);

        exerciseMapper.toResponseDTOWithQuestions(saved);
    }

    private void validateQuestion(Question question) {
        if (question.getQuestionText() == null || question.getQuestionText().isBlank()) {
            throw new QuestionException("O texto da questão é obrigatório");
        }

        if (question.getPoints() == null || question.getPoints() <= 0) {
            throw new QuestionException("A pontuação deve ser maior que zero");
        }

        if (question.getType() == null) {
            throw new QuestionException("O tipo da questão é obrigatório");
        }

        switch (question.getType()) {
            case MULTIPLE_CHOICE_SINGLE -> validateMultipleChoiceSingle(question);
            case MULTIPLE_CHOICE_MULTIPLE -> validateMultipleChoiceMultiple(question);
            case TRUE_FALSE -> validateTrueFalse(question);
            case ESSAY -> validateEssay(question);
            case FILL_BLANKS -> validateFillBlanks(question);
            case ORDERING, MATCHING -> {
            }
        }
    }

    private void validateMultipleChoiceSingle(Question question) {
        validateOptions(question);
        long correctCount = countCorrect(question);
        if (correctCount != 1) {
            throw new QuestionException("Deve haver exatamente uma opção correta");
        }
    }

    private void validateMultipleChoiceMultiple(Question question) {
        validateOptions(question);
        long correctCount = countCorrect(question);
        if (correctCount < 1) {
            throw new QuestionException("Deve haver pelo menos uma opção correta");
        }
    }

    private void validateTrueFalse(Question question) {
        validateOptions(question);
        if (question.getOptions().size() != 2) {
            throw new QuestionException("TRUE/FALSE deve ter exatamente 2 opções");
        }
        long correctCount = countCorrect(question);
        if (correctCount != 1) {
            throw new QuestionException("TRUE/FALSE deve ter exatamente uma opção correta");
        }
    }

    private void validateEssay(Question question) {
        if (question.getOptions() != null && !question.getOptions().isEmpty()) {
            throw new QuestionException("Questão dissertativa não deve ter opções");
        }
    }

    private void validateFillBlanks(Question question) {
        if (question.getOptions() != null && !question.getOptions().isEmpty()) {
            throw new QuestionException("FILL_BLANKS não deve usar opções");
        }
    }

    private void validateOptions(Question question) {
        int min = 2;
        if (question.getOptions() == null || question.getOptions().size() < min) {
            throw new QuestionException("Adicione pelo menos " + min + " opções");
        }

        for (QuestionOption option : question.getOptions()) {
            if (option.getOptionText() == null || option.getOptionText().isBlank()) {
                throw new QuestionException("Todas as opções devem ter texto");
            }
        }
    }

    private long countCorrect(Question question) {
        return question.getOptions().stream()
                .filter(option -> Boolean.TRUE.equals(option.getIsCorrect()))
                .count();
    }

    @Transactional
    public void updateExercise(Long exerciseId, UpdateExerciseDTO updateExerciseDTO) {
        Exercise exercise = exerciseRepository.findById(exerciseId)
                .orElseThrow(() -> new ExerciseException("Não é possível atualizar os exercícios"));

        securityService.validateCourseOwner(exercise.getLesson().getModule().getCourse().getId());

        exerciseMapper.updateEntityFromDTO(exercise, updateExerciseDTO);

        if (updateExerciseDTO.questions() != null && !updateExerciseDTO.questions().isEmpty()) {
            exercise.getQuestions().clear();

            List<Question> updatedQuestions = updateExerciseDTO.questions().stream()
                    .map(qDTO -> {
                        List<QuestionOption> options = new ArrayList<>();
                        if (qDTO.options() != null && !qDTO.options().isEmpty()) {
                            options = qDTO.options().stream()
                                    .map(optionDTO -> QuestionOption.builder()
                                            .optionText(optionDTO.optionText())
                                            .isCorrect(optionDTO.isCorrect())
                                            .order(optionDTO.order() != null ? optionDTO.order() : 0)
                                            .feedback(optionDTO.feedback())
                                            .imageUrl(optionDTO.imageUrl())
                                            .matchPair(optionDTO.matchPair())
                                            .correctPosition(optionDTO.correctPosition())
                                            .build())
                                    .toList();
                        }

                        Question question = Question.builder()
                                .exercise(exercise)
                                .type(qDTO.type())
                                .questionText(qDTO.questionText())
                                .explanation(qDTO.explanation())
                                .imageUrl(qDTO.imageUrl())
                                .videoUrl(qDTO.videoUrl())
                                .points(qDTO.points())
                                .order(qDTO.order() != null ? qDTO.order() : 0)
                                .isRequired(qDTO.isRequired() != null ? qDTO.isRequired() : false)
                                .config(qDTO.config())
                                .build();

                        options.forEach(option -> option.setQuestion(question));
                        question.setOptions(new ArrayList<>(options));

                        validateQuestion(question);

                        return question;
                    })
                    .toList();
            exercise.getQuestions().addAll(updatedQuestions);
        }

        exerciseRepository.save(exercise);
    }

    @Transactional
    public void delete(Long exerciseId) {
        Exercise exercise = exerciseRepository.findById(exerciseId).orElseThrow(
                () -> new ExerciseException("Nenhum exercícios encontrado")
        );
        securityService.validateCourseOwner(exercise.getLesson().getModule().getCourse().getId());

        exerciseRepository.delete(exercise);
    }

    public ExerciseStatisticsDTO getStatistics(Long exerciseId) {
        Exercise exercise = exerciseRepository.findById(exerciseId).orElseThrow(
                () -> new ExerciseException("Nenhum exercícios encontrado para tirar as estatísticas")
        );
        securityService.validateCourseOwner(exercise.getLesson().getModule().getCourse().getId());
        return exerciseAttemptRepository.getStatistics(exerciseId).stream()
                .findFirst()
                .map(this::toExerciseStatisticsDTO)
                .orElse(new ExerciseStatisticsDTO(
                        exercise.getTitle(),
                        0,
                        0,
                        null,
                        null,
                        0,
                        0,
                        0.0,
                        0,
                        null,
                        null
                ));
    }

    private ExerciseStatisticsDTO toExerciseStatisticsDTO(Object[] row) {
        String exerciseTitle = row[0].toString();
        Integer totalStudents = toLong(row[1]).intValue();
        int totalAttempts = toLong(row[2]).intValue();
        BigDecimal averageScore = toBigDecimal(row[3]);
        BigDecimal averagePercentage = toBigDecimal(row[4]);
        Integer passedCount = toLong(row[5]).intValue();
        Integer failedCount = toLong(row[6]).intValue();
        Double averageTimeSpent = toDouble(row[7]);
        BigDecimal highestScore = toBigDecimal(row[8]);
        BigDecimal lowestScore = toBigDecimal(row[9]);

        double passRate = totalAttempts > 0 ? (passedCount.doubleValue() / totalAttempts) * 100.0 : 0.0;

        return new ExerciseStatisticsDTO(
                exerciseTitle,
                totalStudents,
                totalAttempts,
                averageScore,
                averagePercentage,
                passedCount,
                failedCount,
                passRate,
                averageTimeSpent != null ? averageTimeSpent.intValue() : 0,
                highestScore,
                lowestScore
        );
    }

    private Long toLong(Object value) {
        return value instanceof Number number ? number.longValue() : 0L;
    }

    private Double toDouble(Object value) {
        return value instanceof Number number ? number.doubleValue() : null;
    }

    private BigDecimal toBigDecimal(Object value) {
        if (value instanceof BigDecimal bigDecimal) {
            return bigDecimal;
        }
        return value instanceof Number number ? BigDecimal.valueOf(number.doubleValue()) : null;
    }

    @Transactional(readOnly = true)
    public List<AttemptResponseDTO> listAttempts(Long exerciseId) {
        Exercise exercise = exerciseRepository.findByIdWithQuestions(exerciseId).orElseThrow(
                () -> new ExerciseException("Nenhum exercício encontrado")
        );
        securityService.validateCourseOwner(exercise.getLesson().getModule().getCourse().getId());

        int totalQuestions = exercise.getQuestions().size();

        return exerciseAttemptRepository.findByExerciseIdWithAnswers(exerciseId)
                .stream()
                .map(attempt -> toAttemptResponseDTO(attempt,totalQuestions))
                .toList();

    }
    private AttemptResponseDTO toAttemptResponseDTO(ExerciseAttempt attempt, int totalQuestions) {
        var exercise = attempt.getExercise();
        var student = attempt.getStudent();

        var answers = attempt.getAnswers()
                .stream()
                .map(answer -> new AnswerResponseDTO(
                        answer.getId(),
                        answer.getQuestion().getId(),
                        answer.getQuestion().getQuestionText(),
                        answer.getQuestion().getType(),
                        answer.getSelectedOptions(),
                        answer.getTextAnswer(),
                        answer.getOrderAnswer(),
                        answer.getMatchAnswer(),
                        answer.getIsCorrect(),
                        answer.getPointsEarned(),
                        answer.getQuestion().getPoints(),
                        answer.getFeedback(),
                        answer.getAnsweredAt()
                ))
                .toList();

        return new AttemptResponseDTO(
                attempt.getId(),
                exercise.getId(),
                exercise.getTitle(),
                student.getId(),
                student.getFullName(),
                student.getEmail(),
                attempt.getAttemptNumber(),
                attempt.getStatus().name(),
                attempt.getStartedAt(),
                attempt.getSubmittedAt(),
                attempt.getGradedAt(),
                attempt.getTimeSpent(),
                attempt.getRemainingTime(),
                attempt.getScore(),
                attempt.getPercentage(),
                attempt.getPassed(),
                attempt.getTeacherFeedback(),
                totalQuestions,
                answers.size(),
                answers,
                attempt.getCreatedAt()
        );
    }
}
