import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  LayoutDashboard,
  Users,
  MessageCircle,
  Settings,
  LogOut,
  Menu,
  X,
  ChevronDown,
  Shield,
  Bell,
  TrendingUp,
  HelpCircle,
  ChevronLeft,
  ChevronRight,
  UserCheck,
  AlertTriangle,
  Sparkles,
  Activity,
  Home,
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
const RED = '#ef4444';

const AdminSidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
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

  const handleLogout = async () => {
    dispatch(logout());
    navigate('/admin/login');
  };

  const navLinks = [
    { name: 'Dashboard', path: '/admin/dashboard', icon: LayoutDashboard, color: GOLD },
    { name: 'Users', path: '/admin/users', icon: Users, color: '#3b82f6' },
    { name: 'Anonymous', path: '/admin/anonymous', icon: MessageCircle, color: '#8b5cf6' },
    { name: 'Talents', path: '/admin/talents', icon: TrendingUp, color: '#10b981' },
    { name: 'Reports', path: '/admin/reports', icon: AlertTriangle, color: RED },
    { name: 'Notifications', path: '/admin/notifications', icon: Bell, color: '#f59e0b' },
    { name: 'Main Dashboard', path: '/dashboard', icon: Home, color: GOLD },
    { name: 'Settings', path: '/admin/settings', icon: Settings, color: '#6b7280' },
  ];

  const displayName = userInfo?.name || 'Admin User';
  const displayEmail = userInfo?.email || 'admin@teensconnect.com';

  const SidebarContent = () => (
    <div
      className="h-full flex flex-col"
      style={{
        background: `linear-gradient(180deg, ${CARD} 0%, ${BG} 100%)`,
        borderRight: `1px solid ${BORDER}`,
      }}
    >
      {/* Logo Section */}
      <div className={`border-b ${isCollapsed ? 'px-2 py-5' : 'px-6 py-6'}`} style={{ borderColor: BORDER }}>
        {!isCollapsed ? (
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: GOLD_TINT }}>
                <Shield className="w-5 h-5" style={{ color: GOLD }} />
              </div>
              <div className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full animate-pulse" style={{ backgroundColor: GOLD }} />
            </div>
            <div>
              <h1 className="font-bold text-lg tracking-tight" style={{ color: INK }}>Admin Portal</h1>
              <p className="text-[10px] tracking-wider uppercase" style={{ color: MUTED }}>TeensConnect</p>
            </div>
          </div>
        ) : (
          <div className="flex justify-center relative">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: GOLD_TINT }}>
              <Shield className="w-5 h-5" style={{ color: GOLD }} />
            </div>
            <div className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full animate-pulse" style={{ backgroundColor: GOLD }} />
          </div>
        )}
      </div>

      {/* Admin Profile */}
      <div className={`border-b ${isCollapsed ? 'py-5 px-2' : 'p-5'}`} style={{ borderColor: BORDER }}>
        <div className={`flex items-center ${isCollapsed ? 'flex-col' : 'gap-3'}`}>
          <div className="relative">
            <div className="w-11 h-11 rounded-xl flex items-center justify-center shadow-lg" style={{ background: `linear-gradient(135deg, ${GOLD_DEEP}, ${GOLD})` }}>
              <span className="text-white font-bold text-lg">{displayName.charAt(0).toUpperCase()}</span>
            </div>
            <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 rounded-full ring-2" style={{ ringColor: CARD }} />
          </div>
          
          {!isCollapsed && (
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <p className="font-semibold text-sm truncate" style={{ color: INK }}>{displayName}</p>
                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="transition-colors p-1 hover:opacity-80"
                  style={{ color: MUTED }}
                >
                  <ChevronDown size={14} className={`transition-transform duration-200 ${userMenuOpen ? 'rotate-180' : ''}`} />
                </button>
              </div>
              <p className="text-xs truncate" style={{ color: MUTED }}>{displayEmail}</p>
              <div className="flex items-center gap-1 mt-1">
                <Sparkles size={10} style={{ color: GOLD }} />
                <span className="text-[10px]" style={{ color: MUTED }}>Administrator</span>
              </div>
            </div>
          )}
        </div>

        {/* Dropdown Menu */}
        {userMenuOpen && !isCollapsed && (
          <div className="mt-3 pt-3 border-t space-y-1 animate-fade-in" style={{ borderColor: BORDER }}>
            <Link
              to="/admin/profile"
              className="flex items-center gap-2 px-3 py-2 text-sm rounded-lg transition-colors"
              style={{ color: MUTED }}
              onClick={() => setUserMenuOpen(false)}
            >
              <UserCheck size={14} />
              <span>Profile Settings</span>
            </Link>
            <Link
              to="/admin/activity"
              className="flex items-center gap-2 px-3 py-2 text-sm rounded-lg transition-colors"
              style={{ color: MUTED }}
              onClick={() => setUserMenuOpen(false)}
            >
              <Activity size={14} />
              <span>Activity Log</span>
            </Link>
            <button
              onClick={() => {
                setUserMenuOpen(false);
                handleLogout();
              }}
              className="w-full flex items-center gap-2 px-3 py-2 text-sm rounded-lg transition-colors"
              style={{ color: RED }}
            >
              <LogOut size={14} />
              <span>Logout</span>
            </button>
          </div>
        )}
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
              `}
              style={{
                backgroundColor: isActive ? GOLD_TINT : 'transparent',
                color: isActive ? GOLD : MUTED,
                boxShadow: isActive ? `0 0 20px -4px ${GOLD_GLOW}` : 'none',
              }}
              title={isCollapsed ? link.name : ''}
            >
              <Icon
                size={20}
                className="transition-all duration-200"
                style={{
                  color: isActive ? GOLD : MUTED,
                  transform: isActive ? 'scale(1.1)' : 'scale(1)',
                }}
              />
              {!isCollapsed && (
                <span
                  className="text-sm font-medium transition-colors"
                  style={{ color: isActive ? GOLD : 'rgba(255,255,255,0.7)' }}
                >
                  {link.name}
                </span>
              )}
              {isActive && !isCollapsed && (
                <div className="absolute right-3 w-1 h-6 rounded-full" style={{ backgroundColor: GOLD }} />
              )}
            </Link>
          );
        })}
      </nav>

      {/* Bottom Links */}
      <div className="px-3 py-4 border-t space-y-1" style={{ borderColor: BORDER }}>
        <Link
          to="/admin/help"
          className={`
            group flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200
            ${isCollapsed ? 'justify-center' : ''}
          `}
          style={{ color: MUTED }}
          title={isCollapsed ? 'Help & Support' : ''}
        >
          <HelpCircle size={20} className="transition-all group-hover:scale-110" />
          {!isCollapsed && <span className="text-sm">Help & Support</span>}
        </Link>
        
        <button
          onClick={handleLogout}
          className={`
            group w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200
            ${isCollapsed ? 'justify-center' : ''}
          `}
          style={{ color: MUTED }}
          title={isCollapsed ? 'Logout' : ''}
        >
          <LogOut size={20} className="transition-all group-hover:scale-110" />
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
      {/* Mobile Floating Action Button - Matches plus button from main dashboard */}
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
        <Menu size={20} color={BG} />
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
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
          animation: fade-in 0.2s ease-out forwards;
        }
        .hover\\:shadow-glow:hover {
          box-shadow: 0 8px 40px rgba(244,168,37,0.5) !important;
        }
      `}</style>
    </>
  );
};

export default AdminSidebar;