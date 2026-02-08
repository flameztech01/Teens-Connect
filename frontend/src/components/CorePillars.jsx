import React from 'react';
import { Users, TrendingUp, BookOpen, Briefcase, Sparkles, ArrowRight } from 'lucide-react';

const CorePillars = () => {
  const pillars = [
    {
      title: "Connect",
      description: "Build meaningful friendships and join supportive peer circles",
      icon: <Users className="w-6 h-6" />,
      color: "#0B4797",
      gradient: "from-blue-500 via-blue-600 to-blue-700",
      accentColor: "#0B4797",
      features: ["Friendships", "Peer Circles", "Group Activities"],
      stats: "200+ Active Groups",
      emoji: "🤝"
    },
    {
      title: "Grow",
      description: "Daily check-ins and habit-building for personal development",
      icon: <TrendingUp className="w-6 h-6" />,
      color: "#E6A308",
      gradient: "from-amber-500 via-amber-600 to-amber-700",
      accentColor: "#E6A308",
      features: ["Daily Check-ins", "Habit Building", "Personal Goals"],
      stats: "95% Success Rate",
      emoji: "🌱"
    },
    {
      title: "Learn",
      description: "Micro-lessons and study support for continuous learning",
      icon: <BookOpen className="w-6 h-6" />,
      color: "#7596BD",
      gradient: "from-blue-400 via-blue-500 to-blue-600",
      accentColor: "#7596BD",
      features: ["Micro-lessons", "Study Support", "Knowledge Sharing"],
      stats: "50+ Topics",
      emoji: "📚"
    },
    {
      title: "Build",
      description: "Develop skills through real projects and opportunities",
      icon: <Briefcase className="w-6 h-6" />,
      color: "#10B981",
      gradient: "from-emerald-500 via-emerald-600 to-emerald-700",
      accentColor: "#10B981",
      features: ["Skill Development", "Real Projects", "Opportunities"],
      stats: "30+ Projects",
      emoji: "🚀"
    }
  ];

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-white to-gray-50 py-12 sm:py-16 md:py-20">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%230B4797' fill-opacity='0.1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          backgroundSize: '60px 60px'
        }}></div>
      </div>

      {/* Floating Shapes */}
      <div className="absolute top-0 left-1/4 w-32 h-32 rounded-full bg-blue-100/20 blur-3xl"></div>
      <div className="absolute bottom-0 right-1/4 w-40 h-40 rounded-full bg-amber-100/20 blur-3xl"></div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-10 sm:mb-12 md:mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-white rounded-full border border-gray-200 shadow-sm mb-4">
            <Sparkles className="w-4 h-4" style={{ color: '#E6A308' }} />
            <span className="text-sm font-semibold tracking-wide" style={{ color: '#0B4797' }}>
              OUR FOUNDATION
            </span>
          </div>
          
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight mb-4">
            <span className="block text-gray-900">
              Four Pillars of{' '}
              <span className="relative">
                <span className="relative z-10" style={{ color: '#0B4797' }}>Youth Empowerment</span>
                <span className="absolute bottom-1 left-0 right-0 h-3 bg-blue-100/40 -z-10"></span>
              </span>
            </span>
            <span className="block text-lg sm:text-xl md:text-2xl font-semibold text-gray-600 mt-2">
              Designed for Nigerian teens to thrive
            </span>
          </h2>
          
          <p className="text-base sm:text-lg text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Our comprehensive approach ensures every teen finds their path to growth
          </p>
        </div>

        {/* Pillars Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
          {pillars.map((pillar, index) => (
            <div 
              key={index}
              className="group relative h-full"
            >
              {/* Card Container */}
              <div className="relative h-full bg-white rounded-2xl border border-gray-200 p-6 transition-all duration-300 hover:shadow-xl hover:border-transparent hover:-translate-y-1 overflow-hidden">
                {/* Corner accent */}
                <div 
                  className="absolute top-0 right-0 w-12 h-12 rounded-bl-2xl opacity-10 group-hover:opacity-20 transition-opacity duration-300"
                  style={{ backgroundColor: pillar.color }}
                ></div>

                {/* Pillar number */}
                <div className="absolute -top-2 -left-2 w-8 h-8 rounded-full bg-white border border-gray-200 flex items-center justify-center">
                  <span className="text-xs font-bold" style={{ color: pillar.color }}>
                    0{index + 1}
                  </span>
                </div>

                {/* Emoji decoration */}
                <div className="absolute top-4 right-4 text-2xl opacity-20 group-hover:opacity-40 transition-opacity duration-300">
                  {pillar.emoji}
                </div>

                {/* Icon with gradient */}
                <div className="relative mb-6">
                  <div className={`relative w-14 h-14 rounded-xl bg-gradient-to-br ${pillar.gradient} p-3 shadow-lg group-hover:shadow-xl transition-shadow duration-300`}>
                    <div className="text-white">
                      {pillar.icon}
                    </div>
                    
                    {/* Glow effect */}
                    <div 
                      className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                      style={{ 
                        boxShadow: `0 0 20px 5px ${pillar.color}40`,
                        backgroundColor: 'transparent'
                      }}
                    ></div>
                  </div>
                  
                  {/* Animated circle */}
                  <div 
                    className="absolute -top-2 -left-2 w-18 h-18 rounded-full border border-dashed opacity-0 group-hover:opacity-100 transition-all duration-700"
                    style={{ borderColor: pillar.color }}
                  ></div>
                </div>

                {/* Content */}
                <div className="space-y-4">
                  {/* Title */}
                  <div className="space-y-2">
                    <h3 
                      className="text-xl font-bold tracking-tight group-hover:scale-105 transition-transform duration-300 inline-block"
                      style={{ color: pillar.color }}
                    >
                      {pillar.title}
                    </h3>
                    <p className="text-gray-600 leading-relaxed">
                      {pillar.description}
                    </p>
                  </div>

                  {/* Features list */}
                  <div className="space-y-2 pt-2">
                    {pillar.features.map((feature, i) => (
                      <div 
                        key={i}
                        className="flex items-center gap-2 text-sm transition-all duration-300 group-hover:translate-x-1"
                        style={{ 
                          transitionDelay: `${i * 50}ms`,
                          color: i === 0 ? pillar.color : '#4B5563'
                        }}
                      >
                        <div 
                          className="w-1.5 h-1.5 rounded-full flex-shrink-0"
                          style={{ backgroundColor: pillar.color }}
                        ></div>
                        <span className="font-medium">{feature}</span>
                      </div>
                    ))}
                  </div>

                  {/* Stats */}
                  <div className="pt-4 mt-4 border-t border-gray-100">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold uppercase tracking-wider text-gray-500">
                        Impact
                      </span>
                      <span 
                        className="text-sm font-bold"
                        style={{ color: pillar.color }}
                      >
                        {pillar.stats}
                      </span>
                    </div>
                  </div>

                  {/* Hover arrow */}
                  <div className="absolute bottom-6 right-6 opacity-0 group-hover:opacity-100 transform translate-x-4 group-hover:translate-x-0 transition-all duration-300">
                    <ArrowRight className="w-5 h-5" style={{ color: pillar.color }} />
                  </div>
                </div>

                {/* Bottom gradient line */}
                <div 
                  className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-transparent to-transparent group-hover:from-transparent group-hover:via-white group-hover:to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  style={{
                    backgroundImage: `linear-gradient(90deg, transparent, ${pillar.color}40, transparent)`
                  }}
                ></div>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="mt-12 md:mt-16 text-center">
          <div className="inline-flex flex-col sm:flex-row items-center gap-4 bg-white rounded-2xl p-6 border border-gray-200 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-amber-500 flex items-center justify-center">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <div className="text-left">
                <p className="font-semibold text-gray-900">
                  Ready to experience all four pillars?
                </p>
                <p className="text-sm text-gray-500">
                  Join thousands of teens already on their journey
                </p>
              </div>
            </div>
            <button className="group relative px-6 py-3 rounded-lg font-semibold text-sm transition-all duration-300 hover:shadow-md active:scale-95 min-w-[140px]">
              <span className="relative z-10 flex items-center justify-center gap-2 text-white">
                Start Today
                <ArrowRight className="w-4 h-4 transform transition-transform duration-300 group-hover:translate-x-1" />
              </span>
              <div 
                className="absolute inset-0 rounded-lg bg-gradient-to-r from-blue-600 to-amber-500 opacity-100 group-hover:from-blue-700 group-hover:to-amber-600 transition-all duration-300"
              ></div>
              <div 
                className="absolute inset-0 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                style={{ 
                  background: 'linear-gradient(90deg, #0B4797, #E6A308, #0B4797)',
                  backgroundSize: '200% 100%',
                  animation: 'shimmer 2s infinite'
                }}
              ></div>
            </button>
          </div>
        </div>

        {/* Mobile view note */}
        <div className="sm:hidden mt-8 text-center">
          <p className="text-xs text-gray-500 font-medium">
            ← Swipe to explore all pillars →
          </p>
        </div>
      </div>

      {/* CSS Animation for shimmer effect */}
      <style jsx>{`
        @keyframes shimmer {
          0% { background-position: -200% 0; }
          100% { background-position: 200% 0; }
        }
      `}</style>
    </section>
  );
};

export default CorePillars;