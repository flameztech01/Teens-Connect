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
  Upload,
  FileText,
  Sparkles,
  AlertCircle,
  Shield
} from 'lucide-react';

const Anonymous = () => {
  const { userInfo } = useSelector((state: any) => state.auth);
  const [content, setContent] = useState('');
  const [media, setMedia] = useState<File | null>(null);
  const [mediaPreview, setMediaPreview] = useState<string>('');
  const [mediaType, setMediaType] = useState<'image' | 'video' | null>(null);
  const [tags, setTags] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);

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
        return { color: 'bg-emerald-50 text-emerald-700', icon: CheckCircle, label: 'Approved' };
      case 'rejected':
        return { color: 'bg-red-50 text-red-700', icon: AlertCircle, label: 'Rejected' };
      default:
        return { color: 'bg-amber-50 text-amber-700', icon: Clock, label: 'Pending' };
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-gray-50 to-gray-100/50">
      <DashboardSidebar />
      
      <div className="lg:ml-64 p-6 lg:p-8">
        {/* Header with Brand Colors */}
        <div className="relative overflow-hidden bg-gradient-to-br from-[#1a2538] via-[#1d2b4f] to-[#0d6b57] rounded-2xl shadow-xl mb-8">
          <div className="absolute top-0 right-0 w-64 h-64 bg-[#f4a825]/5 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full blur-2xl"></div>
          
          <div className="relative p-6 lg:p-8">
            <div className="flex items-center gap-4 mb-3">
              <div className="bg-[#f4a825]/20 p-3 rounded-xl backdrop-blur-sm">
                <Lock className="w-7 h-7 text-[#f4a825]" />
              </div>
              <div>
                <h1 className="text-2xl lg:text-3xl font-bold text-white">Anonymous Corner</h1>
                <p className="text-white/70 text-sm mt-1">
                  Share your thoughts anonymously. Your identity remains completely hidden.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Success Message */}
        {showSuccess && (
          <div className="mb-6 bg-emerald-50 border-l-4 border-emerald-500 text-emerald-700 px-4 py-3 rounded-md flex items-center gap-3 shadow-sm">
            <CheckCircle className="w-5 h-5 text-emerald-500" />
            <span className="text-sm font-medium">Your anonymous post has been submitted! Admin will review it shortly.</span>
          </div>
        )}

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Create Anonymous Post Form */}
          <div className="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow overflow-hidden">
            <div className="bg-gradient-to-r from-purple-600 to-purple-700 px-6 py-4">
              <div className="flex items-center gap-3">
                <div className="bg-white/20 p-2 rounded-lg">
                  <Send className="w-5 h-5 text-white" />
                </div>
                <h2 className="text-lg font-semibold text-white">Share Anonymously</h2>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-5">
              {/* Content Textarea */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Your message <span className="text-gray-400 text-xs">(required if no media)</span>
                </label>
                <textarea
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="What's on your mind? Share your thoughts, stories, or questions anonymously..."
                  rows={5}
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:border-[#f4a825] focus:ring-2 focus:ring-[#f4a825]/20 resize-none transition-colors"
                  required={!media}
                />
              </div>

              {/* Media Preview */}
              {mediaPreview && (
                <div className="relative rounded-lg overflow-hidden border border-gray-200">
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
                    className="absolute top-2 right-2 bg-red-500 text-white rounded-md p-1.5 hover:bg-red-600 transition-colors shadow-sm"
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
                    <div className="border-2 border-dashed border-gray-200 rounded-lg p-3 text-center hover:border-purple-400 hover:bg-purple-50/50 transition-all">
                      <ImageIcon className="w-5 h-5 mx-auto mb-1 text-gray-400" />
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
                    <div className="border-2 border-dashed border-gray-200 rounded-lg p-3 text-center hover:border-purple-400 hover:bg-purple-50/50 transition-all">
                      <Video className="w-5 h-5 mx-auto mb-1 text-gray-400" />
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
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:border-[#f4a825] focus:ring-2 focus:ring-[#f4a825]/20 transition-colors"
                />
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isCreating}
                className="w-full bg-gradient-to-r from-purple-600 to-purple-700 text-white py-3 rounded-lg font-semibold hover:from-purple-700 hover:to-purple-800 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-md hover:shadow-lg"
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

          {/* My Anonymous Posts History */}
          <div className="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow overflow-hidden flex flex-col h-full">
            <div className="bg-gradient-to-r from-gray-700 to-gray-800 px-6 py-4">
              <div className="flex items-center gap-3">
                <div className="bg-white/20 p-2 rounded-lg">
                  <FileText className="w-5 h-5 text-white" />
                </div>
                <h2 className="text-lg font-semibold text-white">My Anonymous Posts</h2>
              </div>
            </div>

            <div className="flex-1 p-6">
              {postsLoading ? (
                <div className="text-center py-12">
                  <div className="inline-block animate-spin rounded-full h-8 w-8 border-2 border-gray-300 border-t-purple-600"></div>
                  <p className="text-gray-500 text-sm mt-3">Loading your posts...</p>
                </div>
              ) : myPosts?.posts?.length === 0 ? (
                <div className="text-center py-16">
                  <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Lock className="w-10 h-10 text-gray-300" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-700 mb-2">No anonymous posts yet</h3>
                  <p className="text-gray-500 text-sm mb-4 max-w-sm mx-auto">
                    Your anonymous posts will appear here once you create them.
                  </p>
                  <div className="inline-flex items-center gap-2 text-xs text-gray-400 bg-gray-50 px-3 py-1.5 rounded-full">
                    <Sparkles size={12} />
                    <span>Be the first to share something anonymously</span>
                  </div>
                </div>
              ) : (
                <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2 custom-scrollbar">
                  {myPosts?.posts?.map((post: any) => {
                    const StatusBadge = getStatusBadge(post.status || 'pending');
                    const StatusIcon = StatusBadge.icon;
                    
                    return (
                      <div
                        key={post.id}
                        className="border border-gray-100 rounded-lg p-4 hover:shadow-md transition-all hover:border-gray-200"
                      >
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex items-center gap-2 text-xs text-gray-400">
                            <Clock size={12} />
                            {new Date(post.createdAt).toLocaleString()}
                          </div>
                          <div className={`inline-flex items-center gap-1.5 px-2 py-1 rounded-md text-xs font-medium ${StatusBadge.color}`}>
                            <StatusIcon size={12} />
                            {StatusBadge.label}
                          </div>
                        </div>
                        
                        <p className="text-gray-700 text-sm leading-relaxed mb-3">{post.content}</p>
                        
                        {post.media && (
                          <div className="mb-3 rounded-lg overflow-hidden border border-gray-100">
                            {post.mediaType === 'image' ? (
                              <img
                                src={post.media}
                                alt="Post media"
                                className="max-w-full h-32 object-cover"
                              />
                            ) : (
                              <video
                                src={post.media}
                                controls
                                className="max-w-full h-32"
                              />
                            )}
                          </div>
                        )}
                        
                        {post.tags && post.tags.length > 0 && (
                          <div className="flex flex-wrap gap-1.5 mt-2">
                            {post.tags.map((tag: string, idx: number) => (
                              <span
                                key={idx}
                                className="text-xs bg-purple-50 text-purple-600 px-2 py-1 rounded-md"
                              >
                                #{tag}
                              </span>
                            ))}
                          </div>
                        )}
                        
                        <div className="flex items-center gap-4 mt-3 pt-3 border-t border-gray-50">
                          <div className="flex items-center gap-1.5 text-xs text-gray-400">
                            <Eye size={12} />
                            {post.viewCount || 0} views
                          </div>
                          <div className="flex items-center gap-1.5 text-xs text-gray-400">
                            <Send size={12} />
                            {post.shareCount || 0} shares
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {myPosts?.total > 5 && (
              <div className="px-6 pb-6 pt-2 border-t border-gray-100">
                <button className="w-full text-sm text-[#f4a825] hover:text-[#e09e1a] font-medium transition-colors">
                  Load more posts →
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Info Section with Brand Colors */}
        <div className="mt-8 bg-gradient-to-r from-purple-50 via-purple-50 to-transparent rounded-xl border border-purple-100 p-6">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center flex-shrink-0 shadow-sm">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-gray-900 mb-2">How Anonymous Posting Works</h3>
              <div className="grid sm:grid-cols-2 gap-3 text-sm text-gray-600">
                <ul className="space-y-1.5">
                  <li className="flex items-center gap-2">
                    <div className="w-1 h-1 bg-purple-400 rounded-full"></div>
                    Your identity is completely hidden
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-1 h-1 bg-purple-400 rounded-full"></div>
                    Admin reviews before sharing to community
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-1 h-1 bg-purple-400 rounded-full"></div>
                    Track your post status in real-time
                  </li>
                </ul>
                <ul className="space-y-1.5">
                  <li className="flex items-center gap-2">
                    <div className="w-1 h-1 bg-purple-400 rounded-full"></div>
                    Community members can respond anonymously
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-1 h-1 bg-purple-400 rounded-full"></div>
                    Your privacy is our highest priority
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #f1f1f1;
          border-radius: 3px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #cbd5e1;
          border-radius: 3px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #94a3b8;
        }
      `}</style>
    </div>
  );
};

export default Anonymous;