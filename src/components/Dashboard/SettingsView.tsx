
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Settings, User, Bell, Palette, Shield } from 'lucide-react';

export function SettingsView() {
  const settingsSections = [
    {
      title: 'Profile Settings',
      icon: User,
      description: 'Manage your account and personal information',
    },
    {
      title: 'Notifications',
      icon: Bell,
      description: 'Configure how you receive updates and alerts',
    },
    {
      title: 'Appearance',
      icon: Palette,
      description: 'Customize the look and feel of your dashboard',
    },
    {
      title: 'Privacy & Security',
      icon: Shield,
      description: 'Control your privacy and security settings',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-foreground">Settings</h2>
        <p className="text-muted-foreground">Customize your dashboard experience</p>
      </div>

      {/* Settings Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {settingsSections.map((section) => {
          const Icon = section.icon;
          
          return (
            <Card key={section.title} className="bg-card border-border hover:scale-105 transition-transform duration-200">
              <CardHeader>
                <CardTitle className="text-foreground flex items-center space-x-3">
                  <div className="p-2 rounded-lg bg-primary">
                    <Icon className="w-5 h-5 text-primary-foreground" />
                  </div>
                  <span>{section.title}</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground text-sm mb-4">{section.description}</p>
                <Button variant="outline" className="border-border text-foreground hover:bg-accent">
                  Configure
                </Button>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Quick Actions */}
      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="text-foreground flex items-center space-x-2">
            <Settings className="w-5 h-5" />
            <span>Quick Actions</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-wrap gap-4">
            <Button variant="outline" className="border-border text-foreground hover:bg-accent">
              Export Data
            </Button>
            <Button variant="outline" className="border-border text-foreground hover:bg-accent">
              Reset Preferences
            </Button>
            <Button variant="outline" className="border-destructive text-destructive hover:bg-destructive/10">
              Delete Account
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
