import { useState } from 'react';
import { useSelector } from 'react-redux';
import DashboardSidebar from '../components/DashbordSidebar';
import {
  useCreateAnonymousPostMutation,
  useGetMyAnonymousPostsQuery
} from '../slices/anonymousApiSlice';
import {
  Lock,
  Send,
  Image as ImageIcon,
  Video,
  X,
  Clock,
  CheckCircle,
  FileText,
  Sparkles,
  AlertCircle,
  Shield,
} from 'lucide-react';

// ---- design tokens (same as dashboard) ----
const BG = '#0c0c0d';
const CARD = '#141416';
const CARD_HOVER = '#1c1c1f';
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

const Anonymous = () => {
  const { userInfo } = useSelector((state) => state.auth);
  const [content, setContent] = useState('');
  const [media, setMedia] = useState(null);
  const [mediaPreview, setMediaPreview] = useState('');
  const [mediaType, setMediaType] = useState(null);
  const [tags, setTags] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);
  const [selectedTab, setSelectedTab] = useState('create');

  const [createAnonymousPost, { isLoading: isCreating }] = useCreateAnonymousPostMutation();
  const { data: myPosts, isLoading: postsLoading, refetch } = useGetMyAnonymousPostsQuery({});

  const handleMediaChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setMedia(file);
      const previewUrl = URL.createObjectURL(file);
      setMediaPreview(previewUrl);
      
      if (file.type.startsWith('image/')) {
        setMediaType('image');
      } else if (file.type.startsWith('video/')) {
        setMediaType('video');
      }
    }
  };

  const removeMedia = () => {
    setMedia(null);
    setMediaPreview('');
    setMediaType(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!content.trim() && !media) {
      alert('Please add some content or media');
      return;
    }

    const formData = new FormData();
    formData.append('content', content);
    if (media) {
      formData.append('media', media);
    }
    if (tags) {
      formData.append('tags', tags);
    }

    try {
      await createAnonymousPost(formData).unwrap();
      setContent('');
      setTags('');
      removeMedia();
      setShowSuccess(true);
      refetch();
      
      setTimeout(() => {
        setShowSuccess(false);
      }, 3000);
    } catch (error) {
      console.error('Error creating post:', error);
      alert(error.data?.message || 'Failed to create anonymous post');
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'approved':
        return { color: 'rgba(34,197,94,0.12)', text: GREEN, icon: CheckCircle, label: 'Approved' };
      case 'rejected':
        return { color: 'rgba(239,68,68,0.12)', text: RED, icon: AlertCircle, label: 'Rejected' };
      default:
        return { color: 'rgba(244,168,37,0.12)', text: GOLD, icon: Clock, label: 'Pending' };
    }
  };

  const tabs = [
    { id: 'create', label: 'Create Post', icon: Send },
    { id: 'myposts', label: 'My Posts', icon: FileText },
  ];

  return (
    <div className="min-h-screen" style={{ backgroundColor: BG }}>
      <DashboardSidebar />

      <div className="lg:ml-72 relative">
        {/* Header - Dark theme with gold accent */}
        <div className="sticky top-0 z-30" style={{ backgroundColor: BG, borderBottom: `1px solid ${BORDER}` }}>
          <div className="flex items-center gap-3 px-4 pt-3 pb-3">
            <div className="w-10 h-10 shrink-0 rounded-xl flex items-center justify-center" style={{ backgroundColor: GOLD_TINT }}>
              <Lock className="w-5 h-5" style={{ color: GOLD }} />
            </div>
            <div className="min-w-0">
              <h1 className="text-base sm:text-lg font-semibold leading-tight" style={{ color: INK }}>Anonymous Corner</h1>
              <p className="text-[11px] sm:text-xs" style={{ color: MUTED }}>
                Share your thoughts anonymously. Your identity stays hidden.
              </p>
            </div>
          </div>

          {/* Tabs embedded in header */}
          <div className="flex px-3 pb-2">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = selectedTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setSelectedTab(tab.id)}
                  className={`flex-1 sm:flex-none sm:px-6 py-2 text-xs sm:text-sm font-medium transition-all relative flex items-center justify-center gap-1.5`}
                  style={{
                    color: isActive ? GOLD : MUTED,
                  }}
                >
                  <Icon size={14} />
                  {tab.label}
                  {isActive && (
                    <span className="absolute left-0 right-0 -bottom-[1px] h-[2px] rounded-full" style={{ backgroundColor: GOLD }} />
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Success Message */}
        {showSuccess && (
          <div className="flex items-center gap-3 px-4 py-3" style={{ backgroundColor: 'rgba(34,197,94,0.08)', borderBottom: `1px solid ${BORDER}` }}>
            <CheckCircle className="w-5 h-5 shrink-0" style={{ color: GREEN }} />
            <span className="text-sm font-medium" style={{ color: GREEN }}>Your anonymous post has been submitted! Admin will review it shortly.</span>
          </div>
        )}

        {/* Main Content */}
        <div className="px-3 sm:px-6 py-4 sm:py-6">
          {selectedTab === 'create' && (
            <div className="max-w-2xl mx-auto space-y-4">
              {/* Compose card */}
              <CardShell glow>
                <form onSubmit={handleSubmit} className="space-y-5">
                  {/* Content Textarea */}
                  <div>
                    <label className="block text-sm font-medium mb-2" style={{ color: MUTED }}>
                      Your message
                    </label>
                    <textarea
                      value={content}
                      onChange={(e) => setContent(e.target.value)}
                      placeholder="What's on your mind? Share your thoughts, stories, or questions anonymously..."
                      rows={6}
                      className="w-full px-4 py-3 rounded-xl focus:outline-none focus:ring-2 transition-all resize-none"
                      style={{
                        backgroundColor: 'rgba(255,255,255,0.04)',
                        color: INK,
                        border: `1px solid ${BORDER}`,
                        focusRing: GOLD,
                      }}
                    />
                  </div>

                  {/* Media Preview */}
                  {mediaPreview && (
                    <div className="relative rounded-xl overflow-hidden" style={{ backgroundColor: 'rgba(255,255,255,0.04)' }}>
                      {mediaType === 'image' ? (
                        <img
                          src={mediaPreview}
                          alt="Preview"
                          className="w-full h-auto object-cover max-h-64"
                        />
                      ) : (
                        <video
                          src={mediaPreview}
                          controls
                          className="w-full h-auto max-h-64"
                        />
                      )}
                      <button
                        type="button"
                        onClick={removeMedia}
                        className="absolute top-2 right-2 rounded-full p-1.5 transition-colors"
                        style={{ backgroundColor: RED, color: '#fff' }}
                      >
                        <X size={14} />
                      </button>
                    </div>
                  )}

                  {/* Media Upload */}
                  <div>
                    <label className="block text-sm font-medium mb-2" style={{ color: MUTED }}>
                      Attach media <span className="text-xs" style={{ color: MUTED }}>(optional)</span>
                    </label>
                    <div className="grid grid-cols-2 gap-3">
                      <label className="cursor-pointer">
                        <div
                          className="rounded-xl p-4 text-center transition-colors"
                          style={{ backgroundColor: 'rgba(255,255,255,0.04)', border: `1px solid ${BORDER}` }}
                        >
                          <ImageIcon className="w-6 h-6 mx-auto mb-2" style={{ color: MUTED }} />
                          <span className="text-xs" style={{ color: MUTED }}>Image</span>
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
                          style={{ backgroundColor: 'rgba(255,255,255,0.04)', border: `1px solid ${BORDER}` }}
                        >
                          <Video className="w-6 h-6 mx-auto mb-2" style={{ color: MUTED }} />
                          <span className="text-xs" style={{ color: MUTED }}>Video</span>
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

                  {/* Tags Input */}
                  <div>
                    <label className="block text-sm font-medium mb-2" style={{ color: MUTED }}>
                      Tags <span className="text-xs" style={{ color: MUTED }}>(comma separated)</span>
                    </label>
                    <input
                      type="text"
                      value={tags}
                      onChange={(e) => setTags(e.target.value)}
                      placeholder="e.g., mental health, advice, story, question"
                      className="w-full px-4 py-2.5 rounded-xl focus:outline-none focus:ring-2 transition-all"
                      style={{
                        backgroundColor: 'rgba(255,255,255,0.04)',
                        color: INK,
                        border: `1px solid ${BORDER}`,
                        focusRing: GOLD,
                      }}
                    />
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={isCreating}
                    className="w-full py-3 rounded-xl font-semibold transition-all flex items-center justify-center gap-2"
                    style={{
                      backgroundColor: GOLD,
                      color: BG,
                      opacity: isCreating ? 0.6 : 1,
                    }}
                  >
                    {isCreating ? (
                      <>
                        <div className="w-5 h-5 border-2 border-t-transparent rounded-full animate-spin" style={{ borderColor: BG, borderTopColor: 'transparent' }} />
                        Submitting...
                      </>
                    ) : (
                      <>
                        <Send size={18} />
                        Post Anonymously
                      </>
                    )}
                  </button>

                  <div className="flex items-center justify-center gap-2 text-xs" style={{ color: MUTED }}>
                    <Shield size={12} />
                    <span>Your identity is completely protected</span>
                  </div>
                </form>
              </CardShell>

              {/* Info Banner */}
              <CardShell>
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0" style={{ backgroundColor: GOLD_TINT }}>
                    <Sparkles size={14} style={{ color: GOLD }} />
                  </div>
                  <div>
                    <h3 className="font-semibold text-sm mb-1" style={{ color: INK }}>How it works</h3>
                    <p className="text-xs" style={{ color: MUTED }}>
                      Your post will be reviewed by admins before being shared with the community.
                      Your identity stays completely anonymous.
                    </p>
                  </div>
                </div>
              </CardShell>
            </div>
          )}

          {selectedTab === 'myposts' && (
            <div className="max-w-2xl mx-auto space-y-3">
              {postsLoading ? (
                <div className="text-center py-12">
                  <div className="inline-block animate-spin rounded-full h-8 w-8 border-3" style={{ borderColor: BORDER, borderTopColor: GOLD }} />
                  <p className="text-sm mt-3" style={{ color: MUTED }}>Loading your posts...</p>
                </div>
              ) : myPosts?.posts?.length === 0 ? (
                <CardShell>
                  <div className="text-center py-8">
                    <div className="w-16 h-16 mx-auto rounded-2xl flex items-center justify-center mb-4" style={{ backgroundColor: 'rgba(255,255,255,0.04)' }}>
                      <Lock className="w-8 h-8" style={{ color: MUTED }} />
                    </div>
                    <h3 className="text-lg font-semibold mb-2" style={{ color: INK }}>No anonymous posts yet</h3>
                    <p className="text-sm mb-4" style={{ color: MUTED }}>
                      Your anonymous posts will appear here once you create them.
                    </p>
                    <button
                      onClick={() => setSelectedTab('create')}
                      className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                      style={{ backgroundColor: GOLD, color: BG }}
                    >
                      <Send size={14} />
                      Create Your First Post
                    </button>
                  </div>
                </CardShell>
              ) : (
                myPosts?.posts?.map((post) => {
                  const status = getStatusBadge(post.status || 'pending');
                  const StatusIcon = status.icon;

                  return (
                    <CardShell key={post.id} glow className="p-3 sm:p-4">
                      <div className="flex items-start gap-3">
                        <div className="w-10 h-10 shrink-0 rounded-xl flex items-center justify-center" style={{ backgroundColor: 'rgba(255,255,255,0.04)' }}>
                          <Lock size={16} style={{ color: MUTED }} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between gap-2">
                            <span className="font-semibold text-[15px]" style={{ color: INK }}>Anonymous</span>
                            <div
                              className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-medium shrink-0"
                              style={{ backgroundColor: status.color, color: status.text }}
                            >
                              <StatusIcon size={11} />
                              {status.label}
                            </div>
                          </div>
                          <div className="text-xs mt-0.5" style={{ color: MUTED }}>
                            {new Date(post.createdAt).toLocaleDateString()} • {new Date(post.createdAt).toLocaleTimeString()}
                          </div>

                          <p className="text-sm leading-relaxed mt-2 break-words" style={{ color: INK }}>{post.content}</p>

                          {post.media && (
                            <div className="mt-2 rounded-xl overflow-hidden" style={{ backgroundColor: 'rgba(255,255,255,0.04)' }}>
                              {post.mediaType === 'image' ? (
                                <img
                                  src={post.media}
                                  alt="Post media"
                                  className="w-full h-auto object-cover max-h-64"
                                />
                              ) : (
                                <video
                                  src={post.media}
                                  controls
                                  className="w-full h-auto max-h-64"
                                />
                              )}
                            </div>
                          )}

                          {post.tags && post.tags.length > 0 && (
                            <div className="flex flex-wrap gap-2 mt-2">
                              {post.tags.map((tag, idx) => (
                                <span
                                  key={idx}
                                  className="text-xs px-2 py-1 rounded-full"
                                  style={{ backgroundColor: 'rgba(255,255,255,0.04)', color: MUTED }}
                                >
                                  #{tag}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    </CardShell>
                  );
                })
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Anonymous;