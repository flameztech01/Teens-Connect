import { useMemo, useState } from "react";
import { useSelector } from "react-redux";
import AdminSidebar from "../components/AdminSidebar";
import {
  useGetAllAnonymousPostsQuery,
  useGetUnreadCountQuery,
  useMarkAsReadMutation,
  useViewPosterQuery,
  useDeleteAnonymousPostMutation,
} from "../slices/anonymousApiSlice";
import {
  MessageCircle,
  Eye,
  Share2,
  Trash2,
  Calendar,
  Clock,
  CheckCircle,
  Loader,
  X,
  Lock,
  Key,
  RefreshCw,
  Mail,
  Phone,
  MapPin,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { toBlob, toJpeg } from "html-to-image";

interface Post {
  id: string;
  content: string;
  media?: string;
  mediaType?: string;
  tags?: string[];
  isRead: boolean;
  readBy?: Array<{ adminId: string; readAt: string }>;
  sharedToWhatsApp?: boolean;
  viewCount?: number;
  shareCount?: number;
  createdAt: string;
  user: {
    id: string;
    name: string;
    email: string;
    username: string;
    profile?: string;
    phone?: string;
    location?: string;
    skills?: string[];
  };
}

interface PostsData {
  postsByDate: Record<string, Post[]>;
  page: number;
  pages: number;
  total: number;
  stats?: {
    total: number;
    read: number;
    unread: number;
    shared: number;
    notShared: number;
  };
}

interface UnreadCountData {
  unreadCount: number;
}

interface PosterInfo {
  poster: {
    name: string;
    email: string;
    username: string;
    phone?: string;
    profile?: string;
    location?: string;
    skills?: string[];
  };
  post: {
    content: string;
  };
}

type RootState = {
  adminAuth: {
    adminInfo: unknown;
  };
};

const formatPostDateTime = (date: string) =>
  new Date(date).toLocaleString("en-US", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });

const formatGroupDate = (date: string) =>
  new Date(date).toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });

const getInitials = (name: string) => {
  if (!name) return "U";
  return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
};

const AnonymousAvatar = () => {
  return (
    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#1d2b4f] to-[#0d6b57] flex items-center justify-center shrink-0">
      <span className="text-white font-bold text-sm">A</span>
    </div>
  );
};

// Mobile-friendly Export Card Component with Logo
const ExportPostCard = ({ post }: { post: Post }) => {
  return (
    <div className="w-[380px] max-w-full bg-white rounded-2xl overflow-hidden shadow-lg">
      {/* Header */}
      <div className="p-4 border-b border-gray-100">
        <div className="flex items-start gap-3">
          <AnonymousAvatar />
          <div>
            <p className="font-semibold text-gray-900">Anonymous User</p>
            <p className="text-xs text-gray-400 mt-0.5">{formatPostDateTime(post.createdAt)}</p>
          </div>
        </div>
      </div>
      
      {/* Content */}
      <div className="p-4">
        <p className="text-gray-800 text-sm leading-relaxed whitespace-pre-wrap break-words">
          {post.content}
        </p>
        
        {post.media && post.mediaType === "image" && (
          <div className="mt-3 rounded-xl overflow-hidden">
            <img 
              src={post.media} 
              alt="Post media" 
              className="w-full h-auto max-h-[300px] object-contain bg-gray-50"
            />
          </div>
        )}
        
        {post.tags && post.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-3">
            {post.tags.map((tag, idx) => (
              <span key={idx} className="bg-gray-100 text-gray-600 px-2 py-1 rounded-lg text-xs">
                #{tag}
              </span>
            ))}
          </div>
        )}
      </div>
      
      {/* Footer with Logo */}
      <div className="px-4 py-3 border-t border-gray-100 bg-gray-50">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <img src="/logo.png" alt="TeensConnect" className="h-6 w-auto" />
            <span className="text-xs text-gray-500">TeensConnect</span>
          </div>
          <p className="text-[#f4a825] text-xs font-medium">Anonymous Post</p>
        </div>
      </div>
    </div>
  );
};

const AdminAnonymous = () => {
  const { adminInfo } = useSelector((state: RootState) => state.adminAuth);

  const [page, setPage] = useState(1);
  const [selectedDate, setSelectedDate] = useState("");
  const [showRead, setShowRead] = useState("");
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);
  const [showPosterDrawer, setShowPosterDrawer] = useState(false);
  const [secretCode, setSecretCode] = useState("");
  const [secretCodeError, setSecretCodeError] = useState("");
  const [isCodeVerified, setIsCodeVerified] = useState(false);
  const [generatingImage, setGeneratingImage] = useState<string | null>(null);

  const {
    data: postsData,
    isLoading,
    refetch,
  } = useGetAllAnonymousPostsQuery({
    page,
    limit: 10,
    date: selectedDate,
    isRead: showRead,
  });

  const { data: unreadCount, refetch: refetchUnread } =
    useGetUnreadCountQuery(undefined);

  const [markAsRead] = useMarkAsReadMutation();
  const [deleteAnonymousPost, { isLoading: isDeleting }] =
    useDeleteAnonymousPostMutation();

  const {
    data: posterInfo,
    isLoading: posterLoading,
    refetch: refetchPoster,
  } = useViewPosterQuery(selectedPost?.id, {
    skip: !showPosterDrawer || !isCodeVerified || !selectedPost?.id,
  });

  const typedPostsData = postsData as PostsData | undefined;
  const typedUnreadCount = unreadCount as UnreadCountData | undefined;
  const typedPosterInfo = posterInfo as PosterInfo | undefined;

  const handleMarkAsRead = async (postId: string) => {
    try {
      await markAsRead(postId).unwrap();
      await Promise.all([refetch(), refetchUnread()]);
    } catch (error) {
      console.error("Error marking as read:", error);
    }
  };

  const handleViewPoster = (post: Post) => {
    setSelectedPost(post);
    setSecretCode("");
    setSecretCodeError("");
    setIsCodeVerified(false);
    setShowPosterDrawer(true);
  };

  const handleVerifyCode = async () => {
    if (!secretCode.trim()) {
      setSecretCodeError("Please enter the secret code");
      return;
    }

    if (secretCode === "0000") {
      setIsCodeVerified(true);
      setSecretCodeError("");
      await refetchPoster();
      return;
    }

    setSecretCodeError("Invalid secret code");
    setIsCodeVerified(false);
  };

  const closePosterDrawer = () => {
    setShowPosterDrawer(false);
    setIsCodeVerified(false);
    setSecretCode("");
    setSecretCodeError("");
    setSelectedPost(null);
  };

  const downloadPostAsImage = async (postId: string, post: Post) => {
    const exportNode = document.getElementById(`post-export-${postId}`);
    if (!exportNode) return;

    try {
      setGeneratingImage(postId);

      // Mark as read when sharing
      if (!post.isRead) {
        await handleMarkAsRead(postId);
      }

      // Use share if available, otherwise download
      if (navigator.share && navigator.canShare) {
        try {
          const blob = await toBlob(exportNode, {
            cacheBust: true,
            pixelRatio: 2,
            backgroundColor: "#ffffff",
          });

          if (blob) {
            const file = new File([blob], `anonymous-post-${postId}.jpg`, {
              type: "image/jpeg",
            });

            if (navigator.canShare({ files: [file] })) {
              await navigator.share({
                files: [file],
                title: "Anonymous Post",
              });
              setGeneratingImage(null);
              return;
            }
          }
        } catch (shareError) {
          console.log("Share cancelled or failed, falling back to download");
        }
      }

      // Fallback to download
      const dataUrl = await toJpeg(exportNode, {
        cacheBust: true,
        pixelRatio: 2,
        quality: 0.95,
        backgroundColor: "#ffffff",
      });

      const link = document.createElement("a");
      link.download = `anonymous-post-${postId}.jpg`;
      link.href = dataUrl;
      link.click();

      // Open WhatsApp after download
      setTimeout(() => {
        window.open("https://wa.me", "_blank");
      }, 500);
    } catch (error) {
      console.error("Error generating image:", error);
      alert("Failed to generate image");
    } finally {
      setGeneratingImage(null);
    }
  };

  const handleDeletePost = async (postId: string) => {
    const shouldDelete = confirm(
      "Are you sure you want to delete this post? This action cannot be undone."
    );
    if (!shouldDelete) return;

    try {
      await deleteAnonymousPost(postId).unwrap();
      await refetch();
      alert("Post deleted successfully");
    } catch (error) {
      console.error("Error deleting post:", error);
      alert("Failed to delete post");
    }
  };

  if (!adminInfo) return null;

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminSidebar />
      
      <div className="lg:ml-72">
        {/* Header */}
        <div className="bg-white border-b border-gray-100 sticky top-0 z-30">
          <div className="px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div className="flex items-center gap-3 sm:gap-4">
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-[#f4a825]/10 flex items-center justify-center">
                  <MessageCircle className="w-5 h-5 sm:w-6 sm:h-6 text-[#f4a825]" />
                </div>
                <div>
                  <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Anonymous Posts</h1>
                  <p className="text-xs sm:text-sm text-gray-500 mt-0.5 sm:mt-1">
                    Manage anonymous community posts
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                {typedUnreadCount && typedUnreadCount.unreadCount > 0 && (
                  <div className="bg-red-500 text-white px-2 py-0.5 sm:px-3 sm:py-1 rounded-full text-xs font-semibold">
                    {typedUnreadCount.unreadCount} unread
                  </div>
                )}
                <button
                  onClick={() => refetch()}
                  className="p-2 text-gray-500 hover:text-[#f4a825] transition-colors bg-gray-100 rounded-xl"
                >
                  <RefreshCw size={18} />
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
          {/* Stats Cards - Horizontal Scroll */}
          {typedPostsData?.stats && (
            <div className="flex gap-3 overflow-x-auto pb-4 mb-6 hide-scrollbar">
              <div className="flex-shrink-0 w-[100px] sm:w-36 bg-white rounded-2xl border border-gray-100 p-3 sm:p-4">
                <p className="text-gray-500 text-xs">Total</p>
                <p className="text-xl sm:text-2xl font-bold text-gray-900">{typedPostsData.stats.total}</p>
              </div>
              <div className="flex-shrink-0 w-[100px] sm:w-36 bg-white rounded-2xl border border-gray-100 p-3 sm:p-4">
                <p className="text-gray-500 text-xs">Read</p>
                <p className="text-xl sm:text-2xl font-bold text-green-600">{typedPostsData.stats.read}</p>
              </div>
              <div className="flex-shrink-0 w-[100px] sm:w-36 bg-white rounded-2xl border border-gray-100 p-3 sm:p-4">
                <p className="text-gray-500 text-xs">Unread</p>
                <p className="text-xl sm:text-2xl font-bold text-orange-600">{typedPostsData.stats.unread}</p>
              </div>
              <div className="flex-shrink-0 w-[100px] sm:w-36 bg-white rounded-2xl border border-gray-100 p-3 sm:p-4">
                <p className="text-gray-500 text-xs">Shared</p>
                <p className="text-xl sm:text-2xl font-bold text-purple-600">{typedPostsData.stats.shared}</p>
              </div>
            </div>
          )}

          {/* Filters */}
          <div className="bg-white rounded-2xl border border-gray-100 p-4 mb-6">
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="flex-1">
                <input
                  type="date"
                  value={selectedDate}
                  onChange={(e) => {
                    setSelectedDate(e.target.value);
                    setPage(1);
                  }}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:border-[#f4a825] focus:ring-2 focus:ring-[#f4a825]/20 text-sm"
                />
              </div>
              <div className="w-full sm:w-40">
                <select
                  value={showRead}
                  onChange={(e) => {
                    setShowRead(e.target.value);
                    setPage(1);
                  }}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:border-[#f4a825] text-sm"
                >
                  <option value="">All Posts</option>
                  <option value="false">Unread Only</option>
                  <option value="true">Read Only</option>
                </select>
              </div>
              {(selectedDate || showRead) && (
                <button
                  onClick={() => {
                    setSelectedDate("");
                    setShowRead("");
                    setPage(1);
                  }}
                  className="px-4 py-2.5 text-sm text-gray-500 hover:text-[#f4a825] transition-colors"
                >
                  Clear
                </button>
              )}
            </div>
          </div>

          {/* Posts Cards */}
          {isLoading ? (
            <div className="text-center py-12 bg-white rounded-2xl border border-gray-100">
              <Loader className="w-8 h-8 text-[#f4a825] animate-spin mx-auto mb-2" />
              <p className="text-gray-500 text-sm">Loading posts...</p>
            </div>
          ) : !typedPostsData?.postsByDate || Object.keys(typedPostsData.postsByDate).length === 0 ? (
            <div className="text-center py-12 bg-white rounded-2xl border border-gray-100">
              <MessageCircle className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500">No anonymous posts found</p>
            </div>
          ) : (
            <div className="space-y-6">
              {Object.entries(typedPostsData.postsByDate).map(([date, posts]) => (
                <div key={date} className="space-y-3">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-[#f4a825]/10 flex items-center justify-center">
                      <Calendar size={14} className="text-[#f4a825]" />
                    </div>
                    <h2 className="text-sm font-semibold text-gray-600">
                      {formatGroupDate(date)}
                    </h2>
                  </div>

                  {posts.map((post) => (
                    <div
                      key={post.id}
                      className={`bg-white rounded-2xl border overflow-hidden transition-all ${
                        !post.isRead ? "border-[#f4a825] ring-2 ring-[#f4a825]/20" : "border-gray-100"
                      }`}
                    >
                      <div className="px-4 py-3 border-b border-gray-100">
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex items-start gap-3 flex-1">
                            <AnonymousAvatar />
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 flex-wrap">
                                <p className="font-semibold text-gray-900 text-sm">Anonymous User</p>
                                <span className="bg-gray-100 text-gray-500 text-xs px-2 py-0.5 rounded-full">
                                  Anonymous
                                </span>
                              </div>
                              <div className="flex items-center gap-3 text-xs text-gray-400 mt-0.5 flex-wrap">
                                <span className="flex items-center gap-1">
                                  <Clock size={10} />
                                  {formatPostDateTime(post.createdAt)}
                                </span>
                                {post.sharedToWhatsApp && (
                                  <span className="flex items-center gap-1 text-green-600">
                                    <CheckCircle size={10} />
                                    Shared
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>

                          <div className="flex gap-1 shrink-0">
                            {!post.isRead && (
                              <button
                                onClick={() => handleMarkAsRead(post.id)}
                                className="p-1.5 text-blue-500 hover:bg-blue-50 rounded-lg transition-colors"
                                title="Mark as Read"
                              >
                                <CheckCircle size={16} />
                              </button>
                            )}
                            <button
                              onClick={() => handleViewPoster(post)}
                              className="p-1.5 text-purple-500 hover:bg-purple-50 rounded-lg transition-colors"
                              title="View Poster"
                            >
                              <Eye size={16} />
                            </button>
                            {!post.sharedToWhatsApp && (
                              <button
                                onClick={() => downloadPostAsImage(post.id, post)}
                                disabled={generatingImage === post.id}
                                className="p-1.5 text-green-500 hover:bg-green-50 rounded-lg transition-colors disabled:opacity-50"
                                title="Share to WhatsApp"
                              >
                                {generatingImage === post.id ? (
                                  <Loader size={16} className="animate-spin" />
                                ) : (
                                  <Share2 size={16} />
                                )}
                              </button>
                            )}
                            <button
                              onClick={() => handleDeletePost(post.id)}
                              disabled={isDeleting}
                              className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
                              title="Delete"
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </div>
                      </div>

                      <div className="p-4">
                        <p className="text-gray-800 text-sm leading-relaxed whitespace-pre-wrap break-words">
                          {post.content}
                        </p>

                        {post.media && (
                          <div className="mt-3 rounded-xl overflow-hidden bg-gray-100">
                            {post.mediaType === "image" ? (
                              <img
                                src={post.media}
                                alt="Post media"
                                className="w-full max-h-64 object-contain"
                                crossOrigin="anonymous"
                              />
                            ) : (
                              <video
                                src={post.media}
                                controls
                                className="w-full max-h-64"
                                preload="metadata"
                              />
                            )}
                          </div>
                        )}

                        {post.tags && post.tags.length > 0 && (
                          <div className="flex flex-wrap gap-2 mt-3">
                            {post.tags.map((tag, idx) => (
                              <span
                                key={idx}
                                className="bg-gray-100 text-gray-600 px-2 py-1 rounded-lg text-xs"
                              >
                                #{tag}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          )}

          {/* Pagination */}
          {typedPostsData && typedPostsData.pages > 1 && (
            <div className="flex justify-center gap-2 mt-6">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={typedPostsData.page === 1}
                className="px-4 py-2 border border-gray-200 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed hover:border-[#f4a825] hover:text-[#f4a825] transition-all text-sm"
              >
                <ChevronLeft size={16} />
              </button>
              <span className="px-4 py-2 text-sm text-gray-600">
                Page {typedPostsData.page} of {typedPostsData.pages}
              </span>
              <button
                onClick={() => setPage((p) => Math.min(typedPostsData.pages, p + 1))}
                disabled={typedPostsData.page === typedPostsData.pages}
                className="px-4 py-2 border border-gray-200 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed hover:border-[#f4a825] hover:text-[#f4a825] transition-all text-sm"
              >
                <ChevronRight size={16} />
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Poster Info Bottom Drawer */}
      {showPosterDrawer && selectedPost && (
        <>
          <div 
            className="fixed inset-0 bg-black/50 z-50 transition-opacity duration-300"
            onClick={closePosterDrawer}
          />
          
          <div className="fixed bottom-0 left-0 right-0 z-50 bg-white rounded-t-3xl shadow-2xl transform transition-transform duration-300 animate-slide-up max-h-[85vh] overflow-y-auto">
            <div className="sticky top-0 bg-white pt-4 pb-2 px-6 border-b border-gray-100">
              <div className="flex justify-center mb-3">
                <div className="w-12 h-1 bg-gray-300 rounded-full" />
              </div>
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <Lock size={18} className="text-[#f4a825]" />
                  <h2 className="text-lg font-bold text-gray-900">Poster Information</h2>
                </div>
                <button
                  onClick={closePosterDrawer}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <X size={24} />
                </button>
              </div>
            </div>

            <div className="p-6">
              {!isCodeVerified ? (
                <div className="space-y-5">
                  <div className="bg-yellow-50 rounded-xl p-4 border border-yellow-200">
                    <div className="flex items-center gap-2 text-yellow-800 mb-2">
                      <Key size={16} />
                      <p className="font-semibold text-sm">Secret Code Required</p>
                    </div>
                    <p className="text-sm text-yellow-700">
                      Enter the admin secret code to view who posted this anonymously.
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Secret Code
                    </label>
                    <input
                      type="password"
                      value={secretCode}
                      onChange={(e) => setSecretCode(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          handleVerifyCode();
                        }
                      }}
                      placeholder="Enter secret code"
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-[#f4a825] focus:ring-2 focus:ring-[#f4a825]/20"
                      autoFocus
                    />
                    {secretCodeError && (
                      <p className="text-red-500 text-xs mt-1">{secretCodeError}</p>
                    )}
                  </div>

                  <button
                    onClick={handleVerifyCode}
                    className="w-full bg-[#f4a825] text-white py-3 rounded-xl font-semibold hover:bg-[#e09e1a] transition-all"
                  >
                    Verify & View Poster
                  </button>
                </div>
              ) : posterLoading ? (
                <div className="text-center py-12">
                  <Loader className="w-8 h-8 text-[#f4a825] animate-spin mx-auto" />
                  <p className="text-gray-500 mt-3">Loading poster information...</p>
                </div>
              ) : typedPosterInfo ? (
                <div className="space-y-5">
                  <div className="flex items-center gap-4 pb-4 border-b border-gray-100">
                    {typedPosterInfo.poster.profile ? (
                      <img
                        src={typedPosterInfo.poster.profile}
                        alt={typedPosterInfo.poster.name}
                        className="w-16 h-16 rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#f4a825] to-[#e09e1a] flex items-center justify-center">
                        <span className="text-white font-bold text-xl">
                          {getInitials(typedPosterInfo.poster.name)}
                        </span>
                      </div>
                    )}
                    <div>
                      <h3 className="font-bold text-lg text-gray-900">
                        {typedPosterInfo.poster.name}
                      </h3>
                      <p className="text-gray-500 text-sm">
                        @{typedPosterInfo.poster.username}
                      </p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">
                        Email
                      </label>
                      <div className="flex items-center gap-2">
                        <Mail size={14} className="text-gray-400" />
                        <p className="text-gray-900 text-sm">{typedPosterInfo.poster.email}</p>
                      </div>
                    </div>

                    {typedPosterInfo.poster.phone && (
                      <div>
                        <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">
                          Phone
                        </label>
                        <div className="flex items-center gap-2">
                          <Phone size={14} className="text-gray-400" />
                          <p className="text-gray-900 text-sm">{typedPosterInfo.poster.phone}</p>
                        </div>
                      </div>
                    )}

                    {typedPosterInfo.poster.location && (
                      <div>
                        <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">
                          Location
                        </label>
                        <div className="flex items-center gap-2">
                          <MapPin size={14} className="text-gray-400" />
                          <p className="text-gray-900 text-sm">{typedPosterInfo.poster.location}</p>
                        </div>
                      </div>
                    )}

                    {typedPosterInfo.poster.skills && typedPosterInfo.poster.skills.length > 0 && (
                      <div>
                        <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">
                          Skills
                        </label>
                        <div className="flex flex-wrap gap-2">
                          {typedPosterInfo.poster.skills.slice(0, 5).map((skill, idx) => (
                            <span key={idx} className="bg-gray-100 text-gray-700 px-2 py-1 rounded-lg text-xs">
                              {skill}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="pt-4 border-t border-gray-100">
                    <label className="block text-xs font-semibold text-gray-500 uppercase mb-2">
                      Original Post
                    </label>
                    <div className="bg-gray-50 rounded-xl p-4">
                      <p className="text-gray-800 text-sm whitespace-pre-wrap">
                        {typedPosterInfo.post.content}
                      </p>
                    </div>
                  </div>
                </div>
              ) : (
                <p className="text-center text-gray-500 py-8">
                  Failed to load poster information
                </p>
              )}
            </div>
          </div>
        </>
      )}

      {/* Hidden Export Elements - Mobile Friendly */}
      <div className="fixed -left-[99999px] top-0 pointer-events-none">
        {typedPostsData && Object.values(typedPostsData.postsByDate).flat().map((post) => (
          <div key={`export-${post.id}`} id={`post-export-${post.id}`}>
            <ExportPostCard post={post} />
          </div>
        ))}
      </div>

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

export default AdminAnonymous;