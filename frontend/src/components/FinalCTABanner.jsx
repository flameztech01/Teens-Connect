import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles, Users, Target, Zap, Heart } from 'lucide-react';

const FinalCTABanner = () => {
  return (
    <section className="relative overflow-hidden py-16 sm:py-20 md:py-24">
      {/* Background with gradient mesh */}
      <div className="absolute inset-0">
        {/* Main gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600 via-blue-700 to-amber-600"></div>
        
        {/* Mesh pattern overlay */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M11 18c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm48 25c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm-43-7c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm63 31c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM34 90c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm56-76c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM12 86c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm28-65c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm23-11c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-6 60c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm29 22c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zM32 63c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm57-13c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-9-21c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM60 91c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM35 41c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM12 60c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2z' fill='%23ffffff' fill-opacity='1' fill-rule='evenodd'/%3E%3C/svg%3E")`,
            backgroundSize: '80px 80px'
          }}></div>
        </div>

        {/* Floating elements */}
        <div className="absolute top-1/4 left-1/4 w-64 h-64 rounded-full bg-white/5 blur-3xl"></div>
        <div className="absolute bottom-1/4 right-1/4 w-72 h-72 rounded-full bg-amber-500/10 blur-3xl"></div>
        
        {/* Animated dots */}
        {[...Array(8)].map((_, i) => (
          <div 
            key={i}
            className="absolute w-2 h-2 rounded-full bg-white/30 animate-pulse"
            style={{
              top: `${10 + i * 10}%`,
              left: `${5 + i * 12}%`,
              animationDelay: `${i * 0.5}s`,
              animationDuration: '3s'
            }}
          ></div>
        ))}
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          {/* Tagline */}
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full border border-white/20 mb-6">
            <Sparkles className="w-4 h-4 text-white" />
            <span className="text-sm font-semibold text-white tracking-wide">
              YOUR JOURNEY STARTS HERE
            </span>
            <div className="w-2 h-2 rounded-full bg-amber-400 animate-pulse"></div>
          </div>

          {/* Main Headline */}
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 tracking-tight">
            <span className="block">
              Ready to grow with{' '}
              <span className="relative">
                <span className="relative z-10">people who get you?</span>
                <span className="absolute bottom-2 left-0 right-0 h-3 bg-amber-400/30 -z-10 rounded-full"></span>
              </span>
            </span>
          </h2>

          {/* Subheadline */}
          <p className="text-xl sm:text-2xl text-blue-100 max-w-2xl mx-auto mb-10 leading-relaxed">
            Join hundreds of Nigerian teens building skills, friendships, and futures together
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            {/* Join Button */}
            <Link
              to="/join"
              className="group relative px-8 py-4 sm:px-10 sm:py-5 rounded-xl font-bold text-lg transition-all duration-300 hover:shadow-2xl active:scale-95 flex items-center justify-center gap-3 min-w-[200px]"
            >
              <span className="relative z-10 flex items-center gap-3">
                <span>Join Our Community</span>
                <ArrowRight className="w-5 h-5 transform transition-transform duration-300 group-hover:translate-x-2" />
              </span>
              <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-white to-amber-100 opacity-100"></div>
              <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div 
                className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                style={{
                  background: 'linear-gradient(90deg, #FBBF24, #F59E0B, #FBBF24)',
                  backgroundSize: '200% 100%',
                  animation: 'shimmer 2s infinite'
                }}
              ></div>
            </Link>

            {/* Contact Button */}
            <Link
              to="/contact"
              className="group relative px-8 py-4 sm:px-10 sm:py-5 rounded-xl font-bold text-lg transition-all duration-300 hover:shadow-2xl active:scale-95 flex items-center justify-center gap-3 min-w-[200px] border-2"
              style={{
                borderColor: 'white',
                color: 'white',
                backgroundColor: 'transparent',
              }}
            >
              <span className="relative z-10 flex items-center gap-3">
                <span>Contact Us</span>
                <Users className="w-5 h-5 transform transition-transform duration-300 group-hover:scale-110" />
              </span>
              <div className="absolute inset-0 rounded-xl bg-white opacity-0 group-hover:opacity-10 transition-opacity duration-300"></div>
            </Link>
          </div>

          {/* Features Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto mb-10">
            {[
              { icon: <Users className="w-5 h-5" />, label: "Peer Support", color: "#FFFFFF" },
              { icon: <Target className="w-5 h-5" />, label: "Skill Growth", color: "#FBBF24" },
              { icon: <Zap className="w-5 h-5" />, label: "Live Activities", color: "#FFFFFF" },
              { icon: <Heart className="w-5 h-5" />, label: "Safe Space", color: "#FBBF24" }
            ].map((feature, i) => (
              <div 
                key={i}
                className="flex flex-col items-center gap-2 p-4 bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 group hover:bg-white/10 transition-all duration-300"
              >
                <div 
                  className="p-2 rounded-lg group-hover:scale-110 transition-transform duration-300"
                  style={{ color: feature.color }}
                >
                  {feature.icon}
                </div>
                <span className="text-sm font-semibold text-white">{feature.label}</span>
              </div>
            ))}
          </div>

          {/* Quick Stats */}
          <div className="inline-flex flex-wrap items-center justify-center gap-6 bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
            {[
              { value: "3 min", label: "Sign up", suffix: "average" },
              { value: "Free", label: "Always", suffix: "to join" },
              { value: "24/7", label: "Support", suffix: "available" },
              { value: "500+", label: "Teens", suffix: "and growing" }
            ].map((stat, i) => (
              <div key={i} className="text-center">
                <div className="text-2xl font-bold text-white mb-1">{stat.value}</div>
                <div className="flex flex-col">
                  <span className="text-sm font-semibold text-blue-100">{stat.label}</span>
                  <span className="text-xs text-blue-200">{stat.suffix}</span>
                </div>
              </div>
            ))}
          </div>

          {/* Trust Elements */}
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
            <div className="flex items-center gap-2">
              <div className="flex -space-x-2">
                {[...Array(4)].map((_, i) => (
                  <div 
                    key={i}
                    className="w-8 h-8 rounded-full border-2 border-blue-700 bg-gradient-to-br from-blue-400 to-blue-600"
                    style={{ zIndex: 4 - i }}
                  ></div>
                ))}
              </div>
              <span className="text-sm font-medium text-blue-100">
                Joined by teens across Nigeria
              </span>
            </div>

            <div className="hidden sm:block w-px h-6 bg-white/30"></div>

            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1">
                {[...Array(5)].map((_, i) => (
                  <svg key={i} className="w-4 h-4 fill-amber-400 text-amber-400" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
              <span className="text-sm font-medium text-blue-100">
                4.8/5 from member reviews
              </span>
            </div>
          </div>

          {/* Final Encouragement */}
          <div className="mt-10 pt-8 border-t border-white/20">
            <p className="text-lg text-blue-100 font-medium">
              Your future starts with one click. <span className="font-bold text-white">Take the leap today.</span>
            </p>
          </div>
        </div>
      </div>

      {/* Animated scroll indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2">
        <div className="flex flex-col items-center gap-2">
          <span className="text-xs text-white/60 font-medium tracking-wider">BACK TO TOP</span>
          <div className="w-6 h-10 border border-white/30 rounded-full flex justify-center p-1">
            <div className="w-1 h-2 bg-gradient-to-b from-white to-amber-300 rounded-full animate-bounce"></div>
          </div>
        </div>
      </div>

      {/* CSS Animation */}
      <style jsx>{`
        @keyframes shimmer {
          0% { background-position: -200% 0; }
          100% { background-position: 200% 0; }
        }
      `}</style>
    </section>
  );
};

export default FinalCTABanner;