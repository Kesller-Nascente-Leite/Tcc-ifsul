package com.meutcc.backend.content.attachment;

import org.mapstruct.Builder;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import java.util.List;

@Mapper(componentModel = "spring", builder = @Builder(disableBuilder = true))
public interface AttachmentMapper{

    @Mapping(source = "lesson.id", target = "lessonId")
    AttachmentDTO toDTO(Attachment attachment);

    @Mapping(target = "lesson", ignore = true)
    Attachment toEntity(AttachmentDTO dto);

    List<AttachmentDTO> toDTOs(List<Attachment> attachmentsList);

}
