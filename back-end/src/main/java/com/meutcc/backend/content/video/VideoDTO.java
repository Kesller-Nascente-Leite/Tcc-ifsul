package com.meutcc.backend.content.video;

public record VideoDTO(
        Long id,
        String title,
        String url,
        VideoStorageType storageType,
        Long lessonId
) {
}