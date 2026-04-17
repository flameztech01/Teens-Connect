import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import DashboardSidebar from "../components/DashbordSidebar"
import { useGetMyAnonymousPostsQuery } from '../slices/anonymousApiSlice';
import { useGetUserByIdQuery } from '../slices/userApiSlice';
import {
  Eye,
  Briefcase,
  Award,
  Lock,
  MessageCircle,
  Heart,
  MoreHorizontal,
  Sparkles,
  Activity,
  Zap
} from 'lucide-react';

const Dashboard = () => {
  const { userInfo } = useSelector((state: any) => state.auth);
  const [greeting, setGreeting] = useState('');
  const [selectedTab, setSelectedTab] = useState('overview');
  
  const { data: userData, isLoading: userLoading } = useGetUserByIdQuery(
    userInfo?._id,
    { skip: !userInfo?._id }
  );
  
  const { data: anonymousPosts, isLoading: postsLoading } = useGetMyAnonymousPostsQuery({});

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) setGreeting('Good morning');
    else if (hour < 17) setGreeting('Good afternoon');
    else setGreeting('Good evening');
  }, []);

  const stats = [
    { label: 'Anonymous Posts', value: anonymousPosts?.total || 0, icon: Lock, color: '#f4a825', change: '+12%' },
    { label: 'Profile Views', value: userData?.profileViews || 0, icon: Eye, color: '#3b82f6', change: '+5%' },
    { label: 'Skills', value: userData?.skills?.length || 0, icon: Award, color: '#10b981', change: '+2' },
    { label: 'Applications', value: userData?.applications?.length || 0, icon: Briefcase, color: '#ef4444', change: '0' }
  ];

  const recentActivities = [
    { id: 1, type: 'post', message: 'You created an anonymous post', time: '2 hours ago', icon: Lock },
    { id: 2, type: 'view', message: 'Your profile was viewed by 3 people', time: '5 hours ago', icon: Eye },
    { id: 3, type: 'skill', message: 'You added "React Development" to skills', time: '1 day ago', icon: Award },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardSidebar />
      
      <div className="lg:ml-72">
        {/* Modern Header with Stats */}
        <div className="bg-white border-b border-gray-100 sticky top-0 z-30">
          <div className="px-6 lg:px-8 py-6">
            {/* Welcome Row */}
            <div className="flex items-center justify-between mb-6">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  {greeting}, <span className="text-[#f4a825]">{userData?.name?.split(' ')[0] || userInfo?.name?.split(' ')[0] || 'User'}</span>
                </h1>
                <p className="text-gray-500 text-sm mt-1">Here's what's happening with your account today</p>
              </div>
              
              {/* Quick Action Buttons */}
              <div className="hidden md:flex gap-3">
                <Link
                  to="/anonymous"
                  className="flex items-center gap-2 px-4 py-2 bg-[#f4a825] text-white text-sm font-medium rounded-xl hover:bg-[#e09e1a] transition-all shadow-sm"
                >
                  <Lock size={16} />
                  Post Anonymously
                </Link>
              </div>
            </div>

            {/* Stats Row - Horizontal Scroll on Mobile (No scrollbar) */}
            <div className="flex gap-4 overflow-x-auto pb-2 lg:grid lg:grid-cols-4 lg:gap-6 lg:overflow-visible hide-scrollbar">
              {stats.map((stat, idx) => {
                const Icon = stat.icon;
                return (
                  <div key={idx} className="flex-shrink-0 w-64 lg:w-auto bg-gray-50 rounded-2xl p-4 hover:shadow-md transition-all">
                    <div className="flex items-center justify-between mb-3">
                      <div className="w-10 h-10 rounded-xl bg-white shadow-sm flex items-center justify-center">
                        <Icon size={20} style={{ color: stat.color }} />
                      </div>
                      <span className="text-xs font-semibold text-green-600 bg-green-50 px-2 py-1 rounded-full">
                        {stat.change}
                      </span>
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900">{stat.value}</h3>
                    <p className="text-gray-500 text-sm mt-1">{stat.label}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="px-6 lg:px-8 py-6">
          {/* Tab Navigation */}
          <div className="flex gap-6 border-b border-gray-200 mb-6 overflow-x-auto hide-scrollbar">
            {['overview', 'posts', 'activity'].map((tab) => (
              <button
                key={tab}
                onClick={() => setSelectedTab(tab)}
                className={`pb-3 text-sm font-medium transition-colors capitalize whitespace-nowrap ${
                  selectedTab === tab 
                    ? 'text-[#f4a825] border-b-2 border-[#f4a825]' 
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          {selectedTab === 'overview' && (
            <div className="grid lg:grid-cols-3 gap-6">
              {/* Left Column - Posts Feed */}
              <div className="lg:col-span-2 space-y-6">
                {/* Featured Card */}
                <div className="relative overflow-hidden bg-gradient-to-r from-[#1a2538] to-[#1d2b4f] rounded-2xl p-6 text-white">
                  <div className="absolute top-0 right-0 w-40 h-40 bg-[#f4a825]/10 rounded-full blur-2xl" />
                  <div className="relative">
                    <div className="flex items-center gap-2 mb-3">
                      <Sparkles size={20} className="text-[#f4a825]" />
                      <span className="text-xs font-semibold uppercase tracking-wide">Featured</span>
                    </div>
                    <h2 className="text-xl font-bold mb-2">Share your story anonymously</h2>
                    <p className="text-gray-300 text-sm mb-4">Connect with others in a safe space. Your identity stays protected.</p>
                    <Link
                      to="/anonymous"
                      className="inline-flex items-center gap-2 px-4 py-2 bg-[#f4a825] text-[#1a2538] text-sm font-semibold rounded-xl hover:bg-[#e09e1a] transition-all"
                    >
                      <Lock size={16} />
                      Create Anonymous Post
                    </Link>
                  </div>
                </div>

                {/* Recent Posts */}
                <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
                  <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <MessageCircle size={18} className="text-[#f4a825]" />
                      <h3 className="font-semibold text-gray-900">Recent Anonymous Posts</h3>
                    </div>
                    <Link to="/anonymous" className="text-xs text-[#f4a825] hover:underline">
                      View all
                    </Link>
                  </div>
                  
                  <div className="divide-y divide-gray-100">
                    {postsLoading ? (
                      <div className="p-8 text-center">
                        <div className="inline-block animate-spin rounded-full h-6 w-6 border-2 border-gray-300 border-t-[#f4a825]" />
                        <p className="text-gray-500 text-sm mt-3">Loading posts...</p>
                      </div>
                    ) : anonymousPosts?.posts?.length === 0 ? (
                      <div className="p-8 text-center">
                        <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center mx-auto mb-3">
                          <Lock size={20} className="text-gray-400" />
                        </div>
                        <p className="text-gray-500 text-sm">No anonymous posts yet</p>
                        <Link to="/anonymous" className="text-[#f4a825] text-sm mt-2 inline-block">
                          Create your first post →
                        </Link>
                      </div>
                    ) : (
                      anonymousPosts?.posts?.slice(0, 3).map((post: any) => (
                        <div key={post.id} className="p-5 hover:bg-gray-50 transition-colors">
                          <div className="flex items-start gap-3">
                            <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center flex-shrink-0">
                              <Lock size={14} className="text-gray-500" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-gray-800 text-sm leading-relaxed">{post.content}</p>
                              <div className="flex items-center gap-4 mt-2">
                                <span className="text-xs text-gray-400">{new Date(post.createdAt).toLocaleDateString()}</span>
                                <div className="flex items-center gap-3">
                                  <button className="flex items-center gap-1 text-gray-400 hover:text-red-500 transition-colors">
                                    <Heart size={12} />
                                    <span className="text-xs">0</span>
                                  </button>
                                  <button className="flex items-center gap-1 text-gray-400 hover:text-blue-500 transition-colors">
                                    <MessageCircle size={12} />
                                    <span className="text-xs">0</span>
                                  </button>
                                </div>
                              </div>
                            </div>
                            <button className="text-gray-400 hover:text-gray-600">
                              <MoreHorizontal size={16} />
                            </button>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </div>

              {/* Right Column - Simplified */}
              <div className="space-y-6">
                {/* Recent Activity */}
                <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
                  <div className="px-6 py-4 border-b border-gray-100">
                    <div className="flex items-center gap-2">
                      <Activity size={18} className="text-[#f4a825]" />
                      <h3 className="font-semibold text-gray-900">Recent Activity</h3>
                    </div>
                  </div>
                  <div className="divide-y divide-gray-100">
                    {recentActivities.map((activity) => {
                      const Icon = activity.icon;
                      return (
                        <div key={activity.id} className="px-6 py-3 flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center">
                            <Icon size={14} className="text-gray-500" />
                          </div>
                          <div className="flex-1">
                            <p className="text-sm text-gray-800">{activity.message}</p>
                            <p className="text-xs text-gray-400 mt-0.5">{activity.time}</p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Quick Tip */}
                <div className="bg-gradient-to-r from-[#f4a825]/10 to-transparent rounded-2xl p-5 border border-[#f4a825]/20">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-full bg-[#f4a825]/20 flex items-center justify-center">
                      <Zap size={14} className="text-[#f4a825]" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 text-sm">Pro Tip</h4>
                      <p className="text-gray-600 text-xs mt-1">
                        Complete your profile to get discovered by employers looking for your skills.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {selectedTab === 'posts' && (
            <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-100">
                <h3 className="font-semibold text-gray-900">All Anonymous Posts</h3>
              </div>
              <div className="divide-y divide-gray-100">
                {anonymousPosts?.posts?.map((post: any) => (
                  <div key={post.id} className="p-5 hover:bg-gray-50 transition-colors">
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center flex-shrink-0">
                        <Lock size={14} className="text-gray-500" />
                      </div>
                      <div className="flex-1">
                        <p className="text-gray-800">{post.content}</p>
                        <div className="flex items-center gap-4 mt-2">
                          <span className="text-xs text-gray-400">{new Date(post.createdAt).toLocaleDateString()}</span>
                          <span className={`text-xs px-2 py-0.5 rounded-full ${
                            post.status === 'approved' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                          }`}>
                            {post.status || 'Pending'}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {selectedTab === 'activity' && (
            <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-100">
                <h3 className="font-semibold text-gray-900">All Activity</h3>
              </div>
              <div className="divide-y divide-gray-100">
                {recentActivities.map((activity) => {
                  const Icon = activity.icon;
                  return (
                    <div key={activity.id} className="px-6 py-4 flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center">
                        <Icon size={16} className="text-gray-500" />
                      </div>
                      <div className="flex-1">
                        <p className="text-gray-800">{activity.message}</p>
                        <p className="text-xs text-gray-400 mt-0.5">{activity.time}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Hide scrollbar styles */}
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

export default Dashboard;