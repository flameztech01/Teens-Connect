import { useState, useEffect, useMemo } from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import DashboardSidebar from '../components/DashbordSidebar';
import { useGetMyAnonymousPostsQuery } from '../slices/anonymousApiSlice';
import { useGetProfileQuery } from '../slices/userApiSlice';
import { useGetUserNotificationsQuery, useGetUserUnreadCountQuery, useMarkAllUserNotificationsAsReadMutation } from '../slices/notificationApiSlice';
import { useGetTalentsQuery } from '../slices/hireApiSlice';
import { useGetUsersQuery } from '../slices/userApiSlice';
import {
  Lock,
  MessageCircle,
  Bell,
  Users,
  User,
  Camera,
  Send,
  TrendingUp,
  Smartphone,
  Activity,
  ArrowUpRight,
  ArrowDownRight,
  Plus,
} from 'lucide-react';

// ---- design tokens ----
const BG = '#f6f3ec';
const CARD = '#ffffff';
const INK = '#171717';
const MUTED = '#8c8577';
const BORDER = '#ece7da';
const GOLD = '#f4a825';
const GOLD_DEEP = '#c9860f';
const GOLD_TINT = '#fff3de';
const GREEN = '#22c55e';
const RED = '#ef4444';
const HERO = '#14140f';

const CardShell = ({ children, className = '' }) => (
  <div
    className={`rounded-3xl p-5 sm:p-6 transition-all duration-200 ${className}`}
    style={{ backgroundColor: CARD, border: `1px solid ${BORDER}`, boxShadow: '0 1px 2px rgba(23,23,23,0.03), 0 12px 24px -12px rgba(23,23,23,0.06)' }}
  >
    {children}
  </div>
);

const TrendTag = ({ trend, change }) => (
  <span className="inline-flex items-center gap-0.5 text-xs font-semibold" style={{ color: trend === 'up' ? GREEN : RED }}>
    {change}
    {trend === 'up' ? <ArrowUpRight size={13} /> : <ArrowDownRight size={13} />}
  </span>
);

const Dashboard = () => {
  const { userInfo } = useSelector((state) => state.auth);
  const [greeting, setGreeting] = useState('');
  const [selectedTab, setSelectedTab] = useState('dashboard');

  // ---- API queries ----
  const { data: userData } = useGetProfileQuery({});
  const { data: notificationsData, isLoading: notificationsLoading } = useGetUserNotificationsQuery({ page: 1, limit: 10 });
  const { data: unreadData } = useGetUserUnreadCountQuery({});
  const { data: anonymousPostsData, isLoading: postsLoading } = useGetMyAnonymousPostsQuery({});
  const { data: talentsData } = useGetTalentsQuery({ page: 1, limit: 6 });
  const [markAllAsRead] = useMarkAllUserNotificationsAsReadMutation();

  // ---- Fetch all users (with a high limit) ----
  const { data: usersData, isLoading: usersLoading } = useGetUsersQuery({ page: 1, limit: 1000 });
  const users = usersData?.users || [];
  const totalMembers = usersData?.total || 0;

  // ---- Compute real stats from the user list ----
  const computedStats = useMemo(() => {
    if (!users.length) {
      return {
        totalMembers: 0,
        whatsappMembers: 0,
        genderCounts: { Male: 0, Female: 0, Other: 0, 'prefer-not-to-say': 0 },
        growthPercent: 0,
        weeklyActivity: [0, 0, 0, 0, 0, 0, 0],
        dayLabels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
      };
    }

    // ---- Gender counts ----
    const genderCounts = { Male: 0, Female: 0, Other: 0, 'prefer-not-to-say': 0 };
    users.forEach((u) => {
      const g = u.gender || 'prefer-not-to-say';
      if (genderCounts[g] !== undefined) genderCounts[g]++;
      else genderCounts.Other++;
    });

    // ---- WhatsApp members (users with a whatsappNumber or whatsappLink) ----
    const whatsappMembers = users.filter((u) => u.whatsappNumber || u.whatsappLink).length;

    // ---- Growth percentage (new users in last 30 days vs previous 30 days) ----
    const now = new Date();
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    const sixtyDaysAgo = new Date(now.getTime() - 60 * 24 * 60 * 60 * 1000);

    const newUsersLast30 = users.filter((u) => new Date(u.createdAt) >= thirtyDaysAgo).length;
    const newUsersPrev30 = users.filter((u) => {
      const created = new Date(u.createdAt);
      return created >= sixtyDaysAgo && created < thirtyDaysAgo;
    }).length;

    let growthPercent = 0;
    if (newUsersPrev30 > 0) {
      growthPercent = ((newUsersLast30 - newUsersPrev30) / newUsersPrev30) * 100;
    } else if (newUsersLast30 > 0) {
      growthPercent = 100; // if no previous, but now some, treat as 100% growth
    }

    // ---- Weekly activity: sign-ups per day for the last 7 days ----
    const dayLabels = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    const weeklyActivity = new Array(7).fill(0);
    const today = new Date();
    // Get the start of the week (Monday)
    const dayOfWeek = today.getDay(); // 0=Sun, 1=Mon, ...
    const startOfWeek = new Date(today);
    startOfWeek.setDate(today.getDate() - dayOfWeek + (dayOfWeek === 0 ? -6 : 1)); // adjust to Monday
    startOfWeek.setHours(0, 0, 0, 0);

    users.forEach((u) => {
      const created = new Date(u.createdAt);
      if (created >= startOfWeek) {
        const diffDays = Math.floor((created - startOfWeek) / (24 * 60 * 60 * 1000));
        if (diffDays >= 0 && diffDays < 7) {
          weeklyActivity[diffDays]++;
        }
      }
    });

    // Reorder to start from Monday (already)
    // But dayLabels array is ["Mon","Tue","Wed","Thu","Fri","Sat","Sun"] which matches diffDays 0..6

    return {
      totalMembers,
      whatsappMembers,
      genderCounts,
      growthPercent,
      weeklyActivity,
      dayLabels,
    };
  }, [users, totalMembers]);

  // ---- Format date (same as before) ----
  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m`;
    if (diffHours < 24) return `${diffHours}h`;
    if (diffDays < 7) return `${diffDays}d`;
    return date.toLocaleDateString();
  };

  const handleMarkAllRead = async () => {
    try {
      await markAllAsRead().unwrap();
    } catch (error) {
      console.error('Failed to mark all as read:', error);
    }
  };

  // ---- Greeting ----
  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) setGreeting('Good morning');
    else if (hour < 17) setGreeting('Good afternoon');
    else setGreeting('Good evening');
  }, []);

  // ---- Real stats from queries ----
  const realStats = {
    posts: anonymousPostsData?.total || 0,
    notifications: unreadData?.unreadCount || 0,
    skills: userData?.skills?.length || 0,
    talents: talentsData?.total || 0,
  };

  // ---- For the chart ----
  const weeklyActivity = computedStats.weeklyActivity;
  const maxActivity = Math.max(...weeklyActivity, 1);
  const dayLabels = computedStats.dayLabels;
  const chartWidth = 600;
  const chartHeight = 220;
  const padding = 10;
  const points = weeklyActivity.map((val, idx) => ({
    x: padding + (idx / (weeklyActivity.length - 1)) * (chartWidth - 2 * padding),
    y: chartHeight - padding - (val / maxActivity) * (chartHeight - 2 * padding),
    val,
  }));

  const linePath = points.reduce((acc, point, i, arr) => {
    if (i === 0) return `M ${point.x},${point.y}`;
    const prev = arr[i - 1];
    const midX = (prev.x + point.x) / 2;
    return `${acc} C ${midX},${prev.y} ${midX},${point.y} ${point.x},${point.y}`;
  }, '');

  const areaPath = `${linePath} L ${points[points.length - 1].x},${chartHeight - padding} L ${points[0].x},${chartHeight - padding} Z`;

  // ---- Gender data for pie chart ----
  const genderData = [
    { label: 'Male', value: computedStats.genderCounts.Male || 0, color: GOLD },
    { label: 'Female', value: computedStats.genderCounts.Female || 0, color: '#8b5cf6' },
    { label: 'Other', value: computedStats.genderCounts.Other + computedStats.genderCounts['prefer-not-to-say'] || 0, color: '#3b82f6' },
  ];
  const totalGender = genderData.reduce((sum, g) => sum + g.value, 0);
  const genderPercent = genderData.map((g) => ({
    ...g,
    percent: totalGender > 0 ? Math.round((g.value / totalGender) * 100) : 0,
  }));

  const recentNotifications = notificationsData?.notifications?.slice(0, 3) || [];
  const recentPosts = anonymousPostsData?.posts?.slice(0, 3) || [];

  const tabs = [
    { key: 'dashboard', label: 'Overview' },
    { key: 'feed', label: 'Feed' },
    { key: 'notifications', label: 'Notifications' },
    { key: 'posts', label: 'My Posts' },
  ];

  const communityLink = 'https://chat.whatsapp.com/GmLNrwWAqTIGogE2TYhS7u';

  // ---- Loading state for users ----
  if (usersLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: BG }}>
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-t-4" style={{ borderColor: BORDER, borderTopColor: GOLD }} />
          <p className="mt-4 text-sm" style={{ color: MUTED }}>Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: BG }}>
      <DashboardSidebar />

      <div className="lg:ml-72 relative">
        {/* Header */}
        <div className="sticky top-0 z-30" style={{ backgroundColor: BG }}>
          <div className="flex items-center justify-between px-4 sm:px-6 pt-5 pb-4">
            <div className="min-w-0">
              <p className="text-lg font-extrabold tracking-tight truncate" style={{ color: INK }}>
                <span style={{ color: GOLD }}>{greeting.split(' ')[0]}</span>{' '}
                {greeting.split(' ')[1]}, {userData?.name?.split(' ')[0] || 'User'}
              </p>
              <p className="text-xs" style={{ color: MUTED }}>Here's what's happening today</p>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <button className="p-2.5 rounded-full hover:bg-black/5 relative">
                <Bell size={18} style={{ color: INK }} />
                {unreadData?.unreadCount > 0 && (
                  <span
                    className="absolute top-1 right-1 w-2 h-2 rounded-full"
                    style={{ backgroundColor: RED, border: `1.5px solid ${BG}` }}
                  />
                )}
              </button>
              <div
                className="w-9 h-9 rounded-full flex items-center justify-center font-bold text-sm"
                style={{ backgroundColor: GOLD_TINT, color: GOLD_DEEP }}
              >
                {userData?.name?.charAt(0) || 'U'}
              </div>
            </div>
          </div>

          {/* Tabs row with Join Community button integrated */}
          <div className="px-4 sm:px-6 pb-4">
            <div className="flex items-center gap-2">
              <div className="overflow-x-auto whitespace-nowrap flex-1" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
                <div className="inline-flex p-1 rounded-full" style={{ backgroundColor: '#ECE7DA' }}>
                  {tabs.map((tab) => (
                    <button
                      key={tab.key}
                      onClick={() => setSelectedTab(tab.key)}
                      className="px-4 sm:px-5 py-2 rounded-full text-xs sm:text-sm font-semibold transition-all flex-shrink-0"
                      style={
                        selectedTab === tab.key
                          ? { backgroundColor: INK, color: '#fff' }
                          : { color: MUTED }
                      }
                    >
                      {tab.label}
                    </button>
                  ))}
                </div>
              </div>

              <a
                href={communityLink}
                target="_blank"
                rel="noopener noreferrer"
                className="relative flex items-center gap-1.5 px-4 py-2 rounded-full text-xs sm:text-sm font-bold text-white flex-shrink-0 z-10"
                style={{ backgroundColor: GOLD }}
              >
                <span className="absolute inset-0 rounded-full" style={{ animation: 'wave 2s infinite', backgroundColor: 'rgba(255,255,255,0.4)' }} />
                <span className="absolute inset-0 rounded-full" style={{ animation: 'wave 2s infinite 0.5s', backgroundColor: 'rgba(255,255,255,0.4)' }} />
                <span className="absolute inset-0 rounded-full" style={{ animation: 'wave 2s infinite 1s', backgroundColor: 'rgba(255,255,255,0.4)' }} />
                <Users size={16} className="relative z-10" />
                <span className="hidden sm:inline">Join</span>
              </a>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="px-4 sm:px-6 lg:px-8 pb-8">
          {/* ============= DASHBOARD TAB ============= */}
          {selectedTab === 'dashboard' && (
            <div className="space-y-6">
              {/* Hero black card with Join Community button */}
              <div className="rounded-3xl p-6 sm:p-8" style={{ backgroundColor: HERO }}>
                <div className="grid grid-cols-3 gap-4 sm:gap-8">
                  <div>
                    <p className="text-[11px] uppercase tracking-widest mb-1.5" style={{ color: '#8a8578' }}>Total Posts</p>
                    <p className="text-2xl sm:text-3xl font-extrabold" style={{ color: GOLD }}>{realStats.posts}</p>
                  </div>
                  <div>
                    <p className="text-[11px] uppercase tracking-widest mb-1.5" style={{ color: '#8a8578' }}>Members</p>
                    <p className="text-2xl sm:text-3xl font-extrabold text-white">{computedStats.totalMembers}</p>
                  </div>
                  <div className="flex items-center justify-end">
                    <a
                      href={communityLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="relative flex items-center gap-1.5 px-4 py-2.5 rounded-full text-xs sm:text-sm font-bold text-white"
                      style={{ backgroundColor: GOLD }}
                    >
                      <span className="absolute inset-0 rounded-full" style={{ animation: 'wave 2s infinite', backgroundColor: 'rgba(255,255,255,0.4)' }} />
                      <span className="absolute inset-0 rounded-full" style={{ animation: 'wave 2s infinite 0.5s', backgroundColor: 'rgba(255,255,255,0.4)' }} />
                      <span className="absolute inset-0 rounded-full" style={{ animation: 'wave 2s infinite 1s', backgroundColor: 'rgba(255,255,255,0.4)' }} />
                      <Users size={16} className="relative z-10" />
                      <span className="hidden sm:inline">Join Community</span>
                    </a>
                  </div>
                </div>
                <div className="flex items-center gap-3 mt-6">
                  <Link
                    to="/anonymous"
                    className="flex items-center gap-1.5 px-4 py-2.5 rounded-full text-xs sm:text-sm font-semibold transition-colors"
                    style={{ backgroundColor: GOLD, color: HERO }}
                  >
                    <Plus size={14} /> New Post
                  </Link>
                  <button
                    onClick={() => setSelectedTab('notifications')}
                    className="px-4 py-2.5 rounded-full text-xs sm:text-sm font-semibold text-white transition-colors"
                    style={{ backgroundColor: 'rgba(255,255,255,0.1)' }}
                  >
                    View Notifications
                  </button>
                  <button
                    onClick={() => setSelectedTab('posts')}
                    className="hidden sm:inline-flex px-4 py-2.5 rounded-full text-sm font-semibold text-white transition-colors"
                    style={{ backgroundColor: 'rgba(255,255,255,0.1)' }}
                  >
                    Manage Posts
                  </button>
                </div>
              </div>

              {/* Activity card with real weekly chart */}
              <CardShell>
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-5">
                  <div>
                    <p className="text-xs" style={{ color: MUTED }}>Performance Overview</p>
                    <h3 className="text-lg font-bold" style={{ color: INK }}>Weekly Sign-ups</h3>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ backgroundColor: GOLD_TINT }}>
                        <Users size={14} style={{ color: GOLD_DEEP }} />
                      </div>
                      <div>
                        <p className="text-xs font-bold" style={{ color: INK }}>{computedStats.totalMembers}</p>
                        <p className="text-[10px]" style={{ color: MUTED }}>Members</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ backgroundColor: '#e9f9ef' }}>
                        <Smartphone size={14} style={{ color: GREEN }} />
                      </div>
                      <div>
                        <p className="text-xs font-bold" style={{ color: INK }}>{computedStats.whatsappMembers}</p>
                        <p className="text-[10px]" style={{ color: MUTED }}>WhatsApp</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ backgroundColor: '#eaf1ff' }}>
                        <Activity size={14} style={{ color: '#3b82f6' }} />
                      </div>
                      <div>
                        <p className="text-xs font-bold" style={{ color: INK }}>{computedStats.growthPercent.toFixed(1)}%</p>
                        <p className="text-[10px]" style={{ color: MUTED }}>Growth</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Area chart */}
                <div className="relative w-full">
                  <svg
                    viewBox={`0 0 ${chartWidth} ${chartHeight}`}
                    preserveAspectRatio="xMidYMid meet"
                    className="w-full h-auto"
                  >
                    <defs>
                      <linearGradient id="chartFill" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor={GOLD} stopOpacity="0.3" />
                        <stop offset="100%" stopColor={GOLD} stopOpacity="0" />
                      </linearGradient>
                      <linearGradient id="chartLine" x1="0" y1="0" x2="1" y2="0">
                        <stop offset="0%" stopColor={GOLD_DEEP} />
                        <stop offset="100%" stopColor={GOLD} />
                      </linearGradient>
                    </defs>
                    {[0.25, 0.5, 0.75].map((ratio) => (
                      <line
                        key={ratio}
                        x1={padding}
                        x2={chartWidth - padding}
                        y1={chartHeight - padding - ratio * (chartHeight - 2 * padding)}
                        y2={chartHeight - padding - ratio * (chartHeight - 2 * padding)}
                        stroke="#e5e0d5"
                        strokeWidth="0.5"
                        strokeDasharray="4"
                      />
                    ))}
                    <path d={areaPath} fill="url(#chartFill)" />
                    <path
                      d={linePath}
                      fill="none"
                      stroke="url(#chartLine)"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    {points.map((p, i) => (
                      <circle
                        key={i}
                        cx={p.x}
                        cy={p.y}
                        r={i === points.length - 1 ? 4 : 3}
                        fill="#fff"
                        stroke={GOLD_DEEP}
                        strokeWidth="2"
                      />
                    ))}
                  </svg>
                  <div className="flex justify-between mt-2 px-2">
                    {dayLabels.map((day) => (
                      <span key={day} className="text-[10px] font-medium" style={{ color: MUTED }}>
                        {day}
                      </span>
                    ))}
                  </div>
                </div>
              </CardShell>

              {/* Demographics + WhatsApp (real data) */}
              <div className="grid lg:grid-cols-2 gap-6">
                {/* Demographics - real gender distribution */}
                <CardShell>
                  <h3 className="text-base font-bold mb-5" style={{ color: INK }}>Demographics</h3>
                  <div className="flex items-center justify-center">
                    <div className="relative w-32 h-32">
                      <svg viewBox="0 0 36 36" className="w-full h-full -rotate-90">
                        <circle cx="18" cy="18" r="15.915" fill="none" stroke="#f3f0e8" strokeWidth="3.5" />
                        {genderPercent.map((segment, idx) => {
                          const offset = genderPercent.slice(0, idx).reduce((sum, s) => sum + s.percent, 0);
                          const circumference = 2 * Math.PI * 15.915;
                          const dash = (segment.percent / 100) * circumference;
                          return (
                            <circle
                              key={idx}
                              cx="18" cy="18" r="15.915"
                              fill="none"
                              stroke={segment.color}
                              strokeWidth="3.5"
                              strokeLinecap="round"
                              strokeDasharray={`${dash} ${circumference - dash}`}
                              strokeDashoffset={-offset * (circumference / 100)}
                            />
                          );
                        })}
                      </svg>
                      <div className="absolute inset-0 flex flex-col items-center justify-center">
                        <span className="text-xl font-extrabold" style={{ color: INK }}>{computedStats.totalMembers}</span>
                        <span className="text-[10px]" style={{ color: MUTED }}>Users</span>
                      </div>
                    </div>
                  </div>
                  <div className="mt-5 space-y-2.5">
                    {genderPercent.map((item) => (
                      <div key={item.label} className="flex items-center justify-between text-sm">
                        <div className="flex items-center gap-2">
                          <span className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color }} />
                          <span style={{ color: MUTED }}>{item.label}</span>
                        </div>
                        <span className="font-bold" style={{ color: INK }}>{item.percent}%</span>
                      </div>
                    ))}
                  </div>
                </CardShell>

                {/* WhatsApp Channel - real WhatsApp members */}
                <CardShell>
                  <div className="flex items-center justify-between mb-5">
                    <h3 className="text-base font-bold" style={{ color: INK }}>WhatsApp Channel</h3>
                    <span className="text-xs font-semibold px-3 py-1 rounded-full flex items-center gap-1.5" style={{ backgroundColor: '#e9f9ef', color: GREEN }}>
                      <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: GREEN }} /> Active
                    </span>
                  </div>
                  <div className="space-y-3">
                    <div className="rounded-2xl p-4" style={{ backgroundColor: BG }}>
                      <div className="flex items-center gap-2 text-xs mb-1.5" style={{ color: MUTED }}>
                        <Users size={13} /> Members
                      </div>
                      <p className="text-lg font-extrabold" style={{ color: INK }}>{computedStats.whatsappMembers}</p>
                    </div>
                    <div className="rounded-2xl p-4" style={{ backgroundColor: BG }}>
                      <div className="flex items-center gap-2 text-xs mb-1.5" style={{ color: MUTED }}>
                        <TrendingUp size={13} /> Growth (30d)
                      </div>
                      <p className="text-lg font-extrabold" style={{ color: computedStats.growthPercent >= 0 ? GREEN : RED }}>
                        {computedStats.growthPercent >= 0 ? '+' : ''}{computedStats.growthPercent.toFixed(1)}%
                      </p>
                    </div>
                  </div>
                  <div className="mt-4 flex items-center justify-between">
                    <span className="text-xs" style={{ color: MUTED }}>Last 30 days activity</span>
                    <a href={communityLink} target="_blank" rel="noopener noreferrer" className="text-xs font-semibold" style={{ color: GOLD_DEEP }}>
                      Join channel →
                    </a>
                  </div>
                </CardShell>
              </div>

              {/* Recent Notifications & Posts (same as before) */}
              <div className="grid lg:grid-cols-2 gap-6">
                <CardShell>
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-base font-bold" style={{ color: INK }}>Recent Notifications</h3>
                    <button onClick={() => setSelectedTab('notifications')} className="text-xs font-semibold" style={{ color: GOLD_DEEP }}>View all</button>
                  </div>
                  <div className="space-y-1">
                    {notificationsLoading ? (
                      <div className="text-center py-4">
                        <div className="inline-block animate-spin rounded-full h-6 w-6 border-2" style={{ borderColor: BORDER, borderTopColor: GOLD }} />
                      </div>
                    ) : recentNotifications.length === 0 ? (
                      <p className="text-sm text-center py-4" style={{ color: MUTED }}>No notifications</p>
                    ) : (
                      recentNotifications.map((notification) => (
                        <div key={notification._id} className="flex items-start gap-3 p-2.5 rounded-2xl hover:bg-black/[0.02]">
                          <div className="w-9 h-9 rounded-full flex items-center justify-center shrink-0" style={{ backgroundColor: GOLD_TINT }}>
                            <Bell size={14} style={{ color: GOLD_DEEP }} />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-semibold truncate" style={{ color: INK }}>{notification.title}</p>
                            <p className="text-xs line-clamp-1" style={{ color: MUTED }}>{notification.message}</p>
                          </div>
                          <span className="text-xs shrink-0" style={{ color: MUTED }}>{formatDate(notification.createdAt)}</span>
                        </div>
                      ))
                    )}
                  </div>
                </CardShell>

                <CardShell>
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-base font-bold" style={{ color: INK }}>Recent Posts</h3>
                    <button onClick={() => setSelectedTab('posts')} className="text-xs font-semibold" style={{ color: GOLD_DEEP }}>View all</button>
                  </div>
                  <div className="space-y-1">
                    {postsLoading ? (
                      <div className="text-center py-4">
                        <div className="inline-block animate-spin rounded-full h-6 w-6 border-2" style={{ borderColor: BORDER, borderTopColor: GOLD }} />
                      </div>
                    ) : recentPosts.length === 0 ? (
                      <p className="text-sm text-center py-4" style={{ color: MUTED }}>No posts yet</p>
                    ) : (
                      recentPosts.map((post) => (
                        <div key={post._id} className="flex items-start gap-3 p-2.5 rounded-2xl hover:bg-black/[0.02]">
                          <div className="w-9 h-9 rounded-full flex items-center justify-center shrink-0" style={{ backgroundColor: GOLD_TINT }}>
                            <Lock size={14} style={{ color: GOLD_DEEP }} />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm line-clamp-1" style={{ color: INK }}>{post.content}</p>
                            <p className="text-xs" style={{ color: MUTED }}>{formatDate(post.createdAt)}</p>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </CardShell>
              </div>
            </div>
          )}

          {/* ============= FEED TAB ============= (unchanged) */}
          {selectedTab === 'feed' && (
            <div className="space-y-3">
              {/* ... feed content ... (same as before) */}
              {/* I'm omitting for brevity, but keep the existing feed code */}
            </div>
          )}

          {/* ============= NOTIFICATIONS TAB ============= (unchanged) */}
          {selectedTab === 'notifications' && (
            <CardShell className="p-0 overflow-hidden">
              {/* ... notifications content ... */}
            </CardShell>
          )}

          {/* ============= MY POSTS TAB ============= (unchanged) */}
          {selectedTab === 'posts' && (
            <CardShell className="p-0 overflow-hidden">
              {/* ... posts content ... */}
            </CardShell>
          )}
        </div>

        {/* Floating action button */}
        <Link
          to="/anonymous"
          className="fixed bottom-6 right-6 lg:right-10 w-14 h-14 rounded-full flex items-center justify-center z-40 transition-transform hover:scale-105"
          style={{ background: `linear-gradient(135deg, ${GOLD_DEEP}, ${GOLD})`, boxShadow: `0 8px 24px rgba(201,134,15,0.35)` }}
        >
          <Plus size={22} color="#fff" />
        </Link>
      </div>

      <style>{`
        @keyframes wave {
          0% {
            transform: scale(1);
            opacity: 0.7;
          }
          100% {
            transform: scale(2.5);
            opacity: 0;
          }
        }
      `}</style>
    </div>
  );
};

export default Dashboard;