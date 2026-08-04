'use client';

import React from 'react';

export default function AdminPanelClient() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4 pt-20">
      <div className="w-full max-w-md glass-card rounded-2xl p-8 text-center">
        <h1 className="font-display text-2xl text-foreground mb-4">Admin Panel</h1>
        <p className="text-muted-foreground text-sm leading-relaxed mb-6">
          Project management has moved to the main portfolio page.
          Click the <strong className="text-primary">+ Add Project</strong> button in the Projects section to add new projects.
        </p>
        <a
          href="/#projects"
          className="inline-block bg-primary text-primary-foreground px-6 py-3 text-sm font-semibold tracking-wide uppercase transition-all duration-300"
          style={{ borderRadius: '4px' }}
          onMouseEnter={(e) => (e.currentTarget.style.boxShadow = '0 0 16px rgba(200,150,90,0.4)')}
          onMouseLeave={(e) => (e.currentTarget.style.boxShadow = 'none')}
        >
          Go to Projects
        </a>
      </div>
    </div>
  );
}