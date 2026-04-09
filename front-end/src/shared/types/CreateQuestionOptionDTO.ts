export interface CreateQuestionOptionDTO {
  id?: number;
  optionText: string;
  imageUrl?: string;
  isCorrect: boolean;
  feedback?: string;
  matchPair?: string;
  order?: number;
  correctPosition?: number;
}
