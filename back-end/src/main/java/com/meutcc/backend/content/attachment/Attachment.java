package com.meutcc.backend.content.attachment;

import com.meutcc.backend.common.model.BaseEntity;
import com.meutcc.backend.content.lesson.Lesson;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "tb_attachment")
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Attachment extends BaseEntity {

    @Column(length = 250, nullable = false)
    private String title;

    @Column(length = 700, nullable = false)
    private String description;

    @Column(columnDefinition = "TEXT")
    private String fileNamePdf;

    @Column(nullable = false)
    private String fileUrl;

    @Column(name = "delivery_date", nullable = false)
    private LocalDateTime deliveryDate;

    @ManyToOne(fetch = FetchType.LAZY)
    private Lesson lesson;

}
