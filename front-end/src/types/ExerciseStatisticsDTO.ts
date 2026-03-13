export interface ExerciseStatisticsDTO {
  totalStudents: number;
  totalAttempts: number;
  averageScore: number;
  averagePercentage: number;
  passedCount: number;
  failedCount: number;
  passRate?: number;
  averageTimeSpent: number;
  highestScore: number;
  lowestScore: number;
}