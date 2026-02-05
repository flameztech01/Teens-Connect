import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight, Users, Shield, Star, Sparkles, ArrowRight } from 'lucide-react';

const HomepageHero = () => {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-white via-blue-50/30 to-white">
      {/* Professional Background Elements */}
      <div className="absolute inset-0 z-0">
        {/* Subtle grid pattern */}
        <div className="absolute inset-0 opacity-[0.02]" 
          style={{
            backgroundImage: 'radial-gradient(circle at 2px 2px, #0B4797 1px, transparent 0)',
            backgroundSize: '40px 40px'
          }}
        ></div>
        
        {/* Accent gradients */}
        <div className="absolute top-0 right-0 w-[400px] h-[400px] -translate-y-1/3 translate-x-1/3">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-amber-500/5 blur-3xl rounded-full"></div>
        </div>
        <div className="absolute bottom-0 left-0 w-[300px] h-[300px] translate-y-1/3 -translate-x-1/3">
          <div className="absolute inset-0 bg-gradient-to-r from-amber-500/5 to-blue-500/5 blur-3xl rounded-full"></div>
        </div>
      </div>

      {/* Main container with responsive padding - accounting for navbar */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-8 lg:pt-20 lg:pb-12 min-h-[calc(100vh-4rem)] flex items-center">
        <div className="grid lg:grid-cols-2 gap-10 lg:gap-12 items-center w-full">
          {/* Left Column - Content */}
          <div className="space-y-6">
            {/* Professional Tagline - Compact */}
            <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-white/80 backdrop-blur-sm rounded-full border border-blue-100 shadow-sm">
              <div className="flex items-center justify-center w-5 h-5 rounded-full bg-gradient-to-r from-blue-600 to-amber-500">
                <Shield className="w-3 h-3 text-white" />
              </div>
              <span className="text-xs font-medium text-gray-700 tracking-wide">
                Verified Safe Space • Community-Driven
              </span>
            </div>

            {/* Main Headline - Compact */}
            <div className="space-y-3">
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight">
                <span className="block text-gray-900">
                  Where Teens{' '}
                  <span className="relative">
                    <span className="relative z-10" style={{ color: '#0B4797' }}>Connect</span>
                    <span className="absolute bottom-1 left-0 right-0 h-2.5 bg-blue-100/50 -z-10"></span>
                  </span>
                </span>
                <span className="block text-2xl sm:text-3xl md:text-4xl mt-1">
                  <span className="font-semibold text-gray-800">to</span>{' '}
                  <span className="font-bold" style={{ color: '#E6A308' }}>Grow</span>
                  <span className="font-bold text-gray-800">,</span>{' '}
                  <span className="font-bold" style={{ color: '#7596BD' }}>Learn</span>
                  <span className="font-bold text-gray-800">,</span>{' '}
                  <span className="font-bold" style={{ color: '#E6A308' }}>Thrive</span>
                </span>
              </h1>
            </div>

            {/* Subheadline - Compact */}
            <p className="text-base sm:text-lg text-gray-600 leading-relaxed max-w-2xl">
              A <span className="font-semibold text-blue-700">curated digital ecosystem</span> where 
              young minds collaborate and build meaningful relationships 
              in a <span className="font-semibold text-amber-600">safely moderated environment</span>.
            </p>

            {/* Value Proposition Grid - Compact */}
            <div className="grid grid-cols-2 gap-3 pt-2">
              {[
                { 
                  icon: <Shield className="w-4 h-4 text-blue-600" />, 
                  title: "Secure & Monitored", 
                  description: "24/7 safety" 
                },
                { 
                  icon: <Users className="w-4 h-4 text-amber-600" />, 
                  title: "Peer Support", 
                  description: "Like-minded" 
                },
                { 
                  icon: <Sparkles className="w-4 h-4 text-blue-500" />, 
                  title: "Skill Building", 
                  description: "Real-world" 
                },
                { 
                  icon: <Star className="w-4 h-4 text-amber-500" />, 
                  title: "Positive Impact", 
                  description: "Purpose-driven" 
                }
              ].map((item, index) => (
                <div key={index} className="group p-3 bg-white/50 backdrop-blur-sm rounded-lg border border-gray-100 hover:border-blue-200 hover:bg-white transition-all duration-300">
                  <div className="flex items-start gap-2">
                    <div className="p-1.5 rounded-md bg-gradient-to-br from-white to-gray-50 group-hover:from-blue-50 group-hover:to-blue-100/50 transition-all duration-300 border border-gray-200 group-hover:border-blue-200">
                      {item.icon}
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 text-sm">{item.title}</h3>
                      <p className="text-xs text-gray-500 mt-0.5">{item.description}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* CTA Buttons - Compact */}
            <div className="flex flex-col sm:flex-row gap-3 pt-4">
              <Link
                to="/join"
                className="group relative px-6 py-3 rounded-lg font-semibold text-base transition-all duration-300 overflow-hidden text-center"
                style={{
                  backgroundColor: '#0B4797',
                  color: 'white',
                }}
              >
                <span className="relative z-10 flex items-center justify-center gap-2">
                  Start Your Journey
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-blue-700 via-blue-600 to-amber-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </Link>
              
              <Link
                to="/features"
                className="group px-6 py-3 rounded-lg font-semibold text-base border-2 transition-all duration-300 text-center hover:shadow-md"
                style={{
                  borderColor: '#0B4797',
                  color: '#0B4797',
                  backgroundColor: 'transparent',
                }}
              >
                <span className="flex items-center justify-center gap-2">
                  Explore Features
                  <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
                </span>
              </Link>
            </div>

            {/* Trust Indicators - Compact */}
            <div className="pt-6 border-t border-gray-200/50">
              <div className="flex flex-wrap gap-4 sm:gap-6">
                {[
                  { value: "500+", label: "Members", color: "#0B4797", suffix: "" },
                  { value: "98%", label: "Feedback", color: "#E6A308", suffix: "" },
                  { value: "50+", label: "Workshops", color: "#7596BD", suffix: "" },
                  { value: "24/7", label: "Safety", color: "#0B4797", suffix: "" }
                ].map((stat, index) => (
                  <div key={index} className="text-center">
                    <div 
                      className="text-lg font-bold tracking-tight mb-0.5"
                      style={{ color: stat.color }}
                    >
                      {stat.value}
                      {stat.suffix && <span className="text-xs ml-0.5">{stat.suffix}</span>}
                    </div>
                    <div className="text-xs text-gray-500 font-medium tracking-wide">
                      {stat.label}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column - Visual - Compact */}
          <div className="relative lg:pl-6">
            {/* Main Visual Container */}
            <div className="relative">
              {/* Floating Card Grid */}
              <div className="absolute -top-4 -left-4 z-20">
                <div className="bg-white rounded-xl shadow-lg p-4 w-56 border border-gray-100 transform -rotate-3">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center">
                      <Users className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <div className="font-bold text-gray-900 text-sm">Peer Groups</div>
                      <div className="text-xs text-gray-500">Active discussions</div>
                    </div>
                  </div>
                  <div className="space-y-2">
                    {["Study Buddies", "Art Club", "Tech Talk"].map((group, i) => (
                      <div key={i} className="flex items-center justify-between p-1.5 hover:bg-gray-50 rounded-md transition-colors">
                        <span className="text-xs font-medium text-gray-700">{group}</span>
                        <span className="text-xs px-2 py-0.5 rounded-full bg-blue-100 text-blue-700 font-medium">
                          {i === 0 ? "12 online" : i === 1 ? "8 online" : "15 online"}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Main Hero Visual - Compact */}
              <div className="relative rounded-2xl overflow-hidden border-4 border-white shadow-xl">
                <div 
                  className="h-[320px] sm:h-[380px] bg-gradient-to-br from-blue-900 via-blue-700 to-blue-600 flex flex-col items-center justify-center p-6 text-white"
                  style={{
                    backgroundImage: 'linear-gradient(135deg, rgba(11, 71, 151, 0.95) 0%, rgba(117, 150, 189, 0.9) 100%)',
                  }}
                >
                  <div className="absolute inset-0">
                    <div className="absolute inset-0 opacity-10">
                      <div className="absolute top-1/4 left-1/4 w-48 h-48 rounded-full border border-white"></div>
                      <div className="absolute bottom-1/4 right-1/4 w-32 h-32 rounded-full border border-white"></div>
                    </div>
                  </div>
                  
                  <div className="relative z-10 text-center max-w-xs">
                    <div className="mb-6">
                      <div className="inline-flex items-center gap-1 px-3 py-1 bg-white/10 backdrop-blur-sm rounded-full mb-3">
                        <Sparkles className="w-3 h-3" />
                        <span className="text-xs font-medium">Live Community</span>
                      </div>
                      <h3 className="text-lg font-bold mb-2">Connect with Passionate Peers</h3>
                      <p className="text-blue-100 opacity-90 text-sm">
                        Join discussions, projects, and skill-building sessions
                      </p>
                    </div>
                    
                    {/* Animated Connection Dots - Compact */}
                    <div className="flex justify-center items-center gap-4 mb-6">
                      {[1, 2, 3, 4].map((i) => (
                        <div key={i} className="relative">
                          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-white/20 to-white/5 backdrop-blur-sm border border-white/20 flex items-center justify-center">
                            {i === 1 ? "🎨" : i === 2 ? "💻" : i === 3 ? "🎵" : "📚"}
                          </div>
                          {i < 4 && (
                            <div className="absolute top-1/2 right-0 w-4 h-0.5 bg-gradient-to-r from-white/30 to-transparent translate-x-full"></div>
                          )}
                        </div>
                      ))}
                    </div>
                    
                    <div className="grid grid-cols-3 gap-3">
                      {["Creative Arts", "Technology", "Leadership"].map((category, i) => (
                        <div key={i} className="p-2 bg-white/10 backdrop-blur-sm rounded-lg border border-white/20">
                          <div className="text-xs font-medium">{category}</div>
                          <div className="text-xs opacity-75">Active</div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Testimonial Card - Compact */}
              <div className="absolute -bottom-4 -right-4 z-20">
                <div className="bg-white rounded-xl shadow-lg p-4 w-64 border border-gray-100 transform rotate-2">
                  <div className="flex items-start gap-3 mb-3">
                    <div className="flex-shrink-0">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-amber-400 to-amber-500 flex items-center justify-center">
                        <span className="text-lg">⭐</span>
                      </div>
                    </div>
                    <div>
                      <div className="font-bold text-gray-900 text-sm">Sophia, 17</div>
                      <div className="text-xs text-gray-500 mb-1">Member since 2023</div>
                      <p className="text-gray-600 text-xs leading-relaxed">
                        "Helped me discover my passion and connect with mentors."
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-0.5">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-3 h-3 fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Floating Activity Indicators - Compact */}
            <div className="flex justify-center gap-3 mt-6">
              {[
                { label: "Live", value: "3", color: "#10B981" },
                { label: "Workshops", value: "8", color: "#E6A308" },
                { label: "Groups", value: "24", color: "#0B4797" }
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-1.5 px-3 py-1.5 bg-white rounded-full shadow-sm border border-gray-100">
                  <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: item.color }}></div>
                  <span className="font-semibold text-gray-900 text-sm">{item.value}</span>
                  <span className="text-xs text-gray-500">{item.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Scroll Indicator - Only show on larger screens if needed */}
      <div className="text-center pb-4 hidden md:block">
        <div className="inline-flex flex-col items-center gap-1">
          <span className="text-xs uppercase tracking-wider text-gray-400 font-medium">
            Explore
          </span>
          <div className="w-6 h-8 border border-gray-300/50 rounded-full flex justify-center p-1">
            <div className="w-1 h-2 bg-gradient-to-b from-blue-500 to-amber-500 rounded-full animate-bounce"></div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HomepageHero;