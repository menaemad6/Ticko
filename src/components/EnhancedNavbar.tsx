
import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Home, Layout, BarChart3 } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import ProfileCard from './ProfileCard';

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
        <img src="/Ticko-Logo.png" alt="Ticko Logo" className="w-12 h-12 rounded-lg shadow-lg" />
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
          <ProfileCard user={user} onSignOut={handleSignOut}>
            <Button variant="ghost" size="icon" className="rounded-full p-0 hover:bg-gray-800/50 transition-all duration-300">
              <Avatar>
                <AvatarFallback>{user.email ? user.email[0].toUpperCase() : 'U'}</AvatarFallback>
              </Avatar>
            </Button>
          </ProfileCard>
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
