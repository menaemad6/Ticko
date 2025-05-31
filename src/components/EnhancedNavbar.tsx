
import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Home, CreditCard, BarChart3, GraduationCap, User, Moon } from 'lucide-react';

const EnhancedNavbar = () => {
  return (
    <nav className="relative z-50 flex items-center justify-between px-8 py-4 border-b border-gray-800/30 backdrop-blur-xl bg-gray-900/10">
      {/* Logo section */}
      <div className="flex items-center space-x-3">
        <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-blue-600 rounded-lg flex items-center justify-center shadow-lg shadow-purple-500/25 relative">
          <div className="w-4 h-4 bg-white rounded-sm"></div>
        </div>
        <span className="text-xl font-bold bg-gradient-to-r from-white to-purple-200 bg-clip-text text-transparent">
          Spectram
        </span>
        <Badge variant="outline" className="text-xs bg-gray-800/50 border-gray-600 text-gray-300">®</Badge>
      </div>
      
      {/* Navigation items */}
      <div className="hidden md:flex items-center space-x-1">
        <Button variant="ghost" size="sm" className="text-gray-300 hover:text-white hover:bg-gray-800/50 transition-all duration-300 flex items-center space-x-2">
          <Home className="w-4 h-4" />
          <span>Home</span>
        </Button>
        <Button variant="ghost" size="sm" className="text-gray-300 hover:text-white hover:bg-gray-800/50 transition-all duration-300 flex items-center space-x-2">
          <GraduationCap className="w-4 h-4" />
          <span>Education</span>
        </Button>
      </div>

      {/* Right section */}
      <div className="flex items-center space-x-4">

        
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-gradient-to-br from-gray-700 to-gray-600 rounded-full flex items-center justify-center shadow-lg">
            <User className="w-4 h-4 text-gray-300" />
          </div>
        </div>
        
        <Button size="sm" className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white shadow-lg shadow-purple-500/25 transition-all duration-300 hover:scale-105">
          Join Now
        </Button>
      </div>
    </nav>
  );
};

export default EnhancedNavbar;
