package com.meutcc.backend.content.lesson;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import java.util.List;

@Mapper(componentModel = "spring")
public interface VideoMapper {

    @Mapping(source = "lesson.id", target = "lessonId")
    VideoDTO toDTO(Video video);

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "lesson", ignore = true)
    @Mapping(target = "dataBlob", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    Video toEntity(VideoDTO dto);

    List<VideoDTO> toDTOs(List<Video> videos);
}