package com.meutcc.backend.content.attachment;

import com.meutcc.backend.content.lesson.Lesson;
import com.meutcc.backend.content.lesson.LessonException;
import com.meutcc.backend.content.lesson.LessonRepository;
import com.meutcc.backend.security.SecurityService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class AttachmentService {

    private final AttachmentRepository attachmentRepository;
    private final SecurityService securityService;
    private final AttachmentMapper attachmentMapper;
    private final LessonRepository lessonRepository;
    private final long MAX_FILE_SIZE = 50 * 1024 * 1024; //50 mb

    @Transactional
    public AttachmentDTO createWithUrl(@Valid AttachmentDTO attachmentDTO) {
        Lesson lesson = lessonRepository.findById(attachmentDTO.lessonId())
                .orElseThrow(() -> new LessonException("Aula não encontrada"));
        securityService.validateCourseOwner(lesson.getModule().getCourse().getId());

        Attachment attachment = attachmentMapper.toEntity(attachmentDTO);
        attachment.setType(AttachmentType.LINK);

        Attachment savedAttachment = attachmentRepository.save(attachment);
        return attachmentMapper.toDTO(savedAttachment);
    }


    public List<AttachmentDTO> listByLesson(Long lessonId) {

        List<Attachment> attachments = attachmentRepository.findByLessonId(lessonId);
        return attachmentMapper.toDTOs(attachments);
    }

    public AttachmentDTO uploadFile(Long lessonId, String title, String description, LocalDateTime deliveryDate, MultipartFile file) throws IOException {
        if (file.getSize() > MAX_FILE_SIZE) throw new LessonException("file size too large");

        Lesson lesson = lessonRepository.findById(lessonId).orElseThrow(() ->
                new LessonException("Aula não encontrada"));
        securityService.validateCourseOwner(lesson.getModule().getCourse().getId());

        Attachment attachment = Attachment.builder()
                .title(title)
                .description(description)
                .deliveryDate(deliveryDate)
                .fileName(file.getOriginalFilename())
                .fileData(file.getBytes())
                .type(AttachmentType.FILE)
                .lesson(lesson)
                .build();
        Attachment savedAttachment = attachmentRepository.save(attachment);
        return attachmentMapper.toDTO(savedAttachment);

    }
}
