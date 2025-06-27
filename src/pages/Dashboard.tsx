
import React from 'react';
import { SidebarProvider } from '@/components/ui/sidebar';
import { DashboardSidebar } from '@/components/Dashboard/DashboardSidebar';
import { DashboardContent } from '@/components/Dashboard/DashboardContent';
import { ThemeProvider } from '@/context/ThemeContext';

const Dashboard = () => {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="dashboard-ui-theme">
      <div className="min-h-screen bg-background">
        <SidebarProvider defaultOpen={true}>
          <div className="flex min-h-screen w-full">
            <DashboardSidebar />
            <DashboardContent />
          </div>
        </SidebarProvider>
      </div>
    </ThemeProvider>
  );
};

export default Dashboard;
