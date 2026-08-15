import { Users, Sparkles, Target, Heart, Globe, Zap, Quote } from "lucide-react";

const AboutUs = () => {
  return (
    <section className="relative py-24 lg:py-32 bg-white overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-[#f4a825]/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-[#0d6b57]/5 rounded-full blur-3xl" />
      </div>

      <div className="max-w-7xl mx-auto px-6 xl:px-8 relative z-10">
        {/* Section header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 bg-[#f4a825]/10 rounded-full px-4 py-1.5 mb-5">
            <Sparkles size={14} className="text-[#f4a825]" />
            <span className="text-[#f4a825] text-xs font-semibold tracking-wide uppercase">Our Story</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-[#1d2b4f] leading-tight">
            More than just a
            <span className="text-[#f4a825]"> community</span>
          </h2>
          <div className="w-20 h-1 bg-[#f4a825] mx-auto mt-6 rounded-full" />
        </div>

        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-start">
          {/* Left side - Quote/Core message */}
          <div className="space-y-8">
            <div className="bg-[#f7f4ef] rounded-3xl p-8 lg:p-10 relative">
              <Quote size={48} className="text-[#f4a825]/20 absolute top-6 right-6" />
              <p className="text-[#1d2b4f] text-xl lg:text-2xl font-medium leading-relaxed relative z-10">
                We believe every young person deserves a space where they can truly be themselves, connect authentically, and let their talents shine.
              </p>
              <div className="mt-6 flex items-center gap-3">
                <div className="w-12 h-12 bg-[#f4a825] rounded-full flex items-center justify-center">
                  <Heart size={20} className="text-white" />
                </div>
                <div>
                  <p className="font-semibold text-[#1d2b4f]">TeensConnect Team</p>
                  <p className="text-sm text-[#5c6574]">Building with purpose</p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="bg-[#f7f4ef] rounded-2xl p-5 text-center hover:shadow-lg transition-shadow">
                <div className="w-12 h-12 bg-[#f4a825]/10 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Users size={20} className="text-[#f4a825]" />
                </div>
                <h3 className="font-semibold text-[#1d2b4f] mb-1">Real Connections</h3>
                <p className="text-xs text-[#5c6574]">Authentic friendships that matter</p>
              </div>
              <div className="bg-[#f7f4ef] rounded-2xl p-5 text-center hover:shadow-lg transition-shadow">
                <div className="w-12 h-12 bg-[#0d6b57]/10 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Target size={20} className="text-[#0d6b57]" />
                </div>
                <h3 className="font-semibold text-[#1d2b4f] mb-1">Opportunities</h3>
                <p className="text-xs text-[#5c6574]">Get discovered for your talent</p>
              </div>
            </div>
          </div>

          {/* Right side - Story content */}
          <div className="space-y-6">
            <div className="relative pl-6 border-l-2 border-[#f4a825]">
              <p className="text-[#5c6574] leading-relaxed mb-4">
                TeensConnect started as a simple idea: create a WhatsApp group where teenagers and young adults could meet, connect, and enjoy meaningful interactions. What began small has grown into something much bigger.
              </p>
              <p className="text-[#5c6574] leading-relaxed">
                Today, we're building a platform designed to bring young people together in a more powerful way. Here, members don't just socialize — they create profiles, share their skills, and become visible to people looking for talent.
              </p>
            </div>

            <div className="bg-gradient-to-r from-[#f4a825]/5 to-[#0d6b57]/5 rounded-2xl p-6">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-white shadow-md flex items-center justify-center flex-shrink-0">
                  <Globe size={18} className="text-[#f4a825]" />
                </div>
                <div>
                  <h4 className="font-semibold text-[#1d2b4f] mb-2">Growing together</h4>
                  <p className="text-sm text-[#5c6574] leading-relaxed">
                    TeensConnect is where friendship, fun, creativity, and opportunity all come together. Whether you're looking to connect, grow, or showcase what you do — there's a place for you here.
                  </p>
                </div>
              </div>
            </div>

            <div className="flex gap-3">
              <div className="flex-1 bg-[#f7f4ef] rounded-xl p-4">
                <div className="flex items-center gap-3 mb-2">
                  <Zap size={16} className="text-[#f4a825]" />
                  <span className="text-xs font-semibold text-[#1d2b4f] uppercase tracking-wide">Our Mission</span>
                </div>
                <p className="text-[13px] text-[#5c6574] leading-relaxed">
                  To create a safe, vibrant space where young people can connect meaningfully and unlock their full potential.
                </p>
              </div>
              <div className="flex-1 bg-[#f7f4ef] rounded-xl p-4">
                <div className="flex items-center gap-3 mb-2">
                  <Heart size={16} className="text-[#0d6b57]" />
                  <span className="text-xs font-semibold text-[#1d2b4f] uppercase tracking-wide">Our Values</span>
                </div>
                <p className="text-[13px] text-[#5c6574] leading-relaxed">
                  Authenticity, creativity, inclusivity, and the belief that every talent deserves to be seen.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutUs;