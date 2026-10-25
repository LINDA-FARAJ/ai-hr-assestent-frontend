import React, { useState, useEffect } from 'react';
import { Building2, Users, FolderKanban, Plus, Briefcase, Calendar } from 'lucide-react';
import { useTranslation } from '../../i18n/LanguageContext';
import { apiService } from '../../services/api';
import { Department } from '../../types';
import { Modal } from '../../components/ui/Modal';

export const DepartmentsView: React.FC = () => {
  const { t, isRtl } = useTranslation();
  const [departments, setDepartments] = useState<Department[]>([]);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');

  useEffect(() => {
    async function load() {
      const data = await apiService.getDepartments();
      setDepartments(data);
    }
    load();
  }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name) return;
    const newDept = await apiService.createDepartment({ name, description });
    setDepartments([...departments, newDept]);
    setIsAddModalOpen(false);
    setName('');
    setDescription('');
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-neutral-200 dark:border-neutral-800">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-neutral-900 dark:text-white tracking-tight">
            {t.departments.title}
          </h1>
          <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1 max-w-2xl leading-relaxed">
            {t.departments.subtitle}
          </p>
        </div>

        <button
          onClick={() => setIsAddModalOpen(true)}
          className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-xs transition-colors shrink-0"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>{t.departments.createDepartment}</span>
        </button>
      </div>

      {/* Departments Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {departments.map((dept) => (
          <div
            key={dept.id}
            className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl p-5 hover:border-neutral-300 dark:hover:border-neutral-700 transition-colors flex flex-col justify-between"
          >
            <div>
              <div className="flex items-start justify-between gap-3 mb-3">
                <div className="p-2.5 rounded-xl bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400">
                  <Building2 className="w-5 h-5" />
                </div>
                <span className="text-[11px] font-mono text-neutral-400">DEPT-{dept.id}</span>
              </div>

              <h3 className="text-sm font-bold text-neutral-900 dark:text-white mb-1">{dept.name}</h3>
              <p className="text-xs text-neutral-500 dark:text-neutral-400 leading-relaxed mb-4">
                {dept.description}
              </p>
            </div>

            <div className="pt-3 border-t border-neutral-100 dark:border-neutral-800 space-y-2 text-xs">
              <div className="flex items-center justify-between text-neutral-600 dark:text-neutral-400">
                <span className="flex items-center gap-1.5">
                  <Users className="w-3.5 h-3.5 text-neutral-400" />
                  <span>{t.departments.employeesCount}:</span>
                </span>
                <span className="font-semibold text-neutral-900 dark:text-white font-mono tabular-nums">
                  {dept.employee_count}
                </span>
              </div>

              <div className="flex items-center justify-between text-neutral-600 dark:text-neutral-400">
                <span className="flex items-center gap-1.5">
                  <FolderKanban className="w-3.5 h-3.5 text-neutral-400" />
                  <span>{t.departments.projectsCount}:</span>
                </span>
                <span className="font-semibold text-neutral-900 dark:text-white font-mono tabular-nums">
                  {dept.active_projects_count}
                </span>
              </div>

              {dept.manager_name && (
                <div className="flex items-center justify-between text-neutral-600 dark:text-neutral-400 pt-1">
                  <span>{t.departments.manager}:</span>
                  <span className="font-medium text-indigo-600 dark:text-indigo-400">
                    {dept.manager_name}
                  </span>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Add Department Modal */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title={t.departments.createDepartment}
        description={isRtl ? 'إضافة وحدة تنظيمية جديدة في الهيكل المؤسسي' : 'Register new department within corporate org structure'}
      >
        <form onSubmit={handleCreate} className="space-y-4 text-xs">
          <div>
            <label className="font-medium text-neutral-700 dark:text-neutral-300 block mb-1">
              اسم القسم *
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder={isRtl ? 'مثال: أمن المعلومات وحماية البيانات' : 'e.g. Information Security'}
              className="w-full px-3 py-2 bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg outline-none"
            />
          </div>

          <div>
            <label className="font-medium text-neutral-700 dark:text-neutral-300 block mb-1">
              الوصف والمهام الرئيسية
            </label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder={isRtl ? 'تحديد نطاق عمل القسم...' : 'Define core objectives...'}
              className="w-full px-3 py-2 bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg outline-none"
            />
          </div>

          <div className="flex justify-end gap-2 pt-3 border-t border-neutral-100 dark:border-neutral-800">
            <button
              type="button"
              onClick={() => setIsAddModalOpen(false)}
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
