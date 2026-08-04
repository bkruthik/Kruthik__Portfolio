'use client';

import React, { useState, useEffect } from 'react';

interface Project {
  id: string;
  title: string;
  description: string;
  tags: string[];
  githubUrl: string;
  liveUrl: string;
  category: string;
  featured: boolean;
  createdAt: string;
}

interface Props {
  project: Project | null;
  onSave: (project: Project) => void;
  onClose: () => void;
}

const CATEGORIES = ['Backend', 'Web', 'CLI', 'Data', 'Mobile', 'Other'];

function slugify(str: string) {
  return str.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
}

export default function ProjectFormModal({ project, onSave, onClose }: Props) {
  const [form, setForm] = useState<Project>({
    id: '',
    title: '',
    description: '',
    tags: [],
    githubUrl: '',
    liveUrl: '',
    category: 'Backend',
    featured: false,
    createdAt: new Date().toISOString().split('T')[0],
  });
  const [tagInput, setTagInput] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (project) {
      setForm(project);
      setTagInput(project.tags.join(', '));
    }
  }, [project]);

  const handleChange = (field: keyof Project, value: unknown) => {
    setForm((f) => ({ ...f, [field]: value }));
    if (errors[field]) setErrors((e) => ({ ...e, [field]: '' }));
  };

  const parseTags = (input: string) =>
    input.split(',').map((t) => t.trim()).filter(Boolean);

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.title.trim()) e.title = 'Title is required';
    if (!form.description.trim()) e.description = 'Description is required';
    if (parseTags(tagInput).length === 0) e.tags = 'Add at least one tech tag';
    return e;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }

    const finalProject: Project = {
      ...form,
      id: form.id || slugify(form.title),
      tags: parseTags(tagInput),
      createdAt: form.createdAt || new Date().toISOString().split('T')[0],
    };
    onSave(finalProject);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: 'rgba(8,7,5,0.85)', backdropFilter: 'blur(12px)' }}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div
        className="w-full max-w-2xl glass-card rounded-2xl overflow-hidden"
        style={{ maxHeight: '90vh', overflowY: 'auto' }}
      >
        {/* Modal header */}
        <div className="flex items-center justify-between p-6 border-b border-border">
          <h2 className="font-display text-xl text-foreground">
            {project ? 'Edit Project' : 'Add New Project'}
          </h2>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg glass-card flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {/* Title */}
          <div>
            <label className="block text-xs tracking-widest uppercase text-muted-foreground mb-2">
              Project Title <span className="text-red-400">*</span>
            </label>
            <input
              type="text"
              value={form.title}
              onChange={(e) => handleChange('title', e.target.value)}
              placeholder="e.g. Student Result Management System"
              className={`w-full bg-input border rounded-lg px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/50 transition-colors ${errors.title ? 'border-red-400/50' : 'border-border'}`}
            />
            {errors.title && <p className="text-xs text-red-400 mt-1">{errors.title}</p>}
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs tracking-widest uppercase text-muted-foreground mb-2">
              Description <span className="text-red-400">*</span>
            </label>
            <textarea
              value={form.description}
              onChange={(e) => handleChange('description', e.target.value)}
              placeholder="Describe what the project does, how you built it, and what you learned. Write in plain paragraphs — this shows directly on your portfolio."
              rows={5}
              className={`w-full bg-input border rounded-lg px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/50 transition-colors resize-none ${errors.description ? 'border-red-400/50' : 'border-border'}`}
            />
            {errors.description && <p className="text-xs text-red-400 mt-1">{errors.description}</p>}
          </div>

          {/* Tags */}
          <div>
            <label className="block text-xs tracking-widest uppercase text-muted-foreground mb-2">
              Tech Tags <span className="text-red-400">*</span>
            </label>
            <input
              type="text"
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              placeholder="Python, MySQL, Django, OOP  (comma-separated)"
              className={`w-full bg-input border rounded-lg px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/50 transition-colors ${errors.tags ? 'border-red-400/50' : 'border-border'}`}
            />
            {tagInput && (
              <div className="flex flex-wrap gap-1.5 mt-2">
                {parseTags(tagInput).map((tag) => (
                  <span key={tag} className="tag-pill">{tag}</span>
                ))}
              </div>
            )}
            {errors.tags && <p className="text-xs text-red-400 mt-1">{errors.tags}</p>}
          </div>

          {/* Category + Featured */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs tracking-widest uppercase text-muted-foreground mb-2">
                Category
              </label>
              <select
                value={form.category}
                onChange={(e) => handleChange('category', e.target.value)}
                className="w-full bg-input border border-border rounded-lg px-4 py-3 text-sm text-foreground focus:outline-none focus:border-primary/50 transition-colors"
              >
                {CATEGORIES.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs tracking-widest uppercase text-muted-foreground mb-2">
                Date
              </label>
              <input
                type="date"
                value={form.createdAt}
                onChange={(e) => handleChange('createdAt', e.target.value)}
                className="w-full bg-input border border-border rounded-lg px-4 py-3 text-sm text-foreground focus:outline-none focus:border-primary/50 transition-colors"
              />
            </div>
          </div>

          {/* GitHub URL */}
          <div>
            <label className="block text-xs tracking-widest uppercase text-muted-foreground mb-2">
              GitHub URL
            </label>
            <input
              type="url"
              value={form.githubUrl}
              onChange={(e) => handleChange('githubUrl', e.target.value)}
              placeholder="https://github.com/bkruthik/project-name"
              className="w-full bg-input border border-border rounded-lg px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/50 transition-colors"
            />
          </div>

          {/* Live URL */}
          <div>
            <label className="block text-xs tracking-widest uppercase text-muted-foreground mb-2">
              Live Demo URL <span className="text-muted-foreground text-xs normal-case">(optional)</span>
            </label>
            <input
              type="url"
              value={form.liveUrl}
              onChange={(e) => handleChange('liveUrl', e.target.value)}
              placeholder="https://your-demo.vercel.app  (leave blank if none)"
              className="w-full bg-input border border-border rounded-lg px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/50 transition-colors"
            />
          </div>

          {/* Featured toggle */}
          <label className="flex items-center gap-3 cursor-pointer group">
            <div
              className={`relative w-10 h-5 rounded-full transition-colors duration-200 ${form.featured ? 'bg-primary' : 'bg-muted'}`}
              onClick={() => handleChange('featured', !form.featured)}
            >
              <div
                className={`absolute top-0.5 w-4 h-4 rounded-full bg-white transition-transform duration-200 ${form.featured ? 'translate-x-5' : 'translate-x-0.5'}`}
              />
            </div>
            <span className="text-sm text-muted-foreground group-hover:text-foreground transition-colors">
              Mark as Featured <span className="text-xs">(shows in hero section)</span>
            </span>
          </label>

          {/* Actions */}
          <div className="flex gap-3 pt-2 border-t border-border">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 glass-card-hover py-3 text-sm font-medium text-muted-foreground tracking-wide uppercase"
              style={{ borderRadius: '4px' }}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 bg-primary text-primary-foreground py-3 text-sm font-semibold tracking-wide uppercase transition-all duration-300"
              style={{ borderRadius: '4px' }}
              onMouseEnter={(e) => (e.currentTarget.style.boxShadow = '0 0 16px rgba(200,150,90,0.4)')}
              onMouseLeave={(e) => (e.currentTarget.style.boxShadow = 'none')}
            >
              {project ? 'Save Changes' : 'Add Project'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}