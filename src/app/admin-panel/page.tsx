import React from 'react';
import AdminPanelClient from './components/AdminPanelClient';
import Header from '@/components/Header';

export default function AdminPanelPage() {
  return (
    <main className="relative bg-background text-foreground min-h-screen overflow-x-hidden">
      <div className="fixed inset-0 noise-overlay pointer-events-none z-0 opacity-60" />
      <Header />
      <AdminPanelClient />
    </main>
  );
}