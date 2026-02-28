package com.meutcc.backend.content.lesson;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "tb_video")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Video {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String title;

    private String url;

    @Lob
    @Column(name = "data_blob")
    private byte[] dataBlob;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private VideoStorageType storageType;

    @ManyToOne
    @JoinColumn(name = "lesson_id")
    private Lesson lesson;

    private java.time.LocalDateTime createdAt;
    private java.time.LocalDateTime updatedAt;

    @PrePersist
    protected void onCreate() {
        createdAt = java.time.LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = java.time.LocalDateTime.now();
    }

}