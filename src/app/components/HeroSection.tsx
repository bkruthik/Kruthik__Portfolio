'use client';

import React, { useEffect, useRef } from 'react';
import Link from 'next/link';
import AppImage from '@/components/ui/AppImage';


const heroProjects = [
{
  id: 'student-result-management',
  title: 'Student Result\nManagement',
  category: 'Python · MySQL · OOP',
  image: "https://img.rocket.new/generatedImages/rocket_gen_img_1cc2d888e-1782800966440.png",
  alt: 'Dark terminal screen with code on black background, dim blue glow, shadowed workspace'
},
{
  id: 'library-book-management',
  title: 'Library Book\nManagement',
  category: 'Python · MySQL · CRUD',
  image: "https://images.unsplash.com/photo-1590598615756-7b9d214f541d",
  alt: 'Dark library shelves in dim amber light, rows of books receding into shadow'
},
{
  id: 'personal-expense-tracker',
  title: 'Expense Tracker\nWeb App',
  category: 'Django · MySQL · HTML',
  image: "https://img.rocket.new/generatedImages/rocket_gen_img_121109e2f-1772615906438.png",
  alt: 'Dark analytics dashboard on screen, dim environment, moody low-key lighting'
}];


export default function HeroSection() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('animate');
          }
        });
      },
      { threshold: 0.1 }
    );

    const targets = sectionRef?.current?.querySelectorAll('.animate-on-scroll');
    targets?.forEach((el) => observer?.observe(el));
    return () => observer?.disconnect();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="home"
      className="relative pt-36 pb-20 lg:pt-44 lg:pb-28 overflow-hidden min-h-screen flex flex-col justify-center">
      
      {/* Ambient background blobs */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div
          className="absolute top-[-15%] right-[-8%] w-[500px] h-[500px] rounded-full opacity-10"
          style={{ background: 'radial-gradient(circle, var(--primary) 0%, transparent 70%)', filter: 'blur(80px)' }} />
        
        <div
          className="absolute bottom-[-10%] left-[-5%] w-[400px] h-[400px] rounded-full opacity-6"
          style={{ background: 'radial-gradient(circle, var(--accent) 0%, transparent 70%)', filter: 'blur(100px)' }} />
        
      </div>
      <div className="max-w-7xl mx-auto px-4 md:px-6 relative z-10">
        {/* Identity block */}
        <div className="text-center mb-16 flex flex-col items-center">
          {/* Status badge */}
          <div
            className="animate-on-scroll glass-card inline-flex items-center gap-3 px-4 py-2 rounded-full mb-8 cursor-default"
            style={{ animation: 'animationIn 0.8s ease-out 0.1s forwards', opacity: 0 }}>
            
            <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" style={{ boxShadow: '0 0 8px rgba(74,222,128,0.6)' }} />
            <span className="text-xs tracking-widest uppercase text-muted-foreground font-sans">
              Open to Opportunities · Hyderabad, India
            </span>
          </div>

          {/* Name */}
          <h1
            className="animate-on-scroll font-display text-5xl md:text-7xl lg:text-8xl font-light text-foreground mb-4 leading-none tracking-tight"
            style={{ animation: 'animationIn 0.9s ease-out 0.2s forwards', opacity: 0 }}>
            
            Balusu{' '}
            <span className="text-gradient-amber">Kruthik</span>
          </h1>

          {/* Role */}
          <p
            className="animate-on-scroll text-base md:text-xl text-muted-foreground font-light tracking-wide mb-2"
            style={{ animation: 'animationIn 0.8s ease-out 0.35s forwards', opacity: 0 }}>
            
            Backend Developer · Python · MySQL · Django
          </p>

          <p
            className="animate-on-scroll text-sm text-muted-foreground max-w-xl mx-auto font-light leading-relaxed mb-8 px-4"
            style={{ animation: 'animationIn 0.8s ease-out 0.45s forwards', opacity: 0 }}>
            
            CS undergraduate at Sreyas Institute of Engineering and Technology,
            building backend systems with clean code, solid database design, and real-world projects.
          </p>

          {/* CTAs */}
          <div
            className="animate-on-scroll flex flex-wrap gap-3 justify-center"
            style={{ animation: 'animationIn 0.8s ease-out 0.55s forwards', opacity: 0 }}>
            
            <a
              href="#projects"
              className="group relative overflow-hidden bg-primary text-primary-foreground px-7 py-3 text-sm font-semibold tracking-wide uppercase transition-all duration-300 hover:shadow-lg"
              style={{ borderRadius: '2px', boxShadow: '0 0 0 0 rgba(200,150,90,0)' }}
              onMouseEnter={(e) => e.currentTarget.style.boxShadow = '0 0 24px rgba(200,150,90,0.4)'}
              onMouseLeave={(e) => e.currentTarget.style.boxShadow = '0 0 0 0 rgba(200,150,90,0)'}>
              
              <span className="relative z-10">View Projects</span>
              <div className="absolute inset-0 transform -translate-x-full group-hover:translate-x-full transition-transform duration-700 bg-gradient-to-r from-transparent via-white/10 to-transparent skew-x-12" />
            </a>
            <a
              href="https://github.com/bkruthik"
              target="_blank"
              rel="noopener noreferrer"
              className="glass-card-hover px-7 py-3 text-sm font-medium tracking-wide uppercase text-foreground"
              style={{ borderRadius: '2px' }}>
              
              GitHub
            </a>
            <a
              href="https://www.linkedin.com/in/kruthik-b-498488344/"
              target="_blank"
              rel="noopener noreferrer"
              className="glass-card-hover px-7 py-3 text-sm font-medium tracking-wide uppercase text-foreground"
              style={{ borderRadius: '2px' }}>
              
              LinkedIn
            </a>
          </div>
        </div>

        {/* Bento project cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 w-full">
          {heroProjects?.map((project, index) =>
          <Link
            key={project?.id}
            href={`/project-detail?id=${project?.id}`}
            className={`group relative rounded-2xl overflow-hidden glass-card transition-all duration-700 cursor-pointer ${
            index === 1 ? 'hero-card-center' : ''}`
            }
            style={{
              animation: `animationIn 0.9s ease-out ${0.55 + index * 0.15}s forwards`,
              opacity: 0,
              height: index === 1 ? '360px' : '300px'
            }}>
            
              {/* Background image */}
              <div className="absolute inset-0">
                <AppImage
                src={project?.image}
                alt={project?.alt}
                fill
                sizes="(max-width: 768px) 100vw, 33vw"
                className="object-cover opacity-50 group-hover:opacity-75 group-hover:scale-105 transition-all duration-700" />
              
              </div>

              {/* Gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent" />

              {/* Content */}
              <div className="absolute bottom-0 left-0 right-0 p-5">
                {/* Underline reveal */}
                <div
                className="w-8 h-px mb-3 origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-500"
                style={{ background: 'var(--primary)' }} />
              
                <h3 className="font-display text-lg text-foreground leading-tight mb-1 whitespace-pre-line">
                  {project?.title}
                </h3>
                <p className="text-xs text-muted-foreground tracking-wide uppercase font-light">
                  {project?.category}
                </p>
              </div>

              {/* Corner arrow */}
              <div className="absolute top-4 right-4 w-7 h-7 glass-card rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                  <path d="M2 10L10 2M10 2H4M10 2V8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
            </Link>
          )}
        </div>

        {/* Scroll indicator */}
        <div className="flex justify-center mt-16">
          <div className="flex flex-col items-center gap-2 opacity-40 animate-float">
            <span className="text-xs tracking-widest uppercase text-muted-foreground">Scroll</span>
            <svg width="16" height="24" viewBox="0 0 16 24" fill="none">
              <rect x="1" y="1" width="14" height="22" rx="7" stroke="currentColor" strokeWidth="1" />
              <rect x="7" y="5" width="2" height="6" rx="1" fill="currentColor">
                <animate attributeName="y" values="5;11;5" dur="2s" repeatCount="indefinite" />
                <animate attributeName="opacity" values="1;0;1" dur="2s" repeatCount="indefinite" />
              </rect>
            </svg>
          </div>
        </div>
      </div>
    </section>);

}