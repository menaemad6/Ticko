import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowRight, TrendingUp, Users, Shield, Zap, Globe, Star, Award, Target, Layers, Brain, Rocket, ChartBar, Lock, Sparkles, Trophy, Infinity, Database, CloudLightning, Cpu, Eye, Settings } from 'lucide-react';

const FeatureSections = () => {
  return (
    <div className="space-y-60 mt-60">
      {/* Enhanced Hero Features Grid */}
      <section className="animate-fade-in relative">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-600/5 via-pink-600/5 to-blue-600/5 rounded-[60px] blur-3xl"></div>
        
        <div className="text-center mb-24 relative z-10">
          <div className="inline-flex items-center justify-center p-4 bg-gradient-to-r from-purple-500/10 to-blue-500/10 rounded-full mb-8 backdrop-blur-xl border border-purple-500/20">
            <Sparkles className="w-8 h-8 text-purple-400 mr-3" />
            <span className="text-purple-300 font-medium text-lg">Modern Technology Stack</span>
          </div>
          <h2 className="text-6xl md:text-8xl font-bold mb-12 leading-tight">
            <span className="bg-gradient-to-r from-purple-300 via-pink-300 to-blue-300 bg-clip-text text-transparent">
              Built with
            </span>
            <br />
            <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
              Modern Tools
            </span>
          </h2>
          <p className="text-2xl text-gray-300 max-w-5xl mx-auto leading-relaxed">
            Task Weaver combines the power of React, TypeScript, and Supabase to deliver a modern, scalable task management solution.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 relative z-10">
          {[
            {
              icon: Brain,
              title: "Visual Task Management",
              description: "Intuitive drag-and-drop interface for organizing and managing tasks visually.",
              accent: "from-purple-400 to-violet-500",
              iconBg: "bg-gradient-to-br from-purple-500/30 to-violet-600/20",
              border: "border-purple-400/30",
              features: ["Drag-and-drop interface", "Visual task organization", "Real-time updates"]
            },
            {
              icon: CloudLightning,
              title: "Task Organization",
              description: "Efficiently organize and categorize tasks with customizable labels and priorities.",
              accent: "from-blue-400 to-cyan-500",
              iconBg: "bg-gradient-to-br from-blue-500/30 to-cyan-600/20",
              border: "border-blue-400/30",
              features: ["Custom labels", "Priority levels", "Task categories"]
            },
            {
              icon: Shield,
              title: "Secure & Reliable",
              description: "Built on Supabase for enterprise-grade security and reliability.",
              accent: "from-green-400 to-emerald-500",
              iconBg: "bg-gradient-to-br from-green-500/30 to-emerald-600/20",
              border: "border-green-400/30",
              features: ["Secure authentication", "Data encryption", "Reliable storage"]
            },
            {
              icon: Infinity,
              title: "Scalable Architecture",
              description: "Built to scale with your team's needs using modern web technologies.",
              accent: "from-cyan-400 to-blue-500",
              iconBg: "bg-gradient-to-br from-cyan-500/30 to-blue-600/20",
              border: "border-cyan-400/30",
              features: ["Cloud-based", "Auto-scaling", "High performance"]
            },
            {
              icon: Eye,
              title: "Task Analytics",
              description: "Track progress and gain insights into your team's productivity.",
              accent: "from-pink-400 to-rose-500",
              iconBg: "bg-gradient-to-br from-pink-500/30 to-rose-600/20",
              border: "border-pink-400/30",
              features: ["Progress tracking", "Team insights", "Performance metrics"]
            },
            {
              icon: Cpu,
              title: "Modern Tech Stack",
              description: "Built with React, TypeScript, and Supabase for optimal performance.",
              accent: "from-orange-400 to-red-500",
              iconBg: "bg-gradient-to-br from-orange-500/30 to-red-600/20",
              border: "border-orange-400/30",
              features: ["React & TypeScript", "Supabase backend", "Modern UI/UX"]
            }
          ].map((feature, index) => (
            <div key={index} className="group relative">
              <div className="absolute inset-0 bg-gradient-to-r opacity-0 group-hover:opacity-30 transition-all duration-700 blur-2xl -z-10 rounded-3xl" style={{
                background: `linear-gradient(135deg, ${feature.accent.split(' ')[1]}, ${feature.accent.split(' ')[3]})`
              }}></div>
              
              <div className={`relative backdrop-blur-2xl border ${feature.border} rounded-3xl p-10 h-full transition-all duration-700 hover:scale-[1.02] hover:border-opacity-60 bg-gradient-to-br from-gray-900/40 to-gray-800/20 group-hover:from-gray-900/60 group-hover:to-gray-800/40`}>
                <div className={`w-24 h-24 ${feature.iconBg} rounded-3xl flex items-center justify-center mx-auto mb-8 backdrop-blur-sm group-hover:scale-110 transition-all duration-500 border border-white/10`}>
                  <feature.icon className="w-12 h-12 text-white drop-shadow-lg" />
                </div>
                <h3 className="text-2xl font-bold mb-6 text-white text-center">{feature.title}</h3>
                <p className="text-gray-300 text-center leading-relaxed text-lg mb-8">{feature.description}</p>
                
                <div className="space-y-3">
                  {feature.features.map((feat, featIndex) => (
                    <div key={featIndex} className="flex items-center space-x-3 opacity-0 group-hover:opacity-100 transition-all duration-500 delay-200">
                      <div className={`w-3 h-3 bg-gradient-to-r ${feature.accent} rounded-full animate-pulse`}></div>
                      <span className="text-gray-300 text-sm">{feat}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Enhanced Performance Stats with 3D Effect */}
      <section className="animate-fade-in delay-200 relative">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-600/10 via-pink-600/10 to-blue-600/10 rounded-[60px] blur-3xl"></div>
        
        <div className="relative backdrop-blur-2xl border border-gray-700/30 rounded-[32px] p-6 sm:p-10 md:p-20 bg-gradient-to-br from-gray-900/30 to-gray-800/20">
          <div className="text-center mb-20">
            <div className="inline-flex items-center justify-center p-4 bg-gradient-to-r from-green-500/10 to-blue-500/10 rounded-full mb-8 backdrop-blur-xl border border-green-500/20">
              <Award className="w-8 h-8 text-green-400 mr-3" />
              <span className="text-green-300 font-medium text-lg">Key Benefits</span>
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-7xl font-bold mb-8">
              <span className="bg-gradient-to-r from-green-300 via-blue-300 to-purple-300 bg-clip-text text-transparent">
                Why Choose
              </span>
              <br />
              <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                Task Weaver
              </span>
            </h2>
            <p className="text-gray-300 text-lg sm:text-xl md:text-2xl max-w-4xl mx-auto">Features that make task management easier</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8 md:gap-12">
            {[
              { value: "100%", label: "Visual Interface", icon: Award, color: "text-green-400", bg: "from-green-500/20 to-emerald-500/10" },
              { value: "Flexible", label: "Organization", icon: Database, color: "text-blue-400", bg: "from-blue-500/20 to-cyan-500/10" },
              { value: "Secure", label: "Authentication", icon: Globe, color: "text-purple-400", bg: "from-purple-500/20 to-violet-500/10" },
              { value: "Modern", label: "Tech Stack", icon: Zap, color: "text-pink-400", bg: "from-pink-500/20 to-rose-500/10" }
            ].map((metric, index) => (
              <div key={index} className="text-center group hover:scale-110 transition-all duration-500">
                <div className={`w-28 h-28 bg-gradient-to-br ${metric.bg} rounded-3xl flex items-center justify-center mx-auto mb-8 backdrop-blur-sm group-hover:shadow-2xl border border-white/10 transition-all duration-500`} style={{
                  boxShadow: `0 20px 40px -12px ${metric.color.includes('green') ? '#10b981' : metric.color.includes('blue') ? '#3b82f6' : metric.color.includes('purple') ? '#8b5cf6' : '#ec4899'}40`
                }}>
                  <metric.icon className={`w-12 h-12 ${metric.color} drop-shadow-lg`} />
                </div>
                <div className={`text-3xl sm:text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-white to-gray-200 bg-clip-text text-transparent`}>
                  {metric.value}
                </div>
                <div className="text-gray-400 text-base sm:text-lg md:text-xl font-medium">{metric.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Revolutionary Technology Showcase */}
      <section className="animate-fade-in delay-300 relative">
        <div className="text-center mb-24">
          <div className="inline-flex items-center justify-center p-4 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-full mb-8 backdrop-blur-xl border border-blue-500/20">
            <Rocket className="w-8 h-8 text-blue-400 mr-3" />
            <span className="text-blue-300 font-medium text-lg">Core Features</span>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-8xl font-bold mb-12">
            <span className="bg-gradient-to-r from-blue-300 via-purple-300 to-pink-300 bg-clip-text text-transparent">
              Powerful
            </span>
            <br />
            <span className="bg-gradient-to-r from-pink-400 via-purple-400 to-blue-400 bg-clip-text text-transparent">
              Features
            </span>
          </h2>
          <p className="text-lg sm:text-xl md:text-2xl text-gray-300 max-w-5xl mx-auto">
            Everything you need for effective task management
          </p>
        </div>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-2 lg:gap-16">
          {[
            {
              title: "Visual Task Canvas",
              description: "Organize and manage tasks through an intuitive drag-and-drop interface that makes task management visual and efficient.",
              features: ["Drag-and-drop interface", "Visual organization", "Task relationships", "Custom layouts"],
              icon: Zap,
              gradient: "from-yellow-300 to-orange-400",
              bgGradient: "from-yellow-500/10 to-orange-500/10"
            },
            {
              title: "Task Management",
              description: "Powerful tools for creating, organizing, and tracking tasks with customizable workflows.",
              features: ["Task creation", "Priority management", "Progress tracking", "Custom workflows"],
              icon: Brain,
              gradient: "from-purple-300 to-pink-400",
              bgGradient: "from-purple-500/10 to-pink-500/10"
            }
          ].map((innovation, index) => (
            <div key={index} className="group relative">
              <div className={`absolute inset-0 bg-gradient-to-r ${innovation.bgGradient} rounded-[40px] blur-3xl opacity-0 group-hover:opacity-100 transition-all duration-1000`}></div>
              
              <div className="relative backdrop-blur-2xl border border-gray-700/30 rounded-[24px] p-6 sm:p-10 md:p-16 h-full hover:border-purple-500/30 transition-all duration-700 bg-gradient-to-br from-gray-900/40 to-gray-800/20">
                <div className={`w-32 h-32 bg-gradient-to-r ${innovation.gradient} rounded-3xl flex items-center justify-center mb-12 shadow-2xl border border-white/20`}>
                  <innovation.icon className="w-16 h-16 text-white drop-shadow-xl" />
                </div>
                
                <h3 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-6 md:mb-8 text-white">{innovation.title}</h3>
                <p className="text-gray-300 text-base sm:text-lg md:text-xl mb-8 md:mb-12 leading-relaxed">{innovation.description}</p>
                
                <div className="space-y-4 sm:space-y-6">
                  {innovation.features.map((feature, featureIndex) => (
                    <div key={featureIndex} className="flex items-center space-x-4 group-hover:translate-x-2 transition-all duration-500" style={{ transitionDelay: `${featureIndex * 100}ms` }}>
                      <div className={`w-4 h-4 bg-gradient-to-r ${innovation.gradient} rounded-full shadow-lg`}></div>
                      <span className="text-gray-300 text-sm sm:text-base md:text-lg font-medium">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Premium Experience Showcase */}
      <section className="animate-fade-in delay-400 relative">
        <div className="absolute inset-0 bg-gradient-to-r from-pink-600/5 via-purple-600/5 to-blue-600/5 rounded-[60px] blur-3xl"></div>
        
        <div className="text-center mb-16 sm:mb-20 md:mb-24 relative z-10">
          <div className="inline-flex items-center justify-center p-4 bg-gradient-to-r from-pink-500/10 to-purple-500/10 rounded-full mb-8 backdrop-blur-xl border border-pink-500/20">
            <Trophy className="w-8 h-8 text-pink-400 mr-3" />
            <span className="text-pink-300 font-medium text-lg">Premium Excellence</span>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-8xl font-bold mb-8 md:mb-12">
            <span className="bg-gradient-to-r from-pink-300 via-purple-300 to-blue-300 bg-clip-text text-transparent">
              Exclusive
            </span>
            <br />
            <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent">
              Experience
            </span>
          </h2>
          <p className="text-lg sm:text-xl md:text-2xl text-gray-300 max-w-5xl mx-auto">
            Unlock features reserved for visionaries and industry leaders
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 sm:gap-8 md:gap-10 relative z-10">
          {[
            {
              icon: Lock,
              title: "Executive Access",
              description: "Priority access to cutting-edge features, exclusive beta programs, and direct line to our development team.",
              highlight: "Exclusive",
              benefits: ["24/7 dedicated support", "Priority feature requests", "Executive advisory board"]
            },
            {
              icon: Settings,
              title: "Infinite Customization",
              description: "Unlimited workspace customization with AI-powered design suggestions and brand integration.",
              highlight: "Unlimited",
              benefits: ["Custom AI models", "Brand integration", "White-label solutions"]
            },
            {
              icon: Users,
              title: "Master Class Training",
              description: "Personal mentorship from industry experts and exclusive access to advanced training programs.",
              highlight: "Personal",
              benefits: ["1-on-1 expert sessions", "Certification programs", "Industry networking"]
            }
          ].map((feature, index) => (
            <div key={index} className="group relative">
              <div className="absolute -inset-2 bg-gradient-to-r from-purple-500 via-pink-500 to-blue-500 rounded-[32px] blur-sm opacity-20 group-hover:opacity-50 transition-all duration-700"></div>
              
              <div className="relative backdrop-blur-2xl border border-gray-700/50 rounded-2xl p-6 sm:p-8 md:p-12 h-full bg-gradient-to-br from-gray-900/60 to-gray-800/40 hover:from-gray-900/80 hover:to-gray-800/60 transition-all duration-700">
                <div className="flex items-center justify-between mb-8">
                  <div className="w-20 h-20 bg-gradient-to-br from-purple-500/40 to-pink-500/30 rounded-2xl flex items-center justify-center backdrop-blur-sm border border-white/10">
                    <feature.icon className="w-10 h-10 text-purple-300" />
                  </div>
                  <span className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-3 rounded-full text-sm font-bold shadow-lg">
                    {feature.highlight}
                  </span>
                </div>
                
                <h3 className="text-xl sm:text-2xl md:text-3xl font-bold mb-4 md:mb-6 text-white">{feature.title}</h3>
                <p className="text-gray-300 text-base sm:text-lg leading-relaxed mb-6 md:mb-8">{feature.description}</p>
                
                <div className="space-y-2 sm:space-y-3">
                  {feature.benefits.map((benefit, benefitIndex) => (
                    <div key={benefitIndex} className="flex items-center space-x-3 opacity-0 group-hover:opacity-100 transition-all duration-500" style={{ transitionDelay: `${benefitIndex * 100}ms` }}>
                      <Star className="w-4 h-4 text-purple-400" />
                      <span className="text-gray-300">{benefit}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Enhanced Final CTA */}
      <section className="animate-fade-in delay-500 text-center relative">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-600/20 via-pink-600/20 to-blue-600/20 rounded-[60px] blur-3xl"></div>
        <div className="relative backdrop-blur-2xl border border-gray-700/30 rounded-[24px] p-6 sm:p-12 md:p-24 bg-gradient-to-br from-gray-900/40 to-gray-800/20">
          <div className="inline-flex items-center justify-center p-4 bg-gradient-to-r from-purple-500/10 to-blue-500/10 rounded-full mb-12 backdrop-blur-xl border border-purple-500/20">
            <Rocket className="w-8 h-8 text-purple-400 mr-3" />
            <span className="text-purple-300 font-medium text-lg">Begin Your Journey</span>
          </div>
          
          <h2 className="text-3xl sm:text-4xl md:text-8xl font-bold mb-8 md:mb-12 leading-tight">
            <span className="bg-gradient-to-r from-purple-300 via-pink-300 to-blue-300 bg-clip-text text-transparent">
              Transform
            </span>
            <br />
            <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
              Everything
            </span>
          </h2>
          <p className="text-lg sm:text-xl md:text-2xl text-gray-300 mb-8 md:mb-16 max-w-4xl mx-auto leading-relaxed">
            Step into the future of performance management. Your transformation begins with a single click.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 sm:gap-8 justify-center items-center mb-8 md:mb-12">
            <Button className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-8 sm:px-16 py-4 sm:py-8 text-lg sm:text-2xl rounded-full shadow-2xl shadow-purple-500/30 transition-all duration-500 hover:scale-105 hover:shadow-purple-500/50 border border-purple-400/30">
              Start Revolution
              <ArrowRight className="w-8 h-8 ml-4" />
            </Button>
            <Button variant="outline" className="border-gray-500 text-gray-200 hover:bg-gray-800/50 px-8 sm:px-16 py-4 sm:py-8 text-lg sm:text-2xl rounded-full backdrop-blur-sm hover:border-purple-500/50 transition-all duration-500 hover:scale-105">
              Explore Features
            </Button>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-8 max-w-2xl mx-auto opacity-60">
            <div className="text-center">
              <div className="text-2xl sm:text-3xl font-bold text-purple-400">5min</div>
              <div className="text-gray-400">Setup Time</div>
            </div>
            <div className="text-center">
              <div className="text-2xl sm:text-3xl font-bold text-pink-400">Zero</div>
              <div className="text-gray-400">Coding Required</div>
            </div>
            <div className="text-center">
              <div className="text-2xl sm:text-3xl font-bold text-blue-400">∞</div>
              <div className="text-gray-400">Possibilities</div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default FeatureSections;
