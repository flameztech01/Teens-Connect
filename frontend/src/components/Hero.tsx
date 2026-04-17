import { Link } from "react-router-dom";

const Hero = () => {
  return (
    <section className="relative h-[92vh] min-h-[680px] w-full overflow-hidden">
      {/* Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat scale-[1.02]"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1523240795612-9a054b0db644?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80')",
        }}
      />

      {/* Overlay */}
      <div className="absolute inset-0 bg-black/35" />
      <div className="absolute inset-0 bg-gradient-to-r from-black/75 via-black/45 to-black/10" />

      {/* Soft accent glow */}
      <div className="absolute left-[8%] top-[22%] h-40 w-40 rounded-full bg-[#f4a825]/10 blur-3xl" />

      {/* Content */}
      <div className="relative z-10 h-full">
        <div className="max-w-7xl mx-auto px-6 xl:px-8 h-full flex items-center">
          <div className="w-full max-w-3xl pt-16 lg:pt-10">
            {/* Intro text */}
            <p className="text-white/90 text-sm md:text-[15px] font-medium mb-5">
              Give young people a space to connect.
            </p>

            {/* Main heading */}
            <h1 className="text-white font-semibold leading-[1.05] tracking-[-0.03em] text-4xl sm:text-5xl md:text-6xl lg:text-[68px] max-w-3xl">
              Connect, grow, and let your talent be discovered.
            </h1>

            {/* Supporting text */}
            <p className="mt-6 max-w-2xl text-white/80 text-[15px] sm:text-[16px] md:text-lg leading-7">
              TeensConnect is a growing community for teenagers and young adults
              to meet new people, have fun, build real friendships, showcase
              what they do, and unlock meaningful opportunities.
            </p>

            {/* CTA Buttons */}
            <div className="mt-8 flex flex-col sm:flex-row sm:items-center gap-5">
              <Link 
                to="/signup" 
                className="inline-flex items-center justify-center h-12 px-7 rounded-full bg-[#f4a825] hover:bg-[#e79a13] text-white text-sm font-semibold tracking-[0.04em] transition-colors shadow-lg shadow-black/20"
              >
                Join Our Community
              </Link>

              <Link 
                to="/explore" 
                className="inline-flex items-center justify-center h-12 px-7 rounded-full bg-white/10 backdrop-blur-sm hover:bg-white/20 text-white text-sm font-semibold tracking-[0.04em] transition-colors border border-white/30"
              >
                View Talents
              </Link>

              <div className="flex items-center gap-3">
                <div className="flex -space-x-3">
                  <img
                    src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=300&q=80"
                    alt="Community member"
                    className="h-10 w-10 rounded-full border-2 border-white object-cover"
                  />
                  <img
                    src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=300&q=80"
                    alt="Community member"
                    className="h-10 w-10 rounded-full border-2 border-white object-cover"
                  />
                  <img
                    src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=300&q=80"
                    alt="Community member"
                    className="h-10 w-10 rounded-full border-2 border-white object-cover"
                  />
                  <img
                    src="https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=300&q=80"
                    alt="Community member"
                    className="h-10 w-10 rounded-full border-2 border-white object-cover"
                  />
                </div>

                <div className="text-white/85 text-sm leading-tight">
                  <p className="font-medium">Growing WhatsApp community</p>
                  <p className="text-white/65 text-xs">
                    Friendship, fun, and opportunity
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;