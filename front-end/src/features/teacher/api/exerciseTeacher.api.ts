import type { AnswerResponseDTO } from "@/shared/types/AnswerResponseDTO";
import type { AttemptResponseDTO } from "@/shared/types/AttemptResponseDTO";
import type { CreateExerciseDTO } from "@/shared/types/CreateExerciseDTO";
import type { ExerciseResponseDTO } from "@/shared/types/ExerciseResponseDTO";
import type { ExerciseStatisticsDTO } from "@/shared/types/ExerciseStatisticsDTO";
import type { ManualGradeDTO } from "@/shared/types/ManualGradeDTO";
import type { StartAttemptDTO } from "@/shared/types/StartAttemptDTO";
import type { StudentProgressDTO } from "@/shared/types/StudentProgressDTO";
import type { SubmitAnswerDTO } from "@/shared/types/SubmitAnswerDTO";
import type { UpdateExerciseDTO } from "@/shared/types/UpdateExerciseDTO";
import { api } from "@/shared/api/http";
export class ExerciseTeacherApi {
  //  Listar exercícios de uma aula
  static async listByLesson(lessonId: number) {
    return api.get<ExerciseResponseDTO[]>(
      `/teacher/exercises/lesson/${lessonId}`,
    );
  }

  static async getById(exerciseId: number, includeQuestions = true) {
    return api.get<ExerciseResponseDTO>(
      `/teacher/exercises/${exerciseId}?includeQuestions=${includeQuestions}`,
    );
  }

  static async create(data: CreateExerciseDTO) {
    return api.post<ExerciseResponseDTO>("/teacher/exercises/create", data);
  }

  //  Atualizar exercício
  static async update(exerciseId: number, data: UpdateExerciseDTO) {
    return api.put<ExerciseResponseDTO>(
      `/teacher/exercises/${exerciseId}`,
      data,
    );
  }

  static async remove(exerciseId: number) {
    return api.delete(`/teacher/exercises/${exerciseId}`);
  }

  //  Duplicar exercício
  static async duplicate(exerciseId: number) {
    return api.post<ExerciseResponseDTO>(
      `/teacher/exercises/${exerciseId}/duplicate`,
    );
  }

  //  Obter estatísticas do exercício
  static async getStatistics(exerciseId: number) {
    return api.get<ExerciseStatisticsDTO>(
      `/teacher/exercises/${exerciseId}/statistics`,
    );
  }

  //  Listar todas as tentativas do exercício
  static async listAttempts(exerciseId: number) {
    return api.get<AttemptResponseDTO[]>(
      `/teacher/exercises/${exerciseId}/attempts`,
    );
  }

  //  Obter progresso de um aluno específico
  static async getStudentProgress(exerciseId: number, studentId: number) {
    return api.get<StudentProgressDTO>(
      `/teacher/exercises/${exerciseId}/students/${studentId}/progress`,
    );
  }

  //  Exportar resultados (CSV e Excel)
  static async exportResults(exerciseId: number) {
    const response = await api.get(`/teacher/exercises/${exerciseId}/export`, {
      responseType: "blob",
    });

    const blob = new Blob([response.data], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `exercise_${exerciseId}_results.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  }

  //  Iniciar nova tentativa
  static async startAttempt(exerciseId: number, data: StartAttemptDTO) {
    return api.post<AttemptResponseDTO>(
      `/teacher/exercises/${exerciseId}/attempts`,
      data,
    );
  }

  //  Obter tentativa por ID
  static async getAttempt(attemptId: number) {
    return api.get<AttemptResponseDTO>(
      `/teacher/exercises/attempts/${attemptId}`,
    );
  }

  //  Submeter resposta
  static async submitAnswer(data: SubmitAnswerDTO) {
    return api.post<AnswerResponseDTO>(
      `/teacher/exercises/attempts/${data.attemptId}/answers`,
      data,
    );
  }

  //  Finalizar tentativa
  static async submitAttempt(attemptId: number) {
    return api.post(`/teacher/exercises/attempts/${attemptId}/submit`);
  }

  //  Corrigir resposta dissertativa manualmente
  static async gradeAnswer(answerId: number, data: ManualGradeDTO) {
    return api.post<AnswerResponseDTO>(
      `/teacher/exercises/answers/${answerId}/grade`,
      data,
    );
  }

  //  Atualizar feedback do professor na tentativa
  static async updateAttemptFeedback(attemptId: number, feedback: string) {
    return api.patch(`/teacher/exercises/attempts/${attemptId}/feedback`, {
      feedback,
    });
  }
}
