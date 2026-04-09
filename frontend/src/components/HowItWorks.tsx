const HowItWorks = () => {
  const steps = [
    {
      number: "01",
      title: "Join the platform",
      description:
        "Become part of a growing community built for teenagers and young adults who want to connect, grow, and be seen.",
    },
    {
      number: "02",
      title: "Build your profile",
      description:
        "Add your basic details, interests, and the kind of skill, service, or talent you want others to know you for.",
    },
    {
      number: "03",
      title: "Connect and get noticed",
      description:
        "Meet like-minded people, grow your network, and make yourself visible to those looking for talent and collaboration.",
    },
    {
      number: "04",
      title: "Create opportunities",
      description:
        "Turn conversations into real collaborations, jobs, gigs, and meaningful growth through the TeensConnect community.",
    },
  ];

  return (
    <section className="relative py-20 lg:py-28 bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 xl:px-8">
        {/* Section Header */}
        <div className="max-w-3xl mx-auto text-center">
          <p className="text-[#f4a825] text-xs font-semibold tracking-[0.18em] uppercase mb-4">
            How It Works
          </p>

          <h2 className="text-3xl sm:text-4xl lg:text-[42px] font-semibold text-[#1d2b4f] leading-tight tracking-[-0.02em]">
            Simple steps to connect, grow, and get discovered
          </h2>

          <p className="mt-5 text-[#5c6574] text-[15.5px] leading-7 max-w-2xl mx-auto">
            TeensConnect makes it easy for young people to join the community,
            showcase what they do, and open the door to meaningful
            opportunities.
          </p>
        </div>

        {/* Steps */}
        <div className="mt-16 grid md:grid-cols-2 xl:grid-cols-4 gap-6">
          {steps.map((step) => (
            <div
              key={step.number}
              className="relative bg-[#f7f4ef] rounded-[24px] p-7 lg:p-8 border border-[#ece8e1] hover:shadow-[0_18px_40px_rgba(16,24,40,0.08)] transition-all duration-300"
            >
              <div className="w-14 h-14 rounded-full bg-[#f4a825] text-white flex items-center justify-center text-sm font-bold tracking-[0.08em] shadow-sm">
                {step.number}
              </div>

              <h3 className="mt-6 text-[24px] font-semibold text-[#1d2b4f] leading-snug">
                {step.title}
              </h3>

              <p className="mt-4 text-[#5c6574] text-[15px] leading-7">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;