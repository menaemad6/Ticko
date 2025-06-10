
import React, { useEffect, useState } from 'react';
import { CheckCircle, Star, Sparkles, Trophy } from 'lucide-react';
import { cn } from '@/lib/utils';

interface CelebrationEffectsProps {
  show: boolean;
  onComplete?: () => void;
  type?: 'task-complete' | 'milestone' | 'achievement';
}

export default function CelebrationEffects({ show, onComplete, type = 'task-complete' }: CelebrationEffectsProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (show) {
      setIsVisible(true);
      const timer = setTimeout(() => {
        setIsVisible(false);
        onComplete?.();
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [show, onComplete]);

  if (!isVisible) return null;

  const getIcon = () => {
    switch (type) {
      case 'milestone':
        return <Trophy className="w-16 h-16 text-yellow-500" />;
      case 'achievement':
        return <Star className="w-16 h-16 text-purple-500" />;
      default:
        return <CheckCircle className="w-16 h-16 text-green-500" />;
    }
  };

  const getMessage = () => {
    switch (type) {
      case 'milestone':
        return 'Milestone Reached! 🎯';
      case 'achievement':
        return 'Achievement Unlocked! ⭐';
      default:
        return 'Task Completed! ✨';
    }
  };

  return (
    <div className="fixed inset-0 pointer-events-none z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/20 animate-fade-in" />
      
      {/* Main celebration */}
      <div className="relative flex flex-col items-center animate-scale-in">
        {/* Icon with bounce */}
        <div className="mb-4 animate-bounce">
          {getIcon()}
        </div>
        
        {/* Message */}
        <div className="text-2xl font-bold text-white bg-gradient-to-r from-green-500 to-blue-500 bg-clip-text text-transparent mb-2">
          {getMessage()}
        </div>
        
        {/* Subtitle */}
        <div className="text-sm text-gray-600 dark:text-gray-300">
          Keep up the great work! 🚀
        </div>
      </div>

      {/* Floating particles */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className={cn(
              "absolute animate-float",
              "w-2 h-2 bg-yellow-400 rounded-full opacity-80"
            )}
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 2}s`,
              animationDuration: `${2 + Math.random() * 2}s`
            }}
          >
            <Sparkles className="w-2 h-2" />
          </div>
        ))}
      </div>

      {/* Confetti effect */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(15)].map((_, i) => (
          <div
            key={i}
            className={cn(
              "absolute w-3 h-3 animate-bounce",
              i % 3 === 0 ? "bg-red-400" : i % 3 === 1 ? "bg-blue-400" : "bg-green-400",
              "rounded-sm opacity-75"
            )}
            style={{
              left: `${20 + Math.random() * 60}%`,
              top: `${10 + Math.random() * 30}%`,
              animationDelay: `${Math.random() * 1}s`,
              animationDuration: `${1 + Math.random() * 1}s`
            }}
          />
        ))}
      </div>
    </div>
  );
}
