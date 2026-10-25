import React from 'react';
import {
  FolderKanban,
  CheckSquare,
  Clock,
  Sparkles,
  Calendar,
  AlertTriangle,
  TrendingUp,
  ArrowRight,
  ShieldCheck,
  Milestone,
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { useTranslation } from '../../i18n/LanguageContext';
import { MetricCard } from '../../components/ui/MetricCard';
import { StatusBadge, PriorityBadge } from '../../components/ui/Badge';
import { ProgressBar } from '../../components/ui/ProgressBar';
import { EmployeeAvatar } from '../../components/ui/EmployeeAvatar';
import { repository } from '../../services/api';

interface ProjectManagerDashboardProps {
  onNavigateTab: (tab: string, entityId?: number) => void;
}

export const ProjectManagerDashboard: React.FC<ProjectManagerDashboardProps> = ({
  onNavigateTab,
}) => {
  const { t, isRtl } = useTranslation();

  // Scoped to projects under this Project Manager (e.g. Project 1: Open Banking Gateway & Project 2: Fleet Optimization)
  const managedProjects = repository.projects.slice(0, 2);
  const primaryProject = managedProjects[0];
  const projectTasks = repository.tasks.filter((tk) =>
    managedProjects.some((p) => p.id === tk.project_id)
  );

  const pendingTasks = projectTasks.filter((t) => t.status === 'pending');
  const inProgressTasks = projectTasks.filter((t) => t.status === 'in_progress');
  const completedTasks = projectTasks.filter((t) => t.status === 'completed');

  const hoursComparisonData = [
    { name: 'بوابة المصرفية', planned: 2400, actual: 1780 },
    { name: 'إدارة الأساطيل', planned: 1800, actual: 860 },
  ];

  return (
    <div className="space-y-6">
      {/* Title Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-neutral-200 dark:border-neutral-800">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-bold text-neutral-900 dark:text-white tracking-tight">
              {isRtl ? 'لوحة قيادة إدارة المشاريع والمهام (PM Workspace)' : 'Project Delivery Workspace'}
            </h1>
            <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-blue-100 text-blue-800 dark:bg-blue-950/70 dark:text-blue-300 border border-blue-200 dark:border-blue-800">
              Project Manager
            </span>
          </div>
          <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1 max-w-2xl leading-relaxed">
            {isRtl
              ? 'متابعة المعالم الزمنية للمشاريع الموكلة، نسب الإنجاز اللحظية، وتوزيع المهام على المناصب الهندسية'
              : 'Delivery tracking, milestone deadlines, planned vs actual velocity, and team position assignments'}
          </p>
        </div>

        <button
          onClick={() => onNavigateTab('ai-decision-support')}
          className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold text-white bg-violet-600 hover:bg-violet-700 rounded-lg shadow-xs transition-colors shrink-0"
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>{isRtl ? 'طلب إسناد ذكي للمهام' : 'AI Assignment'}</span>
        </button>
      </div>

      {/* Scope Notice */}
      <div className="p-3.5 rounded-xl bg-blue-50/60 dark:bg-blue-950/30 border border-blue-200/80 dark:border-blue-900/40 text-xs text-neutral-600 dark:text-neutral-400 flex items-start gap-3">
        <ShieldCheck className="w-4 h-4 text-blue-600 dark:text-blue-400 shrink-0 mt-0.5" />
        <div className="leading-relaxed">
          <span className="font-semibold text-neutral-900 dark:text-white">
            {isRtl ? 'نطاق الصلاحيات التشغيلي لمدير المشروع:' : 'Project Manager Operational Scope:'}
          </span>{' '}
          {isRtl
            ? 'تقتصر صلاحياتك على المشاريع المسندة إلى إدارتك والمهام التابعة لها. يمكنك إنشاء وتنظيم المهام واعتماد الإسنادات الفنية دون الوصول إلى العقود والرواتب وسجلات الموظفين السرية.'
            : 'Access is restricted to authorized projects and their deliverables. Confidential HR contracts and corporate financials are protected.'}
        </div>
      </div>

      {/* Primary KPI Grid (4 Cards) */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <MetricCard
          title={isRtl ? 'المشاريع تحت الإدارة' : 'Projects Under Mgmt'}
          value={managedProjects.length}
          subtitle={isRtl ? 'بوابة المصرفية وإدارة الأساطيل' : 'Open Banking & Fleet AI'}
          icon={FolderKanban}
          accentColor="indigo"
          onClick={() => onNavigateTab('projects')}
        />
        <MetricCard
          title={isRtl ? 'نسبة إنجاز المشروع الرئيسي' : 'Primary Project Progress'}
          value={`${primaryProject?.progress || 74}%`}
          subtitle={isRtl ? 'الموعد المستهدف: 15 ديسمبر' : 'Target: Dec 15'}
          icon={TrendingUp}
          accentColor="emerald"
          onClick={() => onNavigateTab('project-detail', primaryProject.id)}
        />
        <MetricCard
          title={isRtl ? 'المهام قيد التنفيذ' : 'Tasks In Progress'}
          value={inProgressTasks.length}
          subtitle={isRtl ? `${pendingTasks.length} مهام بحاجة إسناد` : `${pendingTasks.length} pending assign`}
          icon={CheckSquare}
          accentColor="indigo"
          onClick={() => onNavigateTab('tasks')}
        />
        <MetricCard
          title={isRtl ? 'الساعات المنجزة مقابل المخططة' : 'Hours Burn Rate'}
          value="2,640 س"
          subtitle={isRtl ? 'من أصل 4,200 ساعة كلية' : 'Planned: 4,200 hrs'}
          icon={Clock}
          accentColor="amber"
        />
      </div>

      {/* Two Column Layout: Projects Progress & Tasks Queue */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Managed Projects Cards (7 Cols) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl p-5 space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-neutral-100 dark:border-neutral-800">
              <h3 className="text-xs font-bold text-neutral-900 dark:text-white uppercase tracking-wider">
                {isRtl ? 'المشاريع الموكلة ومراحل التسليم' : 'Authorized Delivery Projects'}
              </h3>
              <span className="text-[11px] font-mono text-neutral-400">2 Active Projects</span>
            </div>

            <div className="space-y-4">
              {managedProjects.map((p) => (
                <div
                  key={p.id}
                  onClick={() => onNavigateTab('project-detail', p.id)}
                  className="p-4 rounded-xl border border-neutral-200 dark:border-neutral-800 hover:border-neutral-300 dark:hover:border-neutral-700 transition-colors cursor-pointer group"
                >
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <div>
                      <span className="text-[11px] font-mono text-neutral-400">PRJ-0{p.id} · {p.client_name}</span>
                      <h4 className="text-xs font-bold text-neutral-900 dark:text-white group-hover:text-indigo-600 transition-colors mt-0.5">
                        {p.name}
                      </h4>
                    </div>
                    <PriorityBadge priority={p.priority} />
                  </div>

                  <div className="my-3">
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-neutral-500 font-medium">نسبة التقدم الكلية</span>
                      <span className="font-bold font-mono tabular-nums">{p.progress}%</span>
                    </div>
                    <ProgressBar progress={p.progress} size="sm" color="indigo" />
                  </div>

                  <div className="flex items-center justify-between text-[11px] text-neutral-500 pt-2 border-t border-neutral-100 dark:border-neutral-800">
                    <span>التسليم المستهدف: {p.planned_end_date}</span>
                    <span className="text-indigo-600 dark:text-indigo-400 font-semibold group-hover:underline">
                      عرض مهام المشروع ←
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Planned vs Actual Hours Chart */}
          <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl p-5">
            <h3 className="text-xs font-bold text-neutral-900 dark:text-white uppercase tracking-wider mb-1">
              الساعات المخططة مقابل الفعلية (Planned vs Actual Hours)
            </h3>
            <p className="text-[11px] text-neutral-400 mb-4">
              متابعة استهلاك الجهد الهندسي وفق الجدول المعتمد
            </p>

            <div className="h-44">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={hoursComparisonData}>
                  <XAxis dataKey="name" tick={{ fontSize: 10 }} />
                  <YAxis tick={{ fontSize: 10 }} />
                  <Tooltip />
                  <Bar dataKey="planned" name="المخطط" fill="#6366f1" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="actual" name="الفعلي" fill="#10b981" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Project Task Pipeline & AI Suggestions (5 Cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl p-5 space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-neutral-100 dark:border-neutral-800">
              <h3 className="text-xs font-bold text-neutral-900 dark:text-white uppercase tracking-wider">
                {isRtl ? 'مهام حيوية قيد المعالجة' : 'Active Tasks Stream'}
              </h3>
              <button
                onClick={() => onNavigateTab('tasks')}
                className="text-xs text-indigo-600 hover:underline font-medium"
              >
                {t.common.viewAll}
              </button>
            </div>

            <div className="space-y-2.5">
              {projectTasks.slice(0, 4).map((tk) => (
                <div
                  key={tk.id}
                  className="p-3 rounded-lg border border-neutral-100 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-850/50"
                >
                  <div className="flex items-start justify-between gap-2">
                    <h5 className="text-xs font-bold text-neutral-900 dark:text-white line-clamp-1">
                      {tk.title}
                    </h5>
                    <StatusBadge status={tk.status} />
                  </div>
                  <div className="flex items-center justify-between text-[11px] text-neutral-400 mt-2 pt-1 border-t border-neutral-100 dark:border-neutral-800">
                    <span className="text-indigo-600 font-medium">{tk.skill_name}</span>
                    <span className="tabular-nums font-mono">{tk.estimated_hours} س</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick AI Task Assistant */}
          <div className="bg-gradient-to-r from-violet-50 to-indigo-50 dark:from-violet-950/40 dark:to-indigo-950/20 border border-violet-200 dark:border-violet-800/60 rounded-xl p-4">
            <div className="flex items-center gap-2.5 mb-2">
              <Sparkles className="w-4 h-4 text-violet-600" />
              <h4 className="text-xs font-bold text-violet-950 dark:text-violet-200">
                مساعد إسناد المهام الذكي
              </h4>
            </div>
            <p className="text-[11px] text-violet-800 dark:text-violet-300 leading-relaxed mb-3">
              استخدم نموذج Groq لمطابقة متطلبات مهام مشروعك مع المناصب الشاغرة لدى الفريق الهندسي واختيار الكفاءة الأمثل.
            </p>
            <button
              onClick={() => onNavigateTab('ai-decision-support')}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-violet-600 hover:bg-violet-700 text-white rounded-lg text-xs font-semibold transition-colors"
            >
              <span>فتح مساحة دعم القرار</span>
              <ArrowRight className={`w-3.5 h-3.5 ${isRtl ? 'rotate-180' : ''}`} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
