package com.meutcc.backend.content.video;

import com.meutcc.backend.common.model.BaseEntity;
import com.meutcc.backend.content.lesson.Lesson;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "videos")
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Video extends BaseEntity {

    @Column(nullable = false)
    private String title;

    @Column(length = 2048)
    private String url;

    @Basic(fetch = FetchType.LAZY)
    @Column(name = "data_blob", columnDefinition = "bytea")
    private byte[] dataBlob;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private VideoStorageType storageType;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "lesson_id", nullable = false)
    private Lesson lesson;
}