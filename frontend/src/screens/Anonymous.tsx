import { useState } from 'react';
import { useSelector } from 'react-redux';
import DashboardSidebar from "../components/DashbordSidebar"
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
  Eye,
  CheckCircle,
  FileText,
  Sparkles,
  AlertCircle,
  Shield,
  MessageCircle,
  Heart,
  MoreHorizontal
} from 'lucide-react';

const Anonymous = () => {
  const { userInfo } = useSelector((state: any) => state.auth);
  const [content, setContent] = useState('');
  const [media, setMedia] = useState<File | null>(null);
  const [mediaPreview, setMediaPreview] = useState<string>('');
  const [mediaType, setMediaType] = useState<'image' | 'video' | null>(null);
  const [tags, setTags] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);
  const [selectedTab, setSelectedTab] = useState('create');

  const [createAnonymousPost, { isLoading: isCreating }] = useCreateAnonymousPostMutation();
  const { data: myPosts, isLoading: postsLoading, refetch } = useGetMyAnonymousPostsQuery({});

  const handleMediaChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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

  const handleSubmit = async (e: React.FormEvent) => {
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
    } catch (error: any) {
      console.error('Error creating post:', error);
      alert(error.data?.message || 'Failed to create anonymous post');
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'approved':
        return { color: 'bg-green-100 text-green-700', icon: CheckCircle, label: 'Approved' };
      case 'rejected':
        return { color: 'bg-red-100 text-red-700', icon: AlertCircle, label: 'Rejected' };
      default:
        return { color: 'bg-yellow-100 text-yellow-700', icon: Clock, label: 'Pending' };
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardSidebar />
      
      <div className="lg:ml-72">
        {/* Header */}
        <div className="bg-white border-b border-gray-100 sticky top-0 z-30">
          <div className="px-6 lg:px-8 py-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-[#f4a825]/10 flex items-center justify-center">
                <Lock className="w-6 h-6 text-[#f4a825]" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Anonymous Corner</h1>
                <p className="text-gray-500 text-sm mt-1">
                  Share your thoughts anonymously. Your identity remains completely hidden.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="px-6 lg:px-8 py-6">
          {/* Success Message */}
          {showSuccess && (
            <div className="mb-6 bg-green-50 border-l-4 border-green-500 text-green-700 px-4 py-3 rounded-xl flex items-center gap-3">
              <CheckCircle className="w-5 h-5 text-green-500" />
              <span className="text-sm font-medium">Your anonymous post has been submitted! Admin will review it shortly.</span>
            </div>
          )}

          {/* Tab Navigation */}
          <div className="flex gap-6 border-b border-gray-200 mb-6 overflow-x-auto hide-scrollbar">
            {[
              { id: 'create', label: 'Create Post', icon: Send },
              { id: 'myposts', label: 'My Posts', icon: FileText }
            ].map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setSelectedTab(tab.id)}
                  className={`pb-3 text-sm font-medium transition-colors flex items-center gap-2 whitespace-nowrap ${
                    selectedTab === tab.id 
                      ? 'text-[#f4a825] border-b-2 border-[#f4a825]' 
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  <Icon size={16} />
                  {tab.label}
                </button>
              );
            })}
          </div>

          {selectedTab === 'create' && (
            <div className="max-w-2xl mx-auto">
              {/* Create Post Form */}
              <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm">
                <form onSubmit={handleSubmit} className="p-6 space-y-5">
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
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-[#f4a825] focus:ring-2 focus:ring-[#f4a825]/20 resize-none transition-colors"
                    />
                  </div>

                  {/* Media Preview */}
                  {mediaPreview && (
                    <div className="relative rounded-xl overflow-hidden border border-gray-200 bg-gray-50">
                      {mediaType === 'image' ? (
                        <img
                          src={mediaPreview}
                          alt="Preview"
                          className="max-w-full h-48 object-cover"
                        />
                      ) : (
                        <video
                          src={mediaPreview}
                          controls
                          className="max-w-full h-48"
                        />
                      )}
                      <button
                        type="button"
                        onClick={removeMedia}
                        className="absolute top-2 right-2 bg-red-500 text-white rounded-lg p-1.5 hover:bg-red-600 transition-colors shadow-sm"
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
                    <div className="flex gap-3">
                      <label className="flex-1 cursor-pointer">
                        <div className="border-2 border-dashed border-gray-200 rounded-xl p-4 text-center hover:border-[#f4a825] hover:bg-[#f4a825]/5 transition-all">
                          <ImageIcon className="w-6 h-6 mx-auto mb-2 text-gray-400" />
                          <span className="text-xs text-gray-500">Image</span>
                          <input
                            type="file"
                            accept="image/*"
                            onChange={handleMediaChange}
                            className="hidden"
                          />
                        </div>
                      </label>
                      <label className="flex-1 cursor-pointer">
                        <div className="border-2 border-dashed border-gray-200 rounded-xl p-4 text-center hover:border-[#f4a825] hover:bg-[#f4a825]/5 transition-all">
                          <Video className="w-6 h-6 mx-auto mb-2 text-gray-400" />
                          <span className="text-xs text-gray-500">Video</span>
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
                      className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:border-[#f4a825] focus:ring-2 focus:ring-[#f4a825]/20 transition-colors"
                    />
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={isCreating}
                    className="w-full bg-[#f4a825] text-white py-3 rounded-xl font-semibold hover:bg-[#e09e1a] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-sm"
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

              {/* Info Card */}
              <div className="mt-6 bg-gradient-to-r from-[#f4a825]/5 to-transparent rounded-xl p-5 border border-[#f4a825]/10">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-[#f4a825]/10 flex items-center justify-center flex-shrink-0">
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
            <div>
              {postsLoading ? (
                <div className="text-center py-12">
                  <div className="inline-block animate-spin rounded-full h-8 w-8 border-2 border-gray-300 border-t-[#f4a825]"></div>
                  <p className="text-gray-500 text-sm mt-3">Loading your posts...</p>
                </div>
              ) : myPosts?.posts?.length === 0 ? (
                <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Lock className="w-8 h-8 text-gray-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-700 mb-2">No anonymous posts yet</h3>
                  <p className="text-gray-500 text-sm mb-4">
                    Your anonymous posts will appear here once you create them.
                  </p>
                  <button
                    onClick={() => setSelectedTab('create')}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-[#f4a825] text-white text-sm font-medium rounded-xl hover:bg-[#e09e1a] transition-all"
                  >
                    <Send size={14} />
                    Create Your First Post
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  {myPosts?.posts?.map((post: any) => {
                    const StatusBadge = getStatusBadge(post.status || 'pending');
                    const StatusIcon = StatusBadge.icon;
                    
                    return (
                      <div
                        key={post.id}
                        className="bg-white rounded-2xl border border-gray-100 p-5 hover:shadow-md transition-all"
                      >
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center">
                              <Lock size={14} className="text-gray-500" />
                            </div>
                            <div>
                              <div className="flex items-center gap-2">
                                <span className="text-xs text-gray-400">
                                  {new Date(post.createdAt).toLocaleDateString()}
                                </span>
                                <span className="text-xs text-gray-400">•</span>
                                <span className="text-xs text-gray-400">
                                  {new Date(post.createdAt).toLocaleTimeString()}
                                </span>
                              </div>
                            </div>
                          </div>
                          <div className={`inline-flex items-center gap-1.5 px-2 py-1 rounded-lg text-xs font-medium ${StatusBadge.color}`}>
                            <StatusIcon size={12} />
                            {StatusBadge.label}
                          </div>
                        </div>
                        
                        <p className="text-gray-800 text-sm leading-relaxed mb-3">{post.content}</p>
                        
                        {post.media && (
                          <div className="mb-3 rounded-xl overflow-hidden border border-gray-100">
                            {post.mediaType === 'image' ? (
                              <img
                                src={post.media}
                                alt="Post media"
                                className="max-w-full h-40 object-cover"
                              />
                            ) : (
                              <video
                                src={post.media}
                                controls
                                className="max-w-full h-40"
                              />
                            )}
                          </div>
                        )}
                        
                        {post.tags && post.tags.length > 0 && (
                          <div className="flex flex-wrap gap-2 mt-2">
                            {post.tags.map((tag: string, idx: number) => (
                              <span
                                key={idx}
                                className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-lg"
                              >
                                #{tag}
                              </span>
                            ))}
                          </div>
                        )}
                        
                        <div className="flex items-center gap-4 mt-4 pt-3 border-t border-gray-100">
                          <div className="flex items-center gap-1.5 text-xs text-gray-400">
                            <Eye size={12} />
                            {post.viewCount || 0} views
                          </div>
                          <div className="flex items-center gap-1.5 text-xs text-gray-400">
                            <Heart size={12} />
                            0 likes
                          </div>
                          <div className="flex items-center gap-1.5 text-xs text-gray-400">
                            <MessageCircle size={12} />
                            0 comments
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

      <style>{`
        .hide-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </div>
  );
};

export default Anonymous;