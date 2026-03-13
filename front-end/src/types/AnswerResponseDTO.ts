import type { QuestionType } from "./QuestionType";

export interface AnswerResponseDTO {
  id: number;
  questionId: number;
  questionText?: string;
  questionType?: QuestionType;
  selectedOptions?: number[];
  textAnswer?: string;
  orderAnswer?: number[];
  matchAnswer?: Record<number, string>;
  isCorrect?: boolean;
  pointsEarned: number;
  maxPoints?: number;
  feedback?: string;
  answeredAt?: string;
}