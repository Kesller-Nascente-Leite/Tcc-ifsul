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
import java.util.Arrays;
import java.util.List;

@Service
@RequiredArgsConstructor
public class AttachmentService {

    private final AttachmentRepository attachmentRepository;
    private final SecurityService securityService;
    private final AttachmentMapper attachmentMapper;
    private final LessonRepository lessonRepository;
    private static final long MAX_FILE_SIZE = 50 * 1024 * 1024; //50 mb

    @Transactional
    public AttachmentDTO createWithUrl(@Valid AttachmentDTO attachmentDTO) {
        Lesson lesson = lessonRepository.findById(attachmentDTO.lessonId())
                .orElseThrow(() -> new LessonException("Aula não encontrada"));
        securityService.validateCourseOwner(lesson.getModule().getCourse().getId());

        Attachment attachment = attachmentMapper.toEntity(attachmentDTO);
        attachment.setLesson(lesson);
        attachment.setType(AttachmentType.LINK);

        Attachment savedAttachment = attachmentRepository.save(attachment);
        return attachmentMapper.toDTO(savedAttachment);
    }


    public List<AttachmentDTO> listByLesson(Long lessonId) {
        List<Attachment> attachments = attachmentRepository.findByLessonId(lessonId);
        return attachmentMapper.toDTOs(attachments);
    }

    @Transactional
    public AttachmentDTO uploadFile(Long lessonId, String title, String description, LocalDateTime deliveryDate, MultipartFile file) throws IOException {
        if (file.getSize() > MAX_FILE_SIZE) throw new LessonException("file size too large");
        String contentType = file.getContentType();
        List<String> allowedTypes = Arrays.asList(
                "application/pdf",
                "application/msword",
                "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
                "application/ppsx",
                "application/vnd.openxmlformats-officedocument.presentationml.presentation",
                "application/vnd.ms-powerpoint"
        );

        if (!allowedTypes.contains(contentType)) throw new LessonException("Tipo de arquivo não permitido");
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
        savedAttachment.setFileUrl("/api/teacher/attachments/" + savedAttachment.getId() + "/download");
        savedAttachment = attachmentRepository.save(savedAttachment);
        return attachmentMapper.toDTO(savedAttachment);

    }

    @Transactional(readOnly = true)
    public AttachmentDownloadDTO downloadFileAttachment(Long attachmentsId) {
        Attachment attachment = attachmentRepository.findById(attachmentsId)
                .orElseThrow(()
                        -> new LessonException("Anexo não encontrado")
                );
        /* Somente o dono do curso por enquanto, dps tenho que criar um metodo para isso */
        securityService.validateCourseOwner(attachment.getLesson().getModule().getCourse().getId());

        if (attachment.getType() != AttachmentType.FILE) {
            throw new AttachmentException("Anexo não armazenado no Banco de dados");
        }

        if (attachment.getFileData() == null || attachment.getFileData().length == 0) {
            throw new AttachmentException("Dados do anexo não foram encontrados");
        }
        String fileName = attachment.getFileName();
        String contentType = determineContentType(fileName);

        return new AttachmentDownloadDTO(
                fileName,
                attachment.getFileData(),
                contentType
        );

    }

    private String determineContentType(String fileName) {
        if (fileName == null || !fileName.contains(".")) {
            return "application/octet-stream";
        }

        String extension = fileName.substring(fileName.lastIndexOf(".") + 1).toLowerCase();

        return switch (extension) {
            case "pdf" -> "application/pdf";
            case "doc" -> "application/msword";
            case "docx" -> "application/vnd.openxmlformats-officedocument.wordprocessingml.document";
            case "ppt" -> "application/vnd.ms-powerpoint";
            case "pptx" -> "application/vnd.openxmlformats-officedocument.presentationml.presentation";
            case "xls" -> "application/vnd.ms-excel";
            case "xlsx" -> "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";
            case "txt" -> "text/plain";
            case "jpg", "jpeg" -> "image/jpeg";
            case "png" -> "image/png";
            default -> "application/octet-stream";
        };
    }

    @Transactional
    public void delete(Long attachmentId) {
        Attachment attachment = attachmentRepository.findById(attachmentId).orElseThrow(() -> new AttachmentException("Anexo não encontrado"));
        securityService.validateCourseOwner(attachment.getLesson().getModule().getCourse().getId());
        attachmentRepository.delete(attachment);
    }
}
