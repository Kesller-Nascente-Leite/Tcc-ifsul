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
public class Video extends BaseEntity {

    private String title;

    @Enumerated(EnumType.STRING)
    @Column(name = "storage_type", nullable = false)
    private VideoStorageType storageType;

    private String url;

    @Lob
    @Basic(fetch = FetchType.LAZY)
    @Column(name = "data_blob")
    private byte[] dataBlob;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "lesson_id")
    private Lesson lesson;
}