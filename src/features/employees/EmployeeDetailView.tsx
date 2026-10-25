import React, { useState, useEffect } from 'react';
import {
  ArrowLeft,
  ArrowRight,
  Briefcase,
  Calendar,
  Mail,
  Phone,
  Building2,
  Award,
  FileText,
  Clock,
  CheckCircle2,
  AlertCircle,
  FolderKanban,
  User,
  Shield,
  FileCheck,
} from 'lucide-react';
import { useTranslation } from '../../i18n/LanguageContext';
import { apiService, repository } from '../../services/api';
import { Employee, Position, EmployeeSkill, EmployeeDocument, EmployeeContract, Task } from '../../types';
import { EmployeeAvatar } from '../../components/ui/EmployeeAvatar';
import { StatusBadge } from '../../components/ui/Badge';

interface EmployeeDetailViewProps {
  employeeId: number;
  onBack: () => void;
}

export const EmployeeDetailView: React.FC<EmployeeDetailViewProps> = ({
  employeeId,
  onBack,
}) => {
  const { t, isRtl } = useTranslation();
  const [employee, setEmployee] = useState<Employee | null>(null);
  const [activeTab, setActiveTab] = useState<'overview' | 'positions' | 'skills' | 'tasks' | 'documents' | 'contracts'>('overview');
  const [employeeTasks, setEmployeeTasks] = useState<Task[]>([]);

  useEffect(() => {
    async function load() {
      const emp = await apiService.getEmployee(employeeId);
      if (emp) {
        setEmployee(emp);
        const allTasks = await apiService.getTasks();
        // Tasks assigned to any of this employee's positions
        const empPosIds = emp.positions?.map((p) => p.id) || [];
        const myTasks = allTasks.filter((tk) => tk.position_id && empPosIds.includes(tk.position_id));
        setEmployeeTasks(myTasks);
      }
    }
    load();
  }, [employeeId]);

  if (!employee) {
    return (
      <div className="p-12 text-center text-xs text-neutral-400">
        جاري تحميل ملف الموظف...
      </div>
    );
  }

  const activePosition = employee.positions?.find((p) => p.status === 'active') || employee.current_position;
  const pastPositions = employee.positions?.filter((p) => p.status === 'past') || [];

  return (
    <div className="space-y-6">
      {/* Top Breadcrumb & Return Action */}
      <div className="flex items-center justify-between pb-3 border-b border-neutral-200 dark:border-neutral-800">
        <button
          onClick={onBack}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white transition-colors"
        >
          {isRtl ? <ArrowRight className="w-4 h-4" /> : <ArrowLeft className="w-4 h-4" />}
          <span>{isRtl ? 'العودة إلى دليل الموظفين' : 'Back to Employee Directory'}</span>
        </button>

        <span className="font-mono text-xs text-neutral-400">{employee.employee_code}</span>
      </div>

      {/* Profile Header Card */}
      <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl p-6 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-start sm:items-center gap-4">
            <EmployeeAvatar
              name={`${employee.first_name} ${employee.last_name}`}
              size="xl"
              className="ring-4 ring-neutral-100 dark:ring-neutral-800"
            />
            <div>
              <div className="flex items-center gap-2.5">
                <h1 className="text-xl font-bold text-neutral-900 dark:text-white tracking-tight">
                  {employee.first_name} {employee.last_name}
                </h1>
                <StatusBadge status={employee.status} />
              </div>
              <p className="text-xs text-neutral-500 font-medium mt-1">
                {activePosition?.job_title_name || employee.job_title_name} · {activePosition?.department_name || employee.department_name}
              </p>
              <div className="flex flex-wrap items-center gap-4 text-[11px] text-neutral-400 mt-2">
                <span className="flex items-center gap-1">
                  <Mail className="w-3 h-3 text-neutral-400" />
                  <span className="font-mono">{employee.email}</span>
                </span>
                <span className="flex items-center gap-1">
                  <Phone className="w-3 h-3 text-neutral-400" />
                  <span className="font-mono">{employee.phone}</span>
                </span>
                <span className="flex items-center gap-1">
                  <Calendar className="w-3 h-3 text-neutral-400" />
                  <span>تاريخ التعيين: {employee.hire_date}</span>
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-4 p-3 rounded-xl bg-neutral-50 dark:bg-neutral-800/60 border border-neutral-200 dark:border-neutral-700/60 shrink-0 text-center">
            <div className="px-3">
              <span className="text-[10px] text-neutral-400 block uppercase">المهام الجارية</span>
              <span className="text-base font-bold text-neutral-900 dark:text-white font-mono tabular-nums">
                {employeeTasks.filter((t) => t.status !== 'completed').length}
              </span>
            </div>
            <div className="w-px h-8 bg-neutral-200 dark:bg-neutral-700" />
            <div className="px-3">
              <span className="text-[10px] text-neutral-400 block uppercase">الساعات الشاغرة</span>
              <span className="text-base font-bold text-indigo-600 dark:text-indigo-400 font-mono tabular-nums">
                {employee.remaining_weekly_capacity_hours ?? 40} س
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs navigation */}
      <div className="flex items-center gap-1 border-b border-neutral-200 dark:border-neutral-800 overflow-x-auto">
        {[
          { id: 'overview', label: 'نظرة عامة وسيرة' },
          { id: 'positions', label: `سجل المناصب والتنقلات (${employee.positions?.length || 1})` },
          { id: 'skills', label: `المهارات والاعتمادات (${employee.skills?.length || 0})` },
          { id: 'tasks', label: `المهام المسندة (${employeeTasks.length})` },
          { id: 'documents', label: `الوثائق الثبوتية (${employee.documents?.length || 0})` },
          { id: 'contracts', label: `عقود العمل (${employee.contracts?.length || 0})` },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`px-4 py-2.5 text-xs font-semibold whitespace-nowrap border-b-2 transition-colors ${
              activeTab === tab.id
                ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400'
                : 'border-transparent text-neutral-500 hover:text-neutral-900 dark:hover:text-white'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Panels */}
      <div className="space-y-4">
        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2 space-y-4">
              <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl p-5">
                <h3 className="text-xs font-bold text-neutral-900 dark:text-white uppercase tracking-wider mb-2">
                  السيرة المهنية
                </h3>
                <p className="text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed">
                  {employee.bio || 'لا توجد نبذة مضافة للموظف حتى الآن.'}
                </p>
              </div>

              {/* Active Position Spotlight */}
              {activePosition && (
                <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl p-5">
                  <h3 className="text-xs font-bold text-neutral-900 dark:text-white uppercase tracking-wider mb-3">
                    المنصب الوظيفي الحالي المعتمد
                  </h3>
                  <div className="p-3.5 rounded-lg bg-indigo-50/50 dark:bg-indigo-950/30 border border-indigo-100 dark:border-indigo-900/40 flex items-start justify-between">
                    <div>
                      <h4 className="text-sm font-bold text-neutral-900 dark:text-white">
                        {activePosition.job_title_name}
                      </h4>
                      <p className="text-xs text-neutral-500 mt-0.5">
                        {activePosition.department_name} · نوع التوظيف: {activePosition.employment_type}
                      </p>
                      <span className="text-[11px] text-neutral-400 mt-2 block">
                        تاريخ شغل المنصب: من {activePosition.start_date} حتى الآن
                      </span>
                    </div>
                    <span className="text-[11px] font-semibold text-emerald-700 dark:text-emerald-300 bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-200">
                      نشط حالياً
                    </span>
                  </div>
                </div>
              )}
            </div>

            {/* Demographics & Personal Info */}
            <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl p-5 space-y-3 text-xs">
              <h3 className="font-bold text-neutral-900 dark:text-white uppercase tracking-wider text-[11px] pb-2 border-b border-neutral-100 dark:border-neutral-800">
                البيانات الشخصية
              </h3>
              <div className="flex justify-between py-1 border-b border-neutral-50 dark:border-neutral-850">
                <span className="text-neutral-400">الجنسية:</span>
                <span className="font-medium text-neutral-800 dark:text-neutral-200">{employee.nationality || 'سعودي'}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-neutral-50 dark:border-neutral-850">
                <span className="text-neutral-400">المدينة:</span>
                <span className="font-medium text-neutral-800 dark:text-neutral-200">{employee.city}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-neutral-50 dark:border-neutral-850">
                <span className="text-neutral-400">تاريخ الميلاد:</span>
                <span className="font-medium text-neutral-800 dark:text-neutral-200 font-mono">{employee.date_of_birth || '1992-05-10'}</span>
              </div>
            </div>
          </div>
        )}

        {/* Positions & Career Timeline Tab */}
        {activeTab === 'positions' && (
          <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl p-6">
            <div className="mb-4">
              <h3 className="text-xs font-bold text-neutral-900 dark:text-white uppercase tracking-wider">
                التسلسل الزمني للمناصب والتكليفات (Career Timeline)
              </h3>
              <p className="text-xs text-neutral-400 mt-0.5">
                سجل تاريخي دقيق لكافة ترقيات وتكليفات وانتقالات الموظف عبر الأقسام والمسميات الوظيفية
              </p>
            </div>

            <div className="relative border-r-2 border-neutral-200 dark:border-neutral-800 pr-6 space-y-6 my-4">
              {employee.positions?.map((pos, idx) => {
                const isActive = pos.status === 'active';

                return (
                  <div key={pos.id} className="relative group">
                    {/* Timeline Node */}
                    <div
                      className={`absolute -right-[31px] top-1 w-4 h-4 rounded-full border-2 bg-white dark:bg-neutral-900 ${
                        isActive ? 'border-indigo-600 ring-4 ring-indigo-50 dark:ring-indigo-950' : 'border-neutral-400'
                      }`}
                    />

                    <div className="p-4 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-850/50 hover:bg-neutral-50 transition-colors">
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <div className="flex items-center gap-2">
                            <h4 className="text-xs font-bold text-neutral-900 dark:text-white">
                              {pos.job_title_name}
                            </h4>
                            {isActive && (
                              <span className="px-2 py-0.2 rounded text-[10px] font-semibold bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                                المنصب الحالي
                              </span>
                            )}
                          </div>
                          <p className="text-[11px] text-neutral-500 mt-0.5">
                            القسم: {pos.department_name} · نوع التوظيف: {pos.employment_type}
                          </p>
                        </div>

                        <span className="text-[11px] font-mono text-neutral-400 tabular-nums">
                          {pos.start_date} {pos.end_date ? `إلى ${pos.end_date}` : '– حتى الآن'}
                        </span>
                      </div>

                      {pos.notes && (
                        <p className="text-xs text-neutral-600 dark:text-neutral-400 mt-2 pt-2 border-t border-neutral-200/60 dark:border-neutral-700/60">
                          ملاحظات القرار: {pos.notes}
                        </p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Skills Tab */}
        {activeTab === 'skills' && (
          <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl p-5">
            <h3 className="text-xs font-bold text-neutral-900 dark:text-white uppercase tracking-wider mb-4">
              المهارات المعتمدة وخبرات العمل
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
              {employee.skills?.map((sk) => (
                <div
                  key={sk.id}
                  className="p-3.5 rounded-xl border border-neutral-200 dark:border-neutral-800 flex items-start justify-between"
                >
                  <div>
                    <h4 className="text-xs font-bold text-neutral-900 dark:text-white">{sk.skill_name}</h4>
                    <p className="text-[11px] text-neutral-400 mt-0.5">{sk.category}</p>
                    <div className="flex items-center gap-2 mt-2 text-[11px] text-neutral-600 dark:text-neutral-400">
                      <span className="capitalize font-medium">{sk.proficiency_level}</span>
                      <span aria-hidden="true">·</span>
                      <span className="tabular-nums">{sk.years_of_experience} سنوات خبرة</span>
                    </div>
                  </div>
                  {sk.is_verified && (
                    <span className="text-[10px] text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded font-medium border border-emerald-200">
                      معتمد
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tasks Tab */}
        {activeTab === 'tasks' && (
          <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl p-5">
            <h3 className="text-xs font-bold text-neutral-900 dark:text-white uppercase tracking-wider mb-4">
              المهام التشغيلية المرتبطة بمناصب الموظف
            </h3>
            {employeeTasks.length > 0 ? (
              <div className="space-y-3">
                {employeeTasks.map((t) => (
                  <div
                    key={t.id}
                    className="p-3 rounded-lg border border-neutral-100 dark:border-neutral-800 flex items-center justify-between"
                  >
                    <div>
                      <h4 className="text-xs font-bold text-neutral-900 dark:text-white">{t.title}</h4>
                      <p className="text-[11px] text-neutral-400">{t.project_name} · المهارة: {t.skill_name}</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <StatusBadge status={t.status} />
                      <span className="text-xs font-mono tabular-nums text-neutral-400">{t.estimated_hours} س</span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-neutral-400 py-6 text-center">لا توجد مهام مسندة حالياً للموظف.</p>
            )}
          </div>
        )}

        {/* Documents Tab */}
        {activeTab === 'documents' && (
          <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl p-5">
            <h3 className="text-xs font-bold text-neutral-900 dark:text-white uppercase tracking-wider mb-4">
              الوثائق الثبوتية والشهادات الرسمية
            </h3>
            <div className="space-y-3">
              {employee.documents?.map((doc) => (
                <div
                  key={doc.id}
                  className="p-3.5 rounded-xl border border-neutral-200 dark:border-neutral-800 flex items-center justify-between"
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-neutral-100 dark:bg-neutral-800 text-neutral-500">
                      <FileText className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-neutral-900 dark:text-white">{doc.title}</h4>
                      <p className="text-[11px] text-neutral-400 font-mono">
                        {doc.file_name} · {doc.file_size_kb} KB
                      </p>
                    </div>
                  </div>
                  <span className="text-[11px] font-medium text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded border border-emerald-200">
                    وثيقة سارية وموثقة
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Contracts Tab */}
        {activeTab === 'contracts' && (
          <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl p-5">
            <h3 className="text-xs font-bold text-neutral-900 dark:text-white uppercase tracking-wider mb-4">
              عقود العمل الرسمية والشروط القانونية
            </h3>
            <div className="space-y-3">
              {employee.contracts?.map((c) => (
                <div
                  key={c.id}
                  className="p-4 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-850/50"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <span className="text-[11px] text-indigo-600 font-semibold block uppercase">
                        عقد توظيف {c.contract_type}
                      </span>
                      <h4 className="text-sm font-bold text-neutral-900 dark:text-white mt-1">
                        الراتب الإجمالي: {c.salary.toLocaleString()} {c.currency}
                      </h4>
                      <p className="text-xs text-neutral-500 mt-1">{c.terms}</p>
                    </div>
                    <span className="text-xs font-mono text-neutral-400">
                      من {c.start_date} إلى {c.end_date || 'غير محدد'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
