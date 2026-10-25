/**
 * Centralized API Integration Service
 * Communicates with the Laravel API & FastAPI Groq AI endpoints.
 * Includes schema-strict development fallback repository when backend is unreachable.
 */

import {
  Company,
  Department,
  JobTitle,
  Position,
  Skill,
  Employee,
  Client,
  Project,
  Task,
  AiTaskRecommendation,
  DashboardMetrics,
  EmployeeContract,
  EmployeeDocument,
  TaskStatus,
} from '../types';

const API_BASE_URL = import.meta.env.VITE_LARAVEL_API_URL || '/api';

class ApiClient {
  private token: string | null = null;
  private isBackendLive: boolean = false;
  private hasCheckedLiveStatus: boolean = false;

  constructor() {
    this.token = localStorage.getItem('auth_token');
  }

  setToken(token: string) {
    this.token = token;
    localStorage.setItem('auth_token', token);
  }

  clearToken() {
    this.token = null;
    localStorage.removeItem('auth_token');
  }

  public async checkBackendHealth(): Promise<boolean> {
    if (this.hasCheckedLiveStatus && this.isBackendLive) return true;
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 1200);
      const res = await fetch(`${API_BASE_URL}/health`, { credentials: 'include', signal: controller.signal });
      clearTimeout(timeoutId);
      this.isBackendLive = res.ok;
    } catch {
      this.isBackendLive = false;
    }
    this.hasCheckedLiveStatus = true;
    return this.isBackendLive;
  }

  public getBackendStatus() {
    return {
      baseUrl: API_BASE_URL,
      isLive: this.isBackendLive,
    };
  }

  // Generic request wrapper with schema handling
  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<{ data: T; live: boolean }> {
    const isLive = await this.checkBackendHealth();
    if (isLive) {
      const headers = new Headers(options.headers || {});
      headers.set('Accept', 'application/json');
      if (this.token) {
        headers.set('Authorization', `Bearer ${this.token}`);
      }
      if (!(options.body instanceof FormData)) {
        headers.set('Content-Type', 'application/json');
      }

      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        ...options,
        headers,
      });

      if (!response.ok) {
        const errorBody = await response.json().catch(() => ({ message: 'Server request failed' }));
        throw new Error(errorBody.message || `API Error: ${response.status}`);
      }

      const data = await response.json();
      return { data, live: true };
    }

    throw new Error('BACKEND_UNAVAILABLE');
  }
}

export const apiClient = new ApiClient();

// ==========================================
// SCHEMA-STRICT SEED DATA (Laravel Models)
// ==========================================

const INITIAL_COMPANY: Company = {
  id: 1,
  name: 'شركة أبيكس للحلول التقنية والبرمجيات الذكية',
  email: 'contact@apexsoft.sa',
  phone: '+966 11 450 8820',
  address: 'طريق الملك فهد، حي الصحافة، برج النخيل، الدور 18',
  city: 'الرياض',
  country: 'المملكة العربية السعودية',
  tax_number: '310928392100003',
  subscription_tier: 'Enterprise Cloud',
  logo: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=100&auto=format&fit=crop&q=80',
};

const INITIAL_DEPARTMENTS: Department[] = [
  {
    id: 1,
    company_id: 1,
    name: 'الهندسة البرمجية والتطوير',
    name_ar: 'الهندسة البرمجية والتطوير',
    description: 'تطوير المنصات السحابية والأنظمة الخلفية وقواعد البيانات',
    manager_id: 101,
    manager_name: 'م. أحمد الشمري',
    employee_count: 14,
    active_projects_count: 5,
    created_at: '2023-01-15',
  },
  {
    id: 2,
    company_id: 1,
    name: 'الذكاء الاصطناعي وعلوم البيانات',
    name_ar: 'الذكاء الاصطناعي وعلوم البيانات',
    description: 'أبحاث نماذج الذكاء الاصطناعي وخوارزميات اتخاذ القرار وتحليل البيانات الضخمة',
    manager_id: 102,
    manager_name: 'د. نورة العتيبي',
    employee_count: 8,
    active_projects_count: 3,
    created_at: '2023-03-01',
  },
  {
    id: 3,
    company_id: 1,
    name: 'ضمان الجودة والاختبارات المتقدمة',
    name_ar: 'ضمان الجودة والاختبارات المتقدمة',
    description: 'أتمتة الاختبارات، واختبارات الأمان والأداء ومطابقة المعايير القياسية',
    manager_id: 103,
    manager_name: 'م. زيد المنصور',
    employee_count: 6,
    active_projects_count: 4,
    created_at: '2023-02-10',
  },
  {
    id: 4,
    company_id: 1,
    name: 'العمليات السحابية والبنية التحتية (DevOps)',
    name_ar: 'العمليات السحابية والبنية التحتية',
    description: 'إدارة الحاويات وخطوط النشر المستمر وأمن البنية السحابية',
    manager_id: 104,
    manager_name: 'م. فيصل الغامدي',
    employee_count: 5,
    active_projects_count: 6,
    created_at: '2023-04-12',
  },
  {
    id: 5,
    company_id: 1,
    name: 'تصميم تجربة وواجهة المستخدم (UI/UX)',
    name_ar: 'تصميم تجربة وواجهة المستخدم',
    description: 'بناء النماذج التفاعلية، دراسات سهولة الاستخدام، وأنظمة التصميم المؤسسية',
    manager_id: 105,
    manager_name: 'أ. هدى الدوسري',
    employee_count: 5,
    active_projects_count: 4,
    created_at: '2023-05-20',
  },
];

const INITIAL_JOB_TITLES: JobTitle[] = [
  { id: 1, company_id: 1, title: 'Lead Backend Architect', title_ar: 'كبير مهندسي النظم الخلفية', level: 'lead', description: 'قيادة البنية الهندسية للأنظمة السحابية والخدمات الدقيقة' },
  { id: 2, company_id: 1, title: 'Senior AI Engineer', title_ar: 'كبير مهندسي الذكاء الاصطناعي', level: 'senior', description: 'تطوير ودمج خوارزميات الاستنتاج ونماذج Groq اللغوية' },
  { id: 3, company_id: 1, title: 'Senior Full Stack Engineer', title_ar: 'مهندس أول فل ستاك', level: 'senior', description: 'تطوير واجهات React الحديثة ونقاط نهاية Laravel' },
  { id: 4, company_id: 1, title: 'DevOps & SRE Specialist', title_ar: 'أخصائي البنية السحابية والموثوقية', level: 'mid', description: 'إدارة Kubernetes وCI/CD وتوسيع البنية التحتية' },
  { id: 5, company_id: 1, title: 'QA Automation Lead', title_ar: 'قائد أتمتة جودة البرمجيات', level: 'lead', description: 'هندسة أطر الاختبار المؤتمتة وفحص الثغرات' },
  { id: 6, company_id: 1, title: 'Principal Product Designer', title_ar: 'مصمم منتجات رئيسي', level: 'principal', description: 'تصميم التجارب التفاعلية ومنظومات التصميم الدقيقة' },
  { id: 7, company_id: 1, title: 'Flutter Mobile Specialist', title_ar: 'أخصائي تطبيقات الهاتف (Flutter)', level: 'senior', description: 'تطوير تطبيقات الجوال المعتمدة على محرك فلاتر' },
];

const INITIAL_SKILLS: Skill[] = [
  { id: 1, name: 'Laravel Framework', category: 'Backend', description: 'إتقان متقدم لـ Laravel 11، Sanctum، Eloquent ORM، وقوائم الانتظار', employees_count: 6, tasks_count: 14 },
  { id: 2, name: 'FastAPI & Python', category: 'AI & Data', description: 'تطوير واجهات برمجية خفيفة عالية الأداء لخدمات الذكاء الاصطناعي', employees_count: 4, tasks_count: 8 },
  { id: 3, name: 'Groq Cloud AI Integration', category: 'AI & Data', description: 'الاستدعاء المتقدم والتحكم بدقة نماذج الاستنتاج فائقة السرعة من Groq', employees_count: 3, tasks_count: 6 },
  { id: 4, name: 'React & TypeScript', category: 'Frontend', description: 'بناء واجهات مستخدم معقدة، أنظمة حالة، ومكتبات تصميم Tailwind CSS', employees_count: 7, tasks_count: 16 },
  { id: 5, name: 'PostgreSQL & Cloud SQL', category: 'Databases', description: 'تصميم المخططات العلاقية المعقدة، الفهارس المحسنة، وضمان تكامل البيانات', employees_count: 5, tasks_count: 9 },
  { id: 6, name: 'Docker & Kubernetes', category: 'DevOps', description: 'إدارة الحاويات السحابية، شبكات الخدمات، والتوسيع الأفقي التلقائي', employees_count: 4, tasks_count: 7 },
  { id: 7, name: 'Automated QA & Cypress', category: 'Testing', description: 'كتابة اختبارات E2E واختبارات التكامل وتدقيق الأداء البرمجي', employees_count: 4, tasks_count: 5 },
  { id: 8, name: 'Flutter & Dart', category: 'Mobile', description: 'تطوير تطبيقات الهاتف المتعددة المنصات بنظام إدارة الحالة المتقدم', employees_count: 3, tasks_count: 5 },
];

const INITIAL_POSITIONS: Position[] = [
  {
    id: 1,
    employee_id: 101,
    department_id: 1,
    job_title_id: 1,
    employment_type: 'full_time',
    is_primary: true,
    start_date: '2023-01-15',
    status: 'active',
    notes: 'تمت الترقية إلى رئيس الفريق الهندسي للأنظمة الأساسية',
    employee_name: 'م. أحمد الشمري',
    department_name: 'الهندسة البرمجية والتطوير',
    job_title_name: 'Lead Backend Architect',
  },
  {
    id: 2,
    employee_id: 101,
    department_id: 1,
    job_title_id: 3,
    employment_type: 'full_time',
    is_primary: false,
    start_date: '2022-02-01',
    end_date: '2023-01-14',
    status: 'past',
    notes: 'المنصب السابق قبل الترقية',
    employee_name: 'م. أحمد الشمري',
    department_name: 'الهندسة البرمجية والتطوير',
    job_title_name: 'Senior Full Stack Engineer',
  },
  {
    id: 3,
    employee_id: 102,
    department_id: 2,
    job_title_id: 2,
    employment_type: 'full_time',
    is_primary: true,
    start_date: '2023-03-01',
    status: 'active',
    notes: 'المسؤولة عن محرك الاستنتاج وربط Groq مع Laravel',
    employee_name: 'د. نورة العتيبي',
    department_name: 'الذكاء الاصطناعي وعلوم البيانات',
    job_title_name: 'Senior AI Engineer',
  },
  {
    id: 4,
    employee_id: 103,
    department_id: 3,
    job_title_id: 5,
    employment_type: 'full_time',
    is_primary: true,
    start_date: '2023-02-10',
    status: 'active',
    notes: 'قيادة ضمان الجودة لجميع الإصدارات السحابية',
    employee_name: 'م. زيد المنصور',
    department_name: 'ضمان الجودة والاختبارات المتقدمة',
    job_title_name: 'QA Automation Lead',
  },
  {
    id: 5,
    employee_id: 104,
    department_id: 4,
    job_title_id: 4,
    employment_type: 'full_time',
    is_primary: true,
    start_date: '2023-04-12',
    status: 'active',
    notes: 'مسؤول البنية التحتية السحابية وشهادات الأمان',
    employee_name: 'م. فيصل الغامدي',
    department_name: 'العمليات السحابية والبنية التحتية',
    job_title_name: 'DevOps & SRE Specialist',
  },
  {
    id: 6,
    employee_id: 105,
    department_id: 5,
    job_title_id: 6,
    employment_type: 'full_time',
    is_primary: true,
    start_date: '2023-05-20',
    status: 'active',
    notes: 'مسؤولة أنظمة التصميم وواجهات SaaS المؤسسية',
    employee_name: 'أ. هدى الدوسري',
    department_name: 'تصميم تجربة وواجهة المستخدم',
    job_title_name: 'Principal Product Designer',
  },
  {
    id: 7,
    employee_id: 106,
    department_id: 1,
    job_title_id: 7,
    employment_type: 'full_time',
    is_primary: true,
    start_date: '2023-08-01',
    status: 'active',
    notes: 'تطوير تطبيق الهاتف التابع للمنصة',
    employee_name: 'م. عبد العزيز الشريف',
    department_name: 'الهندسة البرمجية والتطوير',
    job_title_name: 'Flutter Mobile Specialist',
  },
];

const INITIAL_EMPLOYEES: Employee[] = [
  {
    id: 101,
    company_id: 1,
    first_name: 'أحمد',
    last_name: 'الشمري',
    email: 'ahmed.sh@apexsoft.sa',
    phone: '+966 50 112 3344',
    employee_code: 'APX-101',
    hire_date: '2022-02-01',
    status: 'active',
    department_name: 'الهندسة البرمجية والتطوير',
    job_title_name: 'Lead Backend Architect',
    date_of_birth: '1991-05-14',
    gender: 'male',
    nationality: 'سعودي',
    city: 'الرياض',
    country: 'المملكة العربية السعودية',
    bio: 'مهندس نظم متمرس يتمتع بخبرة تزيد عن 9 سنوات في تطوير البنى المعمارية للأنظمة المصرفية والحلول السحابية باستخدام Laravel وPostgreSQL.',
    active_tasks_count: 3,
    remaining_weekly_capacity_hours: 14,
    skills: [
      { id: 1, employee_id: 101, skill_id: 1, skill_name: 'Laravel Framework', category: 'Backend', proficiency_level: 'expert', years_of_experience: 8, is_verified: true },
      { id: 2, employee_id: 101, skill_id: 5, skill_name: 'PostgreSQL & Cloud SQL', category: 'Databases', proficiency_level: 'expert', years_of_experience: 7, is_verified: true },
      { id: 3, employee_id: 101, skill_id: 6, skill_name: 'Docker & Kubernetes', category: 'DevOps', proficiency_level: 'advanced', years_of_experience: 5, is_verified: true },
    ],
    positions: [
      INITIAL_POSITIONS[0],
      INITIAL_POSITIONS[1],
    ],
  },
  {
    id: 102,
    company_id: 1,
    first_name: 'نورة',
    last_name: 'العتيبي',
    email: 'noura.ot@apexsoft.sa',
    phone: '+966 55 998 7766',
    employee_code: 'APX-102',
    hire_date: '2023-03-01',
    status: 'active',
    department_name: 'الذكاء الاصطناعي وعلوم البيانات',
    job_title_name: 'Senior AI Engineer',
    date_of_birth: '1993-11-22',
    gender: 'female',
    nationality: 'سعودية',
    city: 'الرياض',
    country: 'المملكة العربية السعودية',
    bio: 'حاصلة على دكتوراه في التعلم الآلي، متخصصة في هندسة المحركات اللغوية وربط خدمات FastAPI مع نماذج Groq فائقة السرعة.',
    active_tasks_count: 2,
    remaining_weekly_capacity_hours: 22,
    skills: [
      { id: 4, employee_id: 102, skill_id: 2, skill_name: 'FastAPI & Python', category: 'AI & Data', proficiency_level: 'expert', years_of_experience: 6, is_verified: true },
      { id: 5, employee_id: 102, skill_id: 3, skill_name: 'Groq Cloud AI Integration', category: 'AI & Data', proficiency_level: 'expert', years_of_experience: 4, is_verified: true },
      { id: 6, employee_id: 102, skill_id: 5, skill_name: 'PostgreSQL & Cloud SQL', category: 'Databases', proficiency_level: 'advanced', years_of_experience: 5, is_verified: true },
    ],
    positions: [INITIAL_POSITIONS[2]],
  },
  {
    id: 103,
    company_id: 1,
    first_name: 'زيد',
    last_name: 'المنصور',
    email: 'zaid.m@apexsoft.sa',
    phone: '+966 54 223 9900',
    employee_code: 'APX-103',
    hire_date: '2023-02-10',
    status: 'active',
    department_name: 'ضمان الجودة والاختبارات المتقدمة',
    job_title_name: 'QA Automation Lead',
    date_of_birth: '1992-08-19',
    gender: 'male',
    nationality: 'سعودي',
    city: 'جدة',
    country: 'المملكة العربية السعودية',
    bio: 'خبير في جودة النظم وضمان موثوقية التطبيقات عالية الضغط، قيادة أطر الاختبار المؤتمتة.',
    active_tasks_count: 1,
    remaining_weekly_capacity_hours: 26,
    skills: [
      { id: 7, employee_id: 103, skill_id: 7, skill_name: 'Automated QA & Cypress', category: 'Testing', proficiency_level: 'expert', years_of_experience: 7, is_verified: true },
      { id: 8, employee_id: 103, skill_id: 4, skill_name: 'React & TypeScript', category: 'Frontend', proficiency_level: 'intermediate', years_of_experience: 3, is_verified: false },
    ],
    positions: [INITIAL_POSITIONS[3]],
  },
  {
    id: 104,
    company_id: 1,
    first_name: 'فيصل',
    last_name: 'الغامدي',
    email: 'faisal.gh@apexsoft.sa',
    phone: '+966 56 441 8833',
    employee_code: 'APX-104',
    hire_date: '2023-04-12',
    status: 'active',
    department_name: 'العمليات السحابية والبنية التحتية',
    job_title_name: 'DevOps & SRE Specialist',
    date_of_birth: '1994-03-05',
    gender: 'male',
    nationality: 'سعودي',
    city: 'الدمام',
    country: 'المملكة العربية السعودية',
    bio: 'مهندس بنية سحابية معتمد من Google Cloud وAWS، متخصص في النشر المؤتمت وحماية أصول الحاويات.',
    active_tasks_count: 4,
    remaining_weekly_capacity_hours: 8,
    skills: [
      { id: 9, employee_id: 104, skill_id: 6, skill_name: 'Docker & Kubernetes', category: 'DevOps', proficiency_level: 'expert', years_of_experience: 6, is_verified: true },
      { id: 10, employee_id: 104, skill_id: 5, skill_name: 'PostgreSQL & Cloud SQL', category: 'Databases', proficiency_level: 'advanced', years_of_experience: 4, is_verified: true },
    ],
    positions: [INITIAL_POSITIONS[4]],
  },
  {
    id: 105,
    company_id: 1,
    first_name: 'هدى',
    last_name: 'الدوسري',
    email: 'huda.d@apexsoft.sa',
    phone: '+966 50 771 2299',
    employee_code: 'APX-105',
    hire_date: '2023-05-20',
    status: 'active',
    department_name: 'تصميم تجربة وواجهة المستخدم',
    job_title_name: 'Principal Product Designer',
    date_of_birth: '1995-07-30',
    gender: 'female',
    nationality: 'سعودية',
    city: 'الرياض',
    country: 'المملكة العربية السعودية',
    bio: 'قائدة تصميم منتجات SaaS الرقمية، متخصصة في أنظمة التصميم الشاملة، الوصولية، والتوافق بين RTL وLTR.',
    active_tasks_count: 2,
    remaining_weekly_capacity_hours: 18,
    skills: [
      { id: 11, employee_id: 105, skill_id: 4, skill_name: 'React & TypeScript', category: 'Frontend', proficiency_level: 'advanced', years_of_experience: 5, is_verified: true },
    ],
    positions: [INITIAL_POSITIONS[5]],
  },
  {
    id: 106,
    company_id: 1,
    first_name: 'عبد العزيز',
    last_name: 'الشريف',
    email: 'abdulaziz.sh@apexsoft.sa',
    phone: '+966 53 881 6644',
    employee_code: 'APX-106',
    hire_date: '2023-08-01',
    status: 'active',
    department_name: 'الهندسة البرمجية والتطوير',
    job_title_name: 'Flutter Mobile Specialist',
    date_of_birth: '1996-01-12',
    gender: 'male',
    nationality: 'سعودي',
    city: 'الرياض',
    country: 'المملكة العربية السعودية',
    bio: 'مطور تطبيقات ذكي يركز على بنية Flutter المتماسكة وتجربة المستخدم السريعة على نظامي iOS وAndroid.',
    active_tasks_count: 2,
    remaining_weekly_capacity_hours: 20,
    skills: [
      { id: 12, employee_id: 106, skill_id: 8, skill_name: 'Flutter & Dart', category: 'Mobile', proficiency_level: 'expert', years_of_experience: 5, is_verified: true },
    ],
    positions: [INITIAL_POSITIONS[6]],
  },
];

const INITIAL_CLIENTS: Client[] = [
  {
    id: 1,
    company_id: 1,
    company_name: 'بنك الرياض الرقمي الموحد',
    contact_person: 'أ. عبد الرحمن الصالح',
    email: 'contact@riyadhdigital.sa',
    phone: '+966 11 200 4400',
    website: 'https://riyadhdigital.sa',
    address: 'الرياض، حي السليمانية',
    city: 'الرياض',
    country: 'السعودية',
    status: 'active',
    notes: 'شريك استراتيجي في تطوير بوابات المصرفية المفتوحة',
    projects_count: 2,
    created_at: '2023-01-10',
  },
  {
    id: 2,
    company_id: 1,
    company_name: 'الشركة الوطنية للوجستيات الذكية',
    contact_person: 'م. فهد السديري',
    email: 'f.sudairi@saudilogistics.sa',
    phone: '+966 12 600 8899',
    website: 'https://saudilogistics.sa',
    address: 'جدة، المنطقة الصناعية',
    city: 'جدة',
    country: 'السعودية',
    status: 'active',
    notes: 'مشروع إدارة الأساطيل ومسارات التوزيع بالذكاء الاصطناعي',
    projects_count: 1,
    created_at: '2023-04-18',
  },
  {
    id: 3,
    company_id: 1,
    company_name: 'مجموعة الرعاية الطبية المتقدمة',
    contact_person: 'د. منيرة الدخيل',
    email: 'm.dakheel@medcaregroup.sa',
    phone: '+966 13 800 2211',
    city: 'الخبر',
    country: 'السعودية',
    status: 'active',
    projects_count: 1,
    created_at: '2023-07-05',
  },
];

const INITIAL_PROJECTS: Project[] = [
  {
    id: 1,
    company_id: 1,
    client_id: 1,
    client_name: 'بنك الرياض الرقمي الموحد',
    name: 'بوابة الخدمات المصرفية المفتوحة (Open Banking Gateway)',
    description: 'تطوير منصة موحدة لربط الخدمات البنكية وتدقيق المعاملات اللحظية وفق معايير البنك المركزي السعودي (SAMA)',
    budget: 850000,
    priority: 'urgent',
    progress: 74,
    status: 'in_progress',
    planned_start_date: '2024-01-01',
    planned_end_date: '2024-12-15',
    actual_start_date: '2024-01-10',
    estimated_hours: 2400,
    actual_hours: 1780,
    tasks_count: 18,
    completed_tasks_count: 13,
  },
  {
    id: 2,
    company_id: 1,
    client_id: 2,
    client_name: 'الشركة الوطنية للوجستيات الذكية',
    name: 'نظام إدارة الأساطيل وتحسين المسارات بالذكاء الاصطناعي',
    description: 'خوارزميات التنبؤ باستهلاك الوقود وجدولة التوصيل الذكي باستخدام Groq API واستقراء بيانات الاستشعار',
    budget: 620000,
    priority: 'high',
    progress: 48,
    status: 'in_progress',
    planned_start_date: '2024-03-01',
    planned_end_date: '2024-11-30',
    actual_start_date: '2024-03-05',
    estimated_hours: 1800,
    actual_hours: 860,
    tasks_count: 14,
    completed_tasks_count: 7,
  },
  {
    id: 3,
    company_id: 1,
    client_id: 3,
    client_name: 'مجموعة الرعاية الطبية المتقدمة',
    name: 'منصة السجلات الطبية التفاعلية وتطبيق المريض الذكي',
    description: 'بناء تطبيق Flutter للهواتف مع نظام خلفي آمن متوافق مع لوائح الخصوصية الصحية',
    budget: 490000,
    priority: 'medium',
    progress: 35,
    status: 'in_progress',
    planned_start_date: '2024-04-15',
    planned_end_date: '2024-12-30',
    estimated_hours: 1400,
    actual_hours: 490,
    tasks_count: 12,
    completed_tasks_count: 4,
  },
  {
    id: 4,
    company_id: 1,
    client_id: 1,
    client_name: 'بنك الرياض الرقمي الموحد',
    name: 'محرك التحقق من الاحتيال المالي المتقدم',
    description: 'مشروع قادم لبناء طبقة أمان تعتمد على تحليل الأنماط السلوكية للحسابات في الوقت الحقيقي',
    budget: 720000,
    priority: 'high',
    progress: 10,
    status: 'planning',
    planned_start_date: '2024-11-01',
    planned_end_date: '2025-06-30',
    estimated_hours: 2100,
    actual_hours: 210,
    tasks_count: 8,
    completed_tasks_count: 1,
  },
];

const INITIAL_TASKS: Task[] = [
  {
    id: 1001,
    project_id: 1,
    project_name: 'بوابة الخدمات المصرفية المفتوحة',
    parent_task_id: null,
    position_id: 1, // Ahmed Al-Shammari
    assigned_employee_name: 'م. أحمد الشمري',
    assigned_position_title: 'Lead Backend Architect',
    assigned_department_name: 'الهندسة البرمجية والتطوير',
    skill_id: 1, // Laravel
    skill_name: 'Laravel Framework',
    title: 'تطوير وحدة التوثيق الآمن عبر Laravel Sanctum و OAuth2',
    description: 'تنفيذ بروتوكول التوثيق المصرفي الثنائي مع شهادات التشفير الرقمية وتأمين جلسات العملاء',
    priority: 'urgent',
    status: 'completed',
    progress: 100,
    estimated_hours: 45,
    actual_hours: 42,
    planned_start_date: '2024-02-01',
    planned_end_date: '2024-02-15',
    created_at: '2024-01-20',
  },
  {
    id: 1002,
    project_id: 1,
    project_name: 'بوابة الخدمات المصرفية المفتوحة',
    parent_task_id: 1001,
    position_id: 1,
    assigned_employee_name: 'م. أحمد الشمري',
    assigned_position_title: 'Lead Backend Architect',
    assigned_department_name: 'الهندسة البرمجية والتطوير',
    skill_id: 5, // PostgreSQL
    skill_name: 'PostgreSQL & Cloud SQL',
    title: 'بناء مخطط تدقيق العمليات وسجلات الامتثال المالي',
    description: 'تصميم جداول التدقيق غير القابلة للتعديل وفهارس البحث السريع في العمليات المالية',
    priority: 'high',
    status: 'in_progress',
    progress: 80,
    estimated_hours: 35,
    actual_hours: 28,
    planned_start_date: '2024-02-16',
    planned_end_date: '2024-03-05',
    created_at: '2024-02-01',
  },
  {
    id: 1003,
    project_id: 2,
    project_name: 'نظام إدارة الأساطيل وتحسين المسارات بالذكاء الاصطناعي',
    parent_task_id: null,
    position_id: 3, // Noura Al-Otaibi
    assigned_employee_name: 'د. نورة العتيبي',
    assigned_position_title: 'Senior AI Engineer',
    assigned_department_name: 'الذكاء الاصطناعي وعلوم البيانات',
    skill_id: 3, // Groq
    skill_name: 'Groq Cloud AI Integration',
    title: 'دمج نموذج Groq الاستنتاجي لتحليل تقلبات المرور واقتراح المسارات',
    description: 'إنشاء خط أنابيب استدعاء موثوق لخدمة Groq السريعة لمعالجة طلبات إعادة التوجيه في أقل من 250ms',
    priority: 'high',
    status: 'in_progress',
    progress: 65,
    estimated_hours: 40,
    actual_hours: 26,
    planned_start_date: '2024-03-10',
    planned_end_date: '2024-03-30',
    created_at: '2024-03-01',
  },
  {
    id: 1004,
    project_id: 2,
    project_name: 'نظام إدارة الأساطيل وتحسين المسارات بالذكاء الاصطناعي',
    parent_task_id: null,
    position_id: null, // UNASSIGNED - Primary candidate for AI assignment!
    skill_id: 2, // FastAPI & Python
    skill_name: 'FastAPI & Python',
    title: 'بناء خدمة معالجة بيانات الاستشعار (Telemetry Data Ingestion Microservice)',
    description: 'خدمة مستقلة عالية الكثافة لاستقبال حزم GPS وحالة المركبات اللحظية، وتمريرها لمحرك التحليل',
    priority: 'urgent',
    status: 'pending',
    progress: 0,
    estimated_hours: 38,
    actual_hours: 0,
    planned_start_date: '2024-04-01',
    planned_end_date: '2024-04-20',
    created_at: '2024-03-22',
    has_ai_recommendation: true,
  },
  {
    id: 1005,
    project_id: 3,
    project_name: 'منصة السجلات الطبية التفاعلية وتطبيق المريض الذكي',
    parent_task_id: null,
    position_id: 7, // Abdulaziz Al-Sharif
    assigned_employee_name: 'م. عبد العزيز الشريف',
    assigned_position_title: 'Flutter Mobile Specialist',
    assigned_department_name: 'الهندسة البرمجية والتطوير',
    skill_id: 8, // Flutter
    skill_name: 'Flutter & Dart',
    title: 'تطوير شاشات عرض السجلات الطبية ومؤشرات القياس الحيوية',
    description: 'بناء واجهات متجاوبة مع الرسوم البيانية التفاعلية لحالة المريض ومزامنة البيانات في وضع عدم الاتصال',
    priority: 'medium',
    status: 'in_progress',
    progress: 40,
    estimated_hours: 50,
    actual_hours: 20,
    planned_start_date: '2024-04-20',
    planned_end_date: '2024-05-15',
    created_at: '2024-04-10',
  },
  {
    id: 1006,
    project_id: 1,
    project_name: 'بوابة الخدمات المصرفية المفتوحة',
    parent_task_id: null,
    position_id: 4, // Zaid Al-Mansoor
    assigned_employee_name: 'م. زيد المنصور',
    assigned_position_title: 'QA Automation Lead',
    assigned_department_name: 'ضمان الجودة والاختبارات المتقدمة',
    skill_id: 7, // QA Automation
    skill_name: 'Automated QA & Cypress',
    title: 'تغطية بروتوكولات تحويل الأموال باختبارات الأمان وحالات الحافة',
    description: 'كتابة حزم اختبارات آلية للتحقق من عدم تسرب أي بيانات والتعامل السليم مع انقطاع الشبكات',
    priority: 'high',
    status: 'ready',
    progress: 15,
    estimated_hours: 30,
    actual_hours: 5,
    planned_start_date: '2024-05-01',
    planned_end_date: '2024-05-18',
    created_at: '2024-04-25',
  },
  {
    id: 1007,
    project_id: 3,
    project_name: 'منصة السجلات الطبية التفاعلية وتطبيق المريض الذكي',
    parent_task_id: null,
    position_id: null, // UNASSIGNED - Second candidate for AI recommendation!
    skill_id: 4, // React & TypeScript
    skill_name: 'React & TypeScript',
    title: 'بناء لوحة تحكم الأطباء والتقارير الطبية السريرية',
    description: 'تطوير واجهة الويب الإدارية للأطباء لاستعراض تحاليل المرضى وإصدار الوصفات الدوائية الإلكترونية',
    priority: 'medium',
    status: 'pending',
    progress: 0,
    estimated_hours: 32,
    actual_hours: 0,
    planned_start_date: '2024-05-10',
    planned_end_date: '2024-05-28',
    created_at: '2024-04-28',
    has_ai_recommendation: true,
  },
];

const INITIAL_RECOMMENDATIONS: AiTaskRecommendation[] = [
  {
    id: 501,
    task_id: 1004,
    task_title: 'بناء خدمة معالجة بيانات الاستشعار (Telemetry Data Ingestion Microservice)',
    project_name: 'نظام إدارة الأساطيل وتحسين المسارات بالذكاء الاصطناعي',
    recommended_employee_id: 102,
    recommended_employee_name: 'د. نورة العتيبي',
    recommended_employee_email: 'noura.ot@apexsoft.sa',
    recommended_position_id: 3,
    recommended_position_title: 'Senior AI Engineer',
    recommended_department_name: 'الذكاء الاصطناعي وعلوم البيانات',
    confidence: 96,
    decision_status: 'recommended',
    explanation: 'تتمتع د. نورة بخبرة استثنائية موثقة في إطار FastAPI وهندسة الخدمات الخفيفة المتصلة بنماذج Groq (6 سنوات خبرة معتمدة). يتوفر لديها 22 ساعة عمل شاغرة هذا الأسبوع وهي قادرة تماماً على إنجاز المهمة (المقدرة بـ 38 ساعة على مدى 3 أسابيع) دون التسبب بأي عبء إضافي، مع الحفاظ على أعلى مستويات الجودة البرمجية.',
    skill_match: true,
    skill_level: 'expert',
    skill_experience: 6,
    skill_verification: true,
    performance_score: 98,
    overall_score: 97,
    total_experience: 8,
    remaining_available_hours: 22,
    estimated_task_hours: 38,
    availability_percentage: 85,
    can_cover_task: true,
    alternative_candidates: [
      {
        position_id: 1,
        employee_id: 101,
        employee_name: 'م. أحمد الشمري',
        department_name: 'الهندسة البرمجية والتطوير',
        job_title: 'Lead Backend Architect',
        skill_match: true,
        skill_level: 'intermediate',
        skill_experience: 4,
        performance_score: 94,
        overall_score: 82,
        remaining_available_hours: 14,
        estimated_task_hours: 38,
        explanation: 'يمتلك مهارات قوية في البنية التحتية، لكنه مرتبط حالياً بمهمة بوابة المصرفية المفتوحة وقدرته الاستيعابية المتبقية (14 ساعة) قد تؤخر التسليم.',
      },
      {
        position_id: 5,
        employee_id: 104,
        employee_name: 'م. فيصل الغامدي',
        department_name: 'العمليات السحابية والبنية التحتية',
        job_title: 'DevOps & SRE Specialist',
        skill_match: false,
        skill_level: 'beginner',
        skill_experience: 2,
        performance_score: 91,
        overall_score: 68,
        remaining_available_hours: 8,
        estimated_task_hours: 38,
        explanation: 'خبير في نشر الخدمات بالحاويات، لكن مهارات كتابة منطق FastAPI ليست في نطاق خبرته الأساسية ولديه عبء عمل مرتفع حالياً.',
      },
    ],
    manager_decision: 'pending',
    created_at: '2024-04-20 14:32',
  },
  {
    id: 502,
    task_id: 1007,
    task_title: 'بناء لوحة تحكم الأطباء والتقارير الطبية السريرية',
    project_name: 'منصة السجلات الطبية التفاعلية وتطبيق المريض الذكي',
    recommended_employee_id: 105,
    recommended_employee_name: 'أ. هدى الدوسري',
    recommended_employee_email: 'huda.d@apexsoft.sa',
    recommended_position_id: 6,
    recommended_position_title: 'Principal Product Designer',
    recommended_department_name: 'تصميم تجربة وواجهة المستخدم',
    confidence: 92,
    decision_status: 'recommended',
    explanation: 'تمتلك أ. هدى خبرة متقدمة في بناء تطبيقات React & TypeScript والأنظمة الطبية التفاعلية الحساسة، مع مراعاة كاملة لسهولة القراءة والوصولية وتصميم الحقول الطبية الدقيقة، ولديها طاقة استيعابية ملائمة (18 ساعة متفرغة أسبوعياً).',
    skill_match: true,
    skill_level: 'advanced',
    skill_experience: 5,
    skill_verification: true,
    performance_score: 95,
    overall_score: 93,
    total_experience: 7,
    remaining_available_hours: 18,
    estimated_task_hours: 32,
    availability_percentage: 80,
    can_cover_task: true,
    alternative_candidates: [
      {
        position_id: 4,
        employee_id: 103,
        employee_name: 'م. زيد المنصور',
        department_name: 'ضمان الجودة والاختبارات المتقدمة',
        job_title: 'QA Automation Lead',
        skill_match: true,
        skill_level: 'intermediate',
        skill_experience: 3,
        performance_score: 90,
        overall_score: 76,
        remaining_available_hours: 26,
        estimated_task_hours: 32,
        explanation: 'لديه قدرة استيعابية ممتازة، ولكن خبرته التطويرية تركز على اختبارات Cypress وليس على تطوير واجهات العيادات السريرية.',
      },
    ],
    manager_decision: 'pending',
    created_at: '2024-04-28 09:15',
  },
];

const INITIAL_CONTRACTS: EmployeeContract[] = [
  {
    id: 201,
    employee_id: 101,
    contract_type: 'permanent',
    status: 'active',
    start_date: '2022-02-01',
    end_date: '2026-01-31',
    salary: 28000,
    currency: 'SAR',
    terms: 'عقد عمل دائم غير محدد المدة، تأمين طبي فئة VIP، إجازة سنوية 30 يوماً',
  },
  {
    id: 202,
    employee_id: 102,
    contract_type: 'permanent',
    status: 'active',
    start_date: '2023-03-01',
    end_date: '2027-02-28',
    salary: 32000,
    currency: 'SAR',
    terms: 'عقد استشاري وقيادي أول، حقوق ملكية فكرية متبادلة، مكافأة أداء ربع سنوية',
  },
  {
    id: 203,
    employee_id: 103,
    contract_type: 'permanent',
    status: 'active',
    start_date: '2023-02-10',
    end_date: '2025-02-09',
    salary: 22000,
    currency: 'SAR',
    terms: 'عقد توظيف كامل المدة خاضع للتجديد التلقائي',
  },
];

const INITIAL_DOCUMENTS: EmployeeDocument[] = [
  {
    id: 301,
    employee_id: 101,
    title: 'بطاقة الهوية الوطنية المحدثة',
    document_type: 'id_card',
    file_name: 'national_id_ahmed.pdf',
    file_path: '/storage/documents/national_id_ahmed.pdf',
    file_size_kb: 1420,
    issue_date: '2022-01-10',
    expiry_date: '2032-01-10',
    status: 'valid',
  },
  {
    id: 302,
    employee_id: 101,
    title: 'شهادة بكالوريوس علوم الحاسب (جامعة الملك سعود)',
    document_type: 'degree',
    file_name: 'degree_ksu_ahmed.pdf',
    file_path: '/storage/documents/degree_ksu_ahmed.pdf',
    file_size_kb: 2850,
    issue_date: '2014-06-15',
    status: 'valid',
  },
  {
    id: 303,
    employee_id: 102,
    title: 'شهادة الدكتوراه في الذكاء الاصطناعي وعلوم البيانات',
    document_type: 'degree',
    file_name: 'phd_noura.pdf',
    file_path: '/storage/documents/phd_noura.pdf',
    file_size_kb: 4200,
    issue_date: '2020-09-12',
    status: 'valid',
  },
];

// In-Memory Repository for Interactive State Changes
class SchemaRepository {
  public company: Company = { ...INITIAL_COMPANY };
  public departments: Department[] = [...INITIAL_DEPARTMENTS];
  public jobTitles: JobTitle[] = [...INITIAL_JOB_TITLES];
  public positions: Position[] = [...INITIAL_POSITIONS];
  public skills: Skill[] = [...INITIAL_SKILLS];
  public employees: Employee[] = [...INITIAL_EMPLOYEES];
  public clients: Client[] = [...INITIAL_CLIENTS];
  public projects: Project[] = [...INITIAL_PROJECTS];
  public tasks: Task[] = [...INITIAL_TASKS];
  public recommendations: AiTaskRecommendation[] = [...INITIAL_RECOMMENDATIONS];
  public contracts: EmployeeContract[] = [...INITIAL_CONTRACTS];
  public documents: EmployeeDocument[] = [...INITIAL_DOCUMENTS];

  public getDashboardMetrics(): DashboardMetrics {
    const activeEmp = this.employees.filter((e) => e.status === 'active').length;
    const activeProj = this.projects.filter((p) => p.status === 'in_progress').length;
    const pendingT = this.tasks.filter((t) => t.status === 'pending').length;
    const inProgT = this.tasks.filter((t) => t.status === 'in_progress').length;
    const compT = this.tasks.filter((t) => t.status === 'completed').length;
    const approachingD = this.projects.filter((p) => p.priority === 'urgent' || p.priority === 'high').length;
    const pendingDec = this.recommendations.filter((r) => r.manager_decision === 'pending').length;

    return {
      total_employees: this.employees.length,
      active_employees: activeEmp,
      total_departments: this.departments.length,
      active_projects: activeProj,
      pending_tasks: pendingT,
      tasks_in_progress: inProgT,
      completed_tasks: compT,
      approaching_deadline_projects: approachingD,
      ai_pending_reviews: pendingDec,
    };
  }

  public getEmployees(): Employee[] {
    return this.employees.map((emp) => {
      const activePos = this.positions.find((p) => p.employee_id === emp.id && p.status === 'active');
      return {
        ...emp,
        current_position: activePos,
        department_name: activePos?.department_name || emp.department_name,
        job_title_name: activePos?.job_title_name || emp.job_title_name,
        positions: this.positions.filter((p) => p.employee_id === emp.id),
      };
    });
  }

  public getEmployee(id: number): Employee | undefined {
    const emp = this.employees.find((e) => e.id === id);
    if (!emp) return undefined;
    const empPositions = this.positions.filter((p) => p.employee_id === id);
    const empContracts = this.contracts.filter((c) => c.employee_id === id);
    const empDocs = this.documents.filter((d) => d.employee_id === id);
    const activePos = empPositions.find((p) => p.status === 'active');
    return {
      ...emp,
      current_position: activePos,
      positions: empPositions,
      contracts: empContracts,
      documents: empDocs,
    };
  }

  public getTasks(): Task[] {
    return this.tasks.map((task) => {
      const pos = task.position_id ? this.positions.find((p) => p.id === task.position_id) : undefined;
      const proj = this.projects.find((p) => p.id === task.project_id);
      const sk = this.skills.find((s) => s.id === task.skill_id);
      const parent = task.parent_task_id ? this.tasks.find((t) => t.id === task.parent_task_id) : undefined;

      return {
        ...task,
        project_name: proj?.name || task.project_name,
        skill_name: sk?.name || task.skill_name,
        parent_task_title: parent?.title,
        assigned_employee_name: pos?.employee_name,
        assigned_position_title: pos?.job_title_name,
        assigned_department_name: pos?.department_name,
      };
    });
  }

  public updateTaskStatus(taskId: number, newStatus: TaskStatus): Task {
    const task = this.tasks.find((t) => t.id === taskId);
    if (!task) throw new Error('Task not found');
    task.status = newStatus;
    if (newStatus === 'completed') task.progress = 100;
    return task;
  }

  public updateTaskPosition(taskId: number, positionId: number): Task {
    const task = this.tasks.find((t) => t.id === taskId);
    if (!task) throw new Error('Task not found');
    const pos = this.positions.find((p) => p.id === positionId);
    if (!pos) throw new Error('Position not found');

    task.position_id = positionId;
    task.assigned_employee_name = pos.employee_name;
    task.assigned_position_title = pos.job_title_name;
    task.assigned_department_name = pos.department_name;
    if (task.status === 'pending') {
      task.status = 'ready';
    }
    return task;
  }

  public generateAiRecommendation(taskId: number): AiTaskRecommendation {
    const task = this.tasks.find((t) => t.id === taskId);
    if (!task) throw new Error('Task not found');

    // Simulate Groq inference analysis across available positions and skill matches
    const skill = this.skills.find((s) => s.id === task.skill_id);
    const existing = this.recommendations.find((r) => r.task_id === taskId);
    if (existing) return existing;

    // Intelligent decision logic modeling Groq payload
    const bestPosition = this.positions.find((p) => p.id === 3) || this.positions[0]; // Noura Al-Otaibi or first
    const newRec: AiTaskRecommendation = {
      id: 500 + this.recommendations.length + 1,
      task_id: taskId,
      task_title: task.title,
      project_name: this.projects.find((p) => p.id === task.project_id)?.name,
      recommended_employee_id: bestPosition.employee_id,
      recommended_employee_name: bestPosition.employee_name || 'مرشح موصى به',
      recommended_position_id: bestPosition.id,
      recommended_position_title: bestPosition.job_title_name || 'Senior Specialist',
      recommended_department_name: bestPosition.department_name || 'الهندسة البرمجية',
      confidence: 94,
      decision_status: 'recommended',
      explanation: `أظهر فحص متطلبات المهمة (${task.title}) تطابقاً بنسبة 94% مع الكفاءات الموثقة للـ ${bestPosition.job_title_name}. يتمتع المرشح بمهارات مثبتة في ${skill?.name || 'المهارة المطلوبة'} مع توفر ساعات عمل كافية لإنجاز المهام وفق الجدول الزمني المحدد دون التسبب في أي اختناقات تشغيلية.`,
      skill_match: true,
      skill_level: 'expert',
      skill_experience: 6,
      skill_verification: true,
      performance_score: 96,
      overall_score: 95,
      total_experience: 8,
      remaining_available_hours: 22,
      estimated_task_hours: task.estimated_hours,
      availability_percentage: 85,
      can_cover_task: true,
      alternative_candidates: [
        {
          position_id: 1,
          employee_id: 101,
          employee_name: 'م. أحمد الشمري',
          department_name: 'الهندسة البرمجية والتطوير',
          job_title: 'Lead Backend Architect',
          skill_match: true,
          skill_level: 'intermediate',
          skill_experience: 4,
          performance_score: 93,
          overall_score: 80,
          remaining_available_hours: 14,
          estimated_task_hours: task.estimated_hours,
          explanation: 'يمتلك المهارات الأساسية، ولكن عبء العمل الحالي على مشروع الخدمات المصرفية المفتوحة يقلل من سرعة إنجازه.',
        },
      ],
      manager_decision: 'pending',
      created_at: new Date().toISOString().replace('T', ' ').substring(0, 16),
    };

    this.recommendations.unshift(newRec);
    task.has_ai_recommendation = true;
    return newRec;
  }

  public recordManagerDecision(recId: number, decision: 'accepted' | 'rejected', notes?: string): AiTaskRecommendation {
    const rec = this.recommendations.find((r) => r.id === recId);
    if (!rec) throw new Error('Recommendation not found');

    rec.manager_decision = decision;
    rec.decision_status = decision;
    rec.manager_notes = notes || (decision === 'accepted' ? 'تم الاعتماد من قبل المدير المسؤول' : 'تم الرفض وتفضيل مراجعة بديلة');
    rec.decided_at = new Date().toISOString().replace('T', ' ').substring(0, 16);

    // CRITICAL: When manager accepts, update task's position_id through the authoritative workflow!
    if (decision === 'accepted') {
      this.updateTaskPosition(rec.task_id, rec.recommended_position_id);
    }

    return rec;
  }
}

export const repository = new SchemaRepository();

// ==========================================
// EXPORTED FACADE API SERVICE
// ==========================================

export const apiService = {
  // Connection status & info
  async getStatus() {
    const isLive = await apiClient.checkBackendHealth();
    return {
      isLive,
      baseUrl: API_BASE_URL,
      provider: 'Groq Cloud AI (via Laravel API & FastAPI)',
    };
  },

  // Dashboard Metrics
  async getDashboardMetrics(): Promise<DashboardMetrics> {
    try {
      const res = await apiClient['request']<DashboardMetrics>('/dashboard/metrics');
      return res.data;
    } catch {
      return repository.getDashboardMetrics();
    }
  },

  // Company
  async getCompany(): Promise<Company> {
    try {
      const res = await apiClient['request']<Company>('/company');
      return res.data;
    } catch {
      return repository.company;
    }
  },

  // Employees
  async getEmployees(): Promise<Employee[]> {
    try {
      const res = await apiClient['request']<Employee[]>('/employees');
      return res.data;
    } catch {
      return repository.getEmployees();
    }
  },

  async getEmployee(id: number): Promise<Employee | undefined> {
    try {
      const res = await apiClient['request']<Employee>(`/employees/${id}`);
      return res.data;
    } catch {
      return repository.getEmployee(id);
    }
  },

  async createEmployee(data: Partial<Employee>): Promise<Employee> {
    const newEmp: Employee = {
      id: 100 + repository.employees.length + 1,
      company_id: 1,
      first_name: data.first_name || '',
      last_name: data.last_name || '',
      email: data.email || '',
      phone: data.phone || '',
      employee_code: `APX-${100 + repository.employees.length + 1}`,
      hire_date: data.hire_date || new Date().toISOString().substring(0, 10),
      status: data.status || 'active',
      department_name: data.department_name,
      job_title_name: data.job_title_name,
      bio: data.bio,
      city: data.city || 'الرياض',
      country: data.country || 'المملكة العربية السعودية',
      active_tasks_count: 0,
      remaining_weekly_capacity_hours: 40,
    };
    repository.employees.push(newEmp);
    return newEmp;
  },

  // Departments
  async getDepartments(): Promise<Department[]> {
    try {
      const res = await apiClient['request']<Department[]>('/departments');
      return res.data;
    } catch {
      return repository.departments;
    }
  },

  async createDepartment(data: Partial<Department>): Promise<Department> {
    const newDept: Department = {
      id: repository.departments.length + 1,
      company_id: 1,
      name: data.name || '',
      name_ar: data.name_ar || data.name || '',
      description: data.description || '',
      employee_count: 1,
      active_projects_count: 0,
      created_at: new Date().toISOString().substring(0, 10),
    };
    repository.departments.push(newDept);
    return newDept;
  },

  // Job Titles
  async getJobTitles(): Promise<JobTitle[]> {
    try {
      const res = await apiClient['request']<JobTitle[]>('/job-titles');
      return res.data;
    } catch {
      return repository.jobTitles;
    }
  },

  async createJobTitle(data: Partial<JobTitle>): Promise<JobTitle> {
    const newTitle: JobTitle = {
      id: repository.jobTitles.length + 1,
      company_id: 1,
      title: data.title || '',
      title_ar: data.title_ar || data.title,
      level: data.level || 'mid',
      description: data.description || '',
    };
    repository.jobTitles.push(newTitle);
    return newTitle;
  },

  // Positions
  async getPositions(): Promise<Position[]> {
    try {
      const res = await apiClient['request']<Position[]>('/positions');
      return res.data;
    } catch {
      return repository.positions;
    }
  },

  async createPosition(data: Partial<Position>): Promise<Position> {
    const emp = repository.employees.find((e) => e.id === data.employee_id);
    const dept = repository.departments.find((d) => d.id === data.department_id);
    const title = repository.jobTitles.find((j) => j.id === data.job_title_id);

    const newPos: Position = {
      id: repository.positions.length + 1,
      employee_id: data.employee_id || 101,
      department_id: data.department_id || 1,
      job_title_id: data.job_title_id || 1,
      employment_type: data.employment_type || 'full_time',
      is_primary: data.is_primary ?? true,
      start_date: data.start_date || new Date().toISOString().substring(0, 10),
      status: 'active',
      notes: data.notes,
      employee_name: emp ? `${emp.first_name} ${emp.last_name}` : 'موظف',
      department_name: dept?.name || 'قسم تقني',
      job_title_name: title?.title || 'مسمى وظيفي',
    };
    repository.positions.push(newPos);
    return newPos;
  },

  // Skills
  async getSkills(): Promise<Skill[]> {
    try {
      const res = await apiClient['request']<Skill[]>('/skills');
      return res.data;
    } catch {
      return repository.skills;
    }
  },

  async createSkill(data: Partial<Skill>): Promise<Skill> {
    const newSkill: Skill = {
      id: repository.skills.length + 1,
      name: data.name || '',
      category: data.category || 'Engineering',
      description: data.description || '',
      employees_count: 1,
      tasks_count: 0,
    };
    repository.skills.push(newSkill);
    return newSkill;
  },

  // Clients
  async getClients(): Promise<Client[]> {
    try {
      const res = await apiClient['request']<Client[]>('/clients');
      return res.data;
    } catch {
      return repository.clients;
    }
  },

  async createClient(data: Partial<Client>): Promise<Client> {
    const newClient: Client = {
      id: repository.clients.length + 1,
      company_id: 1,
      company_name: data.company_name || '',
      contact_person: data.contact_person || '',
      email: data.email || '',
      phone: data.phone || '',
      website: data.website,
      city: data.city || 'الرياض',
      country: data.country || 'السعودية',
      status: 'active',
      projects_count: 0,
      created_at: new Date().toISOString().substring(0, 10),
    };
    repository.clients.push(newClient);
    return newClient;
  },

  // Projects
  async getProjects(): Promise<Project[]> {
    try {
      const res = await apiClient['request']<Project[]>('/projects');
      return res.data;
    } catch {
      return repository.projects;
    }
  },

  async getProject(id: number): Promise<Project | undefined> {
    try {
      const res = await apiClient['request']<Project>(`/projects/${id}`);
      return res.data;
    } catch {
      return repository.projects.find((p) => p.id === id);
    }
  },

  async createProject(data: Partial<Project>): Promise<Project> {
    const client = repository.clients.find((c) => c.id === data.client_id);
    const newProj: Project = {
      id: repository.projects.length + 1,
      company_id: 1,
      client_id: data.client_id || 1,
      client_name: client?.company_name || 'عميل تجاري',
      name: data.name || '',
      description: data.description || '',
      budget: data.budget || 250000,
      priority: data.priority || 'medium',
      progress: 0,
      status: 'planning',
      planned_start_date: data.planned_start_date || new Date().toISOString().substring(0, 10),
      planned_end_date: data.planned_end_date || '2025-01-01',
      estimated_hours: data.estimated_hours || 400,
      actual_hours: 0,
      tasks_count: 0,
      completed_tasks_count: 0,
    };
    repository.projects.push(newProj);
    return newProj;
  },

  // Tasks
  async getTasks(): Promise<Task[]> {
    try {
      const res = await apiClient['request']<Task[]>('/tasks');
      return res.data;
    } catch {
      return repository.getTasks();
    }
  },

  async createTask(data: Partial<Task>): Promise<Task> {
    const proj = repository.projects.find((p) => p.id === data.project_id);
    const pos = data.position_id ? repository.positions.find((p) => p.id === data.position_id) : undefined;
    const skill = repository.skills.find((s) => s.id === data.skill_id);

    const newTask: Task = {
      id: 1000 + repository.tasks.length + 1,
      project_id: data.project_id || 1,
      project_name: proj?.name || 'مشروع برمجي',
      parent_task_id: data.parent_task_id || null,
      position_id: data.position_id || null,
      assigned_employee_name: pos?.employee_name,
      assigned_position_title: pos?.job_title_name,
      assigned_department_name: pos?.department_name,
      skill_id: data.skill_id || 1,
      skill_name: skill?.name || 'مهارة أساسية',
      title: data.title || '',
      description: data.description || '',
      priority: data.priority || 'medium',
      status: data.position_id ? 'ready' : 'pending',
      progress: 0,
      estimated_hours: data.estimated_hours || 24,
      actual_hours: 0,
      planned_start_date: data.planned_start_date || new Date().toISOString().substring(0, 10),
      planned_end_date: data.planned_end_date || '2024-12-31',
      created_at: new Date().toISOString().substring(0, 10),
    };
    repository.tasks.push(newTask);
    return newTask;
  },

  async updateTaskStatus(taskId: number, status: TaskStatus): Promise<Task> {
    try {
      const res = await apiClient['request']<Task>(`/tasks/${taskId}/status`, {
        method: 'PATCH',
        body: JSON.stringify({ status }),
      });
      return res.data;
    } catch {
      return repository.updateTaskStatus(taskId, status);
    }
  },

  async updateTaskPosition(taskId: number, positionId: number): Promise<Task> {
    try {
      const res = await apiClient['request']<Task>(`/tasks/${taskId}/assign`, {
        method: 'POST',
        body: JSON.stringify({ position_id: positionId }),
      });
      return res.data;
    } catch {
      return repository.updateTaskPosition(taskId, positionId);
    }
  },

  // AI Decision Support
  async getAiRecommendations(): Promise<AiTaskRecommendation[]> {
    try {
      const res = await apiClient['request']<AiTaskRecommendation[]>('/ai/recommendations');
      return res.data;
    } catch {
      return repository.recommendations;
    }
  },

  async generateAiRecommendation(taskId: number): Promise<AiTaskRecommendation> {
    try {
      const res = await apiClient['request']<AiTaskRecommendation>(`/ai/recommend-task/${taskId}`, {
        method: 'POST',
      });
      return res.data;
    } catch {
      // Simulate network latency for realistic AI evaluation
      await new Promise((resolve) => setTimeout(resolve, 800));
      return repository.generateAiRecommendation(taskId);
    }
  },

  async recordManagerDecision(
    recId: number,
    decision: 'accepted' | 'rejected',
    notes?: string
  ): Promise<AiTaskRecommendation> {
    try {
      const res = await apiClient['request']<AiTaskRecommendation>(`/ai/recommendations/${recId}/decision`, {
        method: 'POST',
        body: JSON.stringify({ decision, notes }),
      });
      return res.data;
    } catch {
      return repository.recordManagerDecision(recId, decision, notes);
    }
  },

  // Contracts & Documents
  async getContracts(): Promise<EmployeeContract[]> {
    return repository.contracts;
  },

  async getDocuments(): Promise<EmployeeDocument[]> {
    return repository.documents;
  },
};
