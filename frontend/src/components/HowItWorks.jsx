import React from 'react';
import { UserPlus, Users, Calendar, ArrowRight, CheckCircle, Sparkles, Target } from 'lucide-react';

const HowItWorks = () => {
  const steps = [
    {
      number: "01",
      title: "Join & Create Profile",
      description: "Sign up in minutes and tell us about your interests and goals",
      icon: <UserPlus className="w-6 h-6" />,
      color: "#0B4797",
      gradient: "from-blue-500 to-blue-600",
      features: [
        "Quick 3-minute setup",
        "Personalized interests",
        "Privacy-first approach"
      ],
      emoji: "🎯",
      accent: "Start your journey"
    },
    {
      number: "02",
      title: "Pick Your Groups",
      description: "Choose from communities that match your growth ambitions",
      icon: <Users className="w-6 h-6" />,
      color: "#E6A308",
      gradient: "from-amber-500 to-amber-600",
      features: [
        "Daily Growth Circles",
        "Collaborative Projects",
        "Fun Activity Groups"
      ],
      emoji: "🌟",
      accent: "Find your tribe"
    },
    {
      number: "03",
      title: "Participate Weekly",
      description: "Engage in activities, workshops, and challenges regularly",
      icon: <Calendar className="w-6 h-6" />,
      color: "#7596BD",
      gradient: "from-blue-400 to-blue-500",
      features: [
        "Interactive Workshops",
        "Skill Challenges",
        "Peer-led Activities"
      ],
      emoji: "🚀",
      accent: "Grow together"
    }
  ];

  return (
    <section className="relative overflow-hidden bg-white py-12 sm:py-16 md:py-20">
      {/* Background Elements */}
      <div className="absolute inset-0">
        {/* Grid Pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0" style={{
            backgroundImage: `linear-gradient(to right, #0B4797 1px, transparent 1px),
                            linear-gradient(to bottom, #0B4797 1px, transparent 1px)`,
            backgroundSize: '40px 40px'
          }}></div>
        </div>
        
        {/* Gradient Orbs */}
        <div className="absolute -top-20 -left-20 w-64 h-64 rounded-full bg-blue-100/30 blur-3xl"></div>
        <div className="absolute -bottom-20 -right-20 w-72 h-72 rounded-full bg-amber-100/30 blur-3xl"></div>
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-12 sm:mb-16 md:mb-20">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/80 backdrop-blur-sm rounded-full border border-gray-200 shadow-sm mb-5">
            <Target className="w-4 h-4" style={{ color: '#E6A308' }} />
            <span className="text-sm font-semibold tracking-wider uppercase" style={{ color: '#0B4797' }}>
              Simple 3-Step Process
            </span>
            <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></div>
          </div>

          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight mb-4">
            <span className="block text-gray-900">
              Start{' '}
              <span className="relative">
                <span className="relative z-10" style={{ color: '#0B4797' }}>Growing</span>
                <span className="absolute bottom-1 left-0 right-0 h-2.5 bg-blue-100/50 -z-10"></span>
              </span>
              {' '}in Minutes
            </span>
            <span className="block text-lg sm:text-xl md:text-2xl font-semibold text-gray-600 mt-2">
              Your journey from signup to success
            </span>
          </h2>

          <p className="text-base sm:text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
            We've made it incredibly easy to begin your growth journey with Teens Connect
          </p>
        </div>

        {/* Steps Container */}
        <div className="relative">
          {/* Timeline Connector Line */}
          <div className="hidden lg:block absolute top-1/4 left-1/2 transform -translate-x-1/2 w-full h-0.5">
            <div className="w-full h-full bg-gradient-to-r from-blue-500/20 via-amber-500/20 to-blue-400/20"></div>
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent"></div>
          </div>
          
          {/* Mobile Timeline Connector */}
          <div className="lg:hidden absolute left-6 top-0 bottom-0 w-0.5">
            <div className="w-full h-full bg-gradient-to-b from-blue-500/20 via-amber-500/20 to-blue-400/20"></div>
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-white to-transparent"></div>
          </div>

          {/* Steps Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12 relative">
            {steps.map((step, index) => (
              <div 
                key={index}
                className="relative group"
              >
                {/* Step Number Badge */}
                <div className="absolute -top-4 left-6 lg:left-1/2 lg:-top-6 lg:-translate-x-1/2 z-20">
                  <div className="relative">
                    <div 
                      className="w-12 h-12 rounded-full border-4 border-white shadow-lg flex items-center justify-center font-bold text-lg"
                      style={{ backgroundColor: step.color, color: 'white' }}
                    >
                      {step.number}
                    </div>
                    {/* Pulsing effect */}
                    <div 
                      className="absolute inset-0 rounded-full animate-ping opacity-20"
                      style={{ backgroundColor: step.color }}
                    ></div>
                  </div>
                </div>

                {/* Step Card */}
                <div className="relative bg-white rounded-2xl border border-gray-200 p-6 sm:p-8 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 group-hover:border-transparent ml-14 lg:ml-0">
                  {/* Top Accent */}
                  <div 
                    className="absolute top-0 left-0 right-0 h-1 rounded-t-2xl"
                    style={{ backgroundColor: step.color }}
                  ></div>

                  {/* Icon Container */}
                  <div className="mb-6">
                    <div className={`inline-flex p-4 rounded-xl bg-gradient-to-br ${step.gradient} shadow-md group-hover:shadow-lg transition-shadow duration-300`}>
                      <div className="text-white">
                        {step.icon}
                      </div>
                    </div>
                    
                    {/* Emoji */}
                    <div className="inline-flex ml-3 text-2xl opacity-80">
                      {step.emoji}
                    </div>
                  </div>

                  {/* Content */}
                  <div className="space-y-4">
                    <div>
                      <h3 
                        className="text-xl font-bold mb-2 group-hover:scale-105 transition-transform duration-300 inline-block"
                        style={{ color: step.color }}
                      >
                        {step.title}
                      </h3>
                      <p className="text-gray-600 leading-relaxed">
                        {step.description}
                      </p>
                    </div>

                    {/* Features List */}
                    <div className="space-y-2 pt-2">
                      {step.features.map((feature, i) => (
                        <div 
                          key={i}
                          className="flex items-center gap-2 text-sm transition-all duration-300 group-hover:translate-x-1"
                          style={{ transitionDelay: `${i * 50}ms` }}
                        >
                          <CheckCircle className="w-4 h-4" style={{ color: step.color }} />
                          <span className="font-medium text-gray-700">{feature}</span>
                        </div>
                      ))}
                    </div>

                    {/* Accent Text */}
                    <div className="pt-3">
                      <div className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-gray-50 border border-gray-100">
                        <Sparkles className="w-3 h-3" style={{ color: step.color }} />
                        <span className="text-xs font-semibold tracking-wide" style={{ color: step.color }}>
                          {step.accent}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Arrow Connector - Desktop */}
                  {index < steps.length - 1 && (
                    <div className="hidden lg:block absolute top-1/2 -right-6 transform -translate-y-1/2 z-10">
                      <div className="relative">
                        <div 
                          className="w-12 h-12 rounded-full bg-white border border-gray-200 flex items-center justify-center shadow-md group-hover:shadow-lg transition-shadow duration-300"
                        >
                          <ArrowRight className="w-5 h-5 text-gray-400" />
                        </div>
                        {/* Animated line */}
                        <div 
                          className="absolute top-1/2 -right-3 w-6 h-0.5 bg-gradient-to-r from-gray-200 to-transparent"
                        ></div>
                      </div>
                    </div>
                  )}

                  {/* Arrow Connector - Mobile */}
                  {index < steps.length - 1 && (
                    <div className="lg:hidden absolute -bottom-6 left-1/2 transform -translate-x-1/2 z-10">
                      <div className="relative">
                        <div 
                          className="w-12 h-12 rounded-full bg-white border border-gray-200 flex items-center justify-center shadow-md group-hover:shadow-lg transition-shadow duration-300"
                        >
                          <ArrowRight className="w-5 h-5 text-gray-400 rotate-90" />
                        </div>
                        {/* Animated line */}
                        <div 
                          className="absolute top-full left-1/2 transform -translate-x-1/2 w-0.5 h-6 bg-gradient-to-b from-gray-200 to-transparent"
                        ></div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Hover Glow Effect */}
                <div 
                  className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10"
                  style={{
                    background: `radial-gradient(circle at center, ${step.color}10, transparent 70%)`,
                  }}
                ></div>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom CTA */}
        <div className="mt-16 sm:mt-20 text-center">
          <div className="inline-flex flex-col sm:flex-row items-center gap-6 bg-gradient-to-r from-white to-gray-50 rounded-2xl p-6 sm:p-8 border border-gray-200 shadow-sm max-w-3xl mx-auto">
            {/* Stats */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 w-full sm:w-auto">
              {[
                { value: "3 min", label: "Average signup", color: "#0B4797" },
                { value: "95%", label: "Join groups", color: "#E6A308" },
                { value: "Weekly", label: "Active participation", color: "#7596BD" }
              ].map((stat, i) => (
                <div key={i} className="text-center">
                  <div 
                    className="text-xl font-bold mb-1"
                    style={{ color: stat.color }}
                  >
                    {stat.value}
                  </div>
                  <div className="text-xs text-gray-500 font-medium">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>

            {/* Divider */}
            <div className="hidden sm:block w-px h-12 bg-gradient-to-b from-transparent via-gray-200 to-transparent"></div>

            {/* CTA Button */}
            <button className="group relative px-8 py-4 rounded-xl font-semibold text-sm transition-all duration-300 hover:shadow-xl active:scale-95 min-w-[200px]">
              <span className="relative z-10 flex items-center justify-center gap-3 text-white">
                <span>Begin Your Journey</span>
                <ArrowRight className="w-4 h-4 transform transition-transform duration-300 group-hover:translate-x-1" />
              </span>
              <div 
                className="absolute inset-0 rounded-xl bg-gradient-to-r from-blue-600 via-blue-500 to-amber-500 opacity-100 group-hover:from-blue-700 group-hover:via-blue-600 group-hover:to-amber-600 transition-all duration-300"
              ></div>
              {/* Shimmer Effect */}
              <div 
                className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                style={{
                  background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent)',
                  backgroundSize: '200% 100%',
                }}
              ></div>
            </button>
          </div>

          {/* Mobile Helper Text */}
          <div className="sm:hidden mt-6">
            <p className="text-sm text-gray-500 font-medium">
              <span className="text-blue-600 font-semibold">Tap any step</span> to learn more
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;