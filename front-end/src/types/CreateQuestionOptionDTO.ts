export interface CreateQuestionOptionDTO {
  optionText: string;
  imageUrl?: string;
  isCorrect: boolean;
  order?: number;
  feedback?: string;
  matchPair?: string;
  correctPosition?: number;
}