
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowRight, BarChart3, Users, Zap, Shield, Globe, Star } from 'lucide-react';

const ModernHomepage = () => {
  return (
    <div className="min-h-screen bg-gray-950 text-white overflow-hidden relative">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-purple-600/5 rounded-full blur-3xl"></div>
      </div>

      {/* Navigation */}
      <nav className="relative z-50 flex items-center justify-between px-6 py-4 border-b border-gray-800/50 backdrop-blur-sm">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-blue-600 rounded-lg flex items-center justify-center">
            <Zap className="w-5 h-5 text-white" />
          </div>
          <span className="text-xl font-bold">Taskaty</span>
          <span className="text-xs bg-purple-500/20 text-purple-300 px-2 py-1 rounded-full">®</span>
        </div>
        
        <div className="hidden md:flex items-center space-x-8">
          <a href="#" className="text-gray-300 hover:text-white transition-colors flex items-center space-x-2">
            <Globe className="w-4 h-4" />
            <span>Home</span>
          </a>
          <a href="#" className="text-gray-300 hover:text-white transition-colors flex items-center space-x-2">
            <BarChart3 className="w-4 h-4" />
            <span>Analytics</span>
          </a>
          <a href="#" className="text-gray-300 hover:text-white transition-colors flex items-center space-x-2">
            <Users className="w-4 h-4" />
            <span>Team</span>
          </a>
          <a href="#" className="text-gray-300 hover:text-white transition-colors flex items-center space-x-2">
            <Shield className="w-4 h-4" />
            <span>Security</span>
          </a>
        </div>

        <div className="flex items-center space-x-4">
          <div className="w-8 h-8 bg-gray-700 rounded-full flex items-center justify-center">
            <span className="text-sm">👤</span>
          </div>
          <span className="text-sm text-gray-300">+Pro</span>
          <Button variant="outline" size="sm" className="bg-purple-600 border-purple-500 text-white hover:bg-purple-700">
            Join Now
          </Button>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="relative z-10 max-w-6xl mx-auto px-6 pt-20 pb-16">
        <div className="text-center space-y-8">
          <h1 className="text-5xl md:text-7xl font-bold leading-tight">
            <span className="text-gray-400">Pre-built method for</span>
            <br />
            <span className="bg-gradient-to-r from-purple-400 via-purple-300 to-blue-400 bg-clip-text text-transparent">
              Task Performance
            </span>
          </h1>
          
          <p className="text-xl text-gray-400 max-w-3xl mx-auto leading-relaxed">
            Task performance is a complete evaluation of standing in categories such
            as efficiency, productivity, collaboration, timeline management, and overall profitability.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-8">
            <Button className="bg-gray-800 hover:bg-gray-700 text-white border border-gray-700 px-6 py-3">
              Join Web 3 Community
            </Button>
            <Button className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white px-8 py-3 rounded-full">
              Try it now!
            </Button>
          </div>

          <div className="pt-4">
            <p className="text-gray-400 text-sm">
              Try our demo of dashboard now! • 
              <span className="text-purple-400 hover:text-purple-300 cursor-pointer ml-1">
                Learn more <ArrowRight className="inline w-4 h-4 ml-1" />
              </span>
            </p>
          </div>
        </div>

        {/* Tags */}
        <div className="flex justify-center gap-3 mt-12">
          <span className="bg-gray-800/50 border border-gray-700 px-4 py-2 rounded-full text-sm text-gray-300">
            🏗️ Pre-built
          </span>
          <span className="bg-gray-800/50 border border-gray-700 px-4 py-2 rounded-full text-sm text-gray-300">
            ⚡ Run
          </span>
          <span className="bg-purple-500/20 border border-purple-500/30 px-4 py-2 rounded-full text-sm text-purple-300">
            Data-Driven (D2)
          </span>
          <span className="bg-gray-800/50 border border-gray-700 px-4 py-2 rounded-full text-sm text-gray-300">
            Dashboard
          </span>
        </div>

        {/* Dashboard Preview */}
        <div className="mt-16 relative">
          <Card className="bg-gray-900/50 border-gray-800 backdrop-blur-sm">
            <CardContent className="p-0">
              {/* Browser tabs mockup */}
              <div className="flex items-center justify-between p-4 border-b border-gray-800">
                <div className="flex items-center space-x-3">
                  <div className="flex space-x-2">
                    <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                    <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  </div>
                  <div className="text-sm text-gray-400">dash.taskaty.com</div>
                </div>
                <div className="flex items-center space-x-2 text-xs text-gray-500">
                  <span>🔒</span>
                  <span>(1) Hamlet B...</span>
                  <span>📊 SEO Q4 Rev...</span>
                  <span>📱 (2) Discord E...</span>
                  <span>👁️ Overview</span>
                  <span>+</span>
                </div>
              </div>

              {/* Dashboard content */}
              <div className="p-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left sidebar */}
                <div className="space-y-4">
                  <div className="space-y-2">
                    <h3 className="text-sm text-gray-400">Project</h3>
                    <div className="space-y-1">
                      <div className="text-sm text-gray-300">📊 Quick actions</div>
                      <div className="text-sm text-gray-300">💡 Insight box</div>
                      <div className="text-sm text-gray-400 ml-4">Rank Tracker</div>
                      <div className="text-sm text-purple-400 ml-6">▶ Overview</div>
                      <div className="text-sm text-gray-400 ml-6">Performance</div>
                    </div>
                  </div>
                </div>

                {/* Main content */}
                <div className="lg:col-span-2 space-y-6">
                  <div className="flex items-center justify-between">
                    <h2 className="text-lg font-semibold flex items-center">
                      👁️ Overview
                      <Button variant="ghost" size="sm" className="ml-2 text-xs">
                        + Add Keyword
                      </Button>
                    </h2>
                    <div className="flex items-center space-x-2 text-sm text-gray-400">
                      <span>All Tags</span>
                      <span>Sep 24 → Oct 16</span>
                    </div>
                  </div>

                  {/* Chart area */}
                  <Card className="bg-gray-800/30 border-gray-700">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between mb-4">
                        <div>
                          <h3 className="text-purple-400 font-semibold">Bitcoin</h3>
                          <p className="text-2xl font-bold">$5,546</p>
                        </div>
                        <div className="flex items-center space-x-4">
                          <select className="bg-gray-700 border-gray-600 rounded px-3 py-1 text-sm">
                            <option>Eco</option>
                          </select>
                          <select className="bg-gray-700 border-gray-600 rounded px-3 py-1 text-sm">
                            <option>Schedule</option>
                          </select>
                          <Button size="sm" className="bg-purple-600 hover:bg-purple-700">
                            Send
                          </Button>
                        </div>
                      </div>
                      
                      {/* Mock chart */}
                      <div className="h-32 bg-gradient-to-r from-purple-500/20 to-blue-500/20 rounded relative overflow-hidden">
                        <svg className="w-full h-full" viewBox="0 0 400 120">
                          <path
                            d="M0,80 Q100,60 200,70 T400,50"
                            stroke="url(#gradient)"
                            strokeWidth="2"
                            fill="none"
                          />
                          <defs>
                            <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                              <stop offset="0%" stopColor="#8b5cf6" />
                              <stop offset="100%" stopColor="#3b82f6" />
                            </linearGradient>
                          </defs>
                        </svg>
                      </div>

                      <div className="mt-4 grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-xs text-gray-400">Account Name</p>
                          <p className="text-sm text-white">Bryan Flores (P.I.)</p>
                        </div>
                        <div className="text-right">
                          <div className="flex items-center justify-end space-x-2">
                            <Button size="sm" variant="ghost" className="text-xs">💳 Wallet</Button>
                            <Button size="sm" variant="ghost" className="text-xs">🔄 Recent</Button>
                            <Button size="sm" variant="ghost" className="text-xs">📝 Edit</Button>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Feature highlights */}
        <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-8">
          <Card className="bg-gray-900/30 border-gray-800 backdrop-blur-sm">
            <CardContent className="p-6 text-center">
              <div className="w-12 h-12 bg-purple-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <BarChart3 className="w-6 h-6 text-purple-400" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Advanced Analytics</h3>
              <p className="text-gray-400 text-sm">
                Real-time performance tracking with comprehensive insights and data visualization.
              </p>
            </CardContent>
          </Card>

          <Card className="bg-gray-900/30 border-gray-800 backdrop-blur-sm">
            <CardContent className="p-6 text-center">
              <div className="w-12 h-12 bg-blue-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="w-6 h-6 text-blue-400" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Team Collaboration</h3>
              <p className="text-gray-400 text-sm">
                Seamless teamwork with shared workspaces and real-time collaboration tools.
              </p>
            </CardContent>
          </Card>

          <Card className="bg-gray-900/30 border-gray-800 backdrop-blur-sm">
            <CardContent className="p-6 text-center">
              <div className="w-12 h-12 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Zap className="w-6 h-6 text-green-400" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Lightning Fast</h3>
              <p className="text-gray-400 text-sm">
                Optimized performance with instant loading and responsive interactions.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ModernHomepage;
