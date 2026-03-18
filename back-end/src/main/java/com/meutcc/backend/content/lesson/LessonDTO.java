package com.meutcc.backend.content.lesson;

import com.meutcc.backend.content.attachment.AttachmentDTO;
import com.meutcc.backend.content.exercise.ExerciseResponseDTO;
import com.meutcc.backend.content.video.VideoDTO;
import jakarta.validation.constraints.Size;

import java.util.List;

public record LessonDTO(
        Long id,
        @Size(min = 1, max = 100)
        String title,
        @Size(min = 1, max = 1000)
        String description,
        Integer orderIndex,
        Integer durationMinutes,
        Long moduleId,
        String moduleName,
        List<VideoDTO> videos,
        List<AttachmentDTO> attachments,
        List<ExerciseResponseDTO> exercises
) {

}