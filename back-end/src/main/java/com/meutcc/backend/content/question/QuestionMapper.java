package com.meutcc.backend.content.question;

import com.meutcc.backend.content.exercise.Exercise;
import org.mapstruct.*;

import java.util.List;

@Mapper(
        componentModel = MappingConstants.ComponentModel.SPRING,
        unmappedTargetPolicy = ReportingPolicy.IGNORE,
        builder = @Builder(disableBuilder = true)
)
public interface QuestionMapper {


    @Mapping(source = "exercise.id", target = "exerciseId")
    @Mapping(source = "options", target = "options")
    QuestionRequestDTO toDto(Question entity);

    @Mapping(target = "id", ignore = true)
    @Mapping(source = "exerciseId", target = "exercise", qualifiedByName = "idToExercise")
    @Mapping(source = "options", target = "options")
    Question toEntity(CreateQuestionDTO dto);


    QuestionOptionResponseDTO toOptionDto(QuestionOption option);

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "question", ignore = true)
    QuestionOption toOptionEntity(CreateQuestionOptionDTO dto);


    @Named("idToExercise")
    default Exercise idToExercise(Long id) {
        if (id == null) return null;
        Exercise exercise = new Exercise();
        exercise.setId(id);
        return exercise;
    }

    // O MapStruct usa estes automaticamente para as listas
    List<QuestionOptionResponseDTO> toOptionDtoList(List<QuestionOption> options);

    List<QuestionOption> toOptionEntityList(List<CreateQuestionOptionDTO> dtos);
}