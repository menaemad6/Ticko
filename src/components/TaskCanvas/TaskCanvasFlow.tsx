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
    console.log('Tasks updated:', tasks.length, 'tasks');
    if (!loading && tasks.length >= 0) {
      const flowNodes = getFlowNodes() as unknown as Node[];
      const flowEdges = getFlowEdges() as unknown as Edge[];
      console.log('Setting nodes:', flowNodes.length, 'edges:', flowEdges.length);
      setNodes(flowNodes);
      setEdges(flowEdges);
    }
  }, [tasks, loading, getFlowNodes, getFlowEdges, setNodes, setEdges]);

  const handleAddNode = useCallback(() => {
    const viewport = getViewport();
    const position = reactFlowWrapper.current
      ? screenToFlowPosition({
          x: reactFlowWrapper.current.clientWidth / 2,
          y: reactFlowWrapper.current.clientHeight / 2,
        })
      : { x: 100, y: 100 };

    setNewTaskPosition(position);
    setNewNodeType('task');
    setEditingTask(null);
    setIsTaskFormOpen(true);
  }, [screenToFlowPosition, getViewport]);

  const handleQuickAction = useCallback((action: string) => {
    switch (action) {
      case 'addTask':
        handleAddNode();
        break;
      case 'scheduleView':
        console.log('Schedule view not implemented yet');
        break;
      case 'manageTags':
        console.log('Tag management not implemented yet');
        break;
      case 'assignUsers':
        console.log('User assignment not implemented yet');
        break;
      case 'gridLayout':
        const gridNodes = nodes.map((node, index) => {
          const col = index % 4;
          const row = Math.floor(index / 4);
          return {
            ...node,
            position: { x: col * 200 + 100, y: row * 150 + 100 }
          };
        });
        setNodes(gridNodes);
        setTimeout(() => fitView(), 100);
        break;
      default:
        console.log('Unknown action:', action);
    }
  }, [handleAddNode, nodes, setNodes, fitView]);

  const handleTemplateSelect = useCallback((templateName: string) => {
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
      // Create tasks from template
      const promises = template.map(async (item) => {
        return addTask({
          title: item.title,
          description: `Generated from ${templateName} template`,
          status: 'todo',
          priority: 'medium',
          tags: [templateName.toLowerCase().replace(' ', '-')],
          position: { x: item.x, y: item.y },
          nodeType: item.type,
          connections: [],
        });
      });
      
      Promise.all(promises).then(() => {
        setTimeout(() => {
          refreshTasks();
          fitView();
        }, 500);
      });
    }
  }, [addTask, refreshTasks, fitView]);

  // Register handlers with the sidebar
  useEffect(() => {
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
    setSelectedTask(node.data as Task);
    setIsDetailOpen(true);
  }, []);

  const onNodeDragStop = useCallback((event: React.MouseEvent, node: Node) => {
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
        
        setTimeout(() => {
          refreshTasks();
        }, 100);
      } catch (error) {
        console.error('Error saving task:', error);
      }
    },
    [editingTask, updateTask, addTask, refreshTasks, newTaskPosition, newNodeType]
  );

  const onPaneClick = () => {
    setSelectedTask(null);
  };

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
          nodeColor={(n) => {
            if (n.type === 'task') return '#93c5fd';
            if (n.type === 'milestone') return '#c084fc';
            return '#fcd34d';
          }}
          maskColor="rgba(240, 240, 240, 0.4)"
          className="bg-white/70 backdrop-blur-md dark:bg-gray-900/70 rounded-lg border dark:border-gray-800"
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
