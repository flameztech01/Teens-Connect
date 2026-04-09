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
  MoreVertical,
  Eye,
  Ban,
  CheckCircle,
  Loader,
  ChevronLeft,
  ChevronRight,
  UserCheck,
  UserX,
  Shield,
  Filter
} from 'lucide-react';

const AdminUsers = () => {
  const navigate = useNavigate();
  const { adminInfo } = useSelector((state: any) => state.adminAuth);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [selectedUser, setSelectedUser] = useState<any>(null);

  const { data: usersData, isLoading, refetch } = useGetUsersQuery({
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

  const handleViewUser = (user: any) => {
    setSelectedUser(user);
  };

  const closeModal = () => {
    setSelectedUser(null);
  };

  const getAuthMethodBadge = (method: string) => {
    if (method === 'google') {
      return <span className="bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full text-xs">Google</span>;
    }
    return <span className="bg-gray-100 text-gray-700 px-2 py-0.5 rounded-full text-xs">Email</span>;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminSidebar />
      
      <div className="lg:ml-64 p-6 lg:p-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <Users className="w-8 h-8 text-[#f4a825]" />
            <h1 className="text-3xl font-bold text-[#1d2b4f]">Manage Users</h1>
          </div>
          <p className="text-gray-600">View and manage all registered users on the platform</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-lg p-4 shadow-sm">
            <p className="text-gray-500 text-sm">Total Users</p>
            <p className="text-2xl font-bold text-[#1d2b4f]">{usersData?.total || 0}</p>
          </div>
          <div className="bg-white rounded-lg p-4 shadow-sm">
            <p className="text-gray-500 text-sm">This Page</p>
            <p className="text-2xl font-bold text-[#1d2b4f]">{usersData?.users?.length || 0}</p>
          </div>
          <div className="bg-white rounded-lg p-4 shadow-sm">
            <p className="text-gray-500 text-sm">Total Pages</p>
            <p className="text-2xl font-bold text-[#1d2b4f]">{usersData?.pages || 0}</p>
          </div>
          <div className="bg-white rounded-lg p-4 shadow-sm">
            <p className="text-gray-500 text-sm">Google Users</p>
            <p className="text-2xl font-bold text-[#1d2b4f]">
              {usersData?.users?.filter((u: any) => u.authMethod === 'google').length || 0}
            </p>
          </div>
        </div>

        {/* Search Bar */}
        <div className="bg-white rounded-xl shadow-sm p-4 mb-6">
          <div className="flex gap-3">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search by name, email, or username..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                onKeyPress={handleKeyPress}
                className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:border-[#f4a825] focus:ring-2 focus:ring-[#f4a825] focus:ring-opacity-20"
              />
            </div>
            <button
              onClick={handleSearch}
              className="bg-[#f4a825] text-white px-6 py-2.5 rounded-lg font-semibold hover:bg-[#e79a13] transition-colors"
            >
              Search
            </button>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="border border-gray-300 px-4 py-2.5 rounded-lg hover:border-[#f4a825] transition-colors"
            >
              <Filter size={20} className="text-gray-500" />
            </button>
          </div>
        </div>

        {/* Users Table */}
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">User</th>
                  <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">Contact</th>
                  <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">Location</th>
                  <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">Auth</th>
                  <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">Joined</th>
                  <th className="text-center px-6 py-4 text-sm font-semibold text-gray-600">Actions</th>
                </tr>
              </thead>
              <tbody>
                {isLoading ? (
                  <tr>
                    <td colSpan={6} className="text-center py-12">
                      <Loader className="w-8 h-8 text-[#f4a825] animate-spin mx-auto mb-2" />
                      <p className="text-gray-500">Loading users...</p>
                    </td>
                  </tr>
                ) : usersData?.users?.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="text-center py-12">
                      <Users className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                      <p className="text-gray-500">No users found</p>
                    </td>
                  </tr>
                ) : (
                  usersData?.users?.map((user: any) => (
                    <tr key={user._id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          {user.profile ? (
                            <img src={user.profile} alt={user.name} className="w-10 h-10 rounded-full object-cover" />
                          ) : (
                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#1d2b4f] to-[#0d6b57] flex items-center justify-center">
                              <span className="text-white font-bold text-sm">
                                {user.name?.charAt(0).toUpperCase() || 'U'}
                              </span>
                            </div>
                          )}
                          <div>
                            <p className="font-semibold text-gray-900">{user.name || 'No name'}</p>
                            <p className="text-xs text-gray-500">@{user.username || 'username'}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="space-y-1">
                          <div className="flex items-center gap-1 text-sm text-gray-600">
                            <Mail size={14} className="text-gray-400" />
                            <span>{user.email}</span>
                          </div>
                          {user.phone && (
                            <div className="flex items-center gap-1 text-sm text-gray-600">
                              <Phone size={14} className="text-gray-400" />
                              <span>{user.phone}</span>
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-1 text-sm text-gray-600">
                          <MapPin size={14} className="text-gray-400" />
                          <span>{user.location || 'Not specified'}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        {getAuthMethodBadge(user.authMethod)}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-1 text-sm text-gray-600">
                          <Calendar size={14} className="text-gray-400" />
                          <span>{new Date(user.createdAt).toLocaleDateString()}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <button
                          onClick={() => handleViewUser(user)}
                          className="text-gray-500 hover:text-[#f4a825] transition-colors"
                          title="View Details"
                        >
                          <Eye size={18} />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {usersData && usersData.pages > 1 && (
            <div className="flex justify-between items-center px-6 py-4 border-t border-gray-200">
              <p className="text-sm text-gray-500">
                Page {usersData.page} of {usersData.pages}
              </p>
              <div className="flex gap-2">
                <button
                  onClick={() => setPage(p => Math.max(1, p - 1))}
                  disabled={usersData.page === 1}
                  className="flex items-center gap-1 px-3 py-1.5 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:border-[#f4a825] transition-colors"
                >
                  <ChevronLeft size={16} />
                  Previous
                </button>
                <button
                  onClick={() => setPage(p => Math.min(usersData.pages, p + 1))}
                  disabled={usersData.page === usersData.pages}
                  className="flex items-center gap-1 px-3 py-1.5 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:border-[#f4a825] transition-colors"
                >
                  Next
                  <ChevronRight size={16} />
                </button>
              </div>
            </div>
          )}
        </div>

        {/* User Details Modal */}
        {selectedUser && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-bold text-[#1d2b4f]">User Details</h2>
                  <button
                    onClick={closeModal}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center gap-4 pb-4 border-b border-gray-100">
                    {selectedUser.profile ? (
                      <img src={selectedUser.profile} alt={selectedUser.name} className="w-20 h-20 rounded-full object-cover" />
                    ) : (
                      <div className="w-20 h-20 rounded-full bg-gradient-to-br from-[#1d2b4f] to-[#0d6b57] flex items-center justify-center">
                        <span className="text-white font-bold text-2xl">
                          {selectedUser.name?.charAt(0).toUpperCase() || 'U'}
                        </span>
                      </div>
                    )}
                    <div>
                      <h3 className="text-lg font-bold text-gray-900">{selectedUser.name || 'No name'}</h3>
                      <p className="text-gray-500">@{selectedUser.username || 'username'}</p>
                      {selectedUser.role === 'admin' && (
                        <span className="inline-flex items-center gap-1 mt-1 text-xs bg-purple-100 text-purple-700 px-2 py-0.5 rounded-full">
                          <Shield size={12} />
                          Admin
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Email</label>
                      <p className="text-gray-900">{selectedUser.email}</p>
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Phone</label>
                      <p className="text-gray-900">{selectedUser.phone || 'Not provided'}</p>
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Location</label>
                      <p className="text-gray-900">{selectedUser.location || 'Not provided'}</p>
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Auth Method</label>
                      <p className="text-gray-900 capitalize">{selectedUser.authMethod || 'Email'}</p>
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Joined</label>
                      <p className="text-gray-900">{new Date(selectedUser.createdAt).toLocaleDateString()}</p>
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Skills</label>
                      <p className="text-gray-900">{selectedUser.skills?.length || 0} skills</p>
                    </div>
                  </div>

                  {selectedUser.bio && (
                    <div>
                      <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Bio</label>
                      <p className="text-gray-900 text-sm">{selectedUser.bio}</p>
                    </div>
                  )}

                  {selectedUser.skills && selectedUser.skills.length > 0 && (
                    <div>
                      <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Skills</label>
                      <div className="flex flex-wrap gap-2">
                        {selectedUser.skills.map((skill: string, idx: number) => (
                          <span key={idx} className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs">
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="flex gap-3 pt-4 border-t border-gray-100">
                    <button className="flex-1 bg-red-500 text-white py-2 rounded-lg font-semibold hover:bg-red-600 transition-colors flex items-center justify-center gap-2">
                      <Ban size={16} />
                      Suspend User
                    </button>
                    <button className="flex-1 border border-gray-300 text-gray-700 py-2 rounded-lg font-semibold hover:border-[#f4a825] hover:text-[#f4a825] transition-colors">
                      Close
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminUsers;