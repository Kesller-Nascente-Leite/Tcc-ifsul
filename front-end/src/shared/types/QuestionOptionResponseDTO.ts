export interface QuestionOptionResponseDTO {
  id: number;
  optionText: string;
  imageUrl?: string;
  isCorrect?: boolean;
  order: number;
  feedback?: string;
  matchPair?: string;
  correctPosition?: number;
}