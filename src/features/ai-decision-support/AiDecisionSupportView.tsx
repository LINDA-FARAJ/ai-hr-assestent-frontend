import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  CheckCircle2,
  XCircle,
  HelpCircle,
  Clock,
  Briefcase,
  Award,
  AlertTriangle,
  RotateCw,
  UserCheck,
  ChevronRight,
  ShieldCheck,
  Zap,
  Info,
} from 'lucide-react';
import { useTranslation } from '../../i18n/LanguageContext';
import { apiService, repository } from '../../services/api';
import { Task, AiTaskRecommendation, AlternativeCandidate, Position } from '../../types';
import { EmployeeAvatar } from '../../components/ui/EmployeeAvatar';
import { PriorityBadge, StatusBadge } from '../../components/ui/Badge';
import { ProgressBar } from '../../components/ui/ProgressBar';

export const AiDecisionSupportView: React.FC = () => {
  const { t, isRtl } = useTranslation();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [recommendation, setRecommendation] = useState<AiTaskRecommendation | null>(null);
  const [loadingRecommendation, setLoadingRecommendation] = useState(false);
  const [managerDecisionState, setManagerDecisionState] = useState<'idle' | 'accepted' | 'rejected'>('idle');
  const [activeTab, setActiveTab] = useState<'primary' | 'alternatives' | 'system-info'>('primary');
  const [feedbackMessage, setFeedbackMessage] = useState<string | null>(null);

  // Load available tasks
  useEffect(() => {
    async function loadTasks() {
      const allTasks = await apiService.getTasks();
      setTasks(allTasks);

      // Select first task needing assignment by default
      const defaultTask = allTasks.find((t) => !t.position_id) || allTasks[0];
      if (defaultTask) {
        setSelectedTask(defaultTask);
        // Check if there is an existing recommendation for this task
        const existingRec = repository.recommendations.find((r) => r.task_id === defaultTask.id);
        if (existingRec) {
          setRecommendation(existingRec);
          if (existingRec.manager_decision === 'accepted') setManagerDecisionState('accepted');
          if (existingRec.manager_decision === 'rejected') setManagerDecisionState('rejected');
        }
      }
    }
    loadTasks();
  }, []);

  const handleSelectTask = (task: Task) => {
    setSelectedTask(task);
    setManagerDecisionState('idle');
    setFeedbackMessage(null);
    const existingRec = repository.recommendations.find((r) => r.task_id === task.id);
    setRecommendation(existingRec || null);
    if (existingRec?.manager_decision === 'accepted') setManagerDecisionState('accepted');
    if (existingRec?.manager_decision === 'rejected') setManagerDecisionState('rejected');
  };

  const handleGenerateRecommendation = async () => {
    if (!selectedTask) return;
    setLoadingRecommendation(true);
    setFeedbackMessage(null);
    try {
      const rec = await apiService.generateAiRecommendation(selectedTask.id);
      setRecommendation(rec);
      setManagerDecisionState('idle');
    } catch (err) {
      console.error(err);
      setFeedbackMessage(isRtl ? 'تعذر استدعاء خدمة الذكاء الاصطناعي' : 'Failed to call AI inference service');
    } finally {
      setLoadingRecommendation(false);
    }
  };

  const handleManagerDecision = async (decision: 'accepted' | 'rejected', notes?: string) => {
    if (!recommendation) return;
    try {
      const updated = await apiService.recordManagerDecision(recommendation.id, decision, notes);
      setRecommendation(updated);
      setManagerDecisionState(decision);

      // Refresh tasks list so assigned position reflects immediately
      const refreshedTasks = await apiService.getTasks();
      setTasks(refreshedTasks);
      const updatedTask = refreshedTasks.find((t) => t.id === selectedTask?.id);
      if (updatedTask) setSelectedTask(updatedTask);

      setFeedbackMessage(
        decision === 'accepted'
          ? isRtl
            ? 'تم اعتماد التوصية بنجاح وإسناد المنصب المسؤول للمهمة في النظام.'
            : 'Recommendation approved. Position successfully assigned to task in Laravel workflow.'
          : isRtl
          ? 'تم رفض التوصية وتوثيق سبب القرار في سجل التدقيق.'
          : 'Recommendation rejected and decision logged into audit trail.'
      );
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-neutral-200 dark:border-neutral-800">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-bold text-neutral-900 dark:text-white tracking-tight">
              {t.ai.title}
            </h1>
            <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-violet-100 text-violet-800 dark:bg-violet-950/70 dark:text-violet-300 border border-violet-200 dark:border-violet-800">
              Groq Cloud Engine
            </span>
          </div>
          <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1 max-w-3xl leading-relaxed">
            {t.ai.subtitle}
          </p>
        </div>
      </div>

      {/* Trust & Architecture Notice */}
      <div className="bg-neutral-50 dark:bg-neutral-900/60 border border-neutral-200 dark:border-neutral-800 rounded-xl p-3.5 flex items-start gap-3">
        <ShieldCheck className="w-4 h-4 text-violet-600 dark:text-violet-400 shrink-0 mt-0.5" />
        <div className="text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed">
          <span className="font-semibold text-neutral-900 dark:text-white">
            {isRtl ? 'ميثاق الشفافية المؤسسية:' : 'Operational Governance Policy:'}
          </span>{' '}
          {t.ai.managerDecisionRequired}
        </div>
      </div>

      {/* Main Workspace Split: Task Selector (Left/Right) & Recommendation Analysis */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Task Selection Panel (4 Cols) */}
        <div className="lg:col-span-4 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl p-4 space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-neutral-100 dark:border-neutral-800">
            <h3 className="text-xs font-bold text-neutral-900 dark:text-white uppercase tracking-wider">
              {isRtl ? 'قائمة المهام القابلة للتقييم' : 'Select Task to Evaluate'}
            </h3>
            <span className="text-[11px] font-mono text-neutral-400">
              {tasks.length} {isRtl ? 'مهمة' : 'tasks'}
            </span>
          </div>

          <div className="space-y-2 max-h-[580px] overflow-y-auto pr-1">
            {tasks.map((task) => {
              const isSelected = selectedTask?.id === task.id;
              const isAssigned = !!task.position_id;

              return (
                <div
                  key={task.id}
                  onClick={() => handleSelectTask(task)}
                  className={`p-3 rounded-xl border text-start transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-violet-50/70 border-violet-300 dark:bg-violet-950/40 dark:border-violet-700 shadow-xs ring-1 ring-violet-400/20'
                      : 'bg-white dark:bg-neutral-850 border-neutral-200 dark:border-neutral-800 hover:border-neutral-300 dark:hover:border-neutral-700'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2 mb-1.5">
                    <h4 className="text-xs font-semibold text-neutral-900 dark:text-white line-clamp-1">
                      {task.title}
                    </h4>
                    <PriorityBadge priority={task.priority} />
                  </div>

                  <p className="text-[11px] text-neutral-500 dark:text-neutral-400 line-clamp-1 mb-2">
                    {task.project_name}
                  </p>

                  <div className="flex items-center justify-between text-[11px] text-neutral-500 dark:text-neutral-400 pt-2 border-t border-neutral-100 dark:border-neutral-800">
                    <span className="text-indigo-600 dark:text-indigo-400 font-medium">
                      {task.skill_name}
                    </span>
                    <span className="tabular-nums">
                      {task.estimated_hours} {t.common.hours}
                    </span>
                  </div>

                  {isAssigned ? (
                    <div className="mt-2 text-[10px] text-emerald-700 dark:text-emerald-400 font-medium flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" />
                      <span>{task.assigned_employee_name} ({task.assigned_position_title})</span>
                    </div>
                  ) : (
                    <div className="mt-2 text-[10px] text-amber-700 dark:text-amber-400 font-medium flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      <span>{isRtl ? 'شاغرة (تحتاج إسناد ذكي)' : 'Unassigned (Needs AI Assign)'}</span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Selected Task & AI Results (8 Cols) */}
        <div className="lg:col-span-8 space-y-5">
          {selectedTask ? (
            <>
              {/* Task Summary Card */}
              <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl p-5">
                <div className="flex items-start justify-between gap-4 mb-3">
                  <div>
                    <span className="text-[11px] font-mono text-neutral-400">
                      TASK-{selectedTask.id} · {selectedTask.project_name}
                    </span>
                    <h2 className="text-base font-bold text-neutral-900 dark:text-white mt-0.5">
                      {selectedTask.title}
                    </h2>
                  </div>
                  <StatusBadge status={selectedTask.status} />
                </div>

                <p className="text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed mb-4">
                  {selectedTask.description}
                </p>

                {/* Key Requirements Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-3 rounded-lg bg-neutral-50 dark:bg-neutral-850 border border-neutral-100 dark:border-neutral-800 text-xs">
                  <div>
                    <span className="text-[11px] text-neutral-400 block">{t.tasks.requiredSkill}</span>
                    <span className="font-semibold text-neutral-800 dark:text-neutral-200 mt-0.5 block">
                      {selectedTask.skill_name}
                    </span>
                  </div>
                  <div>
                    <span className="text-[11px] text-neutral-400 block">{t.tasks.estimatedHours}</span>
                    <span className="font-semibold text-neutral-800 dark:text-neutral-200 mt-0.5 block tabular-nums">
                      {selectedTask.estimated_hours} {t.common.hours}
                    </span>
                  </div>
                  <div>
                    <span className="text-[11px] text-neutral-400 block">{t.tasks.deadline}</span>
                    <span className="font-semibold text-neutral-800 dark:text-neutral-200 mt-0.5 block tabular-nums">
                      {selectedTask.planned_end_date}
                    </span>
                  </div>
                  <div>
                    <span className="text-[11px] text-neutral-400 block">{t.tasks.responsiblePosition}</span>
                    <span className="font-semibold text-neutral-800 dark:text-neutral-200 mt-0.5 block truncate">
                      {selectedTask.assigned_employee_name || (isRtl ? 'لم يُسند بعد' : 'Not Assigned')}
                    </span>
                  </div>
                </div>

                {/* Generate Action Trigger */}
                <div className="mt-4 flex items-center justify-between pt-3 border-t border-neutral-100 dark:border-neutral-800">
                  <span className="text-xs text-neutral-500">
                    {recommendation
                      ? isRtl
                        ? 'تم استلام تحليل الذكاء الاصطناعي بنجاح'
                        : 'AI analysis evaluated against team capacity'
                      : isRtl
                      ? 'اضغط زر التوليد لتشغيل محرك Groq واستخراج التوصية'
                      : 'Click generate to trigger Groq talent evaluation'}
                  </span>
                  <button
                    onClick={handleGenerateRecommendation}
                    disabled={loadingRecommendation}
                    className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold text-white bg-violet-600 hover:bg-violet-700 disabled:opacity-60 rounded-lg shadow-xs transition-colors"
                  >
                    {loadingRecommendation ? (
                      <RotateCw className="w-3.5 h-3.5 animate-spin" />
                    ) : (
                      <Sparkles className="w-3.5 h-3.5" />
                    )}
                    <span>
                      {loadingRecommendation
                        ? t.ai.generating
                        : recommendation
                        ? isRtl
                          ? 'إعادة توليد التوصية'
                          : 'Re-evaluate with Groq'
                        : t.ai.generateRecommendation}
                    </span>
                  </button>
                </div>
              </div>

              {/* Feedback toast / message */}
              {feedbackMessage && (
                <div
                  className={`p-3 rounded-xl border text-xs font-medium flex items-center gap-2 ${
                    managerDecisionState === 'accepted'
                      ? 'bg-emerald-50 text-emerald-800 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800'
                      : 'bg-neutral-100 text-neutral-800 border-neutral-200 dark:bg-neutral-800 dark:text-neutral-200'
                  }`}
                >
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>{feedbackMessage}</span>
                </div>
              )}

              {/* Recommendation Results Presentation */}
              {recommendation && (
                <div className="bg-white dark:bg-neutral-900 border border-violet-200 dark:border-violet-900/60 rounded-xl overflow-hidden shadow-xs">
                  {/* Results Header with Confidence & Overall Score */}
                  <div className="bg-gradient-to-r from-violet-900 via-indigo-900 to-slate-900 text-white p-5">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div className="flex items-center gap-3">
                        <EmployeeAvatar
                          name={recommendation.recommended_employee_name}
                          size="lg"
                          className="ring-2 ring-violet-400"
                        />
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-xs text-violet-300 font-medium">
                              {t.ai.recommendedCandidate}
                            </span>
                            <span className="text-[10px] bg-violet-500/30 text-violet-200 px-2 py-0.5 rounded border border-violet-400/40">
                              {recommendation.recommended_department_name}
                            </span>
                          </div>
                          <h3 className="text-lg font-bold text-white mt-0.5">
                            {recommendation.recommended_employee_name}
                          </h3>
                          <p className="text-xs text-slate-300">
                            {recommendation.recommended_position_title}
                          </p>
                        </div>
                      </div>

                      {/* Scores Pill */}
                      <div className="flex items-center gap-4 bg-white/10 rounded-xl p-3 backdrop-blur-xs border border-white/10 shrink-0">
                        <div className="text-center px-2">
                          <span className="text-[10px] text-violet-200 block uppercase tracking-wider">
                            {t.common.confidence}
                          </span>
                          <span className="text-xl font-bold font-mono text-emerald-400 tabular-nums">
                            {recommendation.confidence}%
                          </span>
                        </div>
                        <div className="w-px h-8 bg-white/20" />
                        <div className="text-center px-2">
                          <span className="text-[10px] text-violet-200 block uppercase tracking-wider">
                            {t.common.matchScore}
                          </span>
                          <span className="text-xl font-bold font-mono text-white tabular-nums">
                            {recommendation.overall_score}%
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Recommendation Sub-tabs */}
                  <div className="flex items-center gap-2 px-5 py-2.5 bg-neutral-50 dark:bg-neutral-850 border-b border-neutral-200 dark:border-neutral-800 text-xs font-medium">
                    <button
                      onClick={() => setActiveTab('primary')}
                      className={`px-3 py-1.5 rounded-lg transition-colors ${
                        activeTab === 'primary'
                          ? 'bg-white dark:bg-neutral-800 text-violet-700 dark:text-violet-300 shadow-xs font-semibold'
                          : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900'
                      }`}
                    >
                      {isRtl ? 'تفاصيل التوصية والتعليل' : 'Decision Rationale'}
                    </button>
                    <button
                      onClick={() => setActiveTab('alternatives')}
                      className={`px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1.5 ${
                        activeTab === 'alternatives'
                          ? 'bg-white dark:bg-neutral-800 text-violet-700 dark:text-violet-300 shadow-xs font-semibold'
                          : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900'
                      }`}
                    >
                      <span>{t.ai.alternativeCandidates}</span>
                      <span className="px-1.5 py-0.2 rounded text-[10px] bg-neutral-200 dark:bg-neutral-700 font-mono">
                        {recommendation.alternative_candidates.length}
                      </span>
                    </button>
                    <button
                      onClick={() => setActiveTab('system-info')}
                      className={`px-3 py-1.5 rounded-lg transition-colors ${
                        activeTab === 'system-info'
                          ? 'bg-white dark:bg-neutral-800 text-violet-700 dark:text-violet-300 shadow-xs font-semibold'
                          : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900'
                      }`}
                    >
                      {isRtl ? 'معلومات الخدمة وGroq' : 'AI Pipeline Metadata'}
                    </button>
                  </div>

                  {/* Tab Body */}
                  <div className="p-5 space-y-5">
                    {activeTab === 'primary' && (
                      <>
                        {/* Natural Language Explanation Box */}
                        <div className="p-4 rounded-xl bg-violet-50/50 dark:bg-violet-950/20 border border-violet-100 dark:border-violet-900/40">
                          <div className="flex items-center gap-2 text-xs font-bold text-violet-950 dark:text-violet-200 mb-2">
                            <Zap className="w-4 h-4 text-violet-600" />
                            <span>{t.ai.whyRecommended}</span>
                          </div>
                          <p className="text-xs text-neutral-700 dark:text-neutral-300 leading-relaxed font-normal">
                            {recommendation.explanation}
                          </p>
                        </div>

                        {/* Quantitative Match Grid */}
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                          <div className="p-3 rounded-lg border border-neutral-100 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-800/40">
                            <span className="text-[11px] text-neutral-400 block">{t.ai.skillMatch}</span>
                            <span className="font-semibold text-emerald-600 dark:text-emerald-400 flex items-center gap-1 mt-1">
                              <CheckCircle2 className="w-3.5 h-3.5" />
                              <span>{isRtl ? 'متطابقة وموثقة' : 'Verified Match'}</span>
                            </span>
                          </div>

                          <div className="p-3 rounded-lg border border-neutral-100 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-800/40">
                            <span className="text-[11px] text-neutral-400 block">{t.ai.proficiencyLevel}</span>
                            <span className="font-semibold text-neutral-900 dark:text-white mt-1 capitalize block">
                              {recommendation.skill_level}
                            </span>
                          </div>

                          <div className="p-3 rounded-lg border border-neutral-100 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-800/40">
                            <span className="text-[11px] text-neutral-400 block">{t.ai.relevantExperience}</span>
                            <span className="font-semibold text-neutral-900 dark:text-white mt-1 tabular-nums block">
                              {recommendation.skill_experience} {isRtl ? 'سنوات' : 'years'}
                            </span>
                          </div>

                          <div className="p-3 rounded-lg border border-neutral-100 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-800/40">
                            <span className="text-[11px] text-neutral-400 block">{t.ai.weeklyCapacity}</span>
                            <span className="font-semibold text-neutral-900 dark:text-white mt-1 tabular-nums block">
                              {recommendation.remaining_available_hours} {t.common.hours}
                            </span>
                          </div>
                        </div>

                        {/* Capacity Load Balance Indicator */}
                        <div className="p-4 rounded-xl border border-neutral-200 dark:border-neutral-800">
                          <div className="flex items-center justify-between text-xs mb-2">
                            <span className="font-semibold text-neutral-800 dark:text-neutral-200">
                              {t.ai.workloadAnalysis}
                            </span>
                            <span className="text-emerald-600 dark:text-emerald-400 font-medium">
                              {recommendation.can_cover_task
                                ? isRtl
                                  ? 'سعة ملائمة بدون تجاوز الحدود القصوى'
                                  : 'Optimal Capacity Available'
                                : isRtl
                                ? 'تحذير: عبء عمل مرتفع'
                                : 'High Workload Risk'}
                            </span>
                          </div>
                          <ProgressBar progress={recommendation.availability_percentage} color="emerald" size="sm" />
                          <div className="flex justify-between items-center text-[11px] text-neutral-400 mt-2">
                            <span>
                              {isRtl ? 'المطلوب للمهمة:' : 'Task Needs:'} {recommendation.estimated_task_hours} {t.common.hours}
                            </span>
                            <span>
                              {isRtl ? 'المتاح في جدول المرشح:' : 'Available in schedule:'} {recommendation.remaining_available_hours} {t.common.hours}
                            </span>
                          </div>
                        </div>
                      </>
                    )}

                    {activeTab === 'alternatives' && (
                      <div className="space-y-4">
                        <p className="text-xs text-neutral-500">
                          {isRtl
                            ? 'المرشحون الآخرون المؤهلون ومقارنة مدى جاهزيتهم الفنية والزمنية للمهمة:'
                            : 'Alternative qualified personnel and side-by-side capacity comparison:'}
                        </p>

                        <div className="space-y-3">
                          {recommendation.alternative_candidates.map((alt) => (
                            <div
                              key={alt.position_id}
                              className="p-4 rounded-xl border border-neutral-200 dark:border-neutral-800 hover:border-neutral-300 dark:hover:border-neutral-700 transition-colors"
                            >
                              <div className="flex items-start justify-between gap-4 mb-2">
                                <div className="flex items-center gap-3">
                                  <EmployeeAvatar name={alt.employee_name} size="md" />
                                  <div>
                                    <h4 className="text-xs font-bold text-neutral-900 dark:text-white">
                                      {alt.employee_name}
                                    </h4>
                                    <p className="text-[11px] text-neutral-400">
                                      {alt.job_title} · {alt.department_name}
                                    </p>
                                  </div>
                                </div>

                                <div className="text-end">
                                  <span className="text-xs font-bold font-mono text-neutral-700 dark:text-neutral-300">
                                    {alt.overall_score}%
                                  </span>
                                  <span className="text-[10px] text-neutral-400 block">
                                    {t.common.matchScore}
                                  </span>
                                </div>
                              </div>

                              <p className="text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed bg-neutral-50 dark:bg-neutral-850 p-2.5 rounded-lg mb-3">
                                {alt.explanation}
                              </p>

                              <div className="flex items-center justify-between text-[11px] text-neutral-500 pt-2 border-t border-neutral-100 dark:border-neutral-800">
                                <span>
                                  {isRtl ? 'الخبرة في المهارة:' : 'Skill Exp:'} {alt.skill_experience} {isRtl ? 'سنوات' : 'yrs'} ({alt.skill_level})
                                </span>
                                <span>
                                  {isRtl ? 'الساعات المتاحة:' : 'Capacity:'} {alt.remaining_available_hours} {t.common.hours}
                                </span>
                                <button
                                  onClick={() => handleManagerDecision('accepted', `تم اعتماد المرشح البديل ${alt.employee_name}`)}
                                  className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline"
                                >
                                  {isRtl ? 'اعتماد هذا البديل' : 'Select This Alternative'}
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {activeTab === 'system-info' && (
                      <div className="space-y-3 text-xs">
                        <div className="p-4 rounded-xl bg-neutral-50 dark:bg-neutral-800/50 border border-neutral-200 dark:border-neutral-700 space-y-2">
                          <div className="flex justify-between">
                            <span className="text-neutral-500">AI Service Provider:</span>
                            <span className="font-semibold text-neutral-900 dark:text-white font-mono">
                              Groq Cloud LPUs
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-neutral-500">Orchestration Architecture:</span>
                            <span className="font-semibold text-neutral-900 dark:text-white font-mono">
                              Laravel 11 API → FastAPI Microservice → Groq
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-neutral-500">Database Persistence Table:</span>
                            <span className="font-semibold text-neutral-900 dark:text-white font-mono">
                              ai_task_recommendations
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-neutral-500">Recommendation ID:</span>
                            <span className="font-semibold text-neutral-900 dark:text-white font-mono">
                              REC-{recommendation.id}
                            </span>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Explicit Managerial Actions Panel */}
                    <div className="pt-4 border-t border-neutral-200 dark:border-neutral-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div className="text-xs">
                        <span className="text-neutral-500 block">
                          {isRtl ? 'حالة قرار المدير الحالي:' : 'Current Decision State:'}
                        </span>
                        <span className="font-semibold text-neutral-900 dark:text-white">
                          {recommendation.manager_decision === 'accepted'
                            ? isRtl ? 'تم الاعتماد وإسناد المنصب' : 'Accepted & Assigned'
                            : recommendation.manager_decision === 'rejected'
                            ? isRtl ? 'تم الرفض' : 'Rejected'
                            : isRtl ? 'معلق بانتظار قرار المدير' : 'Pending Manager Review'}
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleManagerDecision('rejected')}
                          className="px-3.5 py-2 text-xs font-semibold text-rose-700 dark:text-rose-300 bg-rose-50 dark:bg-rose-950/40 hover:bg-rose-100 rounded-lg border border-rose-200 dark:border-rose-800 transition-colors"
                        >
                          {t.ai.rejectRecommendation}
                        </button>
                        <button
                          onClick={() => handleManagerDecision('accepted')}
                          className="px-4 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-xs transition-colors"
                        >
                          {t.ai.acceptRecommendation}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </>
          ) : (
            <div className="p-12 text-center text-xs text-neutral-400 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl">
              {t.ai.selectTaskToAnalyze}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
