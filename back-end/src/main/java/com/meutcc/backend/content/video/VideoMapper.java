package com.meutcc.backend.content.video;

import org.mapstruct.Builder;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import java.util.List;

@Mapper(componentModel = "spring", builder = @Builder(disableBuilder = true))
public interface VideoMapper {


    @Mapping(source = "lesson.id", target = "lessonId")
    VideoDTO toDTO(Video video);

    @Mapping(target = "lesson", ignore = true)
    @Mapping(target = "dataBlob", ignore = true)
    Video toEntity(VideoDTO dto);

    List<VideoDTO> toDTOs(List<Video> videos);
}