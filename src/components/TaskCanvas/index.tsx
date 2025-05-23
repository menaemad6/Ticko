
import React, { useState, useCallback, useRef } from 'react';
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
  ReactFlowProvider,
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

// Create an internal canvas component that uses the React Flow hooks
const FlowCanvas = () => {
  const { getFlowNodes, getFlowEdges, updateTask, addTask, loading, refreshTasks } = useTasks();
  const [nodes, setNodes, onNodesChange] = useNodesState<Node>(getFlowNodes() as unknown as Node[]);
  const [edges, setEdges, onEdgesChange] = useEdgesState<Edge>(getFlowEdges() as unknown as Edge[]);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [isTaskFormOpen, setIsTaskFormOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [newTaskPosition, setNewTaskPosition] = useState<XYPosition | null>(null);
  const reactFlowWrapper = useRef<HTMLDivElement>(null);
  const { screenToFlowPosition, getViewport } = useReactFlow();

  // Update nodes and edges when tasks change
  React.useEffect(() => {
    if (!loading) {
      setNodes(getFlowNodes() as unknown as Node[]);
      setEdges(getFlowEdges() as unknown as Edge[]);
    }
  }, [loading, getFlowNodes, getFlowEdges, setNodes, setEdges]);

  const onConnect = useCallback(
    (connection: Connection) => {
      // Update the connections in the database
      if (connection.source && connection.target) {
        const sourceTask = nodes.find(node => node.id === connection.source);
        if (sourceTask && sourceTask.data) {
          const taskData = sourceTask.data as Task;
          const currentConnections = taskData.connections || [];
          if (!currentConnections.includes(connection.target)) {
            updateTask(connection.source, {
              connections: [...currentConnections, connection.target],
            });
          }
        }
      }
      
      // Add the edge to the visual representation
      setEdges(eds => addEdge({
        ...connection,
        markerEnd: { type: MarkerType.ArrowClosed },
      }, eds));
    },
    [nodes, updateTask, setEdges]
  );

  const onNodeClick = useCallback((event: React.MouseEvent, node: Node) => {
    // Open node details
    setSelectedTask(node.data as Task);
    setIsDetailOpen(true);
  }, []);

  const onNodeDragStop = useCallback((event: React.MouseEvent, node: Node) => {
    // Update task position in the database
    updateTask(node.id, {
      position: node.position,
    });
  }, [updateTask]);

  const handleAddNode = useCallback(() => {
    const viewport = getViewport();
    const position = reactFlowWrapper.current
      ? screenToFlowPosition({
          x: reactFlowWrapper.current.clientWidth / 2,
          y: reactFlowWrapper.current.clientHeight / 2,
        })
      : { x: 100, y: 100 };

    setNewTaskPosition(position);
    setEditingTask(null);
    setIsTaskFormOpen(true);
  }, [screenToFlowPosition, getViewport]);

  const handleEditNode = useCallback((task: Task) => {
    setEditingTask(task);
    setIsTaskFormOpen(true);
  }, []);

  const handleSaveTask = useCallback(
    async (taskData: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>) => {
      if (editingTask) {
        await updateTask(editingTask.id, taskData);
      } else {
        const position = newTaskPosition || { x: 100, y: 100 };
        await addTask({
          ...taskData,
          position,
        });
      }
      
      setIsTaskFormOpen(false);
      refreshTasks();
    },
    [editingTask, updateTask, addTask, refreshTasks, newTaskPosition]
  );

  const onPaneClick = () => {
    // Close any open selections when clicking on the canvas
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
        onClose={() => setIsTaskFormOpen(false)}
        onSave={handleSaveTask}
        task={editingTask}
        initialStatus="todo"
      />
    </div>
  );
};

// Main component that wraps FlowCanvas with ReactFlowProvider
export default function TaskCanvas() {
  return (
    <ReactFlowProvider>
      <FlowCanvas />
    </ReactFlowProvider>
  );
}
