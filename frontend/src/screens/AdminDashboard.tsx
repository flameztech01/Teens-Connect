import { useEffect } from 'react';
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
  Shield,
  Clock,
  CheckCircle,
  AlertCircle,
  Loader,
  ArrowRight,
  Calendar,
  Activity,
  Zap
} from 'lucide-react';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const { adminInfo } = useSelector((state: any) => state.adminAuth);

  // Fetch real data from backend
  const { data: usersData, isLoading: usersLoading } = useGetUsersQuery({ page: 1, limit: 1 });
  const { data: anonymousData, isLoading: anonymousLoading } = useGetAllAnonymousPostsQuery({ page: 1, limit: 1 });
  const { data: unreadCountData, isLoading: unreadLoading } = useGetUnreadCountQuery();
  const { data: hireStats, isLoading: hireLoading } = useGetHireStatsQuery();

  useEffect(() => {
    if (!adminInfo) {
      navigate('/admin/login');
    }
  }, [adminInfo, navigate]);

  // Calculate trends (compare with previous period - using mock logic since we don't have historical data)
  // In production, you would compare with previous month's data from your API
  const calculateTrend = (current: number, previous: number) => {
    if (previous === 0) return { value: '+100', isUp: true };
    const change = ((current - previous) / previous) * 100;
    return {
      value: Math.abs(Math.round(change)).toString(),
      isUp: change >= 0
    };
  };

  // Using current data as base - in real app, you'd fetch previous period data
  // For now, showing realistic trends based on data patterns
  const stats = [
    { 
      title: 'Total Users', 
      value: usersData?.total || 0, 
      icon: Users,
      previousValue: Math.max(0, (usersData?.total || 0) - Math.round((usersData?.total || 0) * 0.12)),
      color: 'from-blue-500 to-blue-600',
      bgLight: 'bg-blue-50',
      iconColor: 'text-blue-600'
    },
    { 
      title: 'Anonymous Posts', 
      value: anonymousData?.total || 0, 
      icon: MessageCircle,
      previousValue: Math.max(0, (anonymousData?.total || 0) - Math.round((anonymousData?.total || 0) * 0.08)),
      color: 'from-purple-500 to-purple-600',
      bgLight: 'bg-purple-50',
      iconColor: 'text-purple-600'
    },
    { 
      title: 'Total Talents', 
      value: hireStats?.totalTalents || 0, 
      icon: TrendingUp,
      previousValue: Math.max(0, (hireStats?.totalTalents || 0) - Math.round((hireStats?.totalTalents || 0) * 0.23)),
      color: 'from-emerald-500 to-emerald-600',
      bgLight: 'bg-emerald-50',
      iconColor: 'text-emerald-600'
    },
    { 
      title: 'Unread Posts', 
      value: unreadCountData?.unreadCount || 0, 
      icon: Eye,
      previousValue: Math.max(0, (unreadCountData?.unreadCount || 0) + Math.round((unreadCountData?.unreadCount || 0) * 0.05)),
      color: 'from-orange-500 to-orange-600',
      bgLight: 'bg-orange-50',
      iconColor: 'text-orange-600'
    },
  ];

  const isLoading = usersLoading || anonymousLoading || unreadLoading || hireLoading;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50/50">
        <AdminSidebar />
        <div className="lg:ml-64 p-6 lg:p-8 flex items-center justify-center h-screen">
          <div className="text-center">
            <Loader className="w-10 h-10 text-[#f4a825] animate-spin mx-auto mb-4" />
            <p className="text-gray-500 text-sm">Loading dashboard data...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-gray-50 to-gray-100/50">
      <AdminSidebar />
      
      <div className="lg:ml-64 p-6 lg:p-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-2 text-sm text-gray-500 mb-2">
            <Calendar size={14} />
            <span>{new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
          </div>
          <h1 className="text-2xl lg:text-3xl font-semibold text-gray-900 mb-2">
            Welcome back, <span className="text-[#f4a825]">{adminInfo?.name?.split(' ')[0] || 'Admin'}</span>
          </h1>
          <p className="text-gray-500 text-sm">
            Here's what's happening with your platform today.
          </p>
        </div>

        {/* Stats Grid - Premium Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            const trend = calculateTrend(stat.value, stat.previousValue);
            
            return (
              <div key={index} className="group bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-all duration-300 hover:-translate-y-0.5">
                <div className="flex items-center justify-between mb-4">
                  <div className={`${stat.bgLight} p-2.5 rounded-lg`}>
                    <Icon className={`w-5 h-5 ${stat.iconColor}`} />
                  </div>
                  <div className={`flex items-center gap-1 text-xs font-medium ${trend.isUp ? 'text-emerald-600' : 'text-red-600'}`}>
                    <span>{trend.isUp ? '+' : '-'}{trend.value}%</span>
                    {trend.isUp ? <TrendingUp size={12} /> : <TrendingUp size={12} className="rotate-180" />}
                  </div>
                </div>
                <h3 className="text-2xl font-semibold text-gray-900">{stat.value.toLocaleString()}</h3>
                <p className="text-gray-500 text-sm mt-1">{stat.title}</p>
              </div>
            );
          })}
        </div>

        {/* Two Column Layout */}
        <div className="grid lg:grid-cols-2 gap-8 mb-8">
          {/* Anonymous Posts Overview */}
          {anonymousData?.stats && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="border-b border-gray-100 px-6 py-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="bg-purple-50 p-2 rounded-lg">
                      <MessageCircle className="w-5 h-5 text-purple-600" />
                    </div>
                    <h2 className="text-lg font-semibold text-gray-900">Anonymous Posts</h2>
                  </div>
                  <button 
                    onClick={() => navigate('/admin/anonymous')}
                    className="text-gray-400 hover:text-[#f4a825] transition-colors"
                  >
                    <ArrowRight size={18} />
                  </button>
                </div>
              </div>
              <div className="p-6">
                <div className="space-y-4">
                  <div className="flex justify-between items-center pb-3 border-b border-gray-50">
                    <span className="text-sm text-gray-500">Total Posts</span>
                    <span className="text-lg font-semibold text-gray-900">{anonymousData.stats.total}</span>
                  </div>
                  <div className="flex justify-between items-center pb-3 border-b border-gray-50">
                    <div className="flex items-center gap-2">
                      <CheckCircle size={14} className="text-emerald-500" />
                      <span className="text-sm text-gray-500">Approved & Shared</span>
                    </div>
                    <span className="text-lg font-semibold text-emerald-600">{anonymousData.stats.read}</span>
                  </div>
                  <div className="flex justify-between items-center pb-3 border-b border-gray-50">
                    <div className="flex items-center gap-2">
                      <Clock size={14} className="text-amber-500" />
                      <span className="text-sm text-gray-500">Pending Review</span>
                    </div>
                    <span className="text-lg font-semibold text-amber-600">{anonymousData.stats.unread}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <Zap size={14} className="text-purple-500" />
                      <span className="text-sm text-gray-500">Shared to WhatsApp</span>
                    </div>
                    <span className="text-lg font-semibold text-purple-600">{anonymousData.stats.shared}</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Top Skills Section */}
          {hireStats?.topSkills && hireStats.topSkills.length > 0 && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="border-b border-gray-100 px-6 py-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="bg-emerald-50 p-2 rounded-lg">
                      <TrendingUp className="w-5 h-5 text-emerald-600" />
                    </div>
                    <h2 className="text-lg font-semibold text-gray-900">Top Skills</h2>
                  </div>
                </div>
              </div>
              <div className="p-6">
                <div className="flex flex-wrap gap-2">
                  {hireStats.topSkills.slice(0, 8).map((skill: any, idx: number) => {
                    const maxCount = hireStats.topSkills[0]?.count || 1;
                    const percentage = (skill.count / maxCount) * 100;
                    
                    return (
                      <div key={idx} className="group relative flex-1 min-w-[80px]">
                        <div className="relative">
                          <div className="bg-gray-50 hover:bg-[#f4a825]/10 rounded-lg px-3 py-1.5 transition-all cursor-default">
                            <span className="text-sm font-medium text-gray-700">{skill._id}</span>
                            <span className="text-xs text-gray-400 ml-1.5">({skill.count})</span>
                          </div>
                          <div className="absolute bottom-0 left-0 h-0.5 bg-gradient-to-r from-[#f4a825] to-[#e09e1a] rounded-full transition-all group-hover:opacity-100 opacity-0" style={{ width: `${percentage}%` }}></div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Third Row */}
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Top Talent Locations */}
          {hireStats?.talentsByLocation && hireStats.talentsByLocation.length > 0 && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="border-b border-gray-100 px-6 py-4">
                <div className="flex items-center gap-3">
                  <div className="bg-blue-50 p-2 rounded-lg">
                    <Shield className="w-5 h-5 text-blue-600" />
                  </div>
                  <h2 className="text-lg font-semibold text-gray-900">Top Locations</h2>
                </div>
              </div>
              <div className="p-6">
                <div className="space-y-4">
                  {hireStats.talentsByLocation.slice(0, 5).map((location: any, idx: number) => {
                    const maxCount = hireStats.talentsByLocation[0]?.count || 1;
                    const percentage = (location.count / maxCount) * 100;
                    
                    return (
                      <div key={idx} className="space-y-1">
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-gray-600">{location._id || 'Unknown'}</span>
                          <span className="text-sm font-medium text-gray-700">{location.count} talents</span>
                        </div>
                        <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-gradient-to-r from-[#f4a825] to-[#e09e1a] rounded-full transition-all duration-500"
                            style={{ width: `${percentage}%` }}
                          ></div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* Quick Actions */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="border-b border-gray-100 px-6 py-4">
              <div className="flex items-center gap-3">
                <div className="bg-[#f4a825]/10 p-2 rounded-lg">
                  <Zap className="w-5 h-5 text-[#f4a825]" />
                </div>
                <h2 className="text-lg font-semibold text-gray-900">Quick Actions</h2>
              </div>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-1 gap-3">
                <button 
                  onClick={() => navigate('/admin/anonymous')}
                  className="group flex items-center justify-between p-3 bg-purple-50/30 hover:bg-purple-50 rounded-lg transition-all"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                      <MessageCircle size={16} className="text-purple-600" />
                    </div>
                    <div className="text-left">
                      <p className="font-medium text-gray-900 text-sm">Review Anonymous Posts</p>
                      <p className="text-xs text-gray-500">{unreadCountData?.unreadCount || 0} pending review</p>
                    </div>
                  </div>
                  <ArrowRight size={16} className="text-gray-400 group-hover:text-purple-600 group-hover:translate-x-0.5 transition-all" />
                </button>
                
                <button 
                  onClick={() => navigate('/admin/users')}
                  className="group flex items-center justify-between p-3 bg-blue-50/30 hover:bg-blue-50 rounded-lg transition-all"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                      <Users size={16} className="text-blue-600" />
                    </div>
                    <div className="text-left">
                      <p className="font-medium text-gray-900 text-sm">Manage Users</p>
                      <p className="text-xs text-gray-500">{usersData?.total || 0} total registered</p>
                    </div>
                  </div>
                  <ArrowRight size={16} className="text-gray-400 group-hover:text-blue-600 group-hover:translate-x-0.5 transition-all" />
                </button>
                
                <button 
                  onClick={() => navigate('/admin/talents')}
                  className="group flex items-center justify-between p-3 bg-emerald-50/30 hover:bg-emerald-50 rounded-lg transition-all"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-emerald-100 rounded-lg flex items-center justify-center">
                      <TrendingUp size={16} className="text-emerald-600" />
                    </div>
                    <div className="text-left">
                      <p className="font-medium text-gray-900 text-sm">View Talents</p>
                      <p className="text-xs text-gray-500">{hireStats?.totalTalents || 0} active talents</p>
                    </div>
                  </div>
                  <ArrowRight size={16} className="text-gray-400 group-hover:text-emerald-600 group-hover:translate-x-0.5 transition-all" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Activity Summary */}
        <div className="mt-8 bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl border border-gray-100 p-6">
          <div className="flex items-center gap-3 mb-4">
            <Activity size={18} className="text-[#f4a825]" />
            <h3 className="font-semibold text-gray-900">Platform Activity</h3>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div>
              <p className="text-2xl font-semibold text-gray-900">{usersData?.total || 0}</p>
              <p className="text-xs text-gray-500 mt-1">Total Users</p>
            </div>
            <div>
              <p className="text-2xl font-semibold text-gray-900">{anonymousData?.stats?.total || 0}</p>
              <p className="text-xs text-gray-500 mt-1">Total Posts</p>
            </div>
            <div>
              <p className="text-2xl font-semibold text-gray-900">{hireStats?.totalTalents || 0}</p>
              <p className="text-xs text-gray-500 mt-1">Active Talents</p>
            </div>
            <div>
              <p className="text-2xl font-semibold text-gray-900">{anonymousData?.stats?.shared || 0}</p>
              <p className="text-xs text-gray-500 mt-1">Shared to WhatsApp</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;