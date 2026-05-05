export interface StudentProgressDTO {
  studentId: number;
  studentName?: string;
  totalAttempts: number;
  bestScore: number;
  bestPercentage: number;
  hasPassed: boolean;
  lastSubmission?: string;
}