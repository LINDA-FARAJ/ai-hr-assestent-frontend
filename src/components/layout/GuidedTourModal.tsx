import React, { useState } from 'react';
import {
  Compass,
  Layers,
  Shield,
  Briefcase,
  FolderKanban,
  Sparkles,
  BarChart3,
  ChevronLeft,
  ChevronRight,
  CheckCircle2,
  X,
  ExternalLink,
} from 'lucide-react';
import { useTranslation } from '../../i18n/LanguageContext';

interface GuidedTourModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectRole?: (role: string) => void;
}

export const GuidedTourModal: React.FC<GuidedTourModalProps> = ({
  isOpen,
  onClose,
}) => {
  const { t, isRtl } = useTranslation();
  const [currentStep, setCurrentStep] = useState(0);

  if (!isOpen) return null;

  const tourSteps = [
    {
      titleAr: 'مرحباً بك في منصة الموارد البشرية الذكية وإدارة المشاريع',
      titleEn: 'Welcome to the Smart HR & Project Management Platform',
      badgeAr: 'مشروع تخرج متقدم',
      badgeEn: 'Enterprise Graduation Project',
      icon: Layers,
      color: 'indigo',
      descAr:
        'منصة مؤسسية تجمع بين إدارة الموارد البشرية المتقدمة (HRMS)، إدارة المشاريع ومراحل التسليم، ونظام دعم القرار الإداري المستند إلى الذكاء الاصطناعي (AI Decision Support). صُممت الواجهة لتتكامل مستقبلاً مع واجهات Laravel REST API وخوادم FastAPI للذكاء الاصطناعي.',
      descEn:
        'An enterprise platform combining advanced HRMS, project delivery management, and AI-powered managerial decision support. The interface is architected to seamlessly integrate with a Laravel REST API backend and FastAPI AI engine.',
      keyPointsAr: [
        'واجهة عربية أصيلة بالكامل (RTL) مع دعم كامل للغة الإنجليزية (LTR)',
        'توافق كامل 100% مع مخطط قاعدة البيانات وجداول الهجرة (Laravel Migrations)',
        'عزل صارم للبيانات وصلاحيات وصول متعددة المستويات (RBAC)',
      ],
      keyPointsEn: [
        'True native Arabic-first (RTL) layout with seamless English (LTR) toggle',
        '100% schema alignment with actual Laravel migrations and database tables',
        'Strict multi-tenant data boundaries and multi-tier RBAC permission matrix',
      ],
    },
    {
      titleAr: 'نظام الأدوار الخمسة ومصفوفة الصلاحيات (Multi-Role System)',
      titleEn: 'Five User Roles & Centralized RBAC System',
      badgeAr: 'صلاحيات متعددة',
      badgeEn: '5 Distinct Personas',
      icon: Shield,
      color: 'rose',
      descAr:
        'تدعم المنصة خمسة أدوار مستخدمين منفصلة ومحددة، لكل دور لوحة قيادة مخصصة وقائمة تنقل محددة وصلاحيات مقيدة. يمكنك التبديل بين الأدوار في أي وقت عبر القائمة العلوية لاختبار التجربة.',
      descEn:
        'The platform supports five distinct user roles, each with its own specialized dashboard, sidebar navigation, and restricted operational boundaries. Switch between personas at any time using the top navbar selector.',
      keyPointsAr: [
        'مدير النظام (Super Admin): الإشراف على كافة الشركات المشتركة، أداء Groq AI، وسجلات التدقيق الموحدة',
        'مالك الشركة (Company Owner): مراقبة الميزانيات، الأقسام، الموظفين، واعتماد توصيات الذكاء الاصطناعي',
        'مدير القسم (Department Manager): قيادة قسم الهندسة، متابعة جاهزية الكوادر، وإسناد المهام الداخلية',
        'مدير المشروع (Project Manager): موظف بمسمى مدير مشروع، يتابع المشاريع الموكلة، ساعات العمل، والتسليم',
        'الموظف (Employee): مساحة شخصية لمتابعة المهام الموكلة، تحديث نسبة الإنجاز، وسجل المهارات المعتمدة',
      ],
      keyPointsEn: [
        'Super Admin: Platform-wide oversight of tenant companies, Groq AI telemetry, and global audit logs',
        'Company Owner: Executive budget oversight, headcount, and company-wide managerial decisions',
        'Department Manager: Department headcount, workload balance, and task recommendations',
        'Project Manager: Scoped to authorized projects, milestones, planned vs actual hours tracking',
        'Employee: Personal workspace for assigned tasks, self-reported progress slider, and verified skills',
      ],
    },
    {
      titleAr: 'التمييز المعماري: المسمى الوظيفي مقابل المنصب (Positions vs Job Titles)',
      titleEn: 'Architectural Domain Rule: Positions vs Job Titles',
      badgeAr: 'قاعدة جوهرية',
      badgeEn: 'Core Business Rule',
      icon: Briefcase,
      color: 'amber',
      descAr:
        'التزاماً بقواعد قاعدة البيانات الفعلية (Laravel Schema): المسمى الوظيفي (Job Title) هو تعريف مجرد وقابل لإعادة الاستخدام (مثل Senior Backend Developer)، بينما المنصب (Position) يمثل عقد تعيين فعلي لموظف محدد داخل قسم محدد وبراتب ونسبة عبء عمل ومدير مباشر.',
      descEn:
        'Following the real database schema: A Job Title is an abstract reusable classification (e.g. Senior Backend Developer), whereas a Position is an actual employment assignment linking a specific employee to a department, manager, salary, and workload percentage.',
      keyPointsAr: [
        'الموظف الواحد يمكن أن يحمل عدة مناصب وظيفية تاريخية أو منصب أساسي حالي (is_primary: true)',
        'حالات المنصب الرسمية: نشط (active)، منقول (transferred)، مرقى (promoted)، منتهي (ended)',
        'المهام التشغيلية ترتبط دائماً بمعرف المنصب (position_id) وليس بالموظف مباشرة',
      ],
      keyPointsEn: [
        'An employee can have multiple historical position assignments with one primary position',
        'Official position statuses: active, transferred, promoted, ended',
        'Operational tasks are assigned to a position_id, preserving organisational hierarchy',
      ],
    },
    {
      titleAr: 'إدارة المشاريع ومراحل التسليم ولوحة كانبان (Projects & Kanban)',
      titleEn: 'Client, Project & Task Delivery Pipeline',
      badgeAr: 'تنفيذ تشغيلي',
      badgeEn: 'Delivery Engine',
      icon: FolderKanban,
      color: 'blue',
      descAr:
        'إدارة متكاملة لدورة حياة المشاريع المرتبطة بالعملاء، تتضمن تتبع الميزانيات، نسب الإنجاز التلقائية، وخطوط التسليم الزمنية (Gantt)، بالإضافة إلى لوحة كانبان تفاعلية للمهام تدعم السحب والتصنيف حسب الحالة والأولوية.',
      descEn:
        'End-to-end client project management with budget execution tracking, milestone timelines, and an interactive Kanban board supporting multi-status filtering, priority flags, and parent-child task hierarchies.',
      keyPointsAr: [
        'حالات المهام المعتمدة: قيد الانتظار (pending)، جاهزة (ready)، قيد التنفيذ (in_progress)، مراجعة (review)، مكتملة (completed)، معطلة (blocked)، ملغاة (cancelled)',
        'تتبع دقيق للساعات المقدرة (estimated_hours) مقابل الساعات الفعلية (actual_hours)',
        'ارتباط كل مهمة بمهارة مطلوبة (skill_id) ومستوى كفاءة محدد',
      ],
      keyPointsEn: [
        'Strict status taxonomy: pending, ready, in_progress, review, completed, blocked, cancelled',
        'Precise estimated vs. actual hours tracking to detect delivery variances early',
        'Direct linkage between tasks and required technical skill_id',
      ],
    },
    {
      titleAr: 'محرك دعم القرار الإداري بالذكاء الاصطناعي (AI Decision Support)',
      titleEn: 'AI Managerial Decision Support Workspace',
      badgeAr: 'استشاري وليس مقرراً',
      badgeEn: 'Human-in-the-Loop AI',
      icon: Sparkles,
      color: 'violet',
      descAr:
        'الذكاء الاصطناعي هنا يعمل كمستشار تحليلي ذكي (Advisor) ولا يلغي سلطة المدير البشري. يقوم النظام بتحليل متطلبات المهمة، ومطابقتها مع كفاءات وساعات عمل وسجلات أداء المرشحين عبر خوادم Groq وFastAPI.',
      descEn:
        'AI serves as an analytical advisor without replacing human executive authority. It evaluates candidate skill match, historical performance scores, and remaining weekly hours through Groq LLM inference and FastAPI.',
      keyPointsAr: [
        'نسبة تطابق المهارات (Skill Match Score) والخبرات الموثقة وسجل التقييم السابق',
        'مراعاة ساعات العمل المتاحة (Remaining Available Hours) لتجنب الإرهاق الوظيفي (Burnout)',
        'خيارات إدارية مرنة: قبول التوصية، رفضها، أو طلب مرشحين بدلاء مع تدوين أسباب القرار',
      ],
      keyPointsEn: [
        'Computes verified skill matches, experience years, and historical performance scores',
        'Enforces workload balance by checking remaining available hours and capacity',
        'Full managerial control: Accept, Reject, or Request Alternatives with audit notes',
      ],
    },
    {
      titleAr: 'التقارير التحليلية وجاهزية الربط (Reports & Backend Readiness)',
      titleEn: 'Analytical Reporting & Laravel API Readiness',
      badgeAr: 'جاهزية الربط',
      badgeEn: 'API Integration Ready',
      icon: BarChart3,
      color: 'emerald',
      descAr:
        'تحتوي المنصة على قسم تقارير متكامل يعتمد على رسوم Recharts البيانية، بالإضافة إلى شاشة خاصة لتوثيق واجهات API (API Contracts) توضح كافة الروابط (Endpoints) المتوافقة مع ملف routes/api.php في مشروع Laravel.',
      descEn:
        'Features a comprehensive analytics suite using Recharts, plus a dedicated API Contracts documentation screen detailing all endpoints ready for live connection to Laravel and FastAPI.',
      keyPointsAr: [
        'مخططات بيانية لتوزيع الكوادر، تقدم المشاريع، تباين الساعات، وتواريخ انتهاء العقود',
        'توثيق كامل للـ JSON Payloads والاستجابات المتوقعة لكل استدعاء API',
        'محاكاة محلية واقعية لكافة عمليات الإنشاء والتعديل والحذف دون أخطاء اتصال',
      ],
      keyPointsEn: [
        'Interactive charts for headcount, project delivery, hours variance, and contract expiries',
        'Detailed JSON payload and response schema contracts for seamless backend integration',
        'Clean local state simulation for all CRUD actions without network dependency',
      ],
    },
  ];

  const current = tourSteps[currentStep];
  const Icon = current.icon;

  const handleNext = () => {
    if (currentStep < tourSteps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      onClose();
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
      <div className="relative w-full max-w-2xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header bar */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-100 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-850/50">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
              <Compass className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-neutral-900 dark:text-white">
                {isRtl ? 'الجولة التعريفية للمنصة' : 'Platform Guided Tour'}
              </h3>
              <p className="text-[11px] text-neutral-400 font-mono">
                {isRtl ? `الخطوة ${currentStep + 1} من ${tourSteps.length}` : `Step ${currentStep + 1} of ${tourSteps.length}`}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
            title="Close"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Step Content */}
        <div className="p-6 overflow-y-auto space-y-5">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-indigo-50 dark:bg-indigo-950/50 border border-indigo-100 dark:border-indigo-800 flex items-center justify-center text-indigo-600 dark:text-indigo-400 shrink-0">
              <Icon className="w-6 h-6" />
            </div>

            <div className="flex-1">
              <div className="inline-block px-2.5 py-0.5 rounded-md text-[11px] font-semibold bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 mb-1.5">
                {isRtl ? current.badgeAr : current.badgeEn}
              </div>
              <h2 className="text-base sm:text-lg font-bold text-neutral-900 dark:text-white leading-snug">
                {isRtl ? current.titleAr : current.titleEn}
              </h2>
            </div>
          </div>

          <p className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-300 leading-relaxed">
            {isRtl ? current.descAr : current.descEn}
          </p>

          {/* Key Points Bullet List */}
          <div className="bg-neutral-50 dark:bg-neutral-850/60 border border-neutral-100 dark:border-neutral-800 rounded-xl p-4 space-y-2.5">
            <p className="text-[11px] font-bold text-neutral-500 uppercase tracking-wider">
              {isRtl ? 'أبرز الملامح والقواعد المعمارية' : 'Key Architectural Highlights'}
            </p>
            <ul className="space-y-2">
              {(isRtl ? current.keyPointsAr : current.keyPointsEn).map((point, idx) => (
                <li key={idx} className="flex items-start gap-2.5 text-xs text-neutral-700 dark:text-neutral-300">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span className="leading-relaxed">{point}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Footer Navigation */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-neutral-100 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-850/50 shrink-0">
          {/* Progress Dots */}
          <div className="flex items-center gap-1.5">
            {tourSteps.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrentStep(i)}
                className={`h-2 rounded-full transition-all ${
                  i === currentStep
                    ? 'w-6 bg-indigo-600'
                    : 'w-2 bg-neutral-200 dark:bg-neutral-700 hover:bg-neutral-300'
                }`}
                title={`Step ${i + 1}`}
              />
            ))}
          </div>

          {/* Buttons */}
          <div className="flex items-center gap-2">
            {currentStep > 0 && (
              <button
                onClick={handlePrev}
                className="flex items-center gap-1 px-3 py-1.5 rounded-lg border border-neutral-200 dark:border-neutral-700 hover:bg-neutral-100 dark:hover:bg-neutral-800 text-xs font-semibold text-neutral-700 dark:text-neutral-200 transition-colors"
              >
                {isRtl ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
                <span>{isRtl ? 'السابق' : 'Previous'}</span>
              </button>
            )}

            <button
              onClick={handleNext}
              className="flex items-center gap-1 px-4 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold shadow-xs transition-colors"
            >
              <span>
                {currentStep === tourSteps.length - 1
                  ? isRtl ? 'ابدأ الاستكشاف' : 'Start Exploring'
                  : isRtl ? 'التالي' : 'Next'}
              </span>
              {currentStep < tourSteps.length - 1 && (
                isRtl ? <ChevronLeft className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
