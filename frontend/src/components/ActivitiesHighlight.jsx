import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar, Target, Trophy, Users, Sparkles, Clock, MapPin, ArrowRight, Zap } from 'lucide-react';

const ActivitiesHighlight = () => {
  const activities = [
    {
      title: "Weekly Workshop",
      description: "Digital Art Basics: Learn illustration with Canva",
      icon: <Sparkles className="w-5 h-5" />,
      color: "#0B4797",
      gradient: "from-blue-500 to-blue-600",
      time: "Today, 4:00 PM",
      duration: "1.5 hours",
      participants: "45 joined",
      status: "Starting soon",
      badge: "Popular",
      emoji: "🎨"
    },
    {
      title: "Challenge of the Week",
      description: "7-Day Coding Challenge: Build a mini portfolio",
      icon: <Target className="w-5 h-5" />,
      color: "#E6A308",
      gradient: "from-amber-500 to-amber-600",
      time: "Ongoing",
      duration: "7 days",
      participants: "120 participants",
      status: "Active",
      badge: "Trending",
      emoji: "💻"
    },
    {
      title: "Spotlight Session",
      description: "Q&A with Youth Entrepreneur: Sarah Adewale",
      icon: <Trophy className="w-5 h-5" />,
      color: "#8B5CF6",
      gradient: "from-purple-500 to-purple-600",
      time: "Tomorrow, 6:00 PM",
      duration: "1 hour",
      participants: "85 registered",
      status: "Register now",
      badge: "Featured",
      emoji: "🌟"
    },
    {
      title: "Community Hangout",
      description: "Virtual Game Night: Among Us & Virtual Trivia",
      icon: <Users className="w-5 h-5" />,
      color: "#10B981",
      gradient: "from-emerald-500 to-emerald-600",
      time: "Friday, 7:00 PM",
      duration: "2 hours",
      participants: "200+ expected",
      status: "Open to all",
      badge: "Fun",
      emoji: "🎮"
    }
  ];

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-white to-gray-50 py-12 sm:py-16">
      {/* Background Elements */}
      <div className="absolute inset-0">
        {/* Animated Grid */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0" style={{
            backgroundImage: `linear-gradient(90deg, transparent 95%, #0B4797 100%),
                            linear-gradient(180deg, transparent 95%, #E6A308 100%)`,
            backgroundSize: '30px 30px'
          }}></div>
        </div>
        
        {/* Floating Blobs */}
        <div className="absolute -top-20 right-1/4 w-64 h-64 rounded-full bg-blue-100/20 blur-3xl"></div>
        <div className="absolute -bottom-20 left-1/4 w-72 h-72 rounded-full bg-amber-100/20 blur-3xl"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8 sm:mb-10">
          <div>
            <div className="inline-flex items-center gap-2 mb-3">
              <div className="p-1.5 rounded-md bg-gradient-to-br from-blue-500 to-amber-500">
                <Zap className="w-4 h-4 text-white" />
              </div>
              <span className="text-sm font-semibold tracking-wider uppercase" style={{ color: '#0B4797' }}>
                This Week's Highlights
              </span>
              <div className="w-2 h-2 rounded-full bg-amber-500 animate-pulse"></div>
            </div>
            
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">
              <span className="block text-gray-900">
                What's{' '}
                <span className="relative">
                  <span className="relative z-10" style={{ color: '#0B4797' }}>Happening</span>
                  <span className="absolute bottom-1 left-0 right-0 h-2.5 bg-blue-100/50 -z-10"></span>
                </span>
              </span>
              <span className="block text-lg sm:text-xl font-semibold text-gray-600 mt-1">
                Join exciting activities with fellow teens
              </span>
            </h2>
          </div>

          {/* Live Counter */}
          <div className="flex items-center gap-3 px-4 py-2.5 bg-white rounded-lg border border-gray-200 shadow-sm">
            <div className="relative">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center">
                <Calendar className="w-4 h-4 text-white" />
              </div>
              <div className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-red-500 animate-pulse"></div>
            </div>
            <div>
              <div className="text-sm font-semibold text-gray-900">Live Activities</div>
              <div className="text-xs text-gray-500">This week only</div>
            </div>
          </div>
        </div>

        {/* Activities Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6 mb-8 sm:mb-10">
          {activities.map((activity, index) => (
            <div 
              key={index}
              className="group relative"
            >
              {/* Card Container */}
              <div className="relative h-full bg-white rounded-xl border border-gray-200 p-5 transition-all duration-300 hover:shadow-lg hover:-translate-y-1 hover:border-transparent overflow-hidden">
                {/* Status Badge */}
                <div className="absolute top-3 right-3 z-10">
                  <span 
                    className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-semibold"
                    style={{ 
                      backgroundColor: `${activity.color}15`,
                      color: activity.color
                    }}
                  >
                    {activity.badge}
                  </span>
                </div>

                {/* Top Section */}
                <div className="mb-4">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      {/* Icon Container */}
                      <div className={`p-2.5 rounded-lg bg-gradient-to-br ${activity.gradient} shadow-sm`}>
                        <div className="text-white">
                          {activity.icon}
                        </div>
                      </div>
                      
                      {/* Emoji */}
                      <div className="text-2xl transform transition-transform duration-300 group-hover:scale-110">
                        {activity.emoji}
                      </div>
                    </div>
                  </div>

                  {/* Title */}
                  <h3 
                    className="text-lg font-bold mt-3 group-hover:scale-105 transition-transform duration-300 inline-block"
                    style={{ color: activity.color }}
                  >
                    {activity.title}
                  </h3>
                </div>

                {/* Description */}
                <p className="text-gray-700 text-sm leading-relaxed mb-4">
                  {activity.description}
                </p>

                {/* Details */}
                <div className="space-y-3 pt-3 border-t border-gray-100">
                  {/* Time */}
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-gray-400" />
                    <div className="flex-1">
                      <div className="text-xs font-semibold text-gray-900">{activity.time}</div>
                      <div className="text-xs text-gray-500">{activity.duration}</div>
                    </div>
                  </div>

                  {/* Participants */}
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4 text-gray-400" />
                    <div className="flex-1">
                      <div className="text-xs font-semibold text-gray-900">{activity.participants}</div>
                      <div className="text-xs text-gray-500">Capacity: 250</div>
                    </div>
                  </div>

                  {/* Status Indicator */}
                  <div className="flex items-center justify-between pt-2">
                    <div className="flex items-center gap-1.5">
                      <div 
                        className="w-2 h-2 rounded-full animate-pulse"
                        style={{ backgroundColor: activity.color }}
                      ></div>
                      <span className="text-xs font-semibold" style={{ color: activity.color }}>
                        {activity.status}
                      </span>
                    </div>
                    
                    {/* Quick Join */}
                    <button className="opacity-0 group-hover:opacity-100 transform translate-x-2 group-hover:translate-x-0 transition-all duration-300 text-xs font-semibold px-2 py-1 rounded-md hover:shadow-sm active:scale-95"
                      style={{ 
                        backgroundColor: `${activity.color}15`,
                        color: activity.color
                      }}
                    >
                      Quick join
                    </button>
                  </div>
                </div>

                {/* Hover Overlay */}
                <div 
                  className="absolute inset-0 bg-gradient-to-br from-white via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  style={{ 
                    backgroundImage: `linear-gradient(135deg, transparent 60%, ${activity.color}05 100%)`
                  }}
                ></div>
              </div>

              {/* Connection Line (Desktop) */}
              {index < activities.length - 1 && (
                <div className="hidden lg:block absolute top-1/2 -right-2.5 transform -translate-y-1/2 z-10">
                  <ArrowRight className="w-5 h-5 text-gray-300 group-hover:text-gray-400 transition-colors duration-300" />
                </div>
              )}
            </div>
          ))}
        </div>

        {/* CTA Section */}
        <div className="bg-gradient-to-r from-blue-50/50 to-amber-50/50 rounded-2xl p-6 sm:p-8 border border-gray-200">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-6">
            {/* Left - Calendar Preview */}
            <div className="flex-1">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-14 h-14 rounded-xl bg-white border border-gray-200 shadow-sm flex flex-col items-center justify-center">
                  <div className="text-xs font-semibold text-gray-500">NOV</div>
                  <div className="text-xl font-bold" style={{ color: '#0B4797' }}>12</div>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 text-lg">Full Activities Calendar</h3>
                  <p className="text-sm text-gray-600">
                    View all workshops, challenges, and events for the month
                  </p>
                </div>
              </div>

              {/* Upcoming Preview */}
              <div className="grid grid-cols-2 gap-3 mt-4">
                {[
                  { day: "Tue", activity: "Study Group", color: "#0B4797" },
                  { day: "Wed", activity: "Tech Workshop", color: "#E6A308" },
                  { day: "Thu", activity: "Creative Jam", color: "#8B5CF6" },
                  { day: "Fri", activity: "Game Night", color: "#10B981" }
                ].map((item, i) => (
                  <div key={i} className="bg-white/80 rounded-lg p-2 border border-gray-100">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-semibold" style={{ color: item.color }}>
                        {item.day}
                      </span>
                      <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: item.color }}></div>
                    </div>
                    <span className="text-xs text-gray-700 font-medium">{item.activity}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Right - CTA */}
            <div className="lg:w-1/3">
              <div className="bg-white rounded-xl p-5 border border-gray-200 shadow-sm">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-amber-500 flex items-center justify-center">
                    <Sparkles className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900">Never miss an activity</div>
                    <div className="text-xs text-gray-500">Get notifications for events you love</div>
                  </div>
                </div>

                <div className="space-y-3">
                  <Link
                    to="/activities"
                    className="group relative w-full py-3 rounded-lg font-semibold text-sm transition-all duration-300 hover:shadow-md active:scale-95 flex items-center justify-center gap-2"
                  >
                    <span className="relative z-10 flex items-center gap-2 text-white">
                      See All Activities
                      <ArrowRight className="w-4 h-4 transform transition-transform duration-300 group-hover:translate-x-1" />
                    </span>
                    <div 
                      className="absolute inset-0 rounded-lg bg-gradient-to-r from-blue-600 to-amber-500 opacity-100 group-hover:from-blue-700 group-hover:to-amber-600 transition-all duration-300"
                    ></div>
                  </Link>

                  <button className="w-full py-2.5 rounded-lg font-medium text-sm border-2 transition-all duration-300 hover:shadow-sm active:scale-95 flex items-center justify-center gap-2"
                    style={{
                      borderColor: '#0B4797',
                      color: '#0B4797',
                      backgroundColor: 'transparent',
                    }}
                  >
                    <Calendar className="w-4 h-4" />
                    Add to Calendar
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="mt-8 flex flex-wrap items-center justify-center gap-4 sm:gap-6">
          {[
            { value: "4", label: "Featured Activities", suffix: "this week" },
            { value: "98%", label: "Member Satisfaction", suffix: "from events" },
            { value: "12+", label: "Hours of Content", suffix: "weekly" },
            { value: "500+", label: "Active Participants", suffix: "across activities" }
          ].map((stat, index) => (
            <div key={index} className="text-center">
              <div className="flex items-baseline justify-center gap-1">
                <div 
                  className="text-xl font-bold"
                  style={{ color: index === 0 ? '#0B4797' : index === 1 ? '#E6A308' : index === 2 ? '#8B5CF6' : '#10B981' }}
                >
                  {stat.value}
                </div>
                {stat.suffix && <div className="text-xs text-gray-500">{stat.suffix}</div>}
              </div>
              <div className="text-xs font-medium text-gray-500 mt-1">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ActivitiesHighlight;