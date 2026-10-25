# Smart HR & Project Management Platform with AI Decision Support
## منصة الموارد البشرية الذكية وإدارة المشاريع مع دعم القرار بالذكاء الاصطناعي

**Graduation Project Frontend Implementation**
Architected for seamless integration with the **Laravel REST API** and **FastAPI Groq AI Engine** (`https://github.com/LINDA-FARAJ/AI_HR_ASSISTANT`).

---

## 1. Executive Summary & Architecture

This application represents an enterprise-grade, human-centric Software-as-a-Service (SaaS) frontend uniting three interconnected core pillars:
1. **Core Human Resources Management (HRMS)**: Organizational departments, job titles, positions, employee lifecycle, skills matrix, verified credentials, documents, and employment contracts.
2. **Project & Delivery Management**: Client directories, budget monitoring, milestone tracking, parent-child task hierarchies, and an interactive Kanban board.
3. **AI Decision Support Engine**: An executive advisory copilot that assists managers in assigning tasks to the most suitable candidates based on verified skills, historical performance scores, and real-time workload capacity—while strictly maintaining the **Human-in-the-Loop** principle.

### Technology Stack
- **Framework**: React 19 (Functional components, custom hooks, strict modular state).
- **Language**: TypeScript (Strongly typed domain models, zero untyped `any` leaks).
- **Styling**: Tailwind CSS (Sophisticated 60-30-10 palette, zero decorative slop, dark navy sidebar, clean high-density workspace).
- **Icons**: Lucide Icons.
- **Analytics & Charts**: Recharts (Headcount distributions, project velocity, hours variances, contract expiry timelines).
- **Localization**: Native Arabic (RTL) first with complete English (LTR) bidirectional toggle and local storage persistence.

---

## 2. Database Schema & Migration Mapping (100% Fidelity)

Every table, foreign key, enumerated constraint, and business rule has been cross-checked directly against the actual migrations and seeders in the Laravel repository:

| Database Table | Schema Fields & Types | Frontend View / Component | Core Business Rule |
| :--- | :--- | :--- | :--- |
| `companies` | `id`, `name`, `email`, `phone`, `address`, `logo`, `owner_id` | `SuperAdminDashboard`, `SettingsView` | Platform multi-tenancy. Companies are isolated. |
| `departments` | `id`, `company_id`, `name`, `description` | `DepartmentsView`, `DepartmentManagerDashboard` | Departments belong to a single company. Headcount and tasks rollup dynamically. |
| `employees` | `id`, `user_id`, `first_name`, `last_name`, `phone`, `hire_date`, `status: ['active','inactive','on_leave']` | `EmployeesView`, `EmployeeDetailView` | Core personnel entity. Has 1 user account, 1 profile, and multiple positions. |
| `employee_profiles`| `id`, `employee_id`, `birth_date`, `nationality`, `gender`, `bio`, `avatar` | `EmployeeDetailView`, `EmployeeAvatar` | 1-to-1 profile extension storing personal demographic metadata. |
| `job_titles` | `id`, `title`, `description`, `level: ['junior','mid','senior','lead','principal','director']` | `PositionsView` (Sub-tab: المسميات الوظيفية) | **Abstract classification** (e.g. Senior Backend Developer). Reusable across multiple positions. |
| `positions` | `id`, `employee_id`, `department_id`, `job_title_id`, `manager_id`, `employment_type`, `is_primary`, `start_date`, `end_date`, `status: ['active','transferred','promoted','ended']`, `salary`, `workload_percentage`, `notes` | `PositionsView`, `EmployeeDetailView`, `TasksView` | **Concrete employment assignment**. An employee can hold multiple historical assignments with exactly one primary position (`is_primary: true`). |
| `skill_categories`| `id`, `name`, `description` | `SkillsView` | High-level categorization (Backend, Frontend, DevOps, Quality, Architecture). |
| `skills` | `id`, `name`, `category_id` | `SkillsView`, `TasksView` | Atomic technical skills (Laravel, PHP, React, MySQL, Docker, Automated Testing). |
| `employee_skills` | `id`, `employee_id`, `skill_id`, `level` (1-5), `years_experience`, `last_used_at`, `verified`, `verified_by`, `verified_at`, `certificate_number`, `notes` | `SkillsView`, `EmployeeDetailView`, `AiDecisionSupportView` | Bridges employee capabilities to skill requirements. AI utilizes `verified` and `years_experience` in ranking. |
| `employee_documents`| `id`, `employee_id`, `type`, `file_path` | `DocumentsContractsView`, `EmployeeDetailView` | Official documents (National ID, Passport, Educational Certificates). |
| `contracts` | `id`, `employee_id`, `start_date`, `end_date`, `salary`, `working_hours_per_mounth`, `type: ['full_time','part_time','contract']` | `DocumentsContractsView`, `ReportsView` | Legal employment contracts. Enforces monthly capacity constraints (`working_hours_per_mounth`). |
| `clients` | `id`, `company_name`, `contact_person`, `email`, `phone`, `website`, `address`, `country`, `city`, `status: ['active','inactive']`, `notes` | `ClientsView`, `ProjectsView` | External client accounts commissioning projects. |
| `projects` | `id`, `client_id`, `name`, `description`, `budget`, `priority: ['low','medium','high','critical']`, `progress`, `status: ['planning','in_progress','on_hold','completed','cancelled']`, `planned_start_date`, `planned_end_date`, `actual_start_date`, `actual_end_date`, `estimated_hours` | `ProjectsView`, `ProjectDetailView`, `ProjectManagerDashboard` | Core delivery container. Holds aggregate budget, hours estimates, and associated task collections. |
| `tasks` | `id`, `project_id`, `parent_task_id`, `position_id`, `skill_id`, `title`, `description`, `priority: ['low','medium','high','critical']`, `status: ['pending','ready','in_progress','review','completed','blocked','cancelled']`, `progress`, `estimated_hours`, `actual_hours`, `planned_start_date`, `planned_end_date`, `actual_start_date`, `actual_end_date` | `TasksView`, `KanbanBoard`, `AiDecisionSupportView` | **Operational unit**. Assigned to a `position_id` (not a bare employee_id) and mandates one `skill_id`. |
| `employee_ai_profiles`| `id`, `position_id`, `analysis_date`, `total_experience_months`, `quality_score`, `productivity_score`, `timeliness_score`, `overall_score`, `performance_score`, `available_hours`, `allocated_hours`, `remaining_hours`, `availability_percentage`, `weekly_working_hours`, `last_analyzed_at` | `AiDecisionSupportView`, `DepartmentManagerDashboard` | Scored operational telemetry feeding the AI allocation algorithm. |
| `ai_task_recommendations`| `id`, `task_id`, `recommended_employee_id`, `recommended_position_id`, `confidence`, `decision`, `reason`, `skill_match_score`, `skill_level`, `skill_experience_years`, `skill_verified`, `performance_score`, `overall_score`, `total_experience_months`, `remaining_hours`, `estimated_hours`, `availability_percentage`, `can_cover_task`, `alternatives`, `raw_response` | `AiDecisionSupportView`, `RecommendationHistoryView` | Persistent log of AI recommendations, evaluation criteria, candidate rankings, and executive decisions. |

---

## 3. Five Distinct User Roles & Centralized RBAC Matrix

The platform provides 5 fictional demo accounts accessible directly from the **Login Screen** and the **TopNavbar Switcher**:

1. **Super Admin — مدير النظام / صاحب الموقع (`admin@platform.sa`)**
   - **Scope**: Platform-level oversight across all 18 registered tenant companies.
   - **Dashboard**: Tenant company directories, total platform users (420), Groq AI call volume & latency (180ms), system uptime (99.98%), and global audit security logs.
   - **Boundary**: Does not access private internal company payroll or confidential operational tasks unless performing platform maintenance.

2. **Company Owner — مالك الشركة (`owner@apexsoft.sa`)**
   - **Scope**: Executive control over the entire enterprise (ApexSoft).
   - **Dashboard**: Total employees, active departments, project budgets, task pipelines, company-wide AI decision approvals, and strategic analytics.

3. **Department Manager — مدير القسم (`sara.q@apexsoft.sa`)**
   - **Scope**: Focused strictly on the **Engineering & Software Development Department**.
   - **Dashboard**: Department staff count, active positions, team workload balance, engineer availability, departmental tasks, and AI staff allocation recommendations.
   - **Boundary**: Cannot alter company settings or access unrelated departments.

4. **Project Manager — مدير المشروع (`pm@apexsoft.sa`)**
   - **Scope**: An employee holding the "Lead Technical Project Manager" position.
   - **Dashboard**: Projects under active supervision (e.g., Open Banking Gateway, Fleet Optimization), milestone delivery tracking, planned vs. actual hours variance, and sprint Kanban boards.

5. **Employee — الموظف (`ahmed.sh@apexsoft.sa` - م. أحمد الشمري)**
   - **Scope**: Personal workspace for individual contributors.
   - **Dashboard**: My assigned tasks with an interactive self-reported progress slider, career position history, verified technical skills, and permitted employment documents/contracts.

### Route Guarding & Access Control
- Centralized `canAccessTab(activeTab)` and `hasPermission(permission)` checks.
- If an unauthorized route or tab is accessed, the application renders a dedicated **`AccessDeniedView`** displaying current user details and a "Return to My Dashboard" button.

---

## 4. AI Decision Support Architecture (FastAPI & Groq)

The AI module acts strictly as an **intelligent managerial advisor**:
- **Endpoint Target**: `POST /tasks/{task}/ai-assign` (proxied by Laravel to FastAPI `http://127.0.0.1:8001/assign-tasks`).
- **Evaluation Dimensions**:
  1. **Skill Match Score**: Verified status, certificate validation, and proficiency level against task requirement.
  2. **Workload & Availability**: Verifies whether `remaining_hours >= estimated_hours` to protect against employee burnout.
  3. **Historical Performance**: Incorporates quality, productivity, and timeliness metrics.
- **Executive Decision Actions**:
  - `Accept`: Binds the recommended candidate to `tasks.position_id` and registers decision in `ai_task_recommendations`.
  - `Reject`: Requires managerial rationale notes, keeping the task in `ready` state.
  - `Alternative Candidates`: Dynamically presents ranked secondary candidates with relative score comparisons.

---

## 5. API Endpoints Catalog (`routes/api.php`)

All interactive views use a simulated `apiService` matching the exact endpoints defined in Laravel:

```
// Authentication & Profiles
POST   /api/login
POST   /api/logout
GET    /api/me

// Core Organization
GET    /api/departments
POST   /api/departments
GET    /api/job-titles
POST   /api/job-titles
GET    /api/positions
POST   /api/positions
GET    /api/organization-tree

// Personnel & Competencies
GET    /api/employees
POST   /api/employees/register_employee
GET    /api/employees/{id}
GET    /api/employee-skills
POST   /api/employee-skills
GET    /api/skills
GET    /api/skill-categories

// Projects & Clients
GET    /api/clients
POST   /api/clients
GET    /api/projects
POST   /api/projects
GET    /api/projects/{id}

// Operational Tasks
GET    /api/tasks
POST   /api/tasks
PUT    /api/tasks/{id}
DELETE /api/tasks/{id}

// AI Decision Support
GET    /api/tasks/{task}/candidates
GET    /api/tasks/{task}/assignment-context
POST   /api/tasks/{task}/ai-assign
POST   /api/tasks/{task}/confirm-assignment
POST   /api/projects/{project}/assign-ai
POST   /api/predict-time
```

---

## 6. How to Run & Verify

```bash
# 1. Install dependencies
npm install

# 2. Start Vite development server (Port 3000)
npm run dev

# 3. Check TypeScript syntax & type checks
npm run lint

# 4. Production build bundle
npm run build
```

---

## 7. Assumptions & Unresolved Questions

1. **`working_hours_per_mounth` Column Spelling**:
   - The database migration `2026_07_24_072154_create_contracts_table.php` defines the column as `working_hours_per_mounth` (with `ou`). The frontend types support this exact key while exposing localized labels ("ساعات العمل الشهرية") in the UI.
2. **Task Assignment via `position_id`**:
   - The task schema links to `position_id` rather than directly to `employee_id`. The frontend correctly displays the assigned employee by hydrating `position.employee`, preserving the relational hierarchy where an employee may hold multiple positions.
3. **Multi-Tenancy Isolation**:
   - In production, tenant data will be scoped automatically via Laravel Global Scopes or middleware (`company_id`). In this frontend prototype, demo data reflects this isolation per active persona.
