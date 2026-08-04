'use client';

import React, { useState, useEffect } from 'react';
import AppImage from '@/components/ui/AppImage';
import { useAdmin } from '@/context/AdminContext';

interface Project {
  id: string;
  title: string;
  description: string;
  tags: string[];
  githubUrl: string;
  imageUrl: string;
  createdAt: string;
}

const STORAGE_KEY = 'kruthik_portfolio_projects';

const DEFAULT_PROJECTS: Project[] = [
  {
    id: 'student-result-management',
    title: 'Student Result Management System',
    description:
      'Built a CLI application to add, update, delete, and view student records and results. Used MySQL JOIN queries to fetch student details along with subject results. Added grade logic and pass/fail calculation using OOP principles and simple functions.',
    tags: ['Python', 'MySQL', 'OOP', 'CLI'],
    githubUrl: 'https://github.com/bkruthik',
    imageUrl: '',
    createdAt: '2024-01-01',
  },
  {
    id: 'library-book-management',
    title: 'Library Book Management System',
    description:
      'Managed book records and member borrowing details with full CRUD operations. Designed MySQL tables with foreign key links between books, members, and transactions. Used OOP classes (Book, Member, Library) and SQL queries for search and overdue tracking.',
    tags: ['Python', 'MySQL', 'OOP'],
    githubUrl: 'https://github.com/bkruthik',
    imageUrl: '',
    createdAt: '2024-03-01',
  },
  {
    id: 'personal-expense-tracker',
    title: 'Personal Expense Tracker Web App',
    description:
      'Built a web app using Django where users can add, edit, delete, and view daily expenses. Created Django models for expense entries connected to MySQL using Django ORM. Built forms and views to handle all expense operations using Django templates and basic HTML/CSS. Tracked all code changes using Git and GitHub throughout the project.',
    tags: ['Python', 'Django', 'MySQL', 'HTML', 'CSS', 'Git'],
    githubUrl: 'https://github.com/bkruthik',
    imageUrl: '',
    createdAt: '2024-06-01',
  },
];

function slugify(str: string) {
  return str.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') + '-' + Date.now();
}

const projectImages: Record<string, { src: string; alt: string }> = {
  'student-result-management': {
    src: 'https://images.unsplash.com/photo-1719253479758-9ab3a77e3af5',
    alt: 'Dark terminal screen with code, dim blue glow, shadowed workspace',
  },
  'library-book-management': {
    src: 'https://images.unsplash.com/photo-1590598615756-7b9d214f541d',
    alt: 'Dark library shelves in dim amber light, rows of books receding into shadow',
  },
  'personal-expense-tracker': {
    src: 'https://img.rocket.new/generatedImages/rocket_gen_img_121109e2f-1772615906438.png',
    alt: 'Dark analytics dashboard on screen, dim environment, moody low-key lighting',
  },
};

const fallbackImage = {
  src: 'https://img.rocket.new/generatedImages/rocket_gen_img_178ed799d-1785088751486.png',
  alt: 'Dark code editor on screen in dim office environment, low-key lighting',
};

function getProjectImage(project: Project) {
  if (project.imageUrl) return { src: project.imageUrl, alt: project.title };
  return projectImages[project.id] || fallbackImage;
}

export default function ProjectsSection() {
  const { isUnlocked, openPasswordModal } = useAdmin();
  const [projects, setProjects] = useState<Project[]>([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const sectionRef = React.useRef<HTMLElement>(null);

  // Load projects from localStorage (or defaults if first visit)
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        setProjects(JSON.parse(stored));
      } catch {
        setProjects(DEFAULT_PROJECTS);
      }
    } else {
      setProjects(DEFAULT_PROJECTS);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(DEFAULT_PROJECTS));
    }
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) entry.target.classList.add('animate');
        });
      },
      { threshold: 0.08, rootMargin: '0px 0px -5% 0px' }
    );
    const targets = sectionRef.current?.querySelectorAll('.animate-on-scroll');
    targets?.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [projects]);

  const handlePlusClick = () => {
    if (isUnlocked) {
      setShowAddModal(true);
    } else {
      openPasswordModal();
    }
  };

  const handleDeleteClick = (projectId: string) => {
    if (isUnlocked) {
      const updated = projects.filter((p) => p.id !== projectId);
      setProjects(updated);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    }
  };

  const handleAddProject = (project: Project) => {
    const updated = [...projects, project];
    setProjects(updated);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    setShowAddModal(false);
  };

  return (
    <>
      <section ref={sectionRef} id="projects" className="py-20 relative overflow-hidden">
        {/* Ambient glow */}
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] pointer-events-none"
          style={{ background: 'radial-gradient(ellipse, rgba(200,150,90,0.04) 0%, transparent 70%)', filter: 'blur(40px)' }}
        />

        <div className="max-w-7xl mx-auto px-4 md:px-6">
          {/* Section header */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-12">
            <div
              className="animate-on-scroll"
              style={{ animation: 'animationIn 0.8s ease-out 0.1s forwards', opacity: 0 }}
            >
              <span className="text-xs tracking-widest uppercase text-primary mb-2 block">Selected Work</span>
              <h2 className="font-display text-4xl md:text-5xl font-light text-foreground tracking-tight">
                Projects
              </h2>
            </div>
            
            {/* + Add Project button — visible when unlocked */}
            {isUnlocked && (
              <div
                className="animate-on-scroll"
                style={{ animation: 'animationIn 0.8s ease-out 0.2s forwards', opacity: 0 }}
              >
                <button
                  onClick={handlePlusClick}
                  className="group glass-card-hover inline-flex items-center gap-2 px-4 py-2 text-xs tracking-widest uppercase text-primary border border-primary/30 hover:bg-primary/10 transition-all duration-200"
                  style={{ borderRadius: '4px' }}
                  title="Add a new project"
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <line x1="12" y1="5" x2="12" y2="19" />
                    <line x1="5" y1="12" x2="19" y2="12" />
                  </svg>
                  + Add Project
                </button>
              </div>
            )}
          </div>

          {/* Projects grid */}
          {projects.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-muted-foreground text-sm mb-4">No projects listed yet.</p>
              {isUnlocked && (
                <button
                  onClick={handlePlusClick}
                  className="px-5 py-2.5 bg-primary text-primary-foreground text-xs uppercase tracking-wider rounded font-medium"
                >
                  + Add First Project
                </button>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {projects.map((project, index) => {
                const img = getProjectImage(project);
                return (
                  <div
                    key={project.id}
                    className="animate-on-scroll group relative rounded-2xl overflow-hidden glass-card transition-all duration-500 hover:border-primary/20 hover:-translate-y-1"
                    style={{
                      animation: `animationIn 0.8s ease-out ${0.15 + index * 0.12}s forwards`,
                      opacity: 0,
                      border: '1px solid var(--border)',
                    }}
                  >
                    {/* Delete button on card — only visible when unlocked */}
                    {isUnlocked && (
                      <button
                        onClick={() => handleDeleteClick(project.id)}
                        title="Delete project"
                        className="absolute top-3 right-3 z-20 w-7 h-7 rounded-full bg-background/80 backdrop-blur border border-red-500/30 text-red-400 hover:text-red-300 hover:bg-red-500/20 flex items-center justify-center transition-all duration-200 opacity-60 hover:opacity-100"
                      >
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <polyline points="3 6 5 6 21 6" />
                          <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                        </svg>
                      </button>
                    )}

                    {/* Image */}
                    <div className="relative h-48 overflow-hidden">
                      <AppImage
                        src={img.src}
                        alt={img.alt}
                        fill
                        sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        className="object-cover opacity-50 group-hover:opacity-70 group-hover:scale-105 transition-all duration-700"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-card via-card/60 to-transparent" />
                    </div>

                    {/* Content */}
                    <div className="p-5">
                      <h3 className="font-display text-lg font-light text-foreground mb-2 leading-snug group-hover:text-accent transition-colors duration-300">
                        {project.title}
                      </h3>
                      <p className="text-sm text-muted-foreground font-light leading-relaxed mb-4 line-clamp-3">
                        {project.description}
                      </p>

                      {/* Tags */}
                      <div className="flex flex-wrap gap-1.5 mb-4">
                        {project.tags.slice(0, 4).map((tag) => (
                          <span key={tag} className="tag-pill">{tag}</span>
                        ))}
                        {project.tags.length > 4 && (
                          <span className="tag-pill">+{project.tags.length - 4}</span>
                        )}
                      </div>

                      {/* Footer */}
                      <div className="flex items-center justify-between pt-3 border-t border-border">
                        {project.githubUrl && (
                          <a
                            href={project.githubUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-1.5 text-xs text-primary hover:text-accent transition-colors duration-200"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
                              <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22" />
                            </svg>
                            GitHub
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* Add Project Modal */}
      {showAddModal && (
        <AddProjectModal
          onSave={handleAddProject}
          onClose={() => setShowAddModal(false)}
        />
      )}
    </>
  );
}

// ─── Add Project Modal ────────────────────────────────────────────────────────

interface AddProjectModalProps {
  onSave: (project: Project) => void;
  onClose: () => void;
}

function AddProjectModal({ onSave, onClose }: AddProjectModalProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [tagsInput, setTagsInput] = useState('');
  const [githubUrl, setGithubUrl] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const e: Record<string, string> = {};
    if (!title.trim()) e.title = 'Project name is required';
    if (!description.trim()) e.description = 'Description is required';
    if (!tagsInput.trim()) e.tags = 'Add at least one tech tag';
    return e;
  };

  const parseTags = (input: string) =>
    input.split(',').map((t) => t.trim()).filter(Boolean);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }

    const project: Project = {
      id: slugify(title),
      title: title.trim(),
      description: description.trim(),
      tags: parseTags(tagsInput),
      githubUrl: githubUrl.trim(),
      imageUrl: imageUrl.trim(),
      createdAt: new Date().toISOString().split('T')[0],
    };
    onSave(project);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: 'rgba(8,7,5,0.88)', backdropFilter: 'blur(16px)' }}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div
        className="w-full max-w-xl glass-card rounded-2xl overflow-hidden"
        style={{ maxHeight: '90vh', overflowY: 'auto' }}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border">
          <h2 className="font-display text-xl text-foreground">Add New Project</h2>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg glass-card flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {/* Project Name */}
          <div>
            <label className="block text-xs tracking-widest uppercase text-muted-foreground mb-2">
              Project Name <span className="text-red-400">*</span>
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => { setTitle(e.target.value); if (errors.title) setErrors((er) => ({ ...er, title: '' })); }}
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
              value={description}
              onChange={(e) => { setDescription(e.target.value); if (errors.description) setErrors((er) => ({ ...er, description: '' })); }}
              placeholder="Describe what the project does, how you built it, and what you learned."
              rows={4}
              className={`w-full bg-input border rounded-lg px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/50 transition-colors resize-none ${errors.description ? 'border-red-400/50' : 'border-border'}`}
            />
            {errors.description && <p className="text-xs text-red-400 mt-1">{errors.description}</p>}
          </div>

          {/* Tech Tags */}
          <div>
            <label className="block text-xs tracking-widest uppercase text-muted-foreground mb-2">
              Tech Stack Tags <span className="text-red-400">*</span>
            </label>
            <input
              type="text"
              value={tagsInput}
              onChange={(e) => { setTagsInput(e.target.value); if (errors.tags) setErrors((er) => ({ ...er, tags: '' })); }}
              placeholder="Python, MySQL, Django  (comma-separated)"
              className={`w-full bg-input border rounded-lg px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/50 transition-colors ${errors.tags ? 'border-red-400/50' : 'border-border'}`}
            />
            {tagsInput && (
              <div className="flex flex-wrap gap-1.5 mt-2">
                {tagsInput.split(',').map((t) => t.trim()).filter(Boolean).map((tag) => (
                  <span key={tag} className="tag-pill">{tag}</span>
                ))}
              </div>
            )}
            {errors.tags && <p className="text-xs text-red-400 mt-1">{errors.tags}</p>}
          </div>

          {/* GitHub Link */}
          <div>
            <label className="block text-xs tracking-widest uppercase text-muted-foreground mb-2">
              GitHub Link
            </label>
            <input
              type="url"
              value={githubUrl}
              onChange={(e) => setGithubUrl(e.target.value)}
              placeholder="https://github.com/bkruthik/project-name"
              className="w-full bg-input border border-border rounded-lg px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/50 transition-colors"
            />
          </div>

          {/* Image URL (optional) */}
          <div>
            <label className="block text-xs tracking-widest uppercase text-muted-foreground mb-2">
              Project Image URL{' '}
              <span className="text-muted-foreground text-xs normal-case">(optional)</span>
            </label>
            <input
              type="url"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              placeholder="https://example.com/image.png  (leave blank for default background)"
              className="w-full bg-input border border-border rounded-lg px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/50 transition-colors"
            />
          </div>

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
              Add Project
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
