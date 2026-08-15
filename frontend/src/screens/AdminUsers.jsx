import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import AdminSidebar from '../components/AdminSidebar';
import { useGetUsersQuery } from '../slices/userApiSlice';
import {
  Users,
  Search,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Eye,
  Loader,
  ChevronLeft,
  ChevronRight,
  Shield,
  X,
  UserCheck,
  Clock,
  ChevronUp,
  MoreVertical,
  Award,
  Heart,
  Link as LinkIcon,
  Smartphone,
  Lock
} from 'lucide-react';

// ---- design tokens ----
const BG = '#0c0c0d';
const CARD = '#141416';
const INK = '#ffffff';
const MUTED = 'rgba(255,255,255,0.4)';
const BORDER = 'rgba(255,255,255,0.06)';
const GOLD = '#f4a825';
const GOLD_DEEP = '#d4911f';
const GOLD_TINT = 'rgba(244,168,37,0.12)';
const GOLD_GLOW = 'rgba(244,168,37,0.25)';
const GREEN = '#22c55e';
const RED = '#ef4444';
const BLUE = '#3b82f6';
const PURPLE = '#8b5cf6';
const AMBER = '#f59e0b';

// ---- styled components ----
const CardShell = ({ children, className = '', glow = false }) => (
  <div
    className={`rounded-2xl p-4 sm:p-5 transition-all duration-300 ${glow ? 'hover:border-gold/30' : ''} ${className}`}
    style={{
      backgroundColor: CARD,
      border: `1px solid ${BORDER}`,
      boxShadow: glow ? `0 0 40px -8px ${GOLD_GLOW}` : '0 4px 24px rgba(0,0,0,0.3)',
    }}
  >
    {children}
  </div>
);

const StatCard = ({ label, value, icon: Icon, color = GOLD }) => (
  <div
    className="flex-shrink-0 w-40 rounded-2xl p-4"
    style={{ backgroundColor: CARD, border: `1px solid ${BORDER}` }}
  >
    <p className="text-xs" style={{ color: MUTED }}>{label}</p>
    <p className="text-2xl font-bold" style={{ color: color }}>{value}</p>
  </div>
);

const AdminUsers = () => {
  const navigate = useNavigate();
  const { userInfo } = useSelector((state) => state.auth);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUser, setSelectedUser] = useState(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const { data: usersData, isLoading } = useGetUsersQuery({
    page,
    limit: 10,
    search: searchTerm
  });

  // Check if user is admin
  if (!userInfo) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: BG }}>
        <div className="text-center p-8">
          <Lock className="w-16 h-16 mx-auto mb-4" style={{ color: MUTED }} />
          <h2 className="text-2xl font-bold" style={{ color: INK }}>Access Denied</h2>
          <p className="mt-2" style={{ color: MUTED }}>Please login to access this page</p>
        </div>
      </div>
    );
  }

  if (userInfo.role !== 'admin' && userInfo.role !== 'super_admin') {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: BG }}>
        <div className="text-center p-8">
          <Lock className="w-16 h-16 mx-auto mb-4" style={{ color: RED }} />
          <h2 className="text-2xl font-bold" style={{ color: INK }}>Access Denied</h2>
          <p className="mt-2" style={{ color: MUTED }}>You don't have admin privileges</p>
        </div>
      </div>
    );
  }

  const handleSearch = () => {
    setSearchTerm(search);
    setPage(1);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const handleClearSearch = () => {
    setSearch('');
    setSearchTerm('');
    setPage(1);
  };

  const handleViewUser = (user) => {
    setSelectedUser(user);
    setIsDrawerOpen(true);
  };

  const closeDrawer = () => {
    setIsDrawerOpen(false);
    setTimeout(() => setSelectedUser(null), 300);
  };

  const getAuthMethodBadge = (method) => {
    if (method === 'google') {
      return <span className="px-2 py-0.5 rounded-lg text-xs font-medium" style={{ backgroundColor: 'rgba(59,130,246,0.12)', color: BLUE }}>Google</span>;
    }
    return <span className="px-2 py-0.5 rounded-lg text-xs font-medium" style={{ backgroundColor: 'rgba(255,255,255,0.04)', color: MUTED }}>Email</span>;
  };

  const getInitials = (name) => {
    if (!name) return 'U';
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: BG }}>
      <AdminSidebar />
      
      <div className="lg:ml-72 relative">
        {/* Header – dark theme */}
        <div className="sticky top-0 z-30" style={{ backgroundColor: BG, borderBottom: `1px solid ${BORDER}` }}>
          <div className="px-4 sm:px-6 py-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 sm:w-12 sm:h-12 shrink-0 rounded-xl flex items-center justify-center" style={{ backgroundColor: GOLD_TINT }}>
                <Users className="w-5 h-5 sm:w-6 sm:h-6" style={{ color: GOLD }} />
              </div>
              <div>
                <h1 className="text-xl sm:text-2xl font-bold leading-tight" style={{ color: INK }}>Manage Users</h1>
                <p className="text-xs sm:text-sm" style={{ color: MUTED }}>
                  View and manage all registered users on the platform
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="px-3 sm:px-6 py-4 sm:py-6">
          {/* Stats Cards - Horizontal Scroll */}
          <div className="flex gap-3 overflow-x-auto pb-4 mb-6 hide-scrollbar">
            <StatCard label="Total Users" value={usersData?.total || 0} icon={Users} color={BLUE} />
            <StatCard label="This Page" value={usersData?.users?.length || 0} icon={Users} color={GOLD} />
            <StatCard label="Total Pages" value={usersData?.pages || 0} icon={Users} color={PURPLE} />
            <StatCard 
              label="Google Users" 
              value={usersData?.users?.filter((u) => u.authMethod === 'google').length || 0} 
              icon={Users} 
              color={GREEN} 
            />
          </div>

          {/* Search Bar – dark */}
          <CardShell glow className="mb-6">
            <div className="flex gap-3">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5" style={{ color: MUTED }} />
                <input
                  type="text"
                  placeholder="Search by name, email, or username..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  onKeyPress={handleKeyPress}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl focus:outline-none focus:ring-2 transition-all"
                  style={{
                    backgroundColor: 'rgba(255,255,255,0.04)',
                    color: INK,
                    border: `1px solid ${BORDER}`,
                    focusRing: GOLD,
                  }}
                />
              </div>
              <button
                onClick={handleSearch}
                className="px-6 py-2.5 rounded-xl font-semibold transition-colors hover:opacity-90"
                style={{ backgroundColor: GOLD, color: BG }}
              >
                Search
              </button>
              {(searchTerm || search) && (
                <button
                  onClick={handleClearSearch}
                  className="px-4 py-2.5 rounded-xl transition-colors hover:opacity-80"
                  style={{ border: `1px solid ${BORDER}`, color: MUTED }}
                >
                  <X size={20} className="hover:text-red-400" style={{ color: MUTED }} />
                </button>
              )}
            </div>
          </CardShell>

          {/* Users Cards - Dark */}
          {isLoading ? (
            <div className="text-center py-12">
              <Loader className="w-8 h-8 animate-spin mx-auto mb-2" style={{ color: GOLD }} />
              <p className="text-sm" style={{ color: MUTED }}>Loading users...</p>
            </div>
          ) : usersData?.users?.length === 0 ? (
            <div className="text-center py-12" style={{ backgroundColor: CARD, border: `1px solid ${BORDER}`, borderRadius: '1rem' }}>
              <Users className="w-12 h-12 mx-auto mb-3" style={{ color: MUTED }} />
              <p style={{ color: MUTED }}>No users found</p>
            </div>
          ) : (
            <div className="space-y-3">
              {usersData?.users?.map((user) => (
                <div
                  key={user._id}
                  onClick={() => handleViewUser(user)}
                  className="rounded-2xl p-4 transition-all cursor-pointer hover:bg-white/5"
                  style={{ backgroundColor: CARD, border: `1px solid ${BORDER}` }}
                >
                  <div className="flex items-start gap-3">
                    {/* Avatar */}
                    {user.profile ? (
                      <img src={user.profile} alt={user.name} className="w-12 h-12 rounded-full object-cover flex-shrink-0" />
                    ) : (
                      <div className="w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0" style={{ background: `linear-gradient(135deg, ${GOLD_DEEP}, ${GOLD})` }}>
                        <span className="text-white font-bold text-sm">
                          {getInitials(user.name)}
                        </span>
                      </div>
                    )}
                    
                    {/* User Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="font-semibold text-sm" style={{ color: INK }}>{user.name || 'No name'}</h3>
                          <p className="text-xs" style={{ color: MUTED }}>@{user.username || 'username'}</p>
                        </div>
                        {user.role === 'admin' && (
                          <Shield size={14} style={{ color: PURPLE }} />
                        )}
                      </div>
                      
                      <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-2">
                        <div className="flex items-center gap-1">
                          <Mail size={12} style={{ color: MUTED }} />
                          <span className="text-xs truncate max-w-[120px]" style={{ color: MUTED }}>{user.email}</span>
                        </div>
                        {user.phone && (
                          <div className="flex items-center gap-1">
                            <Phone size={12} style={{ color: MUTED }} />
                            <span className="text-xs" style={{ color: MUTED }}>{user.phone}</span>
                          </div>
                        )}
                        {user.location && (
                          <div className="flex items-center gap-1">
                            <MapPin size={12} style={{ color: MUTED }} />
                            <span className="text-xs truncate max-w-[100px]" style={{ color: MUTED }}>{user.location}</span>
                          </div>
                        )}
                      </div>
                      
                      <div className="flex items-center justify-between mt-2">
                        <div className="flex items-center gap-2">
                          <span className="text-xs flex items-center gap-1" style={{ color: MUTED }}>
                            <Calendar size={10} />
                            {new Date(user.createdAt).toLocaleDateString()}
                          </span>
                          {getAuthMethodBadge(user.authMethod)}
                        </div>
                        <Eye size={16} style={{ color: MUTED }} />
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Pagination – dark */}
          {usersData && usersData.pages > 1 && (
            <div className="flex justify-between items-center mt-6 pt-4 border-t" style={{ borderColor: BORDER }}>
              <p className="text-xs" style={{ color: MUTED }}>
                Page {usersData.page} of {usersData.pages}
              </p>
              <div className="flex gap-2">
                <button
                  onClick={() => setPage(p => Math.max(1, p - 1))}
                  disabled={usersData.page === 1}
                  className="flex items-center gap-1 px-3 py-1.5 rounded-xl text-sm transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  style={{
                    border: `1px solid ${BORDER}`,
                    color: MUTED,
                  }}
                >
                  <ChevronLeft size={14} />
                  Previous
                </button>
                <button
                  onClick={() => setPage(p => Math.min(usersData.pages, p + 1))}
                  disabled={usersData.page === usersData.pages}
                  className="flex items-center gap-1 px-3 py-1.5 rounded-xl text-sm transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  style={{
                    border: `1px solid ${BORDER}`,
                    color: MUTED,
                  }}
                >
                  Next
                  <ChevronRight size={14} />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Bottom Drawer Modal – dark theme */}
      {isDrawerOpen && selectedUser && (
        <>
          <div className="fixed inset-0 bg-black/70 z-50 transition-opacity duration-300" onClick={closeDrawer} />
          
          <div className="fixed bottom-0 left-0 right-0 z-50 rounded-t-3xl shadow-2xl transform transition-transform duration-300 animate-slide-up max-h-[85vh] overflow-y-auto" style={{ backgroundColor: CARD, border: `1px solid ${BORDER}` }}>
            <div className="sticky top-0 pt-4 pb-2 px-6 border-b" style={{ backgroundColor: CARD, borderColor: BORDER }}>
              <div className="flex justify-center mb-3">
                <div className="w-12 h-1 rounded-full" style={{ backgroundColor: MUTED }} />
              </div>
              <div className="flex justify-between items-center">
                <h2 className="text-lg font-bold" style={{ color: INK }}>User Details</h2>
                <button onClick={closeDrawer} className="transition-colors hover:opacity-80" style={{ color: MUTED }}>
                  <X size={24} />
                </button>
              </div>
            </div>

            <div className="p-6 space-y-5">
              {/* Profile Header */}
              <div className="flex items-center gap-4 pb-4 border-b" style={{ borderColor: BORDER }}>
                {selectedUser.profile ? (
                  <img src={selectedUser.profile} alt={selectedUser.name} className="w-16 h-16 rounded-full object-cover" />
                ) : (
                  <div className="w-16 h-16 rounded-full flex items-center justify-center" style={{ background: `linear-gradient(135deg, ${GOLD_DEEP}, ${GOLD})` }}>
                    <span className="text-white font-bold text-xl">
                      {getInitials(selectedUser.name)}
                    </span>
                  </div>
                )}
                <div>
                  <h3 className="text-lg font-bold" style={{ color: INK }}>{selectedUser.name || 'No name'}</h3>
                  <p className="text-sm" style={{ color: MUTED }}>@{selectedUser.username || 'username'}</p>
                  {selectedUser.role === 'admin' && (
                    <span className="inline-flex items-center gap-1 mt-1 text-xs px-2 py-0.5 rounded-lg" style={{ backgroundColor: 'rgba(139,92,246,0.12)', color: PURPLE }}>
                      <Shield size={10} />
                      Admin
                    </span>
                  )}
                </div>
              </div>

              {/* Contact Information */}
              <div>
                <h4 className="text-xs font-semibold uppercase tracking-wider mb-3" style={{ color: MUTED }}>Contact Information</h4>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: 'rgba(59,130,246,0.12)' }}>
                      <Mail size={14} style={{ color: BLUE }} />
                    </div>
                    <div>
                      <p className="text-xs" style={{ color: MUTED }}>Email</p>
                      <p className="text-sm" style={{ color: INK }}>{selectedUser.email}</p>
                    </div>
                  </div>
                  {selectedUser.phone && (
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: 'rgba(34,197,94,0.12)' }}>
                        <Phone size={14} style={{ color: GREEN }} />
                      </div>
                      <div>
                        <p className="text-xs" style={{ color: MUTED }}>Phone</p>
                        <p className="text-sm" style={{ color: INK }}>{selectedUser.phone}</p>
                      </div>
                    </div>
                  )}
                  {selectedUser.whatsappNumber && (
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: 'rgba(34,197,94,0.12)' }}>
                        <Smartphone size={14} style={{ color: GREEN }} />
                      </div>
                      <div>
                        <p className="text-xs" style={{ color: MUTED }}>WhatsApp</p>
                        <p className="text-sm" style={{ color: INK }}>{selectedUser.whatsappNumber}</p>
                      </div>
                    </div>
                  )}
                  {selectedUser.location && (
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: 'rgba(245,158,11,0.12)' }}>
                        <MapPin size={14} style={{ color: AMBER }} />
                      </div>
                      <div>
                        <p className="text-xs" style={{ color: MUTED }}>Location</p>
                        <p className="text-sm" style={{ color: INK }}>{selectedUser.location}</p>
                      </div>
                    </div>
                  )}
                  {selectedUser.portfolioLink && (
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: 'rgba(139,92,246,0.12)' }}>
                        <LinkIcon size={14} style={{ color: PURPLE }} />
                      </div>
                      <div>
                        <p className="text-xs" style={{ color: MUTED }}>Portfolio</p>
                        <a href={selectedUser.portfolioLink} target="_blank" rel="noopener noreferrer" className="text-sm hover:opacity-80" style={{ color: GOLD }}>
                          View Portfolio
                        </a>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Skills */}
              {selectedUser.skills && selectedUser.skills.length > 0 && (
                <div>
                  <h4 className="text-xs font-semibold uppercase tracking-wider mb-3 flex items-center gap-2" style={{ color: MUTED }}>
                    <Award size={14} />
                    Skills ({selectedUser.skills.length})
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedUser.skills.slice(0, 15).map((skill, idx) => (
                      <span key={idx} className="px-2.5 py-1 rounded-lg text-xs" style={{ backgroundColor: 'rgba(255,255,255,0.04)', color: MUTED }}>
                        {skill}
                      </span>
                    ))}
                    {selectedUser.skills.length > 15 && (
                      <span className="text-xs" style={{ color: MUTED }}>+{selectedUser.skills.length - 15} more</span>
                    )}
                  </div>
                </div>
              )}

              {/* Interests */}
              {selectedUser.interests && selectedUser.interests.length > 0 && (
                <div>
                  <h4 className="text-xs font-semibold uppercase tracking-wider mb-3 flex items-center gap-2" style={{ color: MUTED }}>
                    <Heart size={14} />
                    Interests ({selectedUser.interests.length})
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedUser.interests.slice(0, 15).map((interest, idx) => (
                      <span key={idx} className="px-2.5 py-1 rounded-lg text-xs" style={{ backgroundColor: 'rgba(244,168,37,0.08)', color: GOLD }}>
                        {interest}
                      </span>
                    ))}
                    {selectedUser.interests.length > 15 && (
                      <span className="text-xs" style={{ color: MUTED }}>+{selectedUser.interests.length - 15} more</span>
                    )}
                  </div>
                </div>
              )}

              {/* Bio */}
              {selectedUser.bio && (
                <div>
                  <h4 className="text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: MUTED }}>Bio</h4>
                  <p className="text-sm leading-relaxed" style={{ color: MUTED }}>{selectedUser.bio}</p>
                </div>
              )}

              {/* Account Info */}
              <div>
                <h4 className="text-xs font-semibold uppercase tracking-wider mb-3" style={{ color: MUTED }}>Account Information</h4>
                <div className="rounded-xl p-4 space-y-2" style={{ backgroundColor: 'rgba(255,255,255,0.03)' }}>
                  <div className="flex justify-between">
                    <span className="text-xs" style={{ color: MUTED }}>Joined</span>
                    <span className="text-xs" style={{ color: INK }}>{new Date(selectedUser.createdAt).toLocaleDateString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-xs" style={{ color: MUTED }}>Auth Method</span>
                    <span className="text-xs capitalize" style={{ color: INK }}>{selectedUser.authMethod || 'Email'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-xs" style={{ color: MUTED }}>User ID</span>
                    <span className="text-xs font-mono" style={{ color: MUTED }}>{selectedUser._id?.slice(-8)}</span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 pt-4 border-t" style={{ borderColor: BORDER }}>
                <button className="flex-1 py-3 rounded-xl font-semibold transition-colors hover:opacity-90 flex items-center justify-center gap-2" style={{ backgroundColor: RED, color: '#fff' }}>
                  <UserCheck size={16} />
                  Suspend User
                </button>
                <button
                  onClick={closeDrawer}
                  className="flex-1 py-3 rounded-xl font-semibold transition-colors hover:opacity-80"
                  style={{ border: `1px solid ${BORDER}`, color: MUTED }}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </>
      )}

      <style>{`
        .hide-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
        
        @keyframes slide-up {
          from { transform: translateY(100%); }
          to { transform: translateY(0); }
        }
        
        .animate-slide-up {
          animation: slide-up 0.3s ease-out forwards;
        }
      `}</style>
    </div>
  );
};

export default AdminUsers;