
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowRight, TrendingUp, Users, Shield, Zap, Globe, Star, Award, Target, Layers } from 'lucide-react';

const FeatureSections = () => {
  return (
    <div className="space-y-32 mt-32">
      {/* Advanced Features Grid */}
      <section className="animate-fade-in">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent">
              Advanced Features
            </span>
          </h2>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto">
            Discover powerful tools designed to elevate your performance and streamline your workflow
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[
            {
              icon: TrendingUp,
              title: "Real-time Analytics",
              description: "Get instant insights with live data visualization and comprehensive reporting tools.",
              gradient: "from-purple-500/20 to-purple-600/10",
              iconColor: "text-purple-400",
              borderColor: "border-purple-500/30"
            },
            {
              icon: Users,
              title: "Team Collaboration",
              description: "Work seamlessly with your team using advanced collaboration and sharing features.",
              gradient: "from-blue-500/20 to-blue-600/10",
              iconColor: "text-blue-400",
              borderColor: "border-blue-500/30"
            },
            {
              icon: Shield,
              title: "Enterprise Security",
              description: "Bank-level security with end-to-end encryption and advanced access controls.",
              gradient: "from-green-500/20 to-emerald-600/10",
              iconColor: "text-green-400",
              borderColor: "border-green-500/30"
            },
            {
              icon: Zap,
              title: "Lightning Performance",
              description: "Optimized for speed with instant loading and real-time synchronization.",
              gradient: "from-yellow-500/20 to-orange-600/10",
              iconColor: "text-yellow-400",
              borderColor: "border-yellow-500/30"
            },
            {
              icon: Globe,
              title: "Global Infrastructure",
              description: "Worldwide coverage with 99.9% uptime and edge computing capabilities.",
              gradient: "from-cyan-500/20 to-blue-600/10",
              iconColor: "text-cyan-400",
              borderColor: "border-cyan-500/30"
            },
            {
              icon: Star,
              title: "Premium Support",
              description: "24/7 dedicated support with priority assistance and expert guidance.",
              gradient: "from-pink-500/20 to-rose-600/10",
              iconColor: "text-pink-400",
              borderColor: "border-pink-500/30"
            }
          ].map((feature, index) => (
            <Card key={index} className={`bg-gradient-to-br ${feature.gradient} border ${feature.borderColor} backdrop-blur-lg hover:shadow-2xl hover:shadow-purple-500/20 transition-all duration-500 hover:scale-105 group`}>
              <CardContent className="p-8">
                <div className={`w-16 h-16 bg-gradient-to-br ${feature.gradient} rounded-2xl flex items-center justify-center mx-auto mb-6 backdrop-blur-sm group-hover:scale-110 transition-all duration-300 border ${feature.borderColor}`}>
                  <feature.icon className={`w-8 h-8 ${feature.iconColor}`} />
                </div>
                <h3 className="text-xl font-semibold mb-4 text-white text-center">{feature.title}</h3>
                <p className="text-gray-400 text-center leading-relaxed">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Performance Metrics */}
      <section className="animate-fade-in delay-200">
        <Card className="bg-gradient-to-br from-gray-900/80 to-gray-800/40 border-gray-700/50 backdrop-blur-xl shadow-2xl shadow-purple-500/10">
          <CardContent className="p-12">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                  Performance Metrics
                </span>
              </h2>
              <p className="text-gray-400 text-lg">Trusted by thousands of users worldwide</p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {[
                { value: "99.99%", label: "Uptime", icon: Award },
                { value: "10M+", label: "Transactions", icon: Target },
                { value: "150+", label: "Countries", icon: Globe },
                { value: "24/7", label: "Support", icon: Shield }
              ].map((metric, index) => (
                <div key={index} className="text-center group hover:scale-105 transition-all duration-300">
                  <div className="w-16 h-16 bg-gradient-to-br from-purple-500/30 to-blue-500/20 rounded-2xl flex items-center justify-center mx-auto mb-4 backdrop-blur-sm group-hover:shadow-lg group-hover:shadow-purple-500/25">
                    <metric.icon className="w-8 h-8 text-purple-400" />
                  </div>
                  <div className="text-3xl font-bold bg-gradient-to-r from-white to-purple-200 bg-clip-text text-transparent mb-2">
                    {metric.value}
                  </div>
                  <div className="text-gray-400 text-sm">{metric.label}</div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </section>

      {/* Call to Action Section */}
      <section className="animate-fade-in delay-400 text-center">
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-r from-purple-600/20 via-pink-600/20 to-blue-600/20 rounded-3xl blur-3xl"></div>
          <Card className="relative bg-gradient-to-br from-gray-900/90 to-gray-800/50 border-gray-700/50 backdrop-blur-xl">
            <CardContent className="p-16">
              <h2 className="text-4xl md:text-5xl font-bold mb-6">
                <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent">
                  Ready to Transform Your Workflow?
                </span>
              </h2>
              <p className="text-xl text-gray-400 mb-8 max-w-2xl mx-auto">
                Join thousands of professionals who have already revolutionized their performance with our platform.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <Button className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white px-8 py-4 text-lg rounded-full shadow-lg shadow-purple-500/25 transition-all duration-300 hover:scale-105 hover:shadow-purple-500/40">
                  Start Your Journey
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
                <Button variant="outline" className="border-gray-600 text-gray-300 hover:bg-gray-800 px-8 py-4 text-lg rounded-full backdrop-blur-sm">
                  Watch Demo
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
};

export default FeatureSections;
