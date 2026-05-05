package com.meutcc.backend.content.attachment;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AttachmentRepository extends JpaRepository<Attachment,Long> {

    List<Attachment> findByLessonId(Long lessonId);
}
