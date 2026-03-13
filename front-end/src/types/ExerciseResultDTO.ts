export interface ExerciseResultDTO {
  attemptId: number;
  score: number;
  percentage: number;
  passed: boolean;
  timeSpent?: number;
  totalQuestions: number;
  correctAnswers: number;
  incorrectAnswers: number;
  unansweredQuestions: number;
  teacherFeedback?: string;
  submittedAt?: string;
  gradedAt?: string;
}