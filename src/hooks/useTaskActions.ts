import { useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useTasks } from './useTasks';
import { toast } from 'sonner';
import { sendTaskActionsToGemini } from '@/lib/utils';

interface TaskAction {
  action: 'create_task' | 'edit_task' | 'delete_task' | 'mark_complete' | 'mark_incomplete' | 'set_priority' | 'set_due_date' | 'list_tasks';
  id?: string;
  title?: string;
  description?: string;
  due_date?: string;
  priority?: 'low' | 'medium' | 'high';
  status?: 'todo' | 'in-progress' | 'done';
  tags?: string[];
}

export function useTaskActions() {
  const { tasks, addTask, updateTask, deleteTask } = useTasks();

  const processTaskActions = useCallback(async (message: string) => {
    try {
      console.log('Processing task action for message:', message);
      
      // Call the local Gemini function with current tasks as context
      const response = await sendTaskActionsToGemini({
        message,
        existingTasks: tasks.map(task => ({
          id: task.id,
          title: task.title,
          status: task.status,
          priority: task.priority
        }))
      });

      console.log('AI response:', response);

      // Handle error messages
      if ('message' in response) {
        return { success: false, message: response.message };
      }

      // Process actions
      const actions = Array.isArray(response) ? response : [response];
      let processedCount = 0;
      let results = [];

      for (const action of actions) {
        const result = await executeAction(action);
        results.push(result);
        if (result.success) processedCount++;
      }

      const successMessage = processedCount > 0 
        ? `Successfully processed ${processedCount} action(s)`
        : 'No actions could be processed';

      return { 
        success: processedCount > 0, 
        message: successMessage,
        results 
      };

    } catch (error) {
      console.error('Error processing task actions:', error);
      return { 
        success: false, 
        message: 'Failed to process task actions. Please try again.' 
      };
    }
  }, [tasks]);

  const executeAction = useCallback(async (action: TaskAction) => {
    try {
      console.log('Executing action:', action);

      switch (action.action) {
        case 'create_task':
          if (!action.title) {
            return { success: false, message: 'Task title is required for creation' };
          }
          
          await addTask({
            title: action.title,
            description: action.description || '',
            status: action.status || 'todo',
            priority: action.priority || 'medium',
            dueDate: action.due_date,
            tags: action.tags || [],
            position: { x: Math.random() * 400 + 100, y: Math.random() * 400 + 100 },
            nodeType: 'task',
            connections: [],
          });
          
          return { success: true, message: `Created task: ${action.title}` };

        case 'edit_task':
          if (!action.id) {
            return { success: false, message: 'Task ID is required for editing' };
          }
          
          const taskToEdit = tasks.find(t => t.id === action.id);
          if (!taskToEdit) {
            return { success: false, message: `Task with ID ${action.id} not found` };
          }
          
          const updateData: any = {};
          if (action.title) updateData.title = action.title;
          if (action.description !== undefined) updateData.description = action.description;
          if (action.status) updateData.status = action.status;
          if (action.priority) updateData.priority = action.priority;
          if (action.due_date) updateData.dueDate = action.due_date;
          
          await updateTask(action.id, updateData);
          return { success: true, message: `Updated task: ${taskToEdit.title}` };

        case 'delete_task':
          if (!action.id) {
            return { success: false, message: 'Task ID is required for deletion' };
          }
          
          const taskToDelete = tasks.find(t => t.id === action.id);
          if (!taskToDelete) {
            return { success: false, message: `Task with ID ${action.id} not found` };
          }
          
          await deleteTask(action.id);
          return { success: true, message: `Deleted task: ${taskToDelete.title}` };

        case 'mark_complete':
          if (!action.id) {
            return { success: false, message: 'Task ID is required to mark complete' };
          }
          
          const taskToComplete = tasks.find(t => t.id === action.id);
          if (!taskToComplete) {
            return { success: false, message: `Task with ID ${action.id} not found` };
          }
          
          await updateTask(action.id, { status: 'done' });
          return { success: true, message: `Marked task as complete: ${taskToComplete.title}` };

        case 'mark_incomplete':
          if (!action.id) {
            return { success: false, message: 'Task ID is required to mark incomplete' };
          }
          
          const taskToIncomplete = tasks.find(t => t.id === action.id);
          if (!taskToIncomplete) {
            return { success: false, message: `Task with ID ${action.id} not found` };
          }
          
          await updateTask(action.id, { status: action.status || 'todo' });
          return { success: true, message: `Marked task as ${action.status || 'todo'}: ${taskToIncomplete.title}` };

        case 'set_priority':
          if (!action.id || !action.priority) {
            return { success: false, message: 'Task ID and priority are required' };
          }
          
          const taskToSetPriority = tasks.find(t => t.id === action.id);
          if (!taskToSetPriority) {
            return { success: false, message: `Task with ID ${action.id} not found` };
          }
          
          await updateTask(action.id, { priority: action.priority });
          return { success: true, message: `Set priority to ${action.priority}: ${taskToSetPriority.title}` };

        case 'set_due_date':
          if (!action.id || !action.due_date) {
            return { success: false, message: 'Task ID and due date are required' };
          }
          
          const taskToSetDate = tasks.find(t => t.id === action.id);
          if (!taskToSetDate) {
            return { success: false, message: `Task with ID ${action.id} not found` };
          }
          
          await updateTask(action.id, { dueDate: action.due_date });
          return { success: true, message: `Set due date to ${action.due_date}: ${taskToSetDate.title}` };

        case 'list_tasks':
          const taskList = tasks.map(t => `${t.title} (${t.status}, ${t.priority})`).join(', ');
          return { success: true, message: `Current tasks: ${taskList || 'No tasks found'}` };

        default:
          return { success: false, message: `Unknown action: ${action.action}` };
      }
    } catch (error) {
      console.error('Error executing action:', error);
      return { success: false, message: `Failed to execute action: ${action.action}` };
    }
  }, [tasks, addTask, updateTask, deleteTask]);

  return { processTaskActions };
}
