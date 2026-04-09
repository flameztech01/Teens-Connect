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
  ChevronLeft
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
    <div className="h-full flex flex-col bg-[#1a2538] shadow-xl">
      {/* Logo Section */}
      <div className={`border-b border-gray-700/50 ${isCollapsed ? 'px-2 py-5' : 'px-5 py-6'}`}>
        {!isCollapsed ? (
          <div className="flex items-center gap-3">
            <img src="/logo.png" alt="Logo" className="h-8 w-8" />
            <div>
              <h1 className="text-white font-semibold text-lg tracking-tight">TeensConnect</h1>
              <p className="text-gray-400 text-[11px] tracking-wide">Dashboard</p>
            </div>
          </div>
        ) : (
          <div className="flex justify-center">
            <img src="/logo.png" alt="Logo" className="h-8 w-8" />
          </div>
        )}
      </div>

      {/* User Profile */}
      <div className={`border-b border-gray-700/50 ${isCollapsed ? 'py-4 px-2' : 'p-5'}`}>
        <div className={`flex items-center ${isCollapsed ? 'flex-col' : 'gap-3'}`}>
          {displayImage ? (
            <img
              src={displayImage}
              alt={displayName}
              className="w-10 h-10 rounded-full object-cover ring-1 ring-[#f4a825]/40"
            />
          ) : (
            <div className="w-10 h-10 rounded-full bg-[#f4a825]/10 flex items-center justify-center ring-1 ring-[#f4a825]/40">
              <span className="text-[#f4a825] font-medium text-sm">
                {displayName.charAt(0).toUpperCase()}
              </span>
            </div>
          )}
          
          {!isCollapsed && (
            <div className="flex-1 min-w-0">
              <p className="text-white font-medium text-sm truncate">{displayName}</p>
              <p className="text-gray-400 text-xs truncate">{displayEmail}</p>
            </div>
          )}
        </div>
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
                group flex items-center gap-3 px-3 py-2.5 rounded-md transition-all duration-200
                ${isActive 
                  ? 'bg-[#f4a825]/10 text-[#f4a825] border-l-2 border-[#f4a825]' 
                  : 'text-gray-300 hover:text-white hover:bg-gray-700/30 border-l-2 border-transparent'
                }
                ${isCollapsed ? 'justify-center' : ''}
              `}
              title={isCollapsed ? link.name : ''}
            >
              <Icon size={18} className={`transition-colors ${isActive ? 'text-[#f4a825]' : 'text-gray-400 group-hover:text-white'}`} />
              {!isCollapsed && (
                <span className={`text-sm font-medium transition-colors ${isActive ? 'text-[#f4a825]' : 'text-gray-300 group-hover:text-white'}`}>
                  {link.name}
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Bottom Section */}
      <div className="px-3 py-4 border-t border-gray-700/50 space-y-1">
        <Link
          to="/help"
          className={`
            group flex items-center gap-3 px-3 py-2.5 rounded-md transition-all duration-200
            text-gray-400 hover:text-white hover:bg-gray-700/30
            ${isCollapsed ? 'justify-center' : ''}
          `}
          title={isCollapsed ? 'Help & Support' : ''}
        >
          <HelpCircle size={18} className="transition-colors group-hover:text-white" />
          {!isCollapsed && <span className="text-sm">Help & Support</span>}
        </Link>
        
        <button
          onClick={handleLogout}
          className={`
            group w-full flex items-center gap-3 px-3 py-2.5 rounded-md transition-all duration-200
            text-gray-400 hover:text-red-400 hover:bg-red-400/10
            ${isCollapsed ? 'justify-center' : ''}
          `}
          title={isCollapsed ? 'Logout' : ''}
        >
          <LogOut size={18} className="transition-colors group-hover:text-red-400" />
          {!isCollapsed && <span className="text-sm">Logout</span>}
        </button>
      </div>

      {/* Collapse Toggle */}
      <button
        onClick={() => setIsCollapsed(!isCollapsed)}
        className="hidden lg:flex absolute -right-3 top-1/2 -translate-y-1/2 bg-white border border-gray-200 rounded-full p-1 shadow-md hover:shadow-lg transition-all duration-200"
      >
        <ChevronLeft size={14} className={`text-gray-600 transition-transform duration-300 ${isCollapsed ? 'rotate-180' : ''}`} />
      </button>
    </div>
  );

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        onClick={() => setIsMobileMenuOpen(true)}
        className="lg:hidden fixed top-4 left-4 z-50 bg-white shadow-md text-gray-700 p-2 rounded-md hover:bg-gray-50 transition-colors"
      >
        <Menu size={20} />
      </button>

      {/* Mobile Sidebar Overlay */}
      {isMobileMenuOpen && (
        <div 
          className="lg:hidden fixed inset-0 bg-black/40 backdrop-blur-sm z-50"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Mobile Sidebar */}
      <div className={`
        lg:hidden fixed top-0 left-0 h-full w-72 z-50 transform transition-transform duration-300 ease-out shadow-xl
        ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="relative h-full">
          <button
            onClick={() => setIsMobileMenuOpen(false)}
            className="absolute top-4 right-4 z-10 text-gray-400 hover:text-gray-600 bg-white rounded-md p-1.5 shadow-sm hover:shadow transition-all"
          >
            <X size={16} />
          </button>
          <SidebarContent />
        </div>
      </div>

      {/* Desktop Sidebar */}
      <div className={`
        hidden lg:block fixed left-0 top-0 h-full transition-all duration-300 z-40 shadow-lg
        ${isCollapsed ? 'w-16' : 'w-64'}
      `}>
        <SidebarContent />
      </div>

      {/* Main Content Spacing */}
      <div className={`hidden lg:block transition-all duration-300 ${isCollapsed ? 'ml-16' : 'ml-64'}`} />
    </>
  );
};

export default DashboardSidebar;