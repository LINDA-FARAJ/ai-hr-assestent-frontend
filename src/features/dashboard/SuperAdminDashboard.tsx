import React, { useState } from 'react';
import {
  Shield,
  Building2,
  Users,
  Server,
  Activity,
  AlertTriangle,
  CheckCircle2,
  Lock,
  ArrowUpRight,
  Search,
  Filter,
  Cpu,
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import { useTranslation } from '../../i18n/LanguageContext';
import { MetricCard } from '../../components/ui/MetricCard';
import { StatusBadge } from '../../components/ui/Badge';
import { PlatformAuditLog } from '../../types';

interface SuperAdminDashboardProps {
  onNavigateTab: (tab: string) => void;
}

export const SuperAdminDashboard: React.FC<SuperAdminDashboardProps> = ({ onNavigateTab }) => {
  const { t, isRtl } = useTranslation();
  const [searchTerm, setSearchTerm] = useState('');

  const registeredCompanies = [
    { id: 1, name: 'شركة أبيكس للحلول التقنية والبرمجيات', plan: 'Enterprise Cloud', users: 38, projects: 4, status: 'active', renewal: '2025-12-31' },
    { id: 2, name: 'شركة المدار للحوسبة السحابية', plan: 'Enterprise Cloud', users: 54, projects: 6, status: 'active', renewal: '2025-10-15' },
    { id: 3, name: 'مجموعة نيوم للابتكارات الرقمية', plan: 'Enterprise Dedicated', users: 120, projects: 12, status: 'active', renewal: '2026-03-01' },
    { id: 4, name: 'حلول المدفوعات السعودية المتقدمة', plan: 'Business Plus', users: 26, projects: 3, status: 'active', renewal: '2025-08-20' },
    { id: 5, name: 'بتروتك لأنظمة الطاقة المتجددة', plan: 'Standard Pro', users: 18, projects: 2, status: 'active', renewal: '2025-06-30' },
  ];

  const platformAuditLogs: PlatformAuditLog[] = [
    { id: 101, user_name: 'د. خالد العمري (ApexSoft)', action: 'اعتماد توصية ذكاء اصطناعي لمهمة telemetry', company_name: 'شركة أبيكس', target_entity: 'Task #1004', timestamp: 'منذ 10 دقائق', ip_address: '192.168.1.45', status: 'success' },
    { id: 102, user_name: 'م. سارة القحطاني (ApexSoft)', action: 'طلب تحليل إسناد مهمة جديدة من Groq', company_name: 'شركة أبيكس', target_entity: 'Task #1007', timestamp: 'منذ 35 دقيقة', ip_address: '192.168.1.88', status: 'info' },
    { id: 103, user_name: 'م. فهد الخالد (المدار)', action: 'تعديل سياسة تصدير العقود المؤسسية', company_name: 'شركة المدار', target_entity: 'Company Settings', timestamp: 'منذ ساعتين', ip_address: '10.0.4.12', status: 'warning' },
    { id: 104, user_name: 'د. منيرة الصالح (نيوم)', action: 'إنشاء 8 مناصب وظيفية جديدة', company_name: 'نيوم الرقمية', target_entity: 'Positions Table', timestamp: 'منذ 3 ساعات', ip_address: '172.16.0.5', status: 'success' },
  ];

  const platformGrowthData = [
    { quarter: 'Q1', companies: 8, requests: 1200 },
    { quarter: 'Q2', companies: 11, requests: 2800 },
    { quarter: 'Q3', companies: 14, requests: 4600 },
    { quarter: 'Q4', companies: 18, requests: 8400 },
  ];

  return (
    <div className="space-y-6">
      {/* Title Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-neutral-200 dark:border-neutral-800">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-bold text-neutral-900 dark:text-white tracking-tight">
              {isRtl ? 'لوحة قيادة إدارة المنصة (Super Admin Workspace)' : 'Platform Super Admin Workspace'}
            </h1>
            <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-rose-100 text-rose-800 dark:bg-rose-950/70 dark:text-rose-300 border border-rose-200 dark:border-rose-800">
              Platform Master
            </span>
          </div>
          <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1 max-w-2xl leading-relaxed">
            {isRtl
              ? 'مراقبة شاملة لكافة الشركات المشتركة، أداء خوادم Groq وLaravel، وتتبع سجلات التدقيق المؤسسية'
              : 'Global oversight across registered tenant companies, Groq AI infrastructure, and platform audit logs'}
          </p>
        </div>
      </div>

      {/* Primary KPI Grid (4 Cards) */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <MetricCard
          title={isRtl ? 'الشركات المسجلة في المنصة' : 'Registered Companies'}
          value="18"
          subtitle={isRtl ? '5 شركات بحسابات Enterprise' : '5 on Enterprise Cloud'}
          icon={Building2}
          accentColor="indigo"
        />
        <MetricCard
          title={isRtl ? 'إجمالي مستخدمي المنصة' : 'Total Platform Users'}
          value="420"
          subtitle={isRtl ? 'نشطون خلال الـ 24 ساعة الماضية' : 'Active across all tenants'}
          icon={Users}
          accentColor="indigo"
        />
        <MetricCard
          title={isRtl ? 'استدعاءات Groq AI الشهرية' : 'Monthly Groq AI Calls'}
          value="14,850"
          subtitle={isRtl ? 'متوسط سرعة الاستنتاج 180ms' : 'Average latency: 180ms'}
          icon={Cpu}
          accentColor="violet"
        />
        <MetricCard
          title={isRtl ? 'جاهزية النظام والخدمات' : 'System Availability'}
          value="99.98%"
          subtitle={isRtl ? 'كافة الخدمات تعمل بكفاءة' : 'Nominal zero downtime'}
          icon={Server}
          accentColor="emerald"
        />
      </div>

      {/* Registered Companies Management Table */}
      <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl overflow-hidden shadow-xs">
        <div className="p-4 border-b border-neutral-100 dark:border-neutral-800 flex items-center justify-between">
          <div>
            <h3 className="text-xs font-bold text-neutral-900 dark:text-white uppercase tracking-wider">
              {isRtl ? 'الشركات والمؤسسات المشتركة (Tenants Directory)' : 'Registered Tenant Companies'}
            </h3>
            <p className="text-[11px] text-neutral-400 mt-0.5">
              {isRtl ? 'إدارة اشتراكات الشركات وعزل البيانات وحالات التشغيل' : 'Manage subscriptions, tenant isolation, and status'}
            </p>
          </div>
          <span className="text-[11px] font-mono text-neutral-400">18 Companies</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-start">
            <thead className="bg-neutral-50 dark:bg-neutral-850 border-b border-neutral-200 dark:border-neutral-800 text-neutral-500 font-semibold">
              <tr>
                <th className="px-4 py-3 text-start">اسم الشركة</th>
                <th className="px-4 py-3 text-start">باقة الاشتراك</th>
                <th className="px-4 py-3 text-center">المستخدمون</th>
                <th className="px-4 py-3 text-center">المشاريع</th>
                <th className="px-4 py-3 text-start">تاريخ التجديد</th>
                <th className="px-4 py-3 text-center">الحالة</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100 dark:divide-neutral-800">
              {registeredCompanies.map((comp) => (
                <tr key={comp.id} className="hover:bg-neutral-50/70 dark:hover:bg-neutral-800/40">
                  <td className="px-4 py-3 font-semibold text-neutral-900 dark:text-white">
                    {comp.name}
                  </td>
                  <td className="px-4 py-3 font-mono text-indigo-600 dark:text-indigo-400 font-medium">
                    {comp.plan}
                  </td>
                  <td className="px-4 py-3 text-center font-mono tabular-nums text-neutral-700 dark:text-neutral-300">
                    {comp.users}
                  </td>
                  <td className="px-4 py-3 text-center font-mono tabular-nums text-neutral-700 dark:text-neutral-300">
                    {comp.projects}
                  </td>
                  <td className="px-4 py-3 font-mono text-[11px] text-neutral-400 tabular-nums">
                    {comp.renewal}
                  </td>
                  <td className="px-4 py-3 text-center">
                    <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300 border border-emerald-200">
                      نشطة
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Platform Growth Chart & Audit Logs */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Growth Chart */}
        <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl p-5">
          <h3 className="text-xs font-bold text-neutral-900 dark:text-white uppercase tracking-wider mb-1">
            {isRtl ? 'نمو استدعاءات Groq وحجم الشركات' : 'Groq AI Requests Growth Trend'}
          </h3>
          <p className="text-[11px] text-neutral-400 mb-4">
            تزايد اعتماد الشركات على توصيات الذكاء الاصطناعي
          </p>

          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={platformGrowthData}>
                <XAxis dataKey="quarter" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip />
                <Bar dataKey="requests" name="استدعاءات Groq AI" fill="#7c3aed" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Platform Audit Logs */}
        <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl p-5 space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-neutral-100 dark:border-neutral-800">
            <h3 className="text-xs font-bold text-neutral-900 dark:text-white uppercase tracking-wider">
              {isRtl ? 'سجل أنشطة التدقيق الموحد (Platform Audit Logs)' : 'Global Platform Audit Logs'}
            </h3>
            <span className="text-[11px] font-mono text-neutral-400">Live Security Stream</span>
          </div>

          <div className="space-y-3">
            {platformAuditLogs.map((log) => (
              <div
                key={log.id}
                className="p-3 rounded-lg border border-neutral-100 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-850/50 text-xs"
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="font-semibold text-neutral-900 dark:text-white">{log.user_name}</span>
                  <span className="text-[10px] text-neutral-400 font-mono">{log.timestamp}</span>
                </div>
                <p className="text-[11px] text-neutral-600 dark:text-neutral-400">{log.action}</p>
                <div className="flex items-center justify-between text-[10px] text-neutral-400 mt-1.5 pt-1.5 border-t border-neutral-200/50 dark:border-neutral-800">
                  <span>الهدف: {log.target_entity}</span>
                  <span className="font-mono">{log.ip_address}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
