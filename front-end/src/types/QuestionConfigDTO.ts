export interface QuestionConfigDTO {
  caseSensitive?: boolean;
  partialCredit?: boolean;
  minWords?: number;
  maxWords?: number;
  acceptableAnswers?: string[];
}