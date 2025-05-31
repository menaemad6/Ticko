import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowRight, Rocket } from 'lucide-react';
import { Link } from 'react-router-dom';
import EnhancedNavbar from './EnhancedNavbar';
import FloatingElements from './FloatingElements';
import FeatureSections from './FeatureSections';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';

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
        
        {/* Enhanced grid overlay */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(139,92,246,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(139,92,246,0.03)_1px,transparent_1px)] bg-[size:50px_50px]"></div>
      </div>

      {/* Floating Elements */}
      <FloatingElements />

      {/* Enhanced Navigation */}
      <EnhancedNavbar />

      {/* Enhanced Hero Section */}
      <div className="relative z-10 max-w-6xl mx-auto px-6 pt-20 pb-16">
        <div className="text-center space-y-8">
          <h1 className="text-5xl md:text-7xl font-bold leading-tight animate-fade-in">
            <span className="text-gray-400">Pre-built method for</span>
            <br />
            <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent animate-pulse">
              Payment Performance
            </span>
          </h1>
          
          <p className="text-xl text-gray-400 max-w-3xl mx-auto leading-relaxed animate-fade-in delay-200">
            Financial performance is a complete evaluation of standing in categories such
            as assets, liabilities, expenses, revenue, and overall profitability.
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
        <div className="flex justify-center mt-12 animate-fade-in delay-800">
          <div className="w-full max-w-xl px-2 sm:px-0">
            <div className="rounded-3xl bg-white/10 border border-white/10 p-4 sm:p-6 shadow-lg backdrop-blur-md w-full">
              <Tabs defaultValue="prebuilt" className="w-full">
                <TabsList className="w-full flex rounded-2xl bg-white/5 border border-white/10 p-1 mb-4 gap-2">
                  <TabsTrigger value="prebuilt" className="flex-1 rounded-xl text-base font-semibold text-white py-3 px-2 sm:py-4 sm:px-0 transition-all data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-500 data-[state=active]:via-pink-500 data-[state=active]:to-blue-500 data-[state=active]:text-white data-[state=active]:shadow-lg data-[state=active]:scale-105">Pre-built</TabsTrigger>
                  <TabsTrigger value="run" className="flex-1 rounded-xl text-base font-semibold text-white py-3 px-2 sm:py-4 sm:px-0 transition-all data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:via-cyan-400 data-[state=active]:to-purple-500 data-[state=active]:text-white data-[state=active]:shadow-lg data-[state=active]:scale-105">Run</TabsTrigger>
                  <TabsTrigger value="d2" className="flex-1 rounded-xl text-base font-semibold text-white py-3 px-2 sm:py-4 sm:px-0 transition-all data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-700 data-[state=active]:via-pink-600 data-[state=active]:to-blue-700 data-[state=active]:text-white data-[state=active]:shadow-lg data-[state=active]:scale-105">Data (D2)</TabsTrigger>
                  <TabsTrigger value="dashboard" className="flex-1 rounded-xl text-base font-semibold text-white py-3 px-2 sm:py-4 sm:px-0 transition-all data-[state=active]:bg-gradient-to-r data-[state=active]:from-gray-800 data-[state=active]:via-gray-700 data-[state=active]:to-purple-800 data-[state=active]:text-white data-[state=active]:shadow-lg data-[state=active]:scale-105">Dashboard</TabsTrigger>
                </TabsList>
                <TabsContent value="prebuilt">
                  <div className="rounded-2xl bg-white/5 p-5 sm:p-7 text-center text-base text-white border border-white/10">
                    <strong>Pre-built:</strong> Ready-to-use modules and templates to accelerate your workflow and reduce setup time.
                  </div>
                </TabsContent>
                <TabsContent value="run">
                  <div className="rounded-2xl bg-white/5 p-5 sm:p-7 text-center text-base text-white border border-white/10">
                    <strong>Run:</strong> Lightning-fast execution and seamless integration for instant productivity.
                  </div>
                </TabsContent>
                <TabsContent value="d2">
                  <div className="rounded-2xl bg-white/5 p-5 sm:p-7 text-center text-base text-white border border-white/10">
                    <strong>Data-Driven (D2):</strong> Make smarter decisions with analytics and insights powered by real-time data.
                  </div>
                </TabsContent>
                <TabsContent value="dashboard">
                  <div className="rounded-2xl bg-white/5 p-5 sm:p-7 text-center text-base text-white border border-white/10">
                    <strong>Dashboard:</strong> Visualize, track, and manage everything in one simple, unified interface.
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          </div>
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
                  <div className="text-sm text-gray-400">dash.spectram.com</div>
                </div>
                <div className="flex items-center space-x-2 text-xs text-gray-500">
                  <span>🔒</span>
                  <span>(1) SEO By The...</span>
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
      </div>

      {/* Feature Sections */}
      <div className="relative z-10 max-w-6xl mx-auto px-6">
        <FeatureSections />
      </div>
    </div>
  );
};

export default ModernHomepage;
