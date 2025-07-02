
import React from 'react';
import { User, LogOut, Settings } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { HoverCard, HoverCardContent, HoverCardTrigger } from '@/components/ui/hover-card';

interface ProfileCardProps {
  user: {
    email?: string;
  };
  onSignOut: () => void;
  children: React.ReactNode;
}

const ProfileCard: React.FC<ProfileCardProps> = ({ user, onSignOut, children }) => {
  return (
    <HoverCard>
      <HoverCardTrigger asChild>
        {children}
      </HoverCardTrigger>
      <HoverCardContent className="w-80 p-0" align="end">
        <Card className="border-0 shadow-lg">
          <CardContent className="p-4">
            <div className="flex items-center space-x-4 mb-4">
              <Avatar className="h-12 w-12">
                <AvatarFallback className="bg-gradient-to-r from-purple-600 to-blue-600 text-white font-semibold">
                  {user.email ? user.email[0].toUpperCase() : 'U'}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                  {user.email || 'User'}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Personal Account
                </p>
              </div>
            </div>
            
            <Separator className="my-3" />
            
            <div className="space-y-1">
              <Button 
                variant="ghost" 
                className="w-full justify-start h-9 px-2 text-sm"
                size="sm"
              >
                <User className="w-4 h-4 mr-3" />
                View Profile
              </Button>
              <Button 
                variant="ghost" 
                className="w-full justify-start h-9 px-2 text-sm"
                size="sm"
              >
                <Settings className="w-4 h-4 mr-3" />
                Settings
              </Button>
            </div>
            
            <Separator className="my-3" />
            
            <Button 
              variant="ghost" 
              className="w-full justify-start h-9 px-2 text-sm text-red-600 hover:text-red-700 hover:bg-red-50 dark:text-red-400 dark:hover:text-red-300 dark:hover:bg-red-950"
              size="sm"
              onClick={onSignOut}
            >
              <LogOut className="w-4 h-4 mr-3" />
              Sign Out
            </Button>
          </CardContent>
        </Card>
      </HoverCardContent>
    </HoverCard>
  );
};

export default ProfileCard;
