
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowRight, TrendingUp, Users, Shield, Zap, Globe, Star, Award, Target, Layers, Brain, Rocket, ChartBar, Lock, Sparkles, Trophy } from 'lucide-react';

const FeatureSections = () => {
  return (
    <div className="space-y-40 mt-40">
      {/* Hero Features Grid */}
      <section className="animate-fade-in">
        <div className="text-center mb-20">
          <h2 className="text-5xl md:text-6xl font-bold mb-8">
            <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent">
              Revolutionary Features
            </span>
          </h2>
          <p className="text-2xl text-gray-300 max-w-4xl mx-auto leading-relaxed">
            Experience the future of performance management with cutting-edge tools designed for modern teams
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
          {[
            {
              icon: Brain,
              title: "AI-Powered Insights",
              description: "Advanced machine learning algorithms analyze your data to provide predictive insights and automated recommendations.",
              accent: "from-purple-500 to-violet-600",
              iconBg: "bg-gradient-to-br from-purple-500/20 to-violet-500/10",
              border: "border-purple-500/20"
            },
            {
              icon: Rocket,
              title: "Lightning Speed",
              description: "Experience blazing-fast performance with our optimized infrastructure and real-time data processing.",
              accent: "from-blue-500 to-cyan-600",
              iconBg: "bg-gradient-to-br from-blue-500/20 to-cyan-500/10",
              border: "border-blue-500/20"
            },
            {
              icon: Shield,
              title: "Enterprise Security",
              description: "Military-grade encryption and advanced security protocols keep your data safe and compliant.",
              accent: "from-green-500 to-emerald-600",
              iconBg: "bg-gradient-to-br from-green-500/20 to-emerald-500/10",
              border: "border-green-500/20"
            },
            {
              icon: Globe,
              title: "Global Scale",
              description: "Seamlessly scale across continents with our worldwide infrastructure and edge computing network.",
              accent: "from-cyan-500 to-blue-600",
              iconBg: "bg-gradient-to-br from-cyan-500/20 to-blue-500/10",
              border: "border-cyan-500/20"
            },
            {
              icon: Users,
              title: "Team Collaboration",
              description: "Real-time collaboration tools that bring your team together, regardless of location or time zone.",
              accent: "from-pink-500 to-rose-600",
              iconBg: "bg-gradient-to-br from-pink-500/20 to-rose-500/10",
              border: "border-pink-500/20"
            },
            {
              icon: ChartBar,
              title: "Advanced Analytics",
              description: "Deep dive into your data with sophisticated analytics and customizable dashboard views.",
              accent: "from-orange-500 to-red-600",
              iconBg: "bg-gradient-to-br from-orange-500/20 to-red-500/10",
              border: "border-orange-500/20"
            }
          ].map((feature, index) => (
            <div key={index} className="group relative">
              <div className="absolute inset-0 bg-gradient-to-r opacity-0 group-hover:opacity-100 transition-all duration-500 blur-xl -z-10" style={{
                background: `linear-gradient(135deg, ${feature.accent.split(' ')[1]}, ${feature.accent.split(' ')[3]})`
              }}></div>
              
              <div className={`relative backdrop-blur-xl border ${feature.border} rounded-3xl p-8 h-full transition-all duration-500 hover:scale-105 hover:border-opacity-50 bg-gray-900/20`}>
                <div className={`w-20 h-20 ${feature.iconBg} rounded-2xl flex items-center justify-center mx-auto mb-6 backdrop-blur-sm group-hover:scale-110 transition-all duration-300`}>
                  <feature.icon className="w-10 h-10 text-white" />
                </div>
                <h3 className="text-2xl font-bold mb-4 text-white text-center">{feature.title}</h3>
                <p className="text-gray-300 text-center leading-relaxed text-lg">{feature.description}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Performance Stats */}
      <section className="animate-fade-in delay-200">
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-r from-purple-600/10 via-pink-600/10 to-blue-600/10 rounded-3xl blur-3xl"></div>
          <div className="relative backdrop-blur-xl border border-gray-700/30 rounded-3xl p-16">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold mb-6">
                <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                  Trusted Worldwide
                </span>
              </h2>
              <p className="text-gray-300 text-xl">Join millions who have transformed their workflow</p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-12">
              {[
                { value: "99.99%", label: "Uptime Guarantee", icon: Award, color: "text-green-400" },
                { value: "50M+", label: "Data Points", icon: Target, color: "text-blue-400" },
                { value: "195+", label: "Countries", icon: Globe, color: "text-purple-400" },
                { value: "24/7", label: "Expert Support", icon: Shield, color: "text-pink-400" }
              ].map((metric, index) => (
                <div key={index} className="text-center group hover:scale-110 transition-all duration-300">
                  <div className="w-20 h-20 bg-gradient-to-br from-gray-800/50 to-gray-700/30 rounded-2xl flex items-center justify-center mx-auto mb-6 backdrop-blur-sm group-hover:shadow-2xl group-hover:shadow-purple-500/25 border border-gray-600/30">
                    <metric.icon className={`w-10 h-10 ${metric.color}`} />
                  </div>
                  <div className="text-4xl font-bold bg-gradient-to-r from-white to-purple-200 bg-clip-text text-transparent mb-2">
                    {metric.value}
                  </div>
                  <div className="text-gray-400 text-lg">{metric.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Innovation Showcase */}
      <section className="animate-fade-in delay-300">
        <div className="text-center mb-20">
          <h2 className="text-5xl md:text-6xl font-bold mb-8">
            <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
              Next-Gen Innovation
            </span>
          </h2>
          <p className="text-2xl text-gray-300 max-w-4xl mx-auto">
            Pioneering technologies that redefine what's possible
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          {[
            {
              title: "Quantum Processing",
              description: "Harness quantum computing power for unprecedented calculation speeds and complex data analysis.",
              features: ["Real-time processing", "Infinite scalability", "Quantum encryption"],
              icon: Zap,
              gradient: "from-yellow-400 to-orange-500"
            },
            {
              title: "Neural Networks",
              description: "Advanced AI that learns and adapts to your workflow, becoming smarter with every interaction.",
              features: ["Self-learning algorithms", "Predictive modeling", "Automated optimization"],
              icon: Brain,
              gradient: "from-purple-400 to-pink-500"
            }
          ].map((innovation, index) => (
            <div key={index} className="group relative">
              <div className="absolute inset-0 bg-gradient-to-r from-purple-600/20 to-blue-600/20 rounded-3xl blur-2xl opacity-0 group-hover:opacity-100 transition-all duration-700"></div>
              
              <div className="relative backdrop-blur-xl border border-gray-700/30 rounded-3xl p-12 h-full hover:border-purple-500/30 transition-all duration-500">
                <div className={`w-24 h-24 bg-gradient-to-r ${innovation.gradient} rounded-2xl flex items-center justify-center mb-8 shadow-2xl`}>
                  <innovation.icon className="w-12 h-12 text-white" />
                </div>
                
                <h3 className="text-3xl font-bold mb-6 text-white">{innovation.title}</h3>
                <p className="text-gray-300 text-xl mb-8 leading-relaxed">{innovation.description}</p>
                
                <div className="space-y-4">
                  {innovation.features.map((feature, featureIndex) => (
                    <div key={featureIndex} className="flex items-center space-x-3">
                      <div className={`w-2 h-2 bg-gradient-to-r ${innovation.gradient} rounded-full`}></div>
                      <span className="text-gray-300 text-lg">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Premium Features */}
      <section className="animate-fade-in delay-400">
        <div className="text-center mb-20">
          <h2 className="text-5xl md:text-6xl font-bold mb-8">
            <span className="bg-gradient-to-r from-pink-400 via-purple-400 to-blue-400 bg-clip-text text-transparent">
              Premium Experience
            </span>
          </h2>
          <p className="text-2xl text-gray-300 max-w-4xl mx-auto">
            Unlock exclusive features designed for peak performance
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            {
              icon: Lock,
              title: "VIP Access",
              description: "Priority access to new features and exclusive beta programs.",
              highlight: "Exclusive"
            },
            {
              icon: Sparkles,
              title: "Custom Themes",
              description: "Personalize your workspace with unlimited customization options.",
              highlight: "Unlimited"
            },
            {
              icon: Trophy,
              title: "Expert Training",
              description: "One-on-one sessions with our specialists to maximize your potential.",
              highlight: "Personal"
            }
          ].map((feature, index) => (
            <div key={index} className="group relative">
              <div className="absolute -inset-1 bg-gradient-to-r from-purple-500 via-pink-500 to-blue-500 rounded-3xl blur-sm opacity-20 group-hover:opacity-40 transition-all duration-500"></div>
              
              <div className="relative backdrop-blur-xl border border-gray-700/50 rounded-3xl p-10 h-full bg-gray-900/30 hover:bg-gray-900/50 transition-all duration-500">
                <div className="flex items-center justify-between mb-6">
                  <div className="w-16 h-16 bg-gradient-to-br from-purple-500/30 to-pink-500/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
                    <feature.icon className="w-8 h-8 text-purple-400" />
                  </div>
                  <span className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-4 py-2 rounded-full text-sm font-bold">
                    {feature.highlight}
                  </span>
                </div>
                
                <h3 className="text-2xl font-bold mb-4 text-white">{feature.title}</h3>
                <p className="text-gray-300 text-lg leading-relaxed">{feature.description}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Final CTA */}
      <section className="animate-fade-in delay-500 text-center">
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-r from-purple-600/30 via-pink-600/30 to-blue-600/30 rounded-3xl blur-3xl"></div>
          <div className="relative backdrop-blur-xl border border-gray-700/30 rounded-3xl p-20 bg-gray-900/20">
            <h2 className="text-5xl md:text-6xl font-bold mb-8">
              <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent">
                Transform Your Future
              </span>
            </h2>
            <p className="text-2xl text-gray-300 mb-12 max-w-3xl mx-auto leading-relaxed">
              Join the revolution and experience the next generation of performance management. Your journey to excellence starts here.
            </p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
              <Button className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-12 py-6 text-xl rounded-full shadow-2xl shadow-purple-500/25 transition-all duration-300 hover:scale-105 hover:shadow-purple-500/40">
                Start Your Revolution
                <ArrowRight className="w-6 h-6 ml-3" />
              </Button>
              <Button variant="outline" className="border-gray-500 text-gray-200 hover:bg-gray-800/50 px-12 py-6 text-xl rounded-full backdrop-blur-sm hover:border-purple-500/50 transition-all duration-300">
                Explore Features
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default FeatureSections;
