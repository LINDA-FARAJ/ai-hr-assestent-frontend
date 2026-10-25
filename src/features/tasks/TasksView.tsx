import React, { useState, useEffect } from 'react';
import {
  CheckSquare,
  Plus,
  Search,
  Filter,
  Kanban,
  Table as TableIcon,
  GitBranch,
  Sparkles,
  Clock,
  Calendar,
  AlertCircle,
  ChevronRight,
  MoreVertical,
} from 'lucide-react';
import { useTranslation } from '../../i18n/LanguageContext';
import { apiService, repository } from '../../services/api';
import { Task, Project, Skill, Position, TaskPriority, TaskStatus } from '../../types';
import { PriorityBadge, StatusBadge } from '../../components/ui/Badge';
import { ProgressBar } from '../../components/ui/ProgressBar';
import { Modal } from '../../components/ui/Modal';
import { EmployeeAvatar } from '../../components/ui/EmployeeAvatar';

interface TasksViewProps {
  onNavigateToAi: (taskId: number) => void;
}

export const TasksView: React.FC<TasksViewProps> = ({ onNavigateToAi }) => {
  const { t, isRtl } = useTranslation();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [skills, setSkills] = useState<Skill[]>([]);
  const [positions, setPositions] = useState<Position[]>([]);
  const [viewMode, setViewMode] = useState<'kanban' | 'table' | 'hierarchy'>('kanban');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedProject, setSelectedProject] = useState<string>('all');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // New task form
  const [title, setTitle] = useState('');
  const [projectId, setProjectId] = useState<number>(1);
  const [skillId, setSkillId] = useState<number>(1);
  const [positionId, setPositionId] = useState<number | ''>('');
  const [parentTaskId, setParentTaskId] = useState<number | ''>('');
  const [priority, setPriority] = useState<TaskPriority>('medium');
  const [estimatedHours, setEstimatedHours] = useState<number>(30);
  const [description, setDescription] = useState('');
  const [plannedEndDate, setPlannedEndDate] = useState('2024-12-31');

  useEffect(() => {
    async function load() {
      const [tList, pList, sList, posList] = await Promise.all([
        apiService.getTasks(),
        apiService.getProjects(),
        apiService.getSkills(),
        apiService.getPositions(),
      ]);
      setTasks(tList);
      setProjects(pList);
      setSkills(sList);
      setPositions(posList);
    }
    load();
  }, []);

  const handleCreateTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title) return;
    const newTask = await apiService.createTask({
      title,
      project_id: Number(projectId),
      skill_id: Number(skillId),
      position_id: positionId === '' ? null : Number(positionId),
      parent_task_id: parentTaskId === '' ? null : Number(parentTaskId),
      priority,
      estimated_hours: Number(estimatedHours),
      description,
      planned_end_date: plannedEndDate,
    });
    setTasks([...tasks, newTask]);
    setIsAddModalOpen(false);
    setTitle('');
    setDescription('');
  };

  const handleStatusChange = async (taskId: number, newStatus: TaskStatus) => {
    const updated = await apiService.updateTaskStatus(taskId, newStatus);
    setTasks(tasks.map((tk) => (tk.id === taskId ? updated : tk)));
  };

  const filtered = tasks.filter((task) => {
    const matchesSearch =
      task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      task.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesProj = selectedProject === 'all' || String(task.project_id) === selectedProject;
    return matchesSearch && matchesProj;
  });

  // Kanban Columns
  const kanbanColumns: { status: TaskStatus; label: string; count: number }[] = [
    { status: 'pending', label: isRtl ? 'قيد الانتظار' : 'Pending', count: filtered.filter((t) => t.status === 'pending').length },
    { status: 'ready', label: isRtl ? 'جاهز للبدء' : 'Ready', count: filtered.filter((t) => t.status === 'ready').length },
    { status: 'in_progress', label: isRtl ? 'قيد التنفيذ' : 'In Progress', count: filtered.filter((t) => t.status === 'in_progress').length },
    { status: 'review', label: isRtl ? 'المراجعة والتدقيق' : 'Review', count: filtered.filter((t) => t.status === 'review').length },
    { status: 'completed', label: isRtl ? 'مكتمل' : 'Completed', count: filtered.filter((t) => t.status === 'completed').length },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-neutral-200 dark:border-neutral-800">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-neutral-900 dark:text-white tracking-tight">
            {t.tasks.title}
          </h1>
          <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1 max-w-2xl leading-relaxed">
            {t.tasks.subtitle}
          </p>
        </div>

        <button
          onClick={() => setIsAddModalOpen(true)}
          className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-xs transition-colors shrink-0"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>{t.tasks.createTask}</span>
        </button>
      </div>

      {/* Toolbar: Views Switcher & Search */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 p-3 rounded-xl shadow-xs">
        <div className="flex items-center gap-2 w-full sm:w-auto">
          {/* View Mode Buttons */}
          <div className="flex items-center gap-1 p-1 bg-neutral-100 dark:bg-neutral-800 rounded-lg">
            <button
              onClick={() => setViewMode('kanban')}
              className={`p-1.5 rounded-md text-xs font-medium flex items-center gap-1.5 transition-colors ${
                viewMode === 'kanban'
                  ? 'bg-white dark:bg-neutral-700 text-neutral-900 dark:text-white shadow-xs'
                  : 'text-neutral-500 hover:text-neutral-900'
              }`}
              title="Kanban Board"
            >
              <Kanban className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">{t.tasks.viewKanban}</span>
            </button>
            <button
              onClick={() => setViewMode('table')}
              className={`p-1.5 rounded-md text-xs font-medium flex items-center gap-1.5 transition-colors ${
                viewMode === 'table'
                  ? 'bg-white dark:bg-neutral-700 text-neutral-900 dark:text-white shadow-xs'
                  : 'text-neutral-500 hover:text-neutral-900'
              }`}
              title="Data Table"
            >
              <TableIcon className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">{t.tasks.viewTable}</span>
            </button>
            <button
              onClick={() => setViewMode('hierarchy')}
              className={`p-1.5 rounded-md text-xs font-medium flex items-center gap-1.5 transition-colors ${
                viewMode === 'hierarchy'
                  ? 'bg-white dark:bg-neutral-700 text-neutral-900 dark:text-white shadow-xs'
                  : 'text-neutral-500 hover:text-neutral-900'
              }`}
              title="Task Hierarchy"
            >
              <GitBranch className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">{t.tasks.viewHierarchy}</span>
            </button>
          </div>

          {/* Project filter */}
          <select
            value={selectedProject}
            onChange={(e) => setSelectedProject(e.target.value)}
            className="text-xs px-3 py-1.5 bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg outline-none text-neutral-700 dark:text-neutral-300"
          >
            <option value="all">{isRtl ? 'كافة المشاريع' : 'All Projects'}</option>
            {projects.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name}
              </option>
            ))}
          </select>
        </div>

        {/* Search */}
        <div className="relative w-full sm:w-64">
          <Search className="w-4 h-4 absolute top-1/2 -translate-y-1/2 text-neutral-400 right-3 ltr:left-3 ltr:right-auto" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder={isRtl ? 'بحث في المهام...' : 'Search tasks...'}
            className="w-full text-xs pl-3 pr-9 ltr:pl-9 ltr:pr-3 py-1.5 bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg outline-none text-neutral-900 dark:text-white"
          />
        </div>
      </div>

      {/* 1. KANBAN BOARD VIEW */}
      {viewMode === 'kanban' && (
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4 items-start overflow-x-auto pb-4">
          {kanbanColumns.map((col) => {
            const columnTasks = filtered.filter((t) => t.status === col.status);

            return (
              <div
                key={col.status}
                className="bg-neutral-100/70 dark:bg-neutral-850/60 rounded-xl p-3 border border-neutral-200/80 dark:border-neutral-800 flex flex-col max-h-[750px]"
              >
                <div className="flex items-center justify-between pb-2 mb-3 border-b border-neutral-200 dark:border-neutral-750">
                  <h3 className="text-xs font-bold text-neutral-800 dark:text-neutral-200">
                    {col.label}
                  </h3>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-white dark:bg-neutral-700 text-neutral-600 dark:text-neutral-300 font-semibold tabular-nums">
                    {columnTasks.length}
                  </span>
                </div>

                <div className="space-y-3 overflow-y-auto flex-1 pr-1">
                  {columnTasks.map((task) => (
                    <div
                      key={task.id}
                      className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl p-3.5 shadow-2xs hover:border-neutral-300 dark:hover:border-neutral-700 transition-all group"
                    >
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <span className="text-[10px] font-mono text-neutral-400">
                          TASK-{task.id}
                        </span>
                        <PriorityBadge priority={task.priority} />
                      </div>

                      <h4 className="text-xs font-bold text-neutral-900 dark:text-white line-clamp-2 mb-1.5 leading-snug">
                        {task.title}
                      </h4>

                      <p className="text-[11px] text-neutral-500 line-clamp-1 mb-2">
                        {task.project_name}
                      </p>

                      {/* Required Skill */}
                      <div className="mb-2.5">
                        <span className="text-[10px] text-neutral-400 block mb-0.5">المهارة المطلوبة</span>
                        <span className="text-[11px] font-semibold text-indigo-600 dark:text-indigo-400">
                          {task.skill_name}
                        </span>
                      </div>

                      {/* Assigned Position or AI Action */}
                      <div className="pt-2 border-t border-neutral-100 dark:border-neutral-800 flex items-center justify-between text-[11px]">
                        {task.position_id ? (
                          <div className="flex items-center gap-1.5 overflow-hidden">
                            <EmployeeAvatar name={task.assigned_employee_name || 'Emp'} size="sm" />
                            <span className="truncate text-neutral-700 dark:text-neutral-300 font-medium">
                              {task.assigned_employee_name}
                            </span>
                          </div>
                        ) : (
                          <button
                            onClick={() => onNavigateToAi(task.id)}
                            className="inline-flex items-center gap-1 px-2 py-1 rounded bg-violet-50 text-violet-700 dark:bg-violet-950/60 dark:text-violet-300 font-semibold text-[10px] hover:bg-violet-100 transition-colors"
                          >
                            <Sparkles className="w-3 h-3" />
                            <span>إسناد بالذكاء</span>
                          </button>
                        )}

                        <span className="font-mono text-neutral-400 tabular-nums">
                          {task.estimated_hours} س
                        </span>
                      </div>

                      {/* Quick Move Status controls */}
                      <div className="mt-2 pt-2 border-t border-neutral-100 dark:border-neutral-800 flex items-center justify-between">
                        <select
                          value={task.status}
                          onChange={(e) => handleStatusChange(task.id, e.target.value as TaskStatus)}
                          className="text-[10px] px-1.5 py-0.5 bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded text-neutral-600 dark:text-neutral-300 outline-none"
                        >
                          <option value="pending">معلق</option>
                          <option value="ready">جاهز</option>
                          <option value="in_progress">قيد التنفيذ</option>
                          <option value="review">مراجعة</option>
                          <option value="completed">مكتمل</option>
                        </select>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* 2. TABLE VIEW */}
      {viewMode === 'table' && (
        <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-start">
              <thead className="bg-neutral-50 dark:bg-neutral-850 border-b border-neutral-200 dark:border-neutral-800 text-neutral-500 font-semibold">
                <tr>
                  <th className="px-4 py-3 text-start">المهمة والمشروع</th>
                  <th className="px-4 py-3 text-start">المهارة المطلوبة</th>
                  <th className="px-4 py-3 text-start">المنصب المسؤول</th>
                  <th className="px-4 py-3 text-start">الأولوية</th>
                  <th className="px-4 py-3 text-start">الحالة</th>
                  <th className="px-4 py-3 text-center">الساعات</th>
                  <th className="px-4 py-3 text-center">إجراء الذكاء</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100 dark:divide-neutral-800">
                {filtered.map((t) => (
                  <tr key={t.id} className="hover:bg-neutral-50/70 dark:hover:bg-neutral-800/40">
                    <td className="px-4 py-3 max-w-[240px]">
                      <div className="font-semibold text-neutral-900 dark:text-white truncate">
                        {t.title}
                      </div>
                      <div className="text-[11px] text-neutral-400 truncate">{t.project_name}</div>
                    </td>

                    <td className="px-4 py-3 text-indigo-600 dark:text-indigo-400 font-medium">
                      {t.skill_name}
                    </td>

                    <td className="px-4 py-3 text-neutral-700 dark:text-neutral-300">
                      {t.assigned_employee_name ? (
                        <div className="flex items-center gap-2">
                          <EmployeeAvatar name={t.assigned_employee_name} size="sm" />
                          <div>
                            <span className="font-medium block">{t.assigned_employee_name}</span>
                            <span className="text-[10px] text-neutral-400 block">{t.assigned_position_title}</span>
                          </div>
                        </div>
                      ) : (
                        <span className="text-amber-600 font-medium">شاغرة</span>
                      )}
                    </td>

                    <td className="px-4 py-3">
                      <PriorityBadge priority={t.priority} />
                    </td>

                    <td className="px-4 py-3">
                      <StatusBadge status={t.status} />
                    </td>

                    <td className="px-4 py-3 text-center font-mono tabular-nums text-neutral-500">
                      {t.estimated_hours} س
                    </td>

                    <td className="px-4 py-3 text-center">
                      <button
                        onClick={() => onNavigateToAi(t.id)}
                        className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-violet-50 text-violet-700 dark:bg-violet-950/50 dark:text-violet-300 hover:bg-violet-100 text-xs font-semibold border border-violet-200 dark:border-violet-800 transition-colors"
                      >
                        <Sparkles className="w-3.5 h-3.5" />
                        <span>تقييم Groq</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 3. HIERARCHY VIEW */}
      {viewMode === 'hierarchy' && (
        <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl p-5 space-y-4">
          <p className="text-xs text-neutral-500">
            {isRtl
              ? 'عرض التسلسل الهرمي للمهام الرئيسية والمهام التابعة عبر حقل parent_task_id:'
              : 'Parent-child task breakdown based on parent_task_id structure:'}
          </p>

          <div className="space-y-4">
            {/* Root Tasks (parent_task_id is null) */}
            {filtered
              .filter((t) => !t.parent_task_id)
              .map((parent) => {
                const childTasks = filtered.filter((c) => c.parent_task_id === parent.id);

                return (
                  <div key={parent.id} className="border border-neutral-200 dark:border-neutral-800 rounded-xl p-4">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-xs text-neutral-900 dark:text-white">
                            {parent.title}
                          </span>
                          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-neutral-100 dark:bg-neutral-800 text-neutral-600">
                            مهمة رئيسية
                          </span>
                        </div>
                        <p className="text-[11px] text-neutral-400 mt-0.5">{parent.project_name} · المهارة: {parent.skill_name}</p>
                      </div>
                      <StatusBadge status={parent.status} />
                    </div>

                    {/* Children List */}
                    {childTasks.length > 0 && (
                      <div className="mt-3 pt-3 border-t border-neutral-100 dark:border-neutral-800 space-y-2 pr-4 border-r-2 border-indigo-200 dark:border-indigo-800">
                        {childTasks.map((child) => (
                          <div
                            key={child.id}
                            className="p-2.5 rounded-lg bg-neutral-50 dark:bg-neutral-850 flex items-center justify-between text-xs"
                          >
                            <div>
                              <span className="font-medium text-neutral-800 dark:text-neutral-200">{child.title}</span>
                              <span className="text-[10px] text-neutral-400 block mt-0.5">
                                المهارة: {child.skill_name} · المسؤول: {child.assigned_employee_name || 'شاغرة'}
                              </span>
                            </div>
                            <StatusBadge status={child.status} />
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
          </div>
        </div>
      )}

      {/* Add Task Modal */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title={t.tasks.createTask}
        description={isRtl ? 'إنشاء مهمة جديدة وتحديد المهارة والمنصب والتبعية' : 'Create new project task'}
        maxWidth="2xl"
      >
        <form onSubmit={handleCreateTask} className="space-y-4 text-xs">
          <div>
            <label className="font-medium text-neutral-700 dark:text-neutral-300 block mb-1">
              عنوان المهمة *
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="مثال: تطوير وحدة التوثيق الآمن عبر Laravel Sanctum"
              className="w-full px-3 py-2 bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg outline-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="font-medium text-neutral-700 dark:text-neutral-300 block mb-1">
                المشروع التابع له *
              </label>
              <select
                value={projectId}
                onChange={(e) => setProjectId(Number(e.target.value))}
                className="w-full px-3 py-2 bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg outline-none"
              >
                {projects.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="font-medium text-neutral-700 dark:text-neutral-300 block mb-1">
                المهارة المطلوبة (skill_id) *
              </label>
              <select
                value={skillId}
                onChange={(e) => setSkillId(Number(e.target.value))}
                className="w-full px-3 py-2 bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg outline-none"
              >
                {skills.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name} ({s.category})
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="font-medium text-neutral-700 dark:text-neutral-300 block mb-1">
                المنصب المسؤول (position_id)
              </label>
              <select
                value={positionId}
                onChange={(e) => setPositionId(e.target.value === '' ? '' : Number(e.target.value))}
                className="w-full px-3 py-2 bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg outline-none"
              >
                <option value="">تركها شاغرة (لإسنادها لاحقاً بالذكاء الاصطناعي)</option>
                {positions.map((pos) => (
                  <option key={pos.id} value={pos.id}>
                    {pos.employee_name} ({pos.job_title_name} - {pos.department_name})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="font-medium text-neutral-700 dark:text-neutral-300 block mb-1">
                المهمة الأب (إن وجدت)
              </label>
              <select
                value={parentTaskId}
                onChange={(e) => setParentTaskId(e.target.value === '' ? '' : Number(e.target.value))}
                className="w-full px-3 py-2 bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg outline-none"
              >
                <option value="">مهمة رئيسية مستقلة (لا يوجد أب)</option>
                {tasks
                  .filter((t) => t.project_id === Number(projectId))
                  .map((t) => (
                    <option key={t.id} value={t.id}>
                      {t.title}
                    </option>
                  ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
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
            <div>
              <label className="font-medium text-neutral-700 dark:text-neutral-300 block mb-1">
                الساعات التقديرية (Estimated Hours)
              </label>
              <input
                type="number"
                value={estimatedHours}
                onChange={(e) => setEstimatedHours(Number(e.target.value))}
                className="w-full px-3 py-2 bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg outline-none font-mono"
              />
            </div>
          </div>

          <div>
            <label className="font-medium text-neutral-700 dark:text-neutral-300 block mb-1">
              وصف المهمة والمتطلبات التقنية
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
