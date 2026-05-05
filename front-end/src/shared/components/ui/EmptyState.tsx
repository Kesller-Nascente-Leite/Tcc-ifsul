import { Search, FileText } from "lucide-react";

interface EmptyStateProps {
  searchQuery: string;
  onClearSearch: () => void;
}

export function EmptyState({ searchQuery, onClearSearch }: EmptyStateProps) {
  return (
    <div className="text-center py-12">
      <div
        className="inline-flex p-4 rounded-full mb-4"
        style={{ backgroundColor: "var(--color-surface-hover)" }}
      >
        {searchQuery ? (
          <Search size={48} style={{ color: "var(--color-text-secondary)" }} />
        ) : (
          <FileText size={48} style={{ color: "var(--color-text-secondary)" }} />
        )}
      </div>

      <h3
        className="text-lg font-semibold mb-2"
        style={{ color: "var(--color-text-primary)" }}
      >
        {searchQuery ? "Nenhum resultado encontrado" : "Nenhum exercício criado"}
      </h3>

      <p
        className="text-sm mb-4"
        style={{ color: "var(--color-text-secondary)" }}
      >
        {searchQuery
          ? "Tente buscar com outros termos"
          : "Crie seu primeiro exercício para começar"}
      </p>

      {searchQuery && (
        <button
          onClick={onClearSearch}
          className="px-4 py-2 rounded-lg font-medium transition-colors"
          style={{
            backgroundColor: "var(--color-surface-hover)",
            color: "var(--color-text-primary)",
          }}
        >
          Limpar busca
        </button>
      )}
    </div>
  );
}