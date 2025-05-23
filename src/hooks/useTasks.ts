
import { useState, useCallback, useEffect } from 'react';
import { Task } from '@/types/task';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/context/AuthContext';

export const useTasks = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  // Fetch tasks from Supabase
  const fetchTasks = useCallback(async () => {
    if (!user) return;
    
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('tasks')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) {
        throw error;
      }
      
      // Convert database format to our app's Task format
      const formattedTasks: Task[] = data.map((task) => ({
        id: task.id,
        title: task.title,
        description: task.description || '',
        status: task.status as Task['status'],
        priority: task.priority as Task['priority'],
        dueDate: task.due_date,
        tags: task.tags || [],
        position: task.position,
        createdAt: task.created_at,
        updatedAt: task.updated_at,
      }));
      
      setTasks(formattedTasks);
    } catch (error: any) {
      toast.error(`Error loading tasks: ${error.message}`);
    } finally {
      setLoading(false);
    }
  }, [user]);

  // Initial fetch when user changes
  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  // Set up realtime subscription
  useEffect(() => {
    if (!user) return;

    const channel = supabase
      .channel('tasks-changes')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'tasks', filter: `user_id=eq.${user.id}` },
        (payload) => {
          fetchTasks(); // Refresh tasks when changes occur
        })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user, fetchTasks]);

  const addTask = useCallback(async (taskData: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>) => {
    if (!user) return null;

    try {
      const { data, error } = await supabase
        .from('tasks')
        .insert([{
          title: taskData.title,
          description: taskData.description,
          status: taskData.status,
          priority: taskData.priority,
          due_date: taskData.dueDate,
          tags: taskData.tags,
          position: taskData.position,
        }])
        .select()
        .single();
      
      if (error) throw error;
      
      toast.success('Task created successfully!');
      
      // Return the newly created task
      const newTask: Task = {
        id: data.id,
        title: data.title,
        description: data.description || '',
        status: data.status,
        priority: data.priority,
        dueDate: data.due_date,
        tags: data.tags || [],
        position: data.position,
        createdAt: data.created_at,
        updatedAt: data.updated_at,
      };
      
      return newTask;
    } catch (error: any) {
      toast.error(`Error creating task: ${error.message}`);
      return null;
    }
  }, [user]);

  const updateTask = useCallback(async (taskId: string, updates: Partial<Task>) => {
    if (!user) return;

    try {
      // Convert from our app's Task format to the database format
      const dbUpdates: any = {};
      
      if (updates.title !== undefined) dbUpdates.title = updates.title;
      if (updates.description !== undefined) dbUpdates.description = updates.description;
      if (updates.status !== undefined) dbUpdates.status = updates.status;
      if (updates.priority !== undefined) dbUpdates.priority = updates.priority;
      if (updates.dueDate !== undefined) dbUpdates.due_date = updates.dueDate;
      if (updates.tags !== undefined) dbUpdates.tags = updates.tags;
      if (updates.position !== undefined) dbUpdates.position = updates.position;
      
      const { error } = await supabase
        .from('tasks')
        .update(dbUpdates)
        .eq('id', taskId);
      
      if (error) throw error;
      
      toast.success('Task updated successfully!');
    } catch (error: any) {
      toast.error(`Error updating task: ${error.message}`);
    }
  }, [user]);

  const deleteTask = useCallback(async (taskId: string) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('tasks')
        .delete()
        .eq('id', taskId);
      
      if (error) throw error;
      
      toast.success('Task deleted successfully!');
    } catch (error: any) {
      toast.error(`Error deleting task: ${error.message}`);
    }
  }, [user]);

  const moveTask = useCallback((taskId: string, newStatus: Task['status']) => {
    updateTask(taskId, { status: newStatus });
  }, [updateTask]);

  const getTasksByStatus = useCallback((status: Task['status']) => {
    return tasks.filter(task => task.status === status);
  }, [tasks]);

  return {
    tasks,
    loading,
    addTask,
    updateTask,
    deleteTask,
    moveTask,
    getTasksByStatus,
    refreshTasks: fetchTasks,
  };
};
