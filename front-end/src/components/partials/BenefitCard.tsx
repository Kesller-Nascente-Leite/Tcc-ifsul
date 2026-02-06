interface BenefitProps {
  title: string;
  description: string;
  icon: React.ReactNode;
}

export function BenefitCard({ title, description, icon }: BenefitProps) {
  return (
    <div className="flex items-start gap-4 p-4 rounded-xl transition-all duration-300 hover:bg-(--color-surface) hover:shadow-sm">
      <div className="shrink-0 w-10 h-10 rounded-lg bg-(--color-primary)/10 flex items-center justify-center text-(--color-primary)">
        {icon}
      </div>
      <div>
        <h3 className="font-semibold text-(--color-text-primary) text-base">
          {title}
        </h3>
        <p className="text-sm text-(--color-text-secondary) leading-relaxed">
          {description}
        </p>
      </div>
    </div>
  );
}
