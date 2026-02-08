import React from 'react';
import { Users, Shield, Award, Users2 } from 'lucide-react';

const SocialProofStrip = () => {
  const stats = [
    { 
      icon: <Users className="w-4 h-4" />, 
      value: "500+", 
      label: "Members", 
      color: "#0B4797",
      gradient: "from-blue-600 to-blue-700"
    },
    { 
      icon: <Award className="w-4 h-4" />, 
      value: "50+", 
      label: "Workshops", 
      color: "#E6A308",
      gradient: "from-amber-500 to-amber-600"
    },
    { 
      icon: <Shield className="w-4 h-4" />, 
      value: "24/7", 
      label: "Safe Moderation", 
      color: "#10B981",
      gradient: "from-emerald-500 to-emerald-600"
    },
    { 
      icon: <Users2 className="w-4 h-4" />, 
      value: "12+", 
      label: "Communities", 
      color: "#7596BD",
      gradient: "from-blue-400 to-blue-500"
    }
  ];

  return (
    <div className="relative overflow-hidden border-y border-gray-100 bg-gradient-to-r from-white via-blue-50/20 to-white">
      {/* Animated background elements */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: 'linear-gradient(90deg, transparent 50%, rgba(11, 71, 151, 0.1) 50%)',
          backgroundSize: '20px 100%'
        }}></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Desktop Layout (unchanged) */}
        <div className="hidden md:flex flex-col md:flex-row items-center justify-between gap-4 py-4">
          {/* Trust statement */}
          <div className="flex items-center gap-3">
            <div className="relative">
              <div 
                className="absolute inset-0 rounded-full opacity-20 animate-pulse"
                style={{ backgroundColor: '#0B4797' }}
              ></div>
              <div 
                className="relative w-8 h-8 rounded-full flex items-center justify-center"
                style={{ backgroundColor: '#0B4797' }}
              >
                <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              </div>
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-semibold text-gray-900 tracking-tight">
                Trusted by teens across Nigeria
              </span>
              <span className="text-xs text-gray-500 font-medium">
                Join the growing community
              </span>
            </div>
          </div>

          {/* Stats divider - visible on larger screens */}
          <div className="hidden md:block h-8 w-px bg-gradient-to-b from-transparent via-gray-200 to-transparent"></div>

          {/* Stats grid */}
          <div className="flex items-center gap-6 md:gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="group relative">
                <div className="flex items-center gap-2">
                  {/* Icon with gradient background */}
                  <div className={`relative p-1.5 rounded-md bg-gradient-to-br ${stat.gradient} shadow-sm group-hover:shadow-md transition-shadow duration-300`}>
                    <div className="text-white">
                      {stat.icon}
                    </div>
                    {/* Animated pulse effect on hover */}
                    <div className="absolute inset-0 rounded-md bg-gradient-to-br opacity-0 group-hover:opacity-100 transition-opacity duration-300 animate-ping"></div>
                  </div>
                  
                  <div className="text-left min-w-[80px]">
                    <div className="flex items-baseline gap-0.5">
                      <span 
                        className="text-lg font-bold tracking-tight group-hover:scale-105 transition-transform duration-300"
                        style={{ color: stat.color }}
                      >
                        {stat.value}
                      </span>
                      {stat.value === "24/7" && (
                        <span className="text-[10px] font-medium text-gray-500 uppercase tracking-wider">hr</span>
                      )}
                    </div>
                    <span className="text-xs font-medium text-gray-500 tracking-wide block mt-0.5">
                      {stat.label}
                    </span>
                  </div>
                </div>

                {/* Animated underline on hover */}
                <div 
                  className="absolute -bottom-1 left-0 right-0 h-0.5 rounded-full scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"
                  style={{ backgroundColor: stat.color }}
                ></div>
              </div>
            ))}
          </div>
        </div>

        {/* Mobile Layout */}
        <div className="md:hidden py-6">
          {/* Trust statement for mobile */}
          <div className="flex items-center justify-center gap-3 mb-8">
            <div className="relative">
              <div 
                className="absolute inset-0 rounded-full opacity-20 animate-pulse"
                style={{ backgroundColor: '#0B4797' }}
              ></div>
              <div 
                className="relative w-10 h-10 rounded-full flex items-center justify-center"
                style={{ backgroundColor: '#0B4797' }}
              >
                <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              </div>
            </div>
            <div className="flex flex-col">
              <span className="text-base font-bold text-gray-900 tracking-tight">
                Trusted by teens across Nigeria
              </span>
              <span className="text-sm text-gray-600 font-medium">
                Join the growing community
              </span>
            </div>
          </div>

          {/* Stats grid for mobile - 2x2 layout */}
          <div className="grid grid-cols-2 gap-4 px-4">
            {stats.map((stat, index) => (
              <div key={index} className="group">
                <div className="flex flex-col items-center justify-center p-4 rounded-xl bg-white border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300">
                  {/* Icon with gradient background */}
                  <div className={`relative p-3 rounded-lg bg-gradient-to-br ${stat.gradient} shadow-sm mb-3`}>
                    <div className="text-white">
                      {React.cloneElement(stat.icon, { className: "w-6 h-6" })}
                    </div>
                  </div>
                  
                  <div className="text-center">
                    <div className="flex items-center justify-center gap-1 mb-1">
                      <span 
                        className="text-2xl font-bold tracking-tight"
                        style={{ color: stat.color }}
                      >
                        {stat.value}
                      </span>
                      {stat.value === "24/7" && (
                        <span className="text-xs font-medium text-gray-500 uppercase tracking-wider">hr</span>
                      )}
                    </div>
                    <span className="text-sm font-semibold text-gray-700 tracking-wide">
                      {stat.label}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Mobile CTA */}
          <div className="mt-8 text-center px-4">
            <button className="w-full py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-semibold rounded-lg shadow-md hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-300">
              Join Now - Be Part of the Movement
            </button>
            <p className="text-xs text-gray-500 mt-3">
              Join 500+ members in 12+ communities
            </p>
          </div>
        </div>
      </div>

      {/* Animated border effect */}
      <div className="absolute bottom-0 left-0 right-0 h-px">
        <div 
          className="h-full w-1/3 mx-auto bg-gradient-to-r from-transparent via-blue-500/30 to-transparent animate-pulse"
          style={{ animationDuration: '2s' }}
        ></div>
      </div>
    </div>
  );
};

export default SocialProofStrip;