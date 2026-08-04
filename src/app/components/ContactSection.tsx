'use client';

import React, { useEffect, useRef, useState } from 'react';

export default function ContactSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) entry.target.classList.add('animate');
        });
      },
      { threshold: 0.1 }
    );
    const targets = sectionRef?.current?.querySelectorAll('.animate-on-scroll');
    targets?.forEach((el) => observer?.observe(el));
    return () => observer?.disconnect();
  }, []);

  const handleEmailClick = () => {
    const email = 'balusukruthik@gmail.com';
    navigator.clipboard.writeText(email);
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
  };

  return (
    <section ref={sectionRef} id="contact" className="py-20 relative overflow-hidden">
      {/* Background glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ background: 'radial-gradient(ellipse at center bottom, rgba(200,150,90,0.06) 0%, transparent 60%)' }}
      />

      <div className="max-w-7xl mx-auto px-4 md:px-6">
        <div className="h-px bg-border mb-14" />

        <div className="max-w-2xl mx-auto text-center">
          {/* Label */}
          <div
            className="animate-on-scroll"
            style={{ animation: 'animationIn 0.8s ease-out 0.1s forwards', opacity: 0 }}
          >
            <span className="text-xs tracking-widest uppercase text-primary mb-4 block">Get In Touch</span>
          </div>

          {/* Heading */}
          <div
            className="animate-on-scroll"
            style={{ animation: 'animationIn 0.9s ease-out 0.2s forwards', opacity: 0 }}
          >
            <h2 className="font-display text-4xl md:text-6xl font-light text-foreground tracking-tight mb-4">
              Let&apos;s connect
            </h2>
          </div>

          {/* Subtext */}
          <div
            className="animate-on-scroll"
            style={{ animation: 'animationIn 0.8s ease-out 0.3s forwards', opacity: 0 }}
          >
            <p className="text-muted-foreground font-light leading-relaxed mb-10 text-base">
              Feel free to reach out to me.
            </p>
          </div>

          {/* Contact links */}
          <div
            className="animate-on-scroll flex flex-col sm:flex-row gap-4 justify-center items-center relative"
            style={{ animation: 'animationIn 0.8s ease-out 0.4s forwards', opacity: 0 }}
          >
            {/* Email Button — copies email directly to clipboard */}
            <button
              onClick={handleEmailClick}
              className="group relative overflow-hidden flex items-center gap-3 bg-primary text-primary-foreground px-7 py-3.5 text-sm font-semibold tracking-wide transition-all duration-300 w-full sm:w-auto justify-center cursor-pointer"
              style={{ borderRadius: '2px' }}
              onMouseEnter={(e) => (e.currentTarget.style.boxShadow = '0 0 24px rgba(200,150,90,0.4)')}
              onMouseLeave={(e) => (e.currentTarget.style.boxShadow = 'none')}
              title="Click to copy email address"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                <polyline points="22,6 12,13 2,6" />
              </svg>
              {copied ? 'Copied to Clipboard!' : 'balusukruthik@gmail.com'}
              <div className="absolute inset-0 transform -translate-x-full group-hover:translate-x-full transition-transform duration-700 bg-gradient-to-r from-transparent via-white/10 to-transparent skew-x-12" />
            </button>

            {/* LinkedIn */}
            <a
              href="https://www.linkedin.com/in/kruthik-b-498488344/"
              target="_blank"
              rel="noopener noreferrer"
              className="group glass-card-hover flex items-center gap-3 px-7 py-3.5 text-sm font-medium tracking-wide text-foreground w-full sm:w-auto justify-center"
              style={{ borderRadius: '2px' }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
                <rect x="2" y="9" width="4" height="12" /><circle cx="4" cy="4" r="2" />
              </svg>
              LinkedIn
            </a>
          </div>
          
          {copied && (
            <p className="text-xs text-green-400 mt-3 animate-pulse">
              ✓ Email address copied to clipboard!
            </p>
          )}
        </div>
      </div>
    </section>
  );
}