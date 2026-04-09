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
  UserCheck,
  AlertTriangle
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
    { name: 'Dashboard', path: '/admin/dashboard', icon: LayoutDashboard },
    { name: 'Users', path: '/admin/users', icon: Users },
    { name: 'Anonymous', path: '/admin/anonymous', icon: MessageCircle },
    { name: 'Talents', path: '/admin/talents', icon: TrendingUp },
    { name: 'Reports', path: '/admin/reports', icon: AlertTriangle },
    { name: 'Notifications', path: '/admin/notifications', icon: Bell },
    { name: 'Settings', path: '/admin/settings', icon: Settings },
  ];

  const displayName = adminInfo?.name || 'Admin';
  const displayEmail = adminInfo?.email || 'admin@teensconnect.com';

  const SidebarContent = () => (
    <div className="h-full flex flex-col bg-[#1a2538]">
      {/* Logo Section */}
      <div className={`border-b border-gray-700 ${isCollapsed ? 'py-5' : 'px-5 py-6'}`}>
        {!isCollapsed ? (
          <div className="flex items-center gap-2 px-2">
            <Shield className="h-6 w-6 text-[#f4a825]" />
            <div>
              <h1 className="text-white font-semibold text-base">Admin Portal</h1>
              <p className="text-gray-500 text-xs">TeensConnect</p>
            </div>
          </div>
        ) : (
          <div className="flex justify-center">
            <Shield className="h-6 w-6 text-[#f4a825]" />
          </div>
        )}
      </div>

      {/* Admin Profile */}
      <div className={`border-b border-gray-700 ${isCollapsed ? 'py-4' : 'p-4'}`}>
        <div className={`flex items-center ${isCollapsed ? 'flex-col' : 'gap-3'}`}>
          <div className="w-9 h-9 rounded-full bg-[#f4a825]/10 flex items-center justify-center ring-1 ring-[#f4a825]/30 flex-shrink-0">
            <span className="text-[#f4a825] font-semibold text-sm">
              {displayName.charAt(0).toUpperCase()}
            </span>
          </div>
          
          {!isCollapsed && (
            <>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <p className="text-white text-sm font-medium truncate">{displayName}</p>
                  <button
                    onClick={() => setUserMenuOpen(!userMenuOpen)}
                    className="text-gray-500 hover:text-white transition-colors"
                  >
                    <ChevronDown size={14} />
                  </button>
                </div>
                <p className="text-gray-500 text-xs truncate">{displayEmail}</p>
              </div>
            </>
          )}
        </div>

        {/* Dropdown Menu */}
        {userMenuOpen && !isCollapsed && (
          <div className="mt-3 pt-3 border-t border-gray-700 space-y-1">
            <Link
              to="/admin/profile"
              className="flex items-center gap-2 px-3 py-2 text-sm text-gray-400 hover:text-white hover:bg-gray-700 rounded-md transition-colors"
              onClick={() => setUserMenuOpen(false)}
            >
              <UserCheck size={14} />
              <span>Profile</span>
            </Link>
            <button
              onClick={() => {
                setUserMenuOpen(false);
                handleLogout();
              }}
              className="w-full flex items-center gap-2 px-3 py-2 text-sm text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-md transition-colors"
            >
              <LogOut size={14} />
              <span>Logout</span>
            </button>
          </div>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-1">
        {navLinks.map((link) => {
          const isActive = location.pathname === link.path;
          const Icon = link.icon;
          
          return (
            <Link
              key={link.name}
              to={link.path}
              className={`
                flex items-center gap-3 px-3 py-2 rounded-md transition-all duration-200
                ${isActive 
                  ? 'bg-[#f4a825] text-[#1a2538]' 
                  : 'text-gray-400 hover:text-white hover:bg-gray-700'
                }
                ${isCollapsed ? 'justify-center' : ''}
              `}
              title={isCollapsed ? link.name : ''}
            >
              <Icon size={18} />
              {!isCollapsed && <span className="text-sm">{link.name}</span>}
            </Link>
          );
        })}
      </nav>

      {/* Bottom Links */}
      <div className="px-3 py-4 border-t border-gray-700 space-y-1">
        <Link
          to="/admin/help"
          className={`
            flex items-center gap-3 px-3 py-2 rounded-md transition-all duration-200
            text-gray-500 hover:text-white hover:bg-gray-700
            ${isCollapsed ? 'justify-center' : ''}
          `}
          title={isCollapsed ? 'Help' : ''}
        >
          <HelpCircle size={18} />
          {!isCollapsed && <span className="text-sm">Help</span>}
        </Link>
        
        <button
          onClick={handleLogout}
          className={`
            w-full flex items-center gap-3 px-3 py-2 rounded-md transition-all duration-200
            text-red-400/70 hover:text-red-400 hover:bg-red-500/10
            ${isCollapsed ? 'justify-center' : ''}
          `}
          title={isCollapsed ? 'Logout' : ''}
        >
          <LogOut size={18} />
          {!isCollapsed && <span className="text-sm">Logout</span>}
        </button>
      </div>

      {/* Collapse Toggle */}
      <button
        onClick={() => setIsCollapsed(!isCollapsed)}
        className="hidden lg:flex absolute -right-3 top-1/2 -translate-y-1/2 bg-white border border-gray-200 rounded-full p-1 shadow-md hover:shadow-lg transition-all"
      >
        <ChevronLeft size={12} className={`text-gray-600 transition-transform duration-300 ${isCollapsed ? 'rotate-180' : ''}`} />
      </button>
    </div>
  );

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        onClick={() => setIsMobileMenuOpen(true)}
        className="lg:hidden fixed top-4 left-4 z-50 bg-[#1a2538] text-white p-2 rounded-md shadow-lg"
      >
        <Menu size={20} />
      </button>

      {/* Mobile Overlay */}
      {isMobileMenuOpen && (
        <div 
          className="lg:hidden fixed inset-0 bg-black/50 z-50"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Mobile Sidebar */}
      <div className={`
        lg:hidden fixed top-0 left-0 h-full w-64 z-50 transform transition-transform duration-300
        ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="relative h-full">
          <button
            onClick={() => setIsMobileMenuOpen(false)}
            className="absolute top-3 right-3 z-10 text-gray-400 hover:text-white bg-gray-800 rounded-md p-1"
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

      {/* Content Spacing */}
      <div className={`hidden lg:block transition-all duration-300 ${isCollapsed ? 'ml-16' : 'ml-64'}`} />
    </>
  );
};

export default AdminSidebar;