import React from 'react';
import { ShieldAlert, ArrowLeft, ArrowRight, Lock } from 'lucide-react';
import { useTranslation } from '../../i18n/LanguageContext';
import { useAuth } from '../../context/AuthContext';

interface AccessDeniedViewProps {
  onReturnToDashboard: () => void;
  restrictedTabName?: string;
}

export const AccessDeniedView: React.FC<AccessDeniedViewProps> = ({
  onReturnToDashboard,
  restrictedTabName,
}) => {
  const { t, isRtl } = useTranslation();
  const { role, user } = useAuth();

  return (
    <div className="min-h-[500px] flex items-center justify-center p-6">
      <div className="max-w-md w-full bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl p-8 text-center shadow-xs">
        <div className="w-14 h-14 rounded-2xl bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 border border-rose-200 dark:border-rose-800 flex items-center justify-center mx-auto mb-5 shadow-2xs">
          <Lock className="w-7 h-7" />
        </div>

        <h2 className="text-lg font-bold text-neutral-900 dark:text-white mb-2">
          {t.auth.accessDeniedTitle}
        </h2>

        <p className="text-xs text-neutral-500 dark:text-neutral-400 leading-relaxed mb-6">
          {t.auth.accessDeniedDesc}
          {restrictedTabName && (
            <span className="block mt-2 font-mono text-[11px] text-neutral-400">
              المسار المطلوب: {restrictedTabName}
            </span>
          )}
        </p>

        <div className="p-3 rounded-xl bg-neutral-50 dark:bg-neutral-800/60 border border-neutral-100 dark:border-neutral-800 text-[11px] text-neutral-600 dark:text-neutral-400 mb-6 text-start">
          <div className="flex justify-between py-0.5">
            <span className="text-neutral-400">المستخدم الحالي:</span>
            <span className="font-semibold text-neutral-900 dark:text-white">{user?.name}</span>
          </div>
          <div className="flex justify-between py-0.5">
            <span className="text-neutral-400">الدور المسجل:</span>
            <span className="font-semibold text-indigo-600 dark:text-indigo-400">{t.roles[role]}</span>
          </div>
        </div>

        <button
          onClick={onReturnToDashboard}
          className="inline-flex items-center justify-center gap-2 w-full py-2.5 px-4 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold rounded-xl shadow-xs transition-colors"
        >
          {isRtl ? <ArrowRight className="w-4 h-4" /> : <ArrowLeft className="w-4 h-4" />}
          <span>{t.auth.returnToDashboard}</span>
        </button>
      </div>
    </div>
  );
};
