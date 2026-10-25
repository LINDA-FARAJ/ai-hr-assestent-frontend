/**
 * Core Data Models & Type Definitions
 * Aligned with the Laravel backend schema and AI Decision Support architecture.
 */

export type UserRole = 'super_admin' | 'company_owner' | 'department_manager' | 'project_manager' | 'employee';

export type PermissionKey =
  | 'view_platform_dashboard'
  | 'manage_companies'
  | 'manage_platform_users'
  | 'manage_platform_settings'
  | 'view_activity_logs'
  | 'manage_company_profile'
  | 'manage_departments'
  | 'manage_employees'
  | 'manage_job_titles'
  | 'manage_positions'
  | 'manage_skills'
  | 'manage_clients'
  | 'manage_projects'
  | 'manage_project_tasks'
  | 'manage_department_tasks'
  | 'view_ai_recommendations'
  | 'decide_ai_recommendations'
  | 'view_company_reports'
  | 'view_department_reports'
  | 'view_project_reports'
  | 'view_employee_documents'
  | 'view_employee_contracts'
  | 'manage_company_settings'
  | 'view_my_tasks'
  | 'update_my_task_progress'
  | 'view_my_profile'
  | 'view_my_department'
  | 'view_my_projects';

export interface User {
  id: number;
  name: string;
  email: string;
  role: UserRole;
  role_title_ar: string;
  company_id: number;
  company_name: string;
  department_id?: number;
  department_name?: string;
  project_id?: number;
  project_name?: string;
  employee_id?: number;
  position_id?: number;
  position_title?: string;
  avatar?: string;
}

export interface PlatformAuditLog {
  id: number;
  user_name: string;
  action: string;
  company_name: string;
  target_entity: string;
  timestamp: string;
  ip_address: string;
  status: 'success' | 'warning' | 'info';
}

export interface Company {
  id: number;
  name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  country: string;
  logo?: string;
  owner_id?: number;
  tax_number?: string;
  subscription_tier?: string;
}

export interface Department {
  id: number;
  company_id: number;
  name: string;
  name_ar?: string;
  description: string;
  manager_id?: number;
  manager_name?: string;
  employee_count: number;
  active_projects_count: number;
  created_at: string;
}

export interface JobTitle {
  id: number;
  company_id: number;
  title: string;
  title_ar?: string;
  level: 'junior' | 'mid' | 'senior' | 'lead' | 'principal' | 'director';
  description: string;
  positions_count?: number;
}

export interface Position {
  id: number;
  employee_id: number;
  department_id: number;
  job_title_id: number;
  manager_id?: number;
  employment_type: 'full_time' | 'part_time' | 'contract' | 'remote';
  is_primary: boolean;
  start_date: string;
  end_date?: string;
  status: 'active' | 'past' | 'on_leave';
  notes?: string;
  // Hydrated relation fields
  employee_name?: string;
  employee_avatar?: string;
  employee_email?: string;
  department_name?: string;
  job_title_name?: string;
  manager_name?: string;
}

export type SkillProficiency = 'beginner' | 'intermediate' | 'advanced' | 'expert';

export interface Skill {
  id: number;
  name: string;
  category: string;
  description: string;
  employees_count?: number;
  tasks_count?: number;
}

export interface EmployeeSkill {
  id: number;
  employee_id: number;
  skill_id: number;
  skill_name: string;
  category: string;
  proficiency_level: SkillProficiency;
  years_of_experience: number;
  is_verified: boolean;
}

export interface EmployeeDocument {
  id: number;
  employee_id: number;
  title: string;
  document_type: 'id_card' | 'passport' | 'contract' | 'degree' | 'certificate' | 'medical' | 'other';
  file_name: string;
  file_path: string;
  file_size_kb: number;
  issue_date?: string;
  expiry_date?: string;
  status: 'valid' | 'expired' | 'pending_renewal';
}

export interface EmployeeContract {
  id: number;
  employee_id: number;
  contract_type: 'permanent' | 'fixed_term' | 'probation' | 'consultancy' | 'internship';
  status: 'active' | 'pending' | 'expired' | 'terminated';
  start_date: string;
  end_date?: string;
  salary: number;
  currency: string;
  terms?: string;
  document_url?: string;
}

export interface Employee {
  id: number;
  company_id: number;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  employee_code: string;
  hire_date: string;
  status: 'active' | 'inactive' | 'probation' | 'terminated';
  avatar?: string;
  // Profile
  date_of_birth?: string;
  gender?: 'male' | 'female' | 'other';
  nationality?: string;
  marital_status?: string;
  address?: string;
  city?: string;
  country?: string;
  emergency_contact?: string;
  bio?: string;
  // Current active assignment
  current_position?: Position;
  department_name?: string;
  job_title_name?: string;
  // Relations
  positions?: Position[];
  skills?: EmployeeSkill[];
  documents?: EmployeeDocument[];
  contracts?: EmployeeContract[];
  active_tasks_count?: number;
  remaining_weekly_capacity_hours?: number;
}

export interface Client {
  id: number;
  company_id: number;
  company_name: string;
  contact_person: string;
  email: string;
  phone: string;
  website?: string;
  address?: string;
  city: string;
  country: string;
  status: 'active' | 'inactive' | 'prospect' | 'archived';
  notes?: string;
  projects_count?: number;
  created_at: string;
}

export type ProjectPriority = 'low' | 'medium' | 'high' | 'urgent';
export type ProjectStatus = 'planning' | 'in_progress' | 'on_hold' | 'completed' | 'cancelled';

export interface Project {
  id: number;
  company_id: number;
  client_id: number;
  client_name?: string;
  name: string;
  description: string;
  budget: number;
  priority: ProjectPriority;
  progress: number;
  status: ProjectStatus;
  planned_start_date: string;
  planned_end_date: string;
  actual_start_date?: string;
  actual_end_date?: string;
  estimated_hours: number;
  actual_hours?: number;
  tasks_count?: number;
  completed_tasks_count?: number;
}

export type TaskPriority = 'low' | 'medium' | 'high' | 'urgent';
export type TaskStatus = 'pending' | 'ready' | 'in_progress' | 'review' | 'completed' | 'blocked' | 'cancelled';

export interface Task {
  id: number;
  project_id: number;
  project_name?: string;
  parent_task_id?: number | null;
  parent_task_title?: string;
  position_id?: number | null;
  assigned_employee_id?: number;
  assigned_employee_name?: string;
  assigned_employee_avatar?: string;
  assigned_position_title?: string;
  assigned_department_name?: string;
  skill_id: number;
  skill_name?: string;
  title: string;
  description: string;
  priority: TaskPriority;
  status: TaskStatus;
  progress: number;
  estimated_hours: number;
  actual_hours: number;
  planned_start_date: string;
  planned_end_date: string;
  actual_start_date?: string;
  actual_end_date?: string;
  created_at: string;
  has_ai_recommendation?: boolean;
}

export interface AlternativeCandidate {
  position_id: number;
  employee_id: number;
  employee_name: string;
  employee_avatar?: string;
  department_name: string;
  job_title: string;
  skill_match: boolean;
  skill_level: SkillProficiency;
  skill_experience: number;
  performance_score: number;
  overall_score: number;
  remaining_available_hours: number;
  estimated_task_hours: number;
  explanation: string;
}

export interface AiTaskRecommendation {
  id: number;
  task_id: number;
  task_title?: string;
  project_name?: string;
  recommended_employee_id: number;
  recommended_employee_name: string;
  recommended_employee_avatar?: string;
  recommended_employee_email?: string;
  recommended_position_id: number;
  recommended_position_title: string;
  recommended_department_name: string;
  confidence: number; // 0-100%
  decision_status: 'recommended' | 'review_needed' | 'accepted' | 'rejected';
  explanation: string;
  skill_match: boolean;
  skill_level: SkillProficiency;
  skill_experience: number;
  skill_verification: boolean;
  performance_score: number;
  overall_score: number;
  total_experience: number;
  remaining_available_hours: number;
  estimated_task_hours: number;
  availability_percentage: number;
  can_cover_task: boolean;
  alternative_candidates: AlternativeCandidate[];
  manager_decision?: 'accepted' | 'rejected' | 'pending';
  manager_notes?: string;
  decided_at?: string;
  created_at: string;
}

export interface DashboardMetrics {
  total_employees: number;
  active_employees: number;
  total_departments: number;
  active_projects: number;
  pending_tasks: number;
  tasks_in_progress: number;
  completed_tasks: number;
  approaching_deadline_projects: number;
  ai_pending_reviews: number;
}
