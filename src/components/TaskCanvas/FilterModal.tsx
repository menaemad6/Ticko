
import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Filter } from 'lucide-react';

interface FilterModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApplyFilters: (filters: NodeFilters) => void;
}

export interface NodeFilters {
  showTasks: boolean;
  showMilestones: boolean;
  showNotes: boolean;
  statusFilter: 'all' | 'todo' | 'in-progress' | 'done';
  priorityFilter: 'all' | 'low' | 'medium' | 'high';
  tagFilter: string;
}

export const FilterModal: React.FC<FilterModalProps> = ({ 
  isOpen, 
  onClose, 
  onApplyFilters 
}) => {
  const [filters, setFilters] = useState<NodeFilters>({
    showTasks: true,
    showMilestones: true,
    showNotes: true,
    statusFilter: 'all',
    priorityFilter: 'all',
    tagFilter: '',
  });

  const handleApply = () => {
    onApplyFilters(filters);
    onClose();
  };

  const handleReset = () => {
    const resetFilters: NodeFilters = {
      showTasks: true,
      showMilestones: true,
      showNotes: true,
      statusFilter: 'all',
      priorityFilter: 'all',
      tagFilter: '',
    };
    setFilters(resetFilters);
    onApplyFilters(resetFilters);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Filter className="w-5 h-5" />
            Filter Nodes
          </DialogTitle>
          <DialogDescription>
            Show or hide nodes based on type, status, and other criteria.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Node Types */}
          <div className="space-y-4">
            <h3 className="text-sm font-medium">Node Types</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label htmlFor="show-tasks">Show Tasks</Label>
                <Switch
                  id="show-tasks"
                  checked={filters.showTasks}
                  onCheckedChange={(checked) => 
                    setFilters(prev => ({ ...prev, showTasks: checked }))
                  }
                />
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="show-milestones">Show Milestones</Label>
                <Switch
                  id="show-milestones"
                  checked={filters.showMilestones}
                  onCheckedChange={(checked) => 
                    setFilters(prev => ({ ...prev, showMilestones: checked }))
                  }
                />
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="show-notes">Show Notes</Label>
                <Switch
                  id="show-notes"
                  checked={filters.showNotes}
                  onCheckedChange={(checked) => 
                    setFilters(prev => ({ ...prev, showNotes: checked }))
                  }
                />
              </div>
            </div>
          </div>

          <Separator />

          {/* Status Filter */}
          <div className="space-y-3">
            <Label htmlFor="status-filter">Status Filter</Label>
            <Select
              value={filters.statusFilter}
              onValueChange={(value: NodeFilters['statusFilter']) => 
                setFilters(prev => ({ ...prev, statusFilter: value }))
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="todo">To Do</SelectItem>
                <SelectItem value="in-progress">In Progress</SelectItem>
                <SelectItem value="done">Done</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Priority Filter */}
          <div className="space-y-3">
            <Label htmlFor="priority-filter">Priority Filter</Label>
            <Select
              value={filters.priorityFilter}
              onValueChange={(value: NodeFilters['priorityFilter']) => 
                setFilters(prev => ({ ...prev, priorityFilter: value }))
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Priorities</SelectItem>
                <SelectItem value="low">Low</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="high">High</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="flex justify-between pt-4">
          <Button variant="outline" onClick={handleReset}>
            Reset Filters
          </Button>
          <div className="space-x-2">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button onClick={handleApply}>
              Apply Filters
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
