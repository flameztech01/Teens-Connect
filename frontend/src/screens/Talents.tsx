import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Briefcase,
  Search,
  MapPin,
  Link as LinkIcon,
  UserCircle,
  Code,
  Palette,
  Mic,
  Camera,
  PenTool,
  TrendingUp,
  MessageCircle,
  FileText,
  ChevronLeft,
  ChevronRight,
  X,
  Loader,
  Send,
  Shield,
  Smartphone,
  Mail,
  Phone,
  Filter,
  ArrowLeft
} from 'lucide-react';
import {
  useGetTalentsQuery,
  useGetTalentContactQuery,
  useGenerateWhatsAppMessageMutation
} from '../slices/hireApiSlice';

const Talents = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSkill, setSelectedSkill] = useState('');
  const [selectedLocation, setSelectedLocation] = useState('');
  const [selectedTalent, setSelectedTalent] = useState<any>(null);
  const [messageText, setMessageText] = useState('');
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);
  const [page, setPage] = useState(1);
  const [tempSearchTerm, setTempSearchTerm] = useState('');
  const [tempSelectedSkill, setTempSelectedSkill] = useState('');
  const [tempSelectedLocation, setTempSelectedLocation] = useState('');

  const { data: talentsData, isLoading } = useGetTalentsQuery({
    page,
    limit: 12,
    search: searchTerm,
    skill: selectedSkill,
    location: selectedLocation
  });

  const { data: talentContact, refetch: refetchContact } = useGetTalentContactQuery(
    selectedTalent?._id,
    { skip: !selectedTalent?._id }
  );
  const [generateWhatsAppMessage, { isLoading: isGenerating }] = useGenerateWhatsAppMessageMutation();

  const handleContactTalent = async (talent: any) => {
    setSelectedTalent(talent);
    setMessageText(`Hi ${talent.name}, I came across your profile on TeensConnect and I'm really impressed by your skills in ${talent.skills?.slice(0, 2).join(', ')}. Would love to discuss potential collaboration!`);
    await refetchContact();
  };

  const handleSendWhatsApp = async () => {
    if (!selectedTalent) return;

    try {
      const result = await generateWhatsAppMessage({
        talentId: selectedTalent._id,
        message: messageText
      }).unwrap();
      
      window.open(result.whatsappLink, '_blank');
    } catch (error: any) {
      console.error('Error generating WhatsApp link:', error);
      alert(error.data?.message || 'Failed to generate WhatsApp link');
    }
  };

  const handleClearFilters = () => {
    setSearchTerm('');
    setSelectedSkill('');
    setSelectedLocation('');
    setPage(1);
  };

  const handleApplyFilters = () => {
    setSearchTerm(tempSearchTerm);
    setSelectedSkill(tempSelectedSkill);
    setSelectedLocation(tempSelectedLocation);
    setPage(1);
    setIsSearchModalOpen(false);
  };

  const handleResetFilters = () => {
    setTempSearchTerm('');
    setTempSelectedSkill('');
    setTempSelectedLocation('');
  };

  const getSkillIcon = (skill: string) => {
    const skillLower = skill.toLowerCase();
    if (skillLower.includes('design') || skillLower.includes('ui') || skillLower.includes('ux')) return <Palette size={12} />;
    if (skillLower.includes('code') || skillLower.includes('programming') || skillLower.includes('developer') || skillLower.includes('react') || skillLower.includes('javascript')) return <Code size={12} />;
    if (skillLower.includes('music') || skillLower.includes('sing')) return <Mic size={12} />;
    if (skillLower.includes('photo') || skillLower.includes('video')) return <Camera size={12} />;
    if (skillLower.includes('write') || skillLower.includes('content')) return <PenTool size={12} />;
    return <TrendingUp size={12} />;
  };

  const popularSkills = ['React', 'JavaScript', 'UI/UX Design', 'Graphic Design', 'Content Writing', 'Video Editing', 'Digital Marketing', 'Python'];

  const hasActiveFilters = searchTerm || selectedSkill || selectedLocation;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header with Back Button */}
      <div className="bg-white border-b border-gray-100 sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-4">
              {/* Back Button */}
              <button
                onClick={() => navigate('/')}
                className="flex items-center gap-2 text-gray-600 hover:text-[#f4a825] transition-colors"
              >
                <ArrowLeft size={20} />
                <span className="text-sm font-medium hidden sm:inline">Back to Home</span>
              </button>
              
              <div className="w-px h-8 bg-gray-200 hidden sm:block" />
              
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#f4a825]/10 flex items-center justify-center">
                  <Briefcase className="w-5 h-5 text-[#f4a825]" />
                </div>
                <div>
                  <h1 className="text-xl font-bold text-gray-900">Find Talent</h1>
                  <p className="text-gray-500 text-xs hidden sm:block">
                    Discover and connect with talented teens
                  </p>
                </div>
              </div>
            </div>
            
            {/* Search Button */}
            <button
              onClick={() => {
                setTempSearchTerm(searchTerm);
                setTempSelectedSkill(selectedSkill);
                setTempSelectedLocation(selectedLocation);
                setIsSearchModalOpen(true);
              }}
              className="flex items-center gap-2 px-4 py-2 bg-[#f4a825] text-white rounded-xl font-semibold hover:bg-[#e09e1a] transition-all shadow-sm text-sm"
            >
              <Search size={16} />
              <span>Search & Filter</span>
              <Filter size={14} />
            </button>
          </div>

          {/* Active Filters */}
          {hasActiveFilters && (
            <div className="flex flex-wrap items-center gap-2 mt-4 pt-4 border-t border-gray-100">
              <span className="text-xs text-gray-500">Active filters:</span>
              {searchTerm && (
                <span className="inline-flex items-center gap-1 text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded-lg">
                  Search: {searchTerm}
                  <button onClick={() => setSearchTerm('')} className="hover:text-red-500">
                    <X size={12} />
                  </button>
                </span>
              )}
              {selectedSkill && (
                <span className="inline-flex items-center gap-1 text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded-lg">
                  Skill: {selectedSkill}
                  <button onClick={() => setSelectedSkill('')} className="hover:text-red-500">
                    <X size={12} />
                  </button>
                </span>
              )}
              {selectedLocation && (
                <span className="inline-flex items-center gap-1 text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded-lg">
                  Location: {selectedLocation}
                  <button onClick={() => setSelectedLocation('')} className="hover:text-red-500">
                    <X size={12} />
                  </button>
                </span>
              )}
              <button
                onClick={handleClearFilters}
                className="text-xs text-[#f4a825] hover:underline ml-2"
              >
                Clear all
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-6">
        {/* Welcome Message */}
        <div className="mb-6 text-center">
          <h2 className="text-2xl font-bold text-gray-900">Find Your Next Talent</h2>
          <p className="text-gray-500 text-sm mt-1">
            Browse through our community of talented teens ready to work with you
          </p>
        </div>

        {/* Talents Section */}
        <div>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold text-gray-900">
              {hasActiveFilters ? 'Search Results' : 'All Talents'}
            </h2>
            <p className="text-sm text-gray-400">{talentsData?.total || 0} talents found</p>
          </div>

          {isLoading ? (
            <div className="text-center py-16 bg-white rounded-2xl border border-gray-100">
              <Loader className="w-10 h-10 text-[#f4a825] animate-spin mx-auto mb-4" />
              <p className="text-gray-500 text-sm">Loading talents...</p>
            </div>
          ) : talentsData?.talents?.length === 0 ? (
            <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center">
              <Briefcase className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-700 mb-2">No talents found</h3>
              <p className="text-gray-400 text-sm">Try adjusting your search or filters</p>
              <button
                onClick={handleClearFilters}
                className="mt-4 text-[#f4a825] font-medium hover:underline"
              >
                Clear all filters
              </button>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                {talentsData?.talents?.map((talent: any) => (
                  <div key={talent._id} className="bg-white rounded-2xl border border-gray-100 hover:shadow-lg transition-all duration-300 overflow-hidden group">
                    <div className="p-4">
                      <div className="flex items-start gap-3 mb-3">
                        {talent.profile ? (
                          <img src={talent.profile} alt={talent.name} className="w-12 h-12 rounded-full object-cover ring-2 ring-[#f4a825]/20 group-hover:ring-[#f4a825]/40 transition-all" />
                        ) : (
                          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#1a2538] to-[#0d6b57] flex items-center justify-center">
                            <span className="text-white font-bold text-lg">
                              {talent.name?.charAt(0).toUpperCase() || 'U'}
                            </span>
                          </div>
                        )}
                        <div className="flex-1 min-w-0">
                          <h3 className="font-bold text-gray-900 text-base truncate">{talent.name}</h3>
                          <div className="flex items-center gap-1 text-xs text-gray-400 mt-0.5">
                            <MapPin size={12} />
                            <span className="truncate">{talent.location || 'Location not specified'}</span>
                          </div>
                        </div>
                      </div>

                      {talent.bio && (
                        <p className="text-gray-600 text-xs mb-3 line-clamp-2 leading-relaxed">{talent.bio}</p>
                      )}

                      {talent.skills && talent.skills.length > 0 && (
                        <div className="flex flex-wrap gap-1.5 mb-3">
                          {talent.skills.slice(0, 3).map((skill: string, idx: number) => (
                            <span key={idx} className="inline-flex items-center gap-1 text-xs bg-gray-50 text-gray-700 px-2 py-1 rounded-full">
                              {getSkillIcon(skill)}
                              <span className="truncate max-w-[80px]">{skill}</span>
                            </span>
                          ))}
                          {talent.skills.length > 3 && (
                            <span className="text-xs bg-gray-50 text-gray-500 px-2 py-1 rounded-full">
                              +{talent.skills.length - 3}
                            </span>
                          )}
                        </div>
                      )}

                      <div className="flex items-center gap-3 mb-3">
                        {talent.portfolioLink && (
                          <a
                            href={talent.portfolioLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 text-xs text-blue-600 hover:text-blue-700 transition-colors"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <LinkIcon size={10} />
                            Portfolio
                          </a>
                        )}
                        {talent.cv && (
                          <a
                            href={talent.cv}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 text-xs text-emerald-600 hover:text-emerald-700 transition-colors"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <FileText size={10} />
                            CV
                          </a>
                        )}
                      </div>

                      <button
                        onClick={() => handleContactTalent(talent)}
                        className="w-full bg-[#f4a825] text-white py-2 rounded-xl text-sm font-semibold hover:bg-[#e09e1a] transition-all flex items-center justify-center gap-2"
                      >
                        <MessageCircle size={14} />
                        Contact
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Pagination */}
              {talentsData && talentsData.pages > 1 && (
                <div className="flex justify-center gap-2 mt-6 pt-4 border-t border-gray-100">
                  <button
                    onClick={() => setPage(p => Math.max(1, p - 1))}
                    disabled={page === 1}
                    className="px-4 py-2 border border-gray-200 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed hover:border-[#f4a825] hover:text-[#f4a825] transition-all text-sm font-medium"
                  >
                    <ChevronLeft size={16} />
                    Previous
                  </button>
                  <div className="flex items-center gap-2">
                    {Array.from({ length: Math.min(5, talentsData.pages) }, (_, i) => {
                      let pageNum;
                      if (talentsData.pages <= 5) {
                        pageNum = i + 1;
                      } else if (page <= 3) {
                        pageNum = i + 1;
                      } else if (page >= talentsData.pages - 2) {
                        pageNum = talentsData.pages - 4 + i;
                      } else {
                        pageNum = page - 2 + i;
                      }
                      
                      return (
                        <button
                          key={pageNum}
                          onClick={() => setPage(pageNum)}
                          className={`w-9 h-9 rounded-xl text-sm font-medium transition-all ${
                            page === pageNum
                              ? 'bg-[#f4a825] text-white shadow-sm'
                              : 'border border-gray-200 text-gray-600 hover:border-[#f4a825] hover:text-[#f4a825]'
                          }`}
                        >
                          {pageNum}
                        </button>
                      );
                    })}
                  </div>
                  <button
                    onClick={() => setPage(p => Math.min(talentsData.pages, p + 1))}
                    disabled={page === talentsData.pages}
                    className="px-4 py-2 border border-gray-200 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed hover:border-[#f4a825] hover:text-[#f4a825] transition-all text-sm font-medium"
                  >
                    Next
                    <ChevronRight size={16} />
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* Search & Filter Modal */}
      {isSearchModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="bg-[#1a2538] px-6 py-4 rounded-t-2xl sticky top-0">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <Search className="w-5 h-5 text-[#f4a825]" />
                  <h2 className="text-lg font-semibold text-white">Search & Filter Talents</h2>
                </div>
                <button
                  onClick={() => setIsSearchModalOpen(false)}
                  className="text-white/60 hover:text-white transition-colors"
                >
                  <X size={20} />
                </button>
              </div>
            </div>

            <div className="p-6 space-y-6">
              {/* Search Input */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Search by name, bio, or skills
                </label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search talents..."
                    value={tempSearchTerm}
                    onChange={(e) => setTempSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:border-[#f4a825] focus:ring-2 focus:ring-[#f4a825]/20 transition-all"
                  />
                </div>
              </div>

              {/* Skill Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Filter by skill
                </label>
                <input
                  type="text"
                  placeholder="Enter a skill..."
                  value={tempSelectedSkill}
                  onChange={(e) => setTempSelectedSkill(e.target.value)}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:border-[#f4a825] focus:ring-2 focus:ring-[#f4a825]/20 transition-all mb-3"
                />
                <div className="flex flex-wrap gap-2">
                  {popularSkills.map(skill => (
                    <button
                      key={skill}
                      onClick={() => setTempSelectedSkill(skill)}
                      className={`text-xs px-3 py-1.5 rounded-full transition-all ${
                        tempSelectedSkill === skill
                          ? 'bg-[#f4a825] text-white'
                          : 'bg-gray-100 text-gray-600 hover:bg-[#f4a825]/10 hover:text-[#f4a825]'
                      }`}
                    >
                      {skill}
                    </button>
                  ))}
                </div>
              </div>

              {/* Location Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Filter by location
                </label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="City, state, or country..."
                    value={tempSelectedLocation}
                    onChange={(e) => setTempSelectedLocation(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:border-[#f4a825] focus:ring-2 focus:ring-[#f4a825]/20 transition-all"
                  />
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 pt-4 border-t border-gray-100">
                <button
                  onClick={handleResetFilters}
                  className="flex-1 px-4 py-2.5 border border-gray-200 text-gray-700 rounded-xl font-medium hover:bg-gray-50 transition-colors"
                >
                  Reset All
                </button>
                <button
                  onClick={handleApplyFilters}
                  className="flex-1 bg-[#f4a825] text-white py-2.5 rounded-xl font-semibold hover:bg-[#e09e1a] transition-all"
                >
                  Apply Filters
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Contact Modal */}
      {selectedTalent && talentContact && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="bg-[#1a2538] px-6 py-4 rounded-t-2xl">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <MessageCircle className="w-5 h-5 text-[#f4a825]" />
                  <h2 className="text-lg font-semibold text-white">Contact {selectedTalent.name}</h2>
                </div>
                <button
                  onClick={() => setSelectedTalent(null)}
                  className="text-white/60 hover:text-white transition-colors"
                >
                  <X size={20} />
                </button>
              </div>
            </div>

            <div className="p-6 space-y-5">
              <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
                <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-3">Contact Information</p>
                <div className="space-y-2.5">
                  {talentContact.whatsappNumber && (
                    <div className="flex items-center gap-3 text-sm">
                      <div className="w-7 h-7 bg-green-100 rounded-lg flex items-center justify-center">
                        <Smartphone className="w-3.5 h-3.5 text-green-600" />
                      </div>
                      <span className="text-gray-700">{talentContact.whatsappNumber}</span>
                    </div>
                  )}
                  {talentContact.email && (
                    <div className="flex items-center gap-3 text-sm">
                      <div className="w-7 h-7 bg-blue-100 rounded-lg flex items-center justify-center">
                        <Mail className="w-3.5 h-3.5 text-blue-600" />
                      </div>
                      <span className="text-gray-700">{talentContact.email}</span>
                    </div>
                  )}
                  {talentContact.phoneNumber && (
                    <div className="flex items-center gap-3 text-sm">
                      <div className="w-7 h-7 bg-gray-100 rounded-lg flex items-center justify-center">
                        <Phone className="w-3.5 h-3.5 text-gray-600" />
                      </div>
                      <span className="text-gray-700">{talentContact.phoneNumber}</span>
                    </div>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Your Message
                </label>
                <textarea
                  value={messageText}
                  onChange={(e) => setMessageText(e.target.value)}
                  rows={4}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:border-[#f4a825] focus:ring-2 focus:ring-[#f4a825]/20 transition-all resize-none"
                  placeholder="Write your message here..."
                />
              </div>

              <button
                onClick={handleSendWhatsApp}
                disabled={isGenerating}
                className="w-full bg-green-600 text-white py-3 rounded-xl font-semibold hover:bg-green-700 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {isGenerating ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  <>
                    <Send size={18} />
                    Send via WhatsApp
                  </>
                )}
              </button>

              <div className="flex items-center justify-center gap-2 text-xs text-gray-400">
                <Shield size={12} />
                <span>You'll be redirected to WhatsApp to send your message</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Talents;