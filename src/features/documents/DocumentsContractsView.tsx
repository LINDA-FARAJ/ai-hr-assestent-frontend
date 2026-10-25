import React, { useState, useEffect } from 'react';
import { FileText, FileCheck, Calendar, DollarSign, Download, Plus, AlertTriangle, ShieldCheck } from 'lucide-react';
import { useTranslation } from '../../i18n/LanguageContext';
import { apiService } from '../../services/api';
import { EmployeeContract, EmployeeDocument, Employee } from '../../types';
import { StatusBadge } from '../../components/ui/Badge';
import { EmployeeAvatar } from '../../components/ui/EmployeeAvatar';

export const DocumentsContractsView: React.FC = () => {
  const { t, isRtl } = useTranslation();
  const [activeTab, setActiveTab] = useState<'contracts' | 'documents'>('contracts');
  const [contracts, setContracts] = useState<EmployeeContract[]>([]);
  const [documents, setDocuments] = useState<EmployeeDocument[]>([]);
  const [employees, setEmployees] = useState<Employee[]>([]);

  useEffect(() => {
    async function load() {
      const [cList, dList, eList] = await Promise.all([
        apiService.getContracts(),
        apiService.getDocuments(),
        apiService.getEmployees(),
      ]);
      setContracts(cList);
      setDocuments(dList);
      setEmployees(eList);
    }
    load();
  }, []);

  const getEmployeeName = (empId: number) => {
    const emp = employees.find((e) => e.id === empId);
    return emp ? `${emp.first_name} ${emp.last_name}` : `EMP-${empId}`;
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-neutral-200 dark:border-neutral-800">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-neutral-900 dark:text-white tracking-tight">
            {t.documents.title}
          </h1>
          <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1 max-w-2xl leading-relaxed">
            {t.documents.subtitle}
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-neutral-200 dark:border-neutral-800">
        <button
          onClick={() => setActiveTab('contracts')}
          className={`px-4 py-2 text-xs font-semibold border-b-2 transition-colors ${
            activeTab === 'contracts'
              ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400'
              : 'border-transparent text-neutral-500 hover:text-neutral-900'
          }`}
        >
          {isRtl ? `عقود العمل الرسمية (${contracts.length})` : `Employment Contracts (${contracts.length})`}
        </button>
        <button
          onClick={() => setActiveTab('documents')}
          className={`px-4 py-2 text-xs font-semibold border-b-2 transition-colors ${
            activeTab === 'documents'
              ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400'
              : 'border-transparent text-neutral-500 hover:text-neutral-900'
          }`}
        >
          {isRtl ? `الوثائق والشهادات (${documents.length})` : `Official Documents (${documents.length})`}
        </button>
      </div>

      {/* Contracts Tab */}
      {activeTab === 'contracts' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {contracts.map((contract) => (
            <div
              key={contract.id}
              className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl p-5 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between gap-2 mb-3">
                  <div className="flex items-center gap-2">
                    <EmployeeAvatar name={getEmployeeName(contract.employee_id)} size="sm" />
                    <span className="font-bold text-xs text-neutral-900 dark:text-white">
                      {getEmployeeName(contract.employee_id)}
                    </span>
                  </div>
                  <StatusBadge status={contract.status} />
                </div>

                <div className="p-3 rounded-lg bg-neutral-50 dark:bg-neutral-850 border border-neutral-100 dark:border-neutral-800 my-2">
                  <span className="text-[10px] text-neutral-400 block uppercase">الراتب والبدلات المعتمدة</span>
                  <span className="text-base font-bold text-neutral-900 dark:text-white font-mono tabular-nums">
                    {contract.salary.toLocaleString()} {contract.currency}
                  </span>
                </div>

                <p className="text-xs text-neutral-500 dark:text-neutral-400 leading-relaxed my-2 line-clamp-2">
                  {contract.terms}
                </p>
              </div>

              <div className="pt-3 border-t border-neutral-100 dark:border-neutral-800 text-[11px] text-neutral-400 font-mono flex items-center justify-between">
                <span>تاريخ السريان:</span>
                <span className="tabular-nums">من {contract.start_date}</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Documents Tab */}
      {activeTab === 'documents' && (
        <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-start">
              <thead className="bg-neutral-50 dark:bg-neutral-850 border-b border-neutral-200 dark:border-neutral-800 text-neutral-500 font-semibold">
                <tr>
                  <th className="px-4 py-3 text-start">عنوان الوثيقة والملف</th>
                  <th className="px-4 py-3 text-start">الموظف المعني</th>
                  <th className="px-4 py-3 text-start">نوع الوثيقة</th>
                  <th className="px-4 py-3 text-start">الحجم</th>
                  <th className="px-4 py-3 text-start">حالة السريان</th>
                  <th className="px-4 py-3 text-center">الإجراء</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100 dark:divide-neutral-800">
                {documents.map((doc) => (
                  <tr key={doc.id} className="hover:bg-neutral-50/70 dark:hover:bg-neutral-800/40">
                    <td className="px-4 py-3">
                      <div className="font-semibold text-neutral-900 dark:text-white">{doc.title}</div>
                      <div className="text-[11px] text-neutral-400 font-mono">{doc.file_name}</div>
                    </td>
                    <td className="px-4 py-3 font-medium text-neutral-800 dark:text-neutral-200">
                      {getEmployeeName(doc.employee_id)}
                    </td>
                    <td className="px-4 py-3 uppercase text-neutral-500 font-mono text-[11px]">
                      {doc.document_type}
                    </td>
                    <td className="px-4 py-3 font-mono text-neutral-500 tabular-nums">
                      {doc.file_size_kb} KB
                    </td>
                    <td className="px-4 py-3">
                      <StatusBadge status={doc.status} />
                    </td>
                    <td className="px-4 py-3 text-center">
                      <button
                        onClick={() => alert(`تحميل المستند: ${doc.file_name}`)}
                        className="p-1.5 rounded-lg text-indigo-600 hover:bg-indigo-50 dark:hover:bg-neutral-800 transition-colors"
                        title="تحميل"
                      >
                        <Download className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
