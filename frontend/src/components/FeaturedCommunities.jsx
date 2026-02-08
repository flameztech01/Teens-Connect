import React from 'react';
import { Link } from 'react-router-dom';
import { Users, MessageSquare, Target, BookOpen, Cpu, Palette, ArrowRight, TrendingUp, Sparkles } from 'lucide-react';

const FeaturedCommunities = () => {
  const communities = [
    {
      name: "Daily Growth Check-In",
      description: "Start your day with positive intentions and daily goal-setting",
      icon: <Target className="w-5 h-5" />,
      color: "#0B4797",
      gradient: "from-blue-500 to-blue-600",
      members: "240+ active",
      activity: "Daily",
      emoji: "🌅",
      link: "/community/daily-growth"
    },
    {
      name: "Connect & Collaborate",
      description: "Work on projects and ideas with like-minded peers",
      icon: <Users className="w-5 h-5" />,
      color: "#E6A308",
      gradient: "from-amber-500 to-amber-600",
      members: "180+ active",
      activity: "Weekly projects",
      emoji: "🤝",
      link: "/community/collaborate"
    },
    {
      name: "Fun & Free Chat",
      description: "Casual conversations and light-hearted discussions",
      icon: <MessageSquare className="w-5 h-5" />,
      color: "#10B981",
      gradient: "from-emerald-500 to-emerald-600",
      members: "350+ active",
      activity: "Always active",
      emoji: "💬",
      link: "/community/fun-chat"
    },
    {
      name: "Study Buddies",
      description: "Academic support and study groups for all subjects",
      icon: <BookOpen className="w-5 h-5" />,
      color: "#8B5CF6",
      gradient: "from-purple-500 to-purple-600",
      members: "290+ active",
      activity: "Study sessions",
      emoji: "📚",
      link: "/community/study"
    },
    {
      name: "Tech Talk",
      description: "Discuss technology, coding, and digital innovation",
      icon: <Cpu className="w-5 h-5" />,
      color: "#DC2626",
      gradient: "from-red-500 to-red-600",
      members: "210+ active",
      activity: "Tech challenges",
      emoji: "💻",
      link: "/community/tech"
    },
    {
      name: "Creative Corner",
      description: "Share and explore art, writing, music, and creativity",
      icon: <Palette className="w-5 h-5" />,
      color: "#EC4899",
      gradient: "from-pink-500 to-pink-600",
      members: "190+ active",
      activity: "Creative showcases",
      emoji: "🎨",
      link: "/community/creative"
    }
  ];

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-gray-50 to-white py-12 sm:py-16 md:py-20">
      {/* Background Elements */}
      <div className="absolute inset-0">
        {/* Floating Blobs */}
        <div className="absolute top-0 left-10 w-48 h-48 rounded-full bg-blue-100/20 blur-3xl"></div>
        <div className="absolute bottom-0 right-10 w-56 h-56 rounded-full bg-amber-100/20 blur-3xl"></div>
        
        {/* Grid Pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0" style={{
            backgroundImage: 'radial-gradient(circle at 20px 20px, #0B4797 2px, transparent 2px)',
            backgroundSize: '40px 40px'
          }}></div>
        </div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-10 sm:mb-12 md:mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white rounded-full border border-gray-200 shadow-sm mb-5">
            <TrendingUp className="w-4 h-4" style={{ color: '#E6A308' }} />
            <span className="text-sm font-semibold tracking-wide" style={{ color: '#0B4797' }}>
              FEATURED COMMUNITIES
            </span>
            <div className="w-2 h-2 rounded-full animate-pulse" style={{ backgroundColor: '#E6A308' }}></div>
          </div>

          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight mb-4">
            <span className="block text-gray-900">
              Find Your{' '}
              <span className="relative">
                <span className="relative z-10" style={{ color: '#0B4797' }}>Perfect</span>
                <span className="absolute bottom-1 left-0 right-0 h-2.5 bg-blue-100/50 -z-10"></span>
              </span>
              {' '}Space
            </span>
            <span className="block text-lg sm:text-xl md:text-2xl font-semibold text-gray-600 mt-2">
              Explore our most active and engaging communities
            </span>
          </h2>

          <p className="text-base sm:text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
            Join thousands of teens in communities designed for growth, connection, and fun
          </p>
        </div>

        {/* Communities Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {communities.map((community, index) => (
            <Link
              key={index}
              to={community.link}
              className="group relative block"
            >
              {/* Card Container */}
              <div className="relative h-full bg-white rounded-2xl border border-gray-200 p-5 sm:p-6 transition-all duration-300 hover:shadow-xl hover:-translate-y-1 hover:border-transparent overflow-hidden">
                {/* Corner Accent */}
                <div 
                  className="absolute top-0 right-0 w-20 h-20 rounded-bl-2xl opacity-5 group-hover:opacity-10 transition-opacity duration-300"
                  style={{ backgroundColor: community.color }}
                ></div>

                {/* Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    {/* Icon Container */}
                    <div className={`relative p-2.5 rounded-lg bg-gradient-to-br ${community.gradient} shadow-sm group-hover:shadow-md transition-shadow duration-300`}>
                      <div className="text-white">
                        {community.icon}
                      </div>
                      {/* Glow Effect */}
                      <div 
                        className="absolute inset-0 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                        style={{ 
                          boxShadow: `0 0 15px 3px ${community.color}40`,
                          backgroundColor: 'transparent'
                        }}
                      ></div>
                    </div>
                    
                    {/* Emoji */}
                    <div className="text-2xl opacity-80 transform transition-transform duration-300 group-hover:scale-110">
                      {community.emoji}
                    </div>
                  </div>

                  {/* Live Indicator */}
                  <div className="flex items-center gap-1.5 px-2 py-1 rounded-full bg-green-50 border border-green-100">
                    <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></div>
                    <span className="text-xs font-semibold text-green-700">Live</span>
                  </div>
                </div>

                {/* Content */}
                <div className="space-y-3">
                  <h3 
                    className="text-lg font-bold tracking-tight group-hover:scale-105 transition-transform duration-300 inline-block"
                    style={{ color: community.color }}
                  >
                    {community.name}
                  </h3>
                  
                  <p className="text-gray-600 text-sm leading-relaxed">
                    {community.description}
                  </p>

                  {/* Stats */}
                  <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-1.5">
                        <Users className="w-4 h-4 text-gray-400" />
                        <span className="text-xs font-semibold text-gray-600">
                          {community.members}
                        </span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Sparkles className="w-4 h-4 text-gray-400" />
                        <span className="text-xs font-medium text-gray-500">
                          {community.activity}
                        </span>
                      </div>
                    </div>

                    {/* View Link */}
                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transform translate-x-2 group-hover:translate-x-0 transition-all duration-300">
                      <span className="text-xs font-semibold" style={{ color: community.color }}>
                        View Community
                      </span>
                      <ArrowRight className="w-3 h-3" style={{ color: community.color }} />
                    </div>
                  </div>
                </div>

                {/* Bottom Gradient Line */}
                <div 
                  className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-transparent to-transparent group-hover:from-transparent group-hover:via-white group-hover:to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  style={{
                    backgroundImage: `linear-gradient(90deg, transparent, ${community.color}40, transparent)`
                  }}
                ></div>
              </div>

              {/* Hover Glow */}
              <div 
                className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10"
                style={{
                  background: `radial-gradient(circle at center, ${community.color}10, transparent 70%)`,
                }}
              ></div>
            </Link>
          ))}
        </div>

        {/* View All CTA */}
        <div className="mt-12 sm:mt-16 text-center">
          <div className="inline-flex flex-col sm:flex-row items-center gap-6 bg-white rounded-2xl p-6 sm:p-8 border border-gray-200 shadow-sm max-w-3xl mx-auto">
            {/* Stats Summary */}
            <div className="text-left">
              <p className="font-semibold text-gray-900 text-lg mb-1">
                Join 1,500+ Teens Across All Communities
              </p>
              <p className="text-sm text-gray-500">
                And growing every day! Find your perfect space to connect and grow.
              </p>
            </div>

            {/* Divider */}
            <div className="hidden sm:block w-px h-12 bg-gradient-to-b from-transparent via-gray-200 to-transparent"></div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-3">
              <Link
                to="/community"
                className="group relative px-6 py-3 rounded-lg font-semibold text-sm transition-all duration-300 hover:shadow-md active:scale-95"
              >
                <span className="relative z-10 flex items-center justify-center gap-2 text-white">
                  Explore All Communities
                  <ArrowRight className="w-4 h-4 transform transition-transform duration-300 group-hover:translate-x-1" />
                </span>
                <div 
                  className="absolute inset-0 rounded-lg bg-gradient-to-r from-blue-600 to-amber-500 opacity-100 group-hover:from-blue-700 group-hover:to-amber-600 transition-all duration-300"
                ></div>
              </Link>
              
              <Link
                to="/join"
                className="group px-6 py-3 rounded-lg font-semibold text-sm border-2 transition-all duration-300 hover:shadow-md text-center"
                style={{
                  borderColor: '#0B4797',
                  color: '#0B4797',
                  backgroundColor: 'transparent',
                }}
              >
                <span className="flex items-center justify-center gap-2">
                  Quick Join
                  <Sparkles className="w-4 h-4" />
                </span>
              </Link>
            </div>
          </div>

          {/* Mobile Swipe Hint */}
          <div className="sm:hidden mt-6">
            <div className="flex items-center justify-center gap-2 text-sm text-gray-500">
              <span>← Swipe to explore →</span>
            </div>
          </div>

          {/* Popular Tags */}
          <div className="mt-8 flex flex-wrap justify-center gap-2">
            {["#Growth", "#Study", "#Tech", "#Creative", "#Social", "#Support"].map((tag, i) => (
              <span
                key={i}
                className="px-3 py-1.5 rounded-full text-xs font-medium border border-gray-200 bg-white hover:border-blue-200 hover:bg-blue-50 transition-all duration-200 cursor-pointer"
                style={{ 
                  color: i === 0 ? '#0B4797' : i === 1 ? '#8B5CF6' : '#4B5563' 
                }}
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default FeaturedCommunities;