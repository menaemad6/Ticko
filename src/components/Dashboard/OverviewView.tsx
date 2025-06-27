
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useTasks } from '@/hooks/useTasks';
import { 
  CheckCircle, 
  Clock, 
  AlertCircle, 
  Calendar,
  TrendingUp,
  Plus,
  ArrowRight
} from 'lucide-react';
import { Link } from 'react-router-dom';

export function OverviewView() {
  const { tasks } = useTasks();

  const stats = {
    total: tasks.length,
    completed: tasks.filter(t => t.status === 'done').length,
    inProgress: tasks.filter(t => t.status === 'in-progress').length,
    pending: tasks.filter(t => t.status === 'todo').length,
  };

  const recentTasks = tasks
    .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
    .slice(0, 5);

  const StatCard = ({ icon: Icon, title, value, color, description }: any) => (
    <Card className="bg-gradient-to-br from-slate-800/50 to-purple-800/20 border-purple-800/30 backdrop-blur-xl hover:scale-105 transition-transform duration-200">
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
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-purple-600/20 to-blue-600/20 rounded-lg p-6 border border-purple-500/30">
        <h2 className="text-2xl font-bold text-white mb-2">Welcome back!</h2>
        <p className="text-purple-200">Here's what's happening with your tasks today.</p>
        <div className="flex space-x-4 mt-4">
          <Button asChild className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700">
            <Link to="/canvas">
              <Plus className="w-4 h-4 mr-2" />
              Create Task
            </Link>
          </Button>
          <Button variant="outline" asChild className="border-purple-600/30 text-purple-200 hover:bg-purple-800/30">
            <Link to="/dashboard?view=calendar">
              <Calendar className="w-4 h-4 mr-2" />
              View Calendar
            </Link>
          </Button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          icon={CheckCircle}
          title="Completed"
          value={stats.completed}
          color="bg-green-500/20"
          description="Tasks finished"
        />
        <StatCard
          icon={Clock}
          title="In Progress"
          value={stats.inProgress}
          color="bg-yellow-500/20"
          description="Active tasks"
        />
        <StatCard
          icon={AlertCircle}
          title="Pending"
          value={stats.pending}
          color="bg-red-500/20"
          description="To be started"
        />
        <StatCard
          icon={TrendingUp}
          title="Total"
          value={stats.total}
          color="bg-purple-500/20"
          description="All tasks"
        />
      </div>

      {/* Recent Tasks */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-gradient-to-br from-slate-800/50 to-purple-800/20 border-purple-800/30 backdrop-blur-xl">
          <CardHeader>
            <CardTitle className="text-white flex items-center justify-between">
              <span>Recent Activity</span>
              <Button variant="ghost" size="sm" asChild className="text-purple-300 hover:text-white">
                <Link to="/dashboard?view=tasks">
                  View All <ArrowRight className="w-4 h-4 ml-1" />
                </Link>
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {recentTasks.length === 0 ? (
              <div className="text-center py-8 text-gray-400">
                <CheckCircle className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>No tasks yet. Create your first task!</p>
              </div>
            ) : (
              recentTasks.map((task) => (
                <div key={task.id} className="p-3 rounded-lg bg-slate-800/50 border border-purple-700/30">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium text-white text-sm">{task.title}</h4>
                    <Badge 
                      variant={task.status === 'done' ? 'default' : 'outline'}
                      className={
                        task.status === 'done' 
                          ? 'bg-green-500/20 text-green-200 border-green-500/30'
                          : task.status === 'in-progress'
                          ? 'bg-yellow-500/20 text-yellow-200 border-yellow-500/30'
                          : 'bg-purple-500/20 text-purple-200 border-purple-500/30'
                      }
                    >
                      {task.status}
                    </Badge>
                  </div>
                  {task.description && (
                    <p className="text-gray-400 text-xs line-clamp-1">{task.description}</p>
                  )}
                </div>
              ))
            )}
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-slate-800/50 to-purple-800/20 border-purple-800/30 backdrop-blur-xl">
          <CardHeader>
            <CardTitle className="text-white">Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button asChild className="w-full justify-start bg-gradient-to-r from-purple-600/20 to-blue-600/20 hover:from-purple-600/30 hover:to-blue-600/30 text-white border border-purple-500/30">
              <Link to="/canvas">
                <Plus className="w-4 h-4 mr-2" />
                Create New Task
              </Link>
            </Button>
            <Button variant="outline" asChild className="w-full justify-start border-purple-600/30 text-purple-200 hover:bg-purple-800/30">
              <Link to="/dashboard?view=calendar">
                <Calendar className="w-4 h-4 mr-2" />
                View Calendar
              </Link>
            </Button>
            <Button variant="outline" asChild className="w-full justify-start border-purple-600/30 text-purple-200 hover:bg-purple-800/30">
              <Link to="/dashboard?view=analytics">
                <TrendingUp className="w-4 h-4 mr-2" />
                View Analytics
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
