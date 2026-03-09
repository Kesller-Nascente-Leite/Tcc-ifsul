package com.meutcc.backend.content.lesson;

import com.meutcc.backend.content.attachment.AttachmentDTO;
import com.meutcc.backend.content.video.VideoDTO;

import java.util.List;

public record LessonDTO(
        Long id,
        String title,
        String description,
        Integer orderIndex,
        Integer durationMinutes,
        Long moduleId,
        String moduleName,
        List<VideoDTO> videos,
        List<AttachmentDTO> attachments
) {

}