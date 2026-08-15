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

// ---- design tokens ----
const BG = '#0c0c0d';
const CARD = '#141416';
const INK = '#ffffff';
const MUTED = 'rgba(255,255,255,0.4)';
const BORDER = 'rgba(255,255,255,0.06)';
const GOLD = '#f4a825';
const GOLD_TINT = 'rgba(244,168,37,0.12)';
const GOLD_GLOW = 'rgba(244,168,37,0.25)';
const GREEN = '#22c55e';
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

const StatCard = ({ label, value, icon: Icon, color = GOLD, change }) => (
  <CardShell glow className="p-4 sm:p-5">
    <div className="flex items-center justify-between mb-2">
      <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: `${color}15` }}>
        <Icon size={16} className="sm:w-[18px] sm:h-[18px]" style={{ color }} />
      </div>
      <span className="text-[10px] sm:text-xs font-semibold px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-full" style={{ backgroundColor: 'rgba(34,197,94,0.12)', color: GREEN }}>
        {change}
      </span>
    </div>
    <h3 className="text-xl sm:text-2xl font-bold" style={{ color: INK }}>{value.toLocaleString()}</h3>
    <p className="text-xs sm:text-sm" style={{ color: MUTED }}>{label}</p>
  </CardShell>
);

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
    { label: 'Total Users', value: usersData?.total || 0, icon: Users, color: BLUE, change: '+12%' },
    { label: 'Anonymous Posts', value: anonymousData?.total || 0, icon: MessageCircle, color: PURPLE, change: '+8%' },
    { label: 'Total Talents', value: hireStats?.totalTalents || 0, icon: TrendingUp, color: GREEN, change: '+23%' },
    { label: 'Pending Review', value: unreadCountData?.unreadCount || 0, icon: Eye, color: AMBER, change: '+5%' }
  ];

  const isLoading = usersLoading || anonymousLoading || unreadLoading || hireLoading;

  if (isLoading) {
    return (
      <div className="min-h-screen" style={{ backgroundColor: BG }}>
        <AdminSidebar />
        <div className="lg:ml-72 flex items-center justify-center min-h-screen">
          <div className="text-center">
            <Loader className="w-10 h-10 animate-spin mx-auto mb-4" style={{ color: GOLD }} />
            <p className="text-sm" style={{ color: MUTED }}>Loading dashboard...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: BG }}>
      <AdminSidebar />
      
      <div className="lg:ml-72 relative">
        {/* Header – dark theme */}
        <div className="sticky top-0 z-30" style={{ backgroundColor: BG, borderBottom: `1px solid ${BORDER}` }}>
          <div className="px-4 sm:px-6 py-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 sm:w-12 sm:h-12 shrink-0 rounded-xl flex items-center justify-center" style={{ backgroundColor: GOLD_TINT }}>
                <Shield className="w-5 h-5 sm:w-6 sm:h-6" style={{ color: GOLD }} />
              </div>
              <div>
                <h1 className="text-lg sm:text-2xl font-bold leading-tight" style={{ color: INK }}>
                  {greeting}, <span style={{ color: GOLD }}>{userInfo?.name?.split(' ')[0] || 'Admin'}</span>
                </h1>
                <p className="text-xs sm:text-sm" style={{ color: MUTED }}>
                  Here's what's happening with your platform today
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="px-3 sm:px-6 py-4 sm:py-6">
          {/* Stats - Mobile friendly grid */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6">
            {stats.map((stat, idx) => (
              <StatCard
                key={idx}
                label={stat.label}
                value={stat.value}
                icon={stat.icon}
                color={stat.color}
                change={stat.change}
              />
            ))}
          </div>

          {/* Tab Navigation - Scrollable on mobile */}
          <div className="flex gap-4 sm:gap-6 border-b mb-6 overflow-x-auto hide-scrollbar" style={{ borderColor: BORDER }}>
            {['overview', 'posts', 'talents'].map((tab) => (
              <button
                key={tab}
                onClick={() => setSelectedTab(tab)}
                className={`pb-2.5 sm:pb-3 text-xs sm:text-sm font-medium transition-colors capitalize whitespace-nowrap ${
                  selectedTab === tab 
                    ? 'border-b-2' 
                    : 'hover:opacity-80'
                }`}
                style={{
                  color: selectedTab === tab ? GOLD : MUTED,
                  borderColor: selectedTab === tab ? GOLD : 'transparent',
                }}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Overview Tab */}
          {selectedTab === 'overview' && (
            <div className="space-y-4 sm:space-y-6">
              {/* Featured Card - Dark gradient */}
              <div className="relative overflow-hidden rounded-2xl p-5 sm:p-6" style={{ background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)', border: `1px solid ${BORDER}` }}>
                <div className="absolute top-0 right-0 w-32 sm:w-40 h-32 sm:h-40 bg-gold/5 rounded-full blur-2xl" style={{ backgroundColor: `${GOLD}15` }} />
                <div className="relative">
                  <div className="flex items-center gap-2 mb-2 sm:mb-3">
                    <Zap size={16} sm:size={20} style={{ color: GOLD }} />
                    <span className="text-[10px] sm:text-xs font-semibold uppercase tracking-wide" style={{ color: MUTED }}>Admin Overview</span>
                  </div>
                  <h2 className="text-lg sm:text-xl font-bold mb-1 sm:mb-2" style={{ color: INK }}>Platform at a glance</h2>
                  <p className="text-xs sm:text-sm mb-3 sm:mb-4" style={{ color: MUTED }}>Monitor user activity, posts, and talent growth</p>
                  <div className="grid grid-cols-3 gap-2 sm:gap-4 text-sm">
                    <div>
                      <p className="text-xl sm:text-2xl font-bold" style={{ color: INK }}>{usersData?.total || 0}</p>
                      <p className="text-[10px] sm:text-xs" style={{ color: MUTED }}>Total Users</p>
                    </div>
                    <div>
                      <p className="text-xl sm:text-2xl font-bold" style={{ color: INK }}>{anonymousData?.total || 0}</p>
                      <p className="text-[10px] sm:text-xs" style={{ color: MUTED }}>Total Posts</p>
                    </div>
                    <div>
                      <p className="text-xl sm:text-2xl font-bold" style={{ color: INK }}>{hireStats?.totalTalents || 0}</p>
                      <p className="text-[10px] sm:text-xs" style={{ color: MUTED }}>Talents</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Two columns on desktop, stacked on mobile */}
              <div className="grid lg:grid-cols-3 gap-4 sm:gap-6">
                <div className="lg:col-span-2 space-y-4 sm:space-y-6">
                  {/* Recent Activity */}
                  <CardShell glow>
                    <div className="border-b pb-3 mb-3" style={{ borderColor: BORDER }}>
                      <div className="flex items-center gap-2">
                        <Activity size={16} sm:size={18} style={{ color: GOLD }} />
                        <h3 className="font-semibold text-sm sm:text-base" style={{ color: INK }}>Recent Activity</h3>
                      </div>
                    </div>
                    <div className="divide-y" style={{ borderColor: BORDER }}>
                      <div className="py-2.5 sm:py-3 flex items-center gap-3">
                        <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center flex-shrink-0" style={{ backgroundColor: 'rgba(59,130,246,0.12)' }}>
                          <Users size={12} sm:size={14} style={{ color: BLUE }} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs sm:text-sm truncate" style={{ color: INK }}>New user registered</p>
                          <p className="text-[10px] sm:text-xs" style={{ color: MUTED }}>2 hours ago</p>
                        </div>
                      </div>
                      <div className="py-2.5 sm:py-3 flex items-center gap-3">
                        <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center flex-shrink-0" style={{ backgroundColor: 'rgba(139,92,246,0.12)' }}>
                          <MessageCircle size={12} sm:size={14} style={{ color: PURPLE }} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs sm:text-sm truncate" style={{ color: INK }}>New anonymous post submitted</p>
                          <p className="text-[10px] sm:text-xs" style={{ color: MUTED }}>5 hours ago</p>
                        </div>
                      </div>
                      <div className="py-2.5 sm:py-3 flex items-center gap-3">
                        <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center flex-shrink-0" style={{ backgroundColor: 'rgba(34,197,94,0.12)' }}>
                          <TrendingUp size={12} sm:size={14} style={{ color: GREEN }} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs sm:text-sm truncate" style={{ color: INK }}>New talent profile created</p>
                          <p className="text-[10px] sm:text-xs" style={{ color: MUTED }}>1 day ago</p>
                        </div>
                      </div>
                    </div>
                  </CardShell>
                </div>

                {/* Quick Actions */}
                <div className="space-y-4 sm:space-y-6">
                  <CardShell glow>
                    <div className="border-b pb-3 mb-3" style={{ borderColor: BORDER }}>
                      <div className="flex items-center gap-2">
                        <Zap size={16} sm:size={18} style={{ color: GOLD }} />
                        <h3 className="font-semibold text-sm sm:text-base" style={{ color: INK }}>Quick Actions</h3>
                      </div>
                    </div>
                    <div className="space-y-1.5 sm:space-y-2">
                      <button 
                        onClick={() => navigate('/admin/anonymous')}
                        className="w-full flex items-center justify-between p-2.5 sm:p-3 rounded-xl transition-all text-left hover:bg-white/5"
                      >
                        <div className="flex items-center gap-2 sm:gap-3">
                          <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: 'rgba(139,92,246,0.12)' }}>
                            <MessageCircle size={12} sm:size={14} style={{ color: PURPLE }} />
                          </div>
                          <span className="text-xs sm:text-sm font-medium" style={{ color: MUTED }}>Review Posts</span>
                        </div>
                        {unreadCountData?.unreadCount > 0 && (
                          <span className="text-[10px] sm:text-xs px-1.5 sm:px-2 py-0.5 rounded-full" style={{ backgroundColor: 'rgba(139,92,246,0.12)', color: PURPLE }}>
                            {unreadCountData.unreadCount}
                          </span>
                        )}
                      </button>
                      
                      <button 
                        onClick={() => navigate('/admin/users')}
                        className="w-full flex items-center gap-2 sm:gap-3 p-2.5 sm:p-3 rounded-xl transition-all text-left hover:bg-white/5"
                      >
                        <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: 'rgba(59,130,246,0.12)' }}>
                          <Users size={12} sm:size={14} style={{ color: BLUE }} />
                        </div>
                        <span className="text-xs sm:text-sm font-medium" style={{ color: MUTED }}>Manage Users</span>
                      </button>
                      
                      <button 
                        onClick={() => navigate('/admin/talents')}
                        className="w-full flex items-center gap-2 sm:gap-3 p-2.5 sm:p-3 rounded-xl transition-all text-left hover:bg-white/5"
                      >
                        <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: 'rgba(34,197,94,0.12)' }}>
                          <TrendingUp size={12} sm:size={14} style={{ color: GREEN }} />
                        </div>
                        <span className="text-xs sm:text-sm font-medium" style={{ color: MUTED }}>View Talents</span>
                      </button>
                    </div>
                  </CardShell>

                  {/* Top Skills */}
                  {hireStats?.topSkills && hireStats.topSkills.length > 0 && (
                    <CardShell glow>
                      <div className="border-b pb-3 mb-3" style={{ borderColor: BORDER }}>
                        <div className="flex items-center gap-2">
                          <Award size={16} sm:size={18} style={{ color: GOLD }} />
                          <h3 className="font-semibold text-sm sm:text-base" style={{ color: INK }}>Top Skills</h3>
                        </div>
                      </div>
                      <div className="flex flex-wrap gap-1.5 sm:gap-2">
                        {hireStats.topSkills.slice(0, 5).map((skill, idx) => (
                          <span key={idx} className="px-2 sm:px-3 py-1 sm:py-1.5 rounded-lg text-xs sm:text-sm" style={{ backgroundColor: 'rgba(255,255,255,0.04)', color: MUTED }}>
                            {skill._id}
                            <span className="ml-1" style={{ color: MUTED }}>({skill.count})</span>
                          </span>
                        ))}
                      </div>
                    </CardShell>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Posts Tab */}
          {selectedTab === 'posts' && anonymousData?.stats && (
            <CardShell glow>
              <div className="border-b pb-3 mb-4" style={{ borderColor: BORDER }}>
                <h3 className="font-semibold text-sm sm:text-base" style={{ color: INK }}>Anonymous Posts Statistics</h3>
              </div>
              <div className="divide-y" style={{ borderColor: BORDER }}>
                <div className="py-3 sm:py-4 flex justify-between items-center">
                  <span className="text-sm sm:text-base" style={{ color: MUTED }}>Total Posts</span>
                  <span className="font-semibold" style={{ color: INK }}>{anonymousData.stats.total}</span>
                </div>
                <div className="py-3 sm:py-4 flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <CheckCircle size={16} style={{ color: GREEN }} />
                    <span className="text-sm sm:text-base" style={{ color: MUTED }}>Approved & Shared</span>
                  </div>
                  <span className="font-semibold" style={{ color: GREEN }}>{anonymousData.stats.read}</span>
                </div>
                <div className="py-3 sm:py-4 flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <Clock size={16} style={{ color: AMBER }} />
                    <span className="text-sm sm:text-base" style={{ color: MUTED }}>Pending Review</span>
                  </div>
                  <span className="font-semibold" style={{ color: AMBER }}>{anonymousData.stats.unread}</span>
                </div>
                <div className="py-3 sm:py-4 flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <Zap size={16} style={{ color: PURPLE }} />
                    <span className="text-sm sm:text-base" style={{ color: MUTED }}>Shared to WhatsApp</span>
                  </div>
                  <span className="font-semibold" style={{ color: PURPLE }}>{anonymousData.stats.shared}</span>
                </div>
              </div>
            </CardShell>
          )}

          {/* Talents Tab */}
          {selectedTab === 'talents' && (
            <div className="grid lg:grid-cols-2 gap-4 sm:gap-6">
              {/* Top Locations */}
              {hireStats?.talentsByLocation && hireStats.talentsByLocation.length > 0 && (
                <CardShell glow>
                  <div className="border-b pb-3 mb-4" style={{ borderColor: BORDER }}>
                    <div className="flex items-center gap-2">
                      <MapPin size={16} sm:size={18} style={{ color: GOLD }} />
                      <h3 className="font-semibold text-sm sm:text-base" style={{ color: INK }}>Top Locations</h3>
                    </div>
                  </div>
                  <div className="space-y-3">
                    {hireStats.talentsByLocation.slice(0, 5).map((location, idx) => {
                      const maxCount = hireStats.talentsByLocation[0]?.count || 1;
                      const percentage = (location.count / maxCount) * 100;
                      
                      return (
                        <div key={idx} className="space-y-1">
                          <div className="flex justify-between text-xs sm:text-sm">
                            <span className="truncate" style={{ color: MUTED }}>{location._id || 'Unknown'}</span>
                            <span style={{ color: MUTED }}>{location.count} talents</span>
                          </div>
                          <div className="w-full h-1.5 rounded-full overflow-hidden" style={{ backgroundColor: 'rgba(255,255,255,0.06)' }}>
                            <div className="h-full rounded-full" style={{ width: `${percentage}%`, backgroundColor: GOLD }} />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </CardShell>
              )}

              {/* Talent Stats */}
              <CardShell glow>
                <div className="border-b pb-3 mb-4" style={{ borderColor: BORDER }}>
                  <div className="flex items-center gap-2">
                    <TrendingUp size={16} sm:size={18} style={{ color: GOLD }} />
                    <h3 className="font-semibold text-sm sm:text-base" style={{ color: INK }}>Talent Overview</h3>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="flex justify-between items-center py-2">
                    <span className="text-sm sm:text-base" style={{ color: MUTED }}>Total Talents</span>
                    <span className="font-semibold" style={{ color: INK }}>{hireStats?.totalTalents || 0}</span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-t" style={{ borderColor: BORDER }}>
                    <span className="text-sm sm:text-base" style={{ color: MUTED }}>With Portfolio</span>
                    <span className="font-semibold" style={{ color: INK }}>{hireStats?.withPortfolio || 0}</span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-t" style={{ borderColor: BORDER }}>
                    <span className="text-sm sm:text-base" style={{ color: MUTED }}>With CV</span>
                    <span className="font-semibold" style={{ color: INK }}>{hireStats?.withCv || 0}</span>
                  </div>
                </div>
              </CardShell>
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