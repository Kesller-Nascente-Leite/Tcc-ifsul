package com.meutcc.backend.content.attachment;

public record AttachmentDownloadDTO(
        String filename,
        byte[] data,
        String contentType
) {
}
