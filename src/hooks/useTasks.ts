
import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Task, FlowNode, FlowEdge } from '@/types/task';
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
        nodeType: task.node_type || 'task',
        connections: task.connections || [],
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
          node_type: taskData.nodeType,
          connections: taskData.connections || [],
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
      const updateObj: any = {};
      
      if (taskData.title !== undefined) updateObj.title = taskData.title;
      if (taskData.description !== undefined) updateObj.description = taskData.description;
      if (taskData.status !== undefined) updateObj.status = taskData.status;
      if (taskData.priority !== undefined) updateObj.priority = taskData.priority;
      if (taskData.dueDate !== undefined) updateObj.due_date = taskData.dueDate;
      if (taskData.tags !== undefined) updateObj.tags = taskData.tags;
      if (taskData.nodeType !== undefined) updateObj.node_type = taskData.nodeType;
      if (taskData.connections !== undefined) updateObj.connections = taskData.connections;
      if (taskData.position !== undefined) updateObj.position = JSON.stringify(taskData.position);
      
      const { data, error } = await supabase
        .from('tasks')
        .update(updateObj)
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

  const deleteTaskMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('tasks')
        .delete()
        .eq('id', id);

      if (error) throw error;
      return id;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks', user?.id] });
      toast.success('Task deleted successfully');
    },
    onError: (error) => {
      console.error('Error deleting task:', error);
      toast.error('Failed to delete task');
    },
  });

  const addTask = (taskData: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>) => {
    return addTaskMutation.mutateAsync(taskData);
  };

  const updateTask = (id: string, taskData: Partial<Omit<Task, 'id' | 'createdAt' | 'updatedAt'>>) => {
    return updateTaskMutation.mutateAsync({ id, taskData });
  };

  const deleteTask = (id: string) => {
    return deleteTaskMutation.mutateAsync(id);
  };

  const getTasksByStatus = (status: Task['status']) => {
    return tasks.filter(task => task.status === status);
  };

  // Transform tasks into React Flow nodes
  const getFlowNodes = (): FlowNode[] => {
    return tasks.map(task => ({
      id: task.id,
      type: task.nodeType || 'task',
      position: task.position,
      data: task,
    }));
  };

  // Create edges based on connections
  const getFlowEdges = (): FlowEdge[] => {
    const edges: FlowEdge[] = [];
    
    tasks.forEach(task => {
      if (task.connections && task.connections.length > 0) {
        task.connections.forEach(targetId => {
          // Make sure the target task exists
          const targetTask = tasks.find(t => t.id === targetId);
          if (targetTask) {
            edges.push({
              id: `e-${task.id}-${targetId}`,
              source: task.id,
              target: targetId,
              animated: false,
            });
          }
        });
      }
    });
    
    return edges;
  };

  return {
    tasks,
    addTask,
    updateTask,
    deleteTask,
    getTasksByStatus,
    getFlowNodes,
    getFlowEdges,
    loading,
    refreshTasks,
  };
};
