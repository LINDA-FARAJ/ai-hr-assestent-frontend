import React from 'react';

interface ProgressBarProps {
  progress: number; // 0 to 100
  showLabel?: boolean;
  size?: 'sm' | 'md' | 'lg';
  color?: 'indigo' | 'emerald' | 'amber' | 'rose' | 'violet';
  className?: string;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
  progress,
  showLabel = false,
  size = 'md',
  color = 'indigo',
  className = '',
}) => {
  const clamped = Math.min(100, Math.max(0, progress));

  const getHeight = () => {
    switch (size) {
      case 'sm':
        return 'h-1.5';
      case 'lg':
        return 'h-3';
      case 'md':
      default:
        return 'h-2';
    }
  };

  const getColor = () => {
    switch (color) {
      case 'emerald':
        return 'bg-emerald-600 dark:bg-emerald-500';
      case 'amber':
        return 'bg-amber-500 dark:bg-amber-400';
      case 'rose':
        return 'bg-rose-500 dark:bg-rose-400';
      case 'violet':
        return 'bg-violet-600 dark:bg-violet-500';
      case 'indigo':
      default:
        return 'bg-indigo-600 dark:bg-indigo-500';
    }
  };

  return (
    <div className={`w-full ${className}`}>
      {showLabel && (
        <div className="flex justify-between items-center text-xs mb-1 font-medium text-neutral-600 dark:text-neutral-400">
          <span>{clamped}%</span>
        </div>
      )}
      <div className={`w-full bg-neutral-100 dark:bg-neutral-800 rounded-full overflow-hidden ${getHeight()}`}>
        <div
          className={`${getColor()} ${getHeight()} rounded-full transition-all duration-300`}
          style={{ width: `${clamped}%` }}
        />
      </div>
    </div>
  );
};
