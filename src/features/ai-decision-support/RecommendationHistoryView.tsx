import React, { useState, useEffect } from 'react';
import { Sparkles, CheckCircle, XCircle, Clock, Filter, Eye, ChevronRight, Check } from 'lucide-react';
import { useTranslation } from '../../i18n/LanguageContext';
import { apiService } from '../../services/api';
import { AiTaskRecommendation } from '../../types';
import { EmployeeAvatar } from '../../components/ui/EmployeeAvatar';
import { Modal } from '../../components/ui/Modal';

export const RecommendationHistoryView: React.FC = () => {
  const { t, isRtl } = useTranslation();
  const [recommendations, setRecommendations] = useState<AiTaskRecommendation[]>([]);
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [selectedRec, setSelectedRec] = useState<AiTaskRecommendation | null>(null);

  useEffect(() => {
    async function load() {
      const recs = await apiService.getAiRecommendations();
      setRecommendations(recs);
    }
    load();
  }, []);

  const filtered = recommendations.filter((r) => {
    if (filterStatus === 'all') return true;
    return r.manager_decision === filterStatus;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-neutral-200 dark:border-neutral-800">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-neutral-900 dark:text-white tracking-tight">
            {t.ai.historyTitle}
          </h1>
          <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1 max-w-2xl leading-relaxed">
            {t.ai.historySubtitle}
          </p>
        </div>

        {/* Filter controls */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 p-1 bg-neutral-100 dark:bg-neutral-800 rounded-lg text-xs">
            <button
              onClick={() => setFilterStatus('all')}
              className={`px-3 py-1.5 rounded-md font-medium transition-colors ${
                filterStatus === 'all'
                  ? 'bg-white dark:bg-neutral-700 text-neutral-900 dark:text-white shadow-xs'
                  : 'text-neutral-500 hover:text-neutral-900'
              }`}
            >
              {t.common.all}
            </button>
            <button
              onClick={() => setFilterStatus('accepted')}
              className={`px-3 py-1.5 rounded-md font-medium transition-colors ${
                filterStatus === 'accepted'
                  ? 'bg-white dark:bg-neutral-700 text-emerald-700 dark:text-emerald-300 shadow-xs'
                  : 'text-neutral-500 hover:text-neutral-900'
              }`}
            >
              {isRtl ? 'المعتمدة' : 'Accepted'}
            </button>
            <button
              onClick={() => setFilterStatus('pending')}
              className={`px-3 py-1.5 rounded-md font-medium transition-colors ${
                filterStatus === 'pending'
                  ? 'bg-white dark:bg-neutral-700 text-amber-700 dark:text-amber-300 shadow-xs'
                  : 'text-neutral-500 hover:text-neutral-900'
              }`}
            >
              {isRtl ? 'المعلقة' : 'Pending'}
            </button>
            <button
              onClick={() => setFilterStatus('rejected')}
              className={`px-3 py-1.5 rounded-md font-medium transition-colors ${
                filterStatus === 'rejected'
                  ? 'bg-white dark:bg-neutral-700 text-rose-700 dark:text-rose-300 shadow-xs'
                  : 'text-neutral-500 hover:text-neutral-900'
              }`}
            >
              {isRtl ? 'المرفوضة' : 'Rejected'}
            </button>
          </div>
        </div>
      </div>

      {/* Recommendations Table */}
      <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-start">
            <thead className="bg-neutral-50 dark:bg-neutral-850 border-b border-neutral-200 dark:border-neutral-800 text-neutral-500 dark:text-neutral-400 font-semibold">
              <tr>
                <th className="px-4 py-3 text-start">المهمة والمشروع</th>
                <th className="px-4 py-3 text-start">المرشح الموصى به</th>
                <th className="px-4 py-3 text-start">المنصب والقسم</th>
                <th className="px-4 py-3 text-center">نسبة الثقة</th>
                <th className="px-4 py-3 text-center">التوافق الإجمالي</th>
                <th className="px-4 py-3 text-start">قرار المدير</th>
                <th className="px-4 py-3 text-start">التاريخ</th>
                <th className="px-4 py-3 text-center">الإجراء</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100 dark:divide-neutral-800">
              {filtered.map((rec) => (
                <tr
                  key={rec.id}
                  className="hover:bg-neutral-50/70 dark:hover:bg-neutral-800/40 transition-colors"
                >
                  <td className="px-4 py-3 max-w-[220px]">
                    <div className="font-semibold text-neutral-900 dark:text-white truncate">
                      {rec.task_title}
                    </div>
                    <div className="text-[11px] text-neutral-400 truncate">
                      {rec.project_name}
                    </div>
                  </td>

                  <td className="px-4 py-3 whitespace-nowrap">
                    <div className="flex items-center gap-2.5">
                      <EmployeeAvatar name={rec.recommended_employee_name} size="sm" />
                      <span className="font-medium text-neutral-900 dark:text-white">
                        {rec.recommended_employee_name}
                      </span>
                    </div>
                  </td>

                  <td className="px-4 py-3 whitespace-nowrap">
                    <div className="text-neutral-800 dark:text-neutral-200 font-medium">
                      {rec.recommended_position_title}
                    </div>
                    <div className="text-[11px] text-neutral-400">
                      {rec.recommended_department_name}
                    </div>
                  </td>

                  <td className="px-4 py-3 text-center font-mono font-bold text-emerald-600 dark:text-emerald-400 tabular-nums">
                    {rec.confidence}%
                  </td>

                  <td className="px-4 py-3 text-center font-mono font-bold text-indigo-600 dark:text-indigo-400 tabular-nums">
                    {rec.overall_score}%
                  </td>

                  <td className="px-4 py-3 whitespace-nowrap">
                    {rec.manager_decision === 'accepted' ? (
                      <span className="inline-flex items-center gap-1 text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded text-[11px] font-medium border border-emerald-200">
                        <Check className="w-3 h-3" />
                        <span>معتمد</span>
                      </span>
                    ) : rec.manager_decision === 'rejected' ? (
                      <span className="inline-flex items-center gap-1 text-rose-700 bg-rose-50 px-2 py-0.5 rounded text-[11px] font-medium border border-rose-200">
                        <XCircle className="w-3 h-3" />
                        <span>مرفوض</span>
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-amber-700 bg-amber-50 px-2 py-0.5 rounded text-[11px] font-medium border border-amber-200">
                        <Clock className="w-3 h-3" />
                        <span>قيد المراجعة</span>
                      </span>
                    )}
                  </td>

                  <td className="px-4 py-3 whitespace-nowrap text-neutral-400 tabular-nums text-[11px]">
                    {rec.created_at}
                  </td>

                  <td className="px-4 py-3 text-center whitespace-nowrap">
                    <button
                      onClick={() => setSelectedRec(rec)}
                      className="p-1.5 rounded-lg text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
                      title="عرض التفاصيل الكاملة"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Recommendation Details Modal */}
      {selectedRec && (
        <Modal
          isOpen={!!selectedRec}
          onClose={() => setSelectedRec(null)}
          title={`تفاصيل توصية الذكاء الاصطناعي #REC-${selectedRec.id}`}
          description={`المهمة: ${selectedRec.task_title}`}
          maxWidth="2xl"
        >
          <div className="space-y-4 text-xs">
            {/* Header Persona */}
            <div className="p-4 rounded-xl bg-violet-50 dark:bg-violet-950/30 border border-violet-100 dark:border-violet-800 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <EmployeeAvatar name={selectedRec.recommended_employee_name} size="md" />
                <div>
                  <h4 className="font-bold text-neutral-900 dark:text-white">
                    {selectedRec.recommended_employee_name}
                  </h4>
                  <p className="text-[11px] text-neutral-500">
                    {selectedRec.recommended_position_title} · {selectedRec.recommended_department_name}
                  </p>
                </div>
              </div>
              <div className="text-end">
                <span className="font-mono font-bold text-base text-violet-700 dark:text-violet-300">
                  {selectedRec.confidence}%
                </span>
                <span className="text-[10px] text-neutral-400 block uppercase">نسبة الثقة</span>
              </div>
            </div>

            {/* Explanation */}
            <div>
              <h5 className="font-bold text-neutral-900 dark:text-white mb-1">تعليل التوصية:</h5>
              <p className="text-neutral-600 dark:text-neutral-400 leading-relaxed bg-neutral-50 dark:bg-neutral-850 p-3 rounded-lg border border-neutral-100 dark:border-neutral-800">
                {selectedRec.explanation}
              </p>
            </div>

            {/* Metrics */}
            <div className="grid grid-cols-3 gap-3">
              <div className="p-3 rounded-lg border border-neutral-100 dark:border-neutral-800">
                <span className="text-neutral-400 text-[11px] block">درجة التوافق</span>
                <span className="font-bold text-neutral-900 dark:text-white mt-0.5 block font-mono">
                  {selectedRec.overall_score}%
                </span>
              </div>
              <div className="p-3 rounded-lg border border-neutral-100 dark:border-neutral-800">
                <span className="text-neutral-400 text-[11px] block">سنوات الخبرة في المهارة</span>
                <span className="font-bold text-neutral-900 dark:text-white mt-0.5 block font-mono">
                  {selectedRec.skill_experience} سنوات
                </span>
              </div>
              <div className="p-3 rounded-lg border border-neutral-100 dark:border-neutral-800">
                <span className="text-neutral-400 text-[11px] block">الساعات المتاحة أسبوعياً</span>
                <span className="font-bold text-neutral-900 dark:text-white mt-0.5 block font-mono">
                  {selectedRec.remaining_available_hours} ساعة
                </span>
              </div>
            </div>

            {/* Manager Notes */}
            {selectedRec.manager_notes && (
              <div className="p-3 rounded-lg bg-neutral-100 dark:bg-neutral-800">
                <span className="text-neutral-500 font-medium block mb-1">ملاحظات اعتماد المدير:</span>
                <p className="text-neutral-800 dark:text-neutral-200">{selectedRec.manager_notes}</p>
              </div>
            )}
          </div>
        </Modal>
      )}
    </div>
  );
};
