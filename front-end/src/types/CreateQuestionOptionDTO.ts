export interface CreateQuestionOptionDTO {
  optionText: string;
  imageUrl?: string;
  isCorrect: boolean;
  feedback?: string;
  matchPair?: string;
  orderIndex: number;
  correctPosition?: number;
}
