
import { useState, useCallback } from 'react';
import { Task } from '@/types/task';
import { toast } from 'sonner';

// Mock data for initial development
const initialTasks: Task[] = [
  {
    id: '1',
    title: 'Design system setup',
    description: 'Create a comprehensive design system with components and tokens',
    status: 'todo',
    priority: 'high',
    dueDate: '2024-01-15',
    tags: ['design', 'ui/ux', 'foundation'],
    position: { x: 0, y: 0 },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: '2',
    title: 'API integration',
    description: 'Integrate with backend APIs for data fetching',
    status: 'in-progress',
    priority: 'medium',
    dueDate: '2024-01-20',
    tags: ['development', 'api', 'backend'],
    position: { x: 0, y: 0 },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: '3',
    title: 'User testing',
    description: 'Conduct usability tests with target users',
    status: 'done',
    priority: 'low',
    dueDate: '2024-01-10',
    tags: ['testing', 'ux', 'research'],
    position: { x: 0, y: 0 },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

export const useTasks = () => {
  const [tasks, setTasks] = useState<Task[]>(initialTasks);

  const addTask = useCallback((taskData: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newTask: Task = {
      ...taskData,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    setTasks(prev => [...prev, newTask]);
    toast.success('Task created successfully!');
    return newTask;
  }, []);

  const updateTask = useCallback((taskId: string, updates: Partial<Task>) => {
    setTasks(prev =>
      prev.map(task =>
        task.id === taskId
          ? { ...task, ...updates, updatedAt: new Date().toISOString() }
          : task
      )
    );
    toast.success('Task updated successfully!');
  }, []);

  const deleteTask = useCallback((taskId: string) => {
    setTasks(prev => prev.filter(task => task.id !== taskId));
    toast.success('Task deleted successfully!');
  }, []);

  const moveTask = useCallback((taskId: string, newStatus: Task['status']) => {
    updateTask(taskId, { status: newStatus });
  }, [updateTask]);

  const getTasksByStatus = useCallback((status: Task['status']) => {
    return tasks.filter(task => task.status === status);
  }, [tasks]);

  return {
    tasks,
    addTask,
    updateTask,
    deleteTask,
    moveTask,
    getTasksByStatus,
  };
};
