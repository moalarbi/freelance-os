/**
 * Freelance OS - Main Layout Component
 */

import { useState } from 'react';
import { Sidebar } from './Sidebar';
import type { ViewType } from '@/types';

interface LayoutProps {
  children: React.ReactNode;
  currentView: ViewType;
  onViewChange: (view: ViewType) => void;
}

export function Layout({ children, currentView, onViewChange }: LayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div dir="rtl" className="min-h-screen bg-slate-50">
      {/* Sidebar */}
      <Sidebar
        currentView={currentView}
        onViewChange={onViewChange}
        isOpen={sidebarOpen}
        onToggle={() => setSidebarOpen(!sidebarOpen)}
      />

      {/* Main Content */}
      <main className="lg:mr-64 min-h-screen">
        <div className="p-4 lg:p-8">
          {children}
        </div>
      </main>
    </div>
  );
}
