import React, { useState } from 'react';
import {
  CheckSquare,
  Clock,
  Calendar,
  Briefcase,
  Award,
  Building2,
  FileText,
  CheckCircle2,
  AlertCircle,
  TrendingUp,
  ArrowRight,
  ShieldCheck,
} from 'lucide-react';
import { useTranslation } from '../../i18n/LanguageContext';
import { MetricCard } from '../../components/ui/MetricCard';
import { StatusBadge, PriorityBadge } from '../../components/ui/Badge';
import { ProgressBar } from '../../components/ui/ProgressBar';
import { EmployeeAvatar } from '../../components/ui/EmployeeAvatar';
import { repository, apiService } from '../../services/api';
import { Task, TaskStatus } from '../../types';

interface EmployeeDashboardProps {
  onNavigateTab: (tab: string, entityId?: number) => void;
}

export const EmployeeDashboard: React.FC<EmployeeDashboardProps> = ({ onNavigateTab }) => {
  const { t, isRtl } = useTranslation();

  // Scoped to Employee 101: Ahmed Al-Shammari (Lead Backend Architect)
  const employee = repository.employees[0];
  const activePosition = employee.positions?.find((p) => p.status === 'active') || employee.current_position;
  const myTasks = repository.tasks.filter((tk) => tk.position_id === 1);

  const [taskList, setTaskList] = useState<Task[]>(myTasks);

  const pendingTasks = taskList.filter((t) => t.status === 'pending' || t.status === 'ready');
  const inProgressTasks = taskList.filter((t) => t.status === 'in_progress');
  const completedTasks = taskList.filter((t) => t.status === 'completed');

  const handleUpdateMyProgress = (taskId: number, newProgress: number) => {
    const updated = taskList.map((tk) => {
      if (tk.id === taskId) {
        const nextStatus: TaskStatus = newProgress === 100 ? 'completed' : 'in_progress';
        return { ...tk, progress: newProgress, status: nextStatus };
      }
      return tk;
    });
    setTaskList(updated);
  };

  return (
    <div className="space-y-6">
      {/* Title Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-neutral-200 dark:border-neutral-800">
        <div className="flex items-center gap-3">
          <EmployeeAvatar name={`${employee.first_name} ${employee.last_name}`} size="lg" />
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-bold text-neutral-900 dark:text-white tracking-tight">
                {isRtl ? `مرحباً، ${employee.first_name} ${employee.last_name}` : `Welcome back, ${employee.first_name}`}
              </h1>
              <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-emerald-100 text-emerald-800 dark:bg-emerald-950/70 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                Employee Space
              </span>
            </div>
            <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">
              {activePosition?.job_title_name} · {activePosition?.department_name} ({employee.employee_code})
            </p>
          </div>
        </div>

        <button
          onClick={() => onNavigateTab('employee-detail', employee.id)}
          className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-neutral-700 dark:text-neutral-200 bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 hover:bg-neutral-50 rounded-lg shadow-xs transition-colors shrink-0"
        >
          <Briefcase className="w-3.5 h-3.5 text-neutral-400" />
          <span>{isRtl ? 'ملفي الوظيفي وسجل المناصب' : 'My Career Profile'}</span>
        </button>
      </div>

      {/* Scope Notice */}
      <div className="p-3.5 rounded-xl bg-emerald-50/60 dark:bg-emerald-950/30 border border-emerald-200/80 dark:border-emerald-900/40 text-xs text-neutral-600 dark:text-neutral-400 flex items-start gap-3">
        <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
        <div className="leading-relaxed">
          <span className="font-semibold text-neutral-900 dark:text-white">
            {isRtl ? 'المساحة الشخصية للموظف:' : 'Personal Workspace Scope:'}
          </span>{' '}
          {isRtl
            ? 'تقتصر بيانات هذه اللوحة على مهام منصبك المعتمد وجدولك الأسبوعي. يمكنك تحديث نسب إنجاز مهامك واستعراض وثائقك الرسمية دون إمكانية الوصول لبيانات موظفين آخرين أو إجراءات الإدارة العليا.'
            : 'Access is personal and private. You can manage your tasks and view career details without access to corporate admin settings.'}
        </div>
      </div>

      {/* Primary KPI Grid (4 Cards) */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <MetricCard
          title={isRtl ? 'مهامي الجارية' : 'Tasks In Progress'}
          value={inProgressTasks.length}
          subtitle={isRtl ? 'تحت التنفيذ الفعلي اليوم' : 'Active today'}
          icon={CheckSquare}
          accentColor="indigo"
          onClick={() => onNavigateTab('tasks')}
        />
        <MetricCard
          title={isRtl ? 'المهام المنجزة هذا الشهر' : 'Completed This Month'}
          value={completedTasks.length}
          subtitle={isRtl ? 'مطابقة لمعايير الجودة' : 'Verified completion'}
          icon={CheckCircle2}
          accentColor="emerald"
        />
        <MetricCard
          title={isRtl ? 'الساعات المتبقية في جدولك' : 'Remaining Weekly Hours'}
          value={`${employee.remaining_weekly_capacity_hours ?? 14} س`}
          subtitle={isRtl ? 'جاهزية لاستقبال مهام إضافية' : 'Available capacity'}
          icon={Clock}
          accentColor="amber"
        />
        <MetricCard
          title={isRtl ? 'المهارات المعتمدة المسجلة' : 'Verified Skills'}
          value={employee.skills?.length || 3}
          subtitle={isRtl ? 'Laravel, PostgreSQL, K8s' : 'Fullstack & Cloud'}
          icon={Award}
          accentColor="violet"
          onClick={() => onNavigateTab('skills')}
        />
      </div>

      {/* Two Column Layout: My Assigned Tasks & Career Profile Summary */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* My Tasks with Progress Sliders (7 Cols) */}
        <div className="lg:col-span-7 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl p-5 space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-neutral-100 dark:border-neutral-800">
            <div>
              <h3 className="text-xs font-bold text-neutral-900 dark:text-white uppercase tracking-wider">
                {isRtl ? 'المهام المسندة لمنصبي (My Assigned Tasks)' : 'Tasks Assigned to My Position'}
              </h3>
              <p className="text-[11px] text-neutral-400 mt-0.5">
                {isRtl ? 'يمكنك تحديث نسبة الإنجاز اليومية مباشرة' : 'Update your progress directly'}
              </p>
            </div>
            <span className="text-[11px] font-mono text-neutral-400">{taskList.length} Tasks</span>
          </div>

          <div className="space-y-3">
            {taskList.map((task) => (
              <div
                key={task.id}
                className="p-4 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-850/50 space-y-3"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <span className="text-[10px] font-mono text-neutral-400">{task.project_name}</span>
                    <h4 className="text-xs font-bold text-neutral-900 dark:text-white mt-0.5">
                      {task.title}
                    </h4>
                  </div>
                  <div className="flex items-center gap-1.5 shrink-0">
                    <PriorityBadge priority={task.priority} />
                    <StatusBadge status={task.status} />
                  </div>
                </div>

                <p className="text-[11px] text-neutral-500 leading-relaxed">
                  {task.description}
                </p>

                {/* Progress bar + slider for quick self-reporting */}
                <div>
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="text-neutral-500 font-medium">نسبة إنجازي:</span>
                    <span className="font-bold font-mono tabular-nums">{task.progress}%</span>
                  </div>
                  <ProgressBar progress={task.progress} size="sm" color="indigo" />
                  <div className="flex items-center justify-between gap-2 mt-2 pt-2 border-t border-neutral-200/50 dark:border-neutral-800">
                    <input
                      type="range"
                      min={0}
                      max={100}
                      step={10}
                      value={task.progress}
                      onChange={(e) => handleUpdateMyProgress(task.id, Number(e.target.value))}
                      className="w-full h-1 bg-neutral-200 rounded-lg appearance-none cursor-pointer"
                    />
                    <span className="text-[10px] text-neutral-400 shrink-0 font-mono">
                      {task.estimated_hours} س مقدرة
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Career Timeline & Position Overview (5 Cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl p-5 space-y-3">
            <h3 className="text-xs font-bold text-neutral-900 dark:text-white uppercase tracking-wider pb-2 border-b border-neutral-100 dark:border-neutral-800">
              {isRtl ? 'منصبي الحالي والتنقلات التاريخية' : 'Current Role & Positions'}
            </h3>

            {/* Active Position Spotlight */}
            <div className="p-3 rounded-lg bg-indigo-50/50 dark:bg-indigo-950/30 border border-indigo-100 dark:border-indigo-900/40 text-xs">
              <span className="text-[10px] text-emerald-700 dark:text-emerald-300 font-semibold uppercase">
                المنصب الحالي المعتمد
              </span>
              <h4 className="font-bold text-neutral-900 dark:text-white mt-1">
                {activePosition?.job_title_name}
              </h4>
              <p className="text-[11px] text-neutral-500 mt-0.5">
                {activePosition?.department_name} · منذ {activePosition?.start_date}
              </p>
            </div>

            {/* Historical Positions */}
            <div className="space-y-2 pt-2">
              <span className="text-[11px] font-semibold text-neutral-400 block">المناصب السابقة بالشركة:</span>
              <div className="p-2.5 rounded-lg border border-neutral-100 dark:border-neutral-800 text-xs flex justify-between items-center">
                <div>
                  <span className="font-medium text-neutral-800 dark:text-neutral-200 block">Senior Full Stack Engineer</span>
                  <span className="text-[10px] text-neutral-400">2022-02-01 إلى 2023-01-14</span>
                </div>
                <span className="text-[10px] text-neutral-400">سابق</span>
              </div>
            </div>
          </div>

          {/* My Skills Matrix */}
          <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl p-5">
            <h3 className="text-xs font-bold text-neutral-900 dark:text-white uppercase tracking-wider mb-3">
              {isRtl ? 'المهارات المعتمدة في ملفي' : 'My Verified Skills'}
            </h3>
            <div className="space-y-2">
              {employee.skills?.map((sk) => (
                <div
                  key={sk.id}
                  className="p-2.5 rounded-lg bg-neutral-50 dark:bg-neutral-850 border border-neutral-100 dark:border-neutral-800 flex items-center justify-between text-xs"
                >
                  <div>
                    <span className="font-semibold text-neutral-900 dark:text-white">{sk.skill_name}</span>
                    <span className="text-[10px] text-neutral-400 block">{sk.category} · {sk.years_of_experience} سنوات</span>
                  </div>
                  <span className="text-[10px] font-medium text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                    موثق
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
