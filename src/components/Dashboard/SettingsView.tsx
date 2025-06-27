
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
      color: 'bg-blue-500/20',
    },
    {
      title: 'Notifications',
      icon: Bell,
      description: 'Configure how you receive updates and alerts',
      color: 'bg-yellow-500/20',
    },
    {
      title: 'Appearance',
      icon: Palette,
      description: 'Customize the look and feel of your dashboard',
      color: 'bg-purple-500/20',
    },
    {
      title: 'Privacy & Security',
      icon: Shield,
      description: 'Control your privacy and security settings',
      color: 'bg-green-500/20',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-white">Settings</h2>
        <p className="text-purple-200">Customize your dashboard experience</p>
      </div>

      {/* Settings Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {settingsSections.map((section) => {
          const Icon = section.icon;
          
          return (
            <Card key={section.title} className="bg-gradient-to-br from-slate-800/50 to-purple-800/20 border-purple-800/30 backdrop-blur-xl hover:scale-105 transition-transform duration-200">
              <CardHeader>
                <CardTitle className="text-white flex items-center space-x-3">
                  <div className={`p-2 rounded-lg ${section.color}`}>
                    <Icon className="w-5 h-5 text-white" />
                  </div>
                  <span>{section.title}</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-300 text-sm mb-4">{section.description}</p>
                <Button variant="outline" className="border-purple-600/30 text-purple-200 hover:bg-purple-800/30">
                  Configure
                </Button>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Quick Actions */}
      <Card className="bg-gradient-to-br from-slate-800/50 to-purple-800/20 border-purple-800/30 backdrop-blur-xl">
        <CardHeader>
          <CardTitle className="text-white flex items-center space-x-2">
            <Settings className="w-5 h-5" />
            <span>Quick Actions</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-wrap gap-4">
            <Button variant="outline" className="border-purple-600/30 text-purple-200 hover:bg-purple-800/30">
              Export Data
            </Button>
            <Button variant="outline" className="border-purple-600/30 text-purple-200 hover:bg-purple-800/30">
              Reset Preferences
            </Button>
            <Button variant="outline" className="border-red-600/30 text-red-200 hover:bg-red-800/30">
              Delete Account
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
