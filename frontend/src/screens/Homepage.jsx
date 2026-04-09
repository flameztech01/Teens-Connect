import React, { useEffect } from 'react';
import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import AboutUs from '../components/AboutUs';
import ShowcaseTalent from '../components/ShowcaseTalents';
import HireTalent from '../components/HireTalent';
import HowItWorks from '../components/HowItWorks';
import FinalCTA from '../components/FinalCTA';
import Footer from '../components/Footer';

const Homepage = () => {
  // Smooth scroll function
  const smoothScroll = (elementId) => {
    const element = document.getElementById(elementId);
    if (element) {
      const offset = 80; // Adjust for fixed navbar height
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  };

  // Handle hash links on page load
  useEffect(() => {
    if (window.location.hash) {
      const id = window.location.hash.substring(1);
      setTimeout(() => {
        smoothScroll(id);
      }, 100);
    }
  }, []);

  return (
    <div>
      <Navbar smoothScroll={smoothScroll} />

      <section id="home">
        <Hero />
      </section>

      <section id="about">
        <AboutUs />
      </section>

      <section id="explore">
        <ShowcaseTalent />
      </section>

      <section id="community">
        <HireTalent />
      </section>

      <section id="how-it-works">
        <HowItWorks />
      </section>

      <section id="contact">
        <FinalCTA />
      </section>

      <footer id="footer">
        <Footer />
      </footer>
    </div>
  );
};

export default Homepage;