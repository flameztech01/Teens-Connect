const FinalCTA = () => {
  return (
    <section className="relative py-20 lg:py-28 bg-[#1d2b4f] overflow-hidden">
      {/* Background accents */}
      <div className="absolute -top-20 -right-20 w-72 h-72 bg-[#f4a825]/20 rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-0 w-60 h-60 bg-white/5 rounded-full blur-2xl" />

      <div className="relative max-w-5xl mx-auto px-6 xl:px-8 text-center">
        {/* Small label */}
        <p className="text-[#f4a825] text-xs font-semibold tracking-[0.18em] uppercase mb-4">
          Join TeensConnect
        </p>

        {/* Heading */}
        <h2 className="text-3xl sm:text-4xl lg:text-[44px] font-semibold text-white leading-tight tracking-[-0.02em]">
          More than a platform. A space to belong.
        </h2>

        {/* Description */}
        <p className="mt-6 text-white/80 text-[15.5px] leading-7 max-w-2xl mx-auto">
          TeensConnect is where teenagers and young adults connect, have fun,
          build real friendships, showcase their talents, and unlock new
          opportunities. Be part of a community that helps you grow and be seen.
        </p>

        {/* Buttons */}
        <div className="mt-10 flex flex-col sm:flex-row justify-center gap-4">
          <button className="inline-flex items-center justify-center bg-[#f4a825] hover:bg-[#e79a13] text-white text-[13px] font-semibold tracking-[0.1em] uppercase px-7 h-12 rounded-full transition-colors shadow-lg shadow-black/20">
            Join Now
          </button>

          <button className="inline-flex items-center justify-center border border-white/30 hover:border-white text-white text-[13px] font-semibold tracking-[0.1em] uppercase px-7 h-12 rounded-full transition-colors">
            Contact Us
          </button>
        </div>

        {/* Small trust line */}
        <p className="mt-6 text-white/60 text-sm">
          Join a growing community already connecting and creating opportunities.
        </p>
      </div>
    </section>
  );
};

export default FinalCTA;