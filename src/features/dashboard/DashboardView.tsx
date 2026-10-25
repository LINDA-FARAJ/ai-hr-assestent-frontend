import React, { useEffect, useState } from 'react';
import {
  Users,
  FolderKanban,
  CheckSquare,
  Clock,
  Sparkles,
  AlertCircle,
  TrendingUp,
  ArrowRight,
  ShieldAlert,
  Building2,
  Calendar,
} from 'lucide-react';
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { useTranslation } from '../../i18n/LanguageContext';
import { apiService } from '../../services/api';
import { DashboardMetrics, Project, Task, AiTaskRecommendation } from '../../types';
import { MetricCard } from '../../components/ui/MetricCard';
import { StatusBadge, PriorityBadge } from '../../components/ui/Badge';
import { ProgressBar } from '../../components/ui/ProgressBar';
import { ActiveTab } from '../../components/layout/Sidebar';

interface DashboardViewProps {
  onNavigate: (tab: ActiveTab, entityId?: number) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({ onNavigate }) => {
  const { t, isRtl } = useTranslation();
  const [metrics, setMetrics] = useState<DashboardMetrics | null>(null);
  const [projects, setProjects] = useState<Project[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [pendingRecs, setPendingRecs] = useState<AiTaskRecommendation[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const [m, p, tk, r] = await Promise.all([
          apiService.getDashboardMetrics(),
          apiService.getProjects(),
          apiService.getTasks(),
          apiService.getAiRecommendations(),
        ]);
        setMetrics(m);
        setProjects(p);
        setTasks(tk);
        setPendingRecs(r.filter((item) => item.manager_decision === 'pending'));
      } catch (err) {
        console.error('Failed to load dashboard data', err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  if (loading || !metrics) {
    return (
      <div className="p-8 flex items-center justify-center min-h-[400px]">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-3 border-indigo-600 border-t-transparent rounded-full animate-spin" />
          <p className="text-xs text-neutral-500 font-medium">{t.common.loading}</p>
        </div>
      </div>
    );
  }

  // Chart data
  const projectStatusData = [
    { name: isRtl ? 'قيد التنفيذ' : 'In Progress', value: projects.filter((p) => p.status === 'in_progress').length, color: '#3b82f6' },
    { name: isRtl ? 'مخطط له' : 'Planning', value: projects.filter((p) => p.status === 'planning').length, color: '#f59e0b' },
    { name: isRtl ? 'مكتمل' : 'Completed', value: projects.filter((p) => p.status === 'completed').length, color: '#10b981' },
  ];

  const departmentHeadcounts = [
    { name: isRtl ? 'الهندسة' : 'Engineering', count: 14 },
    { name: isRtl ? 'الذكاء الاصطناعي' : 'AI & Data', count: 8 },
    { name: isRtl ? 'ضمان الجودة' : 'QA', count: 6 },
    { name: isRtl ? 'العمليات السحابية' : 'DevOps', count: 5 },
    { name: isRtl ? 'التصميم' : 'Design', count: 5 },
  ];

  return (
    <div className="space-y-6">
      {/* Page Title & Context Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-neutral-200 dark:border-neutral-800">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-neutral-900 dark:text-white tracking-tight">
            {t.dashboard.title}
          </h1>
          <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1 max-w-2xl leading-relaxed">
            {t.dashboard.subtitle}
          </p>
        </div>
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={() => onNavigate('ai-decision-support')}
            className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold text-white bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 rounded-lg shadow-xs transition-all"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>{t.dashboard.requestAiRecommendation}</span>
          </button>
        </div>
      </div>

      {/* AI Decision Alert Banner (if pending decisions exist) */}
      {pendingRecs.length > 0 && (
        <div className="bg-gradient-to-r from-violet-50 to-indigo-50/50 dark:from-violet-950/40 dark:to-indigo-950/20 border border-violet-200 dark:border-violet-800/60 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-lg bg-violet-600 text-white shrink-0">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-xs font-bold text-violet-950 dark:text-violet-200">
                {isRtl ? 'يوجد قرارات إسناد ذكية معلقة بانتظار المراجعة' : 'AI Assignment Recommendations Pending Review'}
              </h3>
              <p className="text-[11px] text-violet-800 dark:text-violet-300 mt-0.5">
                {isRtl
                  ? `قام نموذج Groq بتحليل الكفاءات وإصدار ${pendingRecs.length} توصيات لإسناد المهام الشاغرة`
                  : `Groq AI model evaluated talent capacity and proposed ${pendingRecs.length} task assignment decisions`}
              </p>
            </div>
          </div>
          <button
            onClick={() => onNavigate('ai-decision-support')}
            className="inline-flex items-center justify-center gap-1.5 px-3 py-1.5 bg-white dark:bg-neutral-800 text-violet-700 dark:text-violet-300 text-xs font-semibold rounded-lg border border-violet-200 dark:border-violet-700 hover:bg-violet-50 dark:hover:bg-neutral-750 shrink-0 transition-colors"
          >
            <span>{isRtl ? 'مراجعة التوصيات واتخاذ القرار' : 'Review & Decide'}</span>
            <ArrowRight className={`w-3.5 h-3.5 ${isRtl ? 'rotate-180' : ''}`} />
          </button>
        </div>
      )}

      {/* Primary KPI Grid (8 Cards) */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <MetricCard
          title={t.dashboard.totalEmployees}
          value={metrics.total_employees}
          subtitle={`${metrics.active_employees} ${t.dashboard.activeEmployees}`}
          icon={Users}
          accentColor="indigo"
          onClick={() => onNavigate('employees')}
        />
        <MetricCard
          title={t.dashboard.activeProjects}
          value={metrics.active_projects}
          subtitle={isRtl ? 'تخضع للمتابعة اللحظية' : 'Under active delivery'}
          icon={FolderKanban}
          accentColor="indigo"
          onClick={() => onNavigate('projects')}
        />
        <MetricCard
          title={t.dashboard.pendingTasks}
          value={metrics.pending_tasks}
          subtitle={isRtl ? 'مهام تحتاج إسناد منصب' : 'Awaiting position assignment'}
          icon={Clock}
          accentColor="amber"
          onClick={() => onNavigate('tasks')}
        />
        <MetricCard
          title={t.dashboard.completedTasks}
          value={metrics.completed_tasks}
          subtitle={isRtl ? 'تم تسليمها وفق الجودة' : 'Delivered on spec'}
          icon={CheckSquare}
          accentColor="emerald"
          onClick={() => onNavigate('tasks')}
        />
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Project Delivery & Status */}
        <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl p-5">
          <div className="flex items-center justify-between mb-4 pb-2 border-b border-neutral-100 dark:border-neutral-800">
            <div>
              <h3 className="text-xs font-bold text-neutral-900 dark:text-white uppercase tracking-wider">
                {t.dashboard.projectStatusDistribution}
              </h3>
              <p className="text-[11px] text-neutral-400 mt-0.5">
                {isRtl ? 'حالة المشاريع المسجلة في النظام' : 'Registered projects by lifecycle stage'}
              </p>
            </div>
            <FolderKanban className="w-4 h-4 text-neutral-400" />
          </div>

          <div className="h-52 flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={projectStatusData}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={75}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {projectStatusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="mt-2 grid grid-cols-3 gap-2 pt-3 border-t border-neutral-100 dark:border-neutral-800 text-center text-xs">
            {projectStatusData.map((item) => (
              <div key={item.name} className="flex flex-col items-center">
                <span className="text-neutral-500 text-[11px] flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color }} />
                  {item.name}
                </span>
                <span className="font-bold tabular-nums text-neutral-900 dark:text-white mt-1">
                  {item.value}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Headcount by Department */}
        <div className="lg:col-span-2 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl p-5">
          <div className="flex items-center justify-between mb-4 pb-2 border-b border-neutral-100 dark:border-neutral-800">
            <div>
              <h3 className="text-xs font-bold text-neutral-900 dark:text-white uppercase tracking-wider">
                {t.dashboard.departmentDistribution}
              </h3>
              <p className="text-[11px] text-neutral-400 mt-0.5">
                {isRtl ? 'توزيع الكوادر الفنية على الأقسام الرئيسية' : 'Headcount allocation across departments'}
              </p>
            </div>
            <Building2 className="w-4 h-4 text-neutral-400" />
          </div>

          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={departmentHeadcounts} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip />
                <Bar dataKey="count" fill="#4f46e5" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Two Column Workload & Recent Projects */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Active Projects Snapshot */}
        <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl p-5">
          <div className="flex items-center justify-between mb-4 pb-2 border-b border-neutral-100 dark:border-neutral-800">
            <div>
              <h3 className="text-xs font-bold text-neutral-900 dark:text-white uppercase tracking-wider">
                {isRtl ? 'المشاريع الجارية ونسب الإنجاز' : 'Active Projects & Milestone Progress'}
              </h3>
            </div>
            <button
              onClick={() => onNavigate('projects')}
              className="text-xs text-indigo-600 hover:underline font-medium"
            >
              {t.common.viewAll}
            </button>
          </div>

          <div className="space-y-4">
            {projects.slice(0, 4).map((proj) => (
              <div
                key={proj.id}
                onClick={() => onNavigate('project-detail', proj.id)}
                className="p-3 rounded-lg border border-neutral-100 dark:border-neutral-800 hover:border-neutral-200 dark:hover:border-neutral-700 transition-colors cursor-pointer group"
              >
                <div className="flex items-start justify-between gap-3 mb-2">
                  <div className="overflow-hidden">
                    <h4 className="text-xs font-semibold text-neutral-900 dark:text-white truncate group-hover:text-indigo-600 transition-colors">
                      {proj.name}
                    </h4>
                    <p className="text-[11px] text-neutral-400 truncate mt-0.5">
                      {proj.client_name} · {proj.tasks_count} {isRtl ? 'مهمة' : 'tasks'}
                    </p>
                  </div>
                  <PriorityBadge priority={proj.priority} />
                </div>
                <ProgressBar progress={proj.progress} showLabel size="sm" />
              </div>
            ))}
          </div>
        </div>

        {/* Priority Tasks Requiring Assignment */}
        <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl p-5">
          <div className="flex items-center justify-between mb-4 pb-2 border-b border-neutral-100 dark:border-neutral-800">
            <div>
              <h3 className="text-xs font-bold text-neutral-900 dark:text-white uppercase tracking-wider">
                {isRtl ? 'مهام حيوية بحاجة إلى إسناد فوري' : 'Critical Tasks Requiring Assignment'}
              </h3>
            </div>
            <button
              onClick={() => onNavigate('tasks')}
              className="text-xs text-indigo-600 hover:underline font-medium"
            >
              {t.common.viewAll}
            </button>
          </div>

          <div className="space-y-3">
            {tasks
              .filter((t) => !t.position_id || t.status === 'pending')
              .slice(0, 4)
              .map((tk) => (
                <div
                  key={tk.id}
                  className="p-3 rounded-lg border border-neutral-100 dark:border-neutral-800 flex items-center justify-between gap-3"
                >
                  <div className="overflow-hidden">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-semibold text-neutral-900 dark:text-white truncate">
                        {tk.title}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-[11px] text-neutral-400 mt-1">
                      <span>{tk.project_name}</span>
                      <span aria-hidden="true">·</span>
                      <span className="text-indigo-600 font-medium">{tk.skill_name}</span>
                      <span aria-hidden="true">·</span>
                      <span className="tabular-nums">{tk.estimated_hours} {t.common.hours}</span>
                    </div>
                  </div>

                  <button
                    onClick={() => onNavigate('ai-decision-support')}
                    className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-semibold bg-violet-50 text-violet-700 dark:bg-violet-950/60 dark:text-violet-300 hover:bg-violet-100 border border-violet-200 dark:border-violet-800 transition-colors shrink-0"
                  >
                    <Sparkles className="w-3 h-3" />
                    <span>{isRtl ? 'إسناد بالذكاء' : 'AI Assign'}</span>
                  </button>
                </div>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
};
