package com.meutcc.backend.content.lesson;

import org.mapstruct.Builder;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;
import java.util.List;

@Mapper(componentModel = "spring", builder = @Builder(disableBuilder = true))
public interface LessonMapper {

    @Mapping(source = "module.id", target = "moduleId")
    @Mapping(source = "module.title", target = "moduleName")
    LessonDTO toDTO(Lesson lesson);

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "module", ignore = true)
    @Mapping(target = "videos", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    Lesson toEntity(LessonDTO dto);

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "module", ignore = true)
    @Mapping(target = "videos", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    void updateEntityFromDTO(LessonDTO dto, @MappingTarget Lesson lesson);

    List<LessonDTO> toDTOs(List<Lesson> lessons);
}