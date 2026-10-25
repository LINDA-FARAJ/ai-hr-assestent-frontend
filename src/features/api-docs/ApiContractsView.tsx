import React from 'react';
import { Code2, Server, ShieldCheck, CheckCircle2, AlertCircle, Cpu, Database } from 'lucide-react';
import { useTranslation } from '../../i18n/LanguageContext';

export const ApiContractsView: React.FC = () => {
  const { t, isRtl } = useTranslation();

  const endpoints = [
    {
      service: 'Laravel API',
      method: 'GET',
      path: '/api/dashboard/metrics',
      desc: 'إحصائيات ومؤشرات الأداء اللحظية للوحة القيادة التنفيذية',
      auth: 'Sanctum Bearer Token',
      status: 'Ready',
    },
    {
      service: 'Laravel API',
      method: 'GET',
      path: '/api/employees',
      desc: 'قائمة الموظفين مع المناصب النشطة والمهارات وتفاصيل السجلات',
      auth: 'Sanctum Bearer Token',
      status: 'Ready',
    },
    {
      service: 'Laravel API',
      method: 'GET',
      path: '/api/employees/{id}',
      desc: 'ملف الموظف الكامل متضمناً جدول المناصب التاريخية (positions) والعقود والوثائق',
      auth: 'Sanctum Bearer Token',
      status: 'Ready',
    },
    {
      service: 'Laravel API',
      method: 'GET',
      path: '/api/positions',
      desc: 'سجل المناصب الوظيفية الفعلية التي تربط الموظف بالقسم والمسمى الوظيفي',
      auth: 'Sanctum Bearer Token',
      status: 'Ready',
    },
    {
      service: 'Laravel API',
      method: 'POST',
      path: '/api/positions',
      desc: 'تعيين منصب جديد لموظف مع تحديد القسم ونوع التوظيف وتاريخ البدء',
      auth: 'Sanctum Bearer Token',
      status: 'Ready',
    },
    {
      service: 'Laravel API',
      method: 'GET',
      path: '/api/job-titles',
      desc: 'دليل المسميات والرتب المهنية القياسية في الشركة',
      auth: 'Sanctum Bearer Token',
      status: 'Ready',
    },
    {
      service: 'Laravel API',
      method: 'GET',
      path: '/api/tasks',
      desc: 'قائمة المهام التشغيلية مع ربطها بـ position_id و skill_id و parent_task_id',
      auth: 'Sanctum Bearer Token',
      status: 'Ready',
    },
    {
      service: 'Laravel API & FastAPI Groq',
      method: 'POST',
      path: '/api/ai/recommend-task/{taskId}',
      desc: 'استدعاء محرك Groq لتحليل المهارات وساعات العمل واقتراح أفضل منصب مع التعليل والبدلاء',
      auth: 'Sanctum Bearer Token',
      status: 'Integrated',
      isAi: true,
    },
    {
      service: 'Laravel API',
      method: 'POST',
      path: '/api/ai/recommendations/{id}/decision',
      desc: 'توثيق قرار المدير (قبول أو رفض) وتحديث المنصب المسند للمهمة (position_id)',
      auth: 'Sanctum Bearer Token',
      status: 'Ready',
      isAi: true,
    },
    {
      service: 'Laravel API',
      method: 'GET',
      path: '/api/ai/recommendations',
      desc: 'سجل كافة توصيات الذكاء الاصطناعي التاريخية وقرارات المدراء المسجلة في جدول ai_task_recommendations',
      auth: 'Sanctum Bearer Token',
      status: 'Ready',
      isAi: true,
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-neutral-200 dark:border-neutral-800">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-bold text-neutral-900 dark:text-white tracking-tight">
              {t.nav.apiDocs}
            </h1>
            <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-emerald-100 text-emerald-800 dark:bg-emerald-950/70 dark:text-emerald-300">
              Laravel + FastAPI Architecture
            </span>
          </div>
          <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1 max-w-3xl leading-relaxed">
            توثيق كامل للواجهات البرمجية والعقود ومخططات البيانات التي تربط الواجهة الأمامية بالخادم
          </p>
        </div>
      </div>

      {/* Architecture Highlights */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-4 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900">
          <div className="flex items-center gap-2 text-xs font-bold text-neutral-900 dark:text-white mb-2">
            <Server className="w-4 h-4 text-indigo-600" />
            <span>1. Laravel 11 Backend</span>
          </div>
          <p className="text-xs text-neutral-500 leading-relaxed">
            مسؤول عن منطق الأعمال، قواعد البيانات، الصلاحيات والتوثيق عبر Sanctum، وجداول `positions`، `tasks`، `projects`.
          </p>
        </div>

        <div className="p-4 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900">
          <div className="flex items-center gap-2 text-xs font-bold text-neutral-900 dark:text-white mb-2">
            <Cpu className="w-4 h-4 text-violet-600" />
            <span>2. FastAPI AI Service</span>
          </div>
          <p className="text-xs text-neutral-500 leading-relaxed">
            مسؤول حصرياً عن الاتصال بـ Groq Cloud AI، تجهيز سياق المهارات، واستقبال الردود اللغوية السريعة وتحويلها لـ JSON.
          </p>
        </div>

        <div className="p-4 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900">
          <div className="flex items-center gap-2 text-xs font-bold text-neutral-900 dark:text-white mb-2">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>3. الحوكمة الإدارية</span>
          </div>
          <p className="text-xs text-neutral-500 leading-relaxed">
            الذكاء الاصطناعي لا يغير `position_id` للمهمة تلقائياً أبداً؛ التحديث يتم فقط بعد اعتماد المدير الصريح عبر API.
          </p>
        </div>
      </div>

      {/* Endpoints Table */}
      <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl overflow-hidden shadow-xs">
        <div className="px-5 py-3 border-b border-neutral-100 dark:border-neutral-800 flex items-center justify-between">
          <h3 className="text-xs font-bold text-neutral-900 dark:text-white uppercase tracking-wider">
            قائمة نقاط النهاية المعتمدة (API Endpoints)
          </h3>
          <span className="text-[11px] text-neutral-400 font-mono">10 Endpoints</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-start">
            <thead className="bg-neutral-50 dark:bg-neutral-850 border-b border-neutral-200 dark:border-neutral-800 text-neutral-500 font-semibold">
              <tr>
                <th className="px-4 py-3 text-start">الطريقة والمصدر</th>
                <th className="px-4 py-3 text-start">المسار (Path)</th>
                <th className="px-4 py-3 text-start">الوصف والوظيفة</th>
                <th className="px-4 py-3 text-start">التوثيق</th>
                <th className="px-4 py-3 text-center">الحالة</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100 dark:divide-neutral-800">
              {endpoints.map((ep, idx) => (
                <tr key={idx} className="hover:bg-neutral-50/70 dark:hover:bg-neutral-800/40">
                  <td className="px-4 py-3 whitespace-nowrap">
                    <span
                      className={`font-mono font-bold px-2 py-0.5 rounded text-[10px] ${
                        ep.method === 'GET'
                          ? 'bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-300'
                          : 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300'
                      }`}
                    >
                      {ep.method}
                    </span>
                    <span className="text-[11px] text-neutral-400 block mt-0.5">{ep.service}</span>
                  </td>

                  <td className="px-4 py-3 font-mono text-[11px] font-semibold text-neutral-900 dark:text-white">
                    {ep.path}
                  </td>

                  <td className="px-4 py-3 text-neutral-600 dark:text-neutral-400 max-w-sm">
                    {ep.desc}
                  </td>

                  <td className="px-4 py-3 font-mono text-[10px] text-neutral-500">
                    {ep.auth}
                  </td>

                  <td className="px-4 py-3 text-center whitespace-nowrap">
                    <span
                      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-semibold ${
                        ep.isAi
                          ? 'bg-violet-100 text-violet-800 dark:bg-violet-950 dark:text-violet-300'
                          : 'bg-neutral-100 text-neutral-700 dark:bg-neutral-800 dark:text-neutral-300'
                      }`}
                    >
                      <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                      <span>{ep.status}</span>
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
