package com.meutcc.backend.content.lesson;

public enum VideoStorageType {
    URL,         // Link do YouTube, Vimeo, etc
    DATABASE,    // Armazenado no BD (pequenos)
    FILE_SYSTEM  // Armazenado no filesystem
}