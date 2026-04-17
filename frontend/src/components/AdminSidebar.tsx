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
  Activity
} from 'lucide-react';
import { useAdminLogoutMutation } from '../slices/adminApiSlice';
import { adminLogout } from '../slices/adminAuthSlice';

const AdminSidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [hoveredItem, setHoveredItem] = useState(null);
  
  const [adminLogoutApi] = useAdminLogoutMutation();
  const { adminInfo } = useSelector((state: any) => state.adminAuth);

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
    try {
      await adminLogoutApi().unwrap();
      dispatch(adminLogout());
      navigate('/admin/login');
    } catch (error) {
      dispatch(adminLogout());
      navigate('/admin/login');
    }
  };

  const navLinks = [
    { name: 'Dashboard', path: '/admin/dashboard', icon: LayoutDashboard, color: '#f4a825' },
    { name: 'Users', path: '/admin/users', icon: Users, color: '#3b82f6' },
    { name: 'Anonymous', path: '/admin/anonymous', icon: MessageCircle, color: '#8b5cf6' },
    { name: 'Talents', path: '/admin/talents', icon: TrendingUp, color: '#10b981' },
    { name: 'Reports', path: '/admin/reports', icon: AlertTriangle, color: '#ef4444' },
    { name: 'Notifications', path: '/admin/notifications', icon: Bell, color: '#f59e0b' },
    { name: 'Settings', path: '/admin/settings', icon: Settings, color: '#6b7280' },
  ];

  const displayName = adminInfo?.name || 'Admin User';
  const displayEmail = adminInfo?.email || 'admin@teensconnect.com';

  const SidebarContent = () => (
    <div className="h-full flex flex-col bg-gradient-to-b from-[#1a2538] to-[#0f172a] shadow-2xl">
      {/* Logo Section */}
      <div className={`border-b border-white/10 ${isCollapsed ? 'px-2 py-5' : 'px-6 py-6'}`}>
        {!isCollapsed ? (
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="w-10 h-10 rounded-xl bg-[#f4a825]/10 flex items-center justify-center">
                <Shield className="w-5 h-5 text-[#f4a825]" />
              </div>
              <div className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-[#f4a825] rounded-full animate-pulse" />
            </div>
            <div>
              <h1 className="text-white font-bold text-lg tracking-tight">Admin Portal</h1>
              <p className="text-gray-400 text-[10px] tracking-wider uppercase">TeensConnect</p>
            </div>
          </div>
        ) : (
          <div className="flex justify-center relative">
            <div className="w-10 h-10 rounded-xl bg-[#f4a825]/10 flex items-center justify-center">
              <Shield className="w-5 h-5 text-[#f4a825]" />
            </div>
            <div className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-[#f4a825] rounded-full animate-pulse" />
          </div>
        )}
      </div>

      {/* Admin Profile */}
      <div className={`border-b border-white/10 ${isCollapsed ? 'py-5 px-2' : 'p-5'}`}>
        <div className={`flex items-center ${isCollapsed ? 'flex-col' : 'gap-3'}`}>
          <div className="relative">
            <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-[#f4a825] to-[#e09e1a] flex items-center justify-center shadow-lg">
              <span className="text-white font-bold text-lg">
                {displayName.charAt(0).toUpperCase()}
              </span>
            </div>
            <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 rounded-full ring-2 ring-[#1a2538]" />
          </div>
          
          {!isCollapsed && (
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <p className="text-white font-semibold text-sm truncate">{displayName}</p>
                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="text-gray-400 hover:text-white transition-colors p-1"
                >
                  <ChevronDown size={14} className={`transition-transform duration-200 ${userMenuOpen ? 'rotate-180' : ''}`} />
                </button>
              </div>
              <p className="text-gray-500 text-xs truncate">{displayEmail}</p>
              <div className="flex items-center gap-1 mt-1">
                <Sparkles size={10} className="text-[#f4a825]" />
                <span className="text-[10px] text-gray-500">Administrator</span>
              </div>
            </div>
          )}
        </div>

        {/* Dropdown Menu */}
        {userMenuOpen && !isCollapsed && (
          <div className="mt-3 pt-3 border-t border-white/10 space-y-1 animate-fade-in">
            <Link
              to="/admin/profile"
              className="flex items-center gap-2 px-3 py-2 text-sm text-gray-400 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
              onClick={() => setUserMenuOpen(false)}
            >
              <UserCheck size={14} />
              <span>Profile Settings</span>
            </Link>
            <Link
              to="/admin/activity"
              className="flex items-center gap-2 px-3 py-2 text-sm text-gray-400 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
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
              className="w-full flex items-center gap-2 px-3 py-2 text-sm text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-lg transition-colors"
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
          const isHovered = hoveredItem === link.name;
          
          return (
            <Link
              key={link.name}
              to={link.path}
              onMouseEnter={() => setHoveredItem(link.name)}
              onMouseLeave={() => setHoveredItem(null)}
              className={`
                group relative flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200
                ${isActive 
                  ? 'bg-[#f4a825]/15 text-[#f4a825] shadow-lg shadow-[#f4a825]/5' 
                  : 'text-gray-400 hover:text-white hover:bg-white/5'
                }
                ${isCollapsed ? 'justify-center' : ''}
              `}
              title={isCollapsed ? link.name : ''}
            >
              <Icon size={20} className={`transition-all duration-200 ${isActive ? 'text-[#f4a825] scale-110' : 'text-gray-400 group-hover:text-white group-hover:scale-110'}`} />
              {!isCollapsed && (
                <span className={`text-sm font-medium transition-colors ${isActive ? 'text-[#f4a825]' : 'text-gray-300 group-hover:text-white'}`}>
                  {link.name}
                </span>
              )}
              {isActive && !isCollapsed && (
                <div className="absolute right-3 w-1 h-6 bg-[#f4a825] rounded-full" />
              )}
            </Link>
          );
        })}
      </nav>

      {/* Bottom Stats (Collapsed only) */}
      {isCollapsed && (
        <div className="px-2 py-4 border-t border-white/10">
          <div className="text-center">
            <div className="w-8 h-8 rounded-lg bg-[#f4a825]/10 flex items-center justify-center mx-auto">
              <Activity size={14} className="text-[#f4a825]" />
            </div>
          </div>
        </div>
      )}

      {/* Bottom Links */}
      <div className="px-3 py-4 border-t border-white/10 space-y-1">
        <Link
          to="/admin/help"
          className={`
            group flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200
            text-gray-400 hover:text-white hover:bg-white/5
            ${isCollapsed ? 'justify-center' : ''}
          `}
          title={isCollapsed ? 'Help & Support' : ''}
        >
          <HelpCircle size={20} className="transition-all group-hover:scale-110" />
          {!isCollapsed && <span className="text-sm">Help & Support</span>}
        </Link>
        
        <button
          onClick={handleLogout}
          className={`
            group w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200
            text-red-400/70 hover:text-red-400 hover:bg-red-500/10
            ${isCollapsed ? 'justify-center' : ''}
          `}
          title={isCollapsed ? 'Logout' : ''}
        >
          <LogOut size={20} className="transition-all group-hover:scale-110" />
          {!isCollapsed && <span className="text-sm">Logout</span>}
        </button>
      </div>

      {/* Collapse Toggle */}
      <button
        onClick={() => setIsCollapsed(!isCollapsed)}
        className="hidden lg:flex absolute -right-3 top-20 bg-[#1a2538] border border-white/20 rounded-full p-1.5 shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-110"
      >
        {isCollapsed ? (
          <ChevronRight size={14} className="text-white" />
        ) : (
          <ChevronLeft size={14} className="text-white" />
        )}
      </button>
    </div>
  );

  return (
    <>
      {/* Mobile Floating Action Button - Bottom Right Floating */}
      <button
        onClick={() => setIsMobileMenuOpen(true)}
        className="lg:hidden fixed bottom-24 right-6 z-50 bg-[#f4a825] text-white shadow-xl rounded-full p-4 hover:bg-[#e09e1a] transition-all duration-300 hover:scale-110 active:scale-95"
      >
        <Menu size={24} />
      </button>

      {/* Mobile Sidebar Overlay */}
      {isMobileMenuOpen && (
        <div 
          className="lg:hidden fixed inset-0 bg-black/60 backdrop-blur-sm z-50 transition-all duration-300"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Mobile Sidebar */}
      <div className={`
        lg:hidden fixed top-0 left-0 h-full w-80 z-50 transform transition-transform duration-300 ease-out shadow-2xl
        ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="relative h-full">
          <button
            onClick={() => setIsMobileMenuOpen(false)}
            className="absolute top-4 right-4 z-10 text-gray-400 hover:text-white bg-white/10 backdrop-blur-sm rounded-full p-2 hover:bg-white/20 transition-all"
          >
            <X size={18} />
          </button>
          <SidebarContent />
        </div>
      </div>

      {/* Desktop Sidebar */}
      <div className={`
        hidden lg:block fixed left-0 top-0 h-full transition-all duration-300 z-40 shadow-2xl
        ${isCollapsed ? 'w-20' : 'w-72'}
      `}>
        <SidebarContent />
      </div>

      {/* Main Content Spacing */}
      <div className={`hidden lg:block transition-all duration-300 ${isCollapsed ? 'ml-20' : 'ml-72'}`} />

      {/* Styles */}
      <style>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .animate-fade-in {
          animation: fade-in 0.2s ease-out forwards;
        }
      `}</style>
    </>
  );
};

export default AdminSidebar;