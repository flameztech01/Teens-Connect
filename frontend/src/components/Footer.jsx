import React from 'react';
import { Link } from 'react-router-dom';
import { Facebook, Twitter, Instagram, Mail, MapPin, Phone, Heart, Sparkles } from 'lucide-react';

const Footer = () => {
  const quickLinks = [
    { name: 'Home', path: '/' },
    { name: 'About', path: '/about' },
    { name: 'Community', path: '/community' },
    { name: 'Activities', path: '/activities' },
    { name: 'Skills & Opportunities', path: '/skills-opportunities' },
    { name: 'Contact', path: '/contact' },
  ];

  const resources = [
    { name: 'Safety Policy', path: '/safety' },
    { name: 'Community Guidelines', path: '/guidelines' },
    { name: 'FAQ', path: '/faq' },
    { name: 'Blog', path: '/blog' },
    { name: 'Parent Resources', path: '/parents' },
    { name: 'Support', path: '/support' },
  ];

  const socialLinks = [
    { name: 'Facebook', icon: <Facebook className="w-5 h-5" />, url: 'https://facebook.com/teensconnect', color: '#1877F2' },
    { name: 'Twitter', icon: <Twitter className="w-5 h-5" />, url: 'https://twitter.com/teensconnect', color: '#1DA1F2' },
    { name: 'Instagram', icon: <Instagram className="w-5 h-5" />, url: 'https://instagram.com/teensconnect', color: '#E4405F' },
  ];

  return (
    <footer className="relative bg-gradient-to-b from-gray-900 to-gray-950 text-white overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          backgroundSize: '60px 60px'
        }}></div>
      </div>

      {/* Top Gradient */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-blue-500/50 to-transparent"></div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          {/* Brand Column */}
          <div className="space-y-6">
            <Link to="/" className="inline-block group">
              <div className="flex items-center gap-3 group-hover:gap-4 transition-all duration-300">
                <div className="relative">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-600 to-amber-500 flex items-center justify-center">
                    <span className="text-xl font-bold text-white">TC</span>
                  </div>
                  <div className="absolute -inset-2 rounded-xl bg-gradient-to-br from-blue-600 to-amber-500 opacity-0 group-hover:opacity-20 blur-md transition-opacity duration-300"></div>
                </div>
                <div className="flex flex-col">
                  <span className="text-2xl font-bold tracking-tight">
                    Teens Connect
                  </span>
                  <span className="text-sm text-gray-300 font-medium tracking-wide mt-0.5">
                    EMPOWERING YOUTH
                  </span>
                </div>
              </div>
            </Link>

            {/* Tagline */}
            <p className="text-gray-300 leading-relaxed max-w-xs">
              A safe, supportive space where Nigerian teens connect, grow, and thrive together.
            </p>

            {/* Contact Info */}
            <div className="space-y-3">
              <div className="flex items-center gap-3 text-gray-300 hover:text-white transition-colors duration-200">
                <Mail className="w-5 h-5 flex-shrink-0" />
                <a href="mailto:hello@teensconnect.ng" className="text-sm hover:underline">
                  hello@teensconnect.ng
                </a>
              </div>
              <div className="flex items-center gap-3 text-gray-300">
                <MapPin className="w-5 h-5 flex-shrink-0" />
                <span className="text-sm">Lagos, Nigeria</span>
              </div>
              <div className="flex items-center gap-3 text-gray-300">
                <Phone className="w-5 h-5 flex-shrink-0" />
                <span className="text-sm">Support: +234 800 000 0000</span>
              </div>
            </div>

            {/* Newsletter Signup - Mobile only */}
            <div className="lg:hidden">
              <div className="mt-6 p-4 bg-white/5 rounded-xl border border-white/10">
                <p className="text-sm font-semibold mb-2">Stay Updated</p>
                <div className="flex gap-2">
                  <input
                    type="email"
                    placeholder="Your email"
                    className="flex-1 px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-sm placeholder-gray-400 focus:outline-none focus:border-blue-500"
                  />
                  <button className="px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-700 rounded-lg text-sm font-semibold hover:from-blue-700 hover:to-blue-800 transition-all duration-300">
                    Join
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Sparkles className="w-4 h-4" />
              Quick Links
            </h3>
            <ul className="space-y-2">
              {quickLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.path}
                    className="text-gray-300 hover:text-white hover:translate-x-1 transition-all duration-200 inline-block text-sm py-1"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Heart className="w-4 h-4" />
              Resources
            </h3>
            <ul className="space-y-2">
              {resources.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.path}
                    className="text-gray-300 hover:text-white hover:translate-x-1 transition-all duration-200 inline-block text-sm py-1"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>

            {/* Trust Badges */}
            <div className="mt-6 pt-6 border-t border-white/10">
              <div className="flex flex-wrap gap-2">
                <span className="px-2 py-1 bg-green-900/30 text-green-300 rounded text-xs font-medium border border-green-800/50">
                  Safe Space
                </span>
                <span className="px-2 py-1 bg-blue-900/30 text-blue-300 rounded text-xs font-medium border border-blue-800/50">
                  Verified
                </span>
                <span className="px-2 py-1 bg-amber-900/30 text-amber-300 rounded text-xs font-medium border border-amber-800/50">
                  13-19 Only
                </span>
              </div>
            </div>
          </div>

          {/* Social & Newsletter */}
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold mb-4">Connect With Us</h3>
              <div className="flex gap-3">
                {socialLinks.map((social) => (
                  <a
                    key={social.name}
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 flex items-center justify-center transition-all duration-300 hover:scale-105 group"
                    style={{ color: social.color }}
                    aria-label={`Follow us on ${social.name}`}
                  >
                    <div className="group-hover:scale-110 transition-transform duration-300">
                      {social.icon}
                    </div>
                  </a>
                ))}
              </div>
            </div>

            {/* Newsletter Signup - Desktop */}
            <div className="hidden lg:block">
              <div className="p-4 bg-white/5 rounded-xl border border-white/10">
                <p className="text-sm font-semibold mb-2">Join Our Newsletter</p>
                <p className="text-xs text-gray-400 mb-3">
                  Get updates on events, opportunities, and community news
                </p>
                <div className="space-y-2">
                  <input
                    type="email"
                    placeholder="Your email address"
                    className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-sm placeholder-gray-400 focus:outline-none focus:border-blue-500"
                  />
                  <button className="w-full py-2 bg-gradient-to-r from-blue-600 to-blue-700 rounded-lg text-sm font-semibold hover:from-blue-700 hover:to-blue-800 transition-all duration-300">
                    Subscribe
                  </button>
                </div>
              </div>
            </div>

            {/* Safety Note */}
            <div className="pt-4 border-t border-white/10 lg:border-t-0 lg:pt-0">
              <p className="text-xs text-gray-400">
                <span className="font-semibold text-gray-300">Safety First:</span> All members are age-verified. 
                Content is moderated 24/7 by trained professionals.
              </p>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-white/10">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            {/* Copyright */}
            <div className="text-sm text-gray-400">
              © {new Date().getFullYear()} Teens Connect. All rights reserved.
            </div>

            {/* Legal Links */}
            <div className="flex flex-wrap items-center gap-4 text-sm">
              <Link to="/privacy" className="text-gray-400 hover:text-white transition-colors duration-200">
                Privacy Policy
              </Link>
              <Link to="/terms" className="text-gray-400 hover:text-white transition-colors duration-200">
                Terms of Service
              </Link>
              <Link to="/cookies" className="text-gray-400 hover:text-white transition-colors duration-200">
                Cookie Policy
              </Link>
              <div className="flex items-center gap-1 text-gray-400">
                <span>Made with</span>
                <Heart className="w-3 h-3 fill-red-500 text-red-500" />
                <span>for Nigerian teens</span>
              </div>
            </div>

            {/* Mobile-only Back to Top */}
            <div className="md:hidden">
              <button
                onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                className="text-sm text-gray-400 hover:text-white flex items-center gap-1 transition-colors duration-200"
              >
                Back to top
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
                </svg>
              </button>
            </div>
          </div>

          {/* Age Notice */}
          <div className="mt-6 text-center">
            <p className="text-xs text-gray-500">
              Teens Connect is designed exclusively for teens aged 13-19. Parental guidance recommended for younger users.
            </p>
          </div>
        </div>
      </div>

      {/* Floating Elements */}
      <div className="absolute bottom-0 left-0 w-32 h-32 bg-blue-900/10 rounded-full blur-3xl"></div>
      <div className="absolute top-0 right-0 w-40 h-40 bg-amber-900/10 rounded-full blur-3xl"></div>
    </footer>
  );
};

export default Footer;