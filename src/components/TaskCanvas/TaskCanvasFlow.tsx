import React, { useState, useCallback, useRef, useEffect } from 'react';
import {
  ReactFlow,
  MiniMap,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  addEdge,
  MarkerType,
  Connection,
  Node,
  Edge,
  XYPosition,
  useReactFlow,
  BackgroundVariant,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';

import { Task, FlowNode, FlowEdge } from '@/types/task';
import { useTasks } from '@/hooks/useTasks';
import { TaskForm } from '@/components/TaskForm';
import NodeDetail from './NodeDetail';
import TaskNode from './TaskNode';
import MilestoneNode from './MilestoneNode';
import NoteNode from './NoteNode';
import CustomEdge from './CustomEdge';
import CustomControls from './CustomControls';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';

const nodeTypes = {
  task: TaskNode,
  milestone: MilestoneNode,
  note: NoteNode,
};

const edgeTypes = {
  default: CustomEdge,
};

interface TaskCanvasFlowProps {
  registerQuickActionHandler: (handler: (action: string) => void) => void;
  registerTemplateHandler: (handler: (templateName: string) => void) => void;
}

export default function TaskCanvasFlow({ 
  registerQuickActionHandler, 
  registerTemplateHandler 
}: TaskCanvasFlowProps) {
  const { tasks, getFlowNodes, getFlowEdges, updateTask, addTask, loading, refreshTasks } = useTasks();
  const [nodes, setNodes, onNodesChange] = useNodesState<Node>([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState<Edge>([]);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [isTaskFormOpen, setIsTaskFormOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [newTaskPosition, setNewTaskPosition] = useState<XYPosition | null>(null);
  const [newNodeType, setNewNodeType] = useState<'task' | 'milestone' | 'note'>('task');
  const reactFlowWrapper = useRef<HTMLDivElement>(null);
  const { screenToFlowPosition, getViewport, fitView } = useReactFlow();

  // Update nodes and edges when tasks change
  useEffect(() => {
    console.log('TaskCanvasFlow: Tasks updated, count:', tasks.length);
    console.log('TaskCanvasFlow: Loading state:', loading);
    
    if (!loading && tasks.length >= 0) {
      try {
        const flowNodes = getFlowNodes();
        const flowEdges = getFlowEdges();
        
        console.log('TaskCanvasFlow: Setting nodes count:', flowNodes.length);
        console.log('TaskCanvasFlow: Setting edges count:', flowEdges.length);
        
        // Ensure nodes have proper structure
        const validNodes = flowNodes.map(node => ({
          id: node.id,
          type: node.type,
          position: node.position,
          data: node.data,
        })) as Node[];
        
        const validEdges = flowEdges.map(edge => ({
          id: edge.id,
          source: edge.source,
          target: edge.target,
          animated: edge.animated || false,
          markerEnd: edge.markerEnd,
        })) as Edge[];
        
        setNodes(validNodes);
        setEdges(validEdges);
        
        console.log('TaskCanvasFlow: Nodes and edges set successfully');
      } catch (error) {
        console.error('Error setting nodes/edges:', error);
      }
    }
  }, [tasks, loading, setNodes, setEdges]); // Removed getFlowNodes, getFlowEdges from dependencies

  const handleAddNode = useCallback(() => {
    console.log('Adding new node');
    const viewport = getViewport();
    const position = reactFlowWrapper.current
      ? screenToFlowPosition({
          x: reactFlowWrapper.current.clientWidth / 2,
          y: reactFlowWrapper.current.clientHeight / 2,
        })
      : { x: 100, y: 100 };

    console.log('New node position:', position);
    setNewTaskPosition(position);
    setNewNodeType('task');
    setEditingTask(null);
    setIsTaskFormOpen(true);
  }, [screenToFlowPosition, getViewport]);

  const handleEditTask = useCallback((task: Task) => {
    setEditingTask(task);
    setIsTaskFormOpen(true);
  }, []);

  const handleQuickAction = useCallback(async (action: string) => {
    console.log('Quick action triggered:', action);
    switch (action) {
      case 'addTask':
        handleAddNode();
        break;
      case 'scheduleView':
        // Filter tasks by due date and arrange them chronologically
        const tasksWithDates = tasks.filter(task => task.dueDate);
        tasksWithDates.sort((a, b) => new Date(a.dueDate!).getTime() - new Date(b.dueDate!).getTime());
        
        // Update positions for scheduled view
        for (let i = 0; i < tasksWithDates.length; i++) {
          const task = tasksWithDates[i];
          const newPosition = { 
            x: 100 + (i % 4) * 300, 
            y: 100 + Math.floor(i / 4) * 200 
          };
          await updateTask(task.id, { position: newPosition });
        }
        
        setTimeout(() => {
          refreshTasks();
          fitView();
        }, 500);
        break;
      case 'manageTags':
        // Group tasks by their first tag
        const tasksByTag = tasks.reduce((acc, task) => {
          const tag = task.tags && task.tags.length > 0 ? task.tags[0] : 'untagged';
          if (!acc[tag]) acc[tag] = [];
          acc[tag].push(task);
          return acc;
        }, {} as Record<string, Task[]>);

        let yOffset = 100;
        for (const [tag, tagTasks] of Object.entries(tasksByTag)) {
          for (let i = 0; i < tagTasks.length; i++) {
            const task = tagTasks[i];
            const newPosition = { x: 100 + i * 250, y: yOffset };
            await updateTask(task.id, { position: newPosition });
          }
          yOffset += 200;
        }
        
        setTimeout(() => {
          refreshTasks();
          fitView();
        }, 500);
        break;
      case 'assignUsers':
        // Group tasks by status
        const statusColumns = {
          'todo': { x: 100, tasks: tasks.filter(t => t.status === 'todo') },
          'in-progress': { x: 450, tasks: tasks.filter(t => t.status === 'in-progress') },
          'done': { x: 800, tasks: tasks.filter(t => t.status === 'done') }
        };

        for (const [status, { x, tasks: statusTasks }] of Object.entries(statusColumns)) {
          for (let i = 0; i < statusTasks.length; i++) {
            const task = statusTasks[i];
            const newPosition = { x, y: 100 + i * 150 };
            await updateTask(task.id, { position: newPosition });
          }
        }
        
        setTimeout(() => {
          refreshTasks();
          fitView();
        }, 500);
        break;
      case 'gridLayout':
        console.log('Applying grid layout to', tasks.length, 'tasks');
        
        for (let i = 0; i < tasks.length; i++) {
          const task = tasks[i];
          const col = i % 4;
          const row = Math.floor(i / 4);
          const newPosition = { x: col * 250 + 100, y: row * 200 + 100 };
          console.log(`Moving task ${task.id} to position:`, newPosition);
          await updateTask(task.id, { position: newPosition });
        }
        
        setTimeout(() => {
          refreshTasks();
          fitView();
        }, 500);
        break;
      default:
        console.log('Unknown action:', action);
    }
  }, [handleAddNode, tasks, updateTask, refreshTasks, fitView]);

  const handleTemplateSelect = useCallback(async (templateName: string) => {
    console.log('Template selected:', templateName);
    
    const templates = {
      'Sprint Planning': [
        { title: 'Sprint Goal', type: 'milestone' as const, x: 100, y: 50 },
        { title: 'Backlog Review', type: 'task' as const, x: 50, y: 150 },
        { title: 'Sprint Planning Meeting', type: 'task' as const, x: 250, y: 150 },
        { title: 'Daily Standups', type: 'task' as const, x: 150, y: 250 },
        { title: 'Sprint Demo', type: 'milestone' as const, x: 100, y: 350 },
      ],
      'Project Roadmap': [
        { title: 'Project Kickoff', type: 'milestone' as const, x: 100, y: 50 },
        { title: 'Research Phase', type: 'task' as const, x: 50, y: 150 },
        { title: 'Design Phase', type: 'task' as const, x: 250, y: 150 },
        { title: 'Development Phase', type: 'task' as const, x: 450, y: 150 },
        { title: 'Testing Phase', type: 'task' as const, x: 650, y: 150 },
        { title: 'MVP Release', type: 'milestone' as const, x: 350, y: 250 },
        { title: 'User Feedback', type: 'note' as const, x: 200, y: 350 },
        { title: 'Iteration Planning', type: 'task' as const, x: 500, y: 350 },
        { title: 'Feature Enhancement', type: 'task' as const, x: 350, y: 450 },
        { title: 'Final Release', type: 'milestone' as const, x: 350, y: 550 },
      ],
      'Bug Tracking': [
        { title: 'Bug Report', type: 'note' as const, x: 100, y: 50 },
        { title: 'Investigation', type: 'task' as const, x: 100, y: 150 },
        { title: 'Root Cause Analysis', type: 'task' as const, x: 300, y: 150 },
        { title: 'Fix Implementation', type: 'task' as const, x: 100, y: 250 },
        { title: 'Testing', type: 'task' as const, x: 300, y: 250 },
        { title: 'Code Review', type: 'task' as const, x: 200, y: 350 },
        { title: 'Bug Resolved', type: 'milestone' as const, x: 200, y: 450 },
      ],
      'Feature Development': [
        { title: 'Feature Request', type: 'note' as const, x: 100, y: 50 },
        { title: 'Requirements Analysis', type: 'task' as const, x: 100, y: 150 },
        { title: 'Technical Design', type: 'task' as const, x: 300, y: 150 },
        { title: 'UI/UX Design', type: 'task' as const, x: 500, y: 150 },
        { title: 'Frontend Development', type: 'task' as const, x: 200, y: 250 },
        { title: 'Backend Development', type: 'task' as const, x: 400, y: 250 },
        { title: 'Integration', type: 'task' as const, x: 300, y: 350 },
        { title: 'Testing', type: 'task' as const, x: 300, y: 450 },
        { title: 'Feature Complete', type: 'milestone' as const, x: 300, y: 550 },
      ],
    };

    const template = templates[templateName as keyof typeof templates];
    if (template) {
      console.log('Creating tasks from template:', template);
      
      try {
        for (const item of template) {
          console.log('Creating task:', item);
          await addTask({
            title: item.title,
            description: `Generated from ${templateName} template`,
            status: 'todo',
            priority: 'medium',
            tags: [templateName.toLowerCase().replace(' ', '-')],
            position: { x: item.x, y: item.y },
            nodeType: item.type,
            connections: [],
          });
        }
        
        console.log('All template tasks created successfully');
        
        // Refresh and fit view after a short delay
        setTimeout(() => {
          refreshTasks();
          fitView();
        }, 1000);
      } catch (error) {
        console.error('Error creating template tasks:', error);
      }
    } else {
      console.error('Template not found:', templateName);
    }
  }, [addTask, refreshTasks, fitView]);

  // Register handlers with the sidebar
  useEffect(() => {
    console.log('Registering handlers with sidebar');
    registerQuickActionHandler(handleQuickAction);
    registerTemplateHandler(handleTemplateSelect);
  }, [registerQuickActionHandler, registerTemplateHandler, handleQuickAction, handleTemplateSelect]);

  const onConnect = useCallback(
    (connection: Connection) => {
      if (connection.source && connection.target) {
        const sourceTask = tasks.find(task => task.id === connection.source);
        if (sourceTask) {
          const currentConnections = sourceTask.connections || [];
          if (!currentConnections.includes(connection.target)) {
            updateTask(connection.source, {
              connections: [...currentConnections, connection.target],
            });
          }
        }
      }
      
      setEdges(eds => addEdge({
        ...connection,
        markerEnd: { type: MarkerType.ArrowClosed },
      }, eds));
    },
    [tasks, updateTask, setEdges]
  );

  const onNodeClick = useCallback((event: React.MouseEvent, node: Node) => {
    console.log('Node clicked:', node);
    setSelectedTask(node.data as Task);
    setIsDetailOpen(true);
  }, []);

  const onNodeDragStop = useCallback((event: React.MouseEvent, node: Node) => {
    console.log('Node drag stopped:', node.id, node.position);
    updateTask(node.id, {
      position: node.position,
    });
  }, [updateTask]);

  const onDrop = useCallback(
    (event: React.DragEvent) => {
      event.preventDefault();

      const type = event.dataTransfer.getData('application/reactflow') as 'task' | 'milestone' | 'note';

      if (typeof type === 'undefined' || !type) {
        return;
      }

      const position = screenToFlowPosition({
        x: event.clientX,
        y: event.clientY,
      });

      setNewTaskPosition(position);
      setNewNodeType(type);
      setEditingTask(null);
      setIsTaskFormOpen(true);
    },
    [screenToFlowPosition]
  );

  const onDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);

  const handleSaveTask = useCallback(
    async (taskData: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>) => {
      try {
        console.log('Saving task:', taskData);
        if (editingTask) {
          await updateTask(editingTask.id, taskData);
        } else {
          const position = newTaskPosition || { x: 100, y: 100 };
          await addTask({
            ...taskData,
            position,
            nodeType: newNodeType,
            connections: taskData.connections || [],
          });
        }
        
        setIsTaskFormOpen(false);
        setEditingTask(null);
        setNewTaskPosition(null);
        
        // Refresh after a short delay
        setTimeout(() => {
          refreshTasks();
        }, 500);
      } catch (error) {
        console.error('Error saving task:', error);
      }
    },
    [editingTask, updateTask, addTask, refreshTasks, newTaskPosition, newNodeType]
  );

  const onPaneClick = () => {
    setSelectedTask(null);
  };

  console.log('TaskCanvasFlow render - nodes:', nodes.length, 'edges:', edges.length, 'tasks:', tasks.length);

  return (
    <div className="w-full h-full" ref={reactFlowWrapper}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onNodeClick={onNodeClick}
        onNodeDragStop={onNodeDragStop}
        onDrop={onDrop}
        onDragOver={onDragOver}
        onPaneClick={onPaneClick}
        nodeTypes={nodeTypes}
        edgeTypes={edgeTypes}
        fitView
        fitViewOptions={{ padding: 0.2 }}
        defaultEdgeOptions={{ 
          type: 'default',
          markerEnd: { type: MarkerType.ArrowClosed },
          style: { strokeWidth: 2 }
        }}
        className="bg-white dark:bg-gray-950"
      >
        <Background 
          color="#94a3b8" 
          gap={16} 
          size={1} 
          variant={BackgroundVariant.Dots}
          className="dark:bg-gray-950" 
        />
        <MiniMap 
          nodeColor={(node) => {
            if (node.type === 'task') return '#3b82f6';
            if (node.type === 'milestone') return '#8b5cf6';
            if (node.type === 'note') return '#f59e0b';
            return '#6b7280';
          }}
          maskColor="rgba(255, 255, 255, 0.2)"
          className="bg-white/80 backdrop-blur-sm dark:bg-gray-900/80 rounded-lg border dark:border-gray-700 shadow-lg"
          nodeStrokeWidth={2}
          nodeBorderRadius={4}
        />
        <Controls className="bg-white/70 backdrop-blur-md dark:bg-gray-900/70 rounded-lg border dark:border-gray-800" />
        <CustomControls 
          onZoomIn={() => {}}
          onZoomOut={() => {}}
          onFitView={() => {}}
          onAddNode={handleAddNode}
        />
        
        <div className="absolute left-4 bottom-4">
          <Button
            onClick={handleAddNode}
            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Task
          </Button>
        </div>
      </ReactFlow>
      
      <NodeDetail 
        isOpen={isDetailOpen} 
        onClose={() => setIsDetailOpen(false)}
        task={selectedTask}
        onEdit={handleEditTask}
      />
      
      <TaskForm
        isOpen={isTaskFormOpen}
        onClose={() => {
          setIsTaskFormOpen(false);
          setEditingTask(null);
          setNewTaskPosition(null);
        }}
        onSave={handleSaveTask}
        task={editingTask}
        initialStatus="todo"
      />
    </div>
  );
}
