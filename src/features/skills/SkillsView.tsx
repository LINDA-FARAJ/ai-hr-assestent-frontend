import React, { useState, useEffect } from 'react';
import { Award, Users, CheckSquare, Plus, Search, Filter } from 'lucide-react';
import { useTranslation } from '../../i18n/LanguageContext';
import { apiService } from '../../services/api';
import { Skill } from '../../types';
import { Modal } from '../../components/ui/Modal';

export const SkillsView: React.FC = () => {
  const { t, isRtl } = useTranslation();
  const [skills, setSkills] = useState<Skill[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const [name, setName] = useState('');
  const [category, setCategory] = useState('Backend');
  const [description, setDescription] = useState('');

  useEffect(() => {
    async function load() {
      const data = await apiService.getSkills();
      setSkills(data);
    }
    load();
  }, []);

  const handleCreateSkill = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name) return;
    const newSkill = await apiService.createSkill({ name, category, description });
    setSkills([...skills, newSkill]);
    setIsAddModalOpen(false);
    setName('');
    setDescription('');
  };

  const categories = Array.from(new Set(skills.map((s) => s.category)));

  const filtered = skills.filter((sk) => {
    const matchesSearch =
      sk.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      sk.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCat = selectedCategory === 'all' || sk.category === selectedCategory;
    return matchesSearch && matchesCat;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-neutral-200 dark:border-neutral-800">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-neutral-900 dark:text-white tracking-tight">
            {t.skills.title}
          </h1>
          <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1 max-w-2xl leading-relaxed">
            {t.skills.subtitle}
          </p>
        </div>

        <button
          onClick={() => setIsAddModalOpen(true)}
          className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-xs transition-colors shrink-0"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>{t.skills.createSkill}</span>
        </button>
      </div>

      {/* Filter and search */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 p-3 rounded-xl shadow-xs">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 absolute top-1/2 -translate-y-1/2 text-neutral-400 right-3 ltr:left-3 ltr:right-auto" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder={isRtl ? 'بحث في المهارات...' : 'Search skills...'}
            className="w-full text-xs pl-3 pr-9 ltr:pl-9 ltr:pr-3 py-2 bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg outline-none text-neutral-900 dark:text-white"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Filter className="w-3.5 h-3.5 text-neutral-400 shrink-0" />
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="text-xs px-3 py-2 bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg outline-none text-neutral-700 dark:text-neutral-300"
          >
            <option value="all">{isRtl ? 'كافة التصنيفات التقنية' : 'All Categories'}</option>
            {categories.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Skills Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {filtered.map((sk) => (
          <div
            key={sk.id}
            className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl p-4 flex flex-col justify-between hover:border-neutral-300 dark:hover:border-neutral-700 transition-colors"
          >
            <div>
              <div className="flex items-start justify-between gap-2 mb-2">
                <span className="text-[10px] font-semibold uppercase px-2 py-0.5 rounded bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400">
                  {sk.category}
                </span>
                <span className="text-[11px] font-mono text-neutral-400">SKL-{sk.id}</span>
              </div>

              <h3 className="text-xs font-bold text-neutral-900 dark:text-white mb-1.5">{sk.name}</h3>
              <p className="text-[11px] text-neutral-500 dark:text-neutral-400 leading-relaxed mb-4">
                {sk.description}
              </p>
            </div>

            <div className="pt-2.5 border-t border-neutral-100 dark:border-neutral-800 flex items-center justify-between text-[11px] text-neutral-500">
              <span className="flex items-center gap-1">
                <Users className="w-3 h-3 text-neutral-400" />
                <span className="font-semibold text-neutral-800 dark:text-neutral-200 tabular-nums">
                  {sk.employees_count || 1}
                </span>{' '}
                {isRtl ? 'موظف' : 'users'}
              </span>

              <span className="flex items-center gap-1 text-indigo-600 dark:text-indigo-400 font-medium">
                <CheckSquare className="w-3 h-3" />
                <span className="tabular-nums">{sk.tasks_count || 0}</span> {isRtl ? 'مهمة' : 'tasks'}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Add Skill Modal */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title={t.skills.createSkill}
        description={isRtl ? 'إضافة كفاءة أو تقنية برمجية جديدة لمصفوفة المهارات' : 'Register new technical competency'}
      >
        <form onSubmit={handleCreateSkill} className="space-y-4 text-xs">
          <div>
            <label className="font-medium text-neutral-700 dark:text-neutral-300 block mb-1">
              اسم المهارة أو التقنية *
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Next.js, Redis, PyTorch"
              className="w-full px-3 py-2 bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg outline-none"
            />
          </div>

          <div>
            <label className="font-medium text-neutral-700 dark:text-neutral-300 block mb-1">
              التصنيف التقني
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full px-3 py-2 bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg outline-none"
            >
              <option value="Backend">Backend Development</option>
              <option value="Frontend">Frontend Development</option>
              <option value="AI & Data">AI, ML & Data Engineering</option>
              <option value="Mobile">Mobile Apps</option>
              <option value="DevOps">Cloud & DevOps</option>
              <option value="Testing">Quality Assurance</option>
            </select>
          </div>

          <div>
            <label className="font-medium text-neutral-700 dark:text-neutral-300 block mb-1">
              الوصف ومتطلبات الإتقان
            </label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3 py-2 bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg outline-none"
            />
          </div>

          <div className="flex justify-end gap-2 pt-3 border-t border-neutral-100 dark:border-neutral-800">
            <button
              type="button"
              onClick={() => setIsAddModalOpen(false)}
              className="px-4 py-2 rounded-lg border border-neutral-200 dark:border-neutral-700 text-neutral-600 hover:bg-neutral-100"
            >
              {t.common.cancel}
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-medium"
            >
              {t.common.save}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
