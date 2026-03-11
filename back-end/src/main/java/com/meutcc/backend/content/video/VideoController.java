package com.meutcc.backend.content.video;

import lombok.RequiredArgsConstructor;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.core.io.Resource;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;
import java.util.concurrent.TimeUnit;

@RestController
@RequestMapping("/api/teacher")
@CrossOrigin(origins = {"http://localhost:5173", "http://10.0.0.109:5173"})
@RequiredArgsConstructor
public class VideoController {

    private final VideoService videoService;

    // Upload de vídeo para o bd
    @PostMapping("/lessons/{lessonId}/videos/upload")
    @ResponseStatus(HttpStatus.CREATED)
    public VideoDTO uploadVideo(
            @PathVariable Long lessonId,
            @RequestParam("title") String title,
            @RequestParam("file") MultipartFile file
    ) throws IOException {
        return videoService.uploadVideo(lessonId, title, file);
    }

    // Adicionar vídeo por URL
    @PostMapping("/lessons/{lessonId}/videos/url")
    @ResponseStatus(HttpStatus.CREATED)
    public VideoDTO addVideoUrl(
            @PathVariable Long lessonId,
            @RequestParam("title") String title,
            @RequestParam("url") String url
    ) {
        return videoService.addVideoUrl(lessonId, title, url);
    }

    // Listar vídeos de uma aula
    @GetMapping("/lessons/{lessonId}/videos")
    @ResponseStatus(HttpStatus.OK)
    public List<VideoDTO> listVideos(@PathVariable Long lessonId) {
        return videoService.listVideosByLesson(lessonId);
    }

    // Buscar vídeo por ID
    @GetMapping("/videos/{id}")
    public ResponseEntity<VideoDTO> getById(@PathVariable Long id) {
        VideoDTO video = videoService.getById(id);
        return ResponseEntity.ok(video);
    }

    // Stream de vídeo
    @GetMapping("/videos/{id}/stream")
    public ResponseEntity<byte[]> streamVideo(@PathVariable Long id) {
        VideoDownloadDTO download = videoService.downloadVideo(id);

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.parseMediaType(download.contentType()));
        headers.setContentDisposition(
                ContentDisposition.inline()
                        .filename(download.filename() + ".mp4")
                        .build()
        );
        headers.setCacheControl(CacheControl.maxAge(3600, TimeUnit.SECONDS));

        return ResponseEntity.ok()
                .headers(headers)
                .body(download.data());
    }

    // Download de vídeo do bd
    @GetMapping("/videos/{videoId}/download")
    public ResponseEntity<Resource> downloadVideo(@PathVariable Long videoId) {
        VideoDownloadDTO download = videoService.downloadVideo(videoId);

        ByteArrayResource resource = new ByteArrayResource(download.data());

        return ResponseEntity.ok()
                .contentType(MediaType.parseMediaType(download.contentType()))
                .header(HttpHeaders.CONTENT_DISPOSITION,
                        "attachment; filename=\"" + download.filename() + ".mp4\"")
                .contentLength(download.data().length)
                .body(resource);
    }

    @DeleteMapping("/videos/{videoId}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteVideo(@PathVariable Long videoId) {
        videoService.deleteVideo(videoId);
    }
}