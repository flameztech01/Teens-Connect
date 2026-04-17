import { useEffect, useState } from "react";
import { Menu, X, Phone, Mail, MapPin } from "lucide-react";
import { Link } from "react-router-dom";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

const navLinks = [
  { name: "Home", href: "#home" },
  { name: "About", href: "#about" },
  { name: "Explore Talent", href: "#explore" },
  { name: "Community", href: "#community" },
  { name: "How It Works", href: "#how-it-works" },
  { name: "Contact", href: "#contact" },
];

  return (
    <header className="fixed top-0 left-0 w-full z-50">
      {/* Top Strip */}
      <div className="hidden lg:block bg-[#0d6b57] text-white text-[11px]">
        <div className="max-w-7xl mx-auto px-6 xl:px-8 h-9 flex items-center justify-between">
          <div className="flex items-center gap-5">
            <div className="flex items-center gap-2 opacity-95">
              <Phone size={12} />
              <span>+234 000 000 0000</span>
            </div>
            <div className="flex items-center gap-2 opacity-95">
              <Mail size={12} />
              <span>hello@teensconnect.com</span>
            </div>
            <div className="flex items-center gap-2 opacity-95">
              <MapPin size={12} />
              <span>Building connection, talent, and opportunity</span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <a href="#" className="hover:opacity-80 transition-opacity">
              FB
            </a>
            <a href="#" className="hover:opacity-80 transition-opacity">
              IG
            </a>
            <a href="#" className="hover:opacity-80 transition-opacity">
              X
            </a>
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <nav
        className={`bg-white transition-all duration-300 ${
          scrolled ? "shadow-md" : "shadow-sm"
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 xl:px-8">
          <div className="h-[84px] flex items-center justify-between">
            {/* Logo */}
            <a href="#" className="flex items-center gap-3 shrink-0">
              <img src="/logo.png" alt="TeensConnect" className="h-10 w-auto" />
              <div className="leading-none">
                <h1 className="text-[28px] font-semibold text-[#1d2b4f] tracking-[-0.02em]">
                  TeensConnect
                </h1>
                <p className="text-[11px] text-[#9aa3b2] mt-1 tracking-[0.18em] uppercase">
                  Connect • Discover • Grow
                </p>
              </div>
            </a>

            {/* Desktop Nav */}
            <div className="hidden lg:flex items-center gap-8">
              <div className="flex items-center gap-7">
                {navLinks.map((link) => (
                  <a
                    key={link.name}
                    href={link.href}
                    className="text-[12px] font-semibold uppercase tracking-[0.14em] text-[#1d2b4f] hover:text-[#f4a825] transition-colors"
                  >
                    {link.name}
                  </a>
                ))}
              </div>

              {/* Right actions - Signup and Signin buttons */}
              <div className="flex items-center gap-4 pl-3">
                <Link to='/signin' className="px-5 h-11 rounded-full border-2 border-[#f4a825] text-[#f4a825] hover:bg-[#f4a825] hover:text-white text-[12px] font-semibold uppercase tracking-[0.12em] transition-all duration-300 flex items-center justify-center">
                  Sign In
                </Link>
                
                <Link to='/signup' className="px-5 h-11 rounded-full bg-[#f4a825] hover:bg-[#e79a13] text-white text-[12px] font-semibold uppercase tracking-[0.12em] transition-all duration-300 shadow-sm flex items-center justify-center">
                  Sign Up
                </Link>
              </div>
            </div>

            {/* Mobile button */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="lg:hidden text-[#1d2b4f]"
              aria-label="Toggle menu"
            >
              {isOpen ? <X size={28} /> : <Menu size={28} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="lg:hidden border-t border-[#edf0f5] bg-white">
            <div className="px-6 py-6 space-y-5">
              <div className="space-y-4">
                {navLinks.map((link) => (
                  <a
                    key={link.name}
                    href={link.href}
                    onClick={() => setIsOpen(false)}
                    className="block text-[13px] font-semibold uppercase tracking-[0.12em] text-[#1d2b4f] hover:text-[#f4a825] transition-colors"
                  >
                    {link.name}
                  </a>
                ))}
              </div>

              <div className="pt-3 border-t border-[#edf0f5] flex gap-3">
                <Link to='/signin' className="flex-1 border-2 border-[#f4a825] text-[#f4a825] hover:bg-[#f4a825] hover:text-white text-[12px] font-semibold uppercase tracking-[0.12em] h-11 rounded-full transition-all duration-300 flex items-center justify-center">
                  Sign In
                </Link>
                
                <Link to='/signup' className="flex-1 bg-[#f4a825] hover:bg-[#e79a13] text-white text-[12px] font-semibold uppercase tracking-[0.12em] h-11 rounded-full transition-colors flex items-center justify-center">
                  Sign Up
                </Link>
              </div>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
};

export default Navbar;