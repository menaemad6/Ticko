
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowRight, BarChart3, Users, Zap, Shield, Globe, Star, Sparkles, TrendingUp, Lock, Layers, Rocket, Activity } from 'lucide-react';
import { Link } from 'react-router-dom';

const ModernHomepage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-purple-950 text-white overflow-hidden relative">
      {/* Enhanced Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-500/15 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl animate-pulse delay-500"></div>
        <div className="absolute top-20 right-20 w-32 h-32 bg-cyan-400/10 rounded-full blur-2xl animate-bounce"></div>
        <div className="absolute bottom-20 left-20 w-24 h-24 bg-pink-400/10 rounded-full blur-2xl animate-bounce delay-700"></div>
        
        {/* Floating particles */}
        <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-purple-400 rounded-full animate-ping"></div>
        <div className="absolute top-3/4 right-1/4 w-1 h-1 bg-blue-400 rounded-full animate-ping delay-300"></div>
        <div className="absolute top-1/2 left-3/4 w-1.5 h-1.5 bg-cyan-400 rounded-full animate-ping delay-700"></div>
      </div>

      {/* Navigation with glass effect */}
      <nav className="relative z-50 flex items-center justify-between px-6 py-4 border-b border-gray-800/50 backdrop-blur-lg bg-gray-900/20">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-blue-600 rounded-lg flex items-center justify-center shadow-lg shadow-purple-500/25">
            <Zap className="w-5 h-5 text-white" />
          </div>
          <span className="text-xl font-bold bg-gradient-to-r from-white to-purple-200 bg-clip-text text-transparent">Taskaty</span>
          <span className="text-xs bg-purple-500/30 text-purple-300 px-2 py-1 rounded-full backdrop-blur-sm border border-purple-400/20">®</span>
        </div>
        
        <div className="hidden md:flex items-center space-x-8">
          <a href="#" className="text-gray-300 hover:text-white transition-all duration-300 flex items-center space-x-2 hover:scale-105">
            <Globe className="w-4 h-4" />
            <span>Home</span>
          </a>
          <a href="#" className="text-gray-300 hover:text-white transition-all duration-300 flex items-center space-x-2 hover:scale-105">
            <BarChart3 className="w-4 h-4" />
            <span>Analytics</span>
          </a>
          <a href="#" className="text-gray-300 hover:text-white transition-all duration-300 flex items-center space-x-2 hover:scale-105">
            <Users className="w-4 h-4" />
            <span>Team</span>
          </a>
          <a href="#" className="text-gray-300 hover:text-white transition-all duration-300 flex items-center space-x-2 hover:scale-105">
            <Shield className="w-4 h-4" />
            <span>Security</span>
          </a>
        </div>

        <div className="flex items-center space-x-4">
          <div className="w-8 h-8 bg-gradient-to-br from-gray-700 to-gray-600 rounded-full flex items-center justify-center shadow-lg">
            <span className="text-sm">👤</span>
          </div>
          <span className="text-sm text-gray-300 bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent font-semibold">+Pro</span>
          <Button variant="outline" size="sm" className="bg-gradient-to-r from-purple-600 to-blue-600 border-purple-500 text-white hover:from-purple-700 hover:to-blue-700 shadow-lg shadow-purple-500/25 transition-all duration-300 hover:scale-105">
            Join Now
          </Button>
        </div>
      </nav>

      {/* Enhanced Hero Section */}
      <div className="relative z-10 max-w-6xl mx-auto px-6 pt-20 pb-16">
        <div className="text-center space-y-8">
          <div className="flex justify-center mb-4">
            <div className="flex items-center space-x-2 bg-gradient-to-r from-purple-500/20 to-blue-500/20 backdrop-blur-sm border border-purple-500/30 rounded-full px-4 py-2">
              <Sparkles className="w-4 h-4 text-purple-400 animate-pulse" />
              <span className="text-sm text-purple-300">✨ Now with AI-powered automation</span>
            </div>
          </div>

          <h1 className="text-5xl md:text-7xl font-bold leading-tight animate-fade-in">
            <span className="text-gray-400">Pre-built method for</span>
            <br />
            <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent animate-pulse">
              Task Performance
            </span>
          </h1>
          
          <p className="text-xl text-gray-400 max-w-3xl mx-auto leading-relaxed animate-fade-in delay-200">
            Task performance is a complete evaluation of standing in categories such
            as efficiency, productivity, collaboration, timeline management, and overall profitability.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-8 animate-fade-in delay-400">
            <Button className="bg-gray-800/80 hover:bg-gray-700 text-white border border-gray-700 px-6 py-3 backdrop-blur-sm transition-all duration-300 hover:scale-105 hover:shadow-lg">
              Join Web 3 Community
            </Button>
            <Link to="/canvas">
              <Button className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white px-8 py-3 rounded-full shadow-lg shadow-purple-500/25 transition-all duration-300 hover:scale-105 hover:shadow-purple-500/40">
                Try it now!
                <Rocket className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          </div>

          <div className="pt-4 animate-fade-in delay-600">
            <p className="text-gray-400 text-sm">
              Try our demo of dashboard now! • 
              <span className="text-purple-400 hover:text-purple-300 cursor-pointer ml-1 transition-all duration-300 hover:scale-105 inline-flex items-center">
                Learn more <ArrowRight className="inline w-4 h-4 ml-1" />
              </span>
            </p>
          </div>
        </div>

        {/* Enhanced Tags with animations */}
        <div className="flex justify-center gap-3 mt-12 animate-fade-in delay-800">
          <span className="bg-gray-800/50 border border-gray-700 px-4 py-2 rounded-full text-sm text-gray-300 backdrop-blur-sm hover:scale-105 transition-all duration-300 hover:bg-gray-700/50">
            🏗️ Pre-built
          </span>
          <span className="bg-gray-800/50 border border-gray-700 px-4 py-2 rounded-full text-sm text-gray-300 backdrop-blur-sm hover:scale-105 transition-all duration-300 hover:bg-gray-700/50">
            ⚡ Run
          </span>
          <span className="bg-purple-500/20 border border-purple-500/30 px-4 py-2 rounded-full text-sm text-purple-300 backdrop-blur-sm hover:scale-105 transition-all duration-300 hover:bg-purple-500/30 shadow-lg shadow-purple-500/20">
            Data-Driven (D2)
          </span>
          <span className="bg-gray-800/50 border border-gray-700 px-4 py-2 rounded-full text-sm text-gray-300 backdrop-blur-sm hover:scale-105 transition-all duration-300 hover:bg-gray-700/50">
            Dashboard
          </span>
        </div>

        {/* Enhanced Dashboard Preview */}
        <div className="mt-16 relative animate-fade-in delay-1000">
          <Card className="bg-gray-900/50 border-gray-800 backdrop-blur-lg shadow-2xl shadow-purple-500/10 hover:shadow-purple-500/20 transition-all duration-500 hover:scale-[1.02]">
            <CardContent className="p-0">
              {/* Browser tabs mockup */}
              <div className="flex items-center justify-between p-4 border-b border-gray-800">
                <div className="flex items-center space-x-3">
                  <div className="flex space-x-2">
                    <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
                    <div className="w-3 h-3 bg-yellow-500 rounded-full animate-pulse delay-100"></div>
                    <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse delay-200"></div>
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

              <div className="p-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
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

                <div className="lg:col-span-2 space-y-6">
                  <div className="flex items-center justify-between">
                    <h2 className="text-lg font-semibold flex items-center">
                      👁️ Overview
                      <Button variant="ghost" size="sm" className="ml-2 text-xs hover:bg-purple-500/20">
                        + Add Keyword
                      </Button>
                    </h2>
                    <div className="flex items-center space-x-2 text-sm text-gray-400">
                      <span>All Tags</span>
                      <span>Sep 24 → Oct 16</span>
                    </div>
                  </div>

                  <Card className="bg-gradient-to-br from-gray-800/30 to-gray-700/20 border-gray-700 backdrop-blur-sm">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between mb-4">
                        <div>
                          <h3 className="text-purple-400 font-semibold">Bitcoin</h3>
                          <p className="text-2xl font-bold">$5,546</p>
                        </div>
                        <div className="flex items-center space-x-4">
                          <select className="bg-gray-700/80 border-gray-600 rounded px-3 py-1 text-sm backdrop-blur-sm">
                            <option>Eco</option>
                          </select>
                          <select className="bg-gray-700/80 border-gray-600 rounded px-3 py-1 text-sm backdrop-blur-sm">
                            <option>Schedule</option>
                          </select>
                          <Button size="sm" className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 shadow-lg">
                            Send
                          </Button>
                        </div>
                      </div>
                      
                      <div className="h-32 bg-gradient-to-r from-purple-500/20 via-pink-500/20 to-blue-500/20 rounded relative overflow-hidden backdrop-blur-sm">
                        <svg className="w-full h-full" viewBox="0 0 400 120">
                          <path
                            d="M0,80 Q100,60 200,70 T400,50"
                            stroke="url(#gradient)"
                            strokeWidth="3"
                            fill="none"
                            className="animate-pulse"
                          />
                          <defs>
                            <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                              <stop offset="0%" stopColor="#8b5cf6" />
                              <stop offset="50%" stopColor="#ec4899" />
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
                            <Button size="sm" variant="ghost" className="text-xs hover:bg-purple-500/20">💳 Wallet</Button>
                            <Button size="sm" variant="ghost" className="text-xs hover:bg-purple-500/20">🔄 Recent</Button>
                            <Button size="sm" variant="ghost" className="text-xs hover:bg-purple-500/20">📝 Edit</Button>
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

        {/* Enhanced Feature highlights with modern cards */}
        <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-8 animate-fade-in delay-1200">
          <Card className="bg-gradient-to-br from-purple-900/30 to-purple-800/20 border-purple-700/50 backdrop-blur-lg hover:shadow-2xl hover:shadow-purple-500/25 transition-all duration-500 hover:scale-105 group">
            <CardContent className="p-6 text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-500/30 to-purple-600/20 rounded-2xl flex items-center justify-center mx-auto mb-4 backdrop-blur-sm group-hover:scale-110 transition-all duration-300">
                <BarChart3 className="w-8 h-8 text-purple-400" />
              </div>
              <h3 className="text-lg font-semibold mb-2 bg-gradient-to-r from-white to-purple-200 bg-clip-text text-transparent">Advanced Analytics</h3>
              <p className="text-gray-400 text-sm leading-relaxed">
                Real-time performance tracking with comprehensive insights and data visualization.
              </p>
              <div className="mt-4 flex items-center justify-center space-x-2">
                <TrendingUp className="w-4 h-4 text-purple-400" />
                <span className="text-xs text-purple-300">Real-time insights</span>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-blue-900/30 to-blue-800/20 border-blue-700/50 backdrop-blur-lg hover:shadow-2xl hover:shadow-blue-500/25 transition-all duration-500 hover:scale-105 group">
            <CardContent className="p-6 text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500/30 to-blue-600/20 rounded-2xl flex items-center justify-center mx-auto mb-4 backdrop-blur-sm group-hover:scale-110 transition-all duration-300">
                <Users className="w-8 h-8 text-blue-400" />
              </div>
              <h3 className="text-lg font-semibold mb-2 bg-gradient-to-r from-white to-blue-200 bg-clip-text text-transparent">Team Collaboration</h3>
              <p className="text-gray-400 text-sm leading-relaxed">
                Seamless teamwork with shared workspaces and real-time collaboration tools.
              </p>
              <div className="mt-4 flex items-center justify-center space-x-2">
                <Activity className="w-4 h-4 text-blue-400" />
                <span className="text-xs text-blue-300">Live collaboration</span>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-green-900/30 to-emerald-800/20 border-green-700/50 backdrop-blur-lg hover:shadow-2xl hover:shadow-green-500/25 transition-all duration-500 hover:scale-105 group">
            <CardContent className="p-6 text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-green-500/30 to-emerald-600/20 rounded-2xl flex items-center justify-center mx-auto mb-4 backdrop-blur-sm group-hover:scale-110 transition-all duration-300">
                <Zap className="w-8 h-8 text-green-400" />
              </div>
              <h3 className="text-lg font-semibold mb-2 bg-gradient-to-r from-white to-green-200 bg-clip-text text-transparent">Lightning Fast</h3>
              <p className="text-gray-400 text-sm leading-relaxed">
                Optimized performance with instant loading and responsive interactions.
              </p>
              <div className="mt-4 flex items-center justify-center space-x-2">
                <Layers className="w-4 h-4 text-green-400" />
                <span className="text-xs text-green-300">Instant performance</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Additional modern stats section */}
        <div className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-6 animate-fade-in delay-1400">
          <div className="text-center p-6 bg-gradient-to-br from-gray-800/50 to-gray-700/30 rounded-2xl backdrop-blur-sm border border-gray-700/50 hover:scale-105 transition-all duration-300">
            <div className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent mb-2">99.9%</div>
            <div className="text-sm text-gray-400">Uptime</div>
          </div>
          <div className="text-center p-6 bg-gradient-to-br from-gray-800/50 to-gray-700/30 rounded-2xl backdrop-blur-sm border border-gray-700/50 hover:scale-105 transition-all duration-300">
            <div className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent mb-2">10k+</div>
            <div className="text-sm text-gray-400">Users</div>
          </div>
          <div className="text-center p-6 bg-gradient-to-br from-gray-800/50 to-gray-700/30 rounded-2xl backdrop-blur-sm border border-gray-700/50 hover:scale-105 transition-all duration-300">
            <div className="text-3xl font-bold bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent mb-2">500ms</div>
            <div className="text-sm text-gray-400">Response Time</div>
          </div>
          <div className="text-center p-6 bg-gradient-to-br from-gray-800/50 to-gray-700/30 rounded-2xl backdrop-blur-sm border border-gray-700/50 hover:scale-105 transition-all duration-300">
            <div className="text-3xl font-bold bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent mb-2">24/7</div>
            <div className="text-sm text-gray-400">Support</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModernHomepage;
