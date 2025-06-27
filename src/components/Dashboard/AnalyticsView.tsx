
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useTasks } from '@/hooks/useTasks';
import { TrendingUp, Target, Calendar, Clock } from 'lucide-react';

export function AnalyticsView() {
  const { tasks } = useTasks();

  const analytics = {
    completionRate: tasks.length > 0 ? Math.round((tasks.filter(t => t.status === 'done').length / tasks.length) * 100) : 0,
    totalTasks: tasks.length,
    completedThisWeek: tasks.filter(t => {
      if (t.status !== 'done') return false;
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);
      return new Date(t.updatedAt) > weekAgo;
    }).length,
    overdueTasks: tasks.filter(t => {
      if (!t.dueDate || t.status === 'done') return false;
      return new Date(t.dueDate) < new Date();
    }).length,
  };

  const StatCard = ({ icon: Icon, title, value, description, color }: any) => (
    <Card className="bg-gradient-to-br from-slate-800/50 to-purple-800/20 border-purple-800/30 backdrop-blur-xl">
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-gray-400 text-sm font-medium">{title}</p>
            <p className="text-3xl font-bold text-white mt-2">{value}</p>
            <p className="text-gray-400 text-xs mt-1">{description}</p>
          </div>
          <div className={`p-3 rounded-lg ${color}`}>
            <Icon className="w-6 h-6 text-white" />
          </div>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-white">Analytics</h2>
        <p className="text-purple-200">Track your productivity and progress</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          icon={Target}
          title="Completion Rate"
          value={`${analytics.completionRate}%`}
          color="bg-green-500/20"
          description="Tasks completed"
        />
        <StatCard
          icon={TrendingUp}
          title="Total Tasks"
          value={analytics.totalTasks}
          color="bg-purple-500/20"
          description="All time"
        />
        <StatCard
          icon={Calendar}
          title="This Week"
          value={analytics.completedThisWeek}
          color="bg-blue-500/20"
          description="Tasks completed"
        />
        <StatCard
          icon={Clock}
          title="Overdue"
          value={analytics.overdueTasks}
          color="bg-red-500/20"
          description="Need attention"
        />
      </div>

      {/* Progress Overview */}
      <Card className="bg-gradient-to-br from-slate-800/50 to-purple-800/20 border-purple-800/30 backdrop-blur-xl">
        <CardHeader>
          <CardTitle className="text-white">Progress Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span className="text-gray-300">Overall Progress</span>
                <span className="text-white">{analytics.completionRate}%</span>
              </div>
              <div className="w-full bg-slate-700 rounded-full h-2">
                <div 
                  className="bg-gradient-to-r from-purple-500 to-blue-500 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${analytics.completionRate}%` }}
                />
              </div>
            </div>
            
            {analytics.totalTasks > 0 && (
              <div className="grid grid-cols-3 gap-4 pt-4">
                <div className="text-center">
                  <p className="text-2xl font-bold text-green-400">
                    {tasks.filter(t => t.status === 'done').length}
                  </p>
                  <p className="text-gray-400 text-sm">Completed</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-yellow-400">
                    {tasks.filter(t => t.status === 'in-progress').length}
                  </p>
                  <p className="text-gray-400 text-sm">In Progress</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-red-400">
                    {tasks.filter(t => t.status === 'todo').length}
                  </p>
                  <p className="text-gray-400 text-sm">To Do</p>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
