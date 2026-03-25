import type { QuestionType } from "../types/QuestionType";
import type { QuestionDisplayMode } from "../types/QuestionDisplayMode";

export const QUESTION_TYPE_LABELS: Record<QuestionType, string> = {
  MULTIPLE_CHOICE_SINGLE: "Múltipla Escolha (Uma resposta)",
  MULTIPLE_CHOICE_MULTIPLE: "Múltipla Escolha (Várias respostas)",
  TRUE_FALSE: "Verdadeiro ou Falso",
  ESSAY: "Dissertativa",
  FILL_BLANKS: "Preencher Lacunas",
  ORDERING: "Ordenação",
  MATCHING: "Correspondência",
};

export const DISPLAY_MODE_LABELS: Record<QuestionDisplayMode, string> = {
  ALL_AT_ONCE: "Todas de uma vez",
  SEQUENTIAL: "Sequencial (uma por vez)",
};