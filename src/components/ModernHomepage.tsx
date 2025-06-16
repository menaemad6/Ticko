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
        <div className="text-center space-y-6 sm:space-y-8">  
          <h1 className="animate-fade-in">  
            <span className="text-3xl sm:text-4xl md:text-5xl lg:text-7xl font-bold leading-tight bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent animate-pulse block">  
              REVOLUTIONIZE YOUR WORKFLOW  
            </span>  
            <span className="text-xl sm:text-2xl md:text-3xl lg:text-5xl text-gray-300 mt-2 block">with <span className="text-purple-400">Ticko</span></span>  
          </h1>
          
          <p className="text-xl text-gray-400 max-w-3xl mx-auto leading-relaxed animate-fade-in delay-200">
            The next-generation, AI-powered platform for visual task and project management. Plan, track, and optimize your work with drag-and-drop canvases, smart analytics, and customizable workflows. No coding required.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-8 animate-fade-in delay-400">
            <Button className="bg-gray-800/80 hover:bg-gray-700 text-white border border-gray-700 px-6 py-3 backdrop-blur-sm transition-all duration-300 hover:scale-105 hover:shadow-lg">
              Get Started Free
            </Button>
            <Link to="/canvas">
              <Button className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white px-8 py-3 rounded-full shadow-lg shadow-purple-500/25 transition-all duration-300 hover:scale-105 hover:shadow-purple-500/40">
                Try the Canvas
                <Rocket className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          </div>

          <div className="pt-4 animate-fade-in delay-600">
            <p className="text-gray-400 text-sm">
              Visualize your workflow, automate repetitive tasks, and unlock insights with AI. <span className="text-purple-400 hover:text-purple-300 cursor-pointer ml-1 transition-all duration-300 hover:scale-105 inline-flex items-center">Learn more <ArrowRight className="inline w-4 h-4 ml-1" /></span>
            </p>
          </div>
        </div>

        {/* Enhanced Tags with animations */}
        {/* <div className="flex justify-center mt-8 sm:mt-12 animate-fade-in delay-800">  
          <div className="w-full max-w-xl px-2 sm:px-0">  
            <div className="rounded-3xl bg-white/10 border border-white/10 p-4 sm:p-6 shadow-lg backdrop-blur-md w-full">  
              <Tabs defaultValue="features" className="w-full">  
                <TabsList className="w-full grid grid-cols-2 md:flex md:flex-row rounded-2xl bg-white/5 border border-white/10 p-1 mb-4 gap-2">  
                  <TabsTrigger value="features" className="rounded-xl text-sm sm:text-base font-semibold text-white py-2 sm:py-3 px-1 sm:px-2 transition-all data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-500 data-[state=active]:via-pink-500 data-[state=active]:to-blue-500 data-[state=active]:text-white data-[state=active]:shadow-lg data-[state=active]:scale-105">Features</TabsTrigger>  
                  <TabsTrigger value="templates" className="rounded-xl text-sm sm:text-base font-semibold text-white py-2 sm:py-3 px-1 sm:px-2 transition-all data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:via-cyan-400 data-[state=active]:to-purple-500 data-[state=active]:text-white data-[state=active]:shadow-lg data-[state=active]:scale-105">Templates</TabsTrigger>  
                  <TabsTrigger value="analytics" className="rounded-xl text-sm sm:text-base font-semibold text-white py-2 sm:py-3 px-1 sm:px-2 transition-all data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-700 data-[state=active]:via-pink-600 data-[state=active]:to-blue-700 data-[state=active]:text-white data-[state=active]:shadow-lg data-[state=active]:scale-105">Analytics</TabsTrigger>  
                  <TabsTrigger value="customization" className="rounded-xl text-sm sm:text-base font-semibold text-white py-2 sm:py-3 px-1 sm:px-2 transition-all data-[state=active]:bg-gradient-to-r data-[state=active]:from-gray-800 data-[state=active]:via-gray-700 data-[state=active]:to-purple-800 data-[state=active]:text-white data-[state=active]:shadow-lg data-[state=active]:scale-105">Customization</TabsTrigger>  
                </TabsList>
                <TabsContent value="features">
                  <div className="rounded-2xl bg-white/5 p-5 sm:p-7 text-center text-base text-white border border-white/10">
                    <strong>Visual Task Canvas:</strong> Drag-and-drop tasks, milestones, and notes. <br />
                    <strong>Bulk Actions:</strong> Create, archive, and manage tasks at scale. <br />
                    <strong>AI-Powered Insights:</strong> Predictive analytics and smart suggestions.
                  </div>
                </TabsContent>
                <TabsContent value="templates">
                  <div className="rounded-2xl bg-white/5 p-5 sm:p-7 text-center text-base text-white border border-white/10">
                    <strong>Workflow Templates:</strong> Sprint Planning, Project Roadmap, Bug Tracking, Feature Development, and more.
                  </div>
                </TabsContent>
                <TabsContent value="analytics">
                  <div className="rounded-2xl bg-white/5 p-5 sm:p-7 text-center text-base text-white border border-white/10">
                    <strong>Project Analytics:</strong> Real-time dashboards, performance metrics, and reporting.
                  </div>
                </TabsContent>
                <TabsContent value="customization">
                  <div className="rounded-2xl bg-white/5 p-5 sm:p-7 text-center text-base text-white border border-white/10">
                    <strong>Infinite Customization:</strong> Personalize your workspace, automate with AI, and integrate your brand.
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </div> */}

        {/* Canvas Demo Image */}
        <div className="mt-16 relative animate-fade-in delay-1000">
          <Card className="bg-gray-900/50 border-gray-800 backdrop-blur-lg shadow-2xl shadow-purple-500/10 hover:shadow-purple-500/20 transition-all duration-500 hover:scale-[1.02] overflow-hidden">
            <CardContent className="p-0">
              <div className="relative">
                <img 
                  src="/canvas-demo.png" 
                  alt="Ticko Canvas Demo" 
                  className="w-full h-auto object-cover rounded-lg shadow-lg" 
                />
                <div className="absolute inset-0 bg-gradient-to-t from-gray-900/70 to-transparent flex items-end justify-center pb-6">
                  <Button className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white px-8 py-3 rounded-full shadow-lg shadow-purple-500/25 transition-all duration-300 hover:scale-105 hover:shadow-purple-500/40">
                    Explore the Canvas
                    <Rocket className="w-4 h-4 ml-2" />
                  </Button>
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
