export interface SubmitAnswerDTO {
  attemptId: number;
  questionId: number;
  selectedOptions?: number[];
  textAnswer?: string;
  orderAnswer?: number[];
  matchAnswer?: Record<number, string>;
}