
import React from 'react';
import { LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import TaskCanvas from '@/components/TaskCanvas';
import { useTasks } from '@/hooks/useTasks';
import { useAuth } from '@/context/AuthContext';

const Index = () => {
  const { tasks, loading } = useTasks();
  const { user, signOut } = useAuth();

  const totalTasks = tasks.length;
  const completedTasks = tasks.filter(task => task.status === 'done').length;
  const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  const handleSignOut = async () => {
    await signOut();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-950 dark:via-gray-900 dark:to-purple-950">
      {/* Header */}
      <div className="bg-white shadow-sm border-b dark:bg-gray-900 dark:border-gray-800">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
                Visual Task Canvas
              </h1>
              <p className="text-gray-600 dark:text-gray-400 mt-1">
                Welcome, {user?.email} | Create and connect tasks in your workflow
              </p>
            </div>
            
            <div className="flex items-center gap-6">
              <div className="text-right">
                <div className="text-sm text-gray-500 dark:text-gray-400">Progress</div>
                <div className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                  {completedTasks}/{totalTasks} ({completionRate}%)
                </div>
              </div>
              
              <Button 
                variant="outline" 
                onClick={handleSignOut}
              >
                <LogOut className="w-4 h-4 mr-2" />
                Sign Out
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Task Canvas */}
      <div className="h-[calc(100vh-137px)]">
        {loading ? (
          <div className="flex items-center justify-center h-full">
            <p className="text-lg text-gray-500 dark:text-gray-400">Loading your tasks...</p>
          </div>
        ) : (
          <TaskCanvas />
        )}
      </div>
    </div>
  );
};

export default Index;
