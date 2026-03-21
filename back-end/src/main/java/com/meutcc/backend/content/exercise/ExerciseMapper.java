package com.meutcc.backend.content.exercise;

import com.meutcc.backend.content.lesson.Lesson;
import com.meutcc.backend.content.question.QuestionMapper;
import org.mapstruct.*;

import java.util.List;

@Mapper(componentModel = "spring", uses = {QuestionMapper.class})
public interface ExerciseMapper {


    @Named("toResponseDTO")
    @Mapping(target = "lessonId", source = "lesson.id")
    @Mapping(target = "isAvailable", expression = "java(exercise.isAvailable())")
    @Mapping(target = "questions", ignore = true)
    ExerciseRequestDTO toResponseDTO(Exercise exercise);

    @Named("toResponseDTOWithQuestions")
    @Mapping(target = "lessonId", source = "lesson.id")
    @Mapping(target = "isAvailable", expression = "java(exercise.isAvailable())")
    ExerciseRequestDTO toResponseDTOWithQuestions(Exercise exercise);

    @IterableMapping(qualifiedByName = "toResponseDTO")
    List<ExerciseRequestDTO> toResponseDTOList(List<Exercise> exercises);

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "lesson", ignore = true)
    @Mapping(target = "questions", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    @Mapping(target = "isActive", constant = "true")
    @Mapping(target = "order", ignore = true)
    @Mapping(target = "availableFrom", ignore = true)
    @Mapping(target = "availableUntil", ignore = true)
    Exercise toEntity(CreateExerciseDTO dto);


    @BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "lesson", ignore = true)
    @Mapping(target = "questions", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    @Mapping(target = "isActive", ignore = true)
    @Mapping(target = "order", ignore = true)
    void updateEntityFromDTO(CreateExerciseDTO dto, @MappingTarget Exercise exercise);


    default Lesson lessonIdToLesson(Long lessonId) {
        if (lessonId == null) return null;
        Lesson lesson = new Lesson();
        lesson.setId(lessonId);
        return lesson;
    }
}