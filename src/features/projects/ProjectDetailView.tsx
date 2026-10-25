import React, { useState, useEffect } from 'react';
import {
  ArrowLeft,
  ArrowRight,
  FolderKanban,
  Calendar,
  DollarSign,
  Clock,
  CheckSquare,
  Users,
  Sparkles,
  Layers,
} from 'lucide-react';
import { useTranslation } from '../../i18n/LanguageContext';
import { apiService } from '../../services/api';
import { Project, Task, Position } from '../../types';
import { PriorityBadge, StatusBadge } from '../../components/ui/Badge';
import { ProgressBar } from '../../components/ui/ProgressBar';

interface ProjectDetailViewProps {
  projectId: number;
  onBack: () => void;
  onNavigateToAi?: (taskId: number) => void;
}

export const ProjectDetailView: React.FC<ProjectDetailViewProps> = ({
  projectId,
  onBack,
  onNavigateToAi,
}) => {
  const { t, isRtl } = useTranslation();
  const [project, setProject] = useState<Project | null>(null);
  const [projectTasks, setProjectTasks] = useState<Task[]>([]);
  const [activeTab, setActiveTab] = useState<'overview' | 'tasks' | 'team'>('overview');

  useEffect(() => {
    async function load() {
      const proj = await apiService.getProject(projectId);
      if (proj) {
        setProject(proj);
        const allTasks = await apiService.getTasks();
        setProjectTasks(allTasks.filter((t) => t.project_id === projectId));
      }
    }
    load();
  }, [projectId]);

  if (!project) {
    return <div className="p-12 text-center text-xs text-neutral-400">جاري تحميل بيانات المشروع...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Top Breadcrumb */}
      <div className="flex items-center justify-between pb-3 border-b border-neutral-200 dark:border-neutral-800">
        <button
          onClick={onBack}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white transition-colors"
        >
          {isRtl ? <ArrowRight className="w-4 h-4" /> : <ArrowLeft className="w-4 h-4" />}
          <span>{isRtl ? 'العودة إلى المشاريع' : 'Back to Projects Portfolio'}</span>
        </button>

        <span className="font-mono text-xs text-neutral-400">PRJ-0{project.id}</span>
      </div>

      {/* Project Banner Header */}
      <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl p-6 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="text-xs text-indigo-600 dark:text-indigo-400 font-semibold">
                {project.client_name}
              </span>
              <span className="text-neutral-300 dark:text-neutral-700">·</span>
              <StatusBadge status={project.status} />
              <PriorityBadge priority={project.priority} />
            </div>

            <h1 className="text-xl sm:text-2xl font-bold text-neutral-900 dark:text-white tracking-tight">
              {project.name}
            </h1>

            <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-2 max-w-3xl leading-relaxed">
              {project.description}
            </p>
          </div>

          <div className="flex items-center gap-4 p-4 rounded-xl bg-neutral-50 dark:bg-neutral-800/60 border border-neutral-200 dark:border-neutral-700 shrink-0 text-center">
            <div className="px-3">
              <span className="text-[10px] text-neutral-400 block uppercase">نسبة الإنجاز</span>
              <span className="text-xl font-bold text-neutral-900 dark:text-white font-mono tabular-nums">
                {project.progress}%
              </span>
            </div>
            <div className="w-px h-8 bg-neutral-200 dark:bg-neutral-700" />
            <div className="px-3">
              <span className="text-[10px] text-neutral-400 block uppercase">الميزانية</span>
              <span className="text-xl font-bold text-emerald-600 dark:text-emerald-400 font-mono tabular-nums">
                {(project.budget / 1000).toFixed(0)}k ر.س
              </span>
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mt-6 pt-4 border-t border-neutral-100 dark:border-neutral-800">
          <ProgressBar progress={project.progress} color="indigo" size="md" />
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-neutral-200 dark:border-neutral-800">
        <button
          onClick={() => setActiveTab('overview')}
          className={`px-4 py-2 text-xs font-semibold border-b-2 transition-colors ${
            activeTab === 'overview'
              ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400'
              : 'border-transparent text-neutral-500 hover:text-neutral-900'
          }`}
        >
          نظرة عامة والجدول الزمني
        </button>
        <button
          onClick={() => setActiveTab('tasks')}
          className={`px-4 py-2 text-xs font-semibold border-b-2 transition-colors ${
            activeTab === 'tasks'
              ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400'
              : 'border-transparent text-neutral-500 hover:text-neutral-900'
          }`}
        >
          مهام المشروع ({projectTasks.length})
        </button>
      </div>

      {/* Tab Panels */}
      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl p-5 space-y-4">
            <h3 className="text-xs font-bold text-neutral-900 dark:text-white uppercase tracking-wider">
              المؤشرات الزمنية وحساب الساعات
            </h3>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-xs">
              <div className="p-3 rounded-lg bg-neutral-50 dark:bg-neutral-850 border border-neutral-100 dark:border-neutral-800">
                <span className="text-[11px] text-neutral-400 block">تاريخ البدء المخطط</span>
                <span className="font-semibold text-neutral-900 dark:text-white font-mono mt-1 block">
                  {project.planned_start_date}
                </span>
              </div>
              <div className="p-3 rounded-lg bg-neutral-50 dark:bg-neutral-850 border border-neutral-100 dark:border-neutral-800">
                <span className="text-[11px] text-neutral-400 block">تاريخ التسليم النهائي</span>
                <span className="font-semibold text-neutral-900 dark:text-white font-mono mt-1 block">
                  {project.planned_end_date}
                </span>
              </div>
              <div className="p-3 rounded-lg bg-neutral-50 dark:bg-neutral-850 border border-neutral-100 dark:border-neutral-800">
                <span className="text-[11px] text-neutral-400 block">الساعات التقديرية</span>
                <span className="font-semibold text-neutral-900 dark:text-white font-mono mt-1 block">
                  {project.estimated_hours} ساعة
                </span>
              </div>
            </div>

            <div className="pt-2 text-xs text-neutral-500">
              <p className="leading-relaxed">
                يتم احتساب نسبة الإنجاز تلقائياً استناداً إلى حالة المهام المرتبطة في النظام وإنجاز المناصب المسؤولة عنها.
              </p>
            </div>
          </div>

          <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl p-5 space-y-3 text-xs">
            <h3 className="text-xs font-bold text-neutral-900 dark:text-white uppercase tracking-wider pb-2 border-b border-neutral-100 dark:border-neutral-800">
              ملخص حالة المهام
            </h3>
            <div className="flex justify-between py-1">
              <span className="text-neutral-500">المهام المكتملة:</span>
              <span className="font-bold text-emerald-600 font-mono">
                {projectTasks.filter((t) => t.status === 'completed').length}
              </span>
            </div>
            <div className="flex justify-between py-1">
              <span className="text-neutral-500">مهام قيد المعالجة:</span>
              <span className="font-bold text-blue-600 font-mono">
                {projectTasks.filter((t) => t.status === 'in_progress').length}
              </span>
            </div>
            <div className="flex justify-between py-1">
              <span className="text-neutral-500">مهام شاغرة (تحتاج إسناد):</span>
              <span className="font-bold text-amber-600 font-mono">
                {projectTasks.filter((t) => !t.position_id).length}
              </span>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'tasks' && (
        <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-start">
              <thead className="bg-neutral-50 dark:bg-neutral-850 border-b border-neutral-200 dark:border-neutral-800 text-neutral-500 font-semibold">
                <tr>
                  <th className="px-4 py-3 text-start">عنوان المهمة</th>
                  <th className="px-4 py-3 text-start">المهارة المطلوبة</th>
                  <th className="px-4 py-3 text-start">المنصب المسؤول</th>
                  <th className="px-4 py-3 text-start">الأولوية</th>
                  <th className="px-4 py-3 text-start">الحالة</th>
                  <th className="px-4 py-3 text-center">الساعات</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100 dark:divide-neutral-800">
                {projectTasks.map((t) => (
                  <tr key={t.id} className="hover:bg-neutral-50/70 dark:hover:bg-neutral-800/40">
                    <td className="px-4 py-3 font-semibold text-neutral-900 dark:text-white">
                      {t.title}
                    </td>
                    <td className="px-4 py-3 text-indigo-600 dark:text-indigo-400 font-medium">
                      {t.skill_name}
                    </td>
                    <td className="px-4 py-3 text-neutral-700 dark:text-neutral-300">
                      {t.assigned_employee_name ? (
                        <span>{t.assigned_employee_name} ({t.assigned_position_title})</span>
                      ) : (
                        <span className="text-amber-600 font-medium">شاغرة</span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <PriorityBadge priority={t.priority} />
                    </td>
                    <td className="px-4 py-3">
                      <StatusBadge status={t.status} />
                    </td>
                    <td className="px-4 py-3 text-center font-mono tabular-nums text-neutral-500">
                      {t.estimated_hours} س
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
