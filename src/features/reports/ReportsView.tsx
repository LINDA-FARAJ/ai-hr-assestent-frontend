import React, { useState } from 'react';
import {
  BarChart3,
  Download,
  Calendar,
  Filter,
  CheckCircle,
  TrendingUp,
  PieChart as PieIcon,
  Sparkles,
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
  LineChart,
  Line,
} from 'recharts';
import { useTranslation } from '../../i18n/LanguageContext';
import { repository } from '../../services/api';

export const ReportsView: React.FC = () => {
  const { t, isRtl } = useTranslation();
  const [dateRange, setDateRange] = useState('2024');

  const budgetComparisonData = [
    { name: 'بوابة المصرفية المفتوحة', budget: 850, actual: 640 },
    { name: 'إدارة الأساطيل الذكية', budget: 620, actual: 390 },
    { name: 'منصة السجلات الطبية', budget: 490, actual: 280 },
    { name: 'محرك كشف الاحتيال', budget: 720, actual: 120 },
  ];

  const aiAcceptanceData = [
    { name: isRtl ? 'توصيات معتمدة' : 'Accepted', value: 78, color: '#10b981' },
    { name: isRtl ? 'قيد المراجعة' : 'Pending Review', value: 14, color: '#f59e0b' },
    { name: isRtl ? 'مرفوضة من المدير' : 'Rejected', value: 8, color: '#ef4444' },
  ];

  const handleExport = () => {
    // Generate CSV export from real schema data
    const headers = 'ID,Project Name,Client,Budget,Progress,Status\n';
    const rows = repository.projects
      .map((p) => `${p.id},"${p.name}","${p.client_name}",${p.budget},${p.progress}%,${p.status}`)
      .join('\n');
    const blob = new Blob([headers + rows], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'apexsoft_projects_report.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-neutral-200 dark:border-neutral-800">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-neutral-900 dark:text-white tracking-tight">
            {t.reports.title}
          </h1>
          <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1 max-w-2xl leading-relaxed">
            {t.reports.subtitle}
          </p>
        </div>

        <button
          onClick={handleExport}
          className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold text-neutral-700 dark:text-neutral-200 bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 hover:bg-neutral-50 rounded-lg shadow-xs transition-colors shrink-0"
        >
          <Download className="w-3.5 h-3.5" />
          <span>{t.reports.exportReport}</span>
        </button>
      </div>

      {/* Top Analytical Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl p-5">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-neutral-500 font-medium">معدل اعتماد توصيات الذكاء الاصطناعي</span>
            <Sparkles className="w-4 h-4 text-violet-600" />
          </div>
          <h3 className="text-2xl font-bold text-neutral-900 dark:text-white font-mono tabular-nums">
            78.4%
          </h3>
          <p className="text-[11px] text-emerald-600 mt-2 font-medium">
            +4.2% مقارنة بالربع السابق، مع توفير 18 ساعة أسبوعياً في التخطيط
          </p>
        </div>

        <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl p-5">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-neutral-500 font-medium">إجمالي الميزانيات المعتمدة للمشاريع</span>
            <TrendingUp className="w-4 h-4 text-indigo-600" />
          </div>
          <h3 className="text-2xl font-bold text-neutral-900 dark:text-white font-mono tabular-nums">
            2,680,000 ر.س
          </h3>
          <p className="text-[11px] text-neutral-500 mt-2">
            نسبة الاستهلاك الفعلي للميزانية الحالية: 53%
          </p>
        </div>

        <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl p-5">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-neutral-500 font-medium">متوسط سرعة إنجاز المهام (Velocity)</span>
            <CheckCircle className="w-4 h-4 text-emerald-600" />
          </div>
          <h3 className="text-2xl font-bold text-neutral-900 dark:text-white font-mono tabular-nums">
            94.2%
          </h3>
          <p className="text-[11px] text-neutral-500 mt-2">
            مطابقة الجدول الزمني المخطط للمهام البرمجية
          </p>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Budget vs Actual Expenditure */}
        <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl p-5">
          <h3 className="text-xs font-bold text-neutral-900 dark:text-white uppercase tracking-wider mb-1">
            الميزانيات المعتمدة مقابل الإنفاق الفعلي (بالألف ر.س)
          </h3>
          <p className="text-[11px] text-neutral-400 mb-4">
            مقارنة دقيقة للتكاليف حسب كل مشروع
          </p>

          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={budgetComparisonData}>
                <XAxis dataKey="name" tick={{ fontSize: 10 }} />
                <YAxis tick={{ fontSize: 10 }} />
                <Tooltip />
                <Bar dataKey="budget" name="الميزانية المعتمدة" fill="#4f46e5" radius={[4, 4, 0, 0]} />
                <Bar dataKey="actual" name="المنفق الفعلي" fill="#10b981" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* AI Recommendations Acceptance Distribution */}
        <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl p-5">
          <h3 className="text-xs font-bold text-neutral-900 dark:text-white uppercase tracking-wider mb-1">
            توزيع قرارات المدراء حول توصيات Groq AI
          </h3>
          <p className="text-[11px] text-neutral-400 mb-4">
            تأكيد سلطة المدراء الإدارية المستقلة عن خوارزميات الاقتراح
          </p>

          <div className="h-56 flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={aiAcceptanceData}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={75}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {aiAcceptanceData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="grid grid-cols-3 gap-2 pt-3 border-t border-neutral-100 dark:border-neutral-800 text-center text-xs">
            {aiAcceptanceData.map((item) => (
              <div key={item.name}>
                <span className="text-[11px] text-neutral-500 block truncate">{item.name}</span>
                <span className="font-bold tabular-nums font-mono mt-0.5 block">{item.value}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
