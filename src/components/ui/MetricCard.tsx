import React from 'react';
import { LucideIcon } from 'lucide-react';

interface MetricCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon?: LucideIcon;
  trend?: {
    value: string;
    isPositive?: boolean;
    label?: string;
  };
  onClick?: () => void;
  accentColor?: 'indigo' | 'violet' | 'emerald' | 'amber';
}

export const MetricCard: React.FC<MetricCardProps> = ({
  title,
  value,
  subtitle,
  icon: Icon,
  trend,
  onClick,
  accentColor = 'indigo',
}) => {
  const getIconColor = () => {
    switch (accentColor) {
      case 'violet':
        return 'text-violet-600 bg-violet-50 dark:bg-violet-950/40 dark:text-violet-300';
      case 'emerald':
        return 'text-emerald-600 bg-emerald-50 dark:bg-emerald-950/40 dark:text-emerald-300';
      case 'amber':
        return 'text-amber-600 bg-amber-50 dark:bg-amber-950/40 dark:text-amber-300';
      case 'indigo':
      default:
        return 'text-indigo-600 bg-indigo-50 dark:bg-indigo-950/40 dark:text-indigo-300';
    }
  };

  return (
    <div
      onClick={onClick}
      className={`bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl p-5 transition-colors ${
        onClick ? 'cursor-pointer hover:border-neutral-300 dark:hover:border-neutral-700' : ''
      }`}
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-medium text-neutral-500 dark:text-neutral-400 mb-1">{title}</p>
          <h3 className="text-2xl font-bold text-neutral-900 dark:text-white tabular-nums tracking-tight">
            {value}
          </h3>
        </div>
        {Icon && (
          <div className={`p-2.5 rounded-lg shrink-0 ${getIconColor()}`}>
            <Icon className="w-5 h-5" />
          </div>
        )}
      </div>

      {(subtitle || trend) && (
        <div className="mt-3 flex items-center gap-2 text-xs text-neutral-500 dark:text-neutral-400 pt-2 border-t border-neutral-100 dark:border-neutral-800">
          {trend && (
            <span
              className={`font-medium tabular-nums ${
                trend.isPositive ? 'text-emerald-600 dark:text-emerald-400' : 'text-neutral-600 dark:text-neutral-300'
              }`}
            >
              {trend.value}
            </span>
          )}
          {trend && subtitle && <span aria-hidden="true">·</span>}
          {subtitle && <span>{subtitle}</span>}
        </div>
      )}
    </div>
  );
};
