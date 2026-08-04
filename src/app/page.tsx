import React from 'react';
import HeroSection from './components/HeroSection';
import SkillsSection from './components/SkillsSection';
import ProjectsSection from './components/ProjectsSection';
import EducationSection from './components/EducationSection';
import ContactSection from './components/ContactSection';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export default function HomePage() {
  return (
    <main className="relative bg-background text-foreground min-h-screen overflow-x-hidden">
      {/* Noise overlay */}
      <div className="fixed inset-0 noise-overlay pointer-events-none z-0 opacity-60" />
      {/* Subtle grid lines */}
      <div className="grid-overlay-lines pointer-events-none">
        <div className="w-full h-full max-w-7xl flex justify-between px-4">
          {[0, 1, 2, 3]?.map((i) => (
            <div key={i} className="w-px h-full bg-white opacity-[0.015]" />
          ))}
        </div>
      </div>
      <Header />
      <HeroSection />
      <SkillsSection />
      <ProjectsSection />
      <EducationSection />
      <ContactSection />
      <Footer />
    </main>
  );
}