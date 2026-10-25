import React from 'react';

interface EmployeeAvatarProps {
  name: string;
  avatarUrl?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

export const EmployeeAvatar: React.FC<EmployeeAvatarProps> = ({
  name,
  avatarUrl,
  size = 'md',
  className = '',
}) => {
  const [imageError, setImageError] = React.useState(false);

  const getInitials = (fullName: string) => {
    if (!fullName) return 'AP';
    const parts = fullName.trim().split(/\s+/);
    if (parts.length === 1) return parts[0].substring(0, 2).toUpperCase();
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  };

  const getSizeClasses = () => {
    switch (size) {
      case 'sm':
        return 'w-7 h-7 text-xs';
      case 'lg':
        return 'w-12 h-12 text-base font-semibold';
      case 'xl':
        return 'w-16 h-16 text-lg font-bold';
      case 'md':
      default:
        return 'w-9 h-9 text-sm font-medium';
    }
  };

  if (avatarUrl && !imageError) {
    return (
      <img
        src={avatarUrl}
        alt={name}
        referrerPolicy="no-referrer"
        onError={() => setImageError(true)}
        className={`${getSizeClasses()} rounded-full object-cover border border-neutral-200 dark:border-neutral-700 shrink-0 ${className}`}
      />
    );
  }

  // Consistent pleasant gradient fallback
  const charCode = name ? name.charCodeAt(0) + (name.charCodeAt(1) || 0) : 0;
  const hues = [
    'from-indigo-600 to-indigo-800 text-white',
    'from-blue-600 to-cyan-800 text-white',
    'from-violet-600 to-purple-800 text-white',
    'from-emerald-600 to-teal-800 text-white',
  ];
  const hue = hues[charCode % hues.length];

  return (
    <div
      aria-label={name}
      className={`${getSizeClasses()} rounded-full bg-gradient-to-br ${hue} flex items-center justify-center shrink-0 border border-neutral-200 dark:border-neutral-700 select-none ${className}`}
    >
      <span>{getInitials(name)}</span>
    </div>
  );
};
