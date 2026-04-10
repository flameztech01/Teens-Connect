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

const AnonymousAvatar = ({ size = "md" }: { size?: "md" | "lg" }) => {
  const classes =
    size === "lg"
      ? "w-12 h-12 text-base"
      : "w-10 h-10 text-sm";

  return (
    <div
      className={`${classes} rounded-full bg-gradient-to-br from-[#1d2b4f] to-[#0d6b57] flex items-center justify-center shrink-0`}
    >
      <span className="text-white font-bold">A</span>
    </div>
  );
};

const AnonymousHeader = ({
  createdAt,
  sharedToWhatsApp,
}: {
  createdAt: string;
  sharedToWhatsApp?: boolean;
}) => {
  return (
    <div className="flex items-start gap-3">
      <AnonymousAvatar />
      <div className="min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <p className="font-semibold text-gray-900">Anonymous User</p>
          <span className="bg-gray-100 text-gray-500 text-xs px-2 py-0.5 rounded-full">
            Anonymous
          </span>
        </div>

        <div className="flex items-center gap-3 text-xs text-gray-400 mt-0.5 flex-wrap">
          <span className="flex items-center gap-1">
            <Clock size={12} />
            {formatPostDateTime(createdAt)}
          </span>

          {sharedToWhatsApp && (
            <span className="flex items-center gap-1 text-green-600">
              <CheckCircle size={12} />
              Shared
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

const PostBody = ({
  post,
  exportMode = false,
}: {
  post: Post;
  exportMode?: boolean;
}) => {
  return (
    <div className={exportMode ? "p-5" : "p-4"}>
      <p className="text-gray-800 text-base leading-relaxed whitespace-pre-wrap break-words">
        {post.content}
      </p>

      {post.media && (
        <div className="mt-3 rounded-lg overflow-hidden bg-gray-100">
          {post.mediaType === "image" ? (
            <img
              src={post.media}
              alt="Post media"
              className={`w-full ${exportMode ? "max-h-[520px]" : "max-h-80"} object-cover`}
              crossOrigin="anonymous"
              loading="eager"
            />
          ) : (
            <video
              src={post.media}
              controls={!exportMode}
              className={`w-full ${exportMode ? "max-h-[520px]" : "max-h-80"}`}
              preload="metadata"
            />
          )}
        </div>
      )}

      {post.tags && post.tags.length > 0 && (
        <div className="flex flex-wrap gap-2 mt-3">
          {post.tags.map((tag, idx) => (
            <span
              key={`${post.id}-tag-${idx}`}
              className="bg-gray-100 text-gray-600 px-2 py-1 rounded-full text-xs"
            >
              #{tag}
            </span>
          ))}
        </div>
      )}
    </div>
  );
};

const VisiblePostCard = ({
  post,
  generatingImage,
  isDeleting,
  onMarkAsRead,
  onViewPoster,
  onDownload,
  onDelete,
}: {
  post: Post;
  generatingImage: string | null;
  isDeleting: boolean;
  onMarkAsRead: (postId: string) => Promise<void>;
  onViewPoster: (post: Post) => void;
  onDownload: (postId: string) => Promise<void>;
  onDelete: (postId: string) => Promise<void>;
}) => {
  return (
    <div
      className={`bg-white rounded-xl shadow-sm overflow-hidden transition-all ${
        !post.isRead ? "ring-2 ring-[#f4a825] ring-offset-1" : ""
      }`}
    >
      <div className="p-4 pb-3 border-b border-gray-100">
        <div className="flex items-start justify-between gap-4">
          <AnonymousHeader
            createdAt={post.createdAt}
            sharedToWhatsApp={post.sharedToWhatsApp}
          />

          <div className="flex gap-1 shrink-0">
            {!post.isRead && (
              <button
                onClick={() => onMarkAsRead(post.id)}
                className="p-1.5 text-blue-500 hover:bg-blue-50 rounded-lg transition-colors"
                title="Mark as Read"
              >
                <CheckCircle size={16} />
              </button>
            )}

            <button
              onClick={() => onViewPoster(post)}
              className="p-1.5 text-purple-500 hover:bg-purple-50 rounded-lg transition-colors"
              title="View Poster (Requires Code)"
            >
              <Eye size={16} />
            </button>

            {!post.sharedToWhatsApp && (
              <button
                onClick={() => onDownload(post.id)}
                disabled={generatingImage === post.id}
                className="p-1.5 text-green-500 hover:bg-green-50 rounded-lg transition-colors disabled:opacity-50"
                title="Download & Share to WhatsApp"
              >
                {generatingImage === post.id ? (
                  <Loader size={16} className="animate-spin" />
                ) : (
                  <Share2 size={16} />
                )}
              </button>
            )}

            <button
              onClick={() => onDelete(post.id)}
              disabled={isDeleting}
              className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
              title="Delete"
            >
              <Trash2 size={16} />
            </button>
          </div>
        </div>
      </div>

      <PostBody post={post} />

      <div className="px-4 py-3 bg-gray-50 border-t border-gray-100 flex items-center justify-between text-xs text-gray-500">
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1">
            <Eye size={14} />
            {post.viewCount ?? 0} views
          </span>
          <span className="flex items-center gap-1">
            <Share2 size={14} />
            {post.shareCount ?? 0} shares
          </span>
        </div>

        {post.isRead && post.readBy && post.readBy.length > 0 && (
          <span className="text-green-600">
            Read by {post.readBy.length} admin
            {post.readBy.length > 1 ? "s" : ""}
          </span>
        )}
      </div>
    </div>
  );
};

const ExportPostCard = ({ post }: { post: Post }) => {
  return (
    <div className="w-[900px] bg-white rounded-2xl overflow-hidden border border-gray-200 shadow-none">
      <div className="p-5 border-b border-gray-100">
        <AnonymousHeader
          createdAt={post.createdAt}
          sharedToWhatsApp={post.sharedToWhatsApp}
        />
      </div>

      <PostBody post={post} exportMode />

      <div className="px-5 py-4 border-t border-gray-100 flex items-center justify-end">
        <span className="text-[#f4a825] font-semibold text-sm">TeensConnect</span>
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
  const [showPoster, setShowPoster] = useState(false);
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
    skip: !showPoster || !isCodeVerified || !selectedPost?.id,
  });

  const typedPostsData = postsData as PostsData | undefined;
  const typedUnreadCount = unreadCount as UnreadCountData | undefined;
  const typedPosterInfo = posterInfo as PosterInfo | undefined;

  const allPosts = useMemo(() => {
    if (!typedPostsData?.postsByDate) return [];
    return Object.values(typedPostsData.postsByDate).flat();
  }, [typedPostsData]);

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
    setShowPoster(true);
  };

  const handleVerifyCode = async () => {
    if (!secretCode.trim()) {
      setSecretCodeError("Please enter the secret code");
      return;
    }

    const validCode = import.meta.env.VITE_ANONYMOUS_SECRET_CODE || "6922P";

    if (secretCode === validCode) {
      setIsCodeVerified(true);
      setSecretCodeError("");
      await refetchPoster();
      return;
    }

    setSecretCodeError("Invalid secret code");
    setIsCodeVerified(false);
  };

  const downloadPostAsImage = async (postId: string) => {
    const exportNode = document.getElementById(`post-export-${postId}`);
    if (!exportNode) return;

    try {
      setGeneratingImage(postId);

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

  const handleSharePosterToWhatsApp = async (postId: string) => {
    if (!confirm("Share poster information to WhatsApp group?")) return;
    if (!typedPosterInfo) return;

    const message = `📢 *Anonymous Poster Information - TeensConnect*

👤 *Poster Details:*
Name: ${typedPosterInfo.poster.name}
Email: ${typedPosterInfo.poster.email}
Username: ${typedPosterInfo.poster.username}
Phone: ${typedPosterInfo.poster.phone || "Not provided"}
Location: ${typedPosterInfo.poster.location || "Not provided"}

📅 Posted on: ${new Date().toLocaleDateString()}`;

    const encodedMessage = encodeURIComponent(message);
    window.open(`https://wa.me/?text=${encodedMessage}`, "_blank");
  };

  const handleDeletePost = async (postId: string) => {
    const shouldDelete = confirm(
      "Are you sure you want to delete this post? This action cannot be undone.",
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
    <div className="min-h-screen bg-gray-100">
      <AdminSidebar />

      <div className="lg:ml-64 p-4 md:p-6 lg:p-8">
        <div className="mb-6">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-3">
              <div className="bg-[#f4a825] p-2 rounded-xl">
                <MessageCircle className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl md:text-3xl font-bold text-[#1d2b4f]">
                  Anonymous Posts
                </h1>
                <p className="text-sm text-gray-500">
                  Manage anonymous community posts
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {typedUnreadCount && typedUnreadCount.unreadCount > 0 && (
                <div className="bg-red-500 text-white px-3 py-1 rounded-full text-xs font-semibold">
                  {typedUnreadCount.unreadCount} unread
                </div>
              )}

              <button
                onClick={() => refetch()}
                className="p-2 text-gray-500 hover:text-[#f4a825] transition-colors bg-white rounded-lg shadow-sm"
                title="Refresh"
              >
                <RefreshCw size={18} />
              </button>
            </div>
          </div>
        </div>

        {typedPostsData?.stats && (
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-6">
            <div className="bg-white rounded-xl p-3 shadow-sm">
              <p className="text-gray-500 text-xs">Total</p>
              <p className="text-xl font-bold text-[#1d2b4f]">
                {typedPostsData.stats.total}
              </p>
            </div>
            <div className="bg-white rounded-xl p-3 shadow-sm">
              <p className="text-gray-500 text-xs">Read</p>
              <p className="text-xl font-bold text-green-600">
                {typedPostsData.stats.read}
              </p>
            </div>
            <div className="bg-white rounded-xl p-3 shadow-sm">
              <p className="text-gray-500 text-xs">Unread</p>
              <p className="text-xl font-bold text-orange-600">
                {typedPostsData.stats.unread}
              </p>
            </div>
            <div className="bg-white rounded-xl p-3 shadow-sm">
              <p className="text-gray-500 text-xs">Shared</p>
              <p className="text-xl font-bold text-purple-600">
                {typedPostsData.stats.shared}
              </p>
            </div>
            <div className="bg-white rounded-xl p-3 shadow-sm">
              <p className="text-gray-500 text-xs">Not Shared</p>
              <p className="text-xl font-bold text-gray-600">
                {typedPostsData.stats.notShared}
              </p>
            </div>
          </div>
        )}

        <div className="bg-white rounded-xl shadow-sm p-4 mb-6">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="flex-1">
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => {
                  setSelectedDate(e.target.value);
                  setPage(1);
                }}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-[#f4a825] text-sm"
              />
            </div>

            <div className="w-full sm:w-40">
              <select
                value={showRead}
                onChange={(e) => {
                  setShowRead(e.target.value);
                  setPage(1);
                }}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-[#f4a825] text-sm"
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
                className="px-4 py-2 text-sm text-gray-600 hover:text-[#f4a825] transition-colors"
              >
                Clear
              </button>
            )}
          </div>
        </div>

        {isLoading ? (
          <div className="bg-white rounded-xl p-12 text-center">
            <Loader className="w-8 h-8 text-[#f4a825] animate-spin mx-auto mb-2" />
            <p className="text-gray-500">Loading posts...</p>
          </div>
        ) : !typedPostsData?.postsByDate ||
          Object.keys(typedPostsData.postsByDate).length === 0 ? (
          <div className="bg-white rounded-xl p-12 text-center">
            <MessageCircle className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500">No anonymous posts found</p>
          </div>
        ) : (
          <div className="space-y-6">
            {Object.entries(typedPostsData.postsByDate).map(([date, posts]) => (
              <div key={date} className="space-y-4">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-[#f4a825]/20 flex items-center justify-center">
                    <Calendar size={14} className="text-[#f4a825]" />
                  </div>
                  <h2 className="text-sm font-semibold text-gray-600">
                    {formatGroupDate(date)}
                  </h2>
                </div>

                {posts.map((post) => (
                  <VisiblePostCard
                    key={post.id}
                    post={post}
                    generatingImage={generatingImage}
                    isDeleting={isDeleting}
                    onMarkAsRead={handleMarkAsRead}
                    onViewPoster={handleViewPoster}
                    onDownload={downloadPostAsImage}
                    onDelete={handleDeletePost}
                  />
                ))}
              </div>
            ))}
          </div>
        )}

        {typedPostsData && typedPostsData.pages > 1 && (
          <div className="flex justify-center gap-2 mt-6">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={typedPostsData.page === 1}
              className="px-4 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:border-[#f4a825] transition-colors text-sm"
            >
              Previous
            </button>

            <span className="px-4 py-2 text-sm text-gray-600">
              Page {typedPostsData.page} of {typedPostsData.pages}
            </span>

            <button
              onClick={() =>
                setPage((p) => Math.min(typedPostsData.pages, p + 1))
              }
              disabled={typedPostsData.page === typedPostsData.pages}
              className="px-4 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:border-[#f4a825] transition-colors text-sm"
            >
              Next
            </button>
          </div>
        )}

        {showPoster && selectedPost && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl max-w-md w-full">
              <div className="p-6">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-bold text-[#1d2b4f] flex items-center gap-2">
                    <Lock size={20} />
                    View Poster Information
                  </h2>

                  <button
                    onClick={() => {
                      setShowPoster(false);
                      setIsCodeVerified(false);
                      setSecretCode("");
                      setSecretCodeError("");
                    }}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <X size={24} />
                  </button>
                </div>

                {!isCodeVerified ? (
                  <div className="space-y-4">
                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                      <div className="flex items-center gap-2 text-yellow-800 mb-2">
                        <Key size={18} />
                        <p className="font-semibold text-sm">
                          Secret Code Required
                        </p>
                      </div>
                      <p className="text-sm text-yellow-700">
                        Enter the admin secret code to view who posted this
                        anonymously.
                      </p>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Secret Code
                      </label>
                      <input
                        type="password"
                        value={secretCode}
                        onChange={(e) => setSecretCode(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            void handleVerifyCode();
                          }
                        }}
                        placeholder="Enter secret code"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-[#f4a825]"
                        autoFocus
                      />
                      {secretCodeError && (
                        <p className="text-red-500 text-xs mt-1">
                          {secretCodeError}
                        </p>
                      )}
                    </div>

                    <button
                      onClick={() => void handleVerifyCode()}
                      className="w-full bg-[#f4a825] text-white py-2 rounded-lg font-semibold hover:bg-[#e79a13] transition-colors"
                    >
                      Verify & View Poster
                    </button>
                  </div>
                ) : posterLoading ? (
                  <div className="text-center py-8">
                    <Loader className="w-8 h-8 text-[#f4a825] animate-spin mx-auto" />
                    <p className="text-gray-500 mt-2">Loading poster info...</p>
                  </div>
                ) : typedPosterInfo ? (
                  <div className="space-y-4">
                    <div className="flex items-center gap-4 pb-4 border-b">
                      {typedPosterInfo.poster.profile ? (
                        <img
                          src={typedPosterInfo.poster.profile}
                          alt={typedPosterInfo.poster.name}
                          className="w-16 h-16 rounded-full object-cover"
                        />
                      ) : (
                        <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#1d2b4f] to-[#0d6b57] flex items-center justify-center">
                          <span className="text-white font-bold text-xl">
                            {typedPosterInfo.poster.name?.charAt(0).toUpperCase()}
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

                    <div className="space-y-3">
                      <div>
                        <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">
                          Email
                        </label>
                        <p className="text-gray-900 text-sm">
                          {typedPosterInfo.poster.email}
                        </p>
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">
                          Phone
                        </label>
                        <p className="text-gray-900 text-sm">
                          {typedPosterInfo.poster.phone || "Not provided"}
                        </p>
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">
                          Location
                        </label>
                        <p className="text-gray-900 text-sm">
                          {typedPosterInfo.poster.location || "Not provided"}
                        </p>
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">
                          Skills
                        </label>
                        <p className="text-gray-900 text-sm">
                          {typedPosterInfo.poster.skills?.join(", ") ||
                            "Not specified"}
                        </p>
                      </div>
                    </div>

                    <div className="pt-4 border-t">
                      <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">
                        Original Post
                      </label>
                      <p className="text-gray-800 bg-gray-50 p-3 rounded-lg text-sm whitespace-pre-wrap">
                        {typedPosterInfo.post.content}
                      </p>
                    </div>

                    <button
                      onClick={() => void handleSharePosterToWhatsApp(selectedPost.id)}
                      className="w-full bg-green-500 text-white py-2 rounded-lg font-semibold hover:bg-green-600 transition-colors flex items-center justify-center gap-2"
                    >
                      <Share2 size={16} />
                      Share Poster to WhatsApp
                    </button>
                  </div>
                ) : (
                  <p className="text-center text-gray-500 py-8">
                    Failed to load poster information
                  </p>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      <div
        aria-hidden="true"
        className="fixed -left-[99999px] top-0 pointer-events-none opacity-100"
      >
        {allPosts.map((post) => (
          <div key={`export-${post.id}`} id={`post-export-${post.id}`} className="mb-8">
            <ExportPostCard post={post} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminAnonymous;