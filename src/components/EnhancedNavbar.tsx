
import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Home, Layout, User, LogOut, BarChart3 } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';

const EnhancedNavbar = () => {
  const { user, loading, signOut } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
    navigate('/auth');
  };

  return (
    <nav className="relative z-50 flex items-center justify-between px-8 py-4 border-b border-gray-800/30 backdrop-blur-xl bg-gray-900/10">
      {/* Logo section */}
      <div className="flex items-center space-x-3">
        <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-blue-600 rounded-lg flex items-center justify-center shadow-lg shadow-purple-500/25 relative">
          <div className="w-4 h-4 bg-white rounded-sm"></div>
        </div>
        <span className="text-xl font-bold bg-gradient-to-r from-white to-purple-200 bg-clip-text text-transparent">
          Ticko
        </span>
        <Badge variant="outline" className="text-xs bg-gray-800/50 border-gray-600 text-gray-300">®</Badge>
      </div>
      
      {/* Navigation items */}
      <div className="hidden md:flex items-center space-x-1">
        <Link to="/">
          <Button variant="ghost" size="sm" className="text-gray-300 hover:text-white hover:bg-gray-800/50 transition-all duration-300 flex items-center space-x-2">
            <Home className="w-4 h-4" />
            <span>Home</span>
          </Button>
        </Link>
        {user && (
          <>
            <Link to="/dashboard">
              <Button variant="ghost" size="sm" className="text-gray-300 hover:text-white hover:bg-gray-800/50 transition-all duration-300 flex items-center space-x-2">
                <BarChart3 className="w-4 h-4" />
                <span>Dashboard</span>
              </Button>
            </Link>
            <Link to="/canvas">
              <Button variant="ghost" size="sm" className="text-gray-300 hover:text-white hover:bg-gray-800/50 transition-all duration-300 flex items-center space-x-2">
                <Layout className="w-4 h-4" />
                <span>Canvas</span>
              </Button>
            </Link>
          </>
        )}
      </div>

      {/* Right section */}
      <div className="flex items-center space-x-4">
        {user ? (
          <div className="relative group">
            <Button variant="ghost" size="icon" className="rounded-full p-0">
              <Avatar>
                <AvatarFallback>{user.email ? user.email[0].toUpperCase() : 'U'}</AvatarFallback>
              </Avatar>
            </Button>
            <div className="absolute right-0 mt-2 w-48 bg-gray-900 border border-gray-700 rounded-lg shadow-lg py-2 opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 transition-opacity duration-200 z-50">
              <div className="px-4 py-2 text-sm text-gray-200 border-b border-gray-800">{user.email}</div>
              <button onClick={handleSignOut} className="w-full flex items-center px-4 py-2 text-sm text-gray-300 hover:bg-gray-800 transition-all">
                <LogOut className="w-4 h-4 mr-2" /> Sign Out
              </button>
            </div>
          </div>
        ) : (
          <Button size="sm" className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white shadow-lg shadow-purple-500/25 transition-all duration-300 hover:scale-105" asChild>
            <Link to="/auth">Join Now</Link>
          </Button>
        )}
      </div>
    </nav>
  );
};

export default EnhancedNavbar;
