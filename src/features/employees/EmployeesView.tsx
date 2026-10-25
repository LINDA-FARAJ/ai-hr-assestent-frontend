import React, { useState, useEffect } from 'react';
import {
  Users,
  Search,
  Plus,
  Filter,
  Eye,
  Mail,
  Phone,
  Briefcase,
  Building2,
  Calendar,
} from 'lucide-react';
import { useTranslation } from '../../i18n/LanguageContext';
import { apiService } from '../../services/api';
import { Employee, Department, JobTitle } from '../../types';
import { EmployeeAvatar } from '../../components/ui/EmployeeAvatar';
import { StatusBadge } from '../../components/ui/Badge';
import { Modal } from '../../components/ui/Modal';

interface EmployeesViewProps {
  onSelectEmployee: (employeeId: number) => void;
}

export const EmployeesView: React.FC<EmployeesViewProps> = ({ onSelectEmployee }) => {
  const { t, isRtl } = useTranslation();
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [jobTitles, setJobTitles] = useState<JobTitle[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDept, setSelectedDept] = useState<string>('all');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // Form states for new employee
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [deptName, setDeptName] = useState('');
  const [titleName, setTitleName] = useState('');
  const [bio, setBio] = useState('');

  useEffect(() => {
    async function load() {
      const [empList, deptList, titlesList] = await Promise.all([
        apiService.getEmployees(),
        apiService.getDepartments(),
        apiService.getJobTitles(),
      ]);
      setEmployees(empList);
      setDepartments(deptList);
      setJobTitles(titlesList);
    }
    load();
  }, []);

  const handleCreateEmployee = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!firstName || !lastName || !email) return;

    const newEmp = await apiService.createEmployee({
      first_name: firstName,
      last_name: lastName,
      email,
      phone,
      department_name: deptName || departments[0]?.name,
      job_title_name: titleName || jobTitles[0]?.title,
      bio,
    });

    setEmployees([...employees, newEmp]);
    setIsAddModalOpen(false);
    // Reset form
    setFirstName('');
    setLastName('');
    setEmail('');
    setPhone('');
    setBio('');
  };

  const filtered = employees.filter((emp) => {
    const fullName = `${emp.first_name} ${emp.last_name}`.toLowerCase();
    const matchesSearch =
      fullName.includes(searchTerm.toLowerCase()) ||
      emp.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      emp.employee_code.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesDept = selectedDept === 'all' || emp.department_name === selectedDept;
    return matchesSearch && matchesDept;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-neutral-200 dark:border-neutral-800">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-neutral-900 dark:text-white tracking-tight">
            {t.employees.title}
          </h1>
          <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1 max-w-2xl leading-relaxed">
            {t.employees.subtitle}
          </p>
        </div>

        <button
          onClick={() => setIsAddModalOpen(true)}
          className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-xs transition-colors shrink-0"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>{t.employees.createEmployee}</span>
        </button>
      </div>

      {/* Search & Filter Toolbar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 p-3 rounded-xl shadow-xs">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 absolute top-1/2 -translate-y-1/2 text-neutral-400 right-3 ltr:left-3 ltr:right-auto" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder={isRtl ? 'بحث بالاسم، البريد، أو الرقم الوظيفي...' : 'Search by name, email, or code...'}
            className="w-full text-xs pl-3 pr-9 ltr:pl-9 ltr:pr-3 py-2 bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg outline-none focus:border-indigo-500 text-neutral-900 dark:text-white"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Filter className="w-3.5 h-3.5 text-neutral-400 shrink-0" />
          <select
            value={selectedDept}
            onChange={(e) => setSelectedDept(e.target.value)}
            className="text-xs px-3 py-2 bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg outline-none text-neutral-700 dark:text-neutral-300"
          >
            <option value="all">{isRtl ? 'كافة الأقسام' : 'All Departments'}</option>
            {departments.map((d) => (
              <option key={d.id} value={d.name}>
                {d.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Employees Directory Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((emp) => (
          <div
            key={emp.id}
            onClick={() => onSelectEmployee(emp.id)}
            className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 hover:border-neutral-300 dark:hover:border-neutral-700 rounded-xl p-4 transition-all cursor-pointer group flex flex-col justify-between"
          >
            <div>
              <div className="flex items-start justify-between gap-3 mb-3">
                <div className="flex items-center gap-3">
                  <EmployeeAvatar name={`${emp.first_name} ${emp.last_name}`} size="md" />
                  <div>
                    <h3 className="text-xs font-bold text-neutral-900 dark:text-white group-hover:text-indigo-600 transition-colors">
                      {emp.first_name} {emp.last_name}
                    </h3>
                    <p className="text-[11px] text-neutral-400 font-mono">{emp.employee_code}</p>
                  </div>
                </div>
                <StatusBadge status={emp.status} />
              </div>

              <div className="space-y-1.5 py-2 text-xs border-t border-neutral-100 dark:border-neutral-800">
                <div className="flex items-center gap-2 text-neutral-600 dark:text-neutral-400">
                  <Briefcase className="w-3.5 h-3.5 text-neutral-400 shrink-0" />
                  <span className="truncate">{emp.job_title_name}</span>
                </div>
                <div className="flex items-center gap-2 text-neutral-600 dark:text-neutral-400">
                  <Building2 className="w-3.5 h-3.5 text-neutral-400 shrink-0" />
                  <span className="truncate">{emp.department_name}</span>
                </div>
                <div className="flex items-center gap-2 text-neutral-500 text-[11px]">
                  <Mail className="w-3.5 h-3.5 text-neutral-400 shrink-0" />
                  <span className="truncate font-mono">{emp.email}</span>
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-neutral-100 dark:border-neutral-800 flex items-center justify-between text-[11px] text-neutral-400">
              <span className="tabular-nums">
                {emp.remaining_weekly_capacity_hours ?? 40} {t.common.hours} {isRtl ? 'متاحة' : 'available'}
              </span>
              <span className="text-indigo-600 dark:text-indigo-400 font-semibold group-hover:underline">
                {isRtl ? 'عرض الملف والتاريخ ←' : 'View Profile →'}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Add Employee Structured Modal */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title={t.employees.createEmployee}
        description={isRtl ? 'إضافة سجل موظف جديد وتعيين المنصب المؤسسي' : 'Create new employee record and position assignment'}
        maxWidth="2xl"
      >
        <form onSubmit={handleCreateEmployee} className="space-y-4 text-xs">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="font-medium text-neutral-700 dark:text-neutral-300 block mb-1">
                الاسم الأول *
              </label>
              <input
                type="text"
                required
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                className="w-full px-3 py-2 bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg outline-none"
              />
            </div>
            <div>
              <label className="font-medium text-neutral-700 dark:text-neutral-300 block mb-1">
                اسم العائلة *
              </label>
              <input
                type="text"
                required
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                className="w-full px-3 py-2 bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="font-medium text-neutral-700 dark:text-neutral-300 block mb-1">
                البريد الإلكتروني المهني *
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3 py-2 bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg outline-none"
              />
            </div>
            <div>
              <label className="font-medium text-neutral-700 dark:text-neutral-300 block mb-1">
                رقم الجوال
              </label>
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+966 5x xxx xxxx"
                className="w-full px-3 py-2 bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="font-medium text-neutral-700 dark:text-neutral-300 block mb-1">
                القسم التابع له
              </label>
              <select
                value={deptName}
                onChange={(e) => setDeptName(e.target.value)}
                className="w-full px-3 py-2 bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg outline-none"
              >
                {departments.map((d) => (
                  <option key={d.id} value={d.name}>
                    {d.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="font-medium text-neutral-700 dark:text-neutral-300 block mb-1">
                المسمى الوظيفي
              </label>
              <select
                value={titleName}
                onChange={(e) => setTitleName(e.target.value)}
                className="w-full px-3 py-2 bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg outline-none"
              >
                {jobTitles.map((j) => (
                  <option key={j.id} value={j.title}>
                    {j.title} ({j.title_ar})
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="font-medium text-neutral-700 dark:text-neutral-300 block mb-1">
              نبذة مهنية مختصرة
            </label>
            <textarea
              rows={3}
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              className="w-full px-3 py-2 bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg outline-none"
            />
          </div>

          <div className="flex justify-end gap-2 pt-3 border-t border-neutral-100 dark:border-neutral-800">
            <button
              type="button"
              onClick={() => setIsAddModalOpen(false)}
              className="px-4 py-2 rounded-lg border border-neutral-200 dark:border-neutral-700 text-neutral-600 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800"
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
