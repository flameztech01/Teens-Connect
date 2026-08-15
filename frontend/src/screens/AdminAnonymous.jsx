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
  ChevronDown,
  FileText,
} from "lucide-react";
import { toBlob, toJpeg } from "html-to-image";

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

const StatCard = ({ label, value, icon: Icon, color = GOLD, subtitle }) => (
  <CardShell glow className="p-4 sm:p-5">
    <div className="flex items-center justify-between">
      <div>
        <p className="text-xs font-medium uppercase tracking-wider" style={{ color: MUTED }}>{label}</p>
        <p className="text-2xl font-bold mt-1" style={{ color: INK }}>{value}</p>
        {subtitle && <p className="text-xs" style={{ color: MUTED }}>{subtitle}</p>}
      </div>
      <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: `${color}15` }}>
        <Icon size={20} style={{ color }} />
      </div>
    </div>
  </CardShell>
);

const formatPostDateTime = (date) =>
  new Date(date).toLocaleString("en-US", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });

const formatGroupDate = (date) =>
  new Date(date).toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });

const getInitials = (name) => {
  if (!name) return "U";
  return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
};

const AnonymousAvatar = () => {
  return (
    <div className="w-10 h-10 rounded-full flex items-center justify-center shrink-0" style={{ background: `linear-gradient(135deg, ${GOLD_DEEP}, ${GOLD})` }}>
      <span className="text-white font-bold text-sm">A</span>
    </div>
  );
};

// Export Card – keep clean with subtle dark background for better sharing? Keep light for clarity.
const ExportPostCard = ({ post }) => {
  return (
    <div className="w-[380px] max-w-full bg-white rounded-2xl overflow-hidden shadow-lg">
      <div className="p-4 border-b border-gray-100">
        <div className="flex items-start gap-3">
          <AnonymousAvatar />
          <div>
            <p className="font-semibold text-gray-900">Anonymous User</p>
            <p className="text-xs text-gray-400 mt-0.5">{formatPostDateTime(post.createdAt)}</p>
          </div>
        </div>
      </div>
      <div className="p-4">
        <p className="text-gray-800 text-sm leading-relaxed whitespace-pre-wrap break-words">
          {post.content}
        </p>
        {post.media && post.mediaType === "image" && (
          <div className="mt-3 rounded-xl overflow-hidden">
            <img src={post.media} alt="Post media" className="w-full h-auto max-h-[300px] object-contain bg-gray-50" />
          </div>
        )}
        {post.tags && post.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-3">
            {post.tags.map((tag, idx) => (
              <span key={idx} className="bg-gray-100 text-gray-600 px-2 py-1 rounded-lg text-xs">#{tag}</span>
            ))}
          </div>
        )}
      </div>
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
  const { userInfo } = useSelector((state) => state.auth);

  const [page, setPage] = useState(1);
  const [selectedDate, setSelectedDate] = useState("");
  const [showRead, setShowRead] = useState("");
  const [selectedPost, setSelectedPost] = useState(null);
  const [showPosterDrawer, setShowPosterDrawer] = useState(false);
  const [secretCode, setSecretCode] = useState("");
  const [secretCodeError, setSecretCodeError] = useState("");
  const [isCodeVerified, setIsCodeVerified] = useState(false);
  const [generatingImage, setGeneratingImage] = useState(null);

  // Custom dropdown state
  const [isFilterOpen, setIsFilterOpen] = useState(false);

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

  // Check if user is admin - redirect or show access denied
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

  // ---------- Handlers ----------
  const handleMarkAsRead = async (postId) => {
    try {
      await markAsRead(postId).unwrap();
      await Promise.all([refetch(), refetchUnread()]);
    } catch (error) {
      console.error("Error marking as read:", error);
    }
  };

  const handleViewPoster = (post) => {
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

  const downloadPostAsImage = async (postId, post) => {
    const exportNode = document.getElementById(`post-export-${postId}`);
    if (!exportNode) return;

    try {
      setGeneratingImage(postId);

      if (!post.isRead) {
        await handleMarkAsRead(postId);
      }

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

  const handleDeletePost = async (postId) => {
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

  // Quick date presets
  const setDatePreset = (daysOffset) => {
    const date = new Date();
    if (daysOffset === 0) {
      // no change
    } else if (daysOffset === -1) {
      date.setDate(date.getDate() - 1);
    } else if (daysOffset === 'thisWeek') {
      const day = date.getDay();
      const diff = date.getDate() - day + (day === 0 ? -6 : 1);
      date.setDate(diff);
    } else if (daysOffset === 'lastWeek') {
      const day = date.getDay();
      const diff = date.getDate() - day + (day === 0 ? -6 : 1) - 7;
      date.setDate(diff);
    } else if (daysOffset === 'lastMonth') {
      date.setMonth(date.getMonth() - 1);
      date.setDate(1);
    } else {
      date.setDate(date.getDate() + daysOffset);
    }
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    setSelectedDate(`${year}-${month}-${day}`);
    setPage(1);
  };

  // Filter dropdown options
  const filterOptions = [
    { value: "", label: "All Posts" },
    { value: "false", label: "Unread Only" },
    { value: "true", label: "Read Only" },
  ];
  const currentFilterLabel = filterOptions.find(opt => opt.value === showRead)?.label || "All Posts";

  // ---------- Render ----------
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
                  <MessageCircle className="w-5 h-5 sm:w-6 sm:h-6" style={{ color: GOLD }} />
                </div>
                <div>
                  <h1 className="text-xl sm:text-2xl font-bold leading-tight" style={{ color: INK }}>Anonymous Posts</h1>
                  <p className="text-xs sm:text-sm" style={{ color: MUTED }}>Manage anonymous community posts</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                {unreadCount && unreadCount.unreadCount > 0 && (
                  <div className="px-2 py-0.5 sm:px-3 sm:py-1 rounded-full text-xs font-semibold" style={{ backgroundColor: RED, color: '#fff' }}>
                    {unreadCount.unreadCount} unread
                  </div>
                )}
                <button
                  onClick={() => refetch()}
                  className="p-2 rounded-xl transition-colors hover:bg-white/5"
                  style={{ color: MUTED }}
                >
                  <RefreshCw size={18} />
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="px-3 sm:px-6 py-4 sm:py-6">
          {/* Stats Cards - Dark Grid */}
          {postsData?.stats && (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 mb-6">
              <StatCard label="Total" value={postsData.stats.total} icon={FileText} color={BLUE} />
              <StatCard label="Read" value={postsData.stats.read} icon={CheckCircle} color={GREEN} />
              <StatCard label="Unread" value={postsData.stats.unread} icon={MessageCircle} color={AMBER} />
              <StatCard label="Shared" value={postsData.stats.shared} icon={Share2} color={PURPLE} />
            </div>
          )}

          {/* Filters – dark card */}
          <CardShell glow className="mb-6">
            {/* Quick Date Presets */}
            <div className="flex flex-wrap gap-2 mb-3">
              {[
                { label: 'Today', value: 0 },
                { label: 'Yesterday', value: -1 },
                { label: 'This Week (Mon)', value: 'thisWeek' },
                { label: 'Last Week (Mon)', value: 'lastWeek' },
                { label: 'Last Month (1st)', value: 'lastMonth' },
              ].map((preset) => {
                const isActive = selectedDate && (
                  preset.value === 0 ? selectedDate === new Date().toISOString().split('T')[0] :
                  preset.value === -1 ? selectedDate === new Date(Date.now() - 86400000).toISOString().split('T')[0] :
                  false
                );
                return (
                  <button
                    key={preset.label}
                    onClick={() => setDatePreset(preset.value)}
                    className={`px-3 py-1.5 text-xs font-medium rounded-full transition-colors ${
                      isActive ? 'text-[#0c0c0d]' : 'hover:bg-white/5'
                    }`}
                    style={{
                      backgroundColor: isActive ? GOLD : 'rgba(255,255,255,0.04)',
                      color: isActive ? '#0c0c0d' : MUTED,
                    }}
                  >
                    {preset.label}
                  </button>
                );
              })}
              {selectedDate && (
                <button
                  onClick={() => { setSelectedDate(""); setPage(1); }}
                  className="px-3 py-1.5 text-xs font-medium rounded-full transition-colors"
                  style={{ backgroundColor: 'rgba(239,68,68,0.12)', color: RED }}
                >
                  Clear Date
                </button>
              )}
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              {/* Date Picker */}
              <div className="flex-1">
                <input
                  type="date"
                  value={selectedDate}
                  onChange={(e) => { setSelectedDate(e.target.value); setPage(1); }}
                  className="w-full px-4 py-2.5 rounded-xl focus:outline-none focus:ring-2 text-sm"
                  style={{
                    backgroundColor: 'rgba(255,255,255,0.04)',
                    color: INK,
                    border: `1px solid ${BORDER}`,
                    focusRing: GOLD,
                  }}
                />
              </div>

              {/* Custom Dropdown for Read Filter */}
              <div className="w-full sm:w-44 relative">
                <button
                  type="button"
                  onClick={() => setIsFilterOpen(!isFilterOpen)}
                  className="w-full flex items-center justify-between px-4 py-2.5 rounded-xl focus:outline-none focus:ring-2 text-sm"
                  style={{
                    backgroundColor: 'rgba(255,255,255,0.04)',
                    color: INK,
                    border: `1px solid ${BORDER}`,
                    focusRing: GOLD,
                  }}
                >
                  <span>{currentFilterLabel}</span>
                  <ChevronDown
                    size={16}
                    className={`transition-transform duration-200 ${isFilterOpen ? "rotate-180" : ""}`}
                    style={{ color: MUTED }}
                  />
                </button>

                {isFilterOpen && (
                  <>
                    <div className="fixed inset-0 z-10" onClick={() => setIsFilterOpen(false)} />
                    <div className="absolute left-0 right-0 top-full mt-1 rounded-xl shadow-lg z-20 overflow-hidden" style={{ backgroundColor: CARD, border: `1px solid ${BORDER}` }}>
                      {filterOptions.map((opt) => (
                        <button
                          key={opt.value}
                          onClick={() => { setShowRead(opt.value); setPage(1); setIsFilterOpen(false); }}
                          className={`w-full px-4 py-2.5 text-sm text-left transition-colors ${
                            showRead === opt.value ? 'font-medium' : ''
                          }`}
                          style={{
                            backgroundColor: showRead === opt.value ? GOLD_TINT : 'transparent',
                            color: showRead === opt.value ? GOLD : MUTED,
                          }}
                        >
                          {opt.label}
                        </button>
                      ))}
                    </div>
                  </>
                )}
              </div>

              {(selectedDate || showRead) && (
                <button
                  onClick={() => { setSelectedDate(""); setShowRead(""); setPage(1); }}
                  className="px-4 py-2.5 text-sm transition-colors hover:opacity-80"
                  style={{ color: MUTED }}
                >
                  Clear All
                </button>
              )}
            </div>
          </CardShell>

          {/* Posts Cards */}
          {isLoading ? (
            <div className="text-center py-12" style={{ backgroundColor: CARD, border: `1px solid ${BORDER}`, borderRadius: '1rem' }}>
              <Loader className="w-8 h-8 animate-spin mx-auto mb-2" style={{ color: GOLD }} />
              <p className="text-sm" style={{ color: MUTED }}>Loading posts...</p>
            </div>
          ) : !postsData?.postsByDate || Object.keys(postsData.postsByDate).length === 0 ? (
            <div className="text-center py-12" style={{ backgroundColor: CARD, border: `1px solid ${BORDER}`, borderRadius: '1rem' }}>
              <MessageCircle className="w-12 h-12 mx-auto mb-3" style={{ color: MUTED }} />
              <p style={{ color: MUTED }}>No anonymous posts found</p>
            </div>
          ) : (
            <div className="space-y-6">
              {Object.entries(postsData.postsByDate).map(([date, posts]) => (
                <div key={date} className="space-y-3">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ backgroundColor: GOLD_TINT }}>
                      <Calendar size={14} style={{ color: GOLD }} />
                    </div>
                    <h2 className="text-sm font-semibold" style={{ color: MUTED }}>
                      {formatGroupDate(date)}
                    </h2>
                  </div>

                  {posts.map((post) => (
                    <div
                      key={post.id}
                      className={`rounded-2xl border overflow-hidden transition-all ${
                        !post.isRead ? 'ring-2' : ''
                      }`}
                      style={{
                        backgroundColor: CARD,
                        borderColor: !post.isRead ? GOLD : BORDER,
                        ringColor: !post.isRead ? `${GOLD}33` : 'transparent',
                      }}
                    >
                      <div className="px-4 py-3 border-b" style={{ borderColor: BORDER }}>
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex items-start gap-3 flex-1">
                            <AnonymousAvatar />
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 flex-wrap">
                                <p className="font-semibold text-sm" style={{ color: INK }}>Anonymous User</p>
                                <span className="text-xs px-2 py-0.5 rounded-full" style={{ backgroundColor: 'rgba(255,255,255,0.04)', color: MUTED }}>
                                  Anonymous
                                </span>
                              </div>
                              <div className="flex items-center gap-3 text-xs mt-0.5 flex-wrap" style={{ color: MUTED }}>
                                <span className="flex items-center gap-1">
                                  <Clock size={10} />
                                  {formatPostDateTime(post.createdAt)}
                                </span>
                                {post.sharedToWhatsApp && (
                                  <span className="flex items-center gap-1" style={{ color: GREEN }}>
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
                                className="p-1.5 rounded-lg transition-colors hover:bg-white/5"
                                style={{ color: BLUE }}
                                title="Mark as Read"
                              >
                                <CheckCircle size={16} />
                              </button>
                            )}
                            <button
                              onClick={() => handleViewPoster(post)}
                              className="p-1.5 rounded-lg transition-colors hover:bg-white/5"
                              style={{ color: PURPLE }}
                              title="View Poster"
                            >
                              <Eye size={16} />
                            </button>
                            {!post.sharedToWhatsApp && (
                              <button
                                onClick={() => downloadPostAsImage(post.id, post)}
                                disabled={generatingImage === post.id}
                                className="p-1.5 rounded-lg transition-colors hover:bg-white/5 disabled:opacity-50"
                                style={{ color: GREEN }}
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
                              className="p-1.5 rounded-lg transition-colors hover:bg-white/5 disabled:opacity-50"
                              style={{ color: RED }}
                              title="Delete"
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </div>
                      </div>

                      <div className="p-4">
                        <p className="text-sm leading-relaxed whitespace-pre-wrap break-words" style={{ color: INK }}>
                          {post.content}
                        </p>

                        {post.media && (
                          <div className="mt-3 rounded-xl overflow-hidden" style={{ backgroundColor: 'rgba(255,255,255,0.04)' }}>
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
                                className="px-2 py-1 rounded-lg text-xs"
                                style={{ backgroundColor: 'rgba(255,255,255,0.04)', color: MUTED }}
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
          {postsData && postsData.pages > 1 && (
            <div className="flex justify-center gap-2 mt-6">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={postsData.page === 1}
                className="px-4 py-2 rounded-xl transition-all text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                style={{
                  border: `1px solid ${BORDER}`,
                  color: MUTED,
                }}
              >
                <ChevronLeft size={16} />
              </button>
              <span className="px-4 py-2 text-sm" style={{ color: MUTED }}>
                Page {postsData.page} of {postsData.pages}
              </span>
              <button
                onClick={() => setPage((p) => Math.min(postsData.pages, p + 1))}
                disabled={postsData.page === postsData.pages}
                className="px-4 py-2 rounded-xl transition-all text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                style={{
                  border: `1px solid ${BORDER}`,
                  color: MUTED,
                }}
              >
                <ChevronRight size={16} />
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Poster Info Bottom Drawer – dark theme */}
      {showPosterDrawer && selectedPost && (
        <>
          <div className="fixed inset-0 bg-black/70 z-50 transition-opacity duration-300" onClick={closePosterDrawer} />
          
          <div className="fixed bottom-0 left-0 right-0 z-50 rounded-t-3xl shadow-2xl transform transition-transform duration-300 animate-slide-up max-h-[85vh] overflow-y-auto" style={{ backgroundColor: CARD, border: `1px solid ${BORDER}` }}>
            <div className="sticky top-0 pt-4 pb-2 px-6 border-b" style={{ backgroundColor: CARD, borderColor: BORDER }}>
              <div className="flex justify-center mb-3">
                <div className="w-12 h-1 rounded-full" style={{ backgroundColor: MUTED }} />
              </div>
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <Lock size={18} style={{ color: GOLD }} />
                  <h2 className="text-lg font-bold" style={{ color: INK }}>Poster Information</h2>
                </div>
                <button onClick={closePosterDrawer} className="transition-colors hover:opacity-80" style={{ color: MUTED }}>
                  <X size={24} />
                </button>
              </div>
            </div>

            <div className="p-6">
              {!isCodeVerified ? (
                <div className="space-y-5">
                  <div className="rounded-xl p-4" style={{ backgroundColor: 'rgba(245,158,11,0.08)', border: `1px solid ${AMBER}33` }}>
                    <div className="flex items-center gap-2 mb-2" style={{ color: AMBER }}>
                      <Key size={16} />
                      <p className="font-semibold text-sm">Secret Code Required</p>
                    </div>
                    <p className="text-sm" style={{ color: MUTED }}>
                      Enter the admin secret code to view who posted this anonymously.
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2" style={{ color: MUTED }}>
                      Secret Code
                    </label>
                    <input
                      type="password"
                      value={secretCode}
                      onChange={(e) => setSecretCode(e.target.value)}
                      onKeyDown={(e) => { if (e.key === "Enter") handleVerifyCode(); }}
                      placeholder="Enter secret code"
                      className="w-full px-4 py-3 rounded-xl focus:outline-none focus:ring-2"
                      style={{
                        backgroundColor: 'rgba(255,255,255,0.04)',
                        color: INK,
                        border: `1px solid ${BORDER}`,
                        focusRing: GOLD,
                      }}
                      autoFocus
                    />
                    {secretCodeError && <p className="text-xs mt-1" style={{ color: RED }}>{secretCodeError}</p>}
                  </div>

                  <button
                    onClick={handleVerifyCode}
                    className="w-full py-3 rounded-xl font-semibold transition-all hover:opacity-90"
                    style={{ backgroundColor: GOLD, color: '#0c0c0d' }}
                  >
                    Verify & View Poster
                  </button>
                </div>
              ) : posterLoading ? (
                <div className="text-center py-12">
                  <Loader className="w-8 h-8 animate-spin mx-auto" style={{ color: GOLD }} />
                  <p className="mt-3" style={{ color: MUTED }}>Loading poster information...</p>
                </div>
              ) : posterInfo ? (
                <div className="space-y-5">
                  <div className="flex items-center gap-4 pb-4 border-b" style={{ borderColor: BORDER }}>
                    {posterInfo.poster.profile ? (
                      <img src={posterInfo.poster.profile} alt={posterInfo.poster.name} className="w-16 h-16 rounded-full object-cover" />
                    ) : (
                      <div className="w-16 h-16 rounded-full flex items-center justify-center" style={{ background: `linear-gradient(135deg, ${GOLD_DEEP}, ${GOLD})` }}>
                        <span className="text-white font-bold text-xl">{getInitials(posterInfo.poster.name)}</span>
                      </div>
                    )}
                    <div>
                      <h3 className="font-bold text-lg" style={{ color: INK }}>{posterInfo.poster.name}</h3>
                      <p className="text-sm" style={{ color: MUTED }}>@{posterInfo.poster.username}</p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-xs font-semibold uppercase mb-1" style={{ color: MUTED }}>Email</label>
                      <div className="flex items-center gap-2">
                        <Mail size={14} style={{ color: MUTED }} />
                        <p className="text-sm" style={{ color: INK }}>{posterInfo.poster.email}</p>
                      </div>
                    </div>

                    {posterInfo.poster.phone && (
                      <div>
                        <label className="block text-xs font-semibold uppercase mb-1" style={{ color: MUTED }}>Phone</label>
                        <div className="flex items-center gap-2">
                          <Phone size={14} style={{ color: MUTED }} />
                          <p className="text-sm" style={{ color: INK }}>{posterInfo.poster.phone}</p>
                        </div>
                      </div>
                    )}

                    {posterInfo.poster.location && (
                      <div>
                        <label className="block text-xs font-semibold uppercase mb-1" style={{ color: MUTED }}>Location</label>
                        <div className="flex items-center gap-2">
                          <MapPin size={14} style={{ color: MUTED }} />
                          <p className="text-sm" style={{ color: INK }}>{posterInfo.poster.location}</p>
                        </div>
                      </div>
                    )}

                    {posterInfo.poster.skills && posterInfo.poster.skills.length > 0 && (
                      <div>
                        <label className="block text-xs font-semibold uppercase mb-1" style={{ color: MUTED }}>Skills</label>
                        <div className="flex flex-wrap gap-2">
                          {posterInfo.poster.skills.slice(0, 5).map((skill, idx) => (
                            <span key={idx} className="px-2 py-1 rounded-lg text-xs" style={{ backgroundColor: 'rgba(255,255,255,0.04)', color: MUTED }}>
                              {skill}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="pt-4 border-t" style={{ borderColor: BORDER }}>
                    <label className="block text-xs font-semibold uppercase mb-2" style={{ color: MUTED }}>Original Post</label>
                    <div className="rounded-xl p-4" style={{ backgroundColor: 'rgba(255,255,255,0.03)' }}>
                      <p className="text-sm whitespace-pre-wrap" style={{ color: INK }}>{posterInfo.post.content}</p>
                    </div>
                  </div>
                </div>
              ) : (
                <p className="text-center py-8" style={{ color: MUTED }}>Failed to load poster information</p>
              )}
            </div>
          </div>
        </>
      )}

      {/* Hidden Export Elements - Mobile Friendly */}
      <div className="fixed -left-[99999px] top-0 pointer-events-none">
        {postsData && Object.values(postsData.postsByDate).flat().map((post) => (
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

export default AdminAnonymous;