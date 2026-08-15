const Footer = () => {
  return (
    <footer className="bg-[#0f172a] text-white pt-20 pb-10">
      <div className="max-w-7xl mx-auto px-6 xl:px-8">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-10">
          
          {/* Brand */}
          <div>
            <h3 className="text-2xl font-semibold text-white">
              TeensConnect
            </h3>
            <p className="mt-4 text-white/70 text-[15px] leading-7">
              A growing community where teenagers and young adults connect,
              showcase their talents, and unlock real opportunities.
            </p>
          </div>

          {/* Links */}
          <div>
            <h4 className="text-sm font-semibold uppercase tracking-[0.12em] text-white mb-4">
              Navigation
            </h4>
            <ul className="space-y-3 text-white/70 text-[15px]">
              <li><a href="#" className="hover:text-white transition-colors">Home</a></li>
              <li><a href="#" className="hover:text-white transition-colors">About</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Explore Talent</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Community</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Contact</a></li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="text-sm font-semibold uppercase tracking-[0.12em] text-white mb-4">
              Support
            </h4>
            <ul className="space-y-3 text-white/70 text-[15px]">
              <li><a href="#" className="hover:text-white transition-colors">Help Center</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Terms of Use</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Privacy Policy</a></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-sm font-semibold uppercase tracking-[0.12em] text-white mb-4">
              Contact
            </h4>
            <ul className="space-y-3 text-white/70 text-[15px]">
              <li>hello@teensconnect.com</li>
              <li>+234 000 000 0000</li>
              <li>WhatsApp Community</li>
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-14 pt-6 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-white/50 text-sm">
            © {new Date().getFullYear()} TeensConnect. All rights reserved.
          </p>

          <div className="flex items-center gap-4 text-white/60 text-sm">
            <a href="#" className="hover:text-white">Instagram</a>
            <a href="#" className="hover:text-white">X</a>
            <a href="#" className="hover:text-white">WhatsApp</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;