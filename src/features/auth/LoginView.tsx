import React, { useState } from 'react';
import {
  Layers,
  Lock,
  Mail,
  Eye,
  EyeOff,
  Sparkles,
  ArrowRight,
  Shield,
  Briefcase,
  Building2,
  FolderKanban,
  User as UserIcon,
  Globe,
  AlertCircle,
  CheckCircle2,
} from 'lucide-react';
import { useTranslation } from '../../i18n/LanguageContext';
import { useAuth, DEMO_USERS } from '../../context/AuthContext';
import { UserRole } from '../../types';
import { Modal } from '../../components/ui/Modal';

export const LoginView: React.FC = () => {
  const { t, language, toggleLanguage, isRtl } = useTranslation();
  const { loginWithRole, loginWithCredentials } = useAuth();

  // Form states
  const [emailOrUser, setEmailOrUser] = useState('owner@apexsoft.sa');
  const [password, setPassword] = useState('demo1234');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Forgot Password Modal
  const [isForgotModalOpen, setIsForgotModalOpen] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotSubmitted, setForgotSubmitted] = useState(false);

  const handleCredentialsSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setIsLoading(true);

    setTimeout(async () => {
      const res = await loginWithCredentials(emailOrUser, password);
      setIsLoading(false);
      if (!res.success) {
        setErrorMessage(t.auth.invalidCredentials);
      }
    }, 450);
  };

  const handleQuickRoleSelect = async (role: UserRole) => {
    setIsLoading(true);
    await loginWithRole(role);
    setIsLoading(false);
  };

  const demoRoles: {
    role: UserRole;
    titleAr: string;
    titleEn: string;
    descAr: string;
    descEn: string;
    icon: any;
    accent: string;
  }[] = [
    {
      role: 'super_admin',
      titleAr: '1. مدير النظام / صاحب الموقع',
      titleEn: 'Super Admin (Platform Owner)',
      descAr: 'الإشراف الشامل على المنصة، إدارة كافة الشركات، سجلات التدقيق، والإعدادات العليا.',
      descEn: 'Platform-wide oversight, multi-company administration, audit logs, and system settings.',
      icon: Shield,
      accent: 'border-rose-200 dark:border-rose-900/60 hover:border-rose-400 bg-rose-50/30 dark:bg-rose-950/20 text-rose-700 dark:text-rose-300',
    },
    {
      role: 'company_owner',
      titleAr: '2. مالك الشركة',
      titleEn: 'Company Owner (Executive CEO)',
      descAr: 'إدارة عمليات الشركة، الأقسام، الكوادر، الميزانيات، العقود، واعتماد قرارات الذكاء الاصطناعي.',
      descEn: 'Full executive control over company operations, headcount, budgets, contracts, and AI approvals.',
      icon: Building2,
      accent: 'border-indigo-200 dark:border-indigo-900/60 hover:border-indigo-400 bg-indigo-50/30 dark:bg-indigo-950/20 text-indigo-700 dark:text-indigo-300',
    },
    {
      role: 'department_manager',
      titleAr: '3. مدير القسم',
      titleEn: 'Department Manager',
      descAr: 'إدارة قسم محدد (الهندسة والبرمجيات)، عبء عمل الفريق، ومراجعة توصيات إسناد المهام للقسم.',
      descEn: 'Focus on authorized department workload, team availability, and local task assignments.',
      icon: Briefcase,
      accent: 'border-amber-200 dark:border-amber-900/60 hover:border-amber-400 bg-amber-50/30 dark:bg-amber-950/20 text-amber-700 dark:text-amber-300',
    },
    {
      role: 'project_manager',
      titleAr: '4. مدير المشروع',
      titleEn: 'Project Manager (PM Position)',
      descAr: 'موظف يشغل منصب إدارة مشاريع محددة، تتبع نسب الإنجاز، معالم التسليم، والمهام التابعة.',
      descEn: 'Position-based PM managing authorized project milestones, deliverables, and task boards.',
      icon: FolderKanban,
      accent: 'border-blue-200 dark:border-blue-900/60 hover:border-blue-400 bg-blue-50/30 dark:bg-blue-950/20 text-blue-700 dark:text-blue-300',
    },
    {
      role: 'employee',
      titleAr: '5. الموظف',
      titleEn: 'Employee (Personal Space)',
      descAr: 'مساحة شخصية للموظف: المهام المسندة لمنصبه، المواعيد النهائية، مهاراته وسجل مناصبه المهنية.',
      descEn: 'Personal workspace for assigned tasks, deadlines, career timeline, and verified skills.',
      icon: UserIcon,
      accent: 'border-emerald-200 dark:border-emerald-900/60 hover:border-emerald-400 bg-emerald-50/30 dark:bg-emerald-950/20 text-emerald-700 dark:text-emerald-300',
    },
  ];

  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-neutral-950 flex flex-col justify-between p-4 sm:p-6 lg:p-8">
      {/* Top Header Bar */}
      <header className="max-w-6xl w-full mx-auto flex items-center justify-between pb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-700 to-violet-600 flex items-center justify-center text-white shadow-xs">
            <Layers className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-base font-bold text-neutral-900 dark:text-white tracking-tight">
              {t.appShortName}
            </h1>
            <p className="text-[11px] text-neutral-400">Enterprise HR & Project AI</p>
          </div>
        </div>

        <button
          onClick={toggleLanguage}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-neutral-200 dark:border-neutral-700 hover:bg-neutral-100 dark:hover:bg-neutral-800 text-xs font-medium text-neutral-700 dark:text-neutral-300 transition-colors"
        >
          <Globe className="w-3.5 h-3.5 text-neutral-400" />
          <span className="font-semibold">{language === 'ar' ? 'English (LTR)' : 'العربية (RTL)'}</span>
        </button>
      </header>

      {/* Main Content Split: Login Form & Role Selector */}
      <main className="max-w-6xl w-full mx-auto my-auto py-6 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left / Start: Credentials Form (5 Cols) */}
        <div className="lg:col-span-5 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl p-6 sm:p-8 shadow-xs">
          <div className="mb-6">
            <h2 className="text-xl font-bold text-neutral-900 dark:text-white tracking-tight">
              {t.auth.signInTitle}
            </h2>
            <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1 leading-relaxed">
              {t.auth.signInSubtitle}
            </p>
          </div>

          {errorMessage && (
            <div className="mb-4 p-3 rounded-xl bg-rose-50 text-rose-800 dark:bg-rose-950/40 dark:text-rose-300 border border-rose-200 dark:border-rose-800 text-xs flex items-start gap-2 leading-relaxed">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-rose-600" />
              <span>{errorMessage}</span>
            </div>
          )}

          <form onSubmit={handleCredentialsSubmit} className="space-y-4 text-xs">
            <div>
              <label className="font-semibold text-neutral-700 dark:text-neutral-300 block mb-1.5">
                {t.auth.emailOrUsername}
              </label>
              <div className="relative">
                <input
                  type="text"
                  required
                  value={emailOrUser}
                  onChange={(e) => setEmailOrUser(e.target.value)}
                  placeholder="name@company.sa"
                  className="w-full px-3.5 py-2.5 bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-xl outline-none focus:border-indigo-600 font-mono text-neutral-900 dark:text-white"
                />
                <Mail className="w-4 h-4 absolute top-1/2 -translate-y-1/2 text-neutral-400 left-3.5 rtl:right-3.5 rtl:left-auto pointer-events-none" />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="font-semibold text-neutral-700 dark:text-neutral-300">
                  {t.auth.password}
                </label>
                <button
                  type="button"
                  onClick={() => setIsForgotModalOpen(true)}
                  className="text-indigo-600 dark:text-indigo-400 hover:underline text-[11px] font-medium"
                >
                  {t.auth.forgotPassword}
                </button>
              </div>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-xl outline-none focus:border-indigo-600 font-mono text-neutral-900 dark:text-white"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600 left-3.5 rtl:right-3.5 rtl:left-auto"
                  aria-label={showPassword ? t.auth.hidePassword : t.auth.showPassword}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div className="flex items-center gap-2 pt-1">
              <input
                type="checkbox"
                id="rememberMe"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="rounded border-neutral-300 text-indigo-600 focus:ring-indigo-500"
              />
              <label htmlFor="rememberMe" className="text-neutral-600 dark:text-neutral-400 select-none">
                {t.auth.rememberMe}
              </label>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-2.5 px-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-semibold shadow-xs transition-colors flex items-center justify-center gap-2 mt-2 disabled:opacity-60"
            >
              <span>{isLoading ? t.auth.signingIn : t.auth.signInButton}</span>
              <ArrowRight className={`w-4 h-4 ${isRtl ? 'rotate-180' : ''}`} />
            </button>
          </form>

          <div className="mt-5 pt-4 border-t border-neutral-100 dark:border-neutral-800 text-center">
            <p className="text-[11px] text-neutral-400">
              {isRtl
                ? 'نموذج محاكاة الواجهة الأمامية · لا يتم إرسال أي بيانات سرية لخوادم خارجية'
                : 'Frontend prototype simulation · No production credentials are transmitted'}
            </p>
          </div>
        </div>

        {/* Right / End: 5 Demo Personas Cards (7 Cols) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="bg-gradient-to-r from-indigo-50 to-violet-50 dark:from-indigo-950/40 dark:to-violet-950/20 border border-indigo-200 dark:border-indigo-800/60 rounded-2xl p-5">
            <div className="flex items-center gap-2.5">
              <Sparkles className="w-5 h-5 text-indigo-600 dark:text-indigo-400 shrink-0" />
              <div>
                <h3 className="text-sm font-bold text-neutral-900 dark:text-white">
                  {t.auth.demoAccessTitle}
                </h3>
                <p className="text-xs text-neutral-600 dark:text-neutral-400 mt-0.5 leading-relaxed">
                  {t.auth.demoAccessSubtitle}
                </p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-3">
            {demoRoles.map((item) => {
              const Icon = item.icon;
              const demoAccount = DEMO_USERS[item.role];

              return (
                <div
                  key={item.role}
                  className={`border rounded-xl p-4 transition-all hover:shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${item.accent}`}
                >
                  <div className="flex items-start gap-3">
                    <div className="p-2.5 rounded-xl bg-white dark:bg-neutral-800 shadow-2xs shrink-0">
                      <Icon className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="text-xs font-bold text-neutral-900 dark:text-white">
                          {isRtl ? item.titleAr : item.titleEn}
                        </h4>
                        <span className="text-[10px] font-mono text-neutral-400">
                          ({demoAccount.name})
                        </span>
                      </div>
                      <p className="text-[11px] text-neutral-600 dark:text-neutral-400 mt-1 leading-relaxed">
                        {isRtl ? item.descAr : item.descEn}
                      </p>
                      <div className="text-[10px] text-neutral-400 font-mono mt-1">
                        {demoAccount.email} · {demoAccount.company_name}
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => handleQuickRoleSelect(item.role)}
                    className="inline-flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-lg bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 text-neutral-800 dark:text-neutral-200 text-xs font-semibold hover:bg-neutral-50 dark:hover:bg-neutral-750 transition-colors shadow-2xs shrink-0"
                  >
                    <span>{t.auth.enterAsRole}</span>
                    <ArrowRight className={`w-3.5 h-3.5 ${isRtl ? 'rotate-180' : ''}`} />
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="max-w-6xl w-full mx-auto text-center pt-6 text-xs text-neutral-400 border-t border-neutral-200 dark:border-neutral-800">
        <p>Smart HR & Project Management Platform with AI Decision Support · 2026</p>
      </footer>

      {/* Forgot Password Modal Simulation */}
      <Modal
        isOpen={isForgotModalOpen}
        onClose={() => {
          setIsForgotModalOpen(false);
          setForgotSubmitted(false);
        }}
        title={t.auth.forgotModalTitle}
        description={t.auth.forgotModalDesc}
        maxWidth="md"
      >
        {forgotSubmitted ? (
          <div className="py-4 text-center space-y-3">
            <CheckCircle2 className="w-10 h-10 text-emerald-600 mx-auto" />
            <p className="text-xs text-neutral-700 dark:text-neutral-300 font-medium">
              {t.auth.resetSentSuccess}
            </p>
            <button
              onClick={() => {
                setIsForgotModalOpen(false);
                setForgotSubmitted(false);
              }}
              className="mt-2 px-4 py-2 bg-indigo-600 text-white rounded-lg text-xs font-semibold"
            >
              {t.common.close}
            </button>
          </div>
        ) : (
          <form
            onSubmit={(e) => {
              e.preventDefault();
              setForgotSubmitted(true);
            }}
            className="space-y-4 text-xs"
          >
            <div>
              <label className="font-semibold text-neutral-700 dark:text-neutral-300 block mb-1">
                البريد الإلكتروني المسجل
              </label>
              <input
                type="email"
                required
                value={forgotEmail}
                onChange={(e) => setForgotEmail(e.target.value)}
                placeholder="name@company.sa"
                className="w-full px-3 py-2 bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg outline-none font-mono"
              />
            </div>
            <div className="flex justify-end gap-2 pt-2 border-t border-neutral-100 dark:border-neutral-800">
              <button
                type="button"
                onClick={() => setIsForgotModalOpen(false)}
                className="px-4 py-2 rounded-lg border border-neutral-200 dark:border-neutral-700 text-neutral-600 hover:bg-neutral-100"
              >
                {t.common.cancel}
              </button>
              <button
                type="submit"
                className="px-4 py-2 rounded-lg bg-indigo-600 text-white font-semibold hover:bg-indigo-700"
              >
                {t.auth.sendResetLink}
              </button>
            </div>
          </form>
        )}
      </Modal>
    </div>
  );
};
