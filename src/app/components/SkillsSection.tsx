'use client';

import React, { useEffect, useRef, useState } from 'react';
import { useAdmin } from '@/context/AdminContext';

const SKILLS_STORAGE_KEY = 'kruthik_portfolio_skills';

const DEFAULT_SKILL_GROUPS = [
  {
    id: 'languages',
    label: 'Languages',
    skills: ['Python', 'SQL', 'JavaScript'],
    colSpan: 'md:col-span-2',
    accent: 'var(--primary)',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <polyline points="16 18 22 12 16 6" /><polyline points="8 6 2 12 8 18" />
      </svg>
    ),
  },
  {
    id: 'web',
    label: 'Web & Framework',
    skills: ['HTML', 'CSS', 'Django'],
    colSpan: 'md:col-span-1',
    accent: '#7A9E7E',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <circle cx="12" cy="12" r="10" /><line x1="2" y1="12" x2="22" y2="12" />
        <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
      </svg>
    ),
  },
  {
    id: 'database',
    label: 'Database & ORM',
    skills: ['MySQL', 'MySQL Connector', 'Django ORM'],
    colSpan: 'md:col-span-1',
    accent: '#7A6E9E',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <ellipse cx="12" cy="5" rx="9" ry="3" /><path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3" />
        <path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5" />
      </svg>
    ),
  },
  {
    id: 'tools',
    label: 'Tools & Platforms',
    skills: ['Git', 'GitHub', 'VS Code', 'PyCharm', 'Postman'],
    colSpan: 'md:col-span-1',
    accent: '#9E7A7A',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
      </svg>
    ),
  },
  {
    id: 'os',
    label: 'Operating Systems',
    skills: ['Linux (Ubuntu)', 'Windows'],
    colSpan: 'md:col-span-1',
    accent: '#7A8E9E',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <rect x="2" y="3" width="20" height="14" rx="2" ry="2" /><line x1="8" y1="21" x2="16" y2="21" /><line x1="12" y1="17" x2="12" y2="21" />
      </svg>
    ),
  },
  {
    id: 'concepts',
    label: 'Concepts & Libraries',
    skills: ['OOP', 'CRUD', 'Exception Handling', 'NumPy', 'Pandas'],
    colSpan: 'md:col-span-3',
    accent: 'var(--accent)',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
      </svg>
    ),
  },
];

type SkillData = { id: string; skills: string[] };

export default function SkillsSection() {
  const { isUnlocked, openPasswordModal } = useAdmin();
  const sectionRef = useRef<HTMLElement>(null);
  const [skillGroups, setSkillGroups] = useState(DEFAULT_SKILL_GROUPS);
  const [addingTo, setAddingTo] = useState<string | null>(null);
  const [newSkillInput, setNewSkillInput] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const stored = localStorage.getItem(SKILLS_STORAGE_KEY);
    if (stored) {
      try {
        const parsed: SkillData[] = JSON.parse(stored);
        setSkillGroups((prev) =>
          prev.map((g) => {
            const saved = parsed.find((s) => s.id === g.id);
            return saved ? { ...g, skills: saved.skills } : g;
          })
        );
      } catch {
        // use defaults
      }
    }
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) entry.target.classList.add('animate');
        });
      },
      { threshold: 0.1, rootMargin: '0px 0px -5% 0px' }
    );
    const targets = sectionRef?.current?.querySelectorAll('.animate-on-scroll');
    targets?.forEach((el) => observer?.observe(el));
    return () => observer?.disconnect();
  }, []);

  useEffect(() => {
    if (addingTo && inputRef.current) {
      inputRef.current.focus();
    }
  }, [addingTo]);

  const persistSkills = (updated: typeof DEFAULT_SKILL_GROUPS) => {
    const toStore: SkillData[] = updated.map((g) => ({ id: g.id, skills: g.skills }));
    localStorage.setItem(SKILLS_STORAGE_KEY, JSON.stringify(toStore));
    setSkillGroups(updated);
  };

  const handlePlusClick = (groupId: string) => {
    if (isUnlocked) {
      setAddingTo(groupId);
      setNewSkillInput('');
    } else {
      openPasswordModal();
    }
  };

  const removeSkill = (groupId: string, skill: string) => {
    if (isUnlocked) {
      const updated = skillGroups.map((g) =>
        g.id === groupId ? { ...g, skills: g.skills.filter((s) => s !== skill) } : g
      );
      persistSkills(updated);
    } else {
      openPasswordModal();
    }
  };

  const handleAddSkillSubmit = (groupId: string) => {
    const trimmed = newSkillInput.trim();
    if (!trimmed) return;
    const updated = skillGroups.map((g) =>
      g.id === groupId ? { ...g, skills: [...g.skills, trimmed] } : g
    );
    persistSkills(updated);
    setNewSkillInput('');
    setAddingTo(null);
  };

  const handleKeyDown = (e: React.KeyboardEvent, groupId: string) => {
    if (e.key === 'Enter') handleAddSkillSubmit(groupId);
    if (e.key === 'Escape') { setAddingTo(null); setNewSkillInput(''); }
  };

  return (
    <section ref={sectionRef} id="skills" className="py-20 relative overflow-hidden">
      {/* Separator */}
      <div className="max-w-7xl mx-auto px-4 md:px-6 mb-14">
        <div
          className="animate-on-scroll flex items-center gap-6"
          style={{ animation: 'animationIn 0.8s ease-out 0.1s forwards', opacity: 0 }}
        >
          <div className="flex-1 h-px bg-border" />
          <div className="flex items-center gap-3">
            <span className="text-xs tracking-widest uppercase text-muted-foreground">Technical Skills</span>
          </div>
          <div className="flex-1 h-px bg-border" />
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 md:px-6">
        <div
          className="animate-on-scroll mb-10"
          style={{ animation: 'animationIn 0.8s ease-out 0.15s forwards', opacity: 0 }}
        >
          <h2 className="font-display text-4xl md:text-5xl font-light text-foreground tracking-tight">
            What I work with
          </h2>
          <p className="text-muted-foreground font-light mt-2 text-sm">
            Skills built through projects, coursework, and practical development.
          </p>
        </div>

        {/* Bento grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {skillGroups?.map((group, index) => (
            <div
              key={group?.id}
              className={`animate-on-scroll glass-card-hover p-6 rounded-2xl ${group?.colSpan} relative`}
              style={{
                animation: `animationIn 0.8s ease-out ${0.2 + index * 0.1}s forwards`,
                opacity: 0,
              }}
            >
              {/* Header row with ALWAYS VISIBLE + Add Skill button */}
              <div className="flex items-center justify-between gap-3 mb-4">
                <div className="flex items-center gap-3">
                  <div
                    className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
                    style={{ background: `${group?.accent}18`, color: group?.accent }}
                  >
                    {group?.icon}
                  </div>
                  <span className="text-xs tracking-widest uppercase text-muted-foreground font-medium">
                    {group?.label}
                  </span>
                </div>

                {/* + Add skill button — ALWAYS VISIBLE */}
                <button
                  onClick={() => handlePlusClick(group.id)}
                  title={`Add skill to ${group.label}`}
                  className="w-6 h-6 rounded-full flex items-center justify-center transition-all duration-200 hover:scale-110"
                  style={{
                    background: 'rgba(200,150,90,0.15)',
                    border: '1px solid rgba(200,150,90,0.4)',
                    color: 'var(--primary)',
                  }}
                >
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
                  </svg>
                </button>
              </div>

              {/* Skills pills */}
              <div className="flex flex-wrap gap-2">
                {group?.skills?.map((skill) => (
                  <span
                    key={skill}
                    className="tag-pill group/skill relative transition-all duration-200 pr-6"
                  >
                    {skill}
                    {/* Delete skill button — ALWAYS VISIBLE on hover */}
                    <button
                      onClick={() => removeSkill(group.id, skill)}
                      className="absolute right-1 top-1/2 -translate-y-1/2 opacity-60 group-hover/skill:opacity-100 transition-opacity duration-150 hover:text-red-400"
                      title={`Remove ${skill}`}
                    >
                      <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                        <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
                      </svg>
                    </button>
                  </span>
                ))}

                {/* Inline add-skill input */}
                {addingTo === group.id && (
                  <div className="flex items-center gap-1.5">
                    <input
                      ref={inputRef}
                      value={newSkillInput}
                      onChange={(e) => setNewSkillInput(e.target.value)}
                      onKeyDown={(e) => handleKeyDown(e, group.id)}
                      placeholder="Skill name…"
                      className="bg-input border border-primary/40 rounded-full px-3 py-0.5 text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/70 transition-colors"
                      style={{ width: '120px' }}
                    />
                    <button
                      onClick={() => handleAddSkillSubmit(group.id)}
                      className="text-xs px-2.5 py-0.5 rounded-full font-medium transition-colors"
                      style={{ background: 'rgba(200,150,90,0.2)', color: 'var(--primary)', border: '1px solid rgba(200,150,90,0.3)' }}
                    >
                      Add
                    </button>
                    <button
                      onClick={() => { setAddingTo(null); setNewSkillInput(''); }}
                      className="text-xs px-1.5 py-0.5 rounded-full text-muted-foreground hover:text-foreground transition-colors"
                    >
                      ✕
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}