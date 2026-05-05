import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "react-aria-components";

type PaginationComponentProps = {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  className?: string;
};

export function PaginationComponent({
  currentPage,
  totalPages,
  onPageChange,
  className = "",
}: PaginationComponentProps) {
  if (totalPages <= 1) {
    return null;
  }

  return (
    <div
      className={`flex flex-col sm:flex-row items-center justify-between gap-3 pt-4 border-t border-border ${className}`.trim()}
    >
      <span className="text-sm text-text-secondary font-medium">
        Página {currentPage} de {totalPages}
      </span>

      <div className="flex items-center gap-2 w-full sm:w-auto justify-center">
        <Button
          onClick={() => onPageChange(Math.max(currentPage - 1, 1))}
          isDisabled={currentPage === 1}
          className="flex-1 sm:flex-none flex justify-center p-2 rounded-lg border border-border hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed text-text-primary transition-colors"
          aria-label="Página Anterior"
        >
          <ChevronLeft size={18} />
        </Button>

        <Button
          onClick={() => onPageChange(Math.min(currentPage + 1, totalPages))}
          isDisabled={currentPage === totalPages}
          className="flex-1 sm:flex-none flex justify-center p-2 rounded-lg border border-border hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed text-text-primary transition-colors"
          aria-label="Próxima Página"
        >
          <ChevronRight size={18} />
        </Button>
      </div>
    </div>
  );
}
