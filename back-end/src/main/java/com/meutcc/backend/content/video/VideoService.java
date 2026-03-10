package com.meutcc.backend.content.video;

import com.meutcc.backend.content.lesson.Lesson;
import com.meutcc.backend.content.lesson.LessonException;
import com.meutcc.backend.content.lesson.LessonRepository;
import com.meutcc.backend.security.SecurityService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

@Slf4j
@Service
@RequiredArgsConstructor
public class VideoService {

    private final VideoRepository videoRepository;
    private final LessonRepository lessonRepository;
    private final VideoMapper videoMapper;
    private final SecurityService securityService;

    private static final long MAX_VIDEO_SIZE = 900 * 1024 * 1024; // 900MB

    @Transactional
    public VideoDTO uploadVideo(Long lessonId, String title, MultipartFile file) throws IOException {
        // Validar tamanho do arquivo
        if (file.getSize() > MAX_VIDEO_SIZE) {
            throw new LessonException("Arquivo muito grande. Tamanho máximo: 900MB");
        }

        // Validar tipo de arquivo
        String contentType = file.getContentType();
        if (contentType == null || !contentType.startsWith("video/")) {
            throw new LessonException("Apenas arquivos de vídeo são permitidos");
        }

        // Buscar aula e validar permissão
        Lesson lesson = lessonRepository.findById(lessonId)
                .orElseThrow(() -> new LessonException("Aula não encontrada"));

        securityService.validateCourseOwner(lesson.getModule().getCourse().getId());

        // Criar entidade de vídeo
        Video video = Video.builder()
                .title(title)
                .dataBlob(file.getBytes())
                .storageType(VideoStorageType.DATABASE)
                .lesson(lesson)
                .build();

        Video saved = videoRepository.save(video);

        return videoMapper.toDTO(saved);
    }

    @Transactional
    public VideoDTO addVideoUrl(Long lessonId, String title, String url) {

        Lesson lesson = lessonRepository.findById(lessonId)
                .orElseThrow(() -> new LessonException("Aula não encontrada"));

        securityService.validateCourseOwner(lesson.getModule().getCourse().getId());

        Video video = Video.builder()
                .title(title)
                .url(url)
                .storageType(VideoStorageType.URL)
                .lesson(lesson)
                .build();

        Video saved = videoRepository.save(video);

        return videoMapper.toDTO(saved);
    }

    @Transactional(readOnly = true)
    public VideoDTO getById(Long videoId) {

        Video video = videoRepository.findById(videoId)
                .orElseThrow(() -> new LessonException("Vídeo não encontrado com ID: " + videoId));

        securityService.validateCourseOwner(
                video.getLesson().getModule().getCourse().getId()
        );

        return videoMapper.toDTO(video);
    }

    @Transactional(readOnly = true)
    public VideoDownloadDTO downloadVideo(Long videoId) {

        Video video = videoRepository.findById(videoId)
                .orElseThrow(() -> new LessonException("Vídeo não encontrado com ID: " + videoId));

        securityService.validateCourseOwner(
                video.getLesson().getModule().getCourse().getId()
        );

        if (video.getStorageType() != VideoStorageType.DATABASE) {
            throw new LessonException("Este vídeo não está armazenado no banco de dados");
        }

        if (video.getDataBlob() == null || video.getDataBlob().length == 0) {
            throw new LessonException("Dados do vídeo não encontrados");
        }

        return new VideoDownloadDTO(
                video.getTitle(),
                video.getDataBlob(),
                "video/mp4"
        );
    }

    @Transactional(readOnly = true)
    public List<VideoDTO> listVideosByLesson(Long lessonId) {
        Lesson lesson = lessonRepository.findById(lessonId)
                .orElseThrow(() -> new LessonException("Aula não encontrada"));

        securityService.validateCourseOwner(lesson.getModule().getCourse().getId());

        return videoRepository.findByLessonId(lessonId)
                .stream()
                .map(videoMapper::toDTO)
                .toList();
    }

    @Transactional
    public void deleteVideo(Long videoId) {

        Video video = videoRepository.findById(videoId)
                .orElseThrow(() -> new LessonException("Vídeo não encontrado"));

        securityService.validateCourseOwner(
                video.getLesson().getModule().getCourse().getId()
        );

        videoRepository.delete(video);
    }
}