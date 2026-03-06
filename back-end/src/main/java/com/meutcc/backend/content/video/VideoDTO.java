package com.meutcc.backend.content.lesson;

import lombok.Data;

@Data
public class VideoDTO {
    private Long id;
    private String title;
    private String url;
    private VideoStorageType storageType;
    private Long lessonId;
}