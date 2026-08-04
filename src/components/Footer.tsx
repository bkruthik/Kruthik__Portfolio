'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import AppLogo from '@/components/ui/AppLogo';
import { useAdmin } from '@/context/AdminContext';

export default function Footer() {
  const { openPasswordModal } = useAdmin();
  const [year, setYear] = useState('2026');

  useEffect(() => {
    setYear(new Date()?.getFullYear()?.toString());
  }, []);

  return (
    <footer className="relative border-t border-border py-10">
      <div className="max-w-7xl mx-auto px-4 md:px-6">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
          {/* Logo + name */}
          <Link href="/" className="flex items-center gap-2.5 group">
            <AppLogo size={28} />
            <span className="font-display text-base tracking-tight text-muted-foreground group-hover:text-foreground transition-colors duration-300">
              Kruthik Portfolio
            </span>
          </Link>

          {/* Links */}
          <div className="flex items-center gap-6 text-sm text-muted-foreground">
            <a href="#projects" className="hover:text-foreground transition-colors duration-200 font-medium">
              Projects
            </a>
            <a href="#contact" className="hover:text-foreground transition-colors duration-200 font-medium">
              Contact
            </a>
          </div>

          {/* Copyright — double click to trigger password prompt */}
          <p
            onDoubleClick={openPasswordModal}
            className="text-xs text-muted-foreground tracking-wide cursor-default select-none hover:text-muted transition-colors"
            title="Double-click to unlock admin session"
          >
            © {year} Balusu Kruthik
          </p>
        </div>
      </div>
    </footer>
  );
}