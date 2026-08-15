import { useState, useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import AdminSidebar from '../components/AdminSidebar';
import {
  useGetAdminNotificationsQuery,
  useGetAdminUnreadCountQuery,
  useMarkNotificationAsReadMutation,
  useMarkAllAdminNotificationsAsReadMutation,
  useDeleteNotificationMutation,
  useDeleteAllAdminNotificationsMutation,
} from '../slices/notificationApiSlice';
import {
  Bell,
  CheckCheck,
  Trash2,
  Eye,
  Loader,
  RefreshCw,
  ChevronLeft,
  ChevronRight,
  MessageCircle,
  Users,
  AlertCircle,
  CheckCircle,
  Info,
  Clock,
  Calendar,
  UserPlus,
  TrendingUp,
  X,
  Inbox,
  ChevronUp,
  Lock,
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
    className="flex-shrink-0 w-36 rounded-2xl p-4"
    style={{ backgroundColor: CARD, border: `1px solid ${BORDER}` }}
  >
    <p className="text-xs" style={{ color: MUTED }}>{label}</p>
    <p className="text-2xl font-bold" style={{ color: color }}>{value}</p>
  </div>
);

const AdminNotifications = () => {
  const { userInfo } = useSelector((state) => state.auth);
  const [page, setPage] = useState(1);
  const [selectedNotification, setSelectedNotification] = useState(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const previousUnreadCount = useRef(0);

  const { data: notificationsData, isLoading, refetch } = useGetAdminNotificationsQuery({
    page,
    limit: 20,
  });

  const { data: unreadData, refetch: refetchUnread } = useGetAdminUnreadCountQuery();
  const [markAsRead] = useMarkNotificationAsReadMutation();
  const [markAllAsRead] = useMarkAllAdminNotificationsAsReadMutation();
  const [deleteNotification] = useDeleteNotificationMutation();
  const [deleteAllNotifications] = useDeleteAllAdminNotificationsMutation();

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

  // Play sound for new notifications
  useEffect(() => {
    if (unreadData?.unreadCount > previousUnreadCount.current && unreadData?.unreadCount > 0) {
      const audio = new Audio('/notification.mp3');
      audio.play().catch(e => console.log('Audio play failed:', e));
    }
    previousUnreadCount.current = unreadData?.unreadCount || 0;
  }, [unreadData?.unreadCount]);

  const handleMarkAsRead = async (id) => {
    try {
      await markAsRead(id).unwrap();
      refetch();
      refetchUnread();
      if (selectedNotification?._id === id) {
        setSelectedNotification({ ...selectedNotification, isRead: true });
      }
    } catch (error) {
      console.error('Error marking as read:', error);
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await markAllAsRead().unwrap();
      refetch();
      refetchUnread();
    } catch (error) {
      console.error('Error marking all as read:', error);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this notification?')) return;
    try {
      await deleteNotification(id).unwrap();
      refetch();
      refetchUnread();
      if (selectedNotification?._id === id) {
        setSelectedNotification(null);
        setIsDrawerOpen(false);
      }
    } catch (error) {
      console.error('Error deleting notification:', error);
    }
  };

  const handleDeleteAll = async () => {
    if (!confirm('Delete all notifications? This cannot be undone.')) return;
    try {
      await deleteAllNotifications().unwrap();
      refetch();
      refetchUnread();
      setSelectedNotification(null);
      setIsDrawerOpen(false);
    } catch (error) {
      console.error('Error deleting all notifications:', error);
    }
  };

  const handleViewNotification = (notification) => {
    setSelectedNotification(notification);
    setIsDrawerOpen(true);
  };

  const closeDrawer = () => {
    setIsDrawerOpen(false);
    setTimeout(() => setSelectedNotification(null), 300);
  };

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'anonymous_post':
        return <MessageCircle className="w-5 h-5" style={{ color: PURPLE }} />;
      case 'new_user':
        return <UserPlus className="w-5 h-5" style={{ color: GREEN }} />;
      case 'report':
        return <AlertCircle className="w-5 h-5" style={{ color: RED }} />;
      case 'success':
        return <CheckCircle className="w-5 h-5" style={{ color: GREEN }} />;
      case 'warning':
        return <AlertCircle className="w-5 h-5" style={{ color: AMBER }} />;
      case 'opportunity':
        return <TrendingUp className="w-5 h-5" style={{ color: BLUE }} />;
      default:
        return <Info className="w-5 h-5" style={{ color: MUTED }} />;
    }
  };

  const getTimeAgo = (date) => {
    const seconds = Math.floor((new Date().getTime() - new Date(date).getTime()) / 1000);
    
    let interval = seconds / 31536000;
    if (interval > 1) return Math.floor(interval) + ' years ago';
    
    interval = seconds / 2592000;
    if (interval > 1) return Math.floor(interval) + ' months ago';
    
    interval = seconds / 86400;
    if (interval > 1) return Math.floor(interval) + ' days ago';
    
    interval = seconds / 3600;
    if (interval > 1) return Math.floor(interval) + ' hours ago';
    
    interval = seconds / 60;
    if (interval > 1) return Math.floor(interval) + ' minutes ago';
    
    return Math.floor(seconds) + ' seconds ago';
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: BG }}>
      <AdminSidebar />
      
      <div className="lg:ml-72 relative">
        {/* Header – dark theme */}
        <div className="sticky top-0 z-30" style={{ backgroundColor: BG, borderBottom: `1px solid ${BORDER}` }}>
          <div className="px-4 sm:px-6 py-3">
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 sm:w-12 sm:h-12 shrink-0 rounded-xl flex items-center justify-center" style={{ backgroundColor: GOLD_TINT }}>
                  <Bell className="w-5 h-5 sm:w-6 sm:h-6" style={{ color: GOLD }} />
                </div>
                <div>
                  <h1 className="text-xl sm:text-2xl font-bold leading-tight" style={{ color: INK }}>Notifications</h1>
                  <p className="text-xs sm:text-sm" style={{ color: MUTED }}>
                    Stay updated with platform activities
                  </p>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                {unreadData?.unreadCount > 0 && (
                  <div className="px-2 py-0.5 sm:px-3 sm:py-1 rounded-full text-xs font-semibold" style={{ backgroundColor: RED, color: '#fff' }}>
                    {unreadData.unreadCount} unread
                  </div>
                )}
                <button
                  onClick={() => refetch()}
                  className="p-2 rounded-xl transition-colors hover:bg-white/5"
                  style={{ color: MUTED }}
                >
                  <RefreshCw size={18} />
                </button>
                <button
                  onClick={handleMarkAllAsRead}
                  disabled={!unreadData?.unreadCount}
                  className="hidden md:flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-colors hover:opacity-90 disabled:opacity-50"
                  style={{ backgroundColor: BLUE, color: '#fff' }}
                >
                  <CheckCheck size={16} />
                  Mark All Read
                </button>
                <button
                  onClick={handleDeleteAll}
                  disabled={!notificationsData?.total}
                  className="hidden md:flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-colors hover:opacity-90 disabled:opacity-50"
                  style={{ backgroundColor: RED, color: '#fff' }}
                >
                  <Trash2 size={16} />
                  Clear All
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="px-3 sm:px-6 py-4 sm:py-6">
          {/* Stats Cards - Horizontal Scroll */}
          {notificationsData && (
            <div className="flex gap-3 overflow-x-auto pb-4 mb-6 hide-scrollbar">
              <StatCard label="Total" value={notificationsData.total} icon={Bell} color={BLUE} />
              <StatCard label="Unread" value={notificationsData.unreadCount} icon={Clock} color={AMBER} />
              <StatCard label="Read" value={notificationsData.total - notificationsData.unreadCount} icon={CheckCircle} color={GREEN} />
              <StatCard label="Pages" value={notificationsData.pages} icon={Info} color={PURPLE} />
            </div>
          )}

          {/* Mobile Action Buttons */}
          <div className="flex gap-3 mb-6 md:hidden">
            <button
              onClick={handleMarkAllAsRead}
              disabled={!unreadData?.unreadCount}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-colors hover:opacity-90 disabled:opacity-50"
              style={{ backgroundColor: BLUE, color: '#fff' }}
            >
              <CheckCheck size={16} />
              Mark All Read
            </button>
            <button
              onClick={handleDeleteAll}
              disabled={!notificationsData?.total}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-colors hover:opacity-90 disabled:opacity-50"
              style={{ backgroundColor: RED, color: '#fff' }}
            >
              <Trash2 size={16} />
              Clear All
            </button>
          </div>

          {/* Notifications Cards */}
          {isLoading ? (
            <div className="text-center py-12" style={{ backgroundColor: CARD, border: `1px solid ${BORDER}`, borderRadius: '1rem' }}>
              <Loader className="w-8 h-8 animate-spin mx-auto mb-2" style={{ color: GOLD }} />
              <p className="text-sm" style={{ color: MUTED }}>Loading notifications...</p>
            </div>
          ) : notificationsData?.notifications?.length === 0 ? (
            <div className="text-center py-12" style={{ backgroundColor: CARD, border: `1px solid ${BORDER}`, borderRadius: '1rem' }}>
              <Inbox className="w-12 h-12 mx-auto mb-3" style={{ color: MUTED }} />
              <p style={{ color: MUTED }}>No notifications yet</p>
              <p className="text-sm mt-1" style={{ color: MUTED }}>When you receive notifications, they'll appear here</p>
            </div>
          ) : (
            <div className="space-y-3">
              {notificationsData?.notifications?.map((notification) => (
                <div
                  key={notification._id}
                  onClick={() => handleViewNotification(notification)}
                  className={`rounded-2xl border p-4 transition-all cursor-pointer hover:bg-white/5 ${
                    !notification.isRead ? 'ring-2' : ''
                  }`}
                  style={{
                    backgroundColor: CARD,
                    borderColor: !notification.isRead ? GOLD : BORDER,
                    ringColor: !notification.isRead ? `${GOLD}33` : 'transparent',
                  }}
                >
                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0">
                      {getNotificationIcon(notification.type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <h3 className={`text-sm font-semibold ${!notification.isRead ? 'text-white' : 'text-gray-400'}`}>
                          {notification.title}
                        </h3>
                        {!notification.isRead && (
                          <span className="w-2 h-2 rounded-full" style={{ backgroundColor: GOLD }}></span>
                        )}
                      </div>
                      <p className="text-sm line-clamp-2" style={{ color: MUTED }}>{notification.message}</p>
                      <div className="flex items-center gap-3 mt-2 text-xs" style={{ color: MUTED }}>
                        <span className="flex items-center gap-1">
                          <Clock size={10} />
                          {getTimeAgo(notification.createdAt)}
                        </span>
                        <span className="flex items-center gap-1">
                          <Calendar size={10} />
                          {new Date(notification.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Pagination */}
          {notificationsData && notificationsData.pages > 1 && (
            <div className="flex justify-between items-center mt-6 pt-4 border-t" style={{ borderColor: BORDER }}>
              <p className="text-xs" style={{ color: MUTED }}>
                Page {notificationsData.page} of {notificationsData.pages}
              </p>
              <div className="flex gap-2">
                <button
                  onClick={() => setPage(p => Math.max(1, p - 1))}
                  disabled={notificationsData.page === 1}
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
                  onClick={() => setPage(p => Math.min(notificationsData.pages, p + 1))}
                  disabled={notificationsData.page === notificationsData.pages}
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

      {/* Bottom Drawer for Notification Details – dark theme */}
      {isDrawerOpen && selectedNotification && (
        <>
          <div className="fixed inset-0 bg-black/70 z-50 transition-opacity duration-300" onClick={closeDrawer} />
          
          <div className="fixed bottom-0 left-0 right-0 z-50 rounded-t-3xl shadow-2xl transform transition-transform duration-300 animate-slide-up max-h-[85vh] overflow-y-auto" style={{ backgroundColor: CARD, border: `1px solid ${BORDER}` }}>
            <div className="sticky top-0 pt-4 pb-2 px-6 border-b" style={{ backgroundColor: CARD, borderColor: BORDER }}>
              <div className="flex justify-center mb-3">
                <div className="w-12 h-1 rounded-full" style={{ backgroundColor: MUTED }} />
              </div>
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <Bell size={18} style={{ color: GOLD }} />
                  <h2 className="text-lg font-bold" style={{ color: INK }}>Notification Details</h2>
                </div>
                <button onClick={closeDrawer} className="transition-colors hover:opacity-80" style={{ color: MUTED }}>
                  <X size={24} />
                </button>
              </div>
            </div>

            <div className="p-6 space-y-5">
              {/* Header */}
              <div className="flex items-center gap-3 pb-4 border-b" style={{ borderColor: BORDER }}>
                <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: 'rgba(255,255,255,0.04)' }}>
                  {getNotificationIcon(selectedNotification.type)}
                </div>
                <div>
                  <h3 className="font-semibold" style={{ color: INK }}>{selectedNotification.title}</h3>
                  <p className="text-xs" style={{ color: MUTED }}>
                    {new Date(selectedNotification.createdAt).toLocaleString()}
                  </p>
                </div>
              </div>

              {/* Message */}
              <div>
                <label className="block text-xs font-semibold uppercase mb-2" style={{ color: MUTED }}>Message</label>
                <p className="text-sm leading-relaxed" style={{ color: INK }}>{selectedNotification.message}</p>
              </div>

              {/* Type */}
              <div>
                <label className="block text-xs font-semibold uppercase mb-2" style={{ color: MUTED }}>Type</label>
                <span className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-medium" style={{ backgroundColor: 'rgba(255,255,255,0.04)', color: MUTED }}>
                  {selectedNotification.type}
                </span>
              </div>

              {/* Status */}
              <div>
                <label className="block text-xs font-semibold uppercase mb-2" style={{ color: MUTED }}>Status</label>
                <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium ${
                  selectedNotification.isRead 
                    ? 'text-green-400' 
                    : 'text-yellow-400'
                }`} style={{
                  backgroundColor: selectedNotification.isRead ? 'rgba(34,197,94,0.12)' : 'rgba(245,158,11,0.12)',
                }}>
                  {selectedNotification.isRead ? (
                    <>
                      <CheckCircle size={12} />
                      Read
                    </>
                  ) : (
                    <>
                      <Clock size={12} />
                      Unread
                    </>
                  )}
                </span>
              </div>

              {/* Read At */}
              {selectedNotification.readAt && (
                <div>
                  <label className="block text-xs font-semibold uppercase mb-2" style={{ color: MUTED }}>Read At</label>
                  <p className="text-sm" style={{ color: INK }}>{new Date(selectedNotification.readAt).toLocaleString()}</p>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex gap-3 pt-4 border-t" style={{ borderColor: BORDER }}>
                {!selectedNotification.isRead && (
                  <button
                    onClick={() => handleMarkAsRead(selectedNotification._id)}
                    className="flex-1 py-3 rounded-xl font-semibold transition-all hover:opacity-90 flex items-center justify-center gap-2"
                    style={{ backgroundColor: BLUE, color: '#fff' }}
                  >
                    <Eye size={16} />
                    Mark as Read
                  </button>
                )}
                <button
                  onClick={() => handleDelete(selectedNotification._id)}
                  className="flex-1 py-3 rounded-xl font-semibold transition-all hover:opacity-90 flex items-center justify-center gap-2"
                  style={{ backgroundColor: RED, color: '#fff' }}
                >
                  <Trash2 size={16} />
                  Delete
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

export default AdminNotifications;