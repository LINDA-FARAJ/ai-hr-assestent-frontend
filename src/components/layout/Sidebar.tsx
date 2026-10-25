import React from 'react';
import {
  LayoutDashboard,
  Sparkles,
  Users,
  Building2,
  Briefcase,
  Layers,
  Award,
  FileText,
  UserCheck,
  FolderKanban,
  CheckSquare,
  History,
  BarChart3,
  Settings,
  Code2,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { useTranslation } from '../../i18n/LanguageContext';
import { useAuth } from '../../context/AuthContext';

export type ActiveTab =
  | 'overview'
  | 'ai-decision-support'
  | 'employees'
  | 'employee-detail'
  | 'departments'
  | 'positions'
  | 'skills'
  | 'clients'
  | 'projects'
  | 'project-detail'
  | 'tasks'
  | 'ai-history'
  | 'documents'
  | 'reports'
  | 'settings'
  | 'api-docs';

interface SidebarProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  isCollapsed: boolean;
  setIsCollapsed: (collapsed: boolean) => void;
  isOpenMobile: boolean;
  setIsOpenMobile: (open: boolean) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  setActiveTab,
  isCollapsed,
  setIsCollapsed,
  isOpenMobile,
  setIsOpenMobile,
}) => {
  const { t, isRtl } = useTranslation();
  const { user, role, canAccessTab } = useAuth();

  // Role-customized navigation menus matching Prompt sections C, D, E, F, G
  const getNavItemsForRole = () => {
    switch (role) {
      case 'super_admin':
        return [
          { id: 'overview', label: isRtl ? 'لوحة قيادة المنصة' : 'Platform Dashboard', icon: LayoutDashboard },
          { id: 'reports', label: isRtl ? 'تقارير المنصة الموحدة' : 'Platform Reports', icon: BarChart3 },
          { id: 'settings', label: isRtl ? 'إعدادات المنصة العامة' : 'Platform Settings', icon: Settings },
          { id: 'api-docs', label: isRtl ? 'توثيق واجهات API' : 'API Contracts', icon: Code2 },
        ];
      case 'department_manager':
        return [
          { id: 'overview', label: isRtl ? 'لوحة قيادة القسم' : 'Department Dashboard', icon: LayoutDashboard },
          { id: 'departments', label: isRtl ? 'قسمي التنظيمي' : 'My Department', icon: Building2 },
          { id: 'employees', label: isRtl ? 'مهندسو وكوادر القسم' : 'Department Staff', icon: Users },
          { id: 'positions', label: isRtl ? 'مناصب القسم المعتمدة' : 'Department Positions', icon: Briefcase },
          { id: 'skills', label: isRtl ? 'كفاءات القسم الفنية' : 'Department Skills', icon: Award },
          { id: 'tasks', label: isRtl ? 'مهام القسم التشغيلية' : 'Department Tasks', icon: CheckSquare },
          { id: 'projects', label: isRtl ? 'المشاريع المشارك بها' : 'Assigned Projects', icon: FolderKanban },
          { id: 'ai-decision-support', label: isRtl ? 'دعم القرار بالذكاء' : 'AI Decision Support', icon: Sparkles, isAiHighlight: true, badge: 'Groq' },
          { id: 'ai-history', label: isRtl ? 'سجل توصيات القسم' : 'AI History', icon: History },
          { id: 'reports', label: isRtl ? 'تقارير أداء القسم' : 'Department Reports', icon: BarChart3 },
        ];
      case 'project_manager':
        return [
          { id: 'overview', label: isRtl ? 'لوحة إدارة المشاريع' : 'Project Dashboard', icon: LayoutDashboard },
          { id: 'projects', label: isRtl ? 'مشاريعي الموكلة' : 'My Projects', icon: FolderKanban },
          { id: 'tasks', label: isRtl ? 'مهام ومراحل التسليم' : 'Project Tasks & Board', icon: CheckSquare },
          { id: 'positions', label: isRtl ? 'فريق العمل والمناصب' : 'Team Positions', icon: Briefcase },
          { id: 'skills', label: isRtl ? 'المهارات المطلوبة' : 'Required Skills', icon: Award },
          { id: 'ai-decision-support', label: isRtl ? 'إسناد المهام بالذكاء' : 'AI Task Assignment', icon: Sparkles, isAiHighlight: true, badge: 'Groq' },
          { id: 'ai-history', label: isRtl ? 'سجل توصيات المشاريع' : 'AI History', icon: History },
          { id: 'reports', label: isRtl ? 'تقارير الإنجاز والساعات' : 'Project Reports', icon: BarChart3 },
        ];
      case 'employee':
        return [
          { id: 'overview', label: isRtl ? 'مساحتي الشخصية' : 'My Dashboard', icon: LayoutDashboard },
          { id: 'tasks', label: isRtl ? 'مهامي المسندة' : 'My Assigned Tasks', icon: CheckSquare },
          { id: 'projects', label: isRtl ? 'المشاريع المرتبطة' : 'My Projects', icon: FolderKanban },
          { id: 'employee-detail', label: isRtl ? 'منصبي وسجل عملي' : 'My Career Profile', icon: Briefcase },
          { id: 'skills', label: isRtl ? 'مهاراتي المعتمدة' : 'My Verified Skills', icon: Award },
          { id: 'documents', label: isRtl ? 'وثائقي وعقودي' : 'My Documents', icon: FileText },
        ];
      case 'company_owner':
      default:
        return [
          { id: 'overview', label: t.nav.overview, icon: LayoutDashboard },
          { id: 'ai-decision-support', label: t.nav.aiDecisionSupport, icon: Sparkles, isAiHighlight: true, badge: 'Groq AI' },
          { id: 'employees', label: t.nav.employees, icon: Users },
          { id: 'departments', label: t.nav.departments, icon: Building2 },
          { id: 'positions', label: t.nav.positions, icon: Briefcase },
          { id: 'skills', label: t.nav.skills, icon: Award },
          { id: 'clients', label: t.nav.clients, icon: UserCheck },
          { id: 'projects', label: t.nav.projects, icon: FolderKanban },
          { id: 'tasks', label: t.nav.tasks, icon: CheckSquare },
          { id: 'ai-history', label: t.nav.aiHistory, icon: History },
          { id: 'documents', label: t.nav.documentsAndContracts, icon: FileText },
          { id: 'reports', label: t.nav.reports, icon: BarChart3 },
          { id: 'settings', label: t.nav.settings, icon: Settings },
          { id: 'api-docs', label: t.nav.apiDocs, icon: Code2 },
        ];
    }
  };

  const navigationItems = getNavItemsForRole();

  const handleNavClick = (tabId: string) => {
    setActiveTab(tabId as ActiveTab);
    setIsOpenMobile(false);
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpenMobile && (
        <div
          className="fixed inset-0 z-40 bg-black/40 backdrop-blur-xs lg:hidden"
          onClick={() => setIsOpenMobile(false)}
        />
      )}

      {/* Main Sidebar */}
      <aside
        className={`fixed top-0 bottom-0 z-40 bg-white dark:bg-neutral-900 border-r border-neutral-200 dark:border-neutral-800 transition-all duration-200 flex flex-col ${
          isRtl ? 'right-0 border-l border-r-0' : 'left-0 border-r'
        } ${isCollapsed ? 'w-18' : 'w-64'} ${
          isOpenMobile ? 'translate-x-0' : isRtl ? 'translate-x-full lg:translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        {/* Brand Header */}
        <div className="h-16 flex items-center justify-between px-4 border-b border-neutral-100 dark:border-neutral-800 shrink-0">
          <div className="flex items-center gap-3 overflow-hidden">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-700 to-violet-600 flex items-center justify-center text-white font-bold shadow-xs shrink-0">
              <Layers className="w-5 h-5 text-white" />
            </div>
            {!isCollapsed && (
              <div className="overflow-hidden">
                <span className="font-bold text-sm tracking-tight text-neutral-900 dark:text-white block truncate">
                  {t.appShortName}
                </span>
                <span className="text-[11px] text-neutral-400 dark:text-neutral-500 block truncate">
                  Enterprise HR & AI
                </span>
              </div>
            )}
          </div>

          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="hidden lg:flex p-1.5 rounded-lg text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
            title={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            {isRtl ? (
              isCollapsed ? <ChevronLeft className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />
            ) : (
              isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />
            )}
          </button>
        </div>

        {/* Navigation List */}
        <div className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
          {navigationItems.map((item) => {
            const Icon = item.icon;
              const isActive = activeTab === item.id || (item.id === 'employees' && activeTab === 'employee-detail') || (item.id === 'projects' && activeTab === 'project-detail');

              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  title={isCollapsed ? item.label : undefined}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-medium transition-colors group relative ${
                    isActive
                      ? item.isAiHighlight
                        ? 'bg-violet-50 text-violet-700 dark:bg-violet-950/50 dark:text-violet-300 font-semibold'
                        : 'bg-indigo-50 text-indigo-700 dark:bg-indigo-950/50 dark:text-indigo-300 font-semibold'
                      : 'text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800/60 hover:text-neutral-900 dark:hover:text-white'
                  }`}
                >
                  <Icon
                    className={`w-4 h-4 shrink-0 transition-colors ${
                      isActive
                        ? item.isAiHighlight
                          ? 'text-violet-600 dark:text-violet-400'
                          : 'text-indigo-600 dark:text-indigo-400'
                        : item.isAiHighlight
                        ? 'text-violet-500'
                        : 'text-neutral-400 group-hover:text-neutral-600 dark:group-hover:text-neutral-200'
                    }`}
                  />

                  {!isCollapsed && (
                    <span className="truncate flex-1 text-start">{item.label}</span>
                  )}

                  {!isCollapsed && item.badge && (
                    <span className="text-[10px] px-1.5 py-0.5 rounded font-mono font-medium bg-violet-100 dark:bg-violet-900/60 text-violet-700 dark:text-violet-300 shrink-0">
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
        </div>

        {/* User context footer */}
        {!isCollapsed && user && (
          <div className="p-3 border-t border-neutral-100 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-900/40">
            <div className="flex items-center gap-2.5 px-2 py-1.5">
              <div className="w-7 h-7 rounded-full bg-neutral-200 dark:bg-neutral-700 flex items-center justify-center text-xs font-bold text-neutral-700 dark:text-neutral-300 shrink-0">
                {user.name.substring(0, 1)}
              </div>
              <div className="overflow-hidden">
                <p className="text-xs font-semibold text-neutral-900 dark:text-white truncate">{user.name}</p>
                <p className="text-[11px] text-neutral-400 dark:text-neutral-500 truncate">{t.roles[user.role]}</p>
              </div>
            </div>
          </div>
        )}
      </aside>
    </>
  );
};
