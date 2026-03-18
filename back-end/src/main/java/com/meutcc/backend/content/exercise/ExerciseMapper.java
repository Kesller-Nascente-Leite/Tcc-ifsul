package com.meutcc.backend.content.exercise;

import com.meutcc.backend.content.lesson.Lesson;
import com.meutcc.backend.content.question.*;
import org.mapstruct.*;

import java.util.List;

@Mapper(componentModel = "spring", unmappedTargetPolicy = ReportingPolicy.IGNORE)
public interface ExerciseMapper {

    // ===========================
    // EXERCISE MAPPINGS
    // ===========================

    /**
     * Converte Exercise para ExerciseResponseDTO (sem questões detalhadas)
     */
    @Named("toResponseDTO")  // ← ADICIONAR ESTE @Named
    @Mapping(target = "isAvailable", source = "available")
    @Mapping(target = "questionsCount", expression = "java(exercise.getQuestions() != null ? exercise.getQuestions().size() : 0)")
    @Mapping(target = "questions", ignore = true)
    @Mapping(target = "statistics", ignore = true)
    ExerciseResponseDTO toResponseDTO(Exercise exercise);

    /**
     * Converte Exercise para ExerciseResponseDTO (COM questões detalhadas)
     */
    @Named("toResponseDTOWithQuestions")  // ← ADICIONAR ESTE @Named
    @Mapping(target = "isAvailable", source = "available")
    @Mapping(target = "questionsCount", expression = "java(exercise.getQuestions() != null ? exercise.getQuestions().size() : 0)")
    @Mapping(target = "questions", source = "questions")
    @Mapping(target = "statistics", ignore = true)
    ExerciseResponseDTO toResponseDTOWithQuestions(Exercise exercise);

    /**
     * Converte lista de Exercise para lista de ExerciseResponseDTO
     * Usa o método SEM questões por padrão
     */
    @IterableMapping(qualifiedByName = "toResponseDTO")  // ← ADICIONAR ISTO
    List<ExerciseResponseDTO> toResponseDTOList(List<Exercise> exercises);

    /**
     * Converte CreateExerciseDTO para Exercise
     */
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "lesson", source = "lessonId", qualifiedByName = "lessonIdToLesson")
    @Mapping(target = "questions", ignore = true)
    @Mapping(target = "attempts", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    Exercise toEntity(CreateExerciseDTO dto);

    /**
     * Atualiza Exercise existente com dados do CreateExerciseDTO
     * (Usa o mesmo DTO de criação para atualização)
     */
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "lesson", ignore = true)
    // ❌ REMOVER ESTA LINHA: @Mapping(target = "lessonId", ignore = true)
    @Mapping(target = "questions", ignore = true)
    @Mapping(target = "attempts", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    void updateEntityFromDTO(CreateExerciseDTO dto, @MappingTarget Exercise exercise);

    // ===========================
    // QUESTION MAPPINGS
    // ===========================

    /**
     * Converte Question para QuestionResponseDTO
     */
    @Mapping(target = "options", source = "options")
    QuestionResponseDTO toQuestionResponseDTO(Question question);

    /**
     * Converte lista de Question para lista de QuestionResponseDTO
     */
    List<QuestionResponseDTO> toQuestionResponseDTOList(List<Question> questions);

    /**
     * Converte CreateQuestionDTO para Question
     */
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "exercise", ignore = true)
    @Mapping(target = "options", source = "options")
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    Question toQuestionEntity(CreateQuestionDTO dto);

    /**
     * Converte lista de CreateQuestionDTO para lista de Question
     */
    List<Question> toQuestionEntityList(List<CreateQuestionDTO> dtos);

    // ===========================
    // QUESTION OPTION MAPPINGS
    // ===========================

    /**
     * Converte QuestionOption para QuestionOptionResponseDTO
     */
    QuestionOptionResponseDTO toQuestionOptionResponseDTO(QuestionOption option);

    /**
     * Converte lista de QuestionOption para lista de QuestionOptionResponseDTO
     */
    List<QuestionOptionResponseDTO> toQuestionOptionResponseDTOList(List<QuestionOption> options);

    /**
     * Converte CreateQuestionOptionDTO para QuestionOption
     */
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "question", ignore = true)
    QuestionOption toQuestionOptionEntity(CreateQuestionOptionDTO dto);

    /**
     * Converte lista de CreateQuestionOptionDTO para lista de QuestionOption
     */
    List<QuestionOption> toQuestionOptionEntityList(List<CreateQuestionOptionDTO> dtos);

    // ===========================
    // HELPER METHODS
    // ===========================

    /**
     * Converte lessonId para Lesson entity
     */
    @Named("lessonIdToLesson")
    default Lesson lessonIdToLesson(Long lessonId) {
        if (lessonId == null) {
            return null;
        }
        Lesson lesson = new Lesson();
        lesson.setId(lessonId);
        return lesson;
    }

    /**
     * Método auxiliar para calcular isAvailable
     */
    @Named("calculateIsAvailable")
    default Boolean calculateIsAvailable(Exercise exercise) {
        return exercise.isAvailable();
    }
}