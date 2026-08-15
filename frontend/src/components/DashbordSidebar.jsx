import { useState, useEffect, useMemo } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  Home,
  Users,
  Briefcase,
  UserCircle,
  Settings,
  LogOut,
  Menu,
  X,
  HelpCircle,
  ChevronLeft,
  ChevronRight,
  Award,
  Shield,
} from 'lucide-react';
import { logout } from '../slices/authSlice';

// ---- design tokens (same as dashboard) ----
const BG = '#0c0c0d';
const CARD = '#141416';
const INK = '#ffffff';
const MUTED = 'rgba(255,255,255,0.4)';
const BORDER = 'rgba(255,255,255,0.06)';
const GOLD = '#f4a825';
const GOLD_DEEP = '#d4911f';
const GOLD_TINT = 'rgba(244,168,37,0.12)';
const GOLD_GLOW = 'rgba(244,168,37,0.25)';

const DashboardSidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [hoveredItem, setHoveredItem] = useState(null);

  const { userInfo } = useSelector((state) => state.auth);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 1024) {
        setIsCollapsed(false);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleLogout = () => {
    dispatch(logout());
    localStorage.clear();
    sessionStorage.clear();
    document.cookie.split(";").forEach((c) => {
      document.cookie = c
        .replace(/^ +/, "")
        .replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/");
    });
    navigate('/');
    window.location.reload();
  };

  const baseLinks = [
    { name: 'Dashboard', path: '/dashboard', icon: Home },
    { name: 'Anonymous', path: '/anonymous', icon: Users },
    { name: 'Hire Talent', path: '/hire', icon: Briefcase },
    { name: 'Profile', path: '/profile', icon: UserCircle },
    { name: 'Settings', path: '/settings', icon: Settings },
  ];

  const navLinks = useMemo(() => {
    const links = [...baseLinks];
    const role = userInfo?.role;
    if (role === 'admin' || role === 'super_admin') {
      links.push({ name: 'Admin Dashboard', path: '/admin/dashboard', icon: Shield });
    }
    return links;
  }, [userInfo?.role]);

  const displayName = userInfo?.name || 'User';
  const displayEmail = userInfo?.email || '';
  const displayImage = userInfo?.profilePicture || userInfo?.profile || null;
  const isAdmin = userInfo?.role === 'admin' || userInfo?.role === 'super_admin';

  const SidebarContent = () => (
    <div
      className="h-full flex flex-col"
      style={{
        background: `linear-gradient(180deg, #141416 0%, #0c0c0d 100%)`,
        borderRight: `1px solid ${BORDER}`,
      }}
    >
      {/* Logo Section */}
      <div className={`border-b ${isCollapsed ? 'px-2 py-5' : 'px-6 py-6'}`} style={{ borderColor: BORDER }}>
        {!isCollapsed ? (
          <div className="flex items-center gap-3">
            <div className="relative">
              <img src="/logo.png" alt="Logo" className="h-9 w-9" />
              <div
                className="absolute -top-1 -right-1 w-3 h-3 rounded-full animate-pulse"
                style={{ backgroundColor: GOLD }}
              />
            </div>
            <div>
              <h1 className="text-white font-bold text-xl tracking-tight">TeensConnect</h1>
              <p className="text-xs tracking-wider uppercase" style={{ color: MUTED }}>
                Dashboard
              </p>
            </div>
          </div>
        ) : (
          <div className="flex justify-center relative">
            <img src="/logo.png" alt="Logo" className="h-9 w-9" />
            <div
              className="absolute -top-1 -right-1 w-3 h-3 rounded-full animate-pulse"
              style={{ backgroundColor: GOLD }}
            />
          </div>
        )}
      </div>

      {/* User Profile */}
      <div className={`border-b ${isCollapsed ? 'py-5 px-2' : 'p-6'}`} style={{ borderColor: BORDER }}>
        <div className={`flex items-center ${isCollapsed ? 'flex-col' : 'gap-3'}`}>
          <div className="relative">
            {displayImage ? (
              <img
                src={displayImage}
                alt={displayName}
                className="w-11 h-11 rounded-full object-cover ring-2 ring-gold/60 shadow-lg"
                style={{ ringColor: `${GOLD}99` }}
              />
            ) : (
              <div
                className="w-11 h-11 rounded-full flex items-center justify-center ring-2 shadow-lg"
                style={{
                  background: `linear-gradient(135deg, ${GOLD}, ${GOLD_DEEP})`,
                  ringColor: `${GOLD}99`,
                }}
              >
                <span className="text-white font-bold text-lg">
                  {displayName.charAt(0).toUpperCase()}
                </span>
              </div>
            )}
            <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full ring-2 ring-white" />
          </div>

          {!isCollapsed && (
            <div className="flex-1 min-w-0">
              <p className="text-white font-semibold text-sm truncate">{displayName}</p>
              <p className="text-xs truncate" style={{ color: MUTED }}>
                {displayEmail}
              </p>
              <div className="flex items-center gap-1 mt-1">
                <Award size={10} style={{ color: GOLD }} />
                <span className="text-[10px]" style={{ color: MUTED }}>
                  {isAdmin ? 'Admin' : 'Member'}
                </span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-6 space-y-1">
        {navLinks.map((link) => {
          const isActive = location.pathname === link.path;
          const Icon = link.icon;

          return (
            <Link
              key={link.name}
              to={link.path}
              onMouseEnter={() => setHoveredItem(link.name)}
              onMouseLeave={() => setHoveredItem(null)}
              className={`
                group relative flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200
                ${isCollapsed ? 'justify-center' : ''}
                ${isActive
                  ? 'bg-[#f4a825]/15 text-[#f4a825] shadow-lg shadow-[#f4a825]/5'
                  : 'text-gray-400 hover:text-white hover:bg-white/5'
                }
              `}
              title={isCollapsed ? link.name : ''}
            >
              <Icon
                size={20}
                className={`transition-all duration-200 ${
                  isActive
                    ? 'text-[#f4a825] scale-110'
                    : 'text-gray-400 group-hover:text-white group-hover:scale-110'
                }`}
              />
              {!isCollapsed && (
                <span
                  className={`text-sm font-medium transition-colors ${
                    isActive ? 'text-[#f4a825]' : 'text-gray-300 group-hover:text-white'
                  }`}
                >
                  {link.name}
                </span>
              )}
              {isActive && !isCollapsed && (
                <div className="absolute right-3 w-1 h-8 rounded-full" style={{ backgroundColor: GOLD }} />
              )}
            </Link>
          );
        })}
      </nav>

      {/* Bottom Section */}
      <div className="px-3 py-4 border-t space-y-1" style={{ borderColor: BORDER }}>
        <Link
          to="/help"
          className={`
            group flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200
            ${isCollapsed ? 'justify-center' : ''}
            text-gray-400 hover:text-white hover:bg-white/5
          `}
          title={isCollapsed ? 'Help & Support' : ''}
        >
          <HelpCircle size={20} className="text-gray-400 group-hover:text-white group-hover:scale-110 transition-all" />
          {!isCollapsed && <span className="text-sm">Help & Support</span>}
        </Link>

        <button
          onClick={handleLogout}
          className={`
            group w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200
            ${isCollapsed ? 'justify-center' : ''}
            text-gray-400 hover:text-red-400 hover:bg-red-500/10
          `}
          title={isCollapsed ? 'Logout' : ''}
        >
          <LogOut size={20} className="text-gray-400 group-hover:text-red-400 group-hover:scale-110 transition-all" />
          {!isCollapsed && <span className="text-sm">Logout</span>}
        </button>
      </div>

      {/* Collapse Toggle */}
      <button
        onClick={() => setIsCollapsed(!isCollapsed)}
        className="hidden lg:flex absolute -right-3 top-20 rounded-full p-1.5 shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-110"
        style={{
          backgroundColor: CARD,
          border: `1px solid ${BORDER}`,
          color: MUTED,
        }}
      >
        {isCollapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
      </button>
    </div>
  );

  return (
    <>
      {/* Mobile Floating Action Button */}
      <button
        onClick={() => setIsMobileMenuOpen(true)}
        className="lg:hidden fixed z-50 rounded-2xl flex items-center justify-center transition-all hover:scale-105 hover:shadow-glow"
        style={{
          bottom: '5rem',
          right: '1rem',
          width: '3rem',
          height: '3rem',
          background: `linear-gradient(135deg, ${GOLD_DEEP}, ${GOLD})`,
          boxShadow: `0 8px 32px rgba(244,168,37,0.35)`,
        }}
      >
        <Menu size={20} color="#0c0c0d" />
      </button>

      {/* Mobile Sidebar Overlay */}
      {isMobileMenuOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/60 backdrop-blur-sm z-50 transition-all duration-300"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Mobile Sidebar */}
      <div
        className={`
          lg:hidden fixed top-0 left-0 h-full w-80 z-50 transform transition-transform duration-300 ease-out shadow-2xl
          ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}
        `}
      >
        <div className="relative h-full">
          <button
            onClick={() => setIsMobileMenuOpen(false)}
            className="absolute top-4 right-4 z-10 rounded-full p-2 backdrop-blur-sm transition-all"
            style={{
              backgroundColor: 'rgba(255,255,255,0.05)',
              color: MUTED,
            }}
          >
            <X size={18} />
          </button>
          <SidebarContent />
        </div>
      </div>

      {/* Desktop Sidebar */}
      <div
        className={`
          hidden lg:block fixed left-0 top-0 h-full transition-all duration-300 z-40 shadow-2xl
          ${isCollapsed ? 'w-20' : 'w-72'}
        `}
      >
        <SidebarContent />
      </div>

      {/* Main Content Spacing */}
      <div className={`hidden lg:block transition-all duration-300 ${isCollapsed ? 'ml-20' : 'ml-72'}`} />

      <style>{`
        .hover\\:shadow-glow:hover {
          box-shadow: 0 8px 40px rgba(244,168,37,0.5) !important;
        }
      `}</style>
    </>
  );
};

export default DashboardSidebar;