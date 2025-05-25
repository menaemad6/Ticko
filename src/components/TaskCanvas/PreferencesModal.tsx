
import React, { useState, useEffect } from 'react';
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
import { useToast } from '@/hooks/use-toast';

interface PreferencesModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPreferencesChange?: (preferences: CanvasPreferences) => void;
}

export interface CanvasPreferences {
  autoSave: boolean;
  showGrid: boolean;
  showMiniMap: boolean;
  snapToGrid: boolean;
  darkMode: boolean;
  animationsEnabled: boolean;
  defaultNodeType: 'task' | 'milestone' | 'note';
  gridSize: string;
  autoLayout: boolean;
  showConnections: boolean;
}

const defaultPreferences: CanvasPreferences = {
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
};

export const PreferencesModal: React.FC<PreferencesModalProps> = ({ 
  isOpen, 
  onClose, 
  onPreferencesChange 
}) => {
  const [preferences, setPreferences] = useState<CanvasPreferences>(defaultPreferences);
  const { toast } = useToast();

  // Load preferences from localStorage on mount
  useEffect(() => {
    const savedPreferences = localStorage.getItem('taskCanvasPreferences');
    if (savedPreferences) {
      try {
        const parsed = JSON.parse(savedPreferences);
        setPreferences({ ...defaultPreferences, ...parsed });
      } catch (error) {
        console.error('Error loading preferences:', error);
      }
    }
  }, []);

  // Apply dark mode when preference changes
  useEffect(() => {
    if (preferences.darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [preferences.darkMode]);

  const handleSave = () => {
    try {
      localStorage.setItem('taskCanvasPreferences', JSON.stringify(preferences));
      onPreferencesChange?.(preferences);
      toast({
        title: "Preferences saved",
        description: "Your canvas preferences have been saved successfully.",
      });
      onClose();
    } catch (error) {
      console.error('Error saving preferences:', error);
      toast({
        title: "Error saving preferences",
        description: "Failed to save your preferences. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleReset = () => {
    setPreferences(defaultPreferences);
    toast({
      title: "Preferences reset",
      description: "All preferences have been reset to defaults.",
    });
  };

  const updatePreference = <K extends keyof CanvasPreferences>(
    key: K,
    value: CanvasPreferences[K]
  ) => {
    setPreferences(prev => ({ ...prev, [key]: value }));
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
                  onCheckedChange={(checked) => updatePreference('autoSave', checked)}
                />
              </div>

              <div className="flex items-center justify-between">
                <Label htmlFor="animations">Enable animations</Label>
                <Switch
                  id="animations"
                  checked={preferences.animationsEnabled}
                  onCheckedChange={(checked) => updatePreference('animationsEnabled', checked)}
                />
              </div>

              <div className="flex items-center justify-between">
                <Label htmlFor="auto-layout">Auto-arrange new nodes</Label>
                <Switch
                  id="auto-layout"
                  checked={preferences.autoLayout}
                  onCheckedChange={(checked) => updatePreference('autoLayout', checked)}
                />
              </div>

              <div className="flex items-center justify-between">
                <Label htmlFor="default-node">Default node type</Label>
                <Select
                  value={preferences.defaultNodeType}
                  onValueChange={(value: 'task' | 'milestone' | 'note') => 
                    updatePreference('defaultNodeType', value)
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
                  onCheckedChange={(checked) => updatePreference('showGrid', checked)}
                />
              </div>

              <div className="flex items-center justify-between">
                <Label htmlFor="show-minimap">Show mini-map</Label>
                <Switch
                  id="show-minimap"
                  checked={preferences.showMiniMap}
                  onCheckedChange={(checked) => updatePreference('showMiniMap', checked)}
                />
              </div>

              <div className="flex items-center justify-between">
                <Label htmlFor="show-connections">Show node connections</Label>
                <Switch
                  id="show-connections"
                  checked={preferences.showConnections}
                  onCheckedChange={(checked) => updatePreference('showConnections', checked)}
                />
              </div>

              <div className="flex items-center justify-between">
                <Label htmlFor="dark-mode">Dark mode</Label>
                <Switch
                  id="dark-mode"
                  checked={preferences.darkMode}
                  onCheckedChange={(checked) => updatePreference('darkMode', checked)}
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
                  onCheckedChange={(checked) => updatePreference('snapToGrid', checked)}
                />
              </div>

              <div className="flex items-center justify-between">
                <Label htmlFor="grid-size">Grid size</Label>
                <Select
                  value={preferences.gridSize}
                  onValueChange={(value) => updatePreference('gridSize', value)}
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
