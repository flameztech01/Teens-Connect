const AboutUs = () => {
  return (
    <section className="relative py-20 lg:py-28 bg-[#f7f4ef] overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 xl:px-8">
        <div className="grid lg:grid-cols-2 gap-14 items-center">
          
          {/* LEFT — Image Composition */}
          <div className="relative w-full h-[420px] lg:h-[480px]">
            {/* Main Image */}
            <div className="absolute left-0 top-0 w-[65%] h-[85%] rounded-[40px] overflow-hidden shadow-xl">
              <img
                src="https://images.unsplash.com/photo-1607746882042-944635dfe10e?auto=format&fit=crop&w=900&q=80"
                alt="Community"
                className="w-full h-full object-cover"
              />
            </div>

            {/* Second Image */}
            <div className="absolute right-0 bottom-0 w-[55%] h-[70%] rounded-[40px] overflow-hidden shadow-xl border-[6px] border-[#f7f4ef]">
              <img
                src="https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=900&q=80"
                alt="Youth connection"
                className="w-full h-full object-cover"
              />
            </div>

            {/* Decorative Shape */}
            <div className="absolute -left-6 bottom-6 w-16 h-16 bg-[#f4a825] rounded-full opacity-90 blur-[2px]" />
          </div>

          {/* RIGHT — Text Content */}
          <div className="max-w-xl">
            {/* Small label */}
            <p className="text-[#f4a825] text-xs font-semibold tracking-[0.18em] uppercase mb-4">
              Welcome to TeensConnect
            </p>

            {/* Heading */}
            <h2 className="text-3xl sm:text-4xl lg:text-[42px] font-semibold text-[#1d2b4f] leading-tight tracking-[-0.02em]">
              A community built for connection and growth
            </h2>

            {/* Paragraph */}
            <p className="mt-6 text-[#5c6574] text-[15.5px] leading-7">
              TeensConnect started as a simple community where teenagers and
              young adults could meet, connect, and enjoy meaningful
              interactions. What began as a WhatsApp group is now growing into a
              bigger platform designed to bring young people together in a more
              powerful way.
            </p>

            <p className="mt-4 text-[#5c6574] text-[15.5px] leading-7">
              Here, members do not just socialize. They can also create profiles,
              share their skills, and become visible to people looking for
              talent. TeensConnect is where friendship, fun, creativity, and
              opportunity all come together.
            </p>

            {/* CTA */}
            <div className="mt-8">
              <button className="inline-flex items-center gap-2 bg-[#f4a825] hover:bg-[#e79a13] text-white text-[13px] font-semibold tracking-[0.1em] uppercase px-6 h-11 rounded-full transition-colors shadow-sm">
                Discover More
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutUs;