import { TrendingUp, TrendingDown } from "lucide-react";
import type { ReactNode } from "react";

interface StatsCardWithTrendProps {
  icon: ReactNode;
  title: string;
  value: string | number;
  trend?: number;
  color: string;
}

export function StatsCardWithTrend({
  icon,
  title,
  value,
  trend,
  color,
}: StatsCardWithTrendProps) {
  return (
    <div
      className="p-5 rounded-xl border"
      style={{
        backgroundColor: "var(--color-surface)",
        borderColor: "var(--color-border)",
      }}
    >
      <div
        className="inline-flex p-2.5 rounded-lg mb-3"
        style={{ backgroundColor: `${color}15`, color }}
      >
        {icon}
      </div>
      <p
        className="text-xs font-medium mb-1"
        style={{ color: "var(--color-text-secondary)" }}
      >
        {title}
      </p>
      <div className="flex items-end justify-between">
        <p
          className="text-3xl font-bold"
          style={{ color: "var(--color-text-primary)" }}
        >
          {value}
        </p>
        {trend !== undefined && trend !== 0 && (
          <div
            className="flex items-center gap-1 text-sm font-semibold"
            style={{ color: trend > 0 ? "#10b981" : "#ef4444" }}
          >
            {trend > 0 ? <TrendingUp size={16} /> : <TrendingDown size={16} />}
            <span>{Math.abs(trend)}%</span>
          </div>
        )}
      </div>
    </div>
  );
}