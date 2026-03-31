interface BenefitProps {
  title: string;
  description: string;
  icon: React.ReactNode;
}

export function BenefitCard({ title, description, icon }: BenefitProps) {
  return (
    <div className="flex items-start gap-4 p-4 rounded-xl transition-all duration-300 hover:bg-surface hover:shadow-sm">
      <div className="shrink-0 w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
        {icon}
      </div>
      <div>
        <h3 className="font-semibold text-text-primary text-base">{title}</h3>
        <p className="text-sm text-text-secondary leading-relaxed">
          {description}
        </p>
      </div>
    </div>
  );
}
