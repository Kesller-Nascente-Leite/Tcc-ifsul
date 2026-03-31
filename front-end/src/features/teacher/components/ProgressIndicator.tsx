import { Check } from "lucide-react";

interface Step {
  id: number;
  label: string;
  description: string;
}

interface ProgressIndicatorProps {
  steps: Step[];
  currentStep: number;
  accentColor: string;
}

export function ProgressIndicator({
  steps,
  currentStep,
  accentColor,
}: ProgressIndicatorProps) {
  return (
    <div className="w-full">
      {/* Desktop view */}
      <div className="hidden md:flex items-center justify-between">
        {steps.map((step, index) => {
          const isCompleted = index < currentStep;
          const isCurrent = index === currentStep;
          const isLast = index === steps.length - 1;

          return (
            <div key={step.id} className="flex items-center flex-1">
              <div className="flex flex-col items-center">
                <div
                  className="flex items-center justify-center w-10 h-10 rounded-full font-bold text-sm mb-2 transition-all"
                  style={{
                    backgroundColor: isCompleted || isCurrent
                      ? accentColor
                      : "var(--color-surface-hover)",
                    color: isCompleted || isCurrent
                      ? "white"
                      : "var(--color-text-secondary)",
                  }}
                >
                  {isCompleted ? <Check size={20} /> : step.id}
                </div>
                <div className="text-center">
                  <p
                    className="text-sm font-semibold mb-1"
                    style={{
                      color: isCurrent
                        ? accentColor
                        : "var(--color-text-primary)",
                    }}
                  >
                    {step.label}
                  </p>
                  <p
                    className="text-xs hidden lg:block"
                    style={{ color: "var(--color-text-secondary)" }}
                  >
                    {step.description}
                  </p>
                </div>
              </div>

              {!isLast && (
                <div
                  className="flex-1 h-1 mx-4 rounded-full transition-all"
                  style={{
                    backgroundColor: isCompleted
                      ? accentColor
                      : "var(--color-border)",
                  }}
                />
              )}
            </div>
          );
        })}
      </div>

      {/* Mobile view */}
      <div className="md:hidden">
        <div className="flex items-center justify-between mb-2">
          <p
            className="text-sm font-semibold"
            style={{ color: accentColor }}
          >
            Passo {currentStep + 1} de {steps.length}
          </p>
          <p
            className="text-xs"
            style={{ color: "var(--color-text-secondary)" }}
          >
            {Math.round(((currentStep + 1) / steps.length) * 100)}%
          </p>
        </div>
        <div
          className="h-2 rounded-full overflow-hidden mb-3"
          style={{ backgroundColor: "var(--color-border)" }}
        >
          <div
            className="h-full transition-all duration-300"
            style={{
              width: `${((currentStep + 1) / steps.length) * 100}%`,
              backgroundColor: accentColor,
            }}
          />
        </div>
        <p
          className="text-sm font-semibold"
          style={{ color: "var(--color-text-primary)" }}
        >
          {steps[currentStep].label}
        </p>
        <p
          className="text-xs"
          style={{ color: "var(--color-text-secondary)" }}
        >
          {steps[currentStep].description}
        </p>
      </div>
    </div>
  );
}