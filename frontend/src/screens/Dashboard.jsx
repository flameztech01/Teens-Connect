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
    TrendingUp,
    ArrowUpRight,
    ArrowDownRight,
    Plus,
    BarChart3,
    PieChart,
    ChevronRight,
    Sparkles,
    Zap,
} from 'lucide-react';

// ---- design tokens - dark theme matching signin ----
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

const StatCard = ({ icon: Icon, label, value, trend, trendValue, color = GOLD }) => (
    <div
        className="rounded-2xl p-4 sm:p-5 transition-all duration-300 hover:scale-[1.02] group"
        style={{ backgroundColor: CARD, border: `1px solid ${BORDER}` }}
    >
        <div className="flex items-start justify-between">
            <div
                className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center transition-colors group-hover:scale-110"
                style={{ backgroundColor: `${color}15` }}
            >
                <Icon size={16} className="sm:w-[18px] sm:h-[18px]" style={{ color }} />
            </div>
            {trend !== undefined && (
                <span
                    className={`inline-flex items-center gap-0.5 text-[10px] sm:text-xs font-semibold px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-full`}
                    style={{
                        backgroundColor: trend >= 0 ? 'rgba(34,197,94,0.12)' : 'rgba(239,68,68,0.12)',
                        color: trend >= 0 ? GREEN : RED,
                    }}
                >
                    {trend >= 0 ? '+' : ''}{trendValue}%
                    {trend >= 0 ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
                </span>
            )}
        </div>
        <p className="text-xl sm:text-3xl font-bold mt-2 sm:mt-3" style={{ color: INK }}>
            {value}
        </p>
        <p className="text-[10px] sm:text-xs" style={{ color: MUTED }}>{label}</p>
    </div>
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

        const genderCounts = { Male: 0, Female: 0, Other: 0, 'prefer-not-to-say': 0 };
        users.forEach((u) => {
            const g = u.gender || 'prefer-not-to-say';
            if (genderCounts[g] !== undefined) genderCounts[g]++;
            else genderCounts.Other++;
        });

        const whatsappMembers = users.filter((u) => u.whatsappNumber || u.whatsappLink).length;

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
            growthPercent = 100;
        }

        const dayLabels = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
        const weeklyActivity = new Array(7).fill(0);
        const today = new Date();
        const dayOfWeek = today.getDay();
        const startOfWeek = new Date(today);
        startOfWeek.setDate(today.getDate() - dayOfWeek + (dayOfWeek === 0 ? -6 : 1));
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

        return {
            totalMembers,
            whatsappMembers,
            genderCounts,
            growthPercent,
            weeklyActivity,
            dayLabels,
        };
    }, [users, totalMembers]);

    // ---- Format date ----
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
        { label: 'Female', value: computedStats.genderCounts.Female || 0, color: PURPLE },
        { label: 'Other', value: computedStats.genderCounts.Other + computedStats.genderCounts['prefer-not-to-say'] || 0, color: BLUE },
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
        { key: 'notifications', label: 'Alerts' },
        { key: 'posts', label: 'My Posts' },
    ];

    const communityLink = 'https://chat.whatsapp.com/GmLNrwWAqTIGogE2TYhS7u';

    // ---- Loading state ----
    if (usersLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: BG }}>
                <div className="text-center">
                    <div className="inline-block animate-spin rounded-full h-12 w-12 border-4" style={{ borderColor: BORDER, borderTopColor: GOLD }} />
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
                <div className="sticky top-0 z-30" style={{ backgroundColor: BG, borderBottom: `1px solid ${BORDER}` }}>
                    <div className="flex items-center justify-between px-3 sm:px-6 pt-3 sm:pt-5 pb-2 sm:pb-4">
                        <div className="min-w-0">
                            <p className="text-sm sm:text-lg font-medium tracking-tight truncate" style={{ color: INK }}>
                                <span style={{ color: GOLD }}>{greeting.split(' ')[0]}</span>{' '}
                                {greeting.split(' ')[1]}, {userData?.name?.split(' ')[0] || 'User'}
                            </p>
                            <p className="text-[10px] sm:text-xs" style={{ color: MUTED }}>Here's what's happening</p>
                        </div>
                        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
                            <button
                                className="relative p-2 rounded-xl transition-all hover:bg-white/5"
                                style={{ color: MUTED }}
                            >
                                <Bell size={18} />
                                {unreadData?.unreadCount > 0 && (
                                    <span
                                        className="absolute top-1 right-1 w-2 h-2 rounded-full"
                                        style={{ backgroundColor: RED, border: `1.5px solid ${BG}` }}
                                    />
                                )}
                            </button>
                            <div
                                className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl flex items-center justify-center font-semibold text-xs sm:text-sm transition-all hover:scale-105"
                                style={{ backgroundColor: GOLD_TINT, color: GOLD }}
                            >
                                {userData?.name?.charAt(0) || 'U'}
                            </div>
                        </div>
                    </div>

                    {/* Tabs row with Join Community button */}
                    <div className="px-3 sm:px-6 pb-2 sm:pb-4">
                        <div className="flex items-center gap-2 sm:gap-3">
                            <div className="overflow-x-auto whitespace-nowrap flex-1" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
                                <div className="inline-flex p-1 rounded-xl" style={{ backgroundColor: 'rgba(255,255,255,0.04)' }}>
                                    {tabs.map((tab) => (
                                        <button
                                            key={tab.key}
                                            onClick={() => setSelectedTab(tab.key)}
                                            className="px-3 sm:px-5 py-1.5 sm:py-2 rounded-lg text-[10px] sm:text-sm font-medium transition-all flex-shrink-0"
                                            style={
                                                selectedTab === tab.key
                                                    ? { backgroundColor: GOLD, color: '#0c0c0d' }
                                                    : { color: MUTED, hover: { backgroundColor: 'rgba(255,255,255,0.04)' } }
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
                                className="relative flex items-center justify-center gap-1.5 px-2 sm:px-4 py-1.5 sm:py-2 rounded-lg text-[10px] sm:text-sm font-semibold flex-shrink-0 transition-all hover:scale-105"
                                style={{ backgroundColor: GOLD, color: '#0c0c0d' }}
                            >
                                <Users size={14} />
                                <span className="hidden sm:inline">Join</span>
                            </a>
                        </div>
                    </div>
                </div>

                {/* Main Content */}
                <div className="px-3 sm:px-4 lg:px-6 pb-8 pt-4 sm:pt-6">
                    {/* ============= DASHBOARD TAB ============= */}
                    {selectedTab === 'dashboard' && (
                        <div className="space-y-4 sm:space-y-6">
                            {/* ---- Stats Section ---- */}
                            {/* Mobile: Single slim summary card */}
                            <div className="sm:hidden">
                                <div
                                    className="rounded-2xl p-2 flex items-center justify-around"
                                    style={{ backgroundColor: CARD, border: `1px solid ${BORDER}` }}
                                >
                                    <div className="text-center">
                                        <p className="text-[10px]" style={{ color: MUTED }}>Posts</p>
                                        <p className="text-base font-bold" style={{ color: INK }}>{realStats.posts}</p>
                                    </div>
                                    <div className="text-center">
                                        <p className="text-[10px]" style={{ color: MUTED }}>Members</p>
                                        <p className="text-base font-bold" style={{ color: INK }}>{computedStats.totalMembers}</p>
                                    </div>
                                    <div className="text-center">
                                        <p className="text-[10px]" style={{ color: MUTED }}>Alerts</p>
                                        <p className="text-base font-bold" style={{ color: INK }}>{realStats.notifications}</p>
                                    </div>
                                    <div className="text-center">
                                        <p className="text-[10px]" style={{ color: MUTED }}>Skills</p>
                                        <p className="text-base font-bold" style={{ color: INK }}>{realStats.skills}</p>
                                    </div>
                                </div>
                            </div>

                            {/* Desktop/Tablet: Grid of stat cards */}
                            <div className="hidden sm:grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
                                <StatCard
                                    icon={BarChart3}
                                    label="Total Posts"
                                    value={realStats.posts}
                                    trend={12}
                                    trendValue="12"
                                    color={GOLD}
                                />
                                <StatCard
                                    icon={Users}
                                    label="Members"
                                    value={computedStats.totalMembers}
                                    trend={computedStats.growthPercent}
                                    trendValue={computedStats.growthPercent.toFixed(1)}
                                    color={BLUE}
                                />
                                <StatCard
                                    icon={Bell}
                                    label="Notifications"
                                    value={realStats.notifications}
                                    trend={-3}
                                    trendValue="3"
                                    color={PURPLE}
                                />
                                <StatCard
                                    icon={Zap}
                                    label="Skills"
                                    value={realStats.skills}
                                    trend={5}
                                    trendValue="5"
                                    color={GREEN}
                                />
                            </div>

                            {/* Chart + Demographics Row */}
                            <div className="grid lg:grid-cols-3 gap-4 sm:gap-6">
                                {/* Activity Chart */}
                                <CardShell className="lg:col-span-2" glow>
                                    <div className="flex items-center justify-between mb-4 sm:mb-5">
                                        <div>
                                            <p className="text-[10px] sm:text-xs" style={{ color: MUTED }}>Performance</p>
                                            <h3 className="text-base sm:text-lg font-semibold" style={{ color: INK }}>Weekly Sign-ups</h3>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <span className="text-[10px] sm:text-xs px-2 sm:px-3 py-1 rounded-full" style={{ backgroundColor: 'rgba(255,255,255,0.04)', color: MUTED }}>
                                                {computedStats.totalMembers} total
                                            </span>
                                        </div>
                                    </div>

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
                                                    stroke="rgba(255,255,255,0.06)"
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
                                                    fill={BG}
                                                    stroke={GOLD}
                                                    strokeWidth="2"
                                                />
                                            ))}
                                        </svg>
                                        <div className="flex justify-between mt-2 px-2">
                                            {dayLabels.map((day) => (
                                                <span key={day} className="text-[8px] sm:text-[10px] font-medium" style={{ color: MUTED }}>
                                                    {day}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                </CardShell>

                                {/* Demographics Pie */}
                                <CardShell glow>
                                    <div className="flex items-center justify-between mb-4 sm:mb-5">
                                        <h3 className="text-base sm:text-lg font-semibold" style={{ color: INK }}>Demographics</h3>
                                        <PieChart size={16} style={{ color: MUTED }} />
                                    </div>
                                    <div className="flex items-center justify-center">
                                        <div className="relative w-28 h-28 sm:w-32 sm:h-32">
                                            <svg viewBox="0 0 36 36" className="w-full h-full -rotate-90">
                                                <circle cx="18" cy="18" r="15.915" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="3.5" />
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
                                                <span className="text-lg sm:text-xl font-bold" style={{ color: INK }}>{computedStats.totalMembers}</span>
                                                <span className="text-[8px] sm:text-[10px]" style={{ color: MUTED }}>Users</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="mt-4 sm:mt-5 space-y-2">
                                        {genderPercent.map((item) => (
                                            <div key={item.label} className="flex items-center justify-between text-xs sm:text-sm">
                                                <div className="flex items-center gap-2">
                                                    <span className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color }} />
                                                    <span style={{ color: MUTED }}>{item.label}</span>
                                                </div>
                                                <span className="font-semibold" style={{ color: INK }}>{item.percent}%</span>
                                            </div>
                                        ))}
                                    </div>
                                </CardShell>
                            </div>

                            {/* WhatsApp Channel + Quick Actions */}
                            <div className="grid lg:grid-cols-3 gap-4 sm:gap-6">
                                {/* WhatsApp Channel */}
                                <CardShell className="lg:col-span-1" glow>
                                    <div className="flex items-center justify-between mb-3 sm:mb-4">
                                        <h3 className="text-base sm:text-lg font-semibold" style={{ color: INK }}>WhatsApp</h3>
                                        <span className="text-[10px] sm:text-xs font-medium px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-full flex items-center gap-1" style={{ backgroundColor: 'rgba(34,197,94,0.12)', color: GREEN }}>
                                            <span className="w-1 h-1 sm:w-1.5 sm:h-1.5 rounded-full" style={{ backgroundColor: GREEN }} />
                                            Active
                                        </span>
                                    </div>
                                    <div className="space-y-2 sm:space-y-3">
                                        <div className="rounded-xl p-3 sm:p-4" style={{ backgroundColor: 'rgba(255,255,255,0.03)' }}>
                                            <div className="flex items-center gap-2 text-[10px] sm:text-xs mb-0.5 sm:mb-1" style={{ color: MUTED }}>
                                                <Users size={13} /> Members
                                            </div>
                                            <p className="text-base sm:text-lg font-bold" style={{ color: INK }}>{computedStats.whatsappMembers}</p>
                                        </div>
                                        <div className="rounded-xl p-3 sm:p-4" style={{ backgroundColor: 'rgba(255,255,255,0.03)' }}>
                                            <div className="flex items-center gap-2 text-[10px] sm:text-xs mb-0.5 sm:mb-1" style={{ color: MUTED }}>
                                                <TrendingUp size={13} /> Growth (30d)
                                            </div>
                                            <p className="text-base sm:text-lg font-bold" style={{ color: computedStats.growthPercent >= 0 ? GREEN : RED }}>
                                                {computedStats.growthPercent >= 0 ? '+' : ''}{computedStats.growthPercent.toFixed(1)}%
                                            </p>
                                        </div>
                                    </div>
                                    <a
                                        href={communityLink}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="mt-3 sm:mt-4 flex items-center justify-between text-xs sm:text-sm font-medium transition-colors hover:opacity-80"
                                        style={{ color: GOLD }}
                                    >
                                        <span>Join channel</span>
                                        <ChevronRight size={16} />
                                    </a>
                                </CardShell>

                                {/* Quick Actions */}
                                <CardShell className="lg:col-span-2" glow>
                                    <div className="flex items-center justify-between mb-3 sm:mb-5">
                                        <h3 className="text-base sm:text-lg font-semibold" style={{ color: INK }}>Quick Actions</h3>
                                        <Sparkles size={16} style={{ color: GOLD }} />
                                    </div>
                                    <div className="grid grid-cols-3 gap-1.5 sm:gap-3">
                                        <Link
                                            to="/anonymous"
                                            className="rounded-xl p-2 sm:p-4 text-center transition-all hover:scale-105 group"
                                            style={{ backgroundColor: 'rgba(255,255,255,0.03)', border: `1px solid ${BORDER}` }}
                                        >
                                            <div className="w-8 h-8 sm:w-10 sm:h-10 mx-auto rounded-xl flex items-center justify-center mb-1 sm:mb-2 transition-colors group-hover:bg-gold/20" style={{ backgroundColor: GOLD_TINT }}>
                                                <Plus size={14} className="sm:w-[18px] sm:h-[18px]" style={{ color: GOLD }} />
                                            </div>
                                            <p className="text-[10px] sm:text-xs font-medium" style={{ color: INK }}>New</p>
                                        </Link>
                                        <button
                                            onClick={() => setSelectedTab('notifications')}
                                            className="rounded-xl p-2 sm:p-4 text-center transition-all hover:scale-105 group"
                                            style={{ backgroundColor: 'rgba(255,255,255,0.03)', border: `1px solid ${BORDER}` }}
                                        >
                                            <div className="w-8 h-8 sm:w-10 sm:h-10 mx-auto rounded-xl flex items-center justify-center mb-1 sm:mb-2 transition-colors group-hover:bg-purple/20" style={{ backgroundColor: 'rgba(139,92,246,0.12)' }}>
                                                <Bell size={14} className="sm:w-[18px] sm:h-[18px]" style={{ color: PURPLE }} />
                                            </div>
                                            <p className="text-[10px] sm:text-xs font-medium" style={{ color: INK }}>Alerts</p>
                                        </button>
                                        <button
                                            onClick={() => setSelectedTab('posts')}
                                            className="rounded-xl p-2 sm:p-4 text-center transition-all hover:scale-105 group"
                                            style={{ backgroundColor: 'rgba(255,255,255,0.03)', border: `1px solid ${BORDER}` }}
                                        >
                                            <div className="w-8 h-8 sm:w-10 sm:h-10 mx-auto rounded-xl flex items-center justify-center mb-1 sm:mb-2 transition-colors group-hover:bg-blue/20" style={{ backgroundColor: 'rgba(59,130,246,0.12)' }}>
                                                <Lock size={14} className="sm:w-[18px] sm:h-[18px]" style={{ color: BLUE }} />
                                            </div>
                                            <p className="text-[10px] sm:text-xs font-medium" style={{ color: INK }}>Posts</p>
                                        </button>
                                    </div>
                                </CardShell>
                            </div>

                            {/* Recent Notifications & Posts */}
                            <div className="grid lg:grid-cols-2 gap-4 sm:gap-6">
                                <CardShell glow>
                                    <div className="flex items-center justify-between mb-3 sm:mb-4">
                                        <h3 className="text-sm sm:text-base font-semibold" style={{ color: INK }}>Recent Alerts</h3>
                                        <button onClick={() => setSelectedTab('notifications')} className="text-[10px] sm:text-xs font-medium transition-colors hover:opacity-80" style={{ color: GOLD }}>
                                            View all
                                        </button>
                                    </div>
                                    <div className="space-y-1">
                                        {notificationsLoading ? (
                                            <div className="text-center py-4">
                                                <div className="inline-block animate-spin rounded-full h-6 w-6 border-2" style={{ borderColor: BORDER, borderTopColor: GOLD }} />
                                            </div>
                                        ) : recentNotifications.length === 0 ? (
                                            <p className="text-xs sm:text-sm text-center py-4" style={{ color: MUTED }}>No notifications</p>
                                        ) : (
                                            recentNotifications.map((notification) => (
                                                <div key={notification._id} className="flex items-start gap-2 sm:gap-3 p-2 sm:p-3 rounded-xl transition-all hover:bg-white/5">
                                                    <div className="w-7 h-7 sm:w-9 sm:h-9 rounded-xl flex items-center justify-center shrink-0" style={{ backgroundColor: GOLD_TINT }}>
                                                        <Bell size={12} className="sm:w-[14px] sm:h-[14px]" style={{ color: GOLD }} />
                                                    </div>
                                                    <div className="flex-1 min-w-0">
                                                        <p className="text-xs sm:text-sm font-medium truncate" style={{ color: INK }}>{notification.title}</p>
                                                        <p className="text-[10px] sm:text-xs line-clamp-1" style={{ color: MUTED }}>{notification.message}</p>
                                                    </div>
                                                    <span className="text-[10px] sm:text-xs shrink-0" style={{ color: MUTED }}>{formatDate(notification.createdAt)}</span>
                                                </div>
                                            ))
                                        )}
                                    </div>
                                </CardShell>

                                <CardShell glow>
                                    <div className="flex items-center justify-between mb-3 sm:mb-4">
                                        <h3 className="text-sm sm:text-base font-semibold" style={{ color: INK }}>Recent Posts</h3>
                                        <button onClick={() => setSelectedTab('posts')} className="text-[10px] sm:text-xs font-medium transition-colors hover:opacity-80" style={{ color: GOLD }}>
                                            View all
                                        </button>
                                    </div>
                                    <div className="space-y-1">
                                        {postsLoading ? (
                                            <div className="text-center py-4">
                                                <div className="inline-block animate-spin rounded-full h-6 w-6 border-2" style={{ borderColor: BORDER, borderTopColor: GOLD }} />
                                            </div>
                                        ) : recentPosts.length === 0 ? (
                                            <p className="text-xs sm:text-sm text-center py-4" style={{ color: MUTED }}>No posts yet</p>
                                        ) : (
                                            recentPosts.map((post) => (
                                                <div key={post._id} className="flex items-start gap-2 sm:gap-3 p-2 sm:p-3 rounded-xl transition-all hover:bg-white/5">
                                                    <div className="w-7 h-7 sm:w-9 sm:h-9 rounded-xl flex items-center justify-center shrink-0" style={{ backgroundColor: 'rgba(59,130,246,0.12)' }}>
                                                        <Lock size={12} className="sm:w-[14px] sm:h-[14px]" style={{ color: BLUE }} />
                                                    </div>
                                                    <div className="flex-1 min-w-0">
                                                        <p className="text-xs sm:text-sm line-clamp-1" style={{ color: INK }}>{post.content}</p>
                                                        <p className="text-[10px] sm:text-xs" style={{ color: MUTED }}>{formatDate(post.createdAt)}</p>
                                                    </div>
                                                </div>
                                            ))
                                        )}
                                    </div>
                                </CardShell>
                            </div>
                        </div>
                    )}

                    {/* ============= FEED TAB ============= */}
                    {selectedTab === 'feed' && (
                        <div className="space-y-4 sm:space-y-6">
                            <CardShell glow>
                                <div className="flex items-center justify-between mb-3 sm:mb-5">
                                    <h3 className="text-base sm:text-lg font-semibold" style={{ color: INK }}>Community Feed</h3>
                                    <span className="text-[10px] sm:text-xs px-2 sm:px-3 py-1 rounded-full" style={{ backgroundColor: 'rgba(255,255,255,0.04)', color: MUTED }}>
                                        {anonymousPostsData?.total || 0} posts
                                    </span>
                                </div>
                                {postsLoading ? (
                                    <div className="text-center py-12">
                                        <div className="inline-block animate-spin rounded-full h-8 w-8 border-3" style={{ borderColor: BORDER, borderTopColor: GOLD }} />
                                        <p className="mt-4 text-sm" style={{ color: MUTED }}>Loading posts...</p>
                                    </div>
                                ) : anonymousPostsData?.posts?.length === 0 ? (
                                    <div className="text-center py-12">
                                        <div className="w-16 h-16 mx-auto rounded-2xl flex items-center justify-center mb-4" style={{ backgroundColor: 'rgba(255,255,255,0.03)' }}>
                                            <MessageCircle size={24} style={{ color: MUTED }} />
                                        </div>
                                        <p className="text-sm" style={{ color: MUTED }}>No posts in the feed yet</p>
                                        <Link to="/anonymous" className="text-sm font-medium mt-2 inline-block transition-colors hover:opacity-80" style={{ color: GOLD }}>
                                            Create the first post →
                                        </Link>
                                    </div>
                                ) : (
                                    <div className="space-y-3 sm:space-y-4">
                                        {anonymousPostsData?.posts?.slice(0, 5).map((post) => (
                                            <div key={post._id} className="rounded-xl p-3 sm:p-4 transition-all hover:bg-white/5" style={{ border: `1px solid ${BORDER}` }}>
                                                <div className="flex items-start gap-3">
                                                    <div className="w-7 h-7 sm:w-9 sm:h-9 rounded-xl flex items-center justify-center shrink-0" style={{ backgroundColor: GOLD_TINT }}>
                                                        <Lock size={12} className="sm:w-[14px] sm:h-[14px]" style={{ color: GOLD }} />
                                                    </div>
                                                    <div className="flex-1 min-w-0">
                                                        <p className="text-xs sm:text-sm" style={{ color: INK }}>{post.content}</p>
                                                        <p className="text-[10px] sm:text-xs mt-1" style={{ color: MUTED }}>{formatDate(post.createdAt)}</p>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </CardShell>
                        </div>
                    )}

                    {/* ============= NOTIFICATIONS TAB ============= */}
                    {selectedTab === 'notifications' && (
                        <CardShell glow className="p-0 overflow-hidden">
                            <div className="p-4 sm:p-6 border-b" style={{ borderColor: BORDER }}>
                                <div className="flex items-center justify-between gap-2">
                                    <div className="min-w-0">
                                        <h3 className="text-base sm:text-lg font-semibold" style={{ color: INK }}>Notifications</h3>
                                        <p className="text-[10px] sm:text-xs truncate" style={{ color: MUTED }}>Stay updated with your community activity</p>
                                    </div>
                                    <button
                                        onClick={handleMarkAllRead}
                                        className="text-[10px] sm:text-xs font-medium px-2 sm:px-4 py-1.5 sm:py-2 rounded-lg transition-colors hover:opacity-80 whitespace-nowrap"
                                        style={{ backgroundColor: GOLD_TINT, color: GOLD }}
                                    >
                                        Mark all read
                                    </button>
                                </div>
                            </div>
                            <div className="divide-y" style={{ borderColor: BORDER }}>
                                {notificationsLoading ? (
                                    <div className="text-center py-12">
                                        <div className="inline-block animate-spin rounded-full h-8 w-8 border-3" style={{ borderColor: BORDER, borderTopColor: GOLD }} />
                                        <p className="mt-4 text-sm" style={{ color: MUTED }}>Loading notifications...</p>
                                    </div>
                                ) : notificationsData?.notifications?.length === 0 ? (
                                    <div className="text-center py-12">
                                        <div className="w-16 h-16 mx-auto rounded-2xl flex items-center justify-center mb-4" style={{ backgroundColor: 'rgba(255,255,255,0.03)' }}>
                                            <Bell size={24} style={{ color: MUTED }} />
                                        </div>
                                        <p className="text-sm" style={{ color: MUTED }}>No notifications</p>
                                    </div>
                                ) : (
                                    notificationsData?.notifications?.map((notification) => (
                                        <div key={notification._id} className="flex items-start gap-3 sm:gap-4 p-4 sm:p-6 transition-all hover:bg-white/5">
                                            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center shrink-0" style={{ backgroundColor: notification.read ? 'rgba(255,255,255,0.03)' : GOLD_TINT }}>
                                                <Bell size={14} className="sm:w-[16px] sm:h-[16px]" style={{ color: notification.read ? MUTED : GOLD }} />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="text-xs sm:text-sm font-medium" style={{ color: notification.read ? MUTED : INK }}>{notification.title}</p>
                                                <p className="text-xs sm:text-sm" style={{ color: MUTED }}>{notification.message}</p>
                                                <p className="text-[10px] sm:text-xs mt-1" style={{ color: MUTED }}>{formatDate(notification.createdAt)}</p>
                                            </div>
                                            {!notification.read && (
                                                <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full shrink-0 mt-2" style={{ backgroundColor: GOLD }} />
                                            )}
                                        </div>
                                    ))
                                )}
                            </div>
                        </CardShell>
                    )}

                    {/* ============= MY POSTS TAB ============= */}
                    {selectedTab === 'posts' && (
                        <CardShell glow className="p-0 overflow-hidden">
                            <div className="p-4 sm:p-6 border-b" style={{ borderColor: BORDER }}>
                                <div className="flex items-center justify-between gap-2">
                                    <div className="min-w-0">
                                        <h3 className="text-base sm:text-lg font-semibold" style={{ color: INK }}>My Anonymous Posts</h3>
                                        <p className="text-[10px] sm:text-xs truncate" style={{ color: MUTED }}>Manage your anonymous contributions</p>
                                    </div>
                                    <Link
                                        to="/anonymous"
                                        className="flex items-center gap-1 text-[10px] sm:text-xs font-medium px-2 sm:px-4 py-1.5 sm:py-2 rounded-lg transition-colors hover:opacity-80 whitespace-nowrap"
                                        style={{ backgroundColor: GOLD_TINT, color: GOLD }}
                                    >
                                        <Plus size={12} className="sm:w-[14px] sm:h-[14px]" /> New
                                    </Link>
                                </div>
                            </div>
                            <div className="divide-y" style={{ borderColor: BORDER }}>
                                {postsLoading ? (
                                    <div className="text-center py-12">
                                        <div className="inline-block animate-spin rounded-full h-8 w-8 border-3" style={{ borderColor: BORDER, borderTopColor: GOLD }} />
                                        <p className="mt-4 text-sm" style={{ color: MUTED }}>Loading posts...</p>
                                    </div>
                                ) : anonymousPostsData?.posts?.length === 0 ? (
                                    <div className="text-center py-12">
                                        <div className="w-16 h-16 mx-auto rounded-2xl flex items-center justify-center mb-4" style={{ backgroundColor: 'rgba(255,255,255,0.03)' }}>
                                            <Lock size={24} style={{ color: MUTED }} />
                                        </div>
                                        <p className="text-sm" style={{ color: MUTED }}>You haven't posted anything yet</p>
                                        <Link to="/anonymous" className="text-sm font-medium mt-2 inline-block transition-colors hover:opacity-80" style={{ color: GOLD }}>
                                            Create your first post →
                                        </Link>
                                    </div>
                                ) : (
                                    anonymousPostsData?.posts?.map((post) => (
                                        <div key={post._id} className="flex items-start gap-3 sm:gap-4 p-4 sm:p-6 transition-all hover:bg-white/5">
                                            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center shrink-0" style={{ backgroundColor: 'rgba(59,130,246,0.12)' }}>
                                                <Lock size={14} className="sm:w-[16px] sm:h-[16px]" style={{ color: BLUE }} />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="text-xs sm:text-sm" style={{ color: INK }}>{post.content}</p>
                                                <p className="text-[10px] sm:text-xs mt-1" style={{ color: MUTED }}>{formatDate(post.createdAt)}</p>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        </CardShell>
                    )}
                </div>

                {/* Floating action button */}
                <Link
                    to="/anonymous"
                    className="fixed bottom-4 sm:bottom-6 right-4 sm:right-6 lg:right-10 w-12 h-12 sm:w-14 sm:h-14 rounded-2xl flex items-center justify-center z-40 transition-all hover:scale-105 hover:shadow-glow"
                    style={{
                        background: `linear-gradient(135deg, ${GOLD_DEEP}, ${GOLD})`,
                        boxShadow: `0 8px 32px rgba(244,168,37,0.35)`,
                    }}
                >
                    <Plus size={18} className="sm:w-[22px] sm:h-[22px]" color="#0c0c0d" />
                </Link>
            </div>

            <style>{`
                @keyframes wave {
                    0% { transform: scale(1); opacity: 0.7; }
                    100% { transform: scale(2.5); opacity: 0; }
                }
                .hover\\:shadow-glow:hover {
                    box-shadow: 0 8px 40px rgba(244,168,37,0.5) !important;
                }
            `}</style>
        </div>
    );
};

export default Dashboard;