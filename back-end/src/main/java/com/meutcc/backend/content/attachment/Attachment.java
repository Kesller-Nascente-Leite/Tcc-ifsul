package com.meutcc.backend.content.attachment;

import com.meutcc.backend.common.model.BaseEntity;
import com.meutcc.backend.content.lesson.Lesson;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.JdbcType;
import org.hibernate.type.descriptor.jdbc.VarbinaryJdbcType;

import java.time.LocalDateTime;

@Entity
@Table(name = "tb_attachments")
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

    @Column(name = "file_name", columnDefinition = "TEXT")
    private String fileName;

    @Column(name = "file_url",nullable = true)
    private String fileUrl;

    @JdbcType(VarbinaryJdbcType.class)
    @Column(name = "file_data", columnDefinition = "bytea")
    private byte[] fileData;

    @Column(name = "delivery_date")
    private LocalDateTime deliveryDate;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private AttachmentType type;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "lesson_id", nullable = false)
    private Lesson lesson;

}
