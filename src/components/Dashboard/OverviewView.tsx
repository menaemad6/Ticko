
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
  ArrowRight,
  Target,
  Zap,
  Trophy
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

  const completionRate = stats.total > 0 ? Math.round((stats.completed / stats.total) * 100) : 0;

  const recentTasks = tasks
    .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
    .slice(0, 5);

  const urgentTasks = tasks
    .filter(task => task.priority === 'high' && task.status !== 'done')
    .slice(0, 3);

  const StatCard = ({ icon: Icon, title, value, color, description, trend }: any) => (
    <Card className="relative overflow-hidden group hover:shadow-lg transition-all duration-200 border-border/50">
      <div className={`absolute inset-0 bg-gradient-to-r opacity-5 ${color}`}></div>
      <CardContent className="p-6 relative">
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <p className="text-sm font-medium text-muted-foreground uppercase tracking-wide">{title}</p>
            <p className="text-3xl font-bold text-foreground">{value}</p>
            <p className="text-xs text-muted-foreground">{description}</p>
            {trend && (
              <div className="flex items-center space-x-1">
                <TrendingUp className="h-3 w-3 text-green-500" />
                <span className="text-xs text-green-500 font-medium">{trend}</span>
              </div>
            )}
          </div>
          <div className={`p-4 rounded-xl ${color} group-hover:scale-110 transition-transform duration-200`}>
            <Icon className="w-6 h-6 text-white" />
          </div>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 p-8 text-white">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative z-10">
          <div className="flex items-center justify-between">
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <Trophy className="h-8 w-8" />
                <h2 className="text-3xl font-bold">Welcome back!</h2>
              </div>
              <p className="text-blue-100 text-lg max-w-md">
                You're doing great! {completionRate}% of your tasks are completed.
              </p>
              <div className="flex space-x-4">
                <Button asChild size="lg" className="bg-white text-blue-600 hover:bg-blue-50">
                  <Link to="/canvas">
                    <Plus className="w-5 h-5 mr-2" />
                    Create Task
                  </Link>
                </Button>
                <Button variant="outline" asChild size="lg" className="border-white/30 text-white hover:bg-white/10">
                  <Link to="/dashboard?view=calendar">
                    <Calendar className="w-5 h-5 mr-2" />
                    View Calendar
                  </Link>
                </Button>
              </div>
            </div>
            <div className="hidden md:block">
              <div className="text-right space-y-2">
                <div className="text-4xl font-bold">{completionRate}%</div>
                <div className="text-blue-200">Completion Rate</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          icon={Trophy}
          title="Completed"
          value={stats.completed}
          color="bg-gradient-to-r from-green-500 to-emerald-500"
          description="Tasks finished"
          trend="+12% this week"
        />
        <StatCard
          icon={Zap}
          title="In Progress"
          value={stats.inProgress}
          color="bg-gradient-to-r from-blue-500 to-cyan-500"
          description="Active tasks"
          trend="+5% this week"
        />
        <StatCard
          icon={Target}
          title="Pending"
          value={stats.pending}
          color="bg-gradient-to-r from-orange-500 to-red-500"
          description="To be started"
        />
        <StatCard
          icon={TrendingUp}
          title="Total"
          value={stats.total}
          color="bg-gradient-to-r from-purple-500 to-indigo-500"
          description="All tasks"
          trend="+18% this month"
        />
      </div>

      {/* Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Activity */}
        <Card className="lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="flex items-center space-x-2">
              <Clock className="h-5 w-5 text-primary" />
              <span>Recent Activity</span>
            </CardTitle>
            <Button variant="ghost" size="sm" asChild>
              <Link to="/dashboard?view=tasks" className="text-primary hover:text-primary/80">
                View All <ArrowRight className="w-4 h-4 ml-1" />
              </Link>
            </Button>
          </CardHeader>
          <CardContent className="space-y-4">
            {recentTasks.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                <CheckCircle className="w-16 h-16 mx-auto mb-4 opacity-50" />
                <p className="text-lg font-medium mb-2">No tasks yet</p>
                <p className="text-sm">Create your first task to get started!</p>
              </div>
            ) : (
              recentTasks.map((task) => (
                <div key={task.id} className="flex items-center space-x-4 p-4 rounded-xl bg-muted/50 hover:bg-muted/70 transition-colors">
                  <div className={`w-3 h-3 rounded-full ${
                    task.status === 'done' ? 'bg-green-500' :
                    task.status === 'in-progress' ? 'bg-blue-500' : 'bg-orange-500'
                  }`}></div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-semibold text-foreground truncate">{task.title}</h4>
                    {task.description && (
                      <p className="text-sm text-muted-foreground truncate">{task.description}</p>
                    )}
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge variant="outline" className={
                      task.priority === 'high' ? 'border-red-200 text-red-700 bg-red-50 dark:border-red-800 dark:text-red-400 dark:bg-red-900/20' :
                      task.priority === 'medium' ? 'border-orange-200 text-orange-700 bg-orange-50 dark:border-orange-800 dark:text-orange-400 dark:bg-orange-900/20' :
                      'border-green-200 text-green-700 bg-green-50 dark:border-green-800 dark:text-green-400 dark:bg-green-900/20'
                    }>
                      {task.priority}
                    </Badge>
                    <Badge variant={task.status === 'done' ? 'default' : 'secondary'}>
                      {task.status}
                    </Badge>
                  </div>
                </div>
              ))
            )}
          </CardContent>
        </Card>

        {/* Urgent Tasks & Quick Actions */}
        <div className="space-y-6">
          {/* Urgent Tasks */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2 text-red-600 dark:text-red-400">
                <AlertCircle className="h-5 w-5" />
                <span>Urgent Tasks</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {urgentTasks.length === 0 ? (
                <div className="text-center py-6 text-muted-foreground">
                  <CheckCircle className="w-12 h-12 mx-auto mb-3 opacity-50" />
                  <p className="text-sm">No urgent tasks</p>
                </div>
              ) : (
                urgentTasks.map((task) => (
                  <div key={task.id} className="p-3 rounded-lg border-l-4 border-l-red-500 bg-red-50/50 dark:bg-red-900/10">
                    <h4 className="font-medium text-foreground text-sm">{task.title}</h4>
                    {task.dueDate && (
                      <p className="text-xs text-red-600 dark:text-red-400 mt-1">
                        Due: {new Date(task.dueDate).toLocaleDateString()}
                      </p>
                    )}
                  </div>
                ))
              )}
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button asChild className="w-full justify-start" size="lg">
                <Link to="/canvas">
                  <Plus className="w-5 h-5 mr-3" />
                  Create New Task
                </Link>
              </Button>
              <Button variant="outline" asChild className="w-full justify-start" size="lg">
                <Link to="/dashboard?view=calendar">
                  <Calendar className="w-5 h-5 mr-3" />
                  View Calendar
                </Link>
              </Button>
              <Button variant="outline" asChild className="w-full justify-start" size="lg">
                <Link to="/dashboard?view=analytics">
                  <TrendingUp className="w-5 h-5 mr-3" />
                  View Analytics
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
