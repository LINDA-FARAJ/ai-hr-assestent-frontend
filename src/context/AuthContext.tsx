import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, UserRole, PermissionKey } from '../types';

interface AuthContextType {
  user: User | null;
  role: UserRole;
  isAuthenticated: boolean;
  switchRole: (role: UserRole) => void;
  loginWithRole: (role: UserRole) => Promise<void>;
  loginWithCredentials: (emailOrUser: string, pass: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  hasPermission: (permission: PermissionKey) => boolean;
  canAccessTab: (tab: string) => boolean;
}

// Five distinctive fictional demo accounts
export const DEMO_USERS: Record<UserRole, User> = {
  super_admin: {
    id: 1,
    name: 'م. طارق المهيدب',
    email: 'admin@platform.sa',
    role: 'super_admin',
    role_title_ar: 'مدير النظام / صاحب الموقع',
    company_id: 0,
    company_name: 'إدارة المنصة الموحدة (SaaS Master Platform)',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
  },
  company_owner: {
    id: 2,
    name: 'د. خالد العمري',
    email: 'owner@apexsoft.sa',
    role: 'company_owner',
    role_title_ar: 'مالك الشركة (Executive CEO)',
    company_id: 1,
    company_name: 'شركة أبيكس للحلول التقنية والبرمجيات',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
  },
  department_manager: {
    id: 3,
    name: 'م. سارة القحطاني',
    email: 'sara.q@apexsoft.sa',
    role: 'department_manager',
    role_title_ar: 'مدير قسم الهندسة والبرمجيات',
    company_id: 1,
    company_name: 'شركة أبيكس للحلول التقنية والبرمجيات',
    department_id: 1,
    department_name: 'الهندسة البرمجية والتطوير',
    employee_id: 102,
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
  },
  project_manager: {
    id: 4,
    name: 'م. عبد الرحمن الشهري',
    email: 'pm@apexsoft.sa',
    role: 'project_manager',
    role_title_ar: 'مدير المشاريع التقنية (Project Manager)',
    company_id: 1,
    company_name: 'شركة أبيكس للحلول التقنية والبرمجيات',
    project_id: 1,
    project_name: 'بوابة الخدمات المصرفية المفتوحة',
    employee_id: 104,
    position_title: 'Lead Technical Project Manager',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80',
  },
  employee: {
    id: 5,
    name: 'م. أحمد الشمري',
    email: 'ahmed.sh@apexsoft.sa',
    role: 'employee',
    role_title_ar: 'مهندس نظم أول (Lead Backend Architect)',
    company_id: 1,
    company_name: 'شركة أبيكس للحلول التقنية والبرمجيات',
    department_id: 1,
    department_name: 'الهندسة البرمجية والتطوير',
    employee_id: 101,
    position_id: 1,
    position_title: 'Lead Backend Architect',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
  },
};

// Centralized Role-Based Access Control (RBAC) Permission Matrix
export const ROLE_PERMISSIONS: Record<UserRole, PermissionKey[]> = {
  super_admin: [
    'view_platform_dashboard',
    'manage_companies',
    'manage_platform_users',
    'manage_platform_settings',
    'view_activity_logs',
  ],
  company_owner: [
    'manage_company_profile',
    'manage_departments',
    'manage_employees',
    'manage_job_titles',
    'manage_positions',
    'manage_skills',
    'manage_clients',
    'manage_projects',
    'manage_project_tasks',
    'manage_department_tasks',
    'view_ai_recommendations',
    'decide_ai_recommendations',
    'view_company_reports',
    'view_employee_documents',
    'view_employee_contracts',
    'manage_company_settings',
    'view_my_profile',
  ],
  department_manager: [
    'view_my_department',
    'manage_departments',
    'manage_positions',
    'manage_department_tasks',
    'view_ai_recommendations',
    'decide_ai_recommendations',
    'view_department_reports',
    'view_my_profile',
  ],
  project_manager: [
    'view_my_projects',
    'manage_projects',
    'manage_project_tasks',
    'view_ai_recommendations',
    'decide_ai_recommendations',
    'view_project_reports',
    'view_my_profile',
  ],
  employee: [
    'view_my_tasks',
    'update_my_task_progress',
    'view_my_profile',
    'view_my_department',
    'view_my_projects',
    'view_employee_documents',
  ],
};

// Tab visibility and access control by role
export const ROLE_TAB_ACCESS: Record<UserRole, string[]> = {
  super_admin: [
    'overview',
    'companies',
    'platform-users',
    'roles-permissions',
    'platform-reports',
    'activity-logs',
    'settings',
    'api-docs',
  ],
  company_owner: [
    'overview',
    'ai-decision-support',
    'employees',
    'employee-detail',
    'departments',
    'positions',
    'skills',
    'clients',
    'projects',
    'project-detail',
    'tasks',
    'ai-history',
    'documents',
    'reports',
    'settings',
    'api-docs',
  ],
  department_manager: [
    'overview',
    'departments',
    'employees',
    'employee-detail',
    'positions',
    'skills',
    'tasks',
    'projects',
    'project-detail',
    'ai-decision-support',
    'ai-history',
    'reports',
    'settings',
  ],
  project_manager: [
    'overview',
    'projects',
    'project-detail',
    'tasks',
    'positions',
    'skills',
    'ai-decision-support',
    'ai-history',
    'reports',
    'settings',
  ],
  employee: [
    'overview',
    'tasks',
    'projects',
    'project-detail',
    'employee-detail',
    'documents',
    'skills',
    'settings',
  ],
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Start authenticated as company_owner by default or load saved demo session
  const [role, setRole] = useState<UserRole>(() => {
    const saved = localStorage.getItem('demo_user_role') as UserRole;
    return saved && DEMO_USERS[saved] ? saved : 'company_owner';
  });

  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    const saved = localStorage.getItem('demo_is_authenticated');
    return saved !== null ? saved === 'true' : true;
  });

  const [user, setUser] = useState<User | null>(() => (isAuthenticated ? DEMO_USERS[role] : null));

  useEffect(() => {
    if (isAuthenticated) {
      setUser(DEMO_USERS[role]);
      localStorage.setItem('demo_user_role', role);
      localStorage.setItem('demo_is_authenticated', 'true');
    } else {
      setUser(null);
      localStorage.setItem('demo_is_authenticated', 'false');
    }
  }, [role, isAuthenticated]);

  const switchRole = (newRole: UserRole) => {
    setRole(newRole);
    setUser(DEMO_USERS[newRole]);
    setIsAuthenticated(true);
  };

  const loginWithRole = async (targetRole: UserRole) => {
    setRole(targetRole);
    setUser(DEMO_USERS[targetRole]);
    setIsAuthenticated(true);
  };

  const loginWithCredentials = async (emailOrUser: string, pass: string): Promise<{ success: boolean; error?: string }> => {
    // Check if input matches any of our 5 demo users
    const matchedRole = (Object.keys(DEMO_USERS) as UserRole[]).find((r) => {
      const u = DEMO_USERS[r];
      return u.email.toLowerCase() === emailOrUser.toLowerCase().trim() || r === emailOrUser.toLowerCase().trim();
    });

    if (matchedRole && pass.length >= 3) {
      setRole(matchedRole);
      setUser(DEMO_USERS[matchedRole]);
      setIsAuthenticated(true);
      return { success: true };
    }

    return {
      success: false,
      error: 'بيانات الاعتماد غير مطابقة لأي حساب تجريبي. يمكنك استخدام بطاقات الدخول السريع أدناه.',
    };
  };

  const logout = () => {
    setIsAuthenticated(false);
    setUser(null);
    localStorage.setItem('demo_is_authenticated', 'false');
  };

  const hasPermission = (permission: PermissionKey): boolean => {
    if (!isAuthenticated || !user) return false;
    const permissions = ROLE_PERMISSIONS[role] || [];
    return permissions.includes(permission);
  };

  const canAccessTab = (tab: string): boolean => {
    if (!isAuthenticated || !user) return false;
    const allowedTabs = ROLE_TAB_ACCESS[role] || [];
    return allowedTabs.includes(tab);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        role,
        isAuthenticated,
        switchRole,
        loginWithRole,
        loginWithCredentials,
        logout,
        hasPermission,
        canAccessTab,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
