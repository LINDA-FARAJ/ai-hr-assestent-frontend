import React, { useState, useEffect, useMemo } from 'react';
import { Search, Users, FolderKanban, CheckSquare, Building2, UserCheck, ArrowRight, X } from 'lucide-react';
import { useTranslation } from '../../i18n/LanguageContext';
import { repository } from '../../services/api';
import { ActiveTab } from './Sidebar';

interface GlobalSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (tab: ActiveTab, entityId?: number) => void;
}

export const GlobalSearchModal: React.FC<GlobalSearchModalProps> = ({
  isOpen,
  onClose,
  onNavigate,
}) => {
  const { t, isRtl } = useTranslation();
  const [query, setQuery] = useState('');

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.key === '/' || (e.ctrlKey && e.key === 'k')) && !isOpen) {
        e.preventDefault();
        // Trigger can be handled in parent
      } else if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  const searchResults = useMemo(() => {
    if (!query.trim()) return [];
    const q = query.toLowerCase();

    const results: {
      type: 'employee' | 'project' | 'task' | 'department' | 'client';
      title: string;
      subtitle: string;
      tab: ActiveTab;
      id?: number;
    }[] = [];

    // Search Employees
    repository.employees.forEach((emp) => {
      if (
        emp.first_name.toLowerCase().includes(q) ||
        emp.last_name.toLowerCase().includes(q) ||
        emp.email.toLowerCase().includes(q) ||
        emp.employee_code.toLowerCase().includes(q)
      ) {
        results.push({
          type: 'employee',
          title: `${emp.first_name} ${emp.last_name}`,
          subtitle: `${emp.employee_code} · ${emp.job_title_name || ''}`,
          tab: 'employees',
          id: emp.id,
        });
      }
    });

    // Search Projects
    repository.projects.forEach((proj) => {
      if (proj.name.toLowerCase().includes(q) || proj.description.toLowerCase().includes(q)) {
        results.push({
          type: 'project',
          title: proj.name,
          subtitle: `${proj.client_name || ''} · ${proj.status}`,
          tab: 'projects',
          id: proj.id,
        });
      }
    });

    // Search Tasks
    repository.tasks.forEach((task) => {
      if (task.title.toLowerCase().includes(q) || task.description.toLowerCase().includes(q)) {
        results.push({
          type: 'task',
          title: task.title,
          subtitle: `${task.project_name || ''} · ${task.status}`,
          tab: 'tasks',
          id: task.id,
        });
      }
    });

    // Search Departments
    repository.departments.forEach((dept) => {
      if (dept.name.toLowerCase().includes(q) || dept.description.toLowerCase().includes(q)) {
        results.push({
          type: 'department',
          title: dept.name,
          subtitle: dept.description,
          tab: 'departments',
          id: dept.id,
        });
      }
    });

    // Search Clients
    repository.clients.forEach((c) => {
      if (c.company_name.toLowerCase().includes(q) || c.contact_person.toLowerCase().includes(q)) {
        results.push({
          type: 'client',
          title: c.company_name,
          subtitle: c.contact_person,
          tab: 'clients',
          id: c.id,
        });
      }
    });

    return results.slice(0, 10);
  }, [query]);

  if (!isOpen) return null;

  const getIcon = (type: string) => {
    switch (type) {
      case 'employee':
        return <Users className="w-4 h-4 text-indigo-500" />;
      case 'project':
        return <FolderKanban className="w-4 h-4 text-blue-500" />;
      case 'task':
        return <CheckSquare className="w-4 h-4 text-emerald-500" />;
      case 'department':
        return <Building2 className="w-4 h-4 text-amber-500" />;
      case 'client':
        return <UserCheck className="w-4 h-4 text-violet-500" />;
      default:
        return <Search className="w-4 h-4 text-neutral-400" />;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 p-4 bg-black/50 backdrop-blur-xs">
      <div className="fixed inset-0" onClick={onClose} aria-hidden="true" />
      <div className="relative w-full max-w-xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl shadow-2xl overflow-hidden z-10">
        {/* Search Input Box */}
        <div className="flex items-center px-4 py-3 border-b border-neutral-100 dark:border-neutral-800 gap-3">
          <Search className="w-5 h-5 text-neutral-400 shrink-0" />
          <input
            type="text"
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={t.common.globalSearchPlaceholder}
            className="flex-1 bg-transparent text-sm text-neutral-900 dark:text-white placeholder-neutral-400 outline-none"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="p-1 rounded text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-200"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Results List */}
        <div className="max-h-80 overflow-y-auto p-2">
          {searchResults.length > 0 ? (
            <div className="space-y-1">
              {searchResults.map((item, idx) => (
                <button
                  key={`${item.type}-${item.id || idx}`}
                  onClick={() => {
                    onNavigate(item.tab, item.id);
                    onClose();
                  }}
                  className="w-full flex items-center justify-between p-2.5 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800 text-start transition-colors group"
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 shrink-0">
                      {getIcon(item.type)}
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-neutral-900 dark:text-white">
                        {item.title}
                      </p>
                      <p className="text-[11px] text-neutral-400">{item.subtitle}</p>
                    </div>
                  </div>
                  <ArrowRight
                    className={`w-4 h-4 text-neutral-400 group-hover:text-neutral-700 dark:group-hover:text-neutral-200 transition-colors ${
                      isRtl ? 'rotate-180' : ''
                    }`}
                  />
                </button>
              ))}
            </div>
          ) : query.trim() ? (
            <div className="py-8 text-center text-xs text-neutral-400">
              لا توجد نتائج مطابقة لـ &ldquo;{query}&rdquo;
            </div>
          ) : (
            <div className="py-6 px-4 text-xs text-neutral-400 text-center">
              اكتب اسم موظف، مشروع، مهمة، أو قسم للبحث المباشر
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
