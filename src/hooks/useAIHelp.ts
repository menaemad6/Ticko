
import { useState, useCallback } from 'react';
import { Task } from '@/types/task';

export function useAIHelp() {
  const [isRequestingHelp, setIsRequestingHelp] = useState(false);

  const generateTaskHelpPrompt = useCallback((task: Task) => {
    const formatDueDate = (dateString?: string) => {
      if (!dateString) return 'No due date set';
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      });
    };

    const priorityText = task.priority === 'high' ? 'High Priority' : 
                        task.priority === 'medium' ? 'Medium Priority' : 'Low Priority';

    const statusText = task.status === 'done' ? 'Completed' :
                      task.status === 'in-progress' ? 'In Progress' : 'To Do';

    const tagsText = task.tags && task.tags.length > 0 ? 
                    `Tags: ${task.tags.join(', ')}` : 'No tags';

    return `I need help with this task:

**Task:** ${task.title}
**Description:** ${task.description || 'No description provided'}
**Status:** ${statusText}
**Priority:** ${priorityText}
**Due Date:** ${formatDueDate(task.dueDate)}
**Type:** ${task.nodeType || 'task'}
${tagsText}

Please provide me with:
1. Suggestions on how to approach this task effectively
2. Break down the task into smaller actionable steps if needed
3. Tips for completing this within the timeline
4. Any potential challenges and how to overcome them
5. Resources or tools that might be helpful

Please be specific and actionable in your advice.`;
  }, []);

  const requestAIHelp = useCallback(async (
    task: Task,
    onOpenChat: () => void,
    onSendMessage: (message: string) => void
  ) => {
    setIsRequestingHelp(true);
    
    try {
      // Open the chat sidebar
      onOpenChat();
      
      // Generate the help prompt
      const helpPrompt = generateTaskHelpPrompt(task);
      
      // Send the message to AI
      onSendMessage(helpPrompt);
      
    } catch (error) {
      console.error('Error requesting AI help:', error);
    } finally {
      setIsRequestingHelp(false);
    }
  }, [generateTaskHelpPrompt]);

  return {
    isRequestingHelp,
    requestAIHelp,
    generateTaskHelpPrompt,
  };
}
