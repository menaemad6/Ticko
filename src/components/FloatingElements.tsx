
import React from 'react';
import { Star, Sparkles, Zap, Globe, Shield, Lock } from 'lucide-react';

const FloatingElements = () => {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {/* Large floating shapes */}
      <div className="absolute top-20 left-10 w-4 h-4 bg-purple-500/30 rounded-full animate-bounce delay-1000"></div>
      <div className="absolute top-40 right-20 w-3 h-3 bg-blue-400/40 rounded-full animate-ping delay-500"></div>
      <div className="absolute bottom-32 left-1/4 w-2 h-2 bg-cyan-400/50 rounded-full animate-pulse delay-700"></div>
      <div className="absolute top-1/3 right-1/3 w-5 h-5 bg-pink-400/20 rounded-full animate-bounce delay-300"></div>
      
      {/* Floating icons */}
      <div className="absolute top-1/4 left-1/6 animate-float">
        <Star className="w-6 h-6 text-purple-400/60 animate-pulse" />
      </div>
      <div className="absolute top-3/4 right-1/6 animate-float delay-1000">
        <Sparkles className="w-5 h-5 text-blue-400/50 animate-spin slow" />
      </div>
      <div className="absolute top-1/2 left-3/4 animate-float delay-500">
        <Zap className="w-4 h-4 text-cyan-400/60 animate-pulse delay-200" />
      </div>
      <div className="absolute bottom-1/4 left-1/2 animate-float delay-700">
        <Globe className="w-6 h-6 text-purple-300/40 animate-spin slow delay-500" />
      </div>
      <div className="absolute top-1/6 right-1/2 animate-float delay-300">
        <Shield className="w-5 h-5 text-pink-400/50 animate-pulse delay-700" />
      </div>
      <div className="absolute bottom-1/3 right-1/4 animate-float delay-900">
        <Lock className="w-4 h-4 text-blue-300/60 animate-bounce delay-400" />
      </div>
      
      {/* Geometric shapes */}
      <div className="absolute top-1/5 left-2/3 w-8 h-8 border border-purple-400/20 rounded-lg rotate-45 animate-spin slow"></div>
      <div className="absolute bottom-1/5 left-1/5 w-6 h-6 border border-blue-400/30 rounded-full animate-ping delay-1000"></div>
      <div className="absolute top-2/3 right-1/5 w-4 h-4 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rotate-12 animate-pulse delay-600"></div>
      
      {/* Grid pattern */}
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 opacity-10">
        <div className="grid grid-cols-8 gap-4 h-full">
          {Array.from({ length: 64 }).map((_, i) => (
            <div key={i} className="w-1 h-1 bg-purple-400 rounded-full animate-pulse" style={{ animationDelay: `${i * 50}ms` }}></div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FloatingElements;
