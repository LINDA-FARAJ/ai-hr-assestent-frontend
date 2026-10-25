import React from 'react';
import {
  Users,
  Briefcase,
  CheckSquare,
  Clock,
  Sparkles,
  Award,
  FolderKanban,
  AlertCircle,
  TrendingUp,
  ArrowRight,
  ShieldCheck,
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

interface DepartmentManagerDashboardProps {
  onNavigateTab: (tab: string, entityId?: number) => void;
}

export const DepartmentManagerDashboard: React.FC<DepartmentManagerDashboardProps> = ({
  onNavigateTab,
}) => {
  const { t, isRtl } = useTranslation();

  // Scoped to Department 1: Engineering & Development (الهندسة البرمجية والتطوير)
  const deptName = 'الهندسة البرمجية والتطوير';
  const deptEmployees = repository.employees.filter((e) => e.department_name === deptName || e.positions?.some((p) => p.department_name === deptName));
  const deptPositions = repository.positions.filter((p) => p.department_name === deptName && p.status === 'active');
  const deptTasks = repository.tasks.filter((t) => t.assigned_department_name === deptName);

  const pendingTasks = deptTasks.filter((t) => t.status === 'pending');
  const inProgressTasks = deptTasks.filter((t) => t.status === 'in_progress');
  const completedTasks = deptTasks.filter((t) => t.status === 'completed');

  // Department skills breakdown
  const deptSkillsData = [
    { name: 'Laravel', count: 6 },
    { name: 'React & TS', count: 7 },
    { name: 'PostgreSQL', count: 5 },
    { name: 'Docker/K8s', count: 4 },
    { name: 'Flutter', count: 3 },
  ];

  return (
    <div className="space-y-6">
      {/* Title Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-neutral-200 dark:border-neutral-800">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-bold text-neutral-900 dark:text-white tracking-tight">
              {isRtl ? `لوحة قيادة قسم ${deptName}` : `Engineering Department Workspace`}
            </h1>
            <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-amber-100 text-amber-800 dark:bg-amber-950/70 dark:text-amber-300 border border-amber-200 dark:border-amber-800">
              Department Manager
            </span>
          </div>
          <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1 max-w-2xl leading-relaxed">
            {isRtl
              ? 'متابعة حية للكوادر الهندسية، توزيع عبء العمل الأسبوعي، وجدولة المهام وفق المناصب المعتمدة'
              : 'Workload distribution, engineer availability, and skill matching for the engineering team'}
          </p>
        </div>

        <button
          onClick={() => onNavigateTab('ai-decision-support')}
          className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold text-white bg-violet-600 hover:bg-violet-700 rounded-lg shadow-xs transition-colors shrink-0"
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>{isRtl ? 'إسناد مهام القسم بالذكاء' : 'AI Task Assignment'}</span>
        </button>
      </div>

      {/* Scope Notice */}
      <div className="p-3.5 rounded-xl bg-amber-50/60 dark:bg-amber-950/30 border border-amber-200/80 dark:border-amber-900/40 text-xs text-neutral-600 dark:text-neutral-400 flex items-start gap-3">
        <ShieldCheck className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
        <div className="leading-relaxed">
          <span className="font-semibold text-neutral-900 dark:text-white">
            {isRtl ? 'نطاق الصلاحيات الإدارية للقسم:' : 'Departmental Governance Scope:'}
          </span>{' '}
          {isRtl
            ? 'تقتصر بيانات هذه اللوحة على قسم الهندسة البرمجية والتطوير. يمكنك تعديل مهام القسم واعتماد التوصيات الفنية الخاصة بكوادرك دون التأثير على إعدادات الأقسام الأخرى.'
            : 'Access is scoped to the Engineering Department. You can oversee team allocation and AI assignments within your department.'}
        </div>
      </div>

      {/* Primary KPI Grid (4 Cards) */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <MetricCard
          title={isRtl ? 'كوادر القسم الهندسية' : 'Department Headcount'}
          value="14"
          subtitle={isRtl ? 'مهندسو نظم ومطورو سحاب' : 'Engineers & Architects'}
          icon={Users}
          accentColor="indigo"
          onClick={() => onNavigateTab('employees')}
        />
        <MetricCard
          title={isRtl ? 'المناصب الوظيفية المعتمدة' : 'Active Positions'}
          value={deptPositions.length}
          subtitle={isRtl ? 'تغطي الأدوار القيادية والتقنية' : 'Connecting staff to roles'}
          icon={Briefcase}
          accentColor="indigo"
          onClick={() => onNavigateTab('positions')}
        />
        <MetricCard
          title={isRtl ? 'مهام القسم الجارية' : 'In Progress Tasks'}
          value={inProgressTasks.length}
          subtitle={isRtl ? `${pendingTasks.length} مهام بانتظار البدء` : `${pendingTasks.length} pending`}
          icon={CheckSquare}
          accentColor="amber"
          onClick={() => onNavigateTab('tasks')}
        />
        <MetricCard
          title={isRtl ? 'المشاريع المشارك بها القسم' : 'Engaged Projects'}
          value="4"
          subtitle={isRtl ? 'مشاريع برمجية قيد التسليم' : 'Under active delivery'}
          icon={FolderKanban}
          accentColor="emerald"
          onClick={() => onNavigateTab('projects')}
        />
      </div>

      {/* Two Column Layout: Team Availability & Skills Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Team Members & Capacity (7 Cols) */}
        <div className="lg:col-span-7 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl p-5 space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-neutral-100 dark:border-neutral-800">
            <div>
              <h3 className="text-xs font-bold text-neutral-900 dark:text-white uppercase tracking-wider">
                {isRtl ? 'جاهزية وساعات عمل مهندسي القسم' : 'Team Members Availability & Workload'}
              </h3>
              <p className="text-[11px] text-neutral-400 mt-0.5">
                {isRtl ? 'متابعة الساعات الشاغرة أسبوعياً لكل مهندس لتفادي الإرهاق' : 'Weekly available hours before task overloading'}
              </p>
            </div>
            <span className="text-[11px] font-mono text-neutral-400">{deptEmployees.length} Engineers</span>
          </div>

          <div className="space-y-3">
            {deptEmployees.map((emp) => (
              <div
                key={emp.id}
                className="p-3.5 rounded-xl border border-neutral-100 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-850/50 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
              >
                <div className="flex items-center gap-3">
                  <EmployeeAvatar name={`${emp.first_name} ${emp.last_name}`} size="md" />
                  <div>
                    <h4 className="text-xs font-bold text-neutral-900 dark:text-white">
                      {emp.first_name} {emp.last_name}
                    </h4>
                    <p className="text-[11px] text-neutral-500 dark:text-neutral-400">
                      {emp.job_title_name} · {emp.employee_code}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-4 text-xs shrink-0">
                  <div className="text-end">
                    <span className="font-bold text-indigo-600 dark:text-indigo-400 font-mono tabular-nums">
                      {emp.remaining_weekly_capacity_hours ?? 40} س
                    </span>
                    <span className="text-[10px] text-neutral-400 block">ساعات متاحة</span>
                  </div>
                  <button
                    onClick={() => onNavigateTab('employee-detail', emp.id)}
                    className="text-xs font-semibold text-neutral-600 dark:text-neutral-300 hover:text-indigo-600 p-1.5 rounded-lg border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800"
                  >
                    الملف
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Department Skills & Tasks Requiring Assignment (5 Cols) */}
        <div className="lg:col-span-5 space-y-5">
          {/* Skills Breakdown */}
          <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl p-5">
            <h3 className="text-xs font-bold text-neutral-900 dark:text-white uppercase tracking-wider mb-1">
              {isRtl ? 'كفاءات القسم الفنية المعتمدة' : 'Verified Department Skills'}
            </h3>
            <p className="text-[11px] text-neutral-400 mb-3">
              عدد المهندسين المعتمدين لكل تقنية
            </p>
            <div className="h-44">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={deptSkillsData} margin={{ top: 5, right: 10, left: -25, bottom: 0 }}>
                  <XAxis dataKey="name" tick={{ fontSize: 10 }} />
                  <YAxis tick={{ fontSize: 10 }} />
                  <Tooltip />
                  <Bar dataKey="count" fill="#6366f1" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* AI Task Assignment Recommendation Alert */}
          <div className="bg-violet-50 dark:bg-violet-950/40 border border-violet-200 dark:border-violet-800 rounded-xl p-4">
            <div className="flex items-start gap-3">
              <Sparkles className="w-5 h-5 text-violet-600 dark:text-violet-400 shrink-0 mt-0.5" />
              <div>
                <h4 className="text-xs font-bold text-violet-950 dark:text-violet-200">
                  {isRtl ? 'توصيات Groq AI الخاصة بالقسم' : 'Department AI Recommendation'}
                </h4>
                <p className="text-[11px] text-violet-800 dark:text-violet-300 mt-1 leading-relaxed">
                  يوجد مهمة برمجية جديدة لم تُسند بعد. أظهر فحص الذكاء الاصطناعي توفر 3 مهندسين بكفاءات متطابقة.
                </p>
                <button
                  onClick={() => onNavigateTab('ai-decision-support')}
                  className="mt-3 inline-flex items-center gap-1.5 px-3 py-1.5 bg-violet-600 text-white rounded-lg text-xs font-semibold hover:bg-violet-700 transition-colors"
                >
                  <span>مراجعة واختيار المنصب</span>
                  <ArrowRight className={`w-3 h-3 ${isRtl ? 'rotate-180' : ''}`} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
