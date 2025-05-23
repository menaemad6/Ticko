
import React from 'react';
import { Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent, SidebarGroupLabel, SidebarHeader } from '@/components/ui/sidebar';
import { CheckSquare, Milestone, StickyNote, Plus } from 'lucide-react';

interface DraggableNodeProps {
  type: 'task' | 'milestone' | 'note';
  label: string;
  icon: React.ReactNode;
  color: string;
}

const DraggableNode: React.FC<DraggableNodeProps> = ({ type, label, icon, color }) => {
  const onDragStart = (event: React.DragEvent, nodeType: string) => {
    event.dataTransfer.setData('application/reactflow', nodeType);
    event.dataTransfer.effectAllowed = 'move';
  };

  return (
    <div
      className={`flex items-center gap-3 p-3 rounded-lg border-2 border-dashed ${color} cursor-grab hover:opacity-80 transition-opacity`}
      draggable
      onDragStart={(event) => onDragStart(event, type)}
    >
      {icon}
      <span className="text-sm font-medium">{label}</span>
    </div>
  );
};

export function TaskSidebar() {
  const nodeTypes = [
    {
      type: 'task' as const,
      label: 'Task Node',
      icon: <CheckSquare className="w-5 h-5 text-blue-600" />,
      color: 'border-blue-300 bg-blue-50 hover:bg-blue-100'
    },
    {
      type: 'milestone' as const,
      label: 'Milestone Node',
      icon: <Milestone className="w-5 h-5 text-purple-600" />,
      color: 'border-purple-300 bg-purple-50 hover:bg-purple-100'
    },
    {
      type: 'note' as const,
      label: 'Note Node',
      icon: <StickyNote className="w-5 h-5 text-amber-600" />,
      color: 'border-amber-300 bg-amber-50 hover:bg-amber-100'
    }
  ];

  return (
    <Sidebar className="w-64 border-r">
      <SidebarHeader className="p-4">
        <h2 className="text-lg font-semibold">Task Tools</h2>
        <p className="text-sm text-gray-600">Drag nodes to the canvas</p>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Node Types</SidebarGroupLabel>
          <SidebarGroupContent className="space-y-3 p-3">
            {nodeTypes.map((nodeType) => (
              <DraggableNode
                key={nodeType.type}
                type={nodeType.type}
                label={nodeType.label}
                icon={nodeType.icon}
                color={nodeType.color}
              />
            ))}
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
