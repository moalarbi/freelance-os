/**
 * Freelance OS - Main Application
 */

import { useState, useEffect } from 'react';
import { Layout } from '@/components/layout/Layout';
import { Dashboard } from '@/components/modules/Dashboard';
import { Clients } from '@/components/modules/Clients';
import { Projects } from '@/components/modules/Projects';
import { Invoices } from '@/components/modules/Invoices';
import { Payments } from '@/components/modules/Payments';
import { Tasks } from '@/components/modules/Tasks';
import { Expenses } from '@/components/modules/Expenses';
import { QuickAddButton } from '@/components/shared/QuickAddButton';
import { Toaster } from '@/components/ui/sonner';
import { api } from '@/services/api';
import type { ViewType, Client, Project } from '@/types';

function App() {
  const [currentView, setCurrentView] = useState<ViewType>('dashboard');
  const [clients, setClients] = useState<Client[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [refreshKey, setRefreshKey] = useState(0);

  // Load data for Quick Add button
  useEffect(() => {
    loadData();
  }, [refreshKey]);

  const loadData = async () => {
    try {
      const [clientsData, projectsData] = await Promise.all([
        api.clients.getAll(),
        api.projects.getAll(),
      ]);
      setClients(clientsData);
      setProjects(projectsData);
    } catch (error) {
      console.error('Error loading data:', error);
    }
  };

  const handleRefresh = () => {
    setRefreshKey(prev => prev + 1);
  };

  const renderView = () => {
    switch (currentView) {
      case 'dashboard':
        return <Dashboard key={refreshKey} />;
      case 'clients':
        return <Clients />;
      case 'projects':
        return <Projects />;
      case 'invoices':
        return <Invoices />;
      case 'payments':
        return <Payments />;
      case 'tasks':
        return <Tasks />;
      case 'expenses':
        return <Expenses />;
      default:
        return <Dashboard key={refreshKey} />;
    }
  };

  return (
    <>
      <Layout currentView={currentView} onViewChange={setCurrentView}>
        {renderView()}
      </Layout>
      <QuickAddButton 
        clients={clients} 
        projects={projects} 
        onSuccess={handleRefresh}
      />
      <Toaster position="top-left" richColors />
    </>
  );
}

export default App;
