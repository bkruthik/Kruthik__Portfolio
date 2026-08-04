'use client';

import React, { useEffect, useState, useRef } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import AppImage from '@/components/ui/AppImage';

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

const projectImages: Record<string, {src: string;alt: string;}> = {
  'student-result-management': {
    src: "https://img.rocket.new/generatedImages/rocket_gen_img_1cc2d888e-1782800966440.png",
    alt: 'Dark terminal screen with code on black background, dim blue glow, shadowed workspace'
  },
  'library-book-management': {
    src: "https://images.unsplash.com/photo-1590598615756-7b9d214f541d",
    alt: 'Dark library shelves in dim amber light, rows of books receding into shadow'
  },
  'personal-expense-tracker': {
    src: "https://img.rocket.new/generatedImages/rocket_gen_img_121109e2f-1772615906438.png",
    alt: 'Dark analytics dashboard on screen, dim environment, moody low-key lighting'
  }
};

const fallbackImage = {
  src: "https://img.rocket.new/generatedImages/rocket_gen_img_178ed799d-1785088751486.png",
  alt: 'Dark code editor on screen in dim office environment, low-key lighting'
};

export default function ProjectDetailClient() {
  const searchParams = useSearchParams();
  const projectId = searchParams.get('id');
  const [project, setProject] = useState<Project | null>(null);
  const [relatedProjects, setRelatedProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch('/projects.json', { cache: 'no-store' });
        const all: Project[] = await res.json();
        const found = all.find((p) => p.id === projectId) || null;
        setProject(found);
        setRelatedProjects(all.filter((p) => p.id !== projectId).slice(0, 2));
      } catch {
        setProject(null);
      } finally {
        setLoading(false);
      }
    };
    if (projectId) load();else
    setLoading(false);
  }, [projectId]);

  useEffect(() => {
    if (!loading) {
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) entry.target.classList.add('animate');
          });
        },
        { threshold: 0.08 }
      );
      const targets = contentRef.current?.querySelectorAll('.animate-on-scroll');
      targets?.forEach((el) => observer.observe(el));
      return () => observer.disconnect();
    }
  }, [loading]);

  const getImg = (id: string) => projectImages[id] || fallbackImage;

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
      </div>);

  }

  if (!project) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4 px-4 text-center pt-20">
        <h2 className="font-display text-3xl text-foreground">Project not found</h2>
        <p className="text-muted-foreground text-sm">This project may have been removed or the link is incorrect.</p>
        <Link href="/#projects" className="text-primary hover:text-accent transition-colors text-sm">
          ← Back to all projects
        </Link>
      </div>);

  }

  const img = getImg(project.id);

  return (
    <div ref={contentRef} className="min-h-screen pt-24 pb-20">
      {/* Hero image */}
      <div className="relative w-full h-[45vh] md:h-[55vh] overflow-hidden mb-0">
        <AppImage
          src={img.src}
          alt={img.alt}
          fill
          priority
          sizes="100vw"
          className="object-cover opacity-40" />
        
        {/* Scrim — dark at bottom where text is */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-background/40 to-background" />

        {/* Back nav overlaid on image */}
        <div className="absolute top-0 left-0 right-0 px-4 md:px-6 pt-6">
          <div className="max-w-4xl mx-auto">
            <Link
              href="/#projects"
              className="inline-flex items-center gap-2 text-xs tracking-widest uppercase text-white/70 hover:text-white transition-colors duration-200 glass-card px-4 py-2 rounded-full">
              
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="19" y1="12" x2="5" y2="12" /><polyline points="12 19 5 12 12 5" />
              </svg>
              All Projects
            </Link>
          </div>
        </div>

        {/* Title overlaid at bottom of hero */}
        <div className="absolute bottom-0 left-0 right-0 px-4 md:px-6 pb-8">
          <div className="max-w-4xl mx-auto">
            <span className="tag-pill mb-3 inline-block">{project.category}</span>
            <h1
              className="animate-on-scroll font-display text-3xl md:text-5xl lg:text-6xl font-light text-white leading-tight tracking-tight"
              style={{ animation: 'animationIn 0.9s ease-out 0.1s forwards', opacity: 0, textShadow: '0 2px 20px rgba(0,0,0,0.8)' }}>
              
              {project.title}
            </h1>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 md:px-6 pt-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* Main content */}
          <div className="lg:col-span-2">
            {/* Description */}
            <div
              className="animate-on-scroll"
              style={{ animation: 'animationIn 0.8s ease-out 0.2s forwards', opacity: 0 }}>
              
              <h2 className="text-xs tracking-widest uppercase text-muted-foreground mb-4">About This Project</h2>
              <div className="prose prose-invert max-w-none">
                {project.description.split('\n').filter(Boolean).map((para, i) =>
                <p key={i} className="text-foreground/80 font-light leading-relaxed text-base mb-4">
                    {para}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-5">
            {/* Tech stack */}
            <div
              className="animate-on-scroll glass-card rounded-xl p-5"
              style={{ animation: 'animationIn 0.8s ease-out 0.25s forwards', opacity: 0 }}>
              
              <h3 className="text-xs tracking-widest uppercase text-muted-foreground mb-3">Tech Stack</h3>
              <div className="flex flex-wrap gap-2">
                {project.tags.map((tag) =>
                <span key={tag} className="tag-pill">{tag}</span>
                )}
              </div>
            </div>

            {/* Date */}
            <div
              className="animate-on-scroll glass-card rounded-xl p-5"
              style={{ animation: 'animationIn 0.8s ease-out 0.3s forwards', opacity: 0 }}>
              
              <h3 className="text-xs tracking-widest uppercase text-muted-foreground mb-1">Built</h3>
              <p className="text-sm text-foreground">
                {new Date(project.createdAt).toLocaleDateString('en-IN', { month: 'long', year: 'numeric' })}
              </p>
            </div>

            {/* Links */}
            <div
              className="animate-on-scroll space-y-3"
              style={{ animation: 'animationIn 0.8s ease-out 0.35s forwards', opacity: 0 }}>
              
              {project.githubUrl &&
              <a
                href={project.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center justify-between w-full glass-card-hover px-5 py-3 rounded-xl text-sm font-medium text-foreground">
                
                  <span className="flex items-center gap-3">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22" />
                    </svg>
                    View on GitHub
                  </span>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
                className="group-hover:translate-x-1 transition-transform duration-200">
                    <line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" />
                  </svg>
                </a>
              }
              {project.liveUrl &&
              <a
                href={project.liveUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center justify-between w-full bg-primary/10 border border-primary/20 hover:bg-primary/15 px-5 py-3 rounded-xl text-sm font-medium text-primary transition-colors duration-200">
                
                  <span className="flex items-center gap-3">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <circle cx="12" cy="12" r="10" /><line x1="2" y1="12" x2="22" y2="12" />
                      <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
                    </svg>
                    Live Demo
                  </span>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
                className="group-hover:translate-x-1 transition-transform duration-200">
                    <line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" />
                  </svg>
                </a>
              }
            </div>
          </div>
        </div>

        {/* Related projects */}
        {relatedProjects.length > 0 &&
        <div
          className="animate-on-scroll mt-16 pt-10 border-t border-border"
          style={{ animation: 'animationIn 0.8s ease-out 0.4s forwards', opacity: 0 }}>
          
            <h2 className="text-xs tracking-widest uppercase text-muted-foreground mb-6">Other Projects</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {relatedProjects.map((rel) => {
              const relImg = getImg(rel.id);
              return (
                <Link
                  key={rel.id}
                  href={`/project-detail?id=${rel.id}`}
                  className="group glass-card-hover rounded-xl overflow-hidden">
                  
                    <div className="relative h-32 overflow-hidden">
                      <AppImage
                      src={relImg.src}
                      alt={relImg.alt}
                      fill
                      sizes="(max-width: 640px) 100vw, 50vw"
                      className="object-cover opacity-40 group-hover:opacity-60 group-hover:scale-105 transition-all duration-500" />
                    
                      <div className="absolute inset-0 bg-gradient-to-t from-card/90 to-transparent" />
                    </div>
                    <div className="p-4">
                      <h3 className="font-display text-sm text-foreground group-hover:text-accent transition-colors duration-200">
                        {rel.title}
                      </h3>
                      <div className="flex flex-wrap gap-1 mt-2">
                        {rel.tags.slice(0, 3).map((t) =>
                      <span key={t} className="tag-pill">{t}</span>
                      )}
                      </div>
                    </div>
                  </Link>);

            })}
            </div>
          </div>
        }

        {/* Bottom CTA */}
        <div
          className="animate-on-scroll mt-12 text-center"
          style={{ animation: 'animationIn 0.8s ease-out 0.45s forwards', opacity: 0 }}>
          
          <p className="text-muted-foreground text-sm mb-4">Interested in working together?</p>
          <a
            href="https://mail.google.com/mail/?view=cm&to=kruthikbalusu@gmail.com"
            target="_blank"
            rel="noopener noreferrer"
            className="group relative overflow-hidden inline-flex items-center gap-3 bg-primary text-primary-foreground px-7 py-3 text-sm font-semibold tracking-wide uppercase transition-all duration-300"
            style={{ borderRadius: '2px' }}
            onMouseEnter={(e) => e.currentTarget.style.boxShadow = '0 0 24px rgba(200,150,90,0.4)'}
            onMouseLeave={(e) => e.currentTarget.style.boxShadow = 'none'}>
            
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
              <polyline points="22,6 12,13 2,6" />
            </svg>
            Get In Touch
            <div className="absolute inset-0 transform -translate-x-full group-hover:translate-x-full transition-transform duration-700 bg-gradient-to-r from-transparent via-white/10 to-transparent skew-x-12" />
          </a>
        </div>
      </div>
    </div>);

}