package com.meutcc.backend.content.attachment;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.core.io.Resource;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class AttachmentController {

    private final AttachmentService attachmentService;

    @GetMapping("/teacher/attachments/lessons/{lessonId}")
    @ResponseStatus(HttpStatus.OK)
    public List<AttachmentDTO> listByLesson(@PathVariable("lessonId") Long lessonId) {
        return attachmentService.listByLesson(lessonId);
    }

    @PostMapping("/teacher/attachments/link")
    @ResponseStatus(HttpStatus.CREATED)
    public AttachmentDTO createWithUrl(@RequestBody @Valid AttachmentDTO attachmentDTO) {
        return attachmentService.createWithUrl(attachmentDTO);
    }

    @DeleteMapping("/teacher/attachments/{attachmentId}")
    @ResponseStatus(HttpStatus.OK)
    public void delete(@PathVariable("attachmentId") Long attachmentId) {
        attachmentService.delete(attachmentId);
    }


    @PostMapping("/teacher/lessons/{lessonId}/attachments/upload")
    @ResponseStatus(HttpStatus.CREATED)
    public AttachmentDTO uploadFile(
            @PathVariable("lessonId") Long lessonId,
            @RequestParam("title") String title,
            @RequestParam("description") String description,
            @RequestParam(value = "deliveryDate", required = false)
            @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime deliveryDate,
            @RequestParam("file") MultipartFile file
    ) throws IOException {
        return attachmentService.uploadFile(lessonId, title, description, deliveryDate, file);
    }

    @GetMapping("/teacher/attachments/{attachmentsId}/download")
    public ResponseEntity<Resource> download(@PathVariable("attachmentsId") Long attachmentsId) throws IOException {
        AttachmentDownloadDTO download = attachmentService.downloadFileAttachment(attachmentsId);

        ByteArrayResource resource = new ByteArrayResource(download.data());

        return ResponseEntity.ok()
                .contentType(MediaType.parseMediaType(download.contentType()))
                .header(HttpHeaders.CONTENT_DISPOSITION,
                        "attachment; filename=\"" + download.filename() + "\"")
                .contentLength(download.data().length)
                .body(resource);
    }


}
