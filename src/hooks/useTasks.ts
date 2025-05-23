
import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Task } from '@/types/task';
import { useAuth } from '@/context/AuthContext';
import { toast } from 'sonner';

export const useTasks = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const { data: tasks = [], isLoading: loading, refetch: refreshTasks } = useQuery({
    queryKey: ['tasks', user?.id],
    queryFn: async () => {
      if (!user) return [];
      
      const { data, error } = await supabase
        .from('tasks')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching tasks:', error);
        throw error;
      }

      return (data || []).map(task => ({
        id: task.id,
        title: task.title,
        description: task.description || '',
        status: task.status as Task['status'],
        priority: task.priority as Task['priority'],
        dueDate: task.due_date || undefined,
        tags: task.tags || [],
        position: typeof task.position === 'string' 
          ? JSON.parse(task.position) 
          : (task.position as { x: number; y: number }) || { x: 0, y: 0 },
        createdAt: task.created_at,
        updatedAt: task.updated_at,
      })) as Task[];
    },
    enabled: !!user,
  });

  const addTaskMutation = useMutation({
    mutationFn: async (taskData: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>) => {
      if (!user) throw new Error('User not authenticated');

      const { data, error } = await supabase
        .from('tasks')
        .insert({
          title: taskData.title,
          description: taskData.description || null,
          status: taskData.status,
          priority: taskData.priority,
          due_date: taskData.dueDate || null,
          tags: taskData.tags,
          position: JSON.stringify(taskData.position),
          user_id: user.id,
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks', user?.id] });
      toast.success('Task added successfully');
    },
    onError: (error) => {
      console.error('Error adding task:', error);
      toast.error('Failed to add task');
    },
  });

  const updateTaskMutation = useMutation({
    mutationFn: async ({ id, taskData }: { id: string; taskData: Partial<Omit<Task, 'id' | 'createdAt' | 'updatedAt'>> }) => {
      const { data, error } = await supabase
        .from('tasks')
        .update({
          ...(taskData.title && { title: taskData.title }),
          ...(taskData.description !== undefined && { description: taskData.description }),
          ...(taskData.status && { status: taskData.status }),
          ...(taskData.priority && { priority: taskData.priority }),
          ...(taskData.dueDate !== undefined && { due_date: taskData.dueDate }),
          ...(taskData.tags && { tags: taskData.tags }),
          ...(taskData.position && { position: JSON.stringify(taskData.position) }),
        })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks', user?.id] });
      toast.success('Task updated successfully');
    },
    onError: (error) => {
      console.error('Error updating task:', error);
      toast.error('Failed to update task');
    },
  });

  const moveTaskMutation = useMutation({
    mutationFn: async ({ id, newStatus }: { id: string; newStatus: Task['status'] }) => {
      const { data, error } = await supabase
        .from('tasks')
        .update({ status: newStatus })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks', user?.id] });
    },
    onError: (error) => {
      console.error('Error moving task:', error);
      toast.error('Failed to move task');
    },
  });

  const addTask = (taskData: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>) => {
    return addTaskMutation.mutateAsync(taskData);
  };

  const updateTask = (id: string, taskData: Partial<Omit<Task, 'id' | 'createdAt' | 'updatedAt'>>) => {
    return updateTaskMutation.mutateAsync({ id, taskData });
  };

  const moveTask = (id: string, newStatus: Task['status']) => {
    return moveTaskMutation.mutateAsync({ id, newStatus });
  };

  const getTasksByStatus = (status: Task['status']) => {
    return tasks.filter(task => task.status === status);
  };

  return {
    tasks,
    addTask,
    updateTask,
    moveTask,
    getTasksByStatus,
    loading,
    refreshTasks,
  };
};
