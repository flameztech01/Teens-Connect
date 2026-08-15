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
        return { color: 'bg-green-50 text-green-700 border-green-200', icon: CheckCircle, label: 'Approved' };
      case 'rejected':
        return { color: 'bg-red-50 text-red-700 border-red-200', icon: AlertCircle, label: 'Rejected' };
      default:
        return { color: 'bg-yellow-50 text-yellow-700 border-yellow-200', icon: Clock, label: 'Pending' };
    }
  };

  const tabs = [
    { id: 'create', label: 'Create Post', icon: Send },
    { id: 'myposts', label: 'My Posts', icon: FileText },
  ];

  return (
    <div className="min-h-screen bg-[#f0f2f5]">
      <DashboardSidebar />

      <div className="lg:ml-72">
        {/* Header - WhatsApp app bar, tabs embedded */}
        <div className="sticky top-0 z-30 bg-gradient-to-b from-[#c9860f] to-[#f4a825] text-white shadow-sm">
          <div className="flex items-center gap-3 px-4 pt-3 pb-3">
            <div className="w-10 h-10 shrink-0 rounded-full bg-white/15 flex items-center justify-center backdrop-blur-sm">
              <Lock className="w-5 h-5 text-white" />
            </div>
            <div className="min-w-0">
              <h1 className="text-base sm:text-lg font-semibold leading-tight">Anonymous Corner</h1>
              <p className="text-[11px] sm:text-xs text-white/70 truncate">
                Share your thoughts anonymously. Your identity stays hidden.
              </p>
            </div>
          </div>

          {/* Tabs embedded in appbar */}
          <div className="flex px-2">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setSelectedTab(tab.id)}
                  className={`flex-1 sm:flex-none sm:px-6 py-2.5 text-xs sm:text-sm font-semibold tracking-wide uppercase transition-colors relative flex items-center justify-center gap-1.5 ${
                    selectedTab === tab.id ? 'text-white' : 'text-white/55 hover:text-white/80'
                  }`}
                >
                  <Icon size={14} />
                  {tab.label}
                  {selectedTab === tab.id && (
                    <span className="absolute left-0 right-0 -bottom-[1px] h-[3px] bg-white rounded-full mx-2" />
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Success Message */}
        {showSuccess && (
          <div className="bg-green-50 border-b border-green-200 text-green-700 px-4 py-3 flex items-center gap-3">
            <CheckCircle className="w-5 h-5 text-green-500 shrink-0" />
            <span className="text-sm font-medium">Your anonymous post has been submitted! Admin will review it shortly.</span>
          </div>
        )}

        {/* Main Content - wallpaper background */}
        <div
          className="min-h-[calc(100vh-90px)]"
          style={{
            backgroundColor: '#efeae2',
            backgroundImage:
              "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='60' height='60' viewBox='0 0 60 60'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23d9d2c7' fill-opacity='0.35'%3E%3Ccircle cx='30' cy='30' r='1.5'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")",
          }}
        >
          {selectedTab === 'create' && (
            <div className="px-3 sm:px-6 py-4 sm:py-6">
              {/* Compose card */}
              <div className="bg-white rounded-2xl shadow-sm max-w-2xl mx-auto p-4 sm:p-6">
                <form onSubmit={handleSubmit} className="space-y-5">
                  {/* Content Textarea */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Your message
                    </label>
                    <textarea
                      value={content}
                      onChange={(e) => setContent(e.target.value)}
                      placeholder="What's on your mind? Share your thoughts, stories, or questions anonymously..."
                      rows={6}
                      className="w-full px-4 py-3 bg-gray-100 rounded-lg focus:outline-none focus:bg-white focus:ring-2 focus:ring-[#f4a825] resize-none transition-colors"
                    />
                  </div>

                  {/* Media Preview */}
                  {mediaPreview && (
                    <div className="relative rounded-lg overflow-hidden bg-gray-100">
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
                        className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1.5 hover:bg-red-600 transition-colors"
                      >
                        <X size={14} />
                      </button>
                    </div>
                  )}

                  {/* Media Upload */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Attach media <span className="text-gray-400 text-xs">(optional)</span>
                    </label>
                    <div className="grid grid-cols-2 gap-3">
                      <label className="cursor-pointer">
                        <div className="bg-gray-100 rounded-lg p-4 text-center hover:bg-[#f4a825]/5 transition-colors">
                          <ImageIcon className="w-6 h-6 mx-auto mb-2 text-gray-500" />
                          <span className="text-xs text-gray-600">Image</span>
                          <input
                            type="file"
                            accept="image/*"
                            onChange={handleMediaChange}
                            className="hidden"
                          />
                        </div>
                      </label>
                      <label className="cursor-pointer">
                        <div className="bg-gray-100 rounded-lg p-4 text-center hover:bg-[#f4a825]/5 transition-colors">
                          <Video className="w-6 h-6 mx-auto mb-2 text-gray-500" />
                          <span className="text-xs text-gray-600">Video</span>
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
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Tags <span className="text-gray-400 text-xs">(comma separated)</span>
                    </label>
                    <input
                      type="text"
                      value={tags}
                      onChange={(e) => setTags(e.target.value)}
                      placeholder="e.g., mental health, advice, story, question"
                      className="w-full px-4 py-2.5 bg-gray-100 rounded-lg focus:outline-none focus:bg-white focus:ring-2 focus:ring-[#f4a825] transition-colors"
                    />
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={isCreating}
                    className="w-full bg-[#f4a825] text-white py-3 rounded-lg font-semibold hover:bg-[#e09e1a] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {isCreating ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        Submitting...
                      </>
                    ) : (
                      <>
                        <Send size={18} />
                        Post Anonymously
                      </>
                    )}
                  </button>

                  <div className="flex items-center justify-center gap-2 text-xs text-gray-400 pt-2">
                    <Shield size={12} />
                    <span>Your identity is completely protected</span>
                  </div>
                </form>
              </div>

              {/* Info Banner */}
              <div className="max-w-2xl mx-auto mt-4">
                <div className="bg-white rounded-2xl shadow-sm px-4 py-4 flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-[#f4a825]/10 flex items-center justify-center flex-shrink-0">
                    <Sparkles size={14} className="text-[#f4a825]" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 text-sm mb-1">How it works</h3>
                    <p className="text-gray-600 text-xs">
                      Your post will be reviewed by admins before being shared with the community.
                      Your identity stays completely anonymous.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {selectedTab === 'myposts' && (
            <div className="px-0 sm:px-6 py-0 sm:py-4">
              {postsLoading ? (
                <div className="bg-white text-center py-12">
                  <div className="inline-block animate-spin rounded-full h-8 w-8 border-2 border-gray-200 border-t-[#f4a825]" />
                  <p className="text-gray-500 text-sm mt-3">Loading your posts...</p>
                </div>
              ) : myPosts?.posts?.length === 0 ? (
                <div className="bg-white px-4 py-12 text-center">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Lock className="w-8 h-8 text-gray-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-700 mb-2">No anonymous posts yet</h3>
                  <p className="text-gray-500 text-sm mb-4">
                    Your anonymous posts will appear here once you create them.
                  </p>
                  <button
                    onClick={() => setSelectedTab('create')}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-[#f4a825] text-white text-sm font-medium rounded-lg hover:bg-[#e09e1a] transition-all"
                  >
                    <Send size={14} />
                    Create Your First Post
                  </button>
                </div>
              ) : (
                <div className="sm:space-y-3">
                  {myPosts?.posts?.map((post) => {
                    const StatusBadge = getStatusBadge(post.status || 'pending');
                    const StatusIcon = StatusBadge.icon;

                    return (
                      <div
                        key={post.id}
                        className="bg-white sm:rounded-2xl sm:shadow-sm border-b sm:border-b-0 border-gray-100 px-4 py-4 hover:bg-gray-50 sm:hover:bg-white transition-colors"
                      >
                        <div className="flex items-start gap-3">
                          <div className="w-11 h-11 shrink-0 rounded-full bg-gray-100 flex items-center justify-center">
                            <Lock size={16} className="text-gray-500" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between gap-2">
                              <span className="font-semibold text-gray-900 text-[15px]">Anonymous</span>
                              <div className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-medium shrink-0 ${StatusBadge.color}`}>
                                <StatusIcon size={11} />
                                {StatusBadge.label}
                              </div>
                            </div>
                            <div className="text-xs text-gray-400 mt-0.5">
                              {new Date(post.createdAt).toLocaleDateString()} • {new Date(post.createdAt).toLocaleTimeString()}
                            </div>

                            <p className="text-gray-800 text-sm leading-relaxed mt-2 break-words">{post.content}</p>

                            {/* FIXED MEDIA RENDERING – full width */}
                            {post.media && (
                              <div className="mt-2 rounded-lg overflow-hidden bg-gray-100 w-full">
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
                                    className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full"
                                  >
                                    #{tag}
                                  </span>
                                ))}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Anonymous;