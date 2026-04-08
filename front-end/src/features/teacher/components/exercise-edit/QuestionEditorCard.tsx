import { useState } from "react";
import { ArrowDown, ArrowUp, ChevronDown, ChevronUp, CirclePlus, Trash2 } from "lucide-react";
import { ButtonComponent } from "@/shared/components/ui/ButtonComponent";
import { InputComponent } from "@/shared/components/ui/InputComponent";
import { Input } from "react-aria-components";
import type { CreateQuestionDTO } from "@/shared/types/CreateQuestionDTO";
import type { CreateQuestionOptionDTO } from "@/shared/types/CreateQuestionOptionDTO";
import type { QuestionConfigDTO } from "@/shared/types/QuestionConfigDTO";
import { FieldLabel } from "./FieldLabel";
import { TextAreaField } from "./TextAreaField";
import { ToggleTile } from "./ToggleTile";
import { IconButton } from "./IconButton";
import { getQuestionTypeLabel } from "./utils";

interface QuestionOptionForm extends Omit<CreateQuestionOptionDTO, "order"> {
  tempId: string;
  order: number;
}

interface QuestionForm extends Omit<CreateQuestionDTO, "options" | "order"> {
  tempId: string;
  order: number;
  options: QuestionOptionForm[];
}

interface QuestionEditorCardProps {
  question: QuestionForm;
  index: number;
  accentColor: string;
  canMoveUp: boolean;
  canMoveDown: boolean;
  onMoveUp: () => void;
  onMoveDown: () => void;
  onUpdate: (updates: Partial<QuestionForm>) => void;
  onUpdateConfig: (updates: Partial<QuestionConfigDTO>) => void;
  onRemove: () => void;
  onAddOption: () => void;
  onRemoveOption: (optionTempId: string) => void;
  onMoveOption: (optionTempId: string, direction: "up" | "down") => void;
  onUpdateOption: (
    optionTempId: string,
    updates: Partial<QuestionOptionForm>,
  ) => void;
  onToggleCorrect: (optionTempId: string) => void;
  onUpdateFillBlankAnswers: (value: string) => void;
}

export function QuestionEditorCard({
  question,
  index,
  accentColor,
  canMoveUp,
  canMoveDown,
  onMoveUp,
  onMoveDown,
  onUpdate,
  onUpdateConfig,
  onRemove,
  onAddOption,
  onRemoveOption,
  onMoveOption,
  onUpdateOption,
  onToggleCorrect,
  onUpdateFillBlankAnswers,
}: QuestionEditorCardProps) {
  const [isExpanded, setIsExpanded] = useState(true);
  const supportsOptions = [
    "MULTIPLE_CHOICE_SINGLE",
    "MULTIPLE_CHOICE_MULTIPLE",
    "TRUE_FALSE",
    "ORDERING",
    "MATCHING",
  ].includes(question.type);
  const isSingleChoice =
    question.type === "MULTIPLE_CHOICE_SINGLE" ||
    question.type === "TRUE_FALSE";

  return (
    <article
      className="overflow-hidden rounded-3xl border"
      style={{
        backgroundColor: "var(--color-surface-secondary)",
        borderColor: "var(--color-border)",
      }}
    >
      <header
        className="flex flex-col gap-4 border-b p-5 sm:flex-row sm:items-start sm:justify-between"
        style={{ borderColor: "var(--color-border)" }}
      >
        <div className="flex min-w-0 items-start gap-3">
          <div
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl text-sm font-bold"
            style={{
              backgroundColor: "var(--color-surface)",
              color: accentColor,
            }}
          >
            {index + 1}
          </div>
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <span
                className="rounded-full px-3 py-1 text-xs font-semibold"
                style={{
                  backgroundColor: "var(--color-surface)",
                  color: accentColor,
                }}
              >
                {getQuestionTypeLabel(question.type)}
              </span>
              <span
                className="rounded-full px-3 py-1 text-xs font-semibold"
                style={{
                  backgroundColor: "var(--color-surface)",
                  color: "var(--color-text-secondary)",
                }}
              >
                {question.points} pts
              </span>
            </div>
            <p
              className="mt-3 truncate text-base font-semibold"
              style={{ color: "var(--color-text-primary)" }}
            >
              {question.questionText.trim() || "Nova questao"}
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <IconButton
            title="Mover para cima"
            onClick={onMoveUp}
            isDisabled={!canMoveUp}
          >
            <ArrowUp size={16} />
          </IconButton>
          <IconButton
            title="Mover para baixo"
            onClick={onMoveDown}
            isDisabled={!canMoveDown}
          >
            <ArrowDown size={16} />
          </IconButton>
          <IconButton
            title={isExpanded ? "Recolher" : "Expandir"}
            onClick={() => setIsExpanded((current) => !current)}
          >
            {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          </IconButton>
          <IconButton title="Remover questao" onClick={onRemove} tone="danger">
            <Trash2 size={16} />
          </IconButton>
        </div>
      </header>

      {isExpanded && (
        <div className="space-y-5 p-5">
          <div className="grid gap-4 xl:grid-cols-[1fr_180px]">
            <div>
              <TextAreaField
                label="Enunciado"
                value={question.questionText}
                onChange={(value) => onUpdate({ questionText: value })}
                placeholder="Digite o texto da questao aqui."
                rows={4}
              />
            </div>
            <div>
              <FieldLabel required>Pontos</FieldLabel>
              <InputComponent
                type="number"
                min={1}
                value={question.points}
                onChange={(event) => {
                  const nextValue = (event.target as HTMLInputElement)
                    .valueAsNumber;
                  onUpdate({
                    points: Number.isFinite(nextValue) ? nextValue : 0,
                  });
                }}
              />
            </div>
          </div>

          {question.type === "FILL_BLANKS" && (
            <div
              className="rounded-2xl border p-4"
              style={{
                backgroundColor: "var(--color-surface)",
                borderColor: "var(--color-border)",
              }}
            >
              <p
                className="text-sm font-semibold"
                style={{ color: "var(--color-text-primary)" }}
              >
                Respostas aceitas
              </p>
              <p
                className="mt-1 text-sm"
                style={{ color: "var(--color-text-secondary)" }}
              >
                Separe por virgula ou linha. Exemplo: React, reactjs, biblioteca
                React.
              </p>
              <textarea
                value={question.config?.acceptableAnswers?.join(", ") ?? ""}
                onChange={(event) =>
                  onUpdateFillBlankAnswers(event.target.value)
                }
                rows={3}
                placeholder="Digite as respostas aceitas"
                className="min-h-[112px] w-full rounded-2xl border px-4 py-3 text-sm outline-none transition-colors resize-y mt-3"
                style={{
                  backgroundColor: "var(--color-surface-secondary)",
                  borderColor: "var(--color-border)",
                  color: "var(--color-text-primary)",
                }}
              />
              <div className="mt-4">
                <ToggleTile
                  label="Diferenciar maiusculas e minusculas"
                  description="Ative somente se a resposta precisar respeitar exatamente a capitalizacao."
                  checked={Boolean(question.config?.caseSensitive)}
                  onChange={(checked) =>
                    onUpdateConfig({ caseSensitive: checked })
                  }
                  accentColor={accentColor}
                />
              </div>
            </div>
          )}

          {question.type === "ESSAY" && (
            <div
              className="rounded-2xl border p-4"
              style={{
                backgroundColor: "var(--color-surface)",
                borderColor: "var(--color-border)",
              }}
            >
              <p
                className="text-sm"
                style={{ color: "var(--color-text-secondary)" }}
              >
                Questao dissertativa nao precisa de opções. O aluno respondera
                com texto livre e a correcao sera manual.
              </p>
            </div>
          )}

          {supportsOptions && (
            <div
              className="rounded-2xl border p-4"
              style={{
                backgroundColor: "var(--color-surface)",
                borderColor: "var(--color-border)",
              }}
            >
              <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p
                    className="font-semibold"
                    style={{ color: "var(--color-text-primary)" }}
                  >
                    {question.type === "MATCHING" ? "Pares" : "Opções"}
                  </p>
                  <p
                    className="text-sm"
                    style={{ color: "var(--color-text-secondary)" }}
                  >
                    {question.type === "ORDERING" &&
                      "A ordem exibida aqui sera a ordem correta da resposta."}
                    {question.type === "MATCHING" &&
                      "Preencha cada item com seu par correspondente."}
                    {question.type === "MULTIPLE_CHOICE_MULTIPLE" &&
                      "Você pode marcar mais de uma alternativa como correta."}
                    {question.type === "MULTIPLE_CHOICE_SINGLE" &&
                      "Marque somente uma alternativa correta."}
                    {question.type === "TRUE_FALSE" &&
                      "Selecione se a resposta correta é verdadeiro ou falso."}
                  </p>
                </div>
                {question.type !== "TRUE_FALSE" && (
                  <ButtonComponent
                    type="button"
                    variant="ghost"
                    onClick={onAddOption}
                    className="gap-2"
                  >
                    <CirclePlus size={16} />
                    Adicionar
                  </ButtonComponent>
                )}
              </div>

              <div className="space-y-3">
                {question.options.map((option, optionIndex) => (
                  <div
                    key={option.tempId}
                    className="grid gap-3 rounded-2xl border p-4"
                    style={{
                      backgroundColor: "var(--color-surface-secondary)",
                      borderColor: "var(--color-border)",
                    }}
                  >
                    {(question.type === "MULTIPLE_CHOICE_SINGLE" ||
                      question.type === "MULTIPLE_CHOICE_MULTIPLE" ||
                      question.type === "TRUE_FALSE") && (
                      <div className="flex items-start gap-3">
                        <Input
                          type={isSingleChoice ? "radio" : "checkbox"}
                          checked={option.isCorrect}
                          onChange={() => onToggleCorrect(option.tempId)}
                          name={`correct-${question.tempId}`}
                          className="mt-3 h-4 w-4 shrink-0 hover:cursor-pointer"
                          style={{ accentColor }}
                        />
                        <div className="flex-1">
                          <FieldLabel>
                            Opção {String.fromCharCode(65 + optionIndex)}
                          </FieldLabel>
                          <InputComponent
                            value={option.optionText}
                            onChange={(event) =>
                              onUpdateOption(option.tempId, {
                                optionText: (event.target as HTMLInputElement)
                                  .value,
                              })
                            }
                            disabled={question.type === "TRUE_FALSE"}
                            placeholder={`Digite a opção ${String.fromCharCode(65 + optionIndex)}`}
                          />
                        </div>
                        {question.type !== "TRUE_FALSE" && (
                          <div className="flex items-center gap-2 pt-7">
                            <IconButton
                              title="Remover opção"
                              onClick={() => onRemoveOption(option.tempId)}
                              tone="danger"
                            >
                              <Trash2 size={16} />
                            </IconButton>
                          </div>
                        )}
                      </div>
                    )}

                    {question.type === "ORDERING" && (
                      <div className="grid gap-3 sm:grid-cols-[64px_1fr_auto] sm:items-end">
                        <div>
                          <FieldLabel>Posicao</FieldLabel>
                          <div
                            className="flex h-10 items-center justify-center rounded-2xl border text-sm font-semibold"
                            style={{
                              backgroundColor: "var(--color-surface)",
                              borderColor: "var(--color-border)",
                              color: accentColor,
                            }}
                          >
                            {optionIndex + 1}
                          </div>
                        </div>
                        <div>
                          <FieldLabel>Item</FieldLabel>
                          <InputComponent
                            value={option.optionText}
                            onChange={(event) =>
                              onUpdateOption(option.tempId, {
                                optionText: (event.target as HTMLInputElement)
                                  .value,
                              })
                            }
                            placeholder="Digite o texto do item"
                          />
                        </div>
                        <div className="flex items-center gap-2 pb-1">
                          <IconButton
                            title="Mover item para cima"
                            onClick={() => onMoveOption(option.tempId, "up")}
                            isDisabled={optionIndex === 0}
                          >
                            <ArrowUp size={16} />
                          </IconButton>
                          <IconButton
                            title="Mover item para baixo"
                            onClick={() => onMoveOption(option.tempId, "down")}
                            isDisabled={
                              optionIndex === question.options.length - 1
                            }
                          >
                            <ArrowDown size={16} />
                          </IconButton>
                          <IconButton
                            title="Remover item"
                            onClick={() => onRemoveOption(option.tempId)}
                            tone="danger"
                          >
                            <Trash2 size={16} />
                          </IconButton>
                        </div>
                      </div>
                    )}

                    {question.type === "MATCHING" && (
                      <div className="grid gap-3 lg:grid-cols-[1fr_1fr_auto] lg:items-end">
                        <div>
                          <FieldLabel>Coluna A</FieldLabel>
                          <InputComponent
                            value={option.optionText}
                            onChange={(event) =>
                              onUpdateOption(option.tempId, {
                                optionText: (event.target as HTMLInputElement)
                                  .value,
                              })
                            }
                            placeholder="Item da coluna A"
                          />
                        </div>
                        <div>
                          <FieldLabel>Coluna B</FieldLabel>
                          <InputComponent
                            value={option.matchPair ?? ""}
                            onChange={(event) =>
                              onUpdateOption(option.tempId, {
                                matchPair: (event.target as HTMLInputElement)
                                  .value,
                              })
                            }
                            placeholder="Par correspondente"
                          />
                        </div>
                        <div className="flex items-center gap-2 pb-1">
                          <IconButton
                            title="Remover par"
                            onClick={() => onRemoveOption(option.tempId)}
                            tone="danger"
                          >
                            <Trash2 size={16} />
                          </IconButton>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {(question.type === "MULTIPLE_CHOICE_MULTIPLE" ||
                question.type === "MATCHING") && (
                <div className="mt-4">
                  <ToggleTile
                    label="Permitir pontuacao parcial"
                    description="A pontuacao podera ser proporcional aos acertos do aluno."
                    checked={Boolean(question.config?.partialCredit)}
                    onChange={(checked) =>
                      onUpdateConfig({ partialCredit: checked })
                    }
                    accentColor={accentColor}
                  />
                </div>
              )}
            </div>
          )}

          <TextAreaField
            label="Explicacao opcional"
            value={question.explanation ?? ""}
            onChange={(value) => onUpdate({ explanation: value })}
            placeholder="Use esse campo para registrar um comentario, explicacao ou observacao para a correcao."
            rows={3}
          />
        </div>
      )}
    </article>
  );
}