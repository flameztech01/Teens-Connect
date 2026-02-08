import React from 'react';
import { Shield, Users, Target, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';

const WhatIsTeensConnect = () => {
  const features = [
    {
      icon: <Shield className="w-5 h-5" />,
      title: "Safe, Moderated Community",
      description: "Professionally monitored 24/7 ensuring respectful interactions",
      color: "#0B4797",
      gradient: "from-blue-500 to-blue-600",
      link: "/community"
    },
    {
      icon: <Users className="w-5 h-5" />,
      title: "Growth-Focused Groups",
      description: "Peer circles designed for personal and social development",
      color: "#E6A308",
      gradient: "from-amber-500 to-amber-600",
      link: "/groups"
    },
    {
      icon: <Target className="w-5 h-5" />,
      title: "Skills + Opportunities",
      description: "Hands-on workshops and real-world project experiences",
      color: "#7596BD",
      gradient: "from-blue-400 to-blue-500",
      link: "/opportunities"
    }
  ];

  return (
    <section className="relative overflow-hidden bg-white py-12 sm:py-16 md:py-20">
      {/* Background elements */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-0 left-1/4 w-64 h-64 rounded-full border border-blue-200"></div>
        <div className="absolute bottom-0 right-1/4 w-48 h-48 rounded-full border border-amber-200"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          
          {/* Left Column - Short Intro */}
          <div className="space-y-5">
            {/* Section Label */}
            <div className="inline-flex items-center gap-2">
              <div className="w-2 h-2 rounded-full" style={{ backgroundColor: '#E6A308' }}></div>
              <span className="text-sm font-semibold tracking-wider uppercase" style={{ color: '#0B4797' }}>
                What We Are
              </span>
            </div>

            {/* Main Headline */}
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight">
              <span className="block text-gray-900">
                More Than Just a{' '}
                <span className="relative">
                  <span className="relative z-10" style={{ color: '#0B4797' }}>Platform</span>
                  <span className="absolute bottom-1 left-0 right-0 h-2 bg-blue-100/40 -z-10"></span>
                </span>
              </span>
              <span className="block text-xl sm:text-2xl md:text-3xl mt-2">
                <span className="text-gray-700">A</span>{' '}
                <span className="font-bold" style={{ color: '#E6A308' }}>Purpose-Driven</span>
                <span className="text-gray-700">{' '}Space</span>
              </span>
            </h2>

            {/* Description */}
            <div className="space-y-3">
              <p className="text-base sm:text-lg text-gray-600 leading-relaxed">
                We're a <span className="font-semibold text-blue-700">caring ecosystem</span> where Nigerian teens 
                find their voice, build confidence, and discover their potential.
              </p>
              <p className="text-base text-gray-500 leading-relaxed">
                A place where connections turn into friendships, and interests evolve into passions.
              </p>
            </div>

            {/* Decorative Element */}
            <div className="pt-4">
              <div className="flex items-center gap-2">
                {[...Array(3)].map((_, i) => (
                  <div 
                    key={i}
                    className={`w-6 h-6 rounded-full flex items-center justify-center transition-transform duration-300 hover:scale-110 ${
                      i === 0 ? 'bg-blue-100' : i === 1 ? 'bg-amber-100' : 'bg-blue-50'
                    }`}
                  >
                    <Sparkles className="w-3 h-3" style={{ 
                      color: i === 0 ? '#0B4797' : i === 1 ? '#E6A308' : '#7596BD' 
                    }} />
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column - Features */}
          <div className="relative">
            {/* Background card for features */}
            <div className="relative bg-gradient-to-br from-white to-gray-50 rounded-2xl p-6 sm:p-8 border border-gray-100 shadow-sm">
              {/* Floating accent */}
              <div 
                className="absolute -top-3 -right-3 w-6 h-6 rounded-full flex items-center justify-center shadow-md"
                style={{ backgroundColor: '#E6A308' }}
              >
                <Sparkles className="w-3 h-3 text-white" />
              </div>

              {/* Features list */}
              <div className="space-y-6">
                {features.map((feature, index) => (
                  <Link
                    key={index}
                    to={feature.link}
                    className="group flex items-start gap-4 p-4 rounded-xl transition-all duration-300 hover:bg-white hover:shadow-md hover:border hover:border-gray-100 cursor-pointer block no-underline"
                  >
                    {/* Icon container with gradient */}
                    <div className="relative flex-shrink-0">
                      <div className={`relative p-3 rounded-xl bg-gradient-to-br ${feature.gradient} shadow-sm group-hover:shadow-md transition-all duration-300`}>
                        <div className="text-white">
                          {feature.icon}
                        </div>
                        {/* Hover effect */}
                        <div className="absolute inset-0 rounded-xl bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                      </div>
                      
                      {/* Connecting line (except for last item) */}
                      {index < features.length - 1 && (
                        <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0.5 h-8">
                          <div className="w-full h-full bg-gradient-to-b from-gray-200 to-transparent"></div>
                        </div>
                      )}
                    </div>

                    {/* Text content */}
                    <div className="flex-1 min-w-0">
                      <h3 
                        className="text-lg font-semibold mb-1.5 group-hover:translate-x-1 transition-transform duration-300"
                        style={{ color: feature.color }}
                      >
                        {feature.title}
                      </h3>
                      <p className="text-sm text-gray-600 leading-relaxed">
                        {feature.description}
                      </p>
                    </div>

                    {/* Arrow indicator */}
                    <div className="flex-shrink-0 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-x-2 group-hover:translate-x-0">
                      <svg 
                        className="w-5 h-5" 
                        style={{ color: feature.color }}
                        fill="none" 
                        stroke="currentColor" 
                        viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                      </svg>
                    </div>
                  </Link>
                ))}
              </div>

              {/* Mobile CTA */}
              <div className="mt-8 pt-6 border-t border-gray-100 sm:hidden">
                <div className="text-center">
                  <p className="text-sm text-gray-500 font-medium">
                    Ready to join?{' '}
                    <Link 
                      to="/about" 
                      className="font-semibold hover:underline no-underline"
                      style={{ color: '#0B4797' }}
                    >
                      Start your journey today
                    </Link>
                  </p>
                </div>
              </div>
            </div>

            {/* Decorative elements */}
            <div className="absolute -z-10 -bottom-4 -left-4 w-20 h-20 rounded-full bg-blue-50/50 blur-xl"></div>
            <div className="absolute -z-10 -top-4 -right-4 w-16 h-16 rounded-full bg-amber-50/50 blur-xl"></div>
          </div>
        </div>

        {/* Bottom CTA for larger screens */}
        <div className="hidden sm:block mt-12 pt-8 border-t border-gray-100">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="font-semibold text-gray-900">
                  Join hundreds of teens already growing with us
                </p>
                <p className="text-sm text-gray-500">
                  Your journey starts with a single connection
                </p>
              </div>
            </div>
            <Link 
              to="/about"
              className="group relative px-6 py-3 rounded-lg font-semibold text-sm transition-all duration-300 hover:shadow-md active:scale-95 no-underline"
            >
              <span className="relative z-10 flex items-center gap-2" style={{ color: '#0B4797' }}>
                Learn More About Us
                <svg 
                  className="w-4 h-4 transform transition-transform duration-300 group-hover:translate-x-1" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </span>
              <div 
                className="absolute inset-0 rounded-lg transition-opacity duration-300 opacity-0 group-hover:opacity-100"
                style={{ backgroundColor: '#0B4797', opacity: 0.1 }}
              ></div>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default WhatIsTeensConnect;