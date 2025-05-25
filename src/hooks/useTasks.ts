
import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Task, FlowNode, FlowEdge } from '@/types/task';
import { useAuth } from '@/context/AuthContext';
import { toast } from 'sonner';
import { MarkerType } from '@xyflow/react';

export const useTasks = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const { data: tasks = [], isLoading: loading, refetch: refreshTasks } = useQuery({
    queryKey: ['tasks', user?.id],
    queryFn: async () => {
      if (!user) return [];
      
      console.log('Fetching tasks for user:', user.id);
      
      const { data, error } = await supabase
        .from('tasks')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching tasks:', error);
        throw error;
      }

      console.log('Raw tasks from database:', data);

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
              console.warn('Failed to parse position for task:', task.id, task.position);
            }
          } else if (typeof task.position === 'object' && !Array.isArray(task.position) && 
                     task.position !== null && 'x' in task.position && 'y' in task.position &&
                     typeof task.position.x === 'number' && typeof task.position.y === 'number') {
            position = { x: task.position.x, y: task.position.y };
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

      console.log('Transformed tasks:', transformedTasks);
      return transformedTasks;
    },
    enabled: !!user,
  });

  const addTaskMutation = useMutation({
    mutationFn: async (taskData: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>) => {
      if (!user) throw new Error('User not authenticated');

      console.log('Adding task with data:', taskData);

      const { data, error } = await supabase
        .from('tasks')
        .insert({
          title: taskData.title,
          description: taskData.description || null,
          status: taskData.status,
          priority: taskData.priority,
          due_date: taskData.dueDate || null,
          tags: taskData.tags || [],
          node_type: taskData.nodeType,
          connections: taskData.connections || [],
          position: JSON.stringify(taskData.position),
          user_id: user.id,
        })
        .select()
        .single();

      if (error) {
        console.error('Error adding task:', error);
        throw error;
      }
      
      console.log('Task added successfully:', data);
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
      console.log('Updating task:', id, 'with data:', taskData);
      
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
        console.error('Error updating task:', error);
        throw error;
      }
      
      console.log('Task updated successfully:', data);
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
      console.log('Deleting task:', id);
      
      const { error } = await supabase
        .from('tasks')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('Error deleting task:', error);
        throw error;
      }
      
      console.log('Task deleted successfully:', id);
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

  // Transform tasks into React Flow nodes with clean data
  const getFlowNodes = () => {
    console.log('Getting flow nodes from tasks:', tasks.length);
    
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
      
      console.log('Created clean node:', {
        id: node.id,
        type: node.type,
        position: node.position,
        dataKeys: Object.keys(node.data)
      });
      
      return node;
    });
    
    console.log('Final flow nodes count:', nodes.length);
    return nodes;
  };

  // Create edges based on connections
  const getFlowEdges = () => {
    console.log('Getting flow edges from tasks:', tasks.length);
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
    
    console.log('Final flow edges count:', edges.length);
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
