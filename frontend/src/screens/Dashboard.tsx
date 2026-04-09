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
  Clock,
  ChevronRight,
  Lock,
  Send,
  Image as ImageIcon,
  TrendingUp,
  Calendar,
  User,
  Activity,
  Star
} from 'lucide-react';

const Dashboard = () => {
  const { userInfo } = useSelector((state: any) => state.auth);
  const [greeting, setGreeting] = useState('');
  
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
    {
      title: 'Anonymous Posts',
      value: anonymousPosts?.total || 0,
      icon: Lock,
      gradient: 'from-purple-600 to-purple-700',
      bgGradient: 'from-purple-50 to-purple-100',
      iconColor: 'text-purple-600',
      link: '/anonymous'
    },
    {
      title: 'Profile Views',
      value: userData?.profileViews || 0,
      icon: Eye,
      gradient: 'from-blue-600 to-blue-700',
      bgGradient: 'from-blue-50 to-blue-100',
      iconColor: 'text-blue-600',
      link: '/profile'
    },
    {
      title: 'Skills',
      value: userData?.skills?.length || 0,
      icon: Award,
      gradient: 'from-emerald-600 to-emerald-700',
      bgGradient: 'from-emerald-50 to-emerald-100',
      iconColor: 'text-emerald-600',
      link: '/profile'
    },
    {
      title: 'Applications',
      value: userData?.applications?.length || 0,
      icon: Briefcase,
      gradient: 'from-orange-600 to-orange-700',
      bgGradient: 'from-orange-50 to-orange-100',
      iconColor: 'text-orange-600',
      link: '/hire'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-gray-50 to-gray-100/50">
      <DashboardSidebar />
      
      <div className="lg:ml-64 p-6 lg:p-8">
        {/* Welcome Section with Brand Colors */}
        <div className="relative overflow-hidden bg-gradient-to-br from-[#1a2538] via-[#1d2b4f] to-[#0d6b57] rounded-2xl shadow-xl mb-8">
          <div className="absolute top-0 right-0 w-64 h-64 bg-[#f4a825]/5 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full blur-2xl"></div>
          
          <div className="relative p-6 lg:p-8">
            <div className="flex items-start justify-between">
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-white/60 text-sm">
                  <Calendar size={14} />
                  <span>{new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
                </div>
                <h1 className="text-2xl lg:text-3xl font-bold text-white">
                  {greeting}, <span className="text-[#f4a825]">{userData?.name?.split(' ')[0] || userInfo?.name?.split(' ')[0] || 'User'}</span>
                </h1>
                <p className="text-white/70 text-sm max-w-md">
                  Welcome back to your dashboard. Track your activity, manage posts, and discover opportunities.
                </p>
                <div className="flex flex-wrap gap-3 pt-3">
                  <Link
                    to="/anonymous"
                    className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#f4a825] text-[#1a2538] text-sm font-semibold rounded-lg hover:bg-[#e09e1a] transition-all hover:shadow-lg transform hover:-translate-y-0.5"
                  >
                    <Lock size={16} />
                    Post Anonymously
                  </Link>
                  <Link
                    to="/hire"
                    className="inline-flex items-center gap-2 px-5 py-2.5 bg-white/10 backdrop-blur-sm text-white text-sm font-semibold rounded-lg hover:bg-white/20 transition-all border border-white/20"
                  >
                    <Briefcase size={16} />
                    Find Opportunities
                  </Link>
                </div>
              </div>
              
              {userData?.profile || userInfo?.profile ? (
                <img
                  src={userData?.profile || userInfo?.profile}
                  alt={userData?.name || userInfo?.name}
                  className="w-16 h-16 lg:w-24 lg:h-24 rounded-full ring-4 ring-[#f4a825]/30 object-cover hidden sm:block shadow-xl"
                />
              ) : (
                <div className="w-16 h-16 lg:w-24 lg:h-24 rounded-full bg-gradient-to-br from-[#f4a825] to-[#e09e1a] flex items-center justify-center hidden sm:block shadow-xl">
                  <span className="text-[#1a2538] font-bold text-3xl">
                    {(userData?.name || userInfo?.name || 'U').charAt(0).toUpperCase()}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Stats Grid with Gradients */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <Link
                key={index}
                to={stat.link}
                className="group relative overflow-hidden bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
              >
                <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${stat.bgGradient} rounded-bl-full opacity-50`}></div>
                <div className="relative p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className={`bg-gradient-to-br ${stat.bgGradient} p-3 rounded-xl`}>
                      <Icon className={`w-5 h-5 ${stat.iconColor}`} />
                    </div>
                    <ChevronRight className="w-4 h-4 text-gray-300 group-hover:text-[#f4a825] group-hover:translate-x-1 transition-all" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900">{stat.value}</h3>
                  <p className="text-gray-500 text-sm mt-1">{stat.title}</p>
                </div>
              </Link>
            );
          })}
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Anonymous Posts Section */}
          <div className="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow overflow-hidden">
            <div className="bg-gradient-to-r from-purple-600 to-purple-700 px-6 py-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="bg-white/20 p-2 rounded-lg">
                    <Lock className="w-5 h-5 text-white" />
                  </div>
                  <h2 className="text-lg font-semibold text-white">Anonymous Posts</h2>
                </div>
                <Link
                  to="/anonymous"
                  className="text-white/80 hover:text-white text-sm font-medium transition-colors"
                >
                  View all →
                </Link>
              </div>
            </div>
            
            <div className="p-6">
              {postsLoading ? (
                <div className="text-center py-8">
                  <div className="inline-block animate-spin rounded-full h-6 w-6 border-2 border-gray-300 border-t-purple-600"></div>
                  <p className="text-gray-500 text-sm mt-3">Loading posts...</p>
                </div>
              ) : anonymousPosts?.posts?.length === 0 ? (
                <div className="text-center py-12">
                  <div className="w-16 h-16 bg-purple-50 rounded-xl flex items-center justify-center mx-auto mb-4">
                    <Lock className="w-8 h-8 text-purple-400" />
                  </div>
                  <p className="text-gray-600 mb-4">No anonymous posts yet</p>
                  <Link
                    to="/anonymous"
                    className="inline-flex items-center gap-2 text-purple-600 hover:text-purple-700 font-medium"
                  >
                    Create your first post →
                  </Link>
                </div>
              ) : (
                <div className="space-y-4">
                  {anonymousPosts?.posts?.slice(0, 3).map((post: any) => (
                    <div key={post.id} className="border-l-4 border-purple-200 pl-4 py-2 hover:border-purple-400 transition-colors">
                      <p className="text-gray-700 text-sm leading-relaxed line-clamp-2">{post.content}</p>
                      <div className="flex items-center gap-4 mt-2">
                        <span className="flex items-center gap-1.5 text-xs text-gray-400">
                          <Clock size={12} />
                          {new Date(post.createdAt).toLocaleDateString()}
                        </span>
                        {post.media && (
                          <span className="flex items-center gap-1.5 text-xs text-gray-400">
                            <ImageIcon size={12} />
                            Media
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                  {anonymousPosts?.total > 3 && (
                    <Link
                      to="/anonymous"
                      className="block text-center text-sm text-purple-600 hover:text-purple-700 font-medium pt-3 transition-colors"
                    >
                      View all {anonymousPosts.total} posts →
                    </Link>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            {/* Profile Overview with Brand Color Header */}
            <div className="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow overflow-hidden">
              <div className="bg-gradient-to-r from-gray-700 to-gray-800 px-6 py-4">
                <div className="flex items-center gap-3">
                  <div className="bg-white/20 p-2 rounded-lg">
                    <User className="w-5 h-5 text-white" />
                  </div>
                  <h2 className="text-lg font-semibold text-white">Profile Overview</h2>
                </div>
              </div>
              
              <div className="p-6">
                <div className="space-y-4">
                  <div className="flex justify-between items-center pb-3 border-b border-gray-100">
                    <span className="text-sm text-gray-500">Full name</span>
                    <span className="text-sm font-semibold text-gray-900">{userData?.name || userInfo?.name}</span>
                  </div>
                  <div className="flex justify-between items-center pb-3 border-b border-gray-100">
                    <span className="text-sm text-gray-500">Email address</span>
                    <span className="text-sm font-medium text-gray-700">{userData?.email || userInfo?.email}</span>
                  </div>
                  <div className="flex justify-between items-center pb-3 border-b border-gray-100">
                    <span className="text-sm text-gray-500">Phone number</span>
                    <span className="text-sm font-medium text-gray-700">{userData?.phone || userInfo?.phone || '—'}</span>
                  </div>
                  <div className="flex justify-between items-center pb-3 border-b border-gray-100">
                    <span className="text-sm text-gray-500">Location</span>
                    <span className="text-sm font-medium text-gray-700">{userData?.location || userInfo?.location || '—'}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-500">Skills</span>
                    <span className="text-sm font-semibold text-[#f4a825]">{userData?.skills?.length || 0} skills listed</span>
                  </div>
                </div>

                <Link
                  to="/profile"
                  className="mt-6 w-full inline-flex justify-center items-center gap-2 px-4 py-2.5 bg-gray-50 text-gray-700 text-sm font-semibold rounded-lg hover:bg-gray-100 transition-colors border border-gray-200"
                >
                  Edit Profile
                </Link>
              </div>
            </div>

            {/* Quick Action Card with Brand Color */}
            <div className="relative overflow-hidden bg-gradient-to-br from-[#f4a825]/10 via-[#f4a825]/5 to-transparent rounded-xl shadow-md p-6 border border-[#f4a825]/20">
              <div className="absolute top-0 right-0 w-32 h-32 bg-[#f4a825]/20 rounded-full blur-2xl"></div>
              <div className="relative flex items-start gap-4">
                <div className="bg-[#f4a825] p-3 rounded-xl shadow-lg">
                  <Send className="w-5 h-5 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-gray-900 mb-1">Share anonymously</h3>
                  <p className="text-gray-600 text-sm mb-4">
                    Have something to share? Post anonymously and connect with the community.
                  </p>
                  <Link
                    to="/anonymous"
                    className="inline-flex items-center gap-2 text-sm font-semibold text-[#f4a825] hover:text-[#e09e1a] transition-colors"
                  >
                    Create post
                    <ChevronRight size={14} />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Activity Section */}
        {anonymousPosts?.posts?.length > 0 && (
          <div className="mt-8 bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow overflow-hidden">
            <div className="bg-gradient-to-r from-gray-700 to-gray-800 px-6 py-4">
              <div className="flex items-center gap-3">
                <div className="bg-white/20 p-2 rounded-lg">
                  <TrendingUp className="w-5 h-5 text-white" />
                </div>
                <h2 className="text-lg font-semibold text-white">Recent activity</h2>
              </div>
            </div>
            <div className="p-6">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b-2 border-gray-100">
                      <th className="text-left text-xs font-semibold text-gray-500 pb-3">Content</th>
                      <th className="text-left text-xs font-semibold text-gray-500 pb-3">Date</th>
                      <th className="text-left text-xs font-semibold text-gray-500 pb-3">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {anonymousPosts.posts.slice(0, 5).map((post: any) => (
                      <tr key={post.id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                        <td className="py-3">
                          <p className="text-sm text-gray-700 line-clamp-1">{post.content}</p>
                        </td>
                        <td className="py-3">
                          <span className="text-xs text-gray-400">{new Date(post.createdAt).toLocaleDateString()}</span>
                        </td>
                        <td className="py-3">
                          <span className={`inline-flex items-center px-2 py-1 rounded-md text-xs font-medium ${
                            post.status === 'approved' 
                              ? 'bg-green-100 text-green-700' 
                              : post.status === 'rejected'
                              ? 'bg-red-100 text-red-700'
                              : 'bg-amber-100 text-amber-700'
                          }`}>
                            {post.status || 'Pending'}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;