
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
import { Palette, Grid, Eye, Save } from 'lucide-react';

interface PreferencesModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PreferencesModal: React.FC<PreferencesModalProps> = ({ isOpen, onClose }) => {
  const [preferences, setPreferences] = useState({
    autoSave: true,
    showGrid: true,
    showMiniMap: true,
    snapToGrid: false,
    darkMode: false,
    animationsEnabled: true,
    defaultNodeType: 'task',
    gridSize: '16',
    autoLayout: false,
    showConnections: true,
  });

  const handleSave = () => {
    // Save preferences to localStorage or backend
    localStorage.setItem('taskCanvasPreferences', JSON.stringify(preferences));
    onClose();
  };

  const handleReset = () => {
    setPreferences({
      autoSave: true,
      showGrid: true,
      showMiniMap: true,
      snapToGrid: false,
      darkMode: false,
      animationsEnabled: true,
      defaultNodeType: 'task',
      gridSize: '16',
      autoLayout: false,
      showConnections: true,
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Palette className="w-5 h-5" />
            Canvas Preferences
          </DialogTitle>
          <DialogDescription>
            Customize your task canvas experience with these settings.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* General Settings */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium flex items-center gap-2">
              <Save className="w-4 h-4" />
              General
            </h3>
            
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label htmlFor="auto-save">Auto-save changes</Label>
                <Switch
                  id="auto-save"
                  checked={preferences.autoSave}
                  onCheckedChange={(checked) => 
                    setPreferences(prev => ({ ...prev, autoSave: checked }))
                  }
                />
              </div>

              <div className="flex items-center justify-between">
                <Label htmlFor="animations">Enable animations</Label>
                <Switch
                  id="animations"
                  checked={preferences.animationsEnabled}
                  onCheckedChange={(checked) => 
                    setPreferences(prev => ({ ...prev, animationsEnabled: checked }))
                  }
                />
              </div>

              <div className="flex items-center justify-between">
                <Label htmlFor="auto-layout">Auto-arrange new nodes</Label>
                <Switch
                  id="auto-layout"
                  checked={preferences.autoLayout}
                  onCheckedChange={(checked) => 
                    setPreferences(prev => ({ ...prev, autoLayout: checked }))
                  }
                />
              </div>

              <div className="flex items-center justify-between">
                <Label htmlFor="default-node">Default node type</Label>
                <Select
                  value={preferences.defaultNodeType}
                  onValueChange={(value) => 
                    setPreferences(prev => ({ ...prev, defaultNodeType: value }))
                  }
                >
                  <SelectTrigger className="w-32">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="task">Task</SelectItem>
                    <SelectItem value="milestone">Milestone</SelectItem>
                    <SelectItem value="note">Note</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          <Separator />

          {/* Visual Settings */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium flex items-center gap-2">
              <Eye className="w-4 h-4" />
              Visual
            </h3>
            
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label htmlFor="show-grid">Show background grid</Label>
                <Switch
                  id="show-grid"
                  checked={preferences.showGrid}
                  onCheckedChange={(checked) => 
                    setPreferences(prev => ({ ...prev, showGrid: checked }))
                  }
                />
              </div>

              <div className="flex items-center justify-between">
                <Label htmlFor="show-minimap">Show mini-map</Label>
                <Switch
                  id="show-minimap"
                  checked={preferences.showMiniMap}
                  onCheckedChange={(checked) => 
                    setPreferences(prev => ({ ...prev, showMiniMap: checked }))
                  }
                />
              </div>

              <div className="flex items-center justify-between">
                <Label htmlFor="show-connections">Show node connections</Label>
                <Switch
                  id="show-connections"
                  checked={preferences.showConnections}
                  onCheckedChange={(checked) => 
                    setPreferences(prev => ({ ...prev, showConnections: checked }))
                  }
                />
              </div>

              <div className="flex items-center justify-between">
                <Label htmlFor="dark-mode">Dark mode</Label>
                <Switch
                  id="dark-mode"
                  checked={preferences.darkMode}
                  onCheckedChange={(checked) => 
                    setPreferences(prev => ({ ...prev, darkMode: checked }))
                  }
                />
              </div>
            </div>
          </div>

          <Separator />

          {/* Grid Settings */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium flex items-center gap-2">
              <Grid className="w-4 h-4" />
              Grid & Snapping
            </h3>
            
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label htmlFor="snap-to-grid">Snap to grid</Label>
                <Switch
                  id="snap-to-grid"
                  checked={preferences.snapToGrid}
                  onCheckedChange={(checked) => 
                    setPreferences(prev => ({ ...prev, snapToGrid: checked }))
                  }
                />
              </div>

              <div className="flex items-center justify-between">
                <Label htmlFor="grid-size">Grid size</Label>
                <Select
                  value={preferences.gridSize}
                  onValueChange={(value) => 
                    setPreferences(prev => ({ ...prev, gridSize: value }))
                  }
                >
                  <SelectTrigger className="w-20">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="8">8px</SelectItem>
                    <SelectItem value="16">16px</SelectItem>
                    <SelectItem value="24">24px</SelectItem>
                    <SelectItem value="32">32px</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-between pt-4">
          <Button variant="outline" onClick={handleReset}>
            Reset to Defaults
          </Button>
          <div className="space-x-2">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button onClick={handleSave}>
              Save Preferences
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
