import type { QuestionType } from "@/shared/types/QuestionType";
import type { QuestionDisplayMode } from "@/shared/types/QuestionDisplayMode";

export function getQuestionTypeLabel(type: QuestionType) {
  switch (type) {
    case "MULTIPLE_CHOICE_SINGLE":
      return "Multipla escolha";
    case "MULTIPLE_CHOICE_MULTIPLE":
      return "Multipla resposta";
    case "TRUE_FALSE":
      return "Verdadeiro ou falso";
    case "ESSAY":
      return "Dissertativa";
    case "FILL_BLANKS":
      return "Preencher lacuna";
    case "ORDERING":
      return "Ordenação";
    case "MATCHING":
      return "Correspondencia";
    default:
      return "Desconhecido";
  }
}

export function getDisplayModeLabel(mode: QuestionDisplayMode) {
  switch (mode) {
    case "ALL_AT_ONCE":
      return "Todas as questoes de uma vez";
    case "SEQUENTIAL":
      return "Uma questao por vez";
    default:
      return mode;
  }
}