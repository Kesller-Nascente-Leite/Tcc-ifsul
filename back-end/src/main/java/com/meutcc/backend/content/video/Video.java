package com.meutcc.backend.content.lesson;

import com.meutcc.backend.common.model.BaseEntity;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "tb_video")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Video extends BaseEntity {  // ✅ Herdar BaseEntity

    private String title;

    @Column(length = 1000)
    private String url;

    @Lob
    @Column(name = "data_blob")
    private byte[] dataBlob;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private VideoStorageType storageType;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "lesson_id")
    private Lesson lesson;
}