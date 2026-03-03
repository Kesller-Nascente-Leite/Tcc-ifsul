package com.meutcc.backend.content.module;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.factory.Mappers;

import java.util.List;

@Mapper(componentModel = "spring")
public interface ModuleMapper {
    ModuleMapper INSTANCE = Mappers.getMapper(ModuleMapper.class);

    // Entity(Module) -> ModuleDTO
    @Mapping(source = "course.id", target = "courseId")
    ModuleDTO toDTO(Module module);

    // DTO(ModuleDTO) -> Entity(Module)
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "course", ignore = true)
    @Mapping(target = "subject", ignore = true)
    @Mapping(target = "lessons", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    Module toEntity(ModuleDTO dto);

    // Converte lista de Entity -> lista de ModuleDTO
    List<ModuleDTO> toDTOs(List<Module> modules);

}
