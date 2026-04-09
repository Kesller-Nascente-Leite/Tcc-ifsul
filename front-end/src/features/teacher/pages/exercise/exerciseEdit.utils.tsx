// Utility functions for ExerciseEdit
import type { UpdateQuestionDTO } from "@/shared/types/UpdateQuestionDTO";

export function mapResponseQuestions(questions: any[]) {
  return questions.map(q => ({
    tempId: Math.random().toString(),
    ...q,
    options: q.options?.map((option: any) => ({
      tempId: Math.random().toString(),
      ...option,
    })) ?? [],
  }));
}

export function mapExerciseResponseToForm(exercise: any) {
  return {
    title: exercise.title || "",
    description: exercise.description || "",
    instructions: exercise.instructions || "",
    totalPoints: exercise.totalPoints || 100,
    passingScore: exercise.passingScore || 60,
    timeLimit: exercise.timeLimit || "",
    maxAttempts: exercise.maxAttempts || 0,
    shuffleQuestions: exercise.shuffleQuestions || false,
    shuffleOptions: exercise.shuffleOptions || false,
    showCorrectAnswers: exercise.showCorrectAnswers || false,
    showScore: exercise.showScore || false,
    allowReview: exercise.allowReview || false,
    questionDisplayMode: exercise.questionDisplayMode || "ALL_AT_ONCE",
  };
}

export function resolveExerciseEditLoadErrorMessage(_error: any) {
  return "Erro ao carregar exercício";
}

export function resolveExerciseEditSaveErrorMessage(_error: any) {
  return "Erro ao salvar exercício";
}

export function normalizeQuestions(questions: any[]) {
  return questions;
}

export function createQuestion(type: any, index: number, totalPoints: number) {
  return {
    tempId: Math.random().toString(),
    order: index,
    type,
    title: "",
    content: "",
    questionText: "",
    points: Math.floor(totalPoints / (index + 1)),
    options: [],
    config: {},
  };
}

export function swapItems(array: any[], fromIndex: number, toIndex: number): any[] {
  const result = [...array];
  const [removed] = result.splice(fromIndex, 1);
  result.splice(toIndex, 0, removed);
  return result;
}

export function createOption(data: any) {
  return {
    tempId: Math.random().toString(),
    ...data,
  };
}

export function parseAnswers(value: string) {
  return value.split("\n").filter(a => a.trim());
}

export function trimOrUndefined(value: string) {
  return value.trim() || undefined;
}

export function mapQuestionToDTO(question: any, index: number): UpdateQuestionDTO {
  return {
    id: question.id || undefined,
    type: question.type,
    questionText: question.questionText || undefined,
    explanation: question.explanation || undefined,
    imageUrl: question.imageUrl || undefined,
    videoUrl: question.videoUrl || undefined,
    points: question.points || undefined,
    order: index,
    isRequired: question.isRequired || undefined,
    config: question.config || undefined,
    options: question.options || undefined,
  };
}

export function mapQuestionToCreateDTO(question: any, index: number) {
  return {
    type: question.type,
    questionText: question.questionText,
    explanation: question.explanation,
    imageUrl: question.imageUrl,
    videoUrl: question.videoUrl,
    points: question.points,
    order: index,
    isRequired: question.isRequired,
    config: question.config,
    options: question.options,
  };
}

export function buildUpdatePayload(form: any) {
  return {
    ...form,
  };
}

export function createQuestionSignature(questions: any[]) {
  return JSON.stringify(questions.map(q => ({ type: q.type, content: q.content })));
}

export function renderQuestionPreview(_question: any, _accentColor: string) {
  return <div>Preview not implemented</div>;
}