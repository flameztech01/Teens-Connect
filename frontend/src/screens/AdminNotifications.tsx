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
  ChevronUp
} from 'lucide-react';

const AdminNotifications = () => {
  const { adminInfo } = useSelector((state: any) => state.adminAuth);
  const [page, setPage] = useState(1);
  const [selectedNotification, setSelectedNotification] = useState<any>(null);
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

  // Play sound for new notifications
  useEffect(() => {
    if (unreadData?.unreadCount > previousUnreadCount.current && unreadData?.unreadCount > 0) {
      const audio = new Audio('/notification.mp3');
      audio.play().catch(e => console.log('Audio play failed:', e));
    }
    previousUnreadCount.current = unreadData?.unreadCount || 0;
  }, [unreadData?.unreadCount]);

  const handleMarkAsRead = async (id: string) => {
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

  const handleDelete = async (id: string) => {
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

  const handleViewNotification = (notification: any) => {
    setSelectedNotification(notification);
    setIsDrawerOpen(true);
  };

  const closeDrawer = () => {
    setIsDrawerOpen(false);
    setTimeout(() => setSelectedNotification(null), 300);
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'anonymous_post':
        return <MessageCircle className="w-5 h-5 text-purple-500" />;
      case 'new_user':
        return <UserPlus className="w-5 h-5 text-green-500" />;
      case 'report':
        return <AlertCircle className="w-5 h-5 text-red-500" />;
      case 'success':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'warning':
        return <AlertCircle className="w-5 h-5 text-yellow-500" />;
      case 'opportunity':
        return <TrendingUp className="w-5 h-5 text-blue-500" />;
      default:
        return <Info className="w-5 h-5 text-gray-500" />;
    }
  };

  const getTimeAgo = (date: string) => {
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

  if (!adminInfo) return null;

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminSidebar />
      
      <div className="lg:ml-72">
        {/* Header */}
        <div className="bg-white border-b border-gray-100 sticky top-0 z-30">
          <div className="px-6 lg:px-8 py-6">
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-[#f4a825]/10 flex items-center justify-center">
                  <Bell className="w-6 h-6 text-[#f4a825]" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">Notifications</h1>
                  <p className="text-gray-500 text-sm mt-1">
                    Stay updated with platform activities
                  </p>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                {unreadData?.unreadCount > 0 && (
                  <div className="bg-red-500 text-white px-3 py-1 rounded-full text-xs font-semibold">
                    {unreadData.unreadCount} unread
                  </div>
                )}
                <button
                  onClick={() => refetch()}
                  className="p-2 text-gray-500 hover:text-[#f4a825] transition-colors bg-gray-100 rounded-xl"
                >
                  <RefreshCw size={18} />
                </button>
                <button
                  onClick={handleMarkAllAsRead}
                  disabled={!unreadData?.unreadCount}
                  className="hidden md:flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-xl hover:bg-blue-600 transition-colors disabled:opacity-50 text-sm font-medium"
                >
                  <CheckCheck size={16} />
                  Mark All Read
                </button>
                <button
                  onClick={handleDeleteAll}
                  disabled={!notificationsData?.total}
                  className="hidden md:flex items-center gap-2 px-4 py-2 bg-red-500 text-white rounded-xl hover:bg-red-600 transition-colors disabled:opacity-50 text-sm font-medium"
                >
                  <Trash2 size={16} />
                  Clear All
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="px-6 lg:px-8 py-6">
          {/* Stats Cards - Horizontal Scroll */}
          {notificationsData && (
            <div className="flex gap-4 overflow-x-auto pb-4 mb-6 hide-scrollbar">
              <div className="flex-shrink-0 w-36 bg-white rounded-2xl border border-gray-100 p-4">
                <p className="text-gray-500 text-xs">Total</p>
                <p className="text-2xl font-bold text-gray-900">{notificationsData.total}</p>
              </div>
              <div className="flex-shrink-0 w-36 bg-white rounded-2xl border border-gray-100 p-4">
                <p className="text-gray-500 text-xs">Unread</p>
                <p className="text-2xl font-bold text-orange-600">{notificationsData.unreadCount}</p>
              </div>
              <div className="flex-shrink-0 w-36 bg-white rounded-2xl border border-gray-100 p-4">
                <p className="text-gray-500 text-xs">Read</p>
                <p className="text-2xl font-bold text-green-600">{notificationsData.total - notificationsData.unreadCount}</p>
              </div>
              <div className="flex-shrink-0 w-36 bg-white rounded-2xl border border-gray-100 p-4">
                <p className="text-gray-500 text-xs">Pages</p>
                <p className="text-2xl font-bold text-purple-600">{notificationsData.pages}</p>
              </div>
            </div>
          )}

          {/* Mobile Action Buttons */}
          <div className="flex gap-3 mb-6 md:hidden">
            <button
              onClick={handleMarkAllAsRead}
              disabled={!unreadData?.unreadCount}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-blue-500 text-white rounded-xl hover:bg-blue-600 transition-colors disabled:opacity-50 text-sm font-medium"
            >
              <CheckCheck size={16} />
              Mark All Read
            </button>
            <button
              onClick={handleDeleteAll}
              disabled={!notificationsData?.total}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-red-500 text-white rounded-xl hover:bg-red-600 transition-colors disabled:opacity-50 text-sm font-medium"
            >
              <Trash2 size={16} />
              Clear All
            </button>
          </div>

          {/* Notifications Cards */}
          {isLoading ? (
            <div className="text-center py-12 bg-white rounded-2xl border border-gray-100">
              <Loader className="w-8 h-8 text-[#f4a825] animate-spin mx-auto mb-2" />
              <p className="text-gray-500 text-sm">Loading notifications...</p>
            </div>
          ) : notificationsData?.notifications?.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-2xl border border-gray-100">
              <Inbox className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500">No notifications yet</p>
              <p className="text-sm text-gray-400 mt-1">When you receive notifications, they'll appear here</p>
            </div>
          ) : (
            <div className="space-y-3">
              {notificationsData?.notifications?.map((notification: any) => (
                <div
                  key={notification._id}
                  onClick={() => handleViewNotification(notification)}
                  className={`bg-white rounded-2xl border p-4 active:bg-gray-50 transition-all cursor-pointer ${
                    !notification.isRead ? 'border-[#f4a825] ring-2 ring-[#f4a825]/20' : 'border-gray-100'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0">
                      {getNotificationIcon(notification.type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <h3 className={`text-sm font-semibold ${!notification.isRead ? 'text-gray-900' : 'text-gray-700'}`}>
                          {notification.title}
                        </h3>
                        {!notification.isRead && (
                          <span className="w-2 h-2 bg-[#f4a825] rounded-full"></span>
                        )}
                      </div>
                      <p className="text-sm text-gray-600 line-clamp-2">{notification.message}</p>
                      <div className="flex items-center gap-3 mt-2 text-xs text-gray-400">
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
            <div className="flex justify-between items-center mt-6 pt-4">
              <p className="text-xs text-gray-500">
                Page {notificationsData.page} of {notificationsData.pages}
              </p>
              <div className="flex gap-2">
                <button
                  onClick={() => setPage(p => Math.max(1, p - 1))}
                  disabled={notificationsData.page === 1}
                  className="flex items-center gap-1 px-3 py-1.5 border border-gray-200 rounded-xl text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:border-[#f4a825] hover:text-[#f4a825] transition-all"
                >
                  <ChevronLeft size={14} />
                  Previous
                </button>
                <button
                  onClick={() => setPage(p => Math.min(notificationsData.pages, p + 1))}
                  disabled={notificationsData.page === notificationsData.pages}
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

      {/* Bottom Drawer for Notification Details */}
      {isDrawerOpen && selectedNotification && (
        <>
          <div 
            className="fixed inset-0 bg-black/50 z-50 transition-opacity duration-300"
            onClick={closeDrawer}
          />
          
          <div className="fixed bottom-0 left-0 right-0 z-50 bg-white rounded-t-3xl shadow-2xl transform transition-transform duration-300 animate-slide-up max-h-[85vh] overflow-y-auto">
            <div className="sticky top-0 bg-white pt-4 pb-2 px-6 border-b border-gray-100">
              <div className="flex justify-center mb-3">
                <div className="w-12 h-1 bg-gray-300 rounded-full" />
              </div>
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <Bell size={18} className="text-[#f4a825]" />
                  <h2 className="text-lg font-bold text-gray-900">Notification Details</h2>
                </div>
                <button
                  onClick={closeDrawer}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <X size={24} />
                </button>
              </div>
            </div>

            <div className="p-6 space-y-5">
              {/* Header */}
              <div className="flex items-center gap-3 pb-4 border-b border-gray-100">
                <div className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center">
                  {getNotificationIcon(selectedNotification.type)}
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">{selectedNotification.title}</h3>
                  <p className="text-xs text-gray-400">
                    {new Date(selectedNotification.createdAt).toLocaleString()}
                  </p>
                </div>
              </div>

              {/* Message */}
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase mb-2">Message</label>
                <p className="text-gray-700 text-sm leading-relaxed">{selectedNotification.message}</p>
              </div>

              {/* Type */}
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase mb-2">Type</label>
                <span className="inline-flex items-center gap-1 px-3 py-1.5 bg-gray-100 rounded-xl text-xs font-medium">
                  {selectedNotification.type}
                </span>
              </div>

              {/* Status */}
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase mb-2">Status</label>
                <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium ${
                  selectedNotification.isRead 
                    ? 'bg-green-100 text-green-700' 
                    : 'bg-yellow-100 text-yellow-700'
                }`}>
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
                  <label className="block text-xs font-semibold text-gray-500 uppercase mb-2">Read At</label>
                  <p className="text-sm text-gray-600">{new Date(selectedNotification.readAt).toLocaleString()}</p>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex gap-3 pt-4 border-t border-gray-100">
                {!selectedNotification.isRead && (
                  <button
                    onClick={() => handleMarkAsRead(selectedNotification._id)}
                    className="flex-1 bg-blue-500 text-white py-3 rounded-xl font-semibold hover:bg-blue-600 transition-all flex items-center justify-center gap-2"
                  >
                    <Eye size={16} />
                    Mark as Read
                  </button>
                )}
                <button
                  onClick={() => handleDelete(selectedNotification._id)}
                  className="flex-1 bg-red-500 text-white py-3 rounded-xl font-semibold hover:bg-red-600 transition-all flex items-center justify-center gap-2"
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

export default AdminNotifications;