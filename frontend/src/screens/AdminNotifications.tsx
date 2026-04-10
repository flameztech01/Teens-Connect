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
  EyeOff,
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
  FileText,
  TrendingUp,
  X,
  Inbox
} from 'lucide-react';

const AdminNotifications = () => {
  const { adminInfo } = useSelector((state: any) => state.adminAuth);
  const [page, setPage] = useState(1);
  const [selectedNotification, setSelectedNotification] = useState<any>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
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
      // Play notification sound
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
    } catch (error) {
      console.error('Error deleting all notifications:', error);
    }
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
      
      <div className="lg:ml-64 p-6 lg:p-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-3">
              <div className="bg-[#f4a825] p-2 rounded-xl">
                <Bell className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-[#1d2b4f]">Notifications</h1>
                <p className="text-gray-600">Stay updated with platform activities</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              {unreadData?.unreadCount > 0 && (
                <div className="bg-red-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                  {unreadData.unreadCount} unread
                </div>
              )}
              <button
                onClick={() => refetch()}
                className="p-2 text-gray-500 hover:text-[#f4a825] transition-colors bg-white rounded-lg shadow-sm"
                title="Refresh"
              >
                <RefreshCw size={18} />
              </button>
              <button
                onClick={handleMarkAllAsRead}
                disabled={!unreadData?.unreadCount}
                className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <CheckCheck size={16} />
                Mark All Read
              </button>
              <button
                onClick={handleDeleteAll}
                disabled={!notificationsData?.total}
                className="flex items-center gap-2 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Trash2 size={16} />
                Clear All
              </button>
            </div>
          </div>
        </div>

        {/* Stats Summary */}
        {notificationsData && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-white rounded-xl p-4 shadow-sm">
              <p className="text-gray-500 text-sm">Total</p>
              <p className="text-2xl font-bold text-[#1d2b4f]">{notificationsData.total}</p>
            </div>
            <div className="bg-white rounded-xl p-4 shadow-sm">
              <p className="text-gray-500 text-sm">Unread</p>
              <p className="text-2xl font-bold text-orange-600">{notificationsData.unreadCount}</p>
            </div>
            <div className="bg-white rounded-xl p-4 shadow-sm">
              <p className="text-gray-500 text-sm">Read</p>
              <p className="text-2xl font-bold text-green-600">{notificationsData.total - notificationsData.unreadCount}</p>
            </div>
            <div className="bg-white rounded-xl p-4 shadow-sm">
              <p className="text-gray-500 text-sm">Pages</p>
              <p className="text-2xl font-bold text-purple-600">{notificationsData.pages}</p>
            </div>
          </div>
        )}

        {/* Notifications List */}
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Notifications Column */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
              {isLoading ? (
                <div className="p-12 text-center">
                  <Loader className="w-8 h-8 text-[#f4a825] animate-spin mx-auto mb-2" />
                  <p className="text-gray-500">Loading notifications...</p>
                </div>
              ) : notificationsData?.notifications?.length === 0 ? (
                <div className="p-12 text-center">
                  <Inbox className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                  <p className="text-gray-500">No notifications yet</p>
                  <p className="text-sm text-gray-400 mt-1">When you receive notifications, they'll appear here</p>
                </div>
              ) : (
                <div className="divide-y divide-gray-100">
                  {notificationsData?.notifications?.map((notification: any) => (
                    <div
                      key={notification._id}
                      className={`p-4 hover:bg-gray-50 transition-colors cursor-pointer ${
                        !notification.isRead ? 'bg-blue-50/30' : ''
                      }`}
                      onClick={() => setSelectedNotification(notification)}
                    >
                      <div className="flex items-start gap-3">
                        <div className="flex-shrink-0">
                          {getNotificationIcon(notification.type)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between mb-1">
                            <h3 className={`text-sm font-semibold ${!notification.isRead ? 'text-[#1d2b4f]' : 'text-gray-700'}`}>
                              {notification.title}
                            </h3>
                            {!notification.isRead && (
                              <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                            )}
                          </div>
                          <p className="text-sm text-gray-600 line-clamp-2">{notification.message}</p>
                          <div className="flex items-center gap-3 mt-2 text-xs text-gray-400">
                            <span className="flex items-center gap-1">
                              <Clock size={12} />
                              {getTimeAgo(notification.createdAt)}
                            </span>
                            <span className="flex items-center gap-1">
                              <Calendar size={12} />
                              {new Date(notification.createdAt).toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                        <div className="flex items-center gap-1">
                          {!notification.isRead && (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleMarkAsRead(notification._id);
                              }}
                              className="p-1.5 text-blue-500 hover:bg-blue-100 rounded-lg transition-colors"
                              title="Mark as read"
                            >
                              <Eye size={14} />
                            </button>
                          )}
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDelete(notification._id);
                            }}
                            className="p-1.5 text-red-500 hover:bg-red-100 rounded-lg transition-colors"
                            title="Delete"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Pagination */}
              {notificationsData && notificationsData.pages > 1 && (
                <div className="flex justify-between items-center px-4 py-3 border-t border-gray-100">
                  <p className="text-sm text-gray-500">
                    Page {notificationsData.page} of {notificationsData.pages}
                  </p>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setPage(p => Math.max(1, p - 1))}
                      disabled={notificationsData.page === 1}
                      className="flex items-center gap-1 px-3 py-1.5 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:border-[#f4a825] transition-colors"
                    >
                      <ChevronLeft size={16} />
                      Previous
                    </button>
                    <button
                      onClick={() => setPage(p => Math.min(notificationsData.pages, p + 1))}
                      disabled={notificationsData.page === notificationsData.pages}
                      className="flex items-center gap-1 px-3 py-1.5 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:border-[#f4a825] transition-colors"
                    >
                      Next
                      <ChevronRight size={16} />
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Notification Details Panel */}
          <div className="lg:col-span-1">
            {selectedNotification ? (
              <div className="bg-white rounded-xl shadow-sm p-6 sticky top-6">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-lg font-bold text-[#1d2b4f]">Notification Details</h2>
                  <button
                    onClick={() => setSelectedNotification(null)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <X size={20} />
                  </button>
                </div>
                
                <div className="space-y-4">
                  <div className="flex items-center gap-3 pb-3 border-b">
                    {getNotificationIcon(selectedNotification.type)}
                    <div>
                      <h3 className="font-semibold text-gray-900">{selectedNotification.title}</h3>
                      <p className="text-xs text-gray-500">
                        {new Date(selectedNotification.createdAt).toLocaleString()}
                      </p>
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-xs font-semibold text-gray-500 uppercase mb-2">Message</label>
                    <p className="text-gray-700 text-sm leading-relaxed">{selectedNotification.message}</p>
                  </div>
                  
                  <div>
                    <label className="block text-xs font-semibold text-gray-500 uppercase mb-2">Type</label>
                    <span className="inline-flex items-center gap-1 px-2 py-1 bg-gray-100 rounded-full text-xs">
                      {selectedNotification.type}
                    </span>
                  </div>
                  
                  <div>
                    <label className="block text-xs font-semibold text-gray-500 uppercase mb-2">Status</label>
                    <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs ${
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
                  
                  {selectedNotification.readAt && (
                    <div>
                      <label className="block text-xs font-semibold text-gray-500 uppercase mb-2">Read At</label>
                      <p className="text-sm text-gray-600">{new Date(selectedNotification.readAt).toLocaleString()}</p>
                    </div>
                  )}
                  
                  <div className="flex gap-3 pt-4 border-t">
                    {!selectedNotification.isRead && (
                      <button
                        onClick={() => handleMarkAsRead(selectedNotification._id)}
                        className="flex-1 bg-blue-500 text-white py-2 rounded-lg text-sm font-semibold hover:bg-blue-600 transition-colors flex items-center justify-center gap-2"
                      >
                        <Eye size={14} />
                        Mark as Read
                      </button>
                    )}
                    <button
                      onClick={() => handleDelete(selectedNotification._id)}
                      className="flex-1 bg-red-500 text-white py-2 rounded-lg text-sm font-semibold hover:bg-red-600 transition-colors flex items-center justify-center gap-2"
                    >
                      <Trash2 size={14} />
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-xl shadow-sm p-12 text-center">
                <Bell className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-500">Select a notification</p>
                <p className="text-sm text-gray-400 mt-1">Click on any notification to view details</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminNotifications;