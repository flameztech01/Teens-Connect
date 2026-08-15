import { Search, Users, Briefcase, Sparkles, ArrowRight, Star, Clock, Shield } from "lucide-react";
import { Link } from "react-router-dom";

const HireTalent = () => {
  const talentCategories = [
    {
      title: "Creative Talent",
      description:
        "Discover designers, video editors, photographers, makeup artists, writers, and other young creatives ready to work.",
      image:
        "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=900&q=80",
      icon: Sparkles,
      color: "from-orange-500/20 to-transparent",
      badgeColor: "bg-orange-100",
      iconColor: "text-orange-600",
    },
    {
      title: "Tech Talent",
      description:
        "Find young developers, digital creators, tech learners, and problem-solvers building valuable skills for real projects.",
      image:
        "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=900&q=80",
      icon: Briefcase,
      color: "from-blue-500/20 to-transparent",
      badgeColor: "bg-blue-100",
      iconColor: "text-blue-600",
    },
    {
      title: "Business & Services",
      description:
        "Connect with talented young people offering fashion, beauty, branding, social media support, and other services.",
      image:
        "https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=900&q=80",
      icon: Users,
      color: "from-green-500/20 to-transparent",
      badgeColor: "bg-green-100",
      iconColor: "text-green-600",
    },
  ];

  return (
    <section className="relative py-24 lg:py-32 bg-gradient-to-b from-white to-[#f7f4ef] overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0">
        <div className="absolute top-40 left-10 w-72 h-72 bg-[#f4a825]/5 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-[#0d6b57]/5 rounded-full blur-3xl" />
      </div>

      <div className="max-w-7xl mx-auto px-6 xl:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 bg-[#f4a825]/10 rounded-full px-4 py-1.5 mb-5">
            <Search size={14} className="text-[#f4a825]" />
            <span className="text-[#f4a825] text-xs font-semibold tracking-wide uppercase">For Talent Seekers</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-[#1d2b4f] leading-tight mb-4">
            Find young talent{" "}
            <span className="text-[#f4a825]">with ease</span>
          </h2>
          <p className="text-[#5c6574] text-lg max-w-2xl mx-auto">
            Connect with fresh, creative, and promising talent ready to bring value to your projects
          </p>
          <div className="w-20 h-1 bg-[#f4a825] mx-auto mt-6 rounded-full" />
        </div>

        {/* Feature Cards */}
        <div className="grid md:grid-cols-3 gap-6 mb-16">
          <div className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-xl transition-all duration-300 border border-[#ece8e1] group">
            <div className="w-14 h-14 bg-[#f4a825]/10 rounded-xl flex items-center justify-center mb-4 group-hover:bg-[#f4a825] group-hover:scale-110 transition-all duration-300">
              <Star size={24} className="text-[#f4a825] group-hover:text-white transition-colors" />
            </div>
            <h3 className="text-lg font-semibold text-[#1d2b4f] mb-2">Fresh Perspectives</h3>
            <p className="text-[#5c6574] text-sm leading-relaxed">
              Young talent brings innovative ideas and fresh approaches to your projects
            </p>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-xl transition-all duration-300 border border-[#ece8e1] group">
            <div className="w-14 h-14 bg-[#0d6b57]/10 rounded-xl flex items-center justify-center mb-4 group-hover:bg-[#0d6b57] group-hover:scale-110 transition-all duration-300">
              <Clock size={24} className="text-[#0d6b57] group-hover:text-white transition-colors" />
            </div>
            <h3 className="text-lg font-semibold text-[#1d2b4f] mb-2">Quick to Hire</h3>
            <p className="text-[#5c6574] text-sm leading-relaxed">
              Find and connect with talented individuals ready to start immediately
            </p>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-xl transition-all duration-300 border border-[#ece8e1] group">
            <div className="w-14 h-14 bg-[#f4a825]/10 rounded-xl flex items-center justify-center mb-4 group-hover:bg-[#f4a825] group-hover:scale-110 transition-all duration-300">
              <Shield size={24} className="text-[#f4a825] group-hover:text-white transition-colors" />
            </div>
            <h3 className="text-lg font-semibold text-[#1d2b4f] mb-2">Verified Profiles</h3>
            <p className="text-[#5c6574] text-sm leading-relaxed">
              Access authentic talent profiles with showcased skills and portfolios
            </p>
          </div>
        </div>

        {/* Talent Categories */}
        <div className="grid gap-8">
          {talentCategories.map((item, index) => (
            <div
              key={item.title}
              className="group relative bg-white rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 border border-[#ece8e1]"
            >
              <div className={`absolute inset-0 bg-gradient-to-r ${item.color} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
              
              <div className="grid lg:grid-cols-[1.2fr_0.8fr] gap-0">
                {/* Content Side */}
                <div className="p-8 lg:p-10 relative z-10">
                  <div className="flex items-start gap-4 mb-6">
                    <div className={`w-12 h-12 ${item.badgeColor} rounded-xl flex items-center justify-center`}>
                      <item.icon size={22} className={item.iconColor} />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-[#f4a825] font-mono text-sm font-bold">0{index + 1}</span>
                        <div className="w-8 h-px bg-[#f4a825]" />
                      </div>
                      <h3 className="text-2xl lg:text-3xl font-bold text-[#1d2b4f]">
                        {item.title}
                      </h3>
                    </div>
                  </div>

                  <p className="text-[#5c6574] leading-relaxed mb-8 text-base">
                    {item.description}
                  </p>

                  <div className="flex flex-wrap gap-3">
                    <span className="px-3 py-1.5 bg-[#f7f4ef] rounded-full text-xs text-[#1d2b4f] font-medium">
                      ✓ Verified Talent
                    </span>
                    <span className="px-3 py-1.5 bg-[#f7f4ef] rounded-full text-xs text-[#1d2b4f] font-medium">
                      ✓ Portfolio Available
                    </span>
                    <span className="px-3 py-1.5 bg-[#f7f4ef] rounded-full text-xs text-[#1d2b4f] font-medium">
                      ✓ Ready to Hire
                    </span>
                  </div>
                </div>

                {/* Image Side */}
                <div className="relative h-64 lg:h-auto overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-t lg:bg-gradient-to-l from-white via-transparent to-transparent z-10" />
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  {/* Overlay gradient for better text contrast on mobile */}
                  <div className="absolute inset-0 bg-black/20 lg:hidden" />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* CTA Section */}
        <div className="mt-16 text-center">
          <Link 
            to="/explore" 
            className="inline-flex items-center gap-2 bg-[#f4a825] hover:bg-[#e79a13] text-white text-sm font-semibold tracking-wide uppercase px-8 h-12 rounded-full transition-all duration-300 shadow-md hover:shadow-xl group"
          >
            View Talents to Hire
            <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default HireTalent;