const HireTalent = () => {
  const talentCategories = [
    {
      title: "Creative Talent",
      description:
        "Discover designers, video editors, photographers, makeup artists, writers, and other young creatives ready to work.",
      image:
        "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=900&q=80",
    },
    {
      title: "Tech Talent",
      description:
        "Find young developers, digital creators, tech learners, and problem-solvers building valuable skills for real projects.",
      image:
        "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=900&q=80",
    },
    {
      title: "Business & Services",
      description:
        "Connect with talented young people offering fashion, beauty, branding, social media support, and other services.",
      image:
        "https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=900&q=80",
    },
  ];

  return (
    <section className="relative py-20 lg:py-28 bg-[#f7f4ef] overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 xl:px-8">
        <div className="grid lg:grid-cols-2 gap-14 items-center">
          {/* Left Content */}
          <div className="max-w-xl">
            <p className="text-[#f4a825] text-xs font-semibold tracking-[0.18em] uppercase mb-4">
              For Talent Seekers
            </p>

            <h2 className="text-3xl sm:text-4xl lg:text-[42px] font-semibold text-[#1d2b4f] leading-tight tracking-[-0.02em]">
              Find young talent with ease
            </h2>

            <p className="mt-6 text-[#5c6574] text-[15.5px] leading-7">
              TeensConnect is also for people, brands, and businesses looking
              for fresh, creative, and promising talent. Instead of searching
              endlessly, visitors can explore a growing network of skilled young
              individuals across different fields.
            </p>

            <p className="mt-4 text-[#5c6574] text-[15.5px] leading-7">
              From design and tech to beauty, fashion, content creation, and
              more, TeensConnect makes it easier to discover people who are
              ready to work, collaborate, and deliver value.
            </p>

            <div className="mt-8 flex flex-col sm:flex-row gap-4">
              <button className="inline-flex items-center justify-center bg-[#f4a825] hover:bg-[#e79a13] text-white text-[13px] font-semibold tracking-[0.1em] uppercase px-6 h-11 rounded-full transition-colors shadow-sm">
                Explore Talent
              </button>

              <button className="inline-flex items-center justify-center border border-[#d9d3c8] hover:border-[#f4a825] text-[#1d2b4f] hover:text-[#f4a825] text-[13px] font-semibold tracking-[0.1em] uppercase px-6 h-11 rounded-full transition-colors">
                Learn More
              </button>
            </div>
          </div>

          {/* Right Cards */}
          <div className="grid gap-5">
            {talentCategories.map((item, index) => (
              <div
                key={item.title}
                className="group bg-white rounded-[24px] border border-[#ece8e1] overflow-hidden shadow-[0_8px_30px_rgba(16,24,40,0.05)] hover:shadow-[0_18px_40px_rgba(16,24,40,0.10)] transition-all duration-300"
              >
                <div className="grid sm:grid-cols-[180px_1fr] items-stretch">
                  <div className="relative h-52 sm:h-full min-h-[180px] overflow-hidden">
                    <img
                      src={item.image}
                      alt={item.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  </div>

                  <div className="p-6 sm:p-7 flex flex-col justify-center">
                    <div className="w-10 h-10 rounded-full bg-[#fdf2dc] text-[#f4a825] flex items-center justify-center text-sm font-bold mb-4">
                      0{index + 1}
                    </div>

                    <h3 className="text-[23px] font-semibold text-[#1d2b4f] leading-snug">
                      {item.title}
                    </h3>

                    <p className="mt-3 text-[#5c6574] text-[15px] leading-7">
                      {item.description}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default HireTalent;