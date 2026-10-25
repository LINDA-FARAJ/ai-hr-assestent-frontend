import React, { useState, useEffect } from 'react';
import { FolderKanban, Plus, Search, Filter, Calendar, DollarSign, Clock, CheckSquare } from 'lucide-react';
import { useTranslation } from '../../i18n/LanguageContext';
import { apiService } from '../../services/api';
import { Project, Client, ProjectPriority, ProjectStatus } from '../../types';
import { PriorityBadge, StatusBadge } from '../../components/ui/Badge';
import { ProgressBar } from '../../components/ui/ProgressBar';
import { Modal } from '../../components/ui/Modal';

interface ProjectsViewProps {
  onSelectProject: (projectId: number) => void;
}

export const ProjectsView: React.FC<ProjectsViewProps> = ({ onSelectProject }) => {
  const { t, isRtl } = useTranslation();
  const [projects, setProjects] = useState<Project[]>([]);
  const [clients, setClients] = useState<Client[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // Form
  const [name, setName] = useState('');
  const [clientId, setClientId] = useState<number>(1);
  const [description, setDescription] = useState('');
  const [budget, setBudget] = useState<number>(450000);
  const [priority, setPriority] = useState<ProjectPriority>('high');
  const [plannedStartDate, setPlannedStartDate] = useState(new Date().toISOString().substring(0, 10));
  const [plannedEndDate, setPlannedEndDate] = useState('2024-12-31');
  const [estimatedHours, setEstimatedHours] = useState<number>(1200);

  useEffect(() => {
    async function load() {
      const [projList, clientList] = await Promise.all([
        apiService.getProjects(),
        apiService.getClients(),
      ]);
      setProjects(projList);
      setClients(clientList);
    }
    load();
  }, []);

  const handleCreateProject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name) return;
    const newProj = await apiService.createProject({
      name,
      client_id: Number(clientId),
      description,
      budget: Number(budget),
      priority,
      planned_start_date: plannedStartDate,
      planned_end_date: plannedEndDate,
      estimated_hours: Number(estimatedHours),
    });
    setProjects([...projects, newProj]);
    setIsAddModalOpen(false);
    setName('');
    setDescription('');
  };

  const filtered = projects.filter((p) => {
    const matchesSearch =
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (p.client_name && p.client_name.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesStatus = selectedStatus === 'all' || p.status === selectedStatus;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-neutral-200 dark:border-neutral-800">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-neutral-900 dark:text-white tracking-tight">
            {t.projects.title}
          </h1>
          <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1 max-w-2xl leading-relaxed">
            {t.projects.subtitle}
          </p>
        </div>

        <button
          onClick={() => setIsAddModalOpen(true)}
          className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-xs transition-colors shrink-0"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>{t.projects.createProject}</span>
        </button>
      </div>

      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 p-3 rounded-xl shadow-xs">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 absolute top-1/2 -translate-y-1/2 text-neutral-400 right-3 ltr:left-3 ltr:right-auto" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder={isRtl ? 'بحث في المشاريع أو العملاء...' : 'Search projects...'}
            className="w-full text-xs pl-3 pr-9 ltr:pl-9 ltr:pr-3 py-2 bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg outline-none text-neutral-900 dark:text-white"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Filter className="w-3.5 h-3.5 text-neutral-400 shrink-0" />
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="text-xs px-3 py-2 bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg outline-none text-neutral-700 dark:text-neutral-300"
          >
            <option value="all">{isRtl ? 'كافة حالات المشاريع' : 'All Statuses'}</option>
            <option value="in_progress">قيد التنفيذ (In Progress)</option>
            <option value="planning">مرحلة التخطيط (Planning)</option>
            <option value="completed">مكتمل (Completed)</option>
            <option value="on_hold">معلق (On Hold)</option>
          </select>
        </div>
      </div>

      {/* Projects Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {filtered.map((proj) => (
          <div
            key={proj.id}
            onClick={() => onSelectProject(proj.id)}
            className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 hover:border-neutral-300 dark:hover:border-neutral-700 rounded-xl p-5 transition-all cursor-pointer group flex flex-col justify-between"
          >
            <div>
              <div className="flex items-start justify-between gap-3 mb-2">
                <span className="text-[11px] font-mono text-neutral-400">
                  PRJ-{proj.id} · {proj.client_name}
                </span>
                <div className="flex items-center gap-1.5">
                  <PriorityBadge priority={proj.priority} />
                  <StatusBadge status={proj.status} />
                </div>
              </div>

              <h3 className="text-sm font-bold text-neutral-900 dark:text-white group-hover:text-indigo-600 transition-colors mb-1.5">
                {proj.name}
              </h3>
              <p className="text-xs text-neutral-500 dark:text-neutral-400 leading-relaxed line-clamp-2 mb-4">
                {proj.description}
              </p>

              <div className="mb-4">
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="text-neutral-500 font-medium">نسبة الإنجاز</span>
                  <span className="font-bold font-mono tabular-nums text-neutral-900 dark:text-white">
                    {proj.progress}%
                  </span>
                </div>
                <ProgressBar progress={proj.progress} size="sm" color="indigo" />
              </div>
            </div>

            <div className="pt-3 border-t border-neutral-100 dark:border-neutral-800 grid grid-cols-3 gap-2 text-[11px] text-neutral-500">
              <div>
                <span className="text-neutral-400 block">الميزانية</span>
                <span className="font-bold text-neutral-800 dark:text-neutral-200 font-mono tabular-nums">
                  {proj.budget.toLocaleString()} ر.س
                </span>
              </div>
              <div>
                <span className="text-neutral-400 block">المهام الكلية</span>
                <span className="font-bold text-neutral-800 dark:text-neutral-200 font-mono tabular-nums">
                  {proj.tasks_count} مهمة
                </span>
              </div>
              <div>
                <span className="text-neutral-400 block">التسليم النهائي</span>
                <span className="font-bold text-neutral-800 dark:text-neutral-200 font-mono tabular-nums truncate block">
                  {proj.planned_end_date}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Add Project Modal */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title={t.projects.createProject}
        description={isRtl ? 'إنشاء مشروع تقني جديد وربطه بالعميل التعاقدي' : 'Initialize technical project'}
        maxWidth="2xl"
      >
        <form onSubmit={handleCreateProject} className="space-y-4 text-xs">
          <div>
            <label className="font-medium text-neutral-700 dark:text-neutral-300 block mb-1">
              اسم المشروع *
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="مثال: منصة التجارة الرقمية السحابية"
              className="w-full px-3 py-2 bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg outline-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="font-medium text-neutral-700 dark:text-neutral-300 block mb-1">
                العميل المتعاقد *
              </label>
              <select
                value={clientId}
                onChange={(e) => setClientId(Number(e.target.value))}
                className="w-full px-3 py-2 bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg outline-none"
              >
                {clients.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.company_name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="font-medium text-neutral-700 dark:text-neutral-300 block mb-1">
                الأولوية
              </label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value as any)}
                className="w-full px-3 py-2 bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg outline-none"
              >
                <option value="urgent">طارئة (Urgent)</option>
                <option value="high">عالية (High)</option>
                <option value="medium">متوسطة (Medium)</option>
                <option value="low">منخفضة (Low)</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="font-medium text-neutral-700 dark:text-neutral-300 block mb-1">
                الميزانية المعتمدة (ر.س)
              </label>
              <input
                type="number"
                value={budget}
                onChange={(e) => setBudget(Number(e.target.value))}
                className="w-full px-3 py-2 bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg outline-none font-mono"
              />
            </div>
            <div>
              <label className="font-medium text-neutral-700 dark:text-neutral-300 block mb-1">
                الساعات التقديرية الكلية
              </label>
              <input
                type="number"
                value={estimatedHours}
                onChange={(e) => setEstimatedHours(Number(e.target.value))}
                className="w-full px-3 py-2 bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg outline-none font-mono"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="font-medium text-neutral-700 dark:text-neutral-300 block mb-1">
                تاريخ البدء المخطط
              </label>
              <input
                type="date"
                value={plannedStartDate}
                onChange={(e) => setPlannedStartDate(e.target.value)}
                className="w-full px-3 py-2 bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg outline-none"
              />
            </div>
            <div>
              <label className="font-medium text-neutral-700 dark:text-neutral-300 block mb-1">
                تاريخ التسليم المستهدف
              </label>
              <input
                type="date"
                value={plannedEndDate}
                onChange={(e) => setPlannedEndDate(e.target.value)}
                className="w-full px-3 py-2 bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg outline-none"
              />
            </div>
          </div>

          <div>
            <label className="font-medium text-neutral-700 dark:text-neutral-300 block mb-1">
              وصف المشروع ونطاق العمل
            </label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
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
