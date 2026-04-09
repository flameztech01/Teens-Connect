const ShowcaseTalent = () => {
  const features = [
    {
      title: "Create your profile",
      description:
        "Set up your account and introduce yourself to the TeensConnect community in a simple and professional way.",
      image:
        "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=900&q=80",
    },
    {
      title: "Show your talent",
      description:
        "Add your line of work, skills, or creative service so others can clearly see what you do and what you offer.",
      image:
        "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=900&q=80",
    },
    {
      title: "Get discovered",
      description:
        "Make it easier for people, brands, and talent seekers to find you and connect with you for real opportunities.",
      image:
        "https://images.unsplash.com/photo-1517048676732-d65bc937f952?auto=format&fit=crop&w=900&q=80",
    },
    {
      title: "Grow your network",
      description:
        "Build friendships, connect with like-minded people, and become part of a community that helps you grow.",
      image:
        "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=900&q=80",
    },
  ];

  return (
    <section className="relative py-20 lg:py-28 bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 xl:px-8">
        {/* Header */}
        <div className="max-w-3xl mx-auto text-center">
          <p className="text-[#f4a825] text-xs font-semibold tracking-[0.18em] uppercase mb-4">
            What You Can Do
          </p>

          <h2 className="text-3xl sm:text-4xl lg:text-[42px] font-semibold text-[#1d2b4f] leading-tight tracking-[-0.02em]">
            Show what you do and get discovered
          </h2>

          <p className="mt-5 text-[#5c6574] text-[15.5px] leading-7 max-w-2xl mx-auto">
            Create your profile, list your skills, and let people find you.
            TeensConnect helps you turn what you do into real opportunities.
          </p>
        </div>

        {/* Cards */}
        <div className="mt-14 grid sm:grid-cols-2 xl:grid-cols-4 gap-6">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="group bg-white border border-[#ece8e1] rounded-[22px] overflow-hidden shadow-[0_8px_30px_rgba(16,24,40,0.05)] hover:shadow-[0_18px_40px_rgba(16,24,40,0.10)] transition-all duration-300 hover:-translate-y-1"
            >
              {/* Card Image */}
              <div className="relative h-52 overflow-hidden">
                <img
                  src={feature.image}
                  alt={feature.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-black/5 to-transparent" />
              </div>

              {/* Card Content */}
              <div className="p-6">
                <div className="w-10 h-10 rounded-full bg-[#fdf2dc] text-[#f4a825] flex items-center justify-center text-sm font-bold mb-4">
                  0{features.indexOf(feature) + 1}
                </div>

                <h3 className="text-[22px] font-semibold text-[#1d2b4f] leading-snug">
                  {feature.title}
                </h3>

                <p className="mt-3 text-[#5c6574] text-[15px] leading-7">
                  {feature.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ShowcaseTalent;