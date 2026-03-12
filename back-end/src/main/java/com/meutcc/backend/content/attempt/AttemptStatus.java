package com.meutcc.backend.content.attempt;

public enum AttemptStatus {
    IN_PROGRESS,    // Em andamento
    SUBMITTED,      // Submetido, aguardando correção
    GRADED,         // Corrigido
    EXPIRED         // Tempo limite esgotado
}
