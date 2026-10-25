import React, { useState, useEffect } from 'react';
import {
  Building2,
  Server,
  Shield,
  Palette,
  CheckCircle2,
  Save,
  Globe,
  RefreshCw,
  Lock,
} from 'lucide-react';
import { useTranslation } from '../../i18n/LanguageContext';
import { useAuth } from '../../context/AuthContext';
import { apiService, repository } from '../../services/api';
import { Company } from '../../types';

export const SettingsView: React.FC = () => {
  const { t, language, toggleLanguage, isRtl } = useTranslation();
  const { user, role } = useAuth();
  const [company, setCompany] = useState<Company>(repository.company);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [activeTab, setActiveTab] = useState<'company' | 'api' | 'roles' | 'appearance'>('company');

  // Form states
  const [companyName, setCompanyName] = useState(company.name);
  const [companyEmail, setCompanyEmail] = useState(company.email);
  const [companyPhone, setCompanyPhone] = useState(company.phone);
  const [companyAddress, setCompanyAddress] = useState(company.address);
  const [companyCity, setCompanyCity] = useState(company.city);
  const [companyTax, setCompanyTax] = useState(company.tax_number || '');

  // API Config states
  const [apiUrl, setApiUrl] = useState(import.meta.env.VITE_LARAVEL_API_URL || 'https://api.apexsoft.sa/api');
  const [fastApiUrl, setFastApiUrl] = useState('https://ai.apexsoft.sa/api/v1/inference');

  const handleSaveCompany = (e: React.FormEvent) => {
    e.preventDefault();
    repository.company = {
      ...repository.company,
      name: companyName,
      email: companyEmail,
      phone: companyPhone,
      address: companyAddress,
      city: companyCity,
      tax_number: companyTax,
    };
    setCompany(repository.company);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-neutral-200 dark:border-neutral-800">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-neutral-900 dark:text-white tracking-tight">
            {t.settings.title}
          </h1>
          <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1 max-w-2xl leading-relaxed">
            {t.settings.subtitle}
          </p>
        </div>
      </div>

      {savedSuccess && (
        <div className="p-3.5 rounded-xl bg-emerald-50 text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 text-xs font-semibold flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>تم حفظ الإعدادات المؤسسية بنجاح</span>
        </div>
      )}

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-neutral-200 dark:border-neutral-800">
        <button
          onClick={() => setActiveTab('company')}
          className={`px-4 py-2 text-xs font-semibold border-b-2 transition-colors ${
            activeTab === 'company'
              ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400'
              : 'border-transparent text-neutral-500 hover:text-neutral-900'
          }`}
        >
          {t.settings.companyProfile}
        </button>
        <button
          onClick={() => setActiveTab('api')}
          className={`px-4 py-2 text-xs font-semibold border-b-2 transition-colors ${
            activeTab === 'api'
              ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400'
              : 'border-transparent text-neutral-500 hover:text-neutral-900'
          }`}
        >
          {t.settings.apiConfig}
        </button>
        <button
          onClick={() => setActiveTab('roles')}
          className={`px-4 py-2 text-xs font-semibold border-b-2 transition-colors ${
            activeTab === 'roles'
              ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400'
              : 'border-transparent text-neutral-500 hover:text-neutral-900'
          }`}
        >
          {t.settings.securityAndRoles}
        </button>
        <button
          onClick={() => setActiveTab('appearance')}
          className={`px-4 py-2 text-xs font-semibold border-b-2 transition-colors ${
            activeTab === 'appearance'
              ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400'
              : 'border-transparent text-neutral-500 hover:text-neutral-900'
          }`}
        >
          {t.settings.appearance}
        </button>
      </div>

      {/* Tab Panels */}
      {activeTab === 'company' && (
        <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl p-6 max-w-3xl">
          <form onSubmit={handleSaveCompany} className="space-y-4 text-xs">
            <div>
              <label className="font-semibold text-neutral-700 dark:text-neutral-300 block mb-1">
                اسم المنشأة المؤسسية *
              </label>
              <input
                type="text"
                required
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                className="w-full px-3 py-2 bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg outline-none"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="font-semibold text-neutral-700 dark:text-neutral-300 block mb-1">
                  البريد الرسمي للمنشأة
                </label>
                <input
                  type="email"
                  value={companyEmail}
                  onChange={(e) => setCompanyEmail(e.target.value)}
                  className="w-full px-3 py-2 bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg outline-none"
                />
              </div>
              <div>
                <label className="font-semibold text-neutral-700 dark:text-neutral-300 block mb-1">
                  هاتف الإدارة
                </label>
                <input
                  type="text"
                  value={companyPhone}
                  onChange={(e) => setCompanyPhone(e.target.value)}
                  className="w-full px-3 py-2 bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="font-semibold text-neutral-700 dark:text-neutral-300 block mb-1">
                  المدينة والمقر
                </label>
                <input
                  type="text"
                  value={companyCity}
                  onChange={(e) => setCompanyCity(e.target.value)}
                  className="w-full px-3 py-2 bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg outline-none"
                />
              </div>
              <div>
                <label className="font-semibold text-neutral-700 dark:text-neutral-300 block mb-1">
                  الرقم الضريبي المعتمد (VAT)
                </label>
                <input
                  type="text"
                  value={companyTax}
                  onChange={(e) => setCompanyTax(e.target.value)}
                  className="w-full px-3 py-2 bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg outline-none font-mono"
                />
              </div>
            </div>

            <div>
              <label className="font-semibold text-neutral-700 dark:text-neutral-300 block mb-1">
                العنوان الوطني
              </label>
              <input
                type="text"
                value={companyAddress}
                onChange={(e) => setCompanyAddress(e.target.value)}
                className="w-full px-3 py-2 bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg outline-none"
              />
            </div>

            <div className="pt-3 border-t border-neutral-100 dark:border-neutral-800 flex justify-end">
              <button
                type="submit"
                className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-xs transition-colors"
              >
                <Save className="w-3.5 h-3.5" />
                <span>{t.common.save}</span>
              </button>
            </div>
          </form>
        </div>
      )}

      {activeTab === 'api' && (
        <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl p-6 max-w-3xl space-y-5 text-xs">
          <div>
            <h3 className="text-sm font-bold text-neutral-900 dark:text-white mb-1">
              خوادم الربط والتكامل المعماري
            </h3>
            <p className="text-neutral-500 leading-relaxed">
              تعتمد المنصة على فصل المسؤوليات بدقة: يتولى Laravel معالجة قواعد البيانات والتوثيق والمنطق الإداري، بينما يتولى FastAPI الاتصال بنموذج Groq السحابي.
            </p>
          </div>

          <div className="space-y-4">
            <div>
              <label className="font-semibold text-neutral-700 dark:text-neutral-300 block mb-1">
                عنوان Laravel API الأساسي (Base URL)
              </label>
              <input
                type="text"
                value={apiUrl}
                onChange={(e) => setApiUrl(e.target.value)}
                className="w-full px-3 py-2 bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg outline-none font-mono text-[11px]"
              />
              <span className="text-[10px] text-neutral-400 mt-1 block">
                محدد عبر المتغير البيئي: VITE_LARAVEL_API_URL
              </span>
            </div>

            <div>
              <label className="font-semibold text-neutral-700 dark:text-neutral-300 block mb-1">
                خدمة الذكاء الاصطناعي السحابية (FastAPI Groq Proxy)
              </label>
              <input
                type="text"
                value={fastApiUrl}
                onChange={(e) => setFastApiUrl(e.target.value)}
                className="w-full px-3 py-2 bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg outline-none font-mono text-[11px]"
              />
              <span className="text-[10px] text-neutral-400 mt-1 block">
                ملاحظة أمنية صارمة: لا يتم تخزين مفتاح Groq في الواجهة الأمامية مطلقاً.
              </span>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'roles' && (
        <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl p-6 max-w-3xl text-xs space-y-4">
          <h3 className="text-sm font-bold text-neutral-900 dark:text-white">
            مصفوفة صلاحيات الأدوار المؤسسية (RBAC)
          </h3>
          <div className="divide-y divide-neutral-100 dark:divide-neutral-800 border border-neutral-200 dark:border-neutral-800 rounded-xl overflow-hidden">
            <div className="p-3 bg-neutral-50 dark:bg-neutral-850 flex justify-between font-bold">
              <span>الدور الوظيفي</span>
              <span>نطاق الصلاحيات</span>
            </div>
            <div className="p-3 flex justify-between">
              <span className="font-semibold">Super Admin (مدير النظام)</span>
              <span className="text-neutral-500">إدارة البنية، عزل الشركات، ضبط النظام، الصلاحيات العليا</span>
            </div>
            <div className="p-3 flex justify-between">
              <span className="font-semibold">Company Owner (مالك الشركة)</span>
              <span className="text-neutral-500">إدارة الشركة، الأقسام، الميزانيات، العقود، العملاء، اعتماد الذكاء</span>
            </div>
            <div className="p-3 flex justify-between">
              <span className="font-semibold">Department Manager (مدير القسم)</span>
              <span className="text-neutral-500">طلب توصيات الذكاء، اعتماد/رفض إسناد المهام، متابعة كوادر القسم</span>
            </div>
            <div className="p-3 flex justify-between">
              <span className="font-semibold">Employee (الموظف)</span>
              <span className="text-neutral-500">عرض المهام المسندة، تحديث التقدم، استعراض الملف والعقود</span>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'appearance' && (
        <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl p-6 max-w-xl text-xs space-y-4">
          <h3 className="text-sm font-bold text-neutral-900 dark:text-white">
            اللغة واتجاه واجهة المستخدم
          </h3>
          <p className="text-neutral-500">
            تدعم المنصة التبديل الفوري بين اللغة العربية (RTL مع خط Cairo) والإنجليزية (LTR مع خط Plus Jakarta Sans) مع ضبط دقيق لكافة الحقول والجداول والأيقونات.
          </p>
          <div className="pt-2">
            <button
              onClick={toggleLanguage}
              className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold text-neutral-800 dark:text-neutral-200 bg-neutral-100 dark:bg-neutral-800 rounded-lg hover:bg-neutral-200 transition-colors"
            >
              <Globe className="w-4 h-4" />
              <span>تبديل اللغة الحالية ({language === 'ar' ? 'العربية' : 'English'})</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
