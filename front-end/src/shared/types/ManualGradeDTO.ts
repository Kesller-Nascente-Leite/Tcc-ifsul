export interface ManualGradeDTO {
  answerId: number;
  isCorrect: boolean;
  pointsEarned: number;
  feedback?: string;
}