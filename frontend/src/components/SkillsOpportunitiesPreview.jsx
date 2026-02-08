import React from 'react';
import { Link } from 'react-router-dom';
import { TrendingUp, Briefcase, Users, Target, Award, Zap, ArrowRight, Star, Calendar, MapPin } from 'lucide-react';

const SkillsOpportunitiesPreview = () => {
  const skillOfTheMonth = {
    title: "Digital Content Creation",
    description: "Master storytelling through video, graphics, and social media",
    icon: <TrendingUp className="w-6 h-6" />,
    color: "#0B4797",
    gradient: "from-blue-500 to-blue-600",
    level: "Beginner to Intermediate",
    duration: "4-week program",
    progress: "65% enrolled",
    badges: ["Video Editing", "Graphic Design", "Social Strategy"],
    emoji: "🎬",
    stats: {
      participants: "180 teens",
      completion: "92% rate",
      projects: "45+ created"
    }
  };

  const opportunities = [
    {
      type: "Internship",
      title: "Social Media Assistant",
      organization: "Teen Creative Agency",
      description: "Part-time remote role managing social content",
      icon: <Briefcase className="w-5 h-5" />,
      color: "#E6A308",
      duration: "3 months",
      location: "Remote",
      applicants: "24 applied",
      deadline: "Nov 30",
      status: "Open",
      featured: true
    },
    {
      type: "Volunteering",
      title: "Youth Mentor",
      organization: "Community Tech Hub",
      description: "Guide younger teens in basic digital skills",
      icon: <Users className="w-5 h-5" />,
      color: "#10B981",
      duration: "6 weeks",
      location: "Lagos",
      applicants: "18 spots left",
      deadline: "Rolling",
      status: "Open",
      featured: false
    },
    {
      type: "Gig",
      title: "Event Photographer",
      organization: "Youth Fest 2023",
      description: "Capture moments at our annual youth festival",
      icon: <Target className="w-5 h-5" />,
      color: "#8B5CF6",
      duration: "2 days",
      location: "Abuja",
      applicants: "8 positions",
      deadline: "Nov 25",
      status: "Limited",
      featured: true
    },
    {
      type: "Mentorship",
      title: "Career Guidance Session",
      organization: "Tech Leaders Network",
      description: "1-on-1 with industry professionals",
      icon: <Award className="w-5 h-5" />,
      color: "#EC4899",
      duration: "Monthly",
      location: "Virtual",
      applicants: "12 slots",
      deadline: "Ongoing",
      status: "Open",
      featured: false
    }
  ];

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-white to-blue-50/20 py-12 sm:py-16 md:py-20">
      {/* Background Elements */}
      <div className="absolute inset-0">
        {/* Circuit Pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M11 18c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm48 25c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm-43-7c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm63 31c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM34 90c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm56-76c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM12 86c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm28-65c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm23-11c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-6 60c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm29 22c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zM32 63c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm57-13c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-9-21c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM60 91c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM35 41c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM12 60c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2z' fill='%230B4797' fill-opacity='0.1' fill-rule='evenodd'/%3E%3C/svg%3E")`,
            backgroundSize: '100px 100px'
          }}></div>
        </div>
        
        {/* Gradient Orbs */}
        <div className="absolute top-10 left-10 w-48 h-48 rounded-full bg-blue-100/30 blur-3xl"></div>
        <div className="absolute bottom-10 right-10 w-56 h-56 rounded-full bg-amber-100/30 blur-3xl"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-10 sm:mb-12 md:mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white rounded-full border border-gray-200 shadow-sm mb-5">
            <Zap className="w-4 h-4" style={{ color: '#E6A308' }} />
            <span className="text-sm font-semibold tracking-wider uppercase" style={{ color: '#0B4797' }}>
              GROWTH & OPPORTUNITIES
            </span>
            <div className="w-2 h-2 rounded-full animate-pulse" style={{ backgroundColor: '#E6A308' }}></div>
          </div>

          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight mb-4">
            <span className="block text-gray-900">
              Build Skills,{' '}
              <span className="relative">
                <span className="relative z-10" style={{ color: '#0B4797' }}>Grab Opportunities</span>
                <span className="absolute bottom-1 left-0 right-0 h-2.5 bg-blue-100/50 -z-10"></span>
              </span>
            </span>
            <span className="block text-lg sm:text-xl md:text-2xl font-semibold text-gray-600 mt-2">
              From learning to real-world experience
            </span>
          </h2>

          <p className="text-base sm:text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
            Develop marketable skills and access exclusive opportunities designed for teens
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8 lg:gap-12">
          {/* Left Column - Skill of the Month */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
              {/* Skill Header */}
              <div className="relative p-6 sm:p-8" style={{ backgroundColor: '#0B479710' }}>
                <div className="absolute top-4 right-4">
                  <div className="flex items-center gap-1 px-3 py-1 rounded-full bg-white border border-gray-200">
                    <Star className="w-3 h-3 text-amber-500 fill-amber-500" />
                    <span className="text-xs font-semibold" style={{ color: '#0B4797' }}>
                      Skill of the Month
                    </span>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
                  {/* Icon */}
                  <div className={`p-4 rounded-xl bg-gradient-to-br ${skillOfTheMonth.gradient} shadow-lg`}>
                    <div className="text-white">
                      {skillOfTheMonth.icon}
                    </div>
                  </div>

                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-2xl font-bold" style={{ color: skillOfTheMonth.color }}>
                        {skillOfTheMonth.title}
                      </h3>
                      <div className="text-3xl">{skillOfTheMonth.emoji}</div>
                    </div>
                    
                    <p className="text-gray-700 mb-4">
                      {skillOfTheMonth.description}
                    </p>

                    <div className="flex flex-wrap gap-3">
                      {skillOfTheMonth.badges.map((badge, i) => (
                        <span 
                          key={i}
                          className="px-3 py-1 rounded-full text-xs font-medium border"
                          style={{ 
                            backgroundColor: `${skillOfTheMonth.color}15`,
                            borderColor: `${skillOfTheMonth.color}30`,
                            color: skillOfTheMonth.color
                          }}
                        >
                          {badge}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Skill Details */}
              <div className="p-6 sm:p-8">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                  {/* Stats */}
                  <div className="space-y-4">
                    <div>
                      <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">
                        Level
                      </div>
                      <div className="font-semibold text-gray-900">{skillOfTheMonth.level}</div>
                    </div>
                    <div>
                      <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">
                        Duration
                      </div>
                      <div className="font-semibold text-gray-900">{skillOfTheMonth.duration}</div>
                    </div>
                    <div>
                      <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">
                        Enrollment
                      </div>
                      <div className="font-semibold" style={{ color: skillOfTheMonth.color }}>
                        {skillOfTheMonth.progress}
                      </div>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div className="md:col-span-2">
                    <div className="mb-2 flex justify-between">
                      <span className="text-sm font-medium text-gray-700">Program Progress</span>
                      <span className="text-sm font-semibold" style={{ color: skillOfTheMonth.color }}>
                        65%
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                      <div 
                        className="h-2.5 rounded-full"
                        style={{ 
                          backgroundColor: skillOfTheMonth.color,
                          width: '65%'
                        }}
                      ></div>
                    </div>
                    <div className="flex justify-between mt-4 text-sm text-gray-500">
                      <span>Week 1-2: Foundations</span>
                      <span>Week 3-4: Projects</span>
                    </div>
                  </div>
                </div>

                {/* Impact Stats */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-4 bg-gray-50 rounded-xl">
                  {Object.entries(skillOfTheMonth.stats).map(([key, value], i) => (
                    <div key={i} className="text-center">
                      <div className="text-lg font-bold mb-1" style={{ color: skillOfTheMonth.color }}>
                        {value}
                      </div>
                      <div className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                        {key.replace(/([A-Z])/g, ' $1').trim()}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Opportunities */}
          <div>
            <div className="sticky top-6">
              <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
                {/* Opportunities Header */}
                <div className="p-6 border-b border-gray-200">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xl font-bold text-gray-900">Open Opportunities</h3>
                    <div className="text-xs font-semibold px-2 py-1 rounded-full bg-green-100 text-green-800">
                      {opportunities.filter(o => o.status === "Open").length} open
                    </div>
                  </div>
                  <p className="text-sm text-gray-600">
                    Real-world experiences waiting for you
                  </p>
                </div>

                {/* Opportunities List */}
                <div className="divide-y divide-gray-100">
                  {opportunities.map((opportunity, index) => (
                    <Link
                      key={index}
                      to="/skills-opportunities"
                      className="group block p-4 hover:bg-blue-50/50 transition-colors duration-200"
                    >
                      <div className="flex items-start gap-3">
                        {/* Type Badge */}
                        <div className="flex-shrink-0">
                          <div 
                            className="w-10 h-10 rounded-lg flex items-center justify-center"
                            style={{ backgroundColor: `${opportunity.color}15` }}
                          >
                            <div style={{ color: opportunity.color }}>
                              {opportunity.icon}
                            </div>
                          </div>
                        </div>

                        {/* Content */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <span 
                              className="text-xs font-semibold px-2 py-0.5 rounded"
                              style={{ 
                                backgroundColor: `${opportunity.color}15`,
                                color: opportunity.color
                              }}
                            >
                              {opportunity.type}
                            </span>
                            {opportunity.featured && (
                              <span className="text-xs px-2 py-0.5 rounded bg-amber-100 text-amber-800 font-semibold">
                                Featured
                              </span>
                            )}
                          </div>

                          <h4 className="font-semibold text-gray-900 group-hover:text-blue-700 transition-colors duration-200">
                            {opportunity.title}
                          </h4>
                          
                          <p className="text-xs text-gray-600 mt-0.5">
                            {opportunity.organization}
                          </p>

                          {/* Details */}
                          <div className="flex flex-wrap items-center gap-3 mt-2 text-xs text-gray-500">
                            <div className="flex items-center gap-1">
                              <Calendar className="w-3 h-3" />
                              <span>{opportunity.duration}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <MapPin className="w-3 h-3" />
                              <span>{opportunity.location}</span>
                            </div>
                            <div 
                              className="font-semibold"
                              style={{ color: opportunity.color }}
                            >
                              {opportunity.applicants}
                            </div>
                          </div>

                          {/* Deadline */}
                          <div className="flex items-center justify-between mt-2">
                            <span className="text-xs font-medium">
                              Deadline: <span className="font-semibold">{opportunity.deadline}</span>
                            </span>
                            <span 
                              className="text-xs font-semibold px-2 py-0.5 rounded"
                              style={{ 
                                backgroundColor: opportunity.status === "Open" ? "#10B98115" : "#E6A30815",
                                color: opportunity.status === "Open" ? "#10B981" : "#E6A308"
                              }}
                            >
                              {opportunity.status}
                            </span>
                          </div>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>

                {/* Quick Apply Stats */}
                <div className="p-4 bg-gray-50 border-t border-gray-200">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Average application time:</span>
                    <span className="font-semibold text-gray-900">8 minutes</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="mt-10 sm:mt-12 md:mt-16">
          <div className="bg-gradient-to-r from-blue-500/5 via-amber-500/5 to-blue-500/5 rounded-2xl p-6 sm:p-8 border border-gray-200">
            <div className="flex flex-col lg:flex-row items-center justify-between gap-6">
              {/* Left Content */}
              <div className="flex-1">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-blue-500 to-amber-500 flex items-center justify-center">
                    <Target className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 text-lg">Ready to level up?</h3>
                    <p className="text-sm text-gray-600">
                      Access 50+ skills programs and 100+ opportunities
                    </p>
                  </div>
                </div>

                {/* Quick Stats */}
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mt-6">
                  {[
                    { label: "Skills Programs", value: "50+", color: "#0B4797" },
                    { label: "Active Opportunities", value: "100+", color: "#E6A308" },
                    { label: "Success Rate", value: "95%", color: "#10B981" }
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
              </div>

              {/* CTA Button */}
              <div className="lg:w-1/3">
                <Link
                  to="/skills-opportunities"
                  className="group relative w-full py-4 rounded-xl font-semibold text-sm transition-all duration-300 hover:shadow-xl active:scale-95 flex items-center justify-center gap-3"
                >
                  <span className="relative z-10 flex items-center gap-2 text-white">
                    Explore Skills & Opportunities
                    <ArrowRight className="w-5 h-5 transform transition-transform duration-300 group-hover:translate-x-1" />
                  </span>
                  <div 
                    className="absolute inset-0 rounded-xl bg-gradient-to-r from-blue-600 to-amber-500 opacity-100 group-hover:from-blue-700 group-hover:to-amber-600 transition-all duration-300"
                  ></div>
                  {/* Shimmer Effect */}
                  <div 
                    className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                    style={{
                      background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent)',
                      backgroundSize: '200% 100%',
                      animation: 'shimmer 2s infinite'
                    }}
                  ></div>
                </Link>

                <p className="text-xs text-center text-gray-500 mt-3">
                  Join 500+ teens who've landed opportunities through our platform
                </p>
              </div>
            </div>
          </div>

          {/* Success Stories */}
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            {[
              { name: "Chinedu", achievement: "Got photography gig", color: "#0B4797" },
              { name: "Amina", achievement: "Social media internship", color: "#E6A308" },
              { name: "Tobi", achievement: "Built app portfolio", color: "#8B5CF6" },
              { name: "Grace", achievement: "Volunteer coordinator", color: "#10B981" }
            ].map((story, i) => (
              <div 
                key={i}
                className="flex items-center gap-2 px-3 py-2 rounded-lg bg-white border border-gray-200"
              >
                <div 
                  className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white"
                  style={{ backgroundColor: story.color }}
                >
                  {story.name.charAt(0)}
                </div>
                <div className="text-xs">
                  <div className="font-semibold text-gray-900">{story.name}</div>
                  <div className="text-gray-500">{story.achievement}</div>
                </div>
              </div>
            ))}
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

export default SkillsOpportunitiesPreview;