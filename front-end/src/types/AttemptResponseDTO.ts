import type { AnswerResponseDTO } from "./AnswerResponseDTO";
import type { AttemptStatus } from "./AttemptStatus";

export interface AttemptResponseDTO {
  id: number;
  exerciseId: number;
  exerciseTitle?: string;
  studentId: number;
  studentName?: string;
  attemptNumber: number;
  status: AttemptStatus;
  startedAt?: string;
  submittedAt?: string;
  gradedAt?: string;
  timeSpent?: number;
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