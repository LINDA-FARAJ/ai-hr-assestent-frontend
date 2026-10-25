import React, { useState, useEffect } from 'react';
import { Briefcase, Layers, Plus, Filter, UserCheck, Calendar, Info, CheckCircle2 } from 'lucide-react';
import { useTranslation } from '../../i18n/LanguageContext';
import { apiService } from '../../services/api';
import { Position, JobTitle, Department, Employee } from '../../types';
import { EmployeeAvatar } from '../../components/ui/EmployeeAvatar';
import { StatusBadge } from '../../components/ui/Badge';
import { Modal } from '../../components/ui/Modal';

export const PositionsView: React.FC = () => {
  const { t, isRtl } = useTranslation();
  const [activeSubTab, setActiveSubTab] = useState<'positions' | 'jobTitles'>('positions');
  const [positions, setPositions] = useState<Position[]>([]);
  const [jobTitles, setJobTitles] = useState<JobTitle[]>([]);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);

  // Modals
  const [isAddPosModalOpen, setIsAddPosModalOpen] = useState(false);
  const [isAddTitleModalOpen, setIsAddTitleModalOpen] = useState(false);

  // Position form state
  const [selectedEmpId, setSelectedEmpId] = useState<number>(101);
  const [selectedDeptId, setSelectedDeptId] = useState<number>(1);
  const [selectedTitleId, setSelectedTitleId] = useState<number>(1);
  const [empType, setEmpType] = useState<'full_time' | 'part_time' | 'contract' | 'remote'>('full_time');
  const [isPrimary, setIsPrimary] = useState(true);
  const [startDate, setStartDate] = useState(new Date().toISOString().substring(0, 10));
  const [notes, setNotes] = useState('');

  // Title form state
  const [titleName, setTitleName] = useState('');
  const [titleNameAr, setTitleNameAr] = useState('');
  const [titleLevel, setTitleLevel] = useState<'junior' | 'mid' | 'senior' | 'lead' | 'principal'>('senior');
  const [titleDesc, setTitleDesc] = useState('');

  useEffect(() => {
    async function load() {
      const [posList, titleList, empList, deptList] = await Promise.all([
        apiService.getPositions(),
        apiService.getJobTitles(),
        apiService.getEmployees(),
        apiService.getDepartments(),
      ]);
      setPositions(posList);
      setJobTitles(titleList);
      setEmployees(empList);
      setDepartments(deptList);
    }
    load();
  }, []);

  const handleCreatePosition = async (e: React.FormEvent) => {
    e.preventDefault();
    const newPos = await apiService.createPosition({
      employee_id: Number(selectedEmpId),
      department_id: Number(selectedDeptId),
      job_title_id: Number(selectedTitleId),
      employment_type: empType,
      is_primary: isPrimary,
      start_date: startDate,
      notes,
    });
    setPositions([...positions, newPos]);
    setIsAddPosModalOpen(false);
    setNotes('');
  };

  const handleCreateJobTitle = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!titleName) return;
    const newTitle = await apiService.createJobTitle({
      title: titleName,
      title_ar: titleNameAr || titleName,
      level: titleLevel,
      description: titleDesc,
    });
    setJobTitles([...jobTitles, newTitle]);
    setIsAddTitleModalOpen(false);
    setTitleName('');
    setTitleNameAr('');
    setTitleDesc('');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-neutral-200 dark:border-neutral-800">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-neutral-900 dark:text-white tracking-tight">
            {activeSubTab === 'positions' ? t.positions.title : t.jobTitles.title}
          </h1>
          <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1 max-w-2xl leading-relaxed">
            {activeSubTab === 'positions' ? t.positions.subtitle : t.jobTitles.subtitle}
          </p>
        </div>

        <div className="flex items-center gap-2">
          {activeSubTab === 'positions' ? (
            <button
              onClick={() => setIsAddPosModalOpen(true)}
              className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-xs transition-colors shrink-0"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>{t.positions.createPosition}</span>
            </button>
          ) : (
            <button
              onClick={() => setIsAddTitleModalOpen(true)}
              className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-xs transition-colors shrink-0"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>{t.jobTitles.createJobTitle}</span>
            </button>
          )}
        </div>
      </div>

      {/* Conceptual Distinction Callout Banner */}
      <div className="p-3.5 rounded-xl bg-blue-50/60 dark:bg-blue-950/30 border border-blue-200/80 dark:border-blue-900/40 text-xs text-neutral-600 dark:text-neutral-400 flex items-start gap-3">
        <Info className="w-4 h-4 text-blue-600 dark:text-blue-400 shrink-0 mt-0.5" />
        <div className="leading-relaxed">
          <span className="font-semibold text-neutral-900 dark:text-white">
            {isRtl ? 'القاعدة البنيوية لإسناد المهام:' : 'Structural Task Assignment Model:'}
          </span>{' '}
          {isRtl
            ? 'ترتبط كل مهمة في النظام بحقل position_id (المنصب الفعلي)، حيث يحدد المنصب الموظف المكلف والقسم والمسمى الوظيفي في فترة زمنية محددة. المسمى الوظيفي هو توصيف للدور المهني، بينما المنصب هو التعيين التشغيلي الفعلي.'
            : 'Tasks are explicitly linked via position_id. A position assigns an employee to a department and job title over a time period, creating an authoritative record of accountability.'}
        </div>
      </div>

      {/* Sub Tabs */}
      <div className="flex items-center gap-2 border-b border-neutral-200 dark:border-neutral-800">
        <button
          onClick={() => setActiveSubTab('positions')}
          className={`px-4 py-2 text-xs font-semibold border-b-2 transition-colors ${
            activeSubTab === 'positions'
              ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400'
              : 'border-transparent text-neutral-500 hover:text-neutral-900 dark:hover:text-white'
          }`}
        >
          {isRtl ? `المناصب الوظيفية المعتمدة (${positions.length})` : `Active Positions (${positions.length})`}
        </button>
        <button
          onClick={() => setActiveSubTab('jobTitles')}
          className={`px-4 py-2 text-xs font-semibold border-b-2 transition-colors ${
            activeSubTab === 'jobTitles'
              ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400'
              : 'border-transparent text-neutral-500 hover:text-neutral-900 dark:hover:text-white'
          }`}
        >
          {isRtl ? `دليل المسميات والرتب (${jobTitles.length})` : `Job Titles Catalog (${jobTitles.length})`}
        </button>
      </div>

      {/* POSITIONS TAB CONTENT */}
      {activeSubTab === 'positions' && (
        <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-start">
              <thead className="bg-neutral-50 dark:bg-neutral-850 border-b border-neutral-200 dark:border-neutral-800 text-neutral-500 font-semibold">
                <tr>
                  <th className="px-4 py-3 text-start">معرّف المنصب</th>
                  <th className="px-4 py-3 text-start">الموظف المعيّن</th>
                  <th className="px-4 py-3 text-start">المسمى الوظيفي</th>
                  <th className="px-4 py-3 text-start">القسم</th>
                  <th className="px-4 py-3 text-start">نوع التوظيف</th>
                  <th className="px-4 py-3 text-start">الفترة والتاريخ</th>
                  <th className="px-4 py-3 text-start">الحالة</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100 dark:divide-neutral-800">
                {positions.map((pos) => (
                  <tr key={pos.id} className="hover:bg-neutral-50/70 dark:hover:bg-neutral-800/40">
                    <td className="px-4 py-3 font-mono text-[11px] text-neutral-400">
                      POS-{pos.id}
                      {pos.is_primary && (
                        <span className="block text-[10px] text-indigo-600 font-medium">رئيسي</span>
                      )}
                    </td>

                    <td className="px-4 py-3 whitespace-nowrap">
                      <div className="flex items-center gap-2.5">
                        <EmployeeAvatar name={pos.employee_name || 'Emp'} size="sm" />
                        <span className="font-semibold text-neutral-900 dark:text-white">
                          {pos.employee_name}
                        </span>
                      </div>
                    </td>

                    <td className="px-4 py-3 whitespace-nowrap font-medium text-neutral-800 dark:text-neutral-200">
                      {pos.job_title_name}
                    </td>

                    <td className="px-4 py-3 whitespace-nowrap text-neutral-500">
                      {pos.department_name}
                    </td>

                    <td className="px-4 py-3 whitespace-nowrap capitalize text-neutral-600 dark:text-neutral-400">
                      {pos.employment_type}
                    </td>

                    <td className="px-4 py-3 whitespace-nowrap font-mono text-[11px] text-neutral-400 tabular-nums">
                      {pos.start_date} {pos.end_date ? `إلى ${pos.end_date}` : '– مستمر'}
                    </td>

                    <td className="px-4 py-3 whitespace-nowrap">
                      <StatusBadge status={pos.status} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* JOB TITLES TAB CONTENT */}
      {activeSubTab === 'jobTitles' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {jobTitles.map((jt) => (
            <div
              key={jt.id}
              className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl p-5 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between gap-3 mb-2">
                  <h3 className="text-sm font-bold text-neutral-900 dark:text-white">{jt.title}</h3>
                  <span className="px-2 py-0.5 rounded text-[10px] font-semibold uppercase bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-300">
                    {jt.level}
                  </span>
                </div>
                {jt.title_ar && (
                  <p className="text-xs font-medium text-indigo-600 dark:text-indigo-400 mb-2">
                    {jt.title_ar}
                  </p>
                )}
                <p className="text-xs text-neutral-500 dark:text-neutral-400 leading-relaxed">
                  {jt.description}
                </p>
              </div>

              <div className="pt-3 border-t border-neutral-100 dark:border-neutral-800 mt-4 flex items-center justify-between text-[11px] text-neutral-400 font-mono">
                <span>TITLE-0{jt.id}</span>
                <span>معتمد في الهيكل</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add Position Modal */}
      <Modal
        isOpen={isAddPosModalOpen}
        onClose={() => setIsAddPosModalOpen(false)}
        title={t.positions.createPosition}
        description={isRtl ? 'ربط موظف بقسم ومسمى وظيفي رسمي' : 'Assign employee to department and job title'}
      >
        <form onSubmit={handleCreatePosition} className="space-y-4 text-xs">
          <div>
            <label className="font-medium text-neutral-700 dark:text-neutral-300 block mb-1">
              الموظف *
            </label>
            <select
              value={selectedEmpId}
              onChange={(e) => setSelectedEmpId(Number(e.target.value))}
              className="w-full px-3 py-2 bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg outline-none"
            >
              {employees.map((emp) => (
                <option key={emp.id} value={emp.id}>
                  {emp.first_name} {emp.last_name} ({emp.employee_code})
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="font-medium text-neutral-700 dark:text-neutral-300 block mb-1">
                القسم *
              </label>
              <select
                value={selectedDeptId}
                onChange={(e) => setSelectedDeptId(Number(e.target.value))}
                className="w-full px-3 py-2 bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg outline-none"
              >
                {departments.map((d) => (
                  <option key={d.id} value={d.id}>
                    {d.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="font-medium text-neutral-700 dark:text-neutral-300 block mb-1">
                المسمى الوظيفي *
              </label>
              <select
                value={selectedTitleId}
                onChange={(e) => setSelectedTitleId(Number(e.target.value))}
                className="w-full px-3 py-2 bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg outline-none"
              >
                {jobTitles.map((jt) => (
                  <option key={jt.id} value={jt.id}>
                    {jt.title} ({jt.title_ar})
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="font-medium text-neutral-700 dark:text-neutral-300 block mb-1">
                نوع التوظيف
              </label>
              <select
                value={empType}
                onChange={(e) => setEmpType(e.target.value as any)}
                className="w-full px-3 py-2 bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg outline-none"
              >
                <option value="full_time">دوام كامل (Full-Time)</option>
                <option value="part_time">دوام جزئي (Part-Time)</option>
                <option value="contract">تعاقد مستقل (Contract)</option>
                <option value="remote">عمل عن بعد (Remote)</option>
              </select>
            </div>
            <div>
              <label className="font-medium text-neutral-700 dark:text-neutral-300 block mb-1">
                تاريخ بدء المنصب
              </label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full px-3 py-2 bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg outline-none"
              />
            </div>
          </div>

          <div>
            <label className="font-medium text-neutral-700 dark:text-neutral-300 block mb-1">
              ملاحظات القرار
            </label>
            <input
              type="text"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="مثال: ترقية داخلية أو تكليف إشرافي"
              className="w-full px-3 py-2 bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg outline-none"
            />
          </div>

          <div className="flex justify-end gap-2 pt-3 border-t border-neutral-100 dark:border-neutral-800">
            <button
              type="button"
              onClick={() => setIsAddPosModalOpen(false)}
              className="px-4 py-2 rounded-lg border border-neutral-200 dark:border-neutral-700 text-neutral-600 hover:bg-neutral-100"
            >
              {t.common.cancel}
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-medium"
            >
              {t.common.save}
            </button>
          </div>
        </form>
      </Modal>

      {/* Add Job Title Modal */}
      <Modal
        isOpen={isAddTitleModalOpen}
        onClose={() => setIsAddTitleModalOpen(false)}
        title={t.jobTitles.createJobTitle}
        description={isRtl ? 'إضافة مسمى وظيفي قياسي لدليل الشركة' : 'Create standardized organizational role title'}
      >
        <form onSubmit={handleCreateJobTitle} className="space-y-4 text-xs">
          <div>
            <label className="font-medium text-neutral-700 dark:text-neutral-300 block mb-1">
              المسمى المهني (English) *
            </label>
            <input
              type="text"
              required
              value={titleName}
              onChange={(e) => setTitleName(e.target.value)}
              placeholder="e.g. Lead Cloud Security Engineer"
              className="w-full px-3 py-2 bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg outline-none"
            />
          </div>

          <div>
            <label className="font-medium text-neutral-700 dark:text-neutral-300 block mb-1">
              المسمى بالعربية
            </label>
            <input
              type="text"
              value={titleNameAr}
              onChange={(e) => setTitleNameAr(e.target.value)}
              placeholder="مثال: كبير مهندسي أمن السحابة"
              className="w-full px-3 py-2 bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg outline-none"
            />
          </div>

          <div>
            <label className="font-medium text-neutral-700 dark:text-neutral-300 block mb-1">
              المستوى والرتبة المهنية
            </label>
            <select
              value={titleLevel}
              onChange={(e) => setTitleLevel(e.target.value as any)}
              className="w-full px-3 py-2 bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg outline-none"
            >
              <option value="junior">Junior (مبتدئ)</option>
              <option value="mid">Mid-Level (متوسط)</option>
              <option value="senior">Senior (أول / متقدم)</option>
              <option value="lead">Lead (قائد فريق)</option>
              <option value="principal">Principal (رئيسي / خبير استشاري)</option>
            </select>
          </div>

          <div>
            <label className="font-medium text-neutral-700 dark:text-neutral-300 block mb-1">
              الوصف الوظيفي والمسؤوليات
            </label>
            <textarea
              rows={3}
              value={titleDesc}
              onChange={(e) => setTitleDesc(e.target.value)}
              className="w-full px-3 py-2 bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg outline-none"
            />
          </div>

          <div className="flex justify-end gap-2 pt-3 border-t border-neutral-100 dark:border-neutral-800">
            <button
              type="button"
              onClick={() => setIsAddTitleModalOpen(false)}
              className="px-4 py-2 rounded-lg border border-neutral-200 dark:border-neutral-700 text-neutral-600 hover:bg-neutral-100"
            >
              {t.common.cancel}
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-medium"
            >
              {t.common.save}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
