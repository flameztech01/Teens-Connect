import React from 'react';
import { Link } from 'react-router-dom';
import { Shield, Users, Eye, Flag, Lock, CheckCircle, AlertCircle, ArrowRight, Sparkles, Heart } from 'lucide-react';

const SafetyGuidelines = () => {
  const safetyFeatures = [
    {
      title: "24/7 Professional Moderation",
      description: "Trained moderators monitor all discussions and activities around the clock",
      icon: <Eye className="w-6 h-6" />,
      color: "#0B4797",
      gradient: "from-blue-500 to-blue-600",
      features: ["Real-time monitoring", "Trained adult moderators", "Community guidelines enforcement"],
      badge: "Always Active",
      emoji: "👁️"
    },
    {
      title: "Easy Reporting System",
      description: "Simple, anonymous reporting for any concerns with quick response times",
      icon: <Flag className="w-6 h-6" />,
      color: "#E6A308",
      gradient: "from-amber-500 to-amber-600",
      features: ["Anonymous reporting", "24-hour response", "Action taken on all reports"],
      badge: "100% Responded",
      emoji: "🚩"
    },
    {
      title: "Verified Safe Space",
      description: "Age-verified members and content filtered for appropriate interactions",
      icon: <Lock className="w-6 h-6" />,
      color: "#10B981",
      gradient: "from-emerald-500 to-emerald-600",
      features: ["Age verification", "Content filtering", "Privacy protection"],
      badge: "Verified",
      emoji: "✅"
    }
  ];

  const guidelines = [
    { text: "Respect all members regardless of background", icon: <Heart className="w-4 h-4" /> },
    { text: "No bullying, harassment, or hate speech", icon: <AlertCircle className="w-4 h-4" /> },
    { text: "Keep personal information private", icon: <Lock className="w-4 h-4" /> },
    { text: "Report any uncomfortable situations immediately", icon: <Flag className="w-4 h-4" /> },
    { text: "Be supportive and constructive in discussions", icon: <Users className="w-4 h-4" /> }
  ];

  const trustMetrics = [
    { value: "0", label: "Safety incidents", description: "in the past 90 days" },
    { value: "100%", label: "Parent approval", description: "based on recent survey" },
    { value: "<1 hour", label: "Average response time", description: "for reported issues" },
    { value: "500+", label: "Verified members", description: "age-verified teens" }
  ];

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-white to-gray-50 py-12 sm:py-16 md:py-20">
      {/* Background Elements */}
      <div className="absolute inset-0">
        {/* Shield Pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='80' height='80' viewBox='0 0 80 80' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%230B4797' fill-opacity='0.05'%3E%3Cpath d='M50 50c0-5.523-4.477-10-10-10s-10 4.477-10 10 4.477 10 10 10 10-4.477 10-10zm-10 8c-4.418 0-8-3.582-8-8s3.582-8 8-8 8 3.582 8 8-3.582 8-8 8zM10 34c0-3.313 2.687-6 6-6s6 2.687 6 6-2.687 6-6 6-6-2.687-6-6zm6 4c2.206 0 4-1.794 4-4s-1.794-4-4-4-4 1.794-4 4 1.794 4 4 4zM68 34c0-3.313-2.687-6-6-6s-6 2.687-6 6 2.687 6 6 6 6-2.687 6-6zm-6 4c-2.206 0-4-1.794-4-4s1.794-4 4-4 4 1.794 4 4-1.794 4-4 4z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            backgroundSize: '80px 80px'
          }}></div>
        </div>
        
        {/* Safety Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50/20 via-transparent to-emerald-50/20"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-10 sm:mb-12 md:mb-16">
          <div className="inline-flex items-center gap-3 mb-5">
            <div className="p-2 rounded-lg bg-gradient-to-br from-blue-500 to-emerald-500">
              <Shield className="w-5 h-5 text-white" />
            </div>
            <span className="text-sm font-semibold tracking-wider uppercase" style={{ color: '#0B4797' }}>
              SAFETY & TRUST
            </span>
          </div>

          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight mb-4">
            <span className="block text-gray-900">
              Your Safety is Our{' '}
              <span className="relative">
                <span className="relative z-10" style={{ color: '#0B4797' }}>Top Priority</span>
                <span className="absolute bottom-1 left-0 right-0 h-2.5 bg-blue-100/50 -z-10"></span>
              </span>
            </span>
            <span className="block text-lg sm:text-xl md:text-2xl font-semibold text-gray-600 mt-2">
              A protected space where teens can thrive safely
            </span>
          </h2>

          <p className="text-base sm:text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
            We maintain the highest safety standards so parents can trust and teens can connect freely
          </p>
        </div>

        {/* Trust Metrics */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10 sm:mb-12 md:mb-16">
          {trustMetrics.map((metric, index) => (
            <div 
              key={index}
              className="bg-white rounded-xl border border-gray-200 p-4 text-center group hover:shadow-lg transition-shadow duration-300"
            >
              <div 
                className="text-2xl sm:text-3xl font-bold mb-1 group-hover:scale-105 transition-transform duration-300"
                style={{ 
                  color: index === 0 ? '#10B981' : 
                         index === 1 ? '#0B4797' : 
                         index === 2 ? '#E6A308' : '#8B5CF6'
                }}
              >
                {metric.value}
              </div>
              <div className="font-semibold text-gray-900 text-sm mb-1">{metric.label}</div>
              <div className="text-xs text-gray-500">{metric.description}</div>
            </div>
          ))}
        </div>

        <div className="grid lg:grid-cols-3 gap-8 lg:gap-12 mb-10 sm:mb-12 md:mb-16">
          {/* Safety Features */}
          {safetyFeatures.map((feature, index) => (
            <div 
              key={index}
              className="group relative"
            >
              {/* Feature Card */}
              <div className="relative h-full bg-white rounded-2xl border border-gray-200 p-6 transition-all duration-300 hover:shadow-xl hover:-translate-y-1 overflow-hidden">
                {/* Top Badge */}
                <div className="absolute top-4 right-4">
                  <span 
                    className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-semibold"
                    style={{ 
                      backgroundColor: `${feature.color}15`,
                      color: feature.color
                    }}
                  >
                    <CheckCircle className="w-3 h-3" />
                    {feature.badge}
                  </span>
                </div>

                {/* Icon & Emoji */}
                <div className="mb-5">
                  <div className="flex items-center gap-3">
                    <div className={`p-3 rounded-xl bg-gradient-to-br ${feature.gradient} shadow-md`}>
                      <div className="text-white">
                        {feature.icon}
                      </div>
                    </div>
                    <div className="text-2xl opacity-80 group-hover:scale-110 transition-transform duration-300">
                      {feature.emoji}
                    </div>
                  </div>
                </div>

                {/* Content */}
                <div className="space-y-4">
                  <h3 
                    className="text-xl font-bold group-hover:scale-105 transition-transform duration-300 inline-block"
                    style={{ color: feature.color }}
                  >
                    {feature.title}
                  </h3>
                  
                  <p className="text-gray-600 leading-relaxed">
                    {feature.description}
                  </p>

                  {/* Features List */}
                  <div className="space-y-2 pt-2">
                    {feature.features.map((item, i) => (
                      <div 
                        key={i}
                        className="flex items-center gap-2 text-sm transition-all duration-300 group-hover:translate-x-1"
                        style={{ transitionDelay: `${i * 50}ms` }}
                      >
                        <div 
                          className="w-1.5 h-1.5 rounded-full flex-shrink-0"
                          style={{ backgroundColor: feature.color }}
                        ></div>
                        <span className="font-medium text-gray-700">{item}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Bottom Glow */}
                <div 
                  className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-transparent to-transparent group-hover:from-transparent group-hover:via-white group-hover:to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  style={{
                    backgroundImage: `linear-gradient(90deg, transparent, ${feature.color}40, transparent)`
                  }}
                ></div>
              </div>

              {/* Hover Glow */}
              <div 
                className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10"
                style={{
                  background: `radial-gradient(circle at center, ${feature.color}05, transparent 70%)`,
                }}
              ></div>
            </div>
          ))}
        </div>

        {/* Community Guidelines */}
        <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden mb-10 sm:mb-12 md:mb-16">
          {/* Header */}
          <div className="p-6 sm:p-8 border-b border-gray-200" style={{ backgroundColor: '#0B479705' }}>
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-gradient-to-br from-blue-500 to-amber-500">
                  <Users className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900">Community Guidelines</h3>
                  <p className="text-gray-600">Our commitment to a positive environment</p>
                </div>
              </div>
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-green-100 border border-green-200">
                <Sparkles className="w-4 h-4 text-green-700" />
                <span className="text-sm font-semibold text-green-800">Enforced Daily</span>
              </div>
            </div>
          </div>

          {/* Guidelines Grid */}
          <div className="p-6 sm:p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
              {guidelines.map((guideline, index) => (
                <div 
                  key={index}
                  className="group relative bg-gray-50 hover:bg-white rounded-xl p-4 border border-gray-200 hover:border-blue-200 transition-all duration-300 hover:shadow-sm"
                >
                  <div className="flex items-start gap-3">
                    <div 
                      className="p-1.5 rounded-md flex-shrink-0 mt-0.5"
                      style={{ backgroundColor: `${index === 0 ? '#DC2626' : index === 1 ? '#E6A308' : '#0B4797'}15` }}
                    >
                      <div style={{ 
                        color: index === 0 ? '#DC2626' : index === 1 ? '#E6A308' : '#0B4797' 
                      }}>
                        {guideline.icon}
                      </div>
                    </div>
                    <p className="text-sm font-medium text-gray-700 group-hover:text-gray-900 transition-colors duration-300">
                      {guideline.text}
                    </p>
                  </div>
                  
                  {/* Number Badge */}
                  <div className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-white border border-gray-300 flex items-center justify-center">
                    <span className="text-xs font-bold text-gray-600">{index + 1}</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Parent Note */}
            <div className="mt-8 p-4 bg-blue-50 rounded-xl border border-blue-100">
              <div className="flex items-start gap-3">
                <div className="p-2 rounded-lg bg-white border border-blue-200">
                  <Shield className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-1">Note for Parents</h4>
                  <p className="text-sm text-gray-600">
                    Our platform is designed with parental oversight in mind. We provide regular safety reports 
                    and maintain open communication with parents about our safety measures and community standards.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="bg-gradient-to-r from-blue-50/50 to-emerald-50/50 rounded-2xl p-6 sm:p-8 border border-gray-200">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-6">
            {/* Left Content */}
            <div className="flex-1">
              <div className="flex items-center gap-4 mb-4">
                <div className="relative">
                  <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-blue-500 to-emerald-500 flex items-center justify-center">
                    <Shield className="w-6 h-6 text-white" />
                  </div>
                  <div className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-white border border-gray-200 flex items-center justify-center">
                    <CheckCircle className="w-3 h-3 text-emerald-500" />
                  </div>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 text-lg">Transparent & Accountable</h3>
                  <p className="text-sm text-gray-600">
                    We believe in complete transparency about our safety practices and policies
                  </p>
                </div>
              </div>

              {/* Quick Facts */}
              <div className="grid grid-cols-2 gap-4 mt-6">
                {[
                  { label: "Parent Advisory Board", value: "Active", color: "#0B4797" },
                  { label: "Regular Safety Audits", value: "Monthly", color: "#E6A308" },
                  { label: "Safety Certifications", value: "3+ Held", color: "#10B981" },
                  { label: "Privacy Compliance", value: "GDPR Ready", color: "#8B5CF6" }
                ].map((fact, i) => (
                  <div key={i} className="bg-white/80 rounded-lg p-3 border border-gray-100">
                    <div className="text-xs font-semibold text-gray-500 mb-1">{fact.label}</div>
                    <div 
                      className="font-bold"
                      style={{ color: fact.color }}
                    >
                      {fact.value}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right CTA */}
            <div className="lg:w-1/3">
              <div className="space-y-4">
                <Link
                  to="/safety"
                  className="group relative w-full py-4 rounded-xl font-semibold text-sm transition-all duration-300 hover:shadow-lg active:scale-95 flex items-center justify-center gap-3"
                >
                  <span className="relative z-10 flex items-center gap-2 text-white">
                    Read Safety Policy
                    <ArrowRight className="w-4 h-4 transform transition-transform duration-300 group-hover:translate-x-1" />
                  </span>
                  <div 
                    className="absolute inset-0 rounded-xl bg-gradient-to-r from-blue-600 to-emerald-500 opacity-100 group-hover:from-blue-700 group-hover:to-emerald-600 transition-all duration-300"
                  ></div>
                </Link>

                <div className="text-center">
                  <div className="inline-flex items-center gap-2 text-sm text-gray-600">
                    <Lock className="w-4 h-4 text-gray-400" />
                    <span>Your privacy and safety are our commitment</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Trust Badges */}
        <div className="mt-8 flex flex-wrap items-center justify-center gap-4 sm:gap-6">
          {[
            { label: "COPPA Compliant", color: "#0B4797" },
            { label: "GDPR Ready", color: "#E6A308" },
            { label: "Encrypted Data", color: "#10B981" },
            { label: "Age Verified", color: "#8B5CF6" }
          ].map((badge, i) => (
            <div 
              key={i}
              className="flex items-center gap-2 px-3 py-1.5 rounded-full border"
              style={{ 
                borderColor: `${badge.color}30`,
                backgroundColor: `${badge.color}10`
              }}
            >
              <div 
                className="w-2 h-2 rounded-full"
                style={{ backgroundColor: badge.color }}
              ></div>
              <span 
                className="text-xs font-semibold"
                style={{ color: badge.color }}
              >
                {badge.label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default SafetyGuidelines;