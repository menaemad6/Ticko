
import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  FileText, 
  Zap, 
  CheckSquare, 
  Target,
  Milestone,
  StickyNote,
  Plus
} from 'lucide-react';
import { useTasks } from '@/hooks/useTasks';
import { toast } from 'sonner';

interface TaskTemplatesModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface TaskTemplate {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  color: string;
  tasks: Array<{
    title: string;
    description: string;
    status: 'todo' | 'in-progress' | 'done';
    priority: 'low' | 'medium' | 'high';
    nodeType: 'task' | 'milestone' | 'note';
    tags: string[];
    position: { x: number; y: number };
  }>;
}

export const TaskTemplatesModal: React.FC<TaskTemplatesModalProps> = ({ 
  isOpen, 
  onClose 
}) => {
  const { addTask } = useTasks();
  const [isCreating, setIsCreating] = useState(false);

  const templates: TaskTemplate[] = [
    {
      id: 'sprint-planning',
      name: 'Sprint Planning',
      description: 'Agile sprint workflow with planning, development, and review phases',
      icon: <Target className="w-5 h-5" />,
      color: 'bg-green-100 text-green-800',
      tasks: [
        {
          title: 'Sprint Planning Meeting',
          description: 'Define sprint goals and select user stories',
          status: 'todo',
          priority: 'high',
          nodeType: 'milestone',
          tags: ['planning', 'meeting'],
          position: { x: 100, y: 100 }
        },
        {
          title: 'User Story Analysis',
          description: 'Break down user stories into actionable tasks',
          status: 'todo',
          priority: 'high',
          nodeType: 'task',
          tags: ['analysis', 'user-stories'],
          position: { x: 350, y: 100 }
        },
        {
          title: 'Development Tasks',
          description: 'Core development work for the sprint',
          status: 'todo',
          priority: 'medium',
          nodeType: 'task',
          tags: ['development'],
          position: { x: 100, y: 250 }
        },
        {
          title: 'Testing & QA',
          description: 'Quality assurance and testing tasks',
          status: 'todo',
          priority: 'medium',
          nodeType: 'task',
          tags: ['testing', 'qa'],
          position: { x: 350, y: 250 }
        },
        {
          title: 'Sprint Review',
          description: 'Review completed work and gather feedback',
          status: 'todo',
          priority: 'low',
          nodeType: 'milestone',
          tags: ['review', 'feedback'],
          position: { x: 225, y: 400 }
        }
      ]
    },
    {
      id: 'project-roadmap',
      name: 'Project Roadmap',
      description: 'Complete project lifecycle from initiation to delivery',
      icon: <CheckSquare className="w-5 h-5" />,
      color: 'bg-blue-100 text-blue-800',
      tasks: [
        {
          title: 'Project Initiation',
          description: 'Define project scope, objectives, and stakeholders',
          status: 'todo',
          priority: 'high',
          nodeType: 'milestone',
          tags: ['initiation', 'planning'],
          position: { x: 100, y: 100 }
        },
        {
          title: 'Requirements Gathering',
          description: 'Collect and document project requirements',
          status: 'todo',
          priority: 'high',
          nodeType: 'task',
          tags: ['requirements', 'documentation'],
          position: { x: 350, y: 100 }
        },
        {
          title: 'Architecture Design',
          description: 'Design system architecture and technical specifications',
          status: 'todo',
          priority: 'high',
          nodeType: 'task',
          tags: ['architecture', 'design'],
          position: { x: 600, y: 100 }
        },
        {
          title: 'Development Phase 1',
          description: 'Core functionality development',
          status: 'todo',
          priority: 'medium',
          nodeType: 'task',
          tags: ['development', 'phase-1'],
          position: { x: 100, y: 250 }
        },
        {
          title: 'Development Phase 2',
          description: 'Feature enhancement and integrations',
          status: 'todo',
          priority: 'medium',
          nodeType: 'task',
          tags: ['development', 'phase-2'],
          position: { x: 350, y: 250 }
        },
        {
          title: 'Testing & Integration',
          description: 'Comprehensive testing and system integration',
          status: 'todo',
          priority: 'medium',
          nodeType: 'task',
          tags: ['testing', 'integration'],
          position: { x: 600, y: 250 }
        },
        {
          title: 'User Acceptance Testing',
          description: 'UAT with stakeholders and end users',
          status: 'todo',
          priority: 'medium',
          nodeType: 'task',
          tags: ['uat', 'testing'],
          position: { x: 100, y: 400 }
        },
        {
          title: 'Deployment',
          description: 'Production deployment and go-live',
          status: 'todo',
          priority: 'high',
          nodeType: 'milestone',
          tags: ['deployment', 'go-live'],
          position: { x: 350, y: 400 }
        },
        {
          title: 'Post-Launch Support',
          description: 'Monitor system and provide ongoing support',
          status: 'todo',
          priority: 'low',
          nodeType: 'task',
          tags: ['support', 'maintenance'],
          position: { x: 600, y: 400 }
        },
        {
          title: 'Project Closure',
          description: 'Project completion and lessons learned documentation',
          status: 'todo',
          priority: 'low',
          nodeType: 'milestone',
          tags: ['closure', 'documentation'],
          position: { x: 350, y: 550 }
        }
      ]
    },
    {
      id: 'bug-tracking',
      name: 'Bug Tracking Workflow',
      description: 'Systematic approach to bug identification, fixing, and verification',
      icon: <Zap className="w-5 h-5" />,
      color: 'bg-red-100 text-red-800',
      tasks: [
        {
          title: 'Bug Report',
          description: 'Document the bug with steps to reproduce',
          status: 'todo',
          priority: 'high',
          nodeType: 'note',
          tags: ['bug-report', 'documentation'],
          position: { x: 100, y: 100 }
        },
        {
          title: 'Bug Triage',
          description: 'Assess bug severity and assign priority',
          status: 'todo',
          priority: 'high',
          nodeType: 'task',
          tags: ['triage', 'assessment'],
          position: { x: 350, y: 100 }
        },
        {
          title: 'Root Cause Analysis',
          description: 'Investigate and identify the root cause',
          status: 'todo',
          priority: 'medium',
          nodeType: 'task',
          tags: ['analysis', 'investigation'],
          position: { x: 100, y: 250 }
        },
        {
          title: 'Bug Fix Implementation',
          description: 'Develop and implement the fix',
          status: 'todo',
          priority: 'high',
          nodeType: 'task',
          tags: ['development', 'fix'],
          position: { x: 350, y: 250 }
        },
        {
          title: 'Code Review',
          description: 'Review the fix for quality and side effects',
          status: 'todo',
          priority: 'medium',
          nodeType: 'task',
          tags: ['review', 'quality'],
          position: { x: 100, y: 400 }
        },
        {
          title: 'Testing & Verification',
          description: 'Test the fix and verify bug resolution',
          status: 'todo',
          priority: 'high',
          nodeType: 'task',
          tags: ['testing', 'verification'],
          position: { x: 350, y: 400 }
        },
        {
          title: 'Bug Closure',
          description: 'Close the bug and update documentation',
          status: 'todo',
          priority: 'low',
          nodeType: 'milestone',
          tags: ['closure', 'documentation'],
          position: { x: 225, y: 550 }
        }
      ]
    },
    {
      id: 'feature-development',
      name: 'Feature Development',
      description: 'End-to-end feature development lifecycle',
      icon: <Plus className="w-5 h-5" />,
      color: 'bg-purple-100 text-purple-800',
      tasks: [
        {
          title: 'Feature Specification',
          description: 'Define feature requirements and acceptance criteria',
          status: 'todo',
          priority: 'high',
          nodeType: 'note',
          tags: ['specification', 'requirements'],
          position: { x: 100, y: 100 }
        },
        {
          title: 'UI/UX Design',
          description: 'Create wireframes and user interface designs',
          status: 'todo',
          priority: 'medium',
          nodeType: 'task',
          tags: ['design', 'ui-ux'],
          position: { x: 350, y: 100 }
        },
        {
          title: 'Technical Design',
          description: 'Design technical architecture and data models',
          status: 'todo',
          priority: 'high',
          nodeType: 'task',
          tags: ['architecture', 'design'],
          position: { x: 600, y: 100 }
        },
        {
          title: 'Backend Development',
          description: 'Implement server-side logic and APIs',
          status: 'todo',
          priority: 'medium',
          nodeType: 'task',
          tags: ['backend', 'api'],
          position: { x: 100, y: 250 }
        },
        {
          title: 'Frontend Development',
          description: 'Implement user interface and interactions',
          status: 'todo',
          priority: 'medium',
          nodeType: 'task',
          tags: ['frontend', 'ui'],
          position: { x: 350, y: 250 }
        },
        {
          title: 'Integration Testing',
          description: 'Test frontend and backend integration',
          status: 'todo',
          priority: 'medium',
          nodeType: 'task',
          tags: ['testing', 'integration'],
          position: { x: 600, y: 250 }
        },
        {
          title: 'User Testing',
          description: 'Conduct user testing and gather feedback',
          status: 'todo',
          priority: 'medium',
          nodeType: 'task',
          tags: ['user-testing', 'feedback'],
          position: { x: 100, y: 400 }
        },
        {
          title: 'Performance Optimization',
          description: 'Optimize feature performance and load times',
          status: 'todo',
          priority: 'low',
          nodeType: 'task',
          tags: ['optimization', 'performance'],
          position: { x: 350, y: 400 }
        },
        {
          title: 'Feature Release',
          description: 'Deploy feature to production',
          status: 'todo',
          priority: 'high',
          nodeType: 'milestone',
          tags: ['release', 'deployment'],
          position: { x: 225, y: 550 }
        }
      ]
    }
  ];

  const handleTemplateSelect = async (template: TaskTemplate) => {
    setIsCreating(true);
    try {
      let createdCount = 0;
      for (const taskTemplate of template.tasks) {
        await addTask({
          title: taskTemplate.title,
          description: taskTemplate.description,
          status: taskTemplate.status,
          priority: taskTemplate.priority,
          tags: [...taskTemplate.tags, 'template-created'],
          position: taskTemplate.position,
          nodeType: taskTemplate.nodeType,
          connections: [],
        });
        createdCount++;
      }
      
      toast.success(`Created ${createdCount} tasks from ${template.name} template`);
      onClose();
    } catch (error) {
      toast.error('Failed to create tasks from template');
      console.error('Error creating template tasks:', error);
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileText className="w-5 h-5" />
            Task Templates
          </DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
          {templates.map((template) => (
            <Card key={template.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-gray-100">
                    {template.icon}
                  </div>
                  <div>
                    <div className="font-semibold">{template.name}</div>
                    <Badge variant="secondary" className={template.color}>
                      {template.tasks.length} tasks
                    </Badge>
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600 mb-4">{template.description}</p>
                
                <div className="space-y-2 mb-4">
                  <div className="text-xs font-medium text-gray-500">Includes:</div>
                  <div className="flex flex-wrap gap-1">
                    {template.tasks.slice(0, 3).map((task, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {task.nodeType === 'task' && <CheckSquare className="w-3 h-3 mr-1" />}
                        {task.nodeType === 'milestone' && <Milestone className="w-3 h-3 mr-1" />}
                        {task.nodeType === 'note' && <StickyNote className="w-3 h-3 mr-1" />}
                        {task.title}
                      </Badge>
                    ))}
                    {template.tasks.length > 3 && (
                      <Badge variant="outline" className="text-xs">
                        +{template.tasks.length - 3} more
                      </Badge>
                    )}
                  </div>
                </div>

                <Button 
                  onClick={() => handleTemplateSelect(template)}
                  className="w-full"
                  disabled={isCreating}
                >
                  {isCreating ? 'Creating...' : 'Use Template'}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
};
