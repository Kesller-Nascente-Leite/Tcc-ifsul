package com.meutcc.backend.content.exercise;

import com.meutcc.backend.content.lesson.Lesson;
import com.meutcc.backend.content.lesson.LessonException;
import com.meutcc.backend.content.lesson.LessonRepository;
import com.meutcc.backend.security.SecurityService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ExerciseService {

    private final ExerciseRepository exerciseRepository;
    private final ExerciseMapper exerciseMapper;
    private final LessonRepository lessonRepository;
    private final SecurityService securityService;

    public List<ExerciseResponseDTO> getAllExercises(Long lessonId) {
        Lesson lesson = lessonRepository.findById(lessonId).orElseThrow(
                () -> new LessonException("Nenhuma lição encontrada")
        );
        securityService.validateCourseOwner(lesson.getModule().getCourse().getId());

        List<Exercise> exercise = exerciseRepository.findByLessonId(lessonId);
        return exerciseMapper.toResponseDTOList(exercise);
    }

}
