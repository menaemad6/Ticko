
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useTasks } from '@/hooks/useTasks';
import { 
  TrendingUp, 
  Target, 
  Calendar, 
  Clock, 
  CheckCircle2, 
  AlertTriangle,
  BarChart3,
  PieChart,
  Activity,
  Zap
} from 'lucide-react';

export function AnalyticsView() {
  const { tasks } = useTasks();

  const analytics = {
    completionRate: tasks.length > 0 ? Math.round((tasks.filter(t => t.status === 'done').length / tasks.length) * 100) : 0,
    totalTasks: tasks.length,
    completedTasks: tasks.filter(t => t.status === 'done').length,
    inProgressTasks: tasks.filter(t => t.status === 'in-progress').length,
    todoTasks: tasks.filter(t => t.status === 'todo').length,
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
    highPriorityTasks: tasks.filter(t => t.priority === 'high').length,
    mediumPriorityTasks: tasks.filter(t => t.priority === 'medium').length,
    lowPriorityTasks: tasks.filter(t => t.priority === 'low').length,
    tasksWithDueDate: tasks.filter(t => t.dueDate).length,
    averageTasksPerDay: tasks.length > 0 ? Math.round((tasks.length / 30) * 10) / 10 : 0,
  };

  const StatCard = ({ icon: Icon, title, value, description, color, trend }: any) => (
    <Card className="bg-card border-border hover:shadow-xl transition-all duration-300 group">
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <div className="flex items-center justify-between mb-2">
              <p className="text-muted-foreground text-sm font-medium">{title}</p>
              {trend && (
                <Badge variant="outline" className="text-xs bg-primary/10 text-primary border-primary/20">
                  {trend}
                </Badge>
              )}
            </div>
            <p className="text-3xl font-bold text-foreground group-hover:text-primary transition-colors">
              {value}
            </p>
            <p className="text-muted-foreground text-xs mt-1">{description}</p>
          </div>
          <div className={`p-3 rounded-lg ${color} group-hover:scale-110 transition-transform duration-200`}>
            <Icon className="w-6 h-6 text-primary-foreground" />
          </div>
        </div>
      </CardContent>
    </Card>
  );

  const PriorityCard = ({ priority, count, color, bgColor }: any) => (
    <Card className={`${bgColor} border-border`}>
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-foreground capitalize">{priority} Priority</p>
            <p className="text-2xl font-bold text-foreground">{count}</p>
          </div>
          <div className={`w-3 h-3 rounded-full ${color}`}></div>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-foreground">Analytics Dashboard</h2>
          <p className="text-muted-foreground mt-1">Track your productivity and performance metrics</p>
        </div>
        <div className="flex items-center space-x-2">
          <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20">
            <Activity className="w-3 h-3 mr-1" />
            Live Data
          </Badge>
        </div>
      </div>

      {/* Main Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          icon={Target}
          title="Completion Rate"
          value={`${analytics.completionRate}%`}
          color="bg-primary"
          description="Tasks completed"
          trend={analytics.completionRate > 70 ? "Excellent" : analytics.completionRate > 50 ? "Good" : "Needs Improvement"}
        />
        <StatCard
          icon={BarChart3}
          title="Total Tasks"
          value={analytics.totalTasks}
          color="bg-primary"
          description="All time tasks"
        />
        <StatCard
          icon={Calendar}
          title="This Week"
          value={analytics.completedThisWeek}
          color="bg-primary"
          description="Tasks completed"
        />
        <StatCard
          icon={Clock}
          title="Overdue"
          value={analytics.overdueTasks}
          color="bg-destructive"
          description="Need attention"
        />
      </div>

      {/* Secondary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard
          icon={Zap}
          title="Daily Average"
          value={analytics.averageTasksPerDay}
          color="bg-primary"
          description="Tasks per day"
        />
        <StatCard
          icon={CheckCircle2}
          title="With Due Dates"
          value={analytics.tasksWithDueDate}
          color="bg-primary"
          description="Scheduled tasks"
        />
        <StatCard
          icon={AlertTriangle}
          title="Active Tasks"
          value={analytics.inProgressTasks + analytics.todoTasks}
          color="bg-primary"
          description="In progress + Todo"
        />
      </div>

      {/* Priority Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="text-foreground flex items-center space-x-2">
              <PieChart className="w-5 h-5 text-primary" />
              <span>Priority Distribution</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 gap-3">
              <PriorityCard
                priority="high"
                count={analytics.highPriorityTasks}
                color="bg-destructive"
                bgColor="bg-destructive/10"
              />
              <PriorityCard
                priority="medium"
                count={analytics.mediumPriorityTasks}
                color="bg-primary"
                bgColor="bg-primary/10"
              />
              <PriorityCard
                priority="low"
                count={analytics.lowPriorityTasks}
                color="bg-primary"
                bgColor="bg-primary/20"
              />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="text-foreground flex items-center space-x-2">
              <TrendingUp className="w-5 h-5 text-primary" />
              <span>Progress Overview</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-muted-foreground">Overall Progress</span>
                  <span className="text-foreground font-medium">{analytics.completionRate}%</span>
                </div>
                <div className="w-full bg-secondary rounded-full h-3">
                  <div 
                    className="bg-primary h-3 rounded-full transition-all duration-500 ease-out"
                    style={{ width: `${analytics.completionRate}%` }}
                  />
                </div>
              </div>
              
              {analytics.totalTasks > 0 && (
                <div className="grid grid-cols-3 gap-4 pt-4">
                  <div className="text-center p-3 rounded-lg bg-primary/10">
                    <p className="text-2xl font-bold text-primary">
                      {analytics.completedTasks}
                    </p>
                    <p className="text-muted-foreground text-sm">Completed</p>
                  </div>
                  <div className="text-center p-3 rounded-lg bg-primary/10">
                    <p className="text-2xl font-bold text-primary">
                      {analytics.inProgressTasks}
                    </p>
                    <p className="text-muted-foreground text-sm">In Progress</p>
                  </div>
                  <div className="text-center p-3 rounded-lg bg-destructive/10">
                    <p className="text-2xl font-bold text-destructive">
                      {analytics.todoTasks}
                    </p>
                    <p className="text-muted-foreground text-sm">To Do</p>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Productivity Insights */}
      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="text-foreground flex items-center space-x-2">
            <Activity className="w-5 h-5 text-primary" />
            <span>Productivity Insights</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-4 rounded-lg bg-muted/50 border border-border">
              <h4 className="font-semibold text-foreground mb-2">Task Distribution</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Todo:</span>
                  <span className="text-foreground">{Math.round((analytics.todoTasks / analytics.totalTasks) * 100) || 0}%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">In Progress:</span>
                  <span className="text-foreground">{Math.round((analytics.inProgressTasks / analytics.totalTasks) * 100) || 0}%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Done:</span>
                  <span className="text-foreground">{Math.round((analytics.completedTasks / analytics.totalTasks) * 100) || 0}%</span>
                </div>
              </div>
            </div>
            
            <div className="p-4 rounded-lg bg-muted/50 border border-border">
              <h4 className="font-semibold text-foreground mb-2">Task Health</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">On Time:</span>
                  <span className="text-primary font-medium">
                    {analytics.totalTasks - analytics.overdueTasks}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Overdue:</span>
                  <span className="text-destructive font-medium">
                    {analytics.overdueTasks}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Scheduled:</span>
                  <span className="text-primary font-medium">
                    {analytics.tasksWithDueDate}
                  </span>
                </div>
              </div>
            </div>
            
            <div className="p-4 rounded-lg bg-muted/50 border border-border">
              <h4 className="font-semibold text-foreground mb-2">Weekly Performance</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Completed:</span>
                  <span className="text-foreground font-medium">{analytics.completedThisWeek}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Daily Avg:</span>
                  <span className="text-foreground font-medium">{analytics.averageTasksPerDay}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Velocity:</span>
                  <span className="text-primary font-medium">
                    {analytics.completedThisWeek > 5 ? 'High' : analytics.completedThisWeek > 2 ? 'Medium' : 'Low'}
                  </span>
                </div>
              </div>
            </div>
            
            <div className="p-4 rounded-lg bg-muted/50 border border-border">
              <h4 className="font-semibold text-foreground mb-2">Focus Areas</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">High Priority:</span>
                  <span className="text-destructive font-medium">{analytics.highPriorityTasks}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Medium Priority:</span>
                  <span className="text-primary font-medium">{analytics.mediumPriorityTasks}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Low Priority:</span>
                  <span className="text-primary font-medium">{analytics.lowPriorityTasks}</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
