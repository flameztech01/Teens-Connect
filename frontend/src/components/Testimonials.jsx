import React from 'react';
import { MessageSquare, Users, Target, Star, Sparkles, Quote, Heart } from 'lucide-react';

const Testimonials = () => {
  const testimonials = [
    {
      name: "Amara",
      age: 16,
      story: "I found study partners",
      quote: "Before Teens Connect, I struggled with math alone. Now I have three study buddies and my grades improved by 2 letter grades!",
      icon: <Users className="w-5 h-5" />,
      color: "#0B4797",
      gradient: "from-blue-500 to-blue-600",
      category: "Academic Success",
      duration: "Member for 8 months",
      emoji: "📚"
    },
    {
      name: "Chidi",
      age: 15,
      story: "I learned a new skill",
      quote: "The digital art workshops helped me discover my talent. I just sold my first design commission online!",
      icon: <Target className="w-5 h-5" />,
      color: "#E6A308",
      gradient: "from-amber-500 to-amber-600",
      category: "Skill Development",
      duration: "Member for 6 months",
      emoji: "🎨"
    },
    {
      name: "Zainab",
      age: 17,
      story: "I met mentors",
      quote: "Through the mentorship program, I connected with a software engineer who guided me through my first coding project.",
      icon: <MessageSquare className="w-5 h-5" />,
      color: "#10B981",
      gradient: "from-emerald-500 to-emerald-600",
      category: "Mentorship",
      duration: "Member for 10 months",
      emoji: "💻"
    },
    {
      name: "Emeka",
      age: 14,
      story: "Found my confidence",
      quote: "I used to be shy in group settings. The public speaking community helped me find my voice and confidence.",
      icon: <Heart className="w-5 h-5" />,
      color: "#EC4899",
      gradient: "from-pink-500 to-pink-600",
      category: "Personal Growth",
      duration: "Member for 4 months",
      emoji: "🎤"
    },
    {
      name: "Fatima",
      age: 16,
      story: "Built real friendships",
      quote: "Moving cities was hard, but I found genuine friends here who share my interests in photography and music.",
      icon: <Users className="w-5 h-5" />,
      color: "#8B5CF6",
      gradient: "from-purple-500 to-purple-600",
      category: "Friendship",
      duration: "Member for 1 year",
      emoji: "📸"
    },
    {
      name: "Tunde",
      age: 15,
      story: "Started a project",
      quote: "The entrepreneurship group helped me launch a small eco-friendly products business with other teens.",
      icon: <Sparkles className="w-5 h-5" />,
      color: "#06B6D4",
      gradient: "from-cyan-500 to-cyan-600",
      category: "Entrepreneurship",
      duration: "Member for 7 months",
      emoji: "🚀"
    }
  ];

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-gray-50 to-white py-12 sm:py-16 md:py-20">
      {/* Background Elements */}
      <div className="absolute inset-0">
        {/* Conversation Bubbles Pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%230B4797' fill-opacity='0.05'%3E%3Cpath d='M20,40 C20,25 30,20 45,20 C60,20 70,25 70,40 C70,55 60,60 45,60 L40,65 L40,60 C30,60 20,55 20,40 Z M25,35 C25,30 30,25 40,25 C50,25 55,30 55,35 C55,40 50,45 40,45 L35,50 L35,45 C30,45 25,40 25,35 Z'/%3E%3Cpath d='M20,80 C20,65 30,60 45,60 C60,60 70,65 70,80 C70,95 60,100 45,100 L40,105 L40,100 C30,100 20,95 20,80 Z' transform='translate(50, 0)'/%3E%3C/g%3E%3C/svg%3E")`,
            backgroundSize: '100px 100px'
          }}></div>
        </div>
        
        {/* Gradient Orbs */}
        <div className="absolute top-0 left-0 w-64 h-64 rounded-full bg-blue-100/20 blur-3xl"></div>
        <div className="absolute bottom-0 right-0 w-72 h-72 rounded-full bg-amber-100/20 blur-3xl"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-10 sm:mb-12 md:mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white rounded-full border border-gray-200 shadow-sm mb-5">
            <Quote className="w-4 h-4" style={{ color: '#E6A308' }} />
            <span className="text-sm font-semibold tracking-wider uppercase" style={{ color: '#0B4797' }}>
              REAL TEEN STORIES
            </span>
            <div className="w-2 h-2 rounded-full animate-pulse" style={{ backgroundColor: '#E6A308' }}></div>
          </div>

          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight mb-4">
            <span className="block text-gray-900">
              Stories of{' '}
              <span className="relative">
                <span className="relative z-10" style={{ color: '#0B4797' }}>Growth</span>
                <span className="absolute bottom-1 left-0 right-0 h-2.5 bg-blue-100/50 -z-10"></span>
              </span>
              {' '}& Connection
            </span>
            <span className="block text-lg sm:text-xl md:text-2xl font-semibold text-gray-600 mt-2">
              From teens just like you
            </span>
          </h2>

          <p className="text-base sm:text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
            Hear from real members about their journeys, friendships, and achievements
          </p>
        </div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {testimonials.map((testimonial, index) => (
            <div 
              key={index}
              className="group relative"
            >
              {/* Testimonial Card */}
              <div className="relative h-full bg-white rounded-2xl border border-gray-200 p-6 transition-all duration-300 hover:shadow-xl hover:-translate-y-1 overflow-hidden">
                {/* Quote Icon */}
                <div className="absolute top-4 right-4 opacity-10 group-hover:opacity-20 transition-opacity duration-300">
                  <Quote className="w-8 h-8" style={{ color: testimonial.color }} />
                </div>

                {/* Top Section - Profile & Story */}
                <div className="mb-5">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      {/* Avatar */}
                      <div 
                        className="w-12 h-12 rounded-full flex items-center justify-center text-white font-bold"
                        style={{ 
                          background: `linear-gradient(135deg, ${testimonial.color}, ${testimonial.color}CC)`
                        }}
                      >
                        {testimonial.name.charAt(0)}
                      </div>
                      
                      {/* Name & Age */}
                      <div>
                        <div className="font-bold text-gray-900">{testimonial.name}, {testimonial.age}</div>
                        <div className="text-xs text-gray-500">{testimonial.duration}</div>
                      </div>
                    </div>

                    {/* Emoji */}
                    <div className="text-2xl transform transition-transform duration-300 group-hover:scale-110">
                      {testimonial.emoji}
                    </div>
                  </div>

                  {/* Story Type */}
                  <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full mb-3"
                    style={{ 
                      backgroundColor: `${testimonial.color}15`,
                      border: `1px solid ${testimonial.color}30`
                    }}
                  >
                    <div style={{ color: testimonial.color }}>
                      {testimonial.icon}
                    </div>
                    <span 
                      className="text-sm font-semibold"
                      style={{ color: testimonial.color }}
                    >
                      {testimonial.story}
                    </span>
                  </div>
                </div>

                {/* Quote */}
                <div className="mb-6">
                  <p className="text-gray-700 italic leading-relaxed relative">
                    <Quote className="w-4 h-4 inline mr-1 -mt-1 opacity-50" style={{ color: testimonial.color }} />
                    {testimonial.quote}
                  </p>
                </div>

                {/* Bottom Section */}
                <div className="pt-4 border-t border-gray-100">
                  {/* Category */}
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-medium text-gray-500">{testimonial.category}</span>
                    
                    {/* Stars */}
                    <div className="flex items-center gap-0.5">
                      {[...Array(5)].map((_, i) => (
                        <Star 
                          key={i}
                          className="w-3 h-3 fill-amber-400 text-amber-400"
                        />
                      ))}
                    </div>
                  </div>

                  {/* Progress Indicator */}
                  <div className="mt-3">
                    <div className="w-full bg-gray-200 rounded-full h-1.5">
                      <div 
                        className="h-1.5 rounded-full transition-all duration-500 group-hover:w-full"
                        style={{ 
                          backgroundColor: testimonial.color,
                          width: `${(index + 1) * 15}%`
                        }}
                      ></div>
                    </div>
                  </div>
                </div>

                {/* Hover Overlay */}
                <div 
                  className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  style={{
                    background: `linear-gradient(135deg, ${testimonial.color}05, transparent 50%)`
                  }}
                ></div>
              </div>

              {/* Floating Shadow Effect */}
              <div 
                className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10"
                style={{
                  boxShadow: `0 20px 40px -10px ${testimonial.color}30`
                }}
              ></div>
            </div>
          ))}
        </div>

        {/* Stats & CTA */}
        <div className="mt-12 sm:mt-16">
          <div className="bg-gradient-to-r from-blue-50/50 to-amber-50/50 rounded-2xl p-6 sm:p-8 border border-gray-200">
            <div className="flex flex-col lg:flex-row items-center justify-between gap-6">
              {/* Left Stats */}
              <div className="flex-1">
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  {[
                    { value: "500+", label: "Stories Shared", color: "#0B4797" },
                    { value: "4.8", label: "Average Rating", color: "#E6A308" },
                    { value: "95%", label: "Would Recommend", color: "#10B981" },
                    { value: "1k+", label: "Friendships Formed", color: "#8B5CF6" }
                  ].map((stat, i) => (
                    <div key={i} className="text-center">
                      <div 
                        className="text-2xl font-bold mb-1"
                        style={{ color: stat.color }}
                      >
                        {stat.value}
                      </div>
                      <div className="text-xs font-medium text-gray-500">{stat.label}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Right Content */}
              <div className="lg:w-1/3">
                <div className="text-center">
                  <div className="flex items-center justify-center gap-2 mb-3">
                    {[...Array(3)].map((_, i) => (
                      <div 
                        key={i}
                        className="w-8 h-8 rounded-full border-2 border-white shadow-sm"
                        style={{ 
                          backgroundColor: i === 0 ? '#0B4797' : i === 1 ? '#E6A308' : '#10B981',
                          marginLeft: i > 0 ? '-8px' : '0',
                          zIndex: 3 - i
                        }}
                      ></div>
                    ))}
                  </div>
                  <p className="text-sm text-gray-600 font-medium">
                    Join hundreds of teens sharing their journey
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Share Your Story Prompt */}
          <div className="mt-8 text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white rounded-full border border-gray-200 shadow-sm">
              <Sparkles className="w-4 h-4" style={{ color: '#E6A308' }} />
              <span className="text-sm font-medium text-gray-700">
                Have a story to share? <span className="font-semibold" style={{ color: '#0B4797' }}>Tell us about your journey</span>
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;