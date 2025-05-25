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
import { FilterModal, NodeFilters } from './FilterModal';
import { CanvasPreferences } from './PreferencesModal';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { 
  exportCanvasAsJSON, 
  exportCanvasAsImage, 
  importCanvasFromFile,
  arrangeNodesInLayers 
} from '@/utils/canvasUtils';

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
  isActionInProgress?: boolean;
  onActionStateChange?: (inProgress: boolean) => void;
}

export default function TaskCanvasFlow({ 
  registerQuickActionHandler, 
  registerTemplateHandler,
  isActionInProgress = false,
  onActionStateChange
}: TaskCanvasFlowProps) {
  const { tasks, getFlowNodes, getFlowEdges, updateTask, addTask, loading, refreshTasks, deleteAllTasks } = useTasks();
  const [nodes, setNodes, onNodesChange] = useNodesState<Node>([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState<Edge>([]);
  const [filteredNodes, setFilteredNodes] = useState<Node[]>([]);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [isTaskFormOpen, setIsTaskFormOpen] = useState(false);
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [newTaskPosition, setNewTaskPosition] = useState<XYPosition | null>(null);
  const [newNodeType, setNewNodeType] = useState<'task' | 'milestone' | 'note'>('task');
  const [preferences, setPreferences] = useState<CanvasPreferences | null>(null);
  const [currentFilters, setCurrentFilters] = useState<NodeFilters>({
    showTasks: true,
    showMilestones: true,
    showNotes: true,
    statusFilter: 'all',
    priorityFilter: 'all',
    tagFilter: '',
  });
  const [focusMode, setFocusMode] = useState(false);
  const reactFlowWrapper = useRef<HTMLDivElement>(null);
  const { screenToFlowPosition, getViewport, fitView } = useReactFlow();
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Memoize handlers with useRef to break dependency cycle
  const quickActionHandlerRef = useRef<((action: string) => void) | null>(null);
  const templateHandlerRef = useRef<((templateName: string) => void) | null>(null);

  // Load preferences on mount
  useEffect(() => {
    const savedPreferences = localStorage.getItem('taskCanvasPreferences');
    if (savedPreferences) {
      try {
        setPreferences(JSON.parse(savedPreferences));
      } catch (error) {
        console.error('Error loading preferences:', error);
      }
    }
  }, []);

  // Update nodes and edges when tasks change
  useEffect(() => {
    if (!loading && tasks.length >= 0) {
      try {
        const flowNodes = getFlowNodes();
        const flowEdges = getFlowEdges();
        
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
      } catch (error) {
        console.error('Error setting nodes/edges:', error);
      }
    }
  }, [tasks, loading, setNodes, setEdges]);

  // Apply filters when nodes or filters change
  useEffect(() => {
    const filtered = nodes.filter(node => {
      // Type filter
      if (node.type === 'task' && !currentFilters.showTasks) return false;
      if (node.type === 'milestone' && !currentFilters.showMilestones) return false;
      if (node.type === 'note' && !currentFilters.showNotes) return false;

      // Status filter
      if (currentFilters.statusFilter !== 'all' && node.data?.status !== currentFilters.statusFilter) return false;

      // Priority filter
      if (currentFilters.priorityFilter !== 'all' && node.data?.priority !== currentFilters.priorityFilter) return false;

      return true;
    });

    setFilteredNodes(filtered);
  }, [nodes, currentFilters]);

  const handleAddNode = useCallback(() => {
    if (isActionInProgress) return;
    
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
  }, [screenToFlowPosition, getViewport, isActionInProgress]);

  const handleEditTask = useCallback((task: Task) => {
    if (isActionInProgress) return;
    setEditingTask(task);
    setIsTaskFormOpen(true);
  }, [isActionInProgress]);

  const handleQuickAction = useCallback(async (action: string) => {
    if (isActionInProgress) return;
    onActionStateChange?.(true);
    try {
      switch (action) {
        case 'addTask': {
          handleAddNode();
          break;
        }
        case 'scheduleView': {
          const tasksWithDates = tasks.filter(task => task.dueDate);
          tasksWithDates.sort((a, b) => new Date(a.dueDate!).getTime() - new Date(b.dueDate!).getTime());
          break;
        }
        default: {
          break;
        }
      }
    } finally {
      onActionStateChange?.(false);
    }
  }, [isActionInProgress, onActionStateChange, handleAddNode, tasks]);

  const handleTemplateSelect = useCallback(async (templateName: string) => {
    if (isActionInProgress) return;
    onActionStateChange?.(true);
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
      try {
        for (const item of template) {
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
    
    onActionStateChange?.(false);
  }, [isActionInProgress, onActionStateChange, addTask, refreshTasks, fitView]);

  // Store handlers in refs to keep stable references
  useEffect(() => {
    quickActionHandlerRef.current = handleQuickAction;
    templateHandlerRef.current = handleTemplateSelect;
  }, [handleQuickAction, handleTemplateSelect]);

  // Register handlers with the sidebar only once on mount
  useEffect(() => {
    registerQuickActionHandler((action) => quickActionHandlerRef.current?.(action));
    registerTemplateHandler((templateName) => templateHandlerRef.current?.(templateName));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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

  const displayNodes = filteredNodes.length > 0 ? filteredNodes : nodes;

  const handleFileImport = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      const data = await importCanvasFromFile(file);
      if (data.tasks && Array.isArray(data.tasks)) {
        for (const task of data.tasks) {
          await addTask({
            ...task,
            title: `${task.title} (Imported)`,
          });
        }
        setTimeout(() => {
          refreshTasks();
          fitView();
        }, 1000);
        toast({
          title: "Canvas imported",
          description: `Successfully imported ${data.tasks.length} tasks.`,
        });
      } else {
        throw new Error('Invalid canvas file format');
      }
    } catch (error) {
      console.error('Import error:', error);
      toast({
        title: "Import failed",
        description: "Failed to import canvas. Please check the file format.",
        variant: "destructive",
      });
    }
    event.target.value = '';
  };

  const handleApplyFilters = (filters: NodeFilters) => {
    setCurrentFilters(filters);
    toast({
      title: "Filters applied",
      description: "Node visibility has been updated based on your filters.",
    });
  };

  return (
    <div className="w-full h-full" ref={reactFlowWrapper}>
      <input
        ref={fileInputRef}
        type="file"
        accept=".json"
        onChange={handleFileImport}
        style={{ display: 'none' }}
      />
      
      <ReactFlow
        nodes={displayNodes}
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
        snapToGrid={preferences?.snapToGrid}
        snapGrid={preferences?.gridSize ? [parseInt(preferences.gridSize), parseInt(preferences.gridSize)] : [16, 16]}
      >
        {preferences?.showGrid !== false && (
          <Background 
            color="#94a3b8" 
            gap={preferences?.gridSize ? parseInt(preferences.gridSize) : 16} 
            size={1} 
            variant={BackgroundVariant.Dots}
            className="dark:bg-gray-950" 
          />
        )}
        
        {preferences?.showMiniMap !== false && !focusMode && (
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
        )}
        
        {/* {!focusMode && (
          <Controls className="bg-white/70 backdrop-blur-md dark:bg-gray-900/70 rounded-lg border dark:border-gray-800" />
        )} */}
        
        {!focusMode && (
          <CustomControls 
            onZoomIn={() => {}}
            onZoomOut={() => {}}
            onFitView={() => {}}
            onAddNode={handleAddNode}
          />
        )}
        
        {/* {!focusMode && (
          <div className="absolute left-4 bottom-4">
            <Button
              onClick={handleAddNode}
              disabled={isActionInProgress}
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 disabled:opacity-50"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Task
            </Button>
          </div>
        )} */}

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

      <FilterModal
        isOpen={isFilterModalOpen}
        onClose={() => setIsFilterModalOpen(false)}
        onApplyFilters={handleApplyFilters}
      />
    </div>
  );
}
