package com.meutcc.backend.content.lesson;

import com.meutcc.backend.content.module.Module;
import com.meutcc.backend.content.module.ModuleRepository;
import com.meutcc.backend.content.video.VideoMapper;
import com.meutcc.backend.content.video.VideoRepository;
import com.meutcc.backend.user.security.SecurityService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;

@Service
@RequiredArgsConstructor
public class LessonService {

    private final LessonRepository lessonRepository;
    private final ModuleRepository moduleRepository;
    private final VideoRepository videoRepository;
    private final LessonMapper lessonMapper;
    private final VideoMapper videoMapper;
    private final SecurityService securityService;

    @Transactional(readOnly = true)
    public List<LessonDTO> listByModule(Long moduleId) {
        Module module = moduleRepository.findById(moduleId)
                .orElseThrow(() -> new LessonException("Módulo não encontrado"));

        securityService.validateCourseOwner(module.getCourse().getId());

        return lessonRepository.findByModuleIdOrderByOrderIndexAsc(moduleId)
                .stream()
                .map(lessonMapper::toDTO)
                .toList();
    }

    public LessonDTO getById(Long id) {
        Lesson lesson = lessonRepository.findById(id)
                .orElseThrow(() -> new LessonException("Aula não encontrada com ID: " + id));

        securityService.validateCourseOwner(lesson.getModule().getCourse().getId());

        return lessonMapper.toDTO(lesson);
    }

    @Transactional
    public LessonDTO create(LessonDTO dto) {
        Module module = moduleRepository.findById(dto.moduleId())
                .orElseThrow(() -> new LessonException("Módulo não encontrado"));

        securityService.validateCourseOwner(module.getCourse().getId());

        Lesson lesson = lessonMapper.toEntity(dto);
        lesson.setModule(module);

        Lesson saved = lessonRepository.save(lesson);
        return lessonMapper.toDTO(saved);
    }

    @Transactional
    public LessonDTO update(Long id, LessonDTO dto) {
        Lesson lesson = lessonRepository.findById(id)
                .orElseThrow(() -> new LessonException("Aula não encontrada com ID: " + id));

        securityService.validateCourseOwner(lesson.getModule().getCourse().getId());

        lesson.setTitle(dto.title());
        lesson.setDescription(dto.description());
        lesson.setOrderIndex(dto.orderIndex());
        lesson.setDurationMinutes(dto.durationMinutes());

        Lesson updated = lessonRepository.save(lesson);
        return lessonMapper.toDTO(updated);
    }

    @Transactional
    public void delete(Long id) {
        Lesson lesson = lessonRepository.findById(id)
                .orElseThrow(() -> new LessonException("Aula não encontrada com ID: " + id));

        securityService.validateCourseOwner(lesson.getModule().getCourse().getId());

        lessonRepository.delete(lesson);
    }

}