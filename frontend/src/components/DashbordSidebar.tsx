import { useState, useEffect } from 'react';
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
  Award
} from 'lucide-react';
import { logout } from '../slices/authSlice';

const DashboardSidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [hoveredItem, setHoveredItem] = useState(null);
  
  const { userInfo } = useSelector((state: any) => state.auth);

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
    navigate('/');
  };

  const navLinks = [
    { name: 'Dashboard', path: '/dashboard', icon: Home },
    { name: 'Anonymous', path: '/anonymous', icon: Users },
    { name: 'Hire Talent', path: '/hire', icon: Briefcase },
    { name: 'Profile', path: '/profile', icon: UserCircle },
    { name: 'Settings', path: '/settings', icon: Settings },
  ];

  const displayName = userInfo?.name || 'User';
  const displayEmail = userInfo?.email || '';
  const displayImage = userInfo?.profilePicture || userInfo?.profile || null;

  const SidebarContent = () => (
    <div className="h-full flex flex-col bg-gradient-to-b from-[#1a2538] to-[#0f172a] shadow-2xl">
      {/* Logo Section */}
      <div className={`border-b border-white/10 ${isCollapsed ? 'px-2 py-5' : 'px-6 py-6'}`}>
        {!isCollapsed ? (
          <div className="flex items-center gap-3">
            <div className="relative">
              <img src="/logo.png" alt="Logo" className="h-9 w-9" />
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-[#f4a825] rounded-full animate-pulse" />
            </div>
            <div>
              <h1 className="text-white font-bold text-xl tracking-tight">TeensConnect</h1>
              <p className="text-gray-400 text-[10px] tracking-wider uppercase">Dashboard</p>
            </div>
          </div>
        ) : (
          <div className="flex justify-center relative">
            <img src="/logo.png" alt="Logo" className="h-9 w-9" />
            <div className="absolute -top-1 -right-1 w-3 h-3 bg-[#f4a825] rounded-full animate-pulse" />
          </div>
        )}
      </div>

      {/* User Profile */}
      <div className={`border-b border-white/10 ${isCollapsed ? 'py-5 px-2' : 'p-6'}`}>
        <div className={`flex items-center ${isCollapsed ? 'flex-col' : 'gap-3'}`}>
          <div className="relative">
            {displayImage ? (
              <img
                src={displayImage}
                alt={displayName}
                className="w-11 h-11 rounded-full object-cover ring-2 ring-[#f4a825]/60 shadow-lg"
              />
            ) : (
              <div className="w-11 h-11 rounded-full bg-gradient-to-br from-[#f4a825] to-[#e79a13] flex items-center justify-center ring-2 ring-[#f4a825]/60 shadow-lg">
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
              <p className="text-gray-400 text-xs truncate">{displayEmail}</p>
              <div className="flex items-center gap-1 mt-1">
                <Award size={10} className="text-[#f4a825]" />
                <span className="text-[10px] text-gray-500">Member</span>
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
                <div className="absolute right-3 w-1 h-8 bg-[#f4a825] rounded-full" />
              )}
            </Link>
          );
        })}
      </nav>

      {/* Bottom Section */}
      <div className="px-3 py-4 border-t border-white/10 space-y-1">
        <Link
          to="/help"
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
            text-gray-400 hover:text-red-400 hover:bg-red-400/10
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
      {/* Mobile Floating Action Button */}
      <button
        onClick={() => setIsMobileMenuOpen(true)}
        className="lg:hidden fixed bottom-6 right-6 z-50 bg-[#f4a825] text-white shadow-xl rounded-full p-4 hover:bg-[#e79a13] transition-all duration-300 hover:scale-110 active:scale-95"
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
    </>
  );
};

export default DashboardSidebar;