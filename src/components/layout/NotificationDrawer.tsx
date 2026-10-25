import React from 'react';
import { X, Sparkles, AlertTriangle, Calendar, CheckCircle, ExternalLink } from 'lucide-react';
import { useTranslation } from '../../i18n/LanguageContext';
import { ActiveTab } from './Sidebar';

interface NotificationDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (tab: ActiveTab) => void;
}

export const NotificationDrawer: React.FC<NotificationDrawerProps> = ({
  isOpen,
  onClose,
  onNavigate,
}) => {
  const { t, isRtl } = useTranslation();

  if (!isOpen) return null;

  const notifications = [
    {
      id: 1,
      type: 'ai',
      title: 'توصية ذكاء اصطناعي بانتظار الاعتماد',
      desc: 'أصدر نموذج Groq توصية بإسناد مهمة "خدمة معالجة بيانات الاستشعار" إلى د. نورة العتيبي.',
      time: 'منذ 15 دقيقة',
      actionTab: 'ai-decision-support' as ActiveTab,
      actionLabel: 'مراجعة التوصية',
    },
    {
      id: 2,
      type: 'deadline',
      title: 'اقتراب موعد تسليم مشروع',
      desc: 'مشروع "بوابة الخدمات المصرفية المفتوحة" متبقي على موعد تسليمه النهائي 20 يوماً مع 5 مهام غير مكتملة.',
      time: 'منذ ساعتين',
      actionTab: 'projects' as ActiveTab,
      actionLabel: 'عرض المشروع',
    },
    {
      id: 3,
      type: 'contract',
      title: 'مراجعة عقد سنوي قادم',
      desc: 'عقد الموظف "م. زيد المنصور" ينتهي خلال 90 يوماً ويحتاج مراجعة شروط التجديد الدوري.',
      time: 'اليوم',
      actionTab: 'documents' as ActiveTab,
      actionLabel: 'فحص العقود',
    },
  ];

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      <div className="fixed inset-0 bg-black/40 backdrop-blur-xs" onClick={onClose} />
      <div
        className={`fixed inset-y-0 w-full max-w-sm bg-white dark:bg-neutral-900 shadow-2xl border-neutral-200 dark:border-neutral-800 flex flex-col z-10 transition-transform ${
          isRtl ? 'left-0 border-r' : 'right-0 border-l'
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-neutral-100 dark:border-neutral-800">
          <div>
            <h3 className="text-sm font-semibold text-neutral-900 dark:text-white">
              مركز التنبيهات والإشعارات
            </h3>
            <p className="text-[11px] text-neutral-400">3 تنبيهات تشغيلية نشطة</p>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-200"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Notifications List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {notifications.map((item) => (
            <div
              key={item.id}
              className="p-3.5 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-800/40 hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors"
            >
              <div className="flex items-start gap-3">
                <div className="p-2 rounded-lg bg-white dark:bg-neutral-700 border border-neutral-200 dark:border-neutral-600 shrink-0">
                  {item.type === 'ai' ? (
                    <Sparkles className="w-4 h-4 text-violet-600 dark:text-violet-400" />
                  ) : item.type === 'deadline' ? (
                    <AlertTriangle className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                  ) : (
                    <Calendar className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                  )}
                </div>
                <div className="flex-1">
                  <h4 className="text-xs font-semibold text-neutral-900 dark:text-white">{item.title}</h4>
                  <p className="text-[11px] text-neutral-500 dark:text-neutral-400 mt-1 leading-relaxed">
                    {item.desc}
                  </p>
                  <div className="flex items-center justify-between mt-3 pt-2 border-t border-neutral-200/60 dark:border-neutral-700/60">
                    <span className="text-[10px] text-neutral-400">{item.time}</span>
                    <button
                      onClick={() => {
                        onNavigate(item.actionTab);
                        onClose();
                      }}
                      className="inline-flex items-center gap-1 text-[11px] font-medium text-indigo-600 dark:text-indigo-400 hover:underline"
                    >
                      <span>{item.actionLabel}</span>
                      <ExternalLink className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
