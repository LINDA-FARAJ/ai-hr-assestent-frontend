/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { LanguageProvider, useTranslation } from './i18n/LanguageContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Sidebar, ActiveTab } from './components/layout/Sidebar';
import { TopNavbar } from './components/layout/TopNavbar';
import { GlobalSearchModal } from './components/layout/GlobalSearchModal';
import { NotificationDrawer } from './components/layout/NotificationDrawer';
import { AccessDeniedView } from './components/layout/AccessDeniedView';
import { GuidedTourModal } from './components/layout/GuidedTourModal';
import { LoginView } from './features/auth/LoginView';

// Features - Specialized Role Dashboards
import { DashboardView } from './features/dashboard/DashboardView';
import { SuperAdminDashboard } from './features/dashboard/SuperAdminDashboard';
import { DepartmentManagerDashboard } from './features/dashboard/DepartmentManagerDashboard';
import { ProjectManagerDashboard } from './features/dashboard/ProjectManagerDashboard';
import { EmployeeDashboard } from './features/dashboard/EmployeeDashboard';

// Features - Core Business Views
import { AiDecisionSupportView } from './features/ai-decision-support/AiDecisionSupportView';
import { RecommendationHistoryView } from './features/ai-decision-support/RecommendationHistoryView';
import { EmployeesView } from './features/employees/EmployeesView';
import { EmployeeDetailView } from './features/employees/EmployeeDetailView';
import { DepartmentsView } from './features/departments/DepartmentsView';
import { PositionsView } from './features/positions/PositionsView';
import { SkillsView } from './features/skills/SkillsView';
import { ClientsView } from './features/clients/ClientsView';
import { ProjectsView } from './features/projects/ProjectsView';
import { ProjectDetailView } from './features/projects/ProjectDetailView';
import { TasksView } from './features/tasks/TasksView';
import { DocumentsContractsView } from './features/documents/DocumentsContractsView';
import { ReportsView } from './features/reports/ReportsView';
import { SettingsView } from './features/settings/SettingsView';
import { ApiContractsView } from './features/api-docs/ApiContractsView';

const MainApp: React.FC = () => {
  const { t, isRtl } = useTranslation();
  const { user, role, isAuthenticated, canAccessTab } = useAuth();

  const [activeTab, setActiveTab] = useState<ActiveTab>('overview');
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isTourOpen, setIsTourOpen] = useState(false);

  // Selected entities for drill-down views
  const [selectedEmployeeId, setSelectedEmployeeId] = useState<number | null>(null);
  const [selectedProjectId, setSelectedProjectId] = useState<number | null>(null);

  // Reset tab to overview when role switches
  const prevRoleRef = useRef(role);
  useEffect(() => {
    if (prevRoleRef.current !== role) {
      prevRoleRef.current = role;
      setActiveTab('overview');
    }
  }, [role]);

  // Global navigation handler
  const handleNavigate = (tab: ActiveTab | string, entityId?: number) => {
    if (tab === 'employees' && entityId) {
      setSelectedEmployeeId(entityId);
      setActiveTab('employee-detail');
      return;
    }
    if (tab === 'projects' && entityId) {
      setSelectedProjectId(entityId);
      setActiveTab('project-detail');
      return;
    }
    setActiveTab(tab as ActiveTab);
  };

  const getTabTitle = (): string => {
    switch (activeTab) {
      case 'overview':
        if (role === 'super_admin') return isRtl ? 'لوحة قيادة المنصة' : 'Platform Dashboard';
        if (role === 'department_manager') return isRtl ? 'لوحة قيادة القسم' : 'Department Dashboard';
        if (role === 'project_manager') return isRtl ? 'لوحة إدارة المشاريع' : 'Project Dashboard';
        if (role === 'employee') return isRtl ? 'مساحتي الشخصية' : 'My Dashboard';
        return t.nav.overview;
      case 'ai-decision-support':
        return t.nav.aiDecisionSupport;
      case 'employees':
        return t.nav.employees;
      case 'employee-detail':
        return isRtl ? 'تفاصيل الملف الوظيفي' : 'Employee Profile & History';
      case 'departments':
        return t.nav.departments;
      case 'positions':
        return t.nav.positions;
      case 'skills':
        return t.nav.skills;
      case 'clients':
        return t.nav.clients;
      case 'projects':
        return t.nav.projects;
      case 'project-detail':
        return isRtl ? 'تفاصيل المشروع' : 'Project Workspace';
      case 'tasks':
        return t.nav.tasks;
      case 'ai-history':
        return t.nav.aiHistory;
      case 'documents':
        return t.nav.documentsAndContracts;
      case 'reports':
        return t.nav.reports;
      case 'settings':
        return t.nav.settings;
      case 'api-docs':
        return t.nav.apiDocs;
      default:
        return t.appShortName;
    }
  };

  // If user is logged out, render the LoginView
  if (!isAuthenticated) {
    return <LoginView />;
  }

  // Render role-specific dashboard when on 'overview' tab
  const renderDashboardByRole = () => {
    switch (role) {
      case 'super_admin':
        return <SuperAdminDashboard onNavigateTab={handleNavigate} />;
      case 'department_manager':
        return <DepartmentManagerDashboard onNavigateTab={handleNavigate} />;
      case 'project_manager':
        return <ProjectManagerDashboard onNavigateTab={handleNavigate} />;
      case 'employee':
        return <EmployeeDashboard onNavigateTab={handleNavigate} />;
      case 'company_owner':
      default:
        return <DashboardView onNavigate={handleNavigate} />;
    }
  };

  // RBAC Permission Guard for the current tab
  const isAuthorized = canAccessTab(activeTab);

  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-neutral-950 text-neutral-900 dark:text-neutral-100 flex flex-col selection:bg-indigo-500 selection:text-white">
      {/* Sidebar */}
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        isCollapsed={isSidebarCollapsed}
        setIsCollapsed={setIsSidebarCollapsed}
        isOpenMobile={isMobileSidebarOpen}
        setIsOpenMobile={setIsMobileSidebarOpen}
      />

      {/* Main Workspace Frame */}
      <div
        className={`flex-1 flex flex-col transition-all duration-200 ${
          isRtl
            ? isSidebarCollapsed
              ? 'lg:mr-18'
              : 'lg:mr-64'
            : isSidebarCollapsed
            ? 'lg:ml-18'
            : 'lg:ml-64'
        }`}
      >
        {/* Top Navbar */}
        <TopNavbar
          onOpenMobileSidebar={() => setIsMobileSidebarOpen(true)}
          onOpenSearch={() => setIsSearchOpen(true)}
          onOpenNotifications={() => setIsNotificationsOpen(true)}
          onOpenGuidedTour={() => setIsTourOpen(true)}
          activeTabTitle={getTabTitle()}
        />

        {/* Main Viewport Content */}
        <main className="flex-1 p-4 lg:p-8 max-w-7xl w-full mx-auto">
          {!isAuthorized ? (
            <AccessDeniedView
              onReturnToDashboard={() => setActiveTab('overview')}
              restrictedTabName={getTabTitle()}
            />
          ) : (
            <>
              {activeTab === 'overview' && renderDashboardByRole()}

              {activeTab === 'ai-decision-support' && (
                <AiDecisionSupportView />
              )}

              {activeTab === 'ai-history' && (
                <RecommendationHistoryView />
              )}

              {activeTab === 'employees' && (
                <EmployeesView
                  onSelectEmployee={(id) => {
                    setSelectedEmployeeId(id);
                    setActiveTab('employee-detail');
                  }}
                />
              )}

              {activeTab === 'employee-detail' && (
                <EmployeeDetailView
                  employeeId={selectedEmployeeId || user?.employee_id || 101}
                  onBack={() => setActiveTab(role === 'employee' ? 'overview' : 'employees')}
                />
              )}

              {activeTab === 'departments' && <DepartmentsView />}

              {activeTab === 'positions' && <PositionsView />}

              {activeTab === 'skills' && <SkillsView />}

              {activeTab === 'clients' && <ClientsView />}

              {activeTab === 'projects' && (
                <ProjectsView
                  onSelectProject={(id) => {
                    setSelectedProjectId(id);
                    setActiveTab('project-detail');
                  }}
                />
              )}

              {activeTab === 'project-detail' && (
                <ProjectDetailView
                  projectId={selectedProjectId || user?.project_id || 1}
                  onBack={() => setActiveTab('projects')}
                  onNavigateToAi={() => {
                    setActiveTab('ai-decision-support');
                  }}
                />
              )}

              {activeTab === 'tasks' && (
                <TasksView
                  onNavigateToAi={() => {
                    setActiveTab('ai-decision-support');
                  }}
                />
              )}

              {activeTab === 'documents' && <DocumentsContractsView />}

              {activeTab === 'reports' && <ReportsView />}

              {activeTab === 'settings' && <SettingsView />}

              {activeTab === 'api-docs' && <ApiContractsView />}
            </>
          )}
        </main>
      </div>

      {/* Global Modals & Drawers */}
      <GlobalSearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        onNavigate={handleNavigate}
      />

      <NotificationDrawer
        isOpen={isNotificationsOpen}
        onClose={() => setIsNotificationsOpen(false)}
        onNavigate={handleNavigate}
      />

      <GuidedTourModal
        isOpen={isTourOpen}
        onClose={() => setIsTourOpen(false)}
      />
    </div>
  );
};

export default function App() {
  return (
    <LanguageProvider>
      <AuthProvider>
        <MainApp />
      </AuthProvider>
    </LanguageProvider>
  );
}
