
export interface Task {
  id: string;
  title: string;
  description?: string;
  status: 'todo' | 'in-progress' | 'done';
  priority: 'low' | 'medium' | 'high';
  dueDate?: string;
  tags: string[];
  position: {
    x: number;
    y: number;
  };
  nodeType: 'task' | 'milestone' | 'note';
  connections?: string[];
  createdAt: string;
  updatedAt: string;
}

export interface Column {
  id: string;
  title: string;
  status: Task['status'];
  color: string;
}

export interface FlowNode {
  id: string;
  type: string;
  position: {
    x: number;
    y: number;
  };
  data: Task;
}

export interface FlowEdge {
  id: string;
  source: string;
  target: string;
  animated?: boolean;
}
