import React, { useState } from 'react';
import {
  Menu,
  Search,
  Bell,
  Globe,
  Shield,
  ChevronDown,
  Building,
  CheckCircle2,
  Server,
  LogOut,
  Compass,
} from 'lucide-react';
import { useTranslation } from '../../i18n/LanguageContext';
import { useAuth, DEMO_USERS } from '../../context/AuthContext';
import { UserRole } from '../../types';
import { EmployeeAvatar } from '../ui/EmployeeAvatar';

interface TopNavbarProps {
  onOpenMobileSidebar: () => void;
  onOpenSearch: () => void;
  onOpenNotifications: () => void;
  onOpenGuidedTour?: () => void;
  unreadNotificationsCount?: number;
  activeTabTitle: string;
}

export const TopNavbar: React.FC<TopNavbarProps> = ({
  onOpenMobileSidebar,
  onOpenSearch,
  onOpenNotifications,
  onOpenGuidedTour,
  unreadNotificationsCount = 2,
  activeTabTitle,
}) => {
  const { t, language, toggleLanguage, isRtl } = useTranslation();
  const { user, role, switchRole, logout } = useAuth();
  const [roleMenuOpen, setRoleMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  const availableRoles: { role: UserRole; label: string; desc: string }[] = [
    { role: 'super_admin', label: t.roles.super_admin, desc: 'إدارة المنصة الموحدة والشركات' },
    { role: 'company_owner', label: t.roles.company_owner, desc: 'كامل الصلاحيات المؤسسية للشركة' },
    { role: 'department_manager', label: t.roles.department_manager, desc: 'إدارة القسم والمهام وتوصيات الفريق' },
    { role: 'project_manager', label: t.roles.project_manager, desc: 'إدارة المشاريع الموكلة ومراحل التسليم' },
    { role: 'employee', label: t.roles.employee, desc: 'المساحة الشخصية للمهام والملف' },
  ];

  return (
    <header className="sticky top-0 z-30 h-16 bg-white/90 dark:bg-neutral-900/90 backdrop-blur-md border-b border-neutral-200 dark:border-neutral-800 px-4 lg:px-6 flex items-center justify-between gap-4">
      {/* Left / Start: Mobile Menu & Breadcrumbs */}
      <div className="flex items-center gap-3">
        <button
          onClick={onOpenMobileSidebar}
          className="lg:hidden p-2 rounded-lg text-neutral-500 hover:text-neutral-900 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
          aria-label="Open menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs font-medium text-neutral-500 dark:text-neutral-400">
          <span className="hidden sm:inline-flex items-center gap-1.5 text-neutral-600 dark:text-neutral-300">
            <Building className="w-3.5 h-3.5 text-neutral-400" />
            <span className="max-w-[140px] truncate">{user?.company_name}</span>
          </span>
          <span className="hidden sm:inline text-neutral-300 dark:text-neutral-700">/</span>
          <span className="text-neutral-900 dark:text-white font-semibold">{activeTabTitle}</span>
        </nav>
      </div>

      {/* Right / End: Actions */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Global Search Trigger */}
        <button
          onClick={onOpenSearch}
          className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800/60 text-neutral-500 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white hover:border-neutral-300 dark:hover:border-neutral-600 text-xs transition-colors"
          title="Search"
        >
          <Search className="w-3.5 h-3.5" />
          <span className="hidden md:inline">{t.common.search}</span>
          <kbd className="hidden md:inline-block px-1.5 py-0.5 text-[10px] font-mono bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700 rounded text-neutral-400">
            /
          </kbd>
        </button>

        {/* Guided Tour Trigger */}
        {onOpenGuidedTour && (
          <button
            onClick={onOpenGuidedTour}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border border-indigo-200 dark:border-indigo-800 bg-indigo-50 dark:bg-indigo-950/50 text-indigo-700 dark:text-indigo-300 hover:bg-indigo-100 dark:hover:bg-indigo-900/60 text-xs font-semibold transition-colors"
            title={isRtl ? 'الجولة التعريفية بالنظام' : 'Platform Guided Tour'}
          >
            <Compass className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
            <span className="hidden sm:inline">{isRtl ? 'الجولة التعريفية' : 'Tour'}</span>
          </button>
        )}

        {/* Backend Connectivity Status Badge */}
        <div
          className="hidden xl:flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-medium bg-emerald-50 text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800"
          title="Backend architecture: Laravel REST API & FastAPI Groq Engine"
        >
          <Server className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
          <span className="tabular-nums">Groq AI · Laravel Schema</span>
        </div>

        {/* Role Switcher Menu */}
        <div className="relative">
          <button
            onClick={() => setRoleMenuOpen(!roleMenuOpen)}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-xs font-medium text-neutral-700 dark:text-neutral-200 hover:bg-neutral-50 dark:hover:bg-neutral-750 transition-colors"
            title="Switch demo persona"
          >
            <Shield className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
            <span className="hidden sm:inline">{t.roles[role]}</span>
            <ChevronDown className="w-3 h-3 text-neutral-400" />
          </button>

          {roleMenuOpen && (
            <>
              <div
                className="fixed inset-0 z-40"
                onClick={() => setRoleMenuOpen(false)}
              />
              <div
                className={`absolute top-full mt-2 w-64 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl shadow-lg z-50 p-1.5 ${
                  isRtl ? 'left-0' : 'right-0'
                }`}
              >
                <div className="px-3 py-2 border-b border-neutral-100 dark:border-neutral-800 mb-1">
                  <p className="text-[11px] font-semibold text-neutral-400 uppercase tracking-wider">
                    تبديل دور المستخدم (للتجربة)
                  </p>
                </div>
                {availableRoles.map((r) => (
                  <button
                    key={r.role}
                    onClick={() => {
                      switchRole(r.role);
                      setRoleMenuOpen(false);
                    }}
                    className={`w-full flex items-start gap-2.5 px-3 py-2 rounded-lg text-start transition-colors ${
                      role === r.role
                        ? 'bg-indigo-50 text-indigo-900 dark:bg-indigo-950/60 dark:text-indigo-200 font-semibold'
                        : 'text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800'
                    }`}
                  >
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <span className="text-xs">{r.label}</span>
                        {role === r.role && <CheckCircle2 className="w-3.5 h-3.5 text-indigo-600" />}
                      </div>
                      <span className="text-[10px] text-neutral-400 block mt-0.5">{r.desc}</span>
                    </div>
                  </button>
                ))}
              </div>
            </>
          )}
        </div>

        {/* Language Switcher */}
        <button
          onClick={toggleLanguage}
          className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border border-neutral-200 dark:border-neutral-700 hover:bg-neutral-100 dark:hover:bg-neutral-800 text-xs font-medium text-neutral-700 dark:text-neutral-200 transition-colors"
          title="Switch language (العربية / English)"
        >
          <Globe className="w-3.5 h-3.5 text-neutral-500" />
          <span className="font-semibold">{language === 'ar' ? 'EN' : 'عربي'}</span>
        </button>

        {/* Notifications Button */}
        <button
          onClick={onOpenNotifications}
          className="relative p-2 rounded-lg text-neutral-500 hover:text-neutral-900 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
          aria-label="Notifications"
        >
          <Bell className="w-4 h-4" />
          {unreadNotificationsCount > 0 && (
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-rose-500 ring-2 ring-white dark:ring-neutral-900" />
          )}
        </button>

        {/* User Avatar & Menu */}
        {user && (
          <div className="relative pl-1">
            <button
              onClick={() => setUserMenuOpen(!userMenuOpen)}
              className="flex items-center gap-2 p-1 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
              title="User profile and session"
            >
              <EmployeeAvatar name={user.name} size="sm" />
              <ChevronDown className="w-3 h-3 text-neutral-400 hidden sm:block" />
            </button>

            {userMenuOpen && (
              <>
                <div className="fixed inset-0 z-40" onClick={() => setUserMenuOpen(false)} />
                <div
                  className={`absolute top-full mt-2 w-56 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl shadow-lg z-50 p-2 ${
                    isRtl ? 'left-0' : 'right-0'
                  }`}
                >
                  <div className="px-3 py-2 border-b border-neutral-100 dark:border-neutral-800 mb-1">
                    <p className="text-xs font-bold text-neutral-900 dark:text-white truncate">{user.name}</p>
                    <p className="text-[11px] text-indigo-600 dark:text-indigo-400 font-medium truncate mt-0.5">
                      {t.roles[role]}
                    </p>
                    <p className="text-[10px] text-neutral-400 truncate mt-0.5">{user.company_name}</p>
                  </div>

                  <button
                    onClick={() => {
                      setUserMenuOpen(false);
                      logout();
                    }}
                    className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-semibold text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>{t.auth.logout}</span>
                  </button>
                </div>
              </>
            )}
          </div>
        )}
      </div>
    </header>
  );
};
