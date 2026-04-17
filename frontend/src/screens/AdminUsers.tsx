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
  Smartphone
} from 'lucide-react';

const AdminUsers = () => {
  const navigate = useNavigate();
  const { adminInfo } = useSelector((state: any) => state.adminAuth);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const { data: usersData, isLoading } = useGetUsersQuery({
    page,
    limit: 10,
    search: searchTerm
  });

  if (!adminInfo) {
    navigate('/admin/login');
    return null;
  }

  const handleSearch = () => {
    setSearchTerm(search);
    setPage(1);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const handleClearSearch = () => {
    setSearch('');
    setSearchTerm('');
    setPage(1);
  };

  const handleViewUser = (user: any) => {
    setSelectedUser(user);
    setIsDrawerOpen(true);
  };

  const closeDrawer = () => {
    setIsDrawerOpen(false);
    setTimeout(() => setSelectedUser(null), 300);
  };

  const getAuthMethodBadge = (method: string) => {
    if (method === 'google') {
      return <span className="bg-blue-100 text-blue-700 px-2 py-0.5 rounded-lg text-xs font-medium">Google</span>;
    }
    return <span className="bg-gray-100 text-gray-700 px-2 py-0.5 rounded-lg text-xs font-medium">Email</span>;
  };

  const getInitials = (name: string) => {
    if (!name) return 'U';
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminSidebar />
      
      <div className="lg:ml-72">
        {/* Header */}
        <div className="bg-white border-b border-gray-100 sticky top-0 z-30">
          <div className="px-6 lg:px-8 py-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-[#f4a825]/10 flex items-center justify-center">
                <Users className="w-6 h-6 text-[#f4a825]" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Manage Users</h1>
                <p className="text-gray-500 text-sm mt-1">
                  View and manage all registered users on the platform
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="px-6 lg:px-8 py-6">
          {/* Stats Cards - Horizontal Scroll */}
          <div className="flex gap-4 overflow-x-auto pb-4 mb-6 hide-scrollbar">
            <div className="flex-shrink-0 w-40 bg-white rounded-2xl border border-gray-100 p-4">
              <p className="text-gray-500 text-xs">Total Users</p>
              <p className="text-2xl font-bold text-gray-900">{usersData?.total || 0}</p>
            </div>
            <div className="flex-shrink-0 w-40 bg-white rounded-2xl border border-gray-100 p-4">
              <p className="text-gray-500 text-xs">This Page</p>
              <p className="text-2xl font-bold text-gray-900">{usersData?.users?.length || 0}</p>
            </div>
            <div className="flex-shrink-0 w-40 bg-white rounded-2xl border border-gray-100 p-4">
              <p className="text-gray-500 text-xs">Total Pages</p>
              <p className="text-2xl font-bold text-gray-900">{usersData?.pages || 0}</p>
            </div>
            <div className="flex-shrink-0 w-40 bg-white rounded-2xl border border-gray-100 p-4">
              <p className="text-gray-500 text-xs">Google Users</p>
              <p className="text-2xl font-bold text-gray-900">
                {usersData?.users?.filter((u: any) => u.authMethod === 'google').length || 0}
              </p>
            </div>
          </div>

          {/* Search Bar */}
          <div className="bg-white rounded-2xl border border-gray-100 p-4 mb-6">
            <div className="flex gap-3">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search by name, email, or username..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  onKeyPress={handleKeyPress}
                  className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:border-[#f4a825] focus:ring-2 focus:ring-[#f4a825]/20 transition-all"
                />
              </div>
              <button
                onClick={handleSearch}
                className="bg-[#f4a825] text-white px-6 py-2.5 rounded-xl font-semibold hover:bg-[#e09e1a] transition-all"
              >
                Search
              </button>
              {(searchTerm || search) && (
                <button
                  onClick={handleClearSearch}
                  className="border border-gray-200 px-4 py-2.5 rounded-xl hover:border-red-300 hover:text-red-500 transition-all"
                >
                  <X size={20} className="text-gray-500 hover:text-red-500" />
                </button>
              )}
            </div>
          </div>

          {/* Users Cards - Mobile Friendly */}
          {isLoading ? (
            <div className="text-center py-12">
              <Loader className="w-8 h-8 text-[#f4a825] animate-spin mx-auto mb-2" />
              <p className="text-gray-500 text-sm">Loading users...</p>
            </div>
          ) : usersData?.users?.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-2xl border border-gray-100">
              <Users className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500">No users found</p>
            </div>
          ) : (
            <div className="space-y-3">
              {usersData?.users?.map((user: any) => (
                <div
                  key={user._id}
                  onClick={() => handleViewUser(user)}
                  className="bg-white rounded-2xl border border-gray-100 p-4 active:bg-gray-50 transition-all cursor-pointer"
                >
                  <div className="flex items-start gap-3">
                    {/* Avatar */}
                    {user.profile ? (
                      <img src={user.profile} alt={user.name} className="w-12 h-12 rounded-full object-cover" />
                    ) : (
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#f4a825] to-[#e09e1a] flex items-center justify-center flex-shrink-0">
                        <span className="text-white font-bold text-sm">
                          {getInitials(user.name)}
                        </span>
                      </div>
                    )}
                    
                    {/* User Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="font-semibold text-gray-900 text-sm">{user.name || 'No name'}</h3>
                          <p className="text-xs text-gray-400">@{user.username || 'username'}</p>
                        </div>
                        {user.role === 'admin' && (
                          <Shield size={14} className="text-purple-500 flex-shrink-0" />
                        )}
                      </div>
                      
                      <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-2">
                        <div className="flex items-center gap-1">
                          <Mail size={12} className="text-gray-400" />
                          <span className="text-xs text-gray-500 truncate max-w-[120px]">{user.email}</span>
                        </div>
                        {user.phone && (
                          <div className="flex items-center gap-1">
                            <Phone size={12} className="text-gray-400" />
                            <span className="text-xs text-gray-500">{user.phone}</span>
                          </div>
                        )}
                        {user.location && (
                          <div className="flex items-center gap-1">
                            <MapPin size={12} className="text-gray-400" />
                            <span className="text-xs text-gray-500 truncate max-w-[100px]">{user.location}</span>
                          </div>
                        )}
                      </div>
                      
                      <div className="flex items-center justify-between mt-2">
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-gray-400 flex items-center gap-1">
                            <Calendar size={10} />
                            {new Date(user.createdAt).toLocaleDateString()}
                          </span>
                          {getAuthMethodBadge(user.authMethod)}
                        </div>
                        <Eye size={16} className="text-gray-400" />
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Pagination */}
          {usersData && usersData.pages > 1 && (
            <div className="flex justify-between items-center mt-6 pt-4">
              <p className="text-xs text-gray-500">
                Page {usersData.page} of {usersData.pages}
              </p>
              <div className="flex gap-2">
                <button
                  onClick={() => setPage(p => Math.max(1, p - 1))}
                  disabled={usersData.page === 1}
                  className="flex items-center gap-1 px-3 py-1.5 border border-gray-200 rounded-xl text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:border-[#f4a825] hover:text-[#f4a825] transition-all"
                >
                  <ChevronLeft size={14} />
                  Previous
                </button>
                <button
                  onClick={() => setPage(p => Math.min(usersData.pages, p + 1))}
                  disabled={usersData.page === usersData.pages}
                  className="flex items-center gap-1 px-3 py-1.5 border border-gray-200 rounded-xl text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:border-[#f4a825] hover:text-[#f4a825] transition-all"
                >
                  Next
                  <ChevronRight size={14} />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Bottom Drawer Modal - Slides up from bottom */}
      {isDrawerOpen && selectedUser && (
        <>
          {/* Backdrop */}
          <div 
            className="fixed inset-0 bg-black/50 z-50 transition-opacity duration-300"
            onClick={closeDrawer}
          />
          
          {/* Drawer */}
          <div className="fixed bottom-0 left-0 right-0 z-50 bg-white rounded-t-3xl shadow-2xl transform transition-transform duration-300 animate-slide-up max-h-[85vh] overflow-y-auto">
            {/* Handle Bar */}
            <div className="sticky top-0 bg-white pt-4 pb-2 px-6 border-b border-gray-100">
              <div className="flex justify-center mb-3">
                <div className="w-12 h-1 bg-gray-300 rounded-full" />
              </div>
              <div className="flex justify-between items-center">
                <h2 className="text-lg font-bold text-gray-900">User Details</h2>
                <button
                  onClick={closeDrawer}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <X size={24} />
                </button>
              </div>
            </div>

            <div className="p-6 space-y-5">
              {/* Profile Header */}
              <div className="flex items-center gap-4 pb-4 border-b border-gray-100">
                {selectedUser.profile ? (
                  <img src={selectedUser.profile} alt={selectedUser.name} className="w-16 h-16 rounded-full object-cover" />
                ) : (
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#f4a825] to-[#e09e1a] flex items-center justify-center">
                    <span className="text-white font-bold text-xl">
                      {getInitials(selectedUser.name)}
                    </span>
                  </div>
                )}
                <div>
                  <h3 className="text-lg font-bold text-gray-900">{selectedUser.name || 'No name'}</h3>
                  <p className="text-gray-500 text-sm">@{selectedUser.username || 'username'}</p>
                  {selectedUser.role === 'admin' && (
                    <span className="inline-flex items-center gap-1 mt-1 text-xs bg-purple-100 text-purple-700 px-2 py-0.5 rounded-lg">
                      <Shield size={10} />
                      Admin
                    </span>
                  )}
                </div>
              </div>

              {/* Contact Information */}
              <div>
                <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Contact Information</h4>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center">
                      <Mail size={14} className="text-blue-600" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-400">Email</p>
                      <p className="text-sm text-gray-900">{selectedUser.email}</p>
                    </div>
                  </div>
                  {selectedUser.phone && (
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-green-50 flex items-center justify-center">
                        <Phone size={14} className="text-green-600" />
                      </div>
                      <div>
                        <p className="text-xs text-gray-400">Phone</p>
                        <p className="text-sm text-gray-900">{selectedUser.phone}</p>
                      </div>
                    </div>
                  )}
                  {selectedUser.whatsappNumber && (
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-emerald-50 flex items-center justify-center">
                        <Smartphone size={14} className="text-emerald-600" />
                      </div>
                      <div>
                        <p className="text-xs text-gray-400">WhatsApp</p>
                        <p className="text-sm text-gray-900">{selectedUser.whatsappNumber}</p>
                      </div>
                    </div>
                  )}
                  {selectedUser.location && (
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-orange-50 flex items-center justify-center">
                        <MapPin size={14} className="text-orange-600" />
                      </div>
                      <div>
                        <p className="text-xs text-gray-400">Location</p>
                        <p className="text-sm text-gray-900">{selectedUser.location}</p>
                      </div>
                    </div>
                  )}
                  {selectedUser.portfolioLink && (
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-purple-50 flex items-center justify-center">
                        <LinkIcon size={14} className="text-purple-600" />
                      </div>
                      <div>
                        <p className="text-xs text-gray-400">Portfolio</p>
                        <a href={selectedUser.portfolioLink} target="_blank" rel="noopener noreferrer" className="text-sm text-[#f4a825] hover:underline">
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
                  <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3 flex items-center gap-2">
                    <Award size={14} />
                    Skills ({selectedUser.skills.length})
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedUser.skills.slice(0, 15).map((skill: string, idx: number) => (
                      <span key={idx} className="bg-gray-100 text-gray-700 px-2.5 py-1 rounded-lg text-xs">
                        {skill}
                      </span>
                    ))}
                    {selectedUser.skills.length > 15 && (
                      <span className="text-xs text-gray-400">+{selectedUser.skills.length - 15} more</span>
                    )}
                  </div>
                </div>
              )}

              {/* Interests */}
              {selectedUser.interests && selectedUser.interests.length > 0 && (
                <div>
                  <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3 flex items-center gap-2">
                    <Heart size={14} />
                    Interests ({selectedUser.interests.length})
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedUser.interests.slice(0, 15).map((interest: string, idx: number) => (
                      <span key={idx} className="bg-pink-50 text-pink-700 px-2.5 py-1 rounded-lg text-xs">
                        {interest}
                      </span>
                    ))}
                    {selectedUser.interests.length > 15 && (
                      <span className="text-xs text-gray-400">+{selectedUser.interests.length - 15} more</span>
                    )}
                  </div>
                </div>
              )}

              {/* Bio */}
              {selectedUser.bio && (
                <div>
                  <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Bio</h4>
                  <p className="text-sm text-gray-600 leading-relaxed">{selectedUser.bio}</p>
                </div>
              )}

              {/* Account Info */}
              <div>
                <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Account Information</h4>
                <div className="bg-gray-50 rounded-xl p-4 space-y-2">
                  <div className="flex justify-between">
                    <span className="text-xs text-gray-500">Joined</span>
                    <span className="text-xs text-gray-700">{new Date(selectedUser.createdAt).toLocaleDateString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-xs text-gray-500">Auth Method</span>
                    <span className="text-xs text-gray-700 capitalize">{selectedUser.authMethod || 'Email'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-xs text-gray-500">User ID</span>
                    <span className="text-xs text-gray-400 font-mono">{selectedUser._id?.slice(-8)}</span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 pt-4">
                <button className="flex-1 bg-red-500 text-white py-3 rounded-xl font-semibold hover:bg-red-600 transition-all flex items-center justify-center gap-2">
                  <UserCheck size={16} />
                  Suspend User
                </button>
                <button
                  onClick={closeDrawer}
                  className="flex-1 border border-gray-200 text-gray-700 py-3 rounded-xl font-semibold hover:border-[#f4a825] hover:text-[#f4a825] transition-all"
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
          from {
            transform: translateY(100%);
          }
          to {
            transform: translateY(0);
          }
        }
        
        .animate-slide-up {
          animation: slide-up 0.3s ease-out forwards;
        }
      `}</style>
    </div>
  );
};

export default AdminUsers;