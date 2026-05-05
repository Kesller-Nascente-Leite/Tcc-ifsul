import type { AnswerResponseDTO } from "@/shared/types/AnswerResponseDTO";
import type { AttemptStatus } from "@/shared/types/AttemptStatus";

export interface AttemptResponseDTO {
  id: number;
  exerciseId: number;
  exerciseTitle?: string;
  studentId: number;
  studentName?: string;
  studentEmail?: string;
  attemptNumber: number;
  status: AttemptStatus;
  startedAt?: string;
  submittedAt?: string | number | Date;
  gradedAt?: string;
  timeSpent: number;
  remainingTime?: number;
  score: number;
  percentage: number;
  passed: boolean;
  teacherFeedback?: string;
  totalQuestions?: number;
  answeredQuestions?: number;
  answers?: AnswerResponseDTO[];
  createdAt: string;
}