import type { CreateExerciseDTO } from "@/shared/types/CreateExerciseDTO";
import type { CreateQuestionDTO } from "@/shared/types/CreateQuestionDTO";

export interface ValidationError {
  field: string;
  message: string;
}

export class ExerciseValidator {
  static validateBasicInfo(
    data: Partial<CreateExerciseDTO>,
  ): ValidationError[] {
    const errors: ValidationError[] = [];

    if (!data.title?.trim()) {
      errors.push({ field: "title", message: "Titulo e obrigatorio" });
    }

    if (data.title && data.title.trim().length < 3) {
      errors.push({
        field: "title",
        message: "Titulo deve ter no minimo 3 caracteres",
      });
    }

    if (data.totalPoints !== undefined && data.totalPoints <= 0) {
      errors.push({
        field: "totalPoints",
        message: "Pontuacao total deve ser maior que zero",
      });
    }

    if (data.passingScore !== undefined) {
      if (data.passingScore < 0) {
        errors.push({
          field: "passingScore",
          message: "Nota minima nao pode ser negativa",
        });
      }

      if (data.passingScore > 100) {
        errors.push({
          field: "passingScore",
          message: "Nota minima deve ficar entre 0% e 100%",
        });
      }
    }

    if (data.timeLimit !== undefined && data.timeLimit <= 0) {
      errors.push({
        field: "timeLimit",
        message: "Tempo limite deve ser maior que zero",
      });
    }

    if (data.maxAttempts !== undefined && data.maxAttempts <= 0) {
      errors.push({
        field: "maxAttempts",
        message: "Numero de tentativas nao pode ser negativo e nem zero",
      });
    }

    if (data.availableFrom && data.availableUntil) {
      const from = new Date(data.availableFrom);
      const until = new Date(data.availableUntil);

      if (from >= until) {
        errors.push({
          field: "availableUntil",
          message: "Data final deve ser posterior a data inicial",
        });
      }
    }
    return errors;
  }

  static validateQuestions(
    questions: CreateQuestionDTO[],
    totalPoints?: number,
  ): ValidationError[] {
    const errors: ValidationError[] = [];

    if (questions.length === 0) {
      errors.push({
        field: "questions",
        message: "Adicione pelo menos uma questao",
      });
      return errors;
    }

    const sumPoints = questions.reduce(
      (sum, question) => sum + question.points,
      0,
    );

    if (totalPoints === undefined || totalPoints === null || totalPoints <= 0) {
      errors.push({
        field: "questions",
        message: `Voc� deve adicionar uma quantidade de pontos`,
      });
      return errors;
    }

    if (sumPoints > totalPoints) {
      errors.push({
        field: "questions",
        message: `A soma dos pontos das questoes (${sumPoints}) excede a pontuacao total (${totalPoints})`,
      });
      return errors;
    }

    if (sumPoints < totalPoints) {
      errors.push({
        field: "questions",
        message: `A soma dos pontos das questoes (${sumPoints}) n�o excede a pontuacao total (${totalPoints})`,
      });
      return errors;
    }

    questions.forEach((question, index) => {
      const prefix = `question_${index}`;
      const label = `Questao ${index + 1}`;
      const options = question.options ?? [];

      if (!question.questionText?.trim()) {
        errors.push({
          field: prefix,
          message: `${label}: texto da questao e obrigatorio`,
        });
      }

      if (question.points <= 0) {
        errors.push({
          field: prefix,
          message: `${label}: pontos devem ser maiores que zero`,
        });
      }

      if (
        [
          "MULTIPLE_CHOICE_SINGLE",
          "MULTIPLE_CHOICE_MULTIPLE",
          "TRUE_FALSE",
          "ORDERING",
          "MATCHING",
        ].includes(question.type)
      ) {
        if (options.length === 0) {
          errors.push({
            field: prefix,
            message: `${label}: adicione pelo menos uma opcao`,
          });
        }

        const blankOptionIndex = options.findIndex(
          (option) => !option.optionText?.trim(),
        );

        if (blankOptionIndex >= 0) {
          errors.push({
            field: prefix,
            message: `${label}: a opcao ${blankOptionIndex + 1} precisa de texto`,
          });
        }
      }

      if (question.type === "MULTIPLE_CHOICE_SINGLE") {
        const correctOptions = options.filter((option) => option.isCorrect);

        if (options.length < 2) {
          errors.push({
            field: prefix,
            message: `${label}: adicione pelo menos 2 opcoes`,
          });
        }

        if (correctOptions.length !== 1) {
          errors.push({
            field: prefix,
            message: `${label}: marque exatamente uma opcao correta`,
          });
        }
      }

      if (question.type === "MULTIPLE_CHOICE_MULTIPLE") {
        const correctOptions = options.filter((option) => option.isCorrect);

        if (options.length < 2) {
          errors.push({
            field: prefix,
            message: `${label}: adicione pelo menos 2 opcoes`,
          });
        }

        if (correctOptions.length === 0) {
          errors.push({
            field: prefix,
            message: `${label}: marque pelo menos uma opcao correta`,
          });
        }
      }

      if (question.type === "TRUE_FALSE") {
        const correctOptions = options.filter((option) => option.isCorrect);

        if (options.length !== 2) {
          errors.push({
            field: prefix,
            message: `${label}: deve ter exatamente 2 opcoes (Verdadeiro e Falso)`,
          });
        }

        if (correctOptions.length !== 1) {
          errors.push({
            field: prefix,
            message: `${label}: escolha apenas uma resposta correta`,
          });
        }
      }

      if (question.type === "FILL_BLANKS") {
        const acceptableAnswers =
          question.config?.acceptableAnswers?.filter((answer) =>
            answer.trim(),
          ) ?? [];

        if (acceptableAnswers.length === 0) {
          errors.push({
            field: prefix,
            message: `${label}: informe pelo menos uma resposta aceita`,
          });
        }
      }

      if (question.type === "ORDERING") {
        if (options.length < 2) {
          errors.push({
            field: prefix,
            message: `${label}: adicione pelo menos 2 itens para ordenar`,
          });
        }

        const positions = options.map((option) => option.correctPosition);
        const hasInvalidPosition = positions.some(
          (position) =>
            position === undefined || position === null || position <= 0,
        );

        if (hasInvalidPosition) {
          errors.push({
            field: prefix,
            message: `${label}: cada item precisa de uma posicao correta`,
          });
        }

        const uniquePositions = new Set(positions);
        if (uniquePositions.size !== positions.length) {
          errors.push({
            field: prefix,
            message: `${label}: as posicoes da ordenacao nao podem se repetir`,
          });
        }
      }

      if (question.type === "MATCHING") {
        if (options.length < 2) {
          errors.push({
            field: prefix,
            message: `${label}: adicione pelo menos 2 pares`,
          });
        }

        const missingPairIndex = options.findIndex(
          (option) => !option.matchPair?.trim(),
        );

        if (missingPairIndex >= 0) {
          errors.push({
            field: prefix,
            message: `${label}: informe o par correspondente da linha ${missingPairIndex + 1}`,
          });
        }
      }
    });

    return errors;
  }

  static validateComplete(data: CreateExerciseDTO): ValidationError[] {
    const basicErrors = this.validateBasicInfo(data);
    const questionErrors = this.validateQuestions(
      data.questions,
      data.totalPoints,
    );

    return [...basicErrors, ...questionErrors];
  }

  static canAddQuestion(
    currentQuestions: CreateQuestionDTO[],
    newQuestionPoints: number,
    totalPoints?: number,
  ): { canAdd: boolean; message?: string } {
    if (!totalPoints) {
      return { canAdd: true };
    }

    const currentSum = currentQuestions.reduce(
      (sum, question) => sum + question.points,
      0,
    );
    const newSum = currentSum + newQuestionPoints;

    if (newSum > totalPoints) {
      return {
        canAdd: false,
        message: `Nao e possivel adicionar esta questao. Pontos atuais: ${currentSum}, novo total seria: ${newSum}, limite: ${totalPoints}`,
      };
    }

    return { canAdd: true };
  }

  static getRemainingPoints(
    questions: CreateQuestionDTO[],
    totalPoints?: number,
  ): number {
    if (!totalPoints) {
      return Infinity;
    }

    const currentSum = questions.reduce(
      (sum, question) => sum + question.points,
      0,
    );

    return Math.max(0, totalPoints - currentSum);
  }
}
