package com.meutcc.backend.content.lesson;

import com.meutcc.backend.content.video.VideoDTO;
import lombok.Data;
import java.util.ArrayList;
import java.util.List;

@Data
public class LessonDTO {
    private Long id;
    private String title;
    private String description;
    private Integer orderIndex;
    private Integer durationMinutes;
    private Long moduleId;
    private String moduleName;
    private List<VideoDTO> videos = new ArrayList<>();
}