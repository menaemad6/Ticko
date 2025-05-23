
import React, { useState } from 'react';
import { Plus, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { KanbanColumn } from '@/components/KanbanColumn';
import { TaskForm } from '@/components/TaskForm';
import { useTasks } from '@/hooks/useTasks';
import { Task, Column } from '@/types/task';
import { toast } from 'sonner';
import { useAuth } from '@/context/AuthContext';

const columns: Column[] = [
  {
    id: 'todo',
    title: 'To Do',
    status: 'todo',
    color: 'bg-gray-100',
  },
  {
    id: 'in-progress',
    title: 'In Progress',
    status: 'in-progress',
    color: 'bg-blue-100',
  },
  {
    id: 'done',
    title: 'Done',
    status: 'done',
    color: 'bg-green-100',
  },
];

const Index = () => {
  const { tasks, addTask, updateTask, moveTask, getTasksByStatus, loading, refreshTasks } = useTasks();
  const { user, signOut } = useAuth();
  const [draggedTask, setDraggedTask] = useState<Task | null>(null);
  const [isTaskFormOpen, setIsTaskFormOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [newTaskStatus, setNewTaskStatus] = useState<Task['status']>('todo');

  const handleDragStart = (e: React.DragEvent, task: Task) => {
    setDraggedTask(task);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragEnd = () => {
    setDraggedTask(null);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (e: React.DragEvent, newStatus: Task['status']) => {
    e.preventDefault();
    
    if (draggedTask && draggedTask.status !== newStatus) {
      moveTask(draggedTask.id, newStatus);
      toast.success(`Task moved to ${newStatus === 'in-progress' ? 'In Progress' : newStatus === 'done' ? 'Done' : 'To Do'}`);
    }
    
    setDraggedTask(null);
  };

  const handleTaskClick = (task: Task) => {
    setEditingTask(task);
    setIsTaskFormOpen(true);
  };

  const handleSaveTask = async (taskData: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>) => {
    if (editingTask) {
      await updateTask(editingTask.id, taskData);
      refreshTasks();
    } else {
      await addTask(taskData);
      refreshTasks();
    }
  };

  const handleCreateTask = (status: Task['status']) => {
    setNewTaskStatus(status);
    setEditingTask(null);
    setIsTaskFormOpen(true);
  };

  const handleCloseForm = () => {
    setIsTaskFormOpen(false);
    setEditingTask(null);
  };

  const handleSignOut = async () => {
    await signOut();
  };

  const totalTasks = tasks.length;
  const completedTasks = getTasksByStatus('done').length;
  const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Visual Task Board
              </h1>
              <p className="text-gray-600 mt-1">
                Welcome, {user?.email} | Drag and drop tasks to organize your workflow
              </p>
            </div>
            
            <div className="flex items-center gap-6">
              <div className="text-right">
                <div className="text-sm text-gray-500">Progress</div>
                <div className="text-lg font-semibold text-gray-900">
                  {completedTasks}/{totalTasks} ({completionRate}%)
                </div>
              </div>
              
              <div className="flex gap-2">
                <Button 
                  onClick={() => handleCreateTask('todo')}
                  className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Task
                </Button>
                
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
      </div>

      {/* Kanban Board */}
      {loading ? (
        <div className="flex items-center justify-center h-64">
          <p className="text-lg text-gray-500">Loading your tasks...</p>
        </div>
      ) : (
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {columns.map((column) => (
              <div key={column.id} className="space-y-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-semibold text-gray-800">
                    {column.title}
                  </h2>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleCreateTask(column.status)}
                    className="text-xs"
                  >
                    <Plus className="w-3 h-3 mr-1" />
                    Add
                  </Button>
                </div>
                
                <KanbanColumn
                  column={column}
                  tasks={getTasksByStatus(column.status)}
                  onDragStart={handleDragStart}
                  onDragEnd={handleDragEnd}
                  onDragOver={handleDragOver}
                  onDrop={handleDrop}
                  draggedTask={draggedTask}
                  onTaskClick={handleTaskClick}
                />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Task Form Dialog */}
      <TaskForm
        isOpen={isTaskFormOpen}
        onClose={handleCloseForm}
        onSave={handleSaveTask}
        task={editingTask}
        initialStatus={newTaskStatus}
      />
    </div>
  );
};

export default Index;
