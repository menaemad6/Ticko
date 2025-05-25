
import { Node, Edge } from '@xyflow/react';
import { Task } from '@/types/task';

export const exportCanvasAsJSON = (nodes: Node[], edges: Edge[], tasks: Task[]) => {
  const canvasData = {
    version: '1.0',
    timestamp: new Date().toISOString(),
    nodes,
    edges,
    tasks,
  };

  const dataStr = JSON.stringify(canvasData, null, 2);
  const dataBlob = new Blob([dataStr], { type: 'application/json' });
  const url = URL.createObjectURL(dataBlob);
  
  const link = document.createElement('a');
  link.href = url;
  link.download = `task-canvas-${new Date().toISOString().split('T')[0]}.json`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

export const exportCanvasAsImage = (reactFlowInstance: any) => {
  if (!reactFlowInstance) return;

  const viewport = reactFlowInstance.getViewport();
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  
  if (!ctx) return;

  // This is a simplified version - in a real implementation you'd need
  // to render the React Flow content to canvas
  canvas.width = 1200;
  canvas.height = 800;
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  
  ctx.fillStyle = '#000000';
  ctx.font = '16px Arial';
  ctx.fillText('Canvas Export (Simplified)', 50, 50);
  
  const link = document.createElement('a');
  link.download = `task-canvas-${new Date().toISOString().split('T')[0]}.png`;
  link.href = canvas.toDataURL();
  link.click();
};

export const importCanvasFromFile = (file: File): Promise<any> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target?.result as string);
        resolve(data);
      } catch (error) {
        reject(new Error('Invalid JSON file'));
      }
    };
    reader.onerror = () => reject(new Error('Failed to read file'));
    reader.readAsText(file);
  });
};

export const filterNodesByType = (nodes: Node[], nodeType: string) => {
  return nodes.filter(node => node.type === nodeType);
};

export const filterNodesByStatus = (nodes: Node[], status: string) => {
  return nodes.filter(node => node.data?.status === status);
};

export const arrangeNodesInLayers = (nodes: Node[]): Node[] => {
  const layers = {
    task: { y: 100, nodes: [] as Node[] },
    milestone: { y: 300, nodes: [] as Node[] },
    note: { y: 500, nodes: [] as Node[] },
  };

  // Group nodes by type
  nodes.forEach(node => {
    const type = node.type as keyof typeof layers;
    if (layers[type]) {
      layers[type].nodes.push(node);
    }
  });

  // Arrange nodes in layers
  return nodes.map(node => {
    const type = node.type as keyof typeof layers;
    if (layers[type]) {
      const index = layers[type].nodes.findIndex(n => n.id === node.id);
      return {
        ...node,
        position: {
          x: index * 200 + 100,
          y: layers[type].y,
        },
      };
    }
    return node;
  });
};
