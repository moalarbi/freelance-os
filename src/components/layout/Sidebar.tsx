/**
 * Freelance OS - Sidebar Component
 */

import { 
  LayoutDashboard, 
  Users, 
  FolderKanban, 
  FileText, 
  CreditCard, 
  CheckSquare,
  TrendingDown,
  Menu,
  X
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import type { ViewType } from '@/types';

interface SidebarProps {
  currentView: ViewType;
  onViewChange: (view: ViewType) => void;
  isOpen: boolean;
  onToggle: () => void;
}

interface NavItem {
  id: ViewType;
  label: string;
  icon: React.ElementType;
}

const navItems: NavItem[] = [
  { id: 'dashboard', label: 'الرئيسية', icon: LayoutDashboard },
  { id: 'clients', label: 'العملاء', icon: Users },
  { id: 'projects', label: 'المشاريع', icon: FolderKanban },
  { id: 'invoices', label: 'الفواتير', icon: FileText },
  { id: 'payments', label: 'المدفوعات', icon: CreditCard },
  { id: 'tasks', label: 'المهام', icon: CheckSquare },
  { id: 'expenses', label: 'المصروفات', icon: TrendingDown },
];

export function Sidebar({ currentView, onViewChange, isOpen, onToggle }: SidebarProps) {
  return (
    <>
      {/* Mobile Toggle Button */}
      <Button
        variant="ghost"
        size="icon"
        className="fixed top-4 right-4 z-50 lg:hidden"
        onClick={onToggle}
      >
        {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
      </Button>

      {/* Sidebar */}
      <aside
        className={cn(
          'fixed inset-y-0 right-0 z-40 w-64 bg-slate-900 text-white transition-transform duration-300 lg:translate-x-0',
          isOpen ? 'translate-x-0' : 'translate-x-full'
        )}
      >
        {/* Logo */}
        <div className="flex h-16 items-center justify-center border-b border-slate-800">
          <div className="flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-600">
              <LayoutDashboard className="h-5 w-5 text-white" />
            </div>
            <div className="text-right">
              <h1 className="text-lg font-bold">Freelance OS</h1>
              <p className="text-xs text-slate-400">نظام إدارة العمل الحر</p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="p-4">
          <ul className="space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentView === item.id;
              
              return (
                <li key={item.id}>
                  <button
                    onClick={() => {
                      onViewChange(item.id);
                      if (window.innerWidth < 1024) {
                        onToggle();
                      }
                    }}
                    className={cn(
                      'flex w-full items-center gap-3 rounded-lg px-4 py-3 text-right transition-colors',
                      isActive
                        ? 'bg-blue-600 text-white'
                        : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                    )}
                  >
                    <Icon className="h-5 w-5" />
                    <span className="flex-1">{item.label}</span>
                  </button>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Footer */}
        <div className="absolute bottom-0 left-0 right-0 border-t border-slate-800 p-4">
          <p className="text-center text-xs text-slate-500">
            Freelance OS v1.1
          </p>
        </div>
      </aside>

      {/* Overlay for mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/50 lg:hidden"
          onClick={onToggle}
        />
      )}
    </>
  );
}
