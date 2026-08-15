import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import AdminSidebar from '../components/AdminSidebar';
import { useGetUsersQuery } from '../slices/userApiSlice';
import { useGetAllAnonymousPostsQuery, useGetUnreadCountQuery } from '../slices/anonymousApiSlice';
import { useGetHireStatsQuery } from '../slices/hireApiSlice';
import {
  Users,
  MessageCircle,
  Eye,
  TrendingUp,
  Clock,
  CheckCircle,
  Loader,
  ArrowRight,
  Activity,
  Zap,
  Award,
  MapPin,
  Calendar,
  Shield,
  ChevronDown
} from 'lucide-react';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const { userInfo } = useSelector((state) => state.auth);
  const [selectedTab, setSelectedTab] = useState('overview');
  const [greeting, setGreeting] = useState('');

  const { data: usersData, isLoading: usersLoading } = useGetUsersQuery({ page: 1, limit: 1 });
  const { data: anonymousData, isLoading: anonymousLoading } = useGetAllAnonymousPostsQuery({ page: 1, limit: 1 });
  const { data: unreadCountData, isLoading: unreadLoading } = useGetUnreadCountQuery();
  const { data: hireStats, isLoading: hireLoading } = useGetHireStatsQuery();

  useEffect(() => {
    if (!userInfo) {
      navigate('/admin/login');
      return;
    }
    if (userInfo.role !== 'admin' && userInfo.role !== 'super_admin') {
      navigate('/');
      return;
    }
    const hour = new Date().getHours();
    if (hour < 12) setGreeting('Good morning');
    else if (hour < 17) setGreeting('Good afternoon');
    else setGreeting('Good evening');
  }, [userInfo, navigate]);

  if (!userInfo || (userInfo.role !== 'admin' && userInfo.role !== 'super_admin')) {
    return null;
  }

  const stats = [
    { label: 'Total Users', value: usersData?.total || 0, icon: Users, color: '#3b82f6', change: '+12%' },
    { label: 'Anonymous Posts', value: anonymousData?.total || 0, icon: MessageCircle, color: '#8b5cf6', change: '+8%' },
    { label: 'Total Talents', value: hireStats?.totalTalents || 0, icon: TrendingUp, color: '#10b981', change: '+23%' },
    { label: 'Pending Review', value: unreadCountData?.unreadCount || 0, icon: Eye, color: '#f59e0b', change: '+5%' }
  ];

  const isLoading = usersLoading || anonymousLoading || unreadLoading || hireLoading;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <AdminSidebar />
        <div className="lg:ml-72 flex items-center justify-center min-h-screen">
          <div className="text-center">
            <Loader className="w-10 h-10 text-[#f4a825] animate-spin mx-auto mb-4" />
            <p className="text-gray-500 text-sm">Loading dashboard...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminSidebar />
      
      <div className="lg:ml-72">
        {/* Header */}
        <div className="bg-white border-b border-gray-100 sticky top-0 z-30 shadow-sm">
          <div className="px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
            <div className="flex items-center gap-3 sm:gap-4">
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-[#f4a825]/10 flex items-center justify-center flex-shrink-0">
                <Shield className="w-5 h-5 sm:w-6 sm:h-6 text-[#f4a825]" />
              </div>
              <div>
                <h1 className="text-lg sm:text-2xl font-bold text-gray-900">
                  {greeting}, <span className="text-[#f4a825]">{userInfo?.name?.split(' ')[0] || 'Admin'}</span>
                </h1>
                <p className="text-xs sm:text-sm text-gray-500 mt-0.5">
                  Here's what's happening with your platform today
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
          {/* Stats - Mobile friendly grid */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6">
            {stats.map((stat, idx) => {
              const Icon = stat.icon;
              return (
                <div key={idx} className="bg-white rounded-2xl border border-gray-100 p-4 shadow-sm hover:shadow-md transition-shadow">
                  <div className="flex items-center justify-between mb-2">
                    <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-gray-50 flex items-center justify-center">
                      <Icon size={16} sm:size={20} style={{ color: stat.color }} />
                    </div>
                    <span className="text-[10px] sm:text-xs font-semibold text-green-600 bg-green-50 px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-full">
                      {stat.change}
                    </span>
                  </div>
                  <h3 className="text-xl sm:text-2xl font-bold text-gray-900">{stat.value.toLocaleString()}</h3>
                  <p className="text-xs sm:text-sm text-gray-500 mt-0.5">{stat.label}</p>
                </div>
              );
            })}
          </div>

          {/* Tab Navigation - Scrollable on mobile */}
          <div className="flex gap-4 sm:gap-6 border-b border-gray-200 mb-6 overflow-x-auto hide-scrollbar">
            {['overview', 'posts', 'talents'].map((tab) => (
              <button
                key={tab}
                onClick={() => setSelectedTab(tab)}
                className={`pb-2.5 sm:pb-3 text-xs sm:text-sm font-medium transition-colors capitalize whitespace-nowrap ${
                  selectedTab === tab 
                    ? 'text-[#f4a825] border-b-2 border-[#f4a825]' 
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Overview Tab */}
          {selectedTab === 'overview' && (
            <div className="space-y-4 sm:space-y-6">
              {/* Featured Card */}
              <div className="relative overflow-hidden bg-gradient-to-r from-[#1a2538] to-[#1d2b4f] rounded-2xl p-5 sm:p-6 text-white">
                <div className="absolute top-0 right-0 w-32 sm:w-40 h-32 sm:h-40 bg-[#f4a825]/10 rounded-full blur-2xl" />
                <div className="relative">
                  <div className="flex items-center gap-2 mb-2 sm:mb-3">
                    <Zap size={16} sm:size={20} className="text-[#f4a825]" />
                    <span className="text-[10px] sm:text-xs font-semibold uppercase tracking-wide">Admin Overview</span>
                  </div>
                  <h2 className="text-lg sm:text-xl font-bold mb-1 sm:mb-2">Platform at a glance</h2>
                  <p className="text-gray-300 text-xs sm:text-sm mb-3 sm:mb-4">Monitor user activity, posts, and talent growth</p>
                  <div className="grid grid-cols-3 gap-2 sm:gap-4 text-sm">
                    <div>
                      <p className="text-xl sm:text-2xl font-bold">{usersData?.total || 0}</p>
                      <p className="text-gray-400 text-[10px] sm:text-xs">Total Users</p>
                    </div>
                    <div>
                      <p className="text-xl sm:text-2xl font-bold">{anonymousData?.total || 0}</p>
                      <p className="text-gray-400 text-[10px] sm:text-xs">Total Posts</p>
                    </div>
                    <div>
                      <p className="text-xl sm:text-2xl font-bold">{hireStats?.totalTalents || 0}</p>
                      <p className="text-gray-400 text-[10px] sm:text-xs">Talents</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Two columns on desktop, stacked on mobile */}
              <div className="grid lg:grid-cols-3 gap-4 sm:gap-6">
                <div className="lg:col-span-2 space-y-4 sm:space-y-6">
                  {/* Recent Activity */}
                  <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm">
                    <div className="px-4 sm:px-6 py-3 sm:py-4 border-b border-gray-100">
                      <div className="flex items-center gap-2">
                        <Activity size={16} sm:size={18} className="text-[#f4a825]" />
                        <h3 className="font-semibold text-gray-900 text-sm sm:text-base">Recent Activity</h3>
                      </div>
                    </div>
                    <div className="divide-y divide-gray-100">
                      <div className="px-4 sm:px-6 py-2.5 sm:py-3 flex items-center gap-3">
                        <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                          <Users size={12} sm:size={14} className="text-blue-600" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs sm:text-sm text-gray-800 truncate">New user registered</p>
                          <p className="text-[10px] sm:text-xs text-gray-400 mt-0.5">2 hours ago</p>
                        </div>
                      </div>
                      <div className="px-4 sm:px-6 py-2.5 sm:py-3 flex items-center gap-3">
                        <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-purple-100 flex items-center justify-center flex-shrink-0">
                          <MessageCircle size={12} sm:size={14} className="text-purple-600" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs sm:text-sm text-gray-800 truncate">New anonymous post submitted</p>
                          <p className="text-[10px] sm:text-xs text-gray-400 mt-0.5">5 hours ago</p>
                        </div>
                      </div>
                      <div className="px-4 sm:px-6 py-2.5 sm:py-3 flex items-center gap-3">
                        <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-emerald-100 flex items-center justify-center flex-shrink-0">
                          <TrendingUp size={12} sm:size={14} className="text-emerald-600" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs sm:text-sm text-gray-800 truncate">New talent profile created</p>
                          <p className="text-[10px] sm:text-xs text-gray-400 mt-0.5">1 day ago</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Quick Actions */}
                <div className="space-y-4 sm:space-y-6">
                  <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm">
                    <div className="px-4 sm:px-6 py-3 sm:py-4 border-b border-gray-100">
                      <div className="flex items-center gap-2">
                        <Zap size={16} sm:size={18} className="text-[#f4a825]" />
                        <h3 className="font-semibold text-gray-900 text-sm sm:text-base">Quick Actions</h3>
                      </div>
                    </div>
                    <div className="p-3 sm:p-4 space-y-1.5 sm:space-y-2">
                      <button 
                        onClick={() => navigate('/admin/anonymous')}
                        className="w-full flex items-center justify-between p-2.5 sm:p-3 rounded-xl hover:bg-purple-50 transition-all text-left"
                      >
                        <div className="flex items-center gap-2 sm:gap-3">
                          <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-purple-100 flex items-center justify-center">
                            <MessageCircle size={12} sm:size={14} className="text-purple-600" />
                          </div>
                          <span className="text-xs sm:text-sm font-medium text-gray-700">Review Posts</span>
                        </div>
                        {unreadCountData?.unreadCount > 0 && (
                          <span className="text-[10px] sm:text-xs bg-purple-100 text-purple-600 px-1.5 sm:px-2 py-0.5 rounded-full">
                            {unreadCountData.unreadCount}
                          </span>
                        )}
                      </button>
                      
                      <button 
                        onClick={() => navigate('/admin/users')}
                        className="w-full flex items-center gap-2 sm:gap-3 p-2.5 sm:p-3 rounded-xl hover:bg-blue-50 transition-all text-left"
                      >
                        <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-blue-100 flex items-center justify-center">
                          <Users size={12} sm:size={14} className="text-blue-600" />
                        </div>
                        <span className="text-xs sm:text-sm font-medium text-gray-700">Manage Users</span>
                      </button>
                      
                      <button 
                        onClick={() => navigate('/admin/talents')}
                        className="w-full flex items-center gap-2 sm:gap-3 p-2.5 sm:p-3 rounded-xl hover:bg-emerald-50 transition-all text-left"
                      >
                        <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-emerald-100 flex items-center justify-center">
                          <TrendingUp size={12} sm:size={14} className="text-emerald-600" />
                        </div>
                        <span className="text-xs sm:text-sm font-medium text-gray-700">View Talents</span>
                      </button>
                    </div>
                  </div>

                  {/* Top Skills */}
                  {hireStats?.topSkills && hireStats.topSkills.length > 0 && (
                    <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm">
                      <div className="px-4 sm:px-6 py-3 sm:py-4 border-b border-gray-100">
                        <div className="flex items-center gap-2">
                          <Award size={16} sm:size={18} className="text-[#f4a825]" />
                          <h3 className="font-semibold text-gray-900 text-sm sm:text-base">Top Skills</h3>
                        </div>
                      </div>
                      <div className="p-3 sm:p-4">
                        <div className="flex flex-wrap gap-1.5 sm:gap-2">
                          {hireStats.topSkills.slice(0, 5).map((skill, idx) => (
                            <span key={idx} className="px-2 sm:px-3 py-1 sm:py-1.5 bg-gray-50 text-gray-700 text-xs sm:text-sm rounded-lg">
                              {skill._id}
                              <span className="text-gray-400 ml-1">({skill.count})</span>
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Posts Tab */}
          {selectedTab === 'posts' && anonymousData?.stats && (
            <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm">
              <div className="px-4 sm:px-6 py-3 sm:py-4 border-b border-gray-100">
                <h3 className="font-semibold text-gray-900 text-sm sm:text-base">Anonymous Posts Statistics</h3>
              </div>
              <div className="divide-y divide-gray-100">
                <div className="px-4 sm:px-6 py-3 sm:py-4 flex justify-between items-center">
                  <span className="text-sm sm:text-base text-gray-600">Total Posts</span>
                  <span className="font-semibold text-gray-900">{anonymousData.stats.total}</span>
                </div>
                <div className="px-4 sm:px-6 py-3 sm:py-4 flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <CheckCircle size={16} className="text-emerald-500" />
                    <span className="text-sm sm:text-base text-gray-600">Approved & Shared</span>
                  </div>
                  <span className="font-semibold text-emerald-600">{anonymousData.stats.read}</span>
                </div>
                <div className="px-4 sm:px-6 py-3 sm:py-4 flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <Clock size={16} className="text-amber-500" />
                    <span className="text-sm sm:text-base text-gray-600">Pending Review</span>
                  </div>
                  <span className="font-semibold text-amber-600">{anonymousData.stats.unread}</span>
                </div>
                <div className="px-4 sm:px-6 py-3 sm:py-4 flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <Zap size={16} className="text-purple-500" />
                    <span className="text-sm sm:text-base text-gray-600">Shared to WhatsApp</span>
                  </div>
                  <span className="font-semibold text-purple-600">{anonymousData.stats.shared}</span>
                </div>
              </div>
            </div>
          )}

          {/* Talents Tab */}
          {selectedTab === 'talents' && (
            <div className="grid lg:grid-cols-2 gap-4 sm:gap-6">
              {/* Top Locations */}
              {hireStats?.talentsByLocation && hireStats.talentsByLocation.length > 0 && (
                <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm">
                  <div className="px-4 sm:px-6 py-3 sm:py-4 border-b border-gray-100">
                    <div className="flex items-center gap-2">
                      <MapPin size={16} sm:size={18} className="text-[#f4a825]" />
                      <h3 className="font-semibold text-gray-900 text-sm sm:text-base">Top Locations</h3>
                    </div>
                  </div>
                  <div className="p-4 sm:p-5 space-y-3">
                    {hireStats.talentsByLocation.slice(0, 5).map((location, idx) => {
                      const maxCount = hireStats.talentsByLocation[0]?.count || 1;
                      const percentage = (location.count / maxCount) * 100;
                      
                      return (
                        <div key={idx} className="space-y-1">
                          <div className="flex justify-between text-xs sm:text-sm">
                            <span className="text-gray-600 truncate">{location._id || 'Unknown'}</span>
                            <span className="text-gray-500">{location.count} talents</span>
                          </div>
                          <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
                            <div className="h-full bg-[#f4a825] rounded-full" style={{ width: `${percentage}%` }} />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Talent Stats */}
              <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm">
                <div className="px-4 sm:px-6 py-3 sm:py-4 border-b border-gray-100">
                  <div className="flex items-center gap-2">
                    <TrendingUp size={16} sm:size={18} className="text-[#f4a825]" />
                    <h3 className="font-semibold text-gray-900 text-sm sm:text-base">Talent Overview</h3>
                  </div>
                </div>
                <div className="p-4 sm:p-5 space-y-3">
                  <div className="flex justify-between items-center py-2">
                    <span className="text-sm sm:text-base text-gray-600">Total Talents</span>
                    <span className="font-semibold text-gray-900">{hireStats?.totalTalents || 0}</span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-t border-gray-100">
                    <span className="text-sm sm:text-base text-gray-600">With Portfolio</span>
                    <span className="font-semibold text-gray-900">{hireStats?.withPortfolio || 0}</span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-t border-gray-100">
                    <span className="text-sm sm:text-base text-gray-600">With CV</span>
                    <span className="font-semibold text-gray-900">{hireStats?.withCv || 0}</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      <style>{`
        .hide-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </div>
  );
};

export default AdminDashboard;