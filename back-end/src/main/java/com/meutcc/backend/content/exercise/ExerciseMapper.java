package com.meutcc.backend.content.exercise;

import com.meutcc.backend.content.exercise.dtos.CreateExerciseDTO;
import com.meutcc.backend.content.exercise.dtos.UpdateExerciseDTO;
import com.meutcc.backend.content.question.QuestionMapper;
import org.mapstruct.*;

import java.util.List;

@Mapper(componentModel = "spring", uses = {QuestionMapper.class})
public interface ExerciseMapper {

    @Named("toResponseDTO")
    @Mapping(target = "isAvailable", expression = "java(exercise.isAvailable())")
    @Mapping(target = "questions", ignore = true)
    ExerciseResponseDTO toResponseDTO(Exercise exercise);

    @Named("toResponseDTOWithQuestions")
    @Mapping(target = "isAvailable", expression = "java(exercise.isAvailable())")
    @Mapping(target = "questions", source = "questions")
    ExerciseResponseDTO toResponseDTOWithQuestions(Exercise exercise);

    @IterableMapping(qualifiedByName = "toResponseDTO")
    List<ExerciseResponseDTO> toResponseDTOList(List<Exercise> exercises);

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
    void updateEntityFromDTO(@MappingTarget Exercise exercise,UpdateExerciseDTO dto);

}