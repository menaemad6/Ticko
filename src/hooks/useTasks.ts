import { useState, useEffect, useCallback, useMemo } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Task, FlowNode, FlowEdge } from '@/types/task';
import { useAuth } from '@/context/AuthContext';
import { toast } from 'sonner';
import { MarkerType } from '@xyflow/react';
import { useCelebration } from './useCelebration';

export const useTasks = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const { celebrate } = useCelebration();

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
        throw error;
      }

      const transformedTasks = (data || []).map(task => {
        let position = { x: 100, y: 100 };
        
        // Handle position parsing safely with proper type checking
        if (task.position) {
          if (typeof task.position === 'string') {
            try {
              const parsed = JSON.parse(task.position);
              if (parsed && typeof parsed === 'object' && !Array.isArray(parsed) && 
                  typeof parsed.x === 'number' && typeof parsed.y === 'number') {
                position = parsed;
              }
            } catch (e) {
            }
          } else if (typeof task.position === 'object' && !Array.isArray(task.position) && 
                     task.position !== null && 'x' in task.position && 'y' in task.position &&
                     typeof (task.position as any).x === 'number' && typeof (task.position as any).y === 'number') {
            position = { x: (task.position as any).x, y: (task.position as any).y };
          }
        }

        // Create clean task object without circular references
        const cleanTask: Task = {
          id: task.id,
          title: task.title || '',
          description: task.description || '',
          status: (task.status || 'todo') as Task['status'],
          priority: (task.priority || 'medium') as Task['priority'],
          dueDate: task.due_date || undefined,
          tags: Array.isArray(task.tags) ? task.tags : [],
          nodeType: (task.node_type || 'task') as Task['nodeType'],
          connections: Array.isArray(task.connections) ? task.connections : [],
          position: position,
          createdAt: task.created_at,
          updatedAt: task.updated_at,
        };

        return cleanTask;
      });

      return transformedTasks;
    },
    enabled: !!user,
  });

  const addTaskMutation = useMutation({
    mutationFn: async (taskData: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>) => {
      if (!user) throw new Error('User not authenticated');

      // Create the insert object with proper typing
      const insertData = {
        title: taskData.title as string,
        description: (taskData.description || null) as string | null,
        status: taskData.status as string,
        priority: taskData.priority as string,
        due_date: (taskData.dueDate || null) as string | null,
        tags: (taskData.tags || []) as string[],
        node_type: taskData.nodeType as string,
        connections: (taskData.connections || []) as string[],
        position: JSON.stringify(taskData.position),
        user_id: user.id,
      };

      const { data, error } = await supabase
        .from('tasks')
        .insert(insertData)
        .select()
        .single();

      if (error) {
        throw error;
      }
      
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks', user?.id] });
      celebrate('task-created');
      toast.success('Task added successfully');
    },
    onError: (error) => {
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
      if (taskData.position !== undefined) {
        updateObj.position = JSON.stringify(taskData.position);
      }
      
      const { data, error } = await supabase
        .from('tasks')
        .update(updateObj)
        .eq('id', id)
        .select()
        .single();

      if (error) {
        throw error;
      }
      
      return data;
    },
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['tasks', user?.id] });
      
      // Check if task was marked as complete
      if (variables.taskData.status === 'done') {
        celebrate('task-complete');
        toast.success('🎉 Task completed! Great job!');
      }
    },
    onError: (error) => {
      toast.error('Failed to update task');
    },
  });

  const deleteTaskMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('tasks')
        .delete()
        .eq('id', id);

      if (error) {
        throw error;
      }
      
      return id;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks', user?.id] });
      celebrate('task-deleted');
      toast.success('Task deleted successfully');
    },
    onError: (error) => {
      toast.error('Failed to delete task');
    },
  });

  const deleteAllTasksMutation = useMutation({
    mutationFn: async () => {
      if (!user) throw new Error('User not authenticated');
      
      const { error } = await supabase
        .from('tasks')
        .delete()
        .eq('user_id', user.id);

      if (error) {
        throw error;
      }
      
      return true;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks', user?.id] });
      toast.success('All tasks deleted successfully');
    },
    onError: (error) => {
      toast.error('Failed to delete all tasks');
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

  const deleteAllTasks = () => {
    return deleteAllTasksMutation.mutateAsync();
  };

  const getTasksByStatus = (status: Task['status']) => {
    return tasks.filter(task => task.status === status);
  };

  // Memoize getFlowNodes to prevent infinite re-renders
  const getFlowNodes = useCallback(() => {
    const nodes = tasks.map(task => {
      // Create a clean node object
      const node: FlowNode = {
        id: task.id,
        type: task.nodeType || 'task',
        position: {
          x: task.position?.x || 100,
          y: task.position?.y || 100
        },
        data: {
          ...task,
          // Ensure position is not circular
          position: {
            x: task.position?.x || 100,
            y: task.position?.y || 100
          }
        }
      };
      
      return node;
    });
    
    return nodes;
  }, [tasks]);

  // Memoize getFlowEdges to prevent infinite re-renders
  const getFlowEdges = useCallback(() => {
    const edges: FlowEdge[] = [];
    
    tasks.forEach(task => {
      if (task.connections && Array.isArray(task.connections) && task.connections.length > 0) {
        task.connections.forEach(targetId => {
          // Make sure the target task exists
          const targetTask = tasks.find(t => t.id === targetId);
          if (targetTask) {
            edges.push({
              id: `e-${task.id}-${targetId}`,
              source: task.id,
              target: targetId,
              animated: false,
              markerEnd: {
                type: MarkerType.ArrowClosed,
              }
            });
          }
        });
      }
    });
    
    return edges;
  }, [tasks]);

  return {
    tasks,
    addTask,
    updateTask,
    deleteTask,
    deleteAllTasks,
    getTasksByStatus,
    getFlowNodes,
    getFlowEdges,
    loading,
    refreshTasks,
  };
};
