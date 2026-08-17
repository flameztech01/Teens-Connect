import { useState } from "react";
import { useSelector } from "react-redux";
import DashboardSidebar from "../components/DashbordSidebar";
import {
  useCreateAnonymousPostMutation,
  useGetAllAnonymousPostsQuery,
} from "../slices/anonymousApiSlice";
import {
  Lock,
  Send,
  Image as ImageIcon,
  Video,
  X,
  Clock,
  CheckCircle,
  Share2,
  Loader,
  Calendar,
  Plus,
  FileText,
  Sparkles,
  Shield,
} from "lucide-react";
import { toBlob, toJpeg } from "html-to-image";

// ---- design tokens ----
const BG = "#0c0c0d";
const CARD = "#141416";
const INK = "#ffffff";
const MUTED = "rgba(255,255,255,0.4)";
const BORDER = "rgba(255,255,255,0.06)";
const GOLD = "#f4a825";
const GOLD_DEEP = "#d4911f";
const GOLD_TINT = "rgba(244,168,37,0.12)";
const GOLD_GLOW = "rgba(244,168,37,0.25)";
const GREEN = "#22c55e";
const RED = "#ef4444";
const BLUE = "#3b82f6";
const PURPLE = "#8b5cf6";
const AMBER = "#f59e0b";

// ---- styled components ----
const CardShell = ({ children, className = "", glow = false }) => (
  <div
    className={`rounded-2xl p-4 sm:p-5 transition-all duration-300 ${glow ? "hover:border-gold/30" : ""} ${className}`}
    style={{
      backgroundColor: CARD,
      border: `1px solid ${BORDER}`,
      boxShadow: glow ? `0 0 40px -8px ${GOLD_GLOW}` : "0 4px 24px rgba(0,0,0,0.3)",
    }}
  >
    {children}
  </div>
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

const AnonymousAvatar = () => (
  <div
    className="w-10 h-10 rounded-full flex items-center justify-center shrink-0"
    style={{ background: `linear-gradient(135deg, ${GOLD_DEEP}, ${GOLD})` }}
  >
    <span className="text-white font-bold text-sm">A</span>
  </div>
);

// ---- Export card for sharing ----
const ExportPostCard = ({ post }) => (
  <div className="w-[380px] max-w-full bg-white rounded-2xl overflow-hidden shadow-lg">
    <div className="p-4 border-b border-gray-100">
      <div className="flex items-start gap-3">
        <AnonymousAvatar />
        <div>
          <p className="font-semibold text-gray-900">Anonymous User</p>
          <p className="text-xs text-gray-400 mt-0.5">
            {formatPostDateTime(post.createdAt)}
          </p>
        </div>
      </div>
    </div>
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

const Anonymous = () => {
  const { userInfo } = useSelector((state) => state.auth);
  const [page, setPage] = useState(1);
  const [selectedDate, setSelectedDate] = useState("");
  const [generatingImage, setGeneratingImage] = useState(null);

  // ---- composer modal state ----
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [content, setContent] = useState("");
  const [media, setMedia] = useState(null);
  const [mediaPreview, setMediaPreview] = useState("");
  const [mediaType, setMediaType] = useState(null);
  const [tags, setTags] = useState("");
  const [showSuccess, setShowSuccess] = useState(false);

  // ---- API hooks ----
  const {
    data: postsData,
    isLoading,
    refetch,
  } = useGetAllAnonymousPostsQuery({
    page,
    limit: 10,
    date: selectedDate,
  });

  const [createAnonymousPost, { isLoading: isCreating }] =
    useCreateAnonymousPostMutation();

  // ---- Handlers ----
  const handleMediaChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setMedia(file);
      const previewUrl = URL.createObjectURL(file);
      setMediaPreview(previewUrl);
      if (file.type.startsWith("image/")) {
        setMediaType("image");
      } else if (file.type.startsWith("video/")) {
        setMediaType("video");
      }
    }
  };

  const removeMedia = () => {
    setMedia(null);
    setMediaPreview("");
    setMediaType(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!content.trim() && !media) {
      alert("Please add some content or media");
      return;
    }

    const formData = new FormData();
    formData.append("content", content);
    if (media) formData.append("media", media);
    if (tags) formData.append("tags", tags);

    try {
      await createAnonymousPost(formData).unwrap();
      setContent("");
      setTags("");
      removeMedia();
      setShowSuccess(true);
      refetch();
      setIsModalOpen(false);
      setTimeout(() => setShowSuccess(false), 3000);
    } catch (error) {
      console.error("Error creating post:", error);
      alert(error.data?.message || "Failed to create anonymous post");
    }
  };

  // ---- Share ----
  const downloadPostAsImage = async (postId, post) => {
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

  // ---- date presets ----
  const setDatePreset = (daysOffset) => {
    const date = new Date();
    if (daysOffset === 0) {
      // today
    } else if (daysOffset === -1) {
      date.setDate(date.getDate() - 1);
    } else if (daysOffset === "thisWeek") {
      const day = date.getDay();
      const diff = date.getDate() - day + (day === 0 ? -6 : 1);
      date.setDate(diff);
    } else if (daysOffset === "lastWeek") {
      const day = date.getDay();
      const diff = date.getDate() - day + (day === 0 ? -6 : 1) - 7;
      date.setDate(diff);
    } else if (daysOffset === "lastMonth") {
      date.setMonth(date.getMonth() - 1);
      date.setDate(1);
    } else {
      date.setDate(date.getDate() + daysOffset);
    }
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    setSelectedDate(`${year}-${month}-${day}`);
    setPage(1);
  };

  // ---- Composer form (used inside modal) ----
  const ComposerForm = () => (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div>
        <label className="block text-sm font-medium mb-2" style={{ color: MUTED }}>
          Your message
        </label>
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="What's on your mind? Share your thoughts, stories, or questions anonymously..."
          rows={5}
          className="w-full px-4 py-3 rounded-xl focus:outline-none focus:ring-2 transition-all resize-none"
          style={{
            backgroundColor: "rgba(255,255,255,0.04)",
            color: INK,
            border: `1px solid ${BORDER}`,
            focusRing: GOLD,
          }}
        />
      </div>

      {mediaPreview && (
        <div
          className="relative rounded-xl overflow-hidden"
          style={{ backgroundColor: "rgba(255,255,255,0.04)" }}
        >
          {mediaType === "image" ? (
            <img
              src={mediaPreview}
              alt="Preview"
              className="w-full h-auto object-cover max-h-64"
            />
          ) : (
            <video src={mediaPreview} controls className="w-full h-auto max-h-64" />
          )}
          <button
            type="button"
            onClick={removeMedia}
            className="absolute top-2 right-2 rounded-full p-1.5 transition-colors"
            style={{ backgroundColor: RED, color: "#fff" }}
          >
            <X size={14} />
          </button>
        </div>
      )}

      <div>
        <label className="block text-sm font-medium mb-2" style={{ color: MUTED }}>
          Attach media <span className="text-xs" style={{ color: MUTED }}>(optional)</span>
        </label>
        <div className="grid grid-cols-2 gap-3">
          <label className="cursor-pointer">
            <div
              className="rounded-xl p-4 text-center transition-colors"
              style={{ backgroundColor: "rgba(255,255,255,0.04)", border: `1px solid ${BORDER}` }}
            >
              <ImageIcon className="w-6 h-6 mx-auto mb-2" style={{ color: MUTED }} />
              <span className="text-xs" style={{ color: MUTED }}>
                Image
              </span>
              <input
                type="file"
                accept="image/*"
                onChange={handleMediaChange}
                className="hidden"
              />
            </div>
          </label>
          <label className="cursor-pointer">
            <div
              className="rounded-xl p-4 text-center transition-colors"
              style={{ backgroundColor: "rgba(255,255,255,0.04)", border: `1px solid ${BORDER}` }}
            >
              <Video className="w-6 h-6 mx-auto mb-2" style={{ color: MUTED }} />
              <span className="text-xs" style={{ color: MUTED }}>
                Video
              </span>
              <input
                type="file"
                accept="video/*"
                onChange={handleMediaChange}
                className="hidden"
              />
            </div>
          </label>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium mb-2" style={{ color: MUTED }}>
          Tags <span className="text-xs" style={{ color: MUTED }}>(comma separated)</span>
        </label>
        <input
          type="text"
          value={tags}
          onChange={(e) => setTags(e.target.value)}
          placeholder="e.g., mental health, advice, story"
          className="w-full px-4 py-2.5 rounded-xl focus:outline-none focus:ring-2 transition-all"
          style={{
            backgroundColor: "rgba(255,255,255,0.04)",
            color: INK,
            border: `1px solid ${BORDER}`,
            focusRing: GOLD,
          }}
        />
      </div>

      <div className="flex gap-3">
        <button
          type="submit"
          disabled={isCreating}
          className="flex-1 py-3 rounded-xl font-semibold transition-all flex items-center justify-center gap-2"
          style={{
            backgroundColor: GOLD,
            color: BG,
            opacity: isCreating ? 0.6 : 1,
          }}
        >
          {isCreating ? (
            <>
              <div
                className="w-5 h-5 border-2 border-t-transparent rounded-full animate-spin"
                style={{ borderColor: BG, borderTopColor: "transparent" }}
              />
              Submitting...
            </>
          ) : (
            <>
              <Send size={18} />
              Post Anonymously
            </>
          )}
        </button>
        <button
          type="button"
          onClick={() => setIsModalOpen(false)}
          className="px-4 py-3 rounded-xl transition-colors"
          style={{ color: MUTED, border: `1px solid ${BORDER}` }}
        >
          Cancel
        </button>
      </div>

      <div className="flex items-center justify-center gap-2 text-xs" style={{ color: MUTED }}>
        <Shield size={12} />
        <span>Your identity is completely protected</span>
      </div>
    </form>
  );

  // ---- Render ----
  return (
    <div className="min-h-screen" style={{ backgroundColor: BG }}>
      <DashboardSidebar />

      <div className="lg:ml-72 relative">
        {/* Header */}
        <div
          className="sticky top-0 z-30"
          style={{ backgroundColor: BG, borderBottom: `1px solid ${BORDER}` }}
        >
          <div className="flex items-center justify-between px-4 py-3">
            <div className="flex items-center gap-3">
              <div
                className="w-10 h-10 shrink-0 rounded-xl flex items-center justify-center"
                style={{ backgroundColor: GOLD_TINT }}
              >
                <Lock className="w-5 h-5" style={{ color: GOLD }} />
              </div>
              <div>
                <h1 className="text-lg font-semibold leading-tight" style={{ color: INK }}>
                  Anonymous Corner
                </h1>
                <p className="text-xs" style={{ color: MUTED }}>
                  Share & discover anonymous thoughts
                </p>
              </div>
            </div>
            <button
              onClick={() => setIsModalOpen(true)}
              className="p-2 rounded-xl transition-colors hover:bg-white/5"
              style={{ color: MUTED }}
            >
              <Plus size={20} />
            </button>
          </div>
        </div>

        {/* Success message */}
        {showSuccess && (
          <div
            className="flex items-center gap-3 px-4 py-3"
            style={{ backgroundColor: "rgba(34,197,94,0.08)", borderBottom: `1px solid ${BORDER}` }}
          >
            <CheckCircle className="w-5 h-5 shrink-0" style={{ color: GREEN }} />
            <span className="text-sm font-medium" style={{ color: GREEN }}>
              Your anonymous post has been submitted! Admin will review it shortly.
            </span>
          </div>
        )}

        <div className="px-3 sm:px-6 py-4 sm:py-6">
          {/* ---- Slim composer button ---- */}
          <CardShell glow className="mb-4 p-3 cursor-pointer hover:border-gold/30" onClick={() => setIsModalOpen(true)}>
            <div className="flex items-center gap-3">
              <AnonymousAvatar />
              <span className="text-sm" style={{ color: MUTED }}>
                What's on your mind?
              </span>
              <div className="ml-auto flex items-center gap-2">
                <ImageIcon size={16} style={{ color: MUTED }} />
                <Video size={16} style={{ color: MUTED }} />
              </div>
            </div>
          </CardShell>

          {/* ---- Date filters ---- */}
          <div className="flex flex-wrap gap-2 mb-4">
            {[
              { label: "Today", value: 0 },
              { label: "Yesterday", value: -1 },
              { label: "This Week", value: "thisWeek" },
              { label: "Last Week", value: "lastWeek" },
              { label: "Last Month", value: "lastMonth" },
            ].map((preset) => {
              const isActive =
                selectedDate &&
                (preset.value === 0
                  ? selectedDate === new Date().toISOString().split("T")[0]
                  : preset.value === -1
                  ? selectedDate ===
                    new Date(Date.now() - 86400000).toISOString().split("T")[0]
                  : false);
              return (
                <button
                  key={preset.label}
                  onClick={() => setDatePreset(preset.value)}
                  className={`px-3 py-1.5 text-xs font-medium rounded-full transition-colors ${
                    isActive ? "text-[#0c0c0d]" : "hover:bg-white/5"
                  }`}
                  style={{
                    backgroundColor: isActive ? GOLD : "rgba(255,255,255,0.04)",
                    color: isActive ? "#0c0c0d" : MUTED,
                  }}
                >
                  {preset.label}
                </button>
              );
            })}
            {selectedDate && (
              <button
                onClick={() => {
                  setSelectedDate("");
                  setPage(1);
                }}
                className="px-3 py-1.5 text-xs font-medium rounded-full transition-colors"
                style={{ backgroundColor: "rgba(239,68,68,0.12)", color: RED }}
              >
                Clear
              </button>
            )}
          </div>

          {/* ---- Feed ---- */}
          {isLoading ? (
            <div
              className="text-center py-12"
              style={{
                backgroundColor: CARD,
                border: `1px solid ${BORDER}`,
                borderRadius: "1rem",
              }}
            >
              <Loader className="w-8 h-8 animate-spin mx-auto mb-2" style={{ color: GOLD }} />
              <p className="text-sm" style={{ color: MUTED }}>
                Loading posts...
              </p>
            </div>
          ) : !postsData?.postsByDate ||
            Object.keys(postsData.postsByDate).length === 0 ? (
            <div
              className="text-center py-12"
              style={{
                backgroundColor: CARD,
                border: `1px solid ${BORDER}`,
                borderRadius: "1rem",
              }}
            >
              <MessageCircle className="w-12 h-12 mx-auto mb-3" style={{ color: MUTED }} />
              <p style={{ color: MUTED }}>No anonymous posts found</p>
            </div>
          ) : (
            <div className="space-y-6">
              {Object.entries(postsData.postsByDate).map(([date, posts]) => (
                <div key={date} className="space-y-3">
                  <div className="flex items-center gap-2">
                    <div
                      className="w-8 h-8 rounded-full flex items-center justify-center"
                      style={{ backgroundColor: GOLD_TINT }}
                    >
                      <Calendar size={14} style={{ color: GOLD }} />
                    </div>
                    <h2 className="text-sm font-semibold" style={{ color: MUTED }}>
                      {formatGroupDate(date)}
                    </h2>
                  </div>

                  {posts.map((post) => (
                    <div
                      key={post.id}
                      className="rounded-2xl border overflow-hidden transition-all"
                      style={{
                        backgroundColor: CARD,
                        borderColor: BORDER,
                      }}
                    >
                      <div className="px-4 py-3 border-b" style={{ borderColor: BORDER }}>
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex items-start gap-3 flex-1">
                            <AnonymousAvatar />
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 flex-wrap">
                                <p className="font-semibold text-sm" style={{ color: INK }}>
                                  Anonymous User
                                </p>
                                <span
                                  className="text-xs px-2 py-0.5 rounded-full"
                                  style={{ backgroundColor: "rgba(255,255,255,0.04)", color: MUTED }}
                                >
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

                          {/* Share button only */}
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
                        </div>
                      </div>

                      <div className="p-4">
                        <p
                          className="text-sm leading-relaxed whitespace-pre-wrap break-words"
                          style={{ color: INK }}
                        >
                          {post.content}
                        </p>

                        {post.media && (
                          <div
                            className="mt-3 rounded-xl overflow-hidden"
                            style={{ backgroundColor: "rgba(255,255,255,0.04)" }}
                          >
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
                                style={{ backgroundColor: "rgba(255,255,255,0.04)", color: MUTED }}
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

          {/* ---- Pagination ---- */}
          {postsData && postsData.pages > 1 && (
            <div className="flex justify-center gap-2 mt-6">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={postsData.page === 1}
                className="px-4 py-2 rounded-xl transition-all text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                style={{ border: `1px solid ${BORDER}`, color: MUTED }}
              >
                Previous
              </button>
              <span className="px-4 py-2 text-sm" style={{ color: MUTED }}>
                Page {postsData.page} of {postsData.pages}
              </span>
              <button
                onClick={() => setPage((p) => Math.min(postsData.pages, p + 1))}
                disabled={postsData.page === postsData.pages}
                className="px-4 py-2 rounded-xl transition-all text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                style={{ border: `1px solid ${BORDER}`, color: MUTED }}
              >
                Next
              </button>
            </div>
          )}
        </div>
      </div>

      {/* ---- Modal for composing ---- */}
      {isModalOpen && (
        <>
          <div
            className="fixed inset-0 bg-black/70 z-50 transition-opacity duration-300"
            onClick={() => setIsModalOpen(false)}
          />
          <div
            className="fixed bottom-0 left-0 right-0 z-50 rounded-t-3xl shadow-2xl transform transition-transform duration-300 animate-slide-up max-h-[90vh] overflow-y-auto"
            style={{ backgroundColor: CARD, border: `1px solid ${BORDER}` }}
          >
            <div
              className="sticky top-0 pt-4 pb-2 px-6 border-b"
              style={{ backgroundColor: CARD, borderColor: BORDER }}
            >
              <div className="flex justify-center mb-3">
                <div className="w-12 h-1 rounded-full" style={{ backgroundColor: MUTED }} />
              </div>
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <Lock size={18} style={{ color: GOLD }} />
                  <h2 className="text-lg font-bold" style={{ color: INK }}>
                    Share Anonymously
                  </h2>
                </div>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="transition-colors hover:opacity-80"
                  style={{ color: MUTED }}
                >
                  <X size={24} />
                </button>
              </div>
            </div>
            <div className="p-6">
              <ComposerForm />
            </div>
          </div>
        </>
      )}

      {/* ---- Hidden export elements ---- */}
      <div className="fixed -left-[99999px] top-0 pointer-events-none">
        {postsData &&
          Object.values(postsData.postsByDate)
            .flat()
            .map((post) => (
              <div key={`export-${post.id}`} id={`post-export-${post.id}`}>
                <ExportPostCard post={post} />
              </div>
            ))}
      </div>

      <style>{`
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

export default Anonymous;