package com.meutcc.backend.content.video;


public record VideoDownloadDTO(
        String filename,
        byte[] data,
        String contentType
) {
}