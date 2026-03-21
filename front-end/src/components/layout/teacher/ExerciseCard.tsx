import { useState } from "react";
import {
  MoreVertical,
  Edit3,
  Trash2,
  Copy,
  BarChart3,
  FileText,
  Award,
  Clock,
  AlertCircle,
} from "lucide-react";
import { Button } from "react-aria-components";
import type { ExerciseResponseDTO } from "../../../types/ExerciseResponseDTO";
import { ProgressBar } from "../../ui/ProgressBar";

interface ExerciseCardProps {
  exercise: ExerciseResponseDTO;
  accentColor: string;
  onEdit: () => void;
  onDelete: () => void;
  onViewStats: () => void;
  onDuplicate: () => void;
}

export function ExerciseCard({
  exercise,
  accentColor,
  onEdit,
  onDelete,
  onViewStats,
  onDuplicate,
}: ExerciseCardProps) {
  const [showMenu, setShowMenu] = useState(false);
  const passRate = exercise.statistics?.passRate || 0;
  const avgPercentage = exercise.statistics?.averagePercentage || 0;
  const hasStats = exercise.statistics && exercise.statistics.totalAttempts > 0;

  return (
    <div
      className="rounded-xl border overflow-hidden transition-all hover:shadow-lg"
      style={{
        backgroundColor: "var(--color-surface-secondary)",
        borderColor: "var(--color-border)",
      }}
    >
      {/* Header */}
      <div
        className="p-5 border-b"
        style={{ borderColor: "var(--color-border)" }}
      >
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-2 flex-wrap">
              <h3
                className="text-lg font-bold truncate"
                style={{ color: "var(--color-text-primary)" }}
              >
                {exercise.title}
              </h3>
              {exercise.isActive && (
                <span
                  className="px-2 py-0.5 text-xs font-bold rounded-full shrink-0"
                  style={{
                    backgroundColor: `${accentColor}20`,
                    color: accentColor,
                  }}
                >
                  Ativo
                </span>
              )}
            </div>
            <p
              className="text-sm line-clamp-2"
              style={{ color: "var(--color-text-secondary)" }}
            >
              {exercise.description || "Sem descrição"}
            </p>
          </div>

          {/* Menu */}
          <div className="relative">
            <Button
              onPress={() => setShowMenu(!showMenu)}
              className="p-2 rounded-lg transition-colors hover:bg-opacity-20"
              style={{ backgroundColor: `${accentColor}10` }}
            >
              <MoreVertical size={18} style={{ color: accentColor }} />
            </Button>

            {showMenu && (
              <>
                <div
                  className="fixed inset-0 z-10"
                  onClick={() => setShowMenu(false)}
                />
                <div
                  className="absolute right-0 top-full mt-2 w-48 rounded-xl border shadow-2xl z-20 overflow-hidden"
                  style={{
                    backgroundColor: "var(--color-surface)",
                    borderColor: "var(--color-border)",
                  }}
                >
                  <MenuButton
                    icon={<Edit3 size={16} />}
                    label="Editar"
                    onClick={() => {
                      onEdit();
                      setShowMenu(false);
                    }}
                  />
                  <MenuButton
                    icon={<Copy size={16} />}
                    label="Duplicar"
                    onClick={() => {
                      onDuplicate();
                      setShowMenu(false);
                    }}
                  />
                  <div
                    className="border-t"
                    style={{ borderColor: "var(--color-border)" }}
                  />
                  <MenuButton
                    icon={<Trash2 size={16} />}
                    label="Excluir"
                    onClick={() => {
                      onDelete();
                      setShowMenu(false);
                    }}
                    danger
                  />
                </div>
              </>
            )}
          </div>
        </div>

        {/* Meta */}
        <div
          className="flex flex-wrap gap-4 text-sm"
          style={{ color: "var(--color-text-secondary)" }}
        >
          <div className="flex items-center gap-1.5">
            <FileText size={16} />
            <span>{exercise.questionsCount || 0} questões</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Award size={16} />
            <span>{exercise.totalPoints} pts</span>
          </div>
          {exercise.timeLimit && (
            <div className="flex items-center gap-1.5">
              <Clock size={16} />
              <span>{exercise.timeLimit} min</span>
            </div>
          )}
        </div>
      </div>

      {/* Stats */}
      {hasStats ? (
        <div
          className="p-5 space-y-4"
          style={{ backgroundColor: "var(--color-surface-hover)" }}
        >
          <div className="grid grid-cols-2 gap-4">
            <StatItem
              label="Tentativas"
              value={exercise.statistics?.totalAttempts || 0}
            />
            <StatItem
              label="Alunos"
              value={exercise.statistics?.totalStudents || 0}
            />
          </div>

          <ProgressBar
            label="Taxa de Aprovação"
            value={passRate}
            color={accentColor}
          />
          <ProgressBar
            label="Média de Notas"
            value={avgPercentage}
            color={accentColor}
          />

          <div className="flex gap-2 pt-2">
            <button
              onClick={onViewStats}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg font-medium transition-all hover:scale-105"
              style={{
                backgroundColor: "var(--color-surface)",
                color: "var(--color-text-primary)",
                border: `1px solid var(--color-border)`,
              }}
            >
              <BarChart3 size={16} />
              Estatísticas
            </button>
            <button
              onClick={onEdit}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg font-medium transition-all hover:scale-105"
              style={{
                backgroundColor: accentColor,
                color: "white",
              }}
            >
              <Edit3 size={16} />
              Editar
            </button>
          </div>
        </div>
      ) : (
        <div
          className="p-5 text-center"
          style={{ backgroundColor: "var(--color-surface-hover)" }}
        >
          <AlertCircle
            size={32}
            className="mx-auto mb-2 opacity-50"
            style={{ color: "var(--color-text-secondary)" }}
          />
          <p
            className="text-sm mb-4"
            style={{ color: "var(--color-text-secondary)" }}
          >
            Nenhuma tentativa realizada ainda
          </p>
          <button
            onClick={onEdit}
            className="px-4 py-2 rounded-lg font-medium transition-all hover:scale-105"
            style={{
              backgroundColor: accentColor,
              color: "white",
            }}
          >
            Editar Exercício
          </button>
        </div>
      )}
    </div>
  );
}

function MenuButton({
  icon,
  label,
  onClick,
  danger,
}: {
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
  danger?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      className="w-full flex items-center gap-3 px-4 py-3 text-sm font-medium transition-colors hover:bg-opacity-10"
      style={{
        color: danger ? "var(--color-error)" : "var(--color-text-primary)",
        backgroundColor: "transparent",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.backgroundColor = danger
          ? "var(--color-error-light)"
          : "var(--color-surface-hover)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.backgroundColor = "transparent";
      }}
    >
      {icon}
      {label}
    </button>
  );
}

function StatItem({ label, value }: { label: string; value: number }) {
  return (
    <div>
      <p
        className="text-xs mb-1 font-medium"
        style={{ color: "var(--color-text-secondary)" }}
      >
        {label}
      </p>
      <p
        className="text-2xl font-bold"
        style={{ color: "var(--color-text-primary)" }}
      >
        {value}
      </p>
    </div>
  );
}
