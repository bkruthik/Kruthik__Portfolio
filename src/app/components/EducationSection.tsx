'use client';

import React, { useEffect, useRef, useState } from 'react';
import { useAdmin } from '@/context/AdminContext';

const CERT_STORAGE_KEY = 'kruthik_portfolio_certifications';

interface Certification {
  id?: string;
  name: string;
  issuer: string;
}

const DEFAULT_CERTIFICATIONS: Certification[] = [
  { id: '1', name: 'Python Bootcamp', issuer: 'Udemy' },
  { id: '2', name: 'MySQL Certificate', issuer: 'SimpliLearn' },
  { id: '3', name: 'Python for Data Science', issuer: 'NPTEL' },
  { id: '4', name: 'Linux Workshop Certificate', issuer: 'Hands-on Linux & File System' },
  { id: '5', name: 'Python Certificate', issuer: 'HackerRank' },
];

const education = [
  {
    degree: 'B.Tech in Computer Science Engineering',
    institution: 'Sreyas Institute of Engineering and Technology',
    location: 'Hyderabad',
    period: 'Aug 2023 – May 2027',
    status: 'Ongoing',
    statusColor: 'var(--primary)',
  },
  {
    degree: 'Intermediate – MPC (Class XII)',
    institution: 'Urbane Junior College',
    location: 'Hyderabad',
    period: 'Aug 2021 – May 2023',
    status: 'Completed',
    statusColor: 'var(--muted-foreground)',
  },
  {
    degree: 'SSC (Class X)',
    institution: 'Suprabhat Model High School',
    location: 'Hyderabad',
    period: 'Aug 2020 – May 2021',
    status: 'Completed',
    statusColor: 'var(--muted-foreground)',
  },
];

export default function EducationSection() {
  const { isUnlocked, openPasswordModal } = useAdmin();
  const sectionRef = useRef<HTMLElement>(null);
  const [certifications, setCertifications] = useState<Certification[]>([]);
  const [showAddModal, setShowAddModal] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem(CERT_STORAGE_KEY);
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        setCertifications(parsed.map((c: any, i: number) => ({ ...c, id: c.id || String(i) })));
      } catch {
        setCertifications(DEFAULT_CERTIFICATIONS);
      }
    } else {
      setCertifications(DEFAULT_CERTIFICATIONS);
      localStorage.setItem(CERT_STORAGE_KEY, JSON.stringify(DEFAULT_CERTIFICATIONS));
    }
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) entry.target.classList.add('animate');
        });
      },
      { threshold: 0.08 }
    );
    const targets = sectionRef?.current?.querySelectorAll('.animate-on-scroll');
    targets?.forEach((el) => observer?.observe(el));
    return () => observer?.disconnect();
  }, [certifications]);

  const handlePlusClick = () => {
    if (isUnlocked) {
      setShowAddModal(true);
    } else {
      openPasswordModal();
    }
  };

  const handleDeleteClick = (index: number) => {
    if (isUnlocked) {
      const updated = certifications.filter((_, i) => i !== index);
      setCertifications(updated);
      localStorage.setItem(CERT_STORAGE_KEY, JSON.stringify(updated));
    }
  };

  const handleAddCertification = (cert: Certification) => {
    const updated = [...certifications, { ...cert, id: String(Date.now()) }];
    setCertifications(updated);
    localStorage.setItem(CERT_STORAGE_KEY, JSON.stringify(updated));
    setShowAddModal(false);
  };

  return (
    <>
      <section ref={sectionRef} id="education" className="py-20 relative overflow-hidden">
        {/* Border separator */}
        <div className="max-w-7xl mx-auto px-4 md:px-6 mb-14">
          <div className="h-px bg-border" />
        </div>
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          <div
            className="animate-on-scroll mb-12"
            style={{ animation: 'animationIn 0.8s ease-out 0.1s forwards', opacity: 0 }}
          >
            <h2 className="font-display text-4xl md:text-5xl font-light text-foreground tracking-tight">
              Education & Credentials
            </h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Education timeline */}
            <div
              className="animate-on-scroll"
              style={{ animation: 'animationIn 0.8s ease-out 0.15s forwards', opacity: 0 }}
            >
              <h3 className="text-xs tracking-widest uppercase text-muted-foreground mb-6">Education</h3>

              <div className="relative border-l border-border pl-6 space-y-8">
                <div className="vertical-beam" />

                {education?.map((edu, index) => (
                  <div key={index} className="relative group">
                    <div
                      className="absolute -left-[25px] top-1.5 w-3 h-3 rounded-full border-2 transition-all duration-300"
                      style={{
                        background: index === 0 ? 'var(--primary)' : 'var(--card)',
                        borderColor: index === 0 ? 'var(--primary)' : 'var(--border)',
                        boxShadow: index === 0 ? '0 0 10px rgba(200,150,90,0.4)' : 'none',
                      }}
                    />

                    <div className="glass-card-hover p-4 rounded-xl">
                      <div className="flex items-start justify-between gap-2 mb-1">
                        <h4 className="font-display text-base text-foreground font-light leading-snug">
                          {edu?.degree}
                        </h4>
                        <span
                          className="text-xs px-2 py-0.5 rounded-full shrink-0"
                          style={{
                            background: index === 0 ? 'rgba(200,150,90,0.12)' : 'rgba(122,117,112,0.12)',
                            color: edu?.statusColor,
                            border: `1px solid ${edu?.statusColor}30`,
                          }}
                        >
                          {edu?.status}
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground">{edu?.institution}</p>
                      <p className="text-xs text-muted-foreground mt-1">{edu?.period}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Certifications */}
            <div
              className="animate-on-scroll"
              style={{ animation: 'animationIn 0.8s ease-out 0.25s forwards', opacity: 0 }}
            >
              {/* Certifications header */}
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xs tracking-widest uppercase text-muted-foreground">Certifications</h3>
                {isUnlocked && (
                  <button
                    onClick={handlePlusClick}
                    className="group glass-card-hover inline-flex items-center gap-1.5 px-3 py-1.5 text-xs tracking-widest uppercase text-primary border border-primary/30 hover:bg-primary/10 transition-colors duration-200"
                    style={{ borderRadius: '4px' }}
                    title="Add a new certification"
                  >
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <line x1="12" y1="5" x2="12" y2="19" />
                      <line x1="5" y1="12" x2="19" y2="12" />
                    </svg>
                    + Add Certification
                  </button>
                )}
              </div>

              <div className="space-y-3">
                {certifications?.map((cert, index) => (
                  <div
                    key={cert.id || index}
                    className="glass-card-hover flex items-center justify-between gap-4 p-4 rounded-xl group relative"
                    style={{ animationDelay: `${index * 0.06}s` }}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
                        style={{ background: 'rgba(200,150,90,0.1)' }}
                      >
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--primary)" strokeWidth="2">
                          <circle cx="12" cy="8" r="6" />
                          <path d="M15.477 12.89L17 22l-5-3-5 3 1.523-9.11" />
                        </svg>
                      </div>
                      <div>
                        <p className="text-sm text-foreground font-medium">{cert?.name}</p>
                        <p className="text-xs text-muted-foreground">{cert?.issuer}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      {isUnlocked && (
                        <button
                          onClick={() => handleDeleteClick(index)}
                          title="Delete certification"
                          className="w-6 h-6 rounded-full text-muted-foreground hover:text-red-400 hover:bg-red-500/10 flex items-center justify-center transition-colors opacity-40 group-hover:opacity-100"
                        >
                          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
                          </svg>
                        </button>
                      )}
                      <div
                        className="w-5 h-5 rounded-full flex items-center justify-center shrink-0"
                        style={{ background: 'rgba(74,222,128,0.1)', border: '1px solid rgba(74,222,128,0.2)' }}
                      >
                        <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#4ade80" strokeWidth="3">
                          <polyline points="20 6 9 17 4 12" />
                        </svg>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Soft skills */}
              <div className="mt-6 p-4 glass-card rounded-xl">
                <h4 className="text-xs tracking-widest uppercase text-muted-foreground mb-3">Soft Skills</h4>
                <div className="flex flex-wrap gap-2">
                  {['Problem Solving', 'Attention to Detail', 'Quick Learner', 'Team Collaboration', 'Time Management', 'Clear Communication']?.map((skill) => (
                    <span key={skill} className="tag-pill">{skill}</span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Add Certification Modal */}
      {showAddModal && (
        <AddCertificationModal
          onSave={handleAddCertification}
          onClose={() => setShowAddModal(false)}
        />
      )}
    </>
  );
}

// ─── Add Certification Modal ──────────────────────────────────────────────────

interface AddCertificationModalProps {
  onSave: (cert: Certification) => void;
  onClose: () => void;
}

function AddCertificationModal({ onSave, onClose }: AddCertificationModalProps) {
  const [name, setName] = useState('');
  const [issuer, setIssuer] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const errs: Record<string, string> = {};
    if (!name.trim()) errs.name = 'Certificate title is required';
    if (!issuer.trim()) errs.issuer = 'Organization or website is required';
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }
    onSave({ name: name.trim(), issuer: issuer.trim() });
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: 'rgba(8,7,5,0.88)', backdropFilter: 'blur(16px)' }}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="w-full max-w-md glass-card rounded-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border">
          <h2 className="font-display text-xl text-foreground">Add Certification</h2>
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
          {/* Certificate Title */}
          <div>
            <label className="block text-xs tracking-widest uppercase text-muted-foreground mb-2">
              Certificate Title <span className="text-red-400">*</span>
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => { setName(e.target.value); if (errors.name) setErrors((er) => ({ ...er, name: '' })); }}
              placeholder="e.g. Python Bootcamp"
              autoFocus
              className={`w-full bg-input border rounded-lg px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/50 transition-colors ${errors.name ? 'border-red-400/50' : 'border-border'}`}
            />
            {errors.name && <p className="text-xs text-red-400 mt-1">{errors.name}</p>}
          </div>

          {/* Organization / Website */}
          <div>
            <label className="block text-xs tracking-widest uppercase text-muted-foreground mb-2">
              Organization / Website <span className="text-red-400">*</span>
            </label>
            <input
              type="text"
              value={issuer}
              onChange={(e) => { setIssuer(e.target.value); if (errors.issuer) setErrors((er) => ({ ...er, issuer: '' })); }}
              placeholder="e.g. Udemy, Coursera, NPTEL"
              className={`w-full bg-input border rounded-lg px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/50 transition-colors ${errors.issuer ? 'border-red-400/50' : 'border-border'}`}
            />
            {errors.issuer && <p className="text-xs text-red-400 mt-1">{errors.issuer}</p>}
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
              Add Certification
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
