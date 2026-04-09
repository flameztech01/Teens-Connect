import { useState, useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import DashboardSidebar from "../components/DashbordSidebar"
import {
  useGetTalentsQuery,
  useGetFeaturedTalentsQuery,
  useGetTalentContactQuery,
  useGenerateWhatsAppMessageMutation
} from '../slices/hireApiSlice';
import {
  Briefcase,
  Search,
  MapPin,
  Mail,
  Phone,
  Link as LinkIcon,
  Star,
  Filter,
  X,
  Send,
  UserCircle,
  Code,
  Palette,
  Mic,
  Camera,
  PenTool,
  TrendingUp,
  Award,
  Clock,
  CheckCircle,
  ExternalLink,
  MessageCircle,
  ChevronDown,
  ChevronUp,
  FileText,
  Smartphone,
  Shield,
  Sliders
} from 'lucide-react';

const Hire = () => {
  const { userInfo } = useSelector((state: any) => state.auth);
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

  const { data: talentsData, isLoading, refetch } = useGetTalentsQuery({
    page,
    limit: 12,
    search: searchTerm,
    skill: selectedSkill,
    location: selectedLocation
  });

  const { data: featuredTalents } = useGetFeaturedTalentsQuery(6);
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
    if (skillLower.includes('design') || skillLower.includes('ui') || skillLower.includes('ux')) return <Palette size={14} />;
    if (skillLower.includes('code') || skillLower.includes('programming') || skillLower.includes('developer') || skillLower.includes('react') || skillLower.includes('javascript')) return <Code size={14} />;
    if (skillLower.includes('music') || skillLower.includes('sing')) return <Mic size={14} />;
    if (skillLower.includes('photo') || skillLower.includes('video')) return <Camera size={14} />;
    if (skillLower.includes('write') || skillLower.includes('content')) return <PenTool size={14} />;
    return <TrendingUp size={14} />;
  };

  const popularSkills = ['React', 'JavaScript', 'UI/UX Design', 'Graphic Design', 'Content Writing', 'Video Editing', 'Digital Marketing', 'Python'];

  const hasActiveFilters = searchTerm || selectedSkill || selectedLocation;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-gray-50 to-gray-100/50">
      <DashboardSidebar />
      
      <div className="lg:ml-64">
        {/* Main Content */}
        <div className="px-6 lg:px-8 py-6 lg:py-8">
          {/* Header with Search Icon */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-2 flex items-center gap-3">
                <Briefcase className="w-8 h-8 text-[#f4a825]" />
                Hire Talent
              </h1>
              <p className="text-gray-500 text-sm">
                Discover and connect with talented teens ready to work on your projects
              </p>
            </div>
            
            <div className="flex items-center gap-3">
              {/* Active Filters Indicator */}
              {hasActiveFilters && (
                <div className="hidden sm:flex items-center gap-2 px-3 py-2 bg-[#f4a825]/10 rounded-lg">
                  <span className="text-xs text-[#f4a825] font-medium">
                    {searchTerm && `Search: ${searchTerm}`}
                    {selectedSkill && `${searchTerm ? ' • ' : ''}Skill: ${selectedSkill}`}
                    {selectedLocation && `${(searchTerm || selectedSkill) ? ' • ' : ''}Location: ${selectedLocation}`}
                  </span>
                  <button
                    onClick={handleClearFilters}
                    className="text-[#f4a825] hover:text-[#e09e1a]"
                  >
                    <X size={14} />
                  </button>
                </div>
              )}
              
              {/* Search Button */}
              <button
                onClick={() => {
                  setTempSearchTerm(searchTerm);
                  setTempSelectedSkill(selectedSkill);
                  setTempSelectedLocation(selectedLocation);
                  setIsSearchModalOpen(true);
                }}
                className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-[#f4a825] to-[#e09e1a] text-white rounded-lg font-semibold hover:shadow-md transition-all"
              >
                <Search size={18} />
                <span className="hidden sm:inline">Search & Filter</span>
                <Sliders size={16} className="hidden sm:inline" />
              </button>
            </div>
          </div>

          {/* Featured Talents Section */}
          {featuredTalents && featuredTalents.length > 0 && !hasActiveFilters && (
            <div className="mb-8">
              <div className="flex items-center gap-2 mb-4">
                <Award className="w-5 h-5 text-[#f4a825]" />
                <h2 className="text-lg font-semibold text-gray-900">Featured Talents</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {featuredTalents.slice(0, 3).map((talent: any) => (
                  <div key={talent._id} className="bg-white rounded-xl shadow-md hover:shadow-lg transition-all border border-gray-100 overflow-hidden group">
                    <div className="relative bg-gradient-to-r from-[#1a2538] to-[#1d2b4f] p-4">
                      <div className="flex items-center gap-3">
                        {talent.profile ? (
                          <img src={talent.profile} alt={talent.name} className="w-12 h-12 rounded-full object-cover ring-2 ring-[#f4a825]/40" />
                        ) : (
                          <div className="w-12 h-12 rounded-full bg-[#f4a825]/20 flex items-center justify-center ring-2 ring-[#f4a825]/40">
                            <UserCircle className="w-7 h-7 text-[#f4a825]" />
                          </div>
                        )}
                        <div>
                          <h3 className="font-semibold text-white">{talent.name}</h3>
                          <p className="text-xs text-white/60">{talent.location || 'Location not specified'}</p>
                        </div>
                      </div>
                      <div className="absolute top-2 right-2">
                        <Star className="w-4 h-4 text-[#f4a825] fill-[#f4a825]" />
                      </div>
                    </div>
                    <div className="p-4">
                      <div className="flex flex-wrap gap-1.5 mb-4">
                        {talent.skills?.slice(0, 3).map((skill: string, idx: number) => (
                          <span key={idx} className="inline-flex items-center gap-1 text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full">
                            {getSkillIcon(skill)}
                            {skill}
                          </span>
                        ))}
                      </div>
                      <button
                        onClick={() => handleContactTalent(talent)}
                        className="w-full bg-gradient-to-r from-[#f4a825] to-[#e09e1a] text-white py-2 rounded-lg text-sm font-semibold hover:shadow-md transition-all"
                      >
                        Contact Talent
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Talents Scrollable Container */}
          <div>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold text-gray-900">
                {hasActiveFilters ? 'Search Results' : 'All Talents'}
              </h2>
              <p className="text-sm text-gray-400">{talentsData?.total || 0} talents found</p>
            </div>

            {isLoading ? (
              <div className="text-center py-16 bg-white rounded-xl">
                <div className="inline-block w-10 h-10 border-3 border-gray-200 border-t-[#f4a825] rounded-full animate-spin"></div>
                <p className="text-gray-500 mt-4">Loading talents...</p>
              </div>
            ) : talentsData?.talents?.length === 0 ? (
              <div className="bg-white rounded-xl shadow-md p-12 text-center border border-gray-100">
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
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-h-[calc(100vh-280px)] overflow-y-auto pr-2 custom-scrollbar pb-4">
                  {talentsData?.talents?.map((talent: any) => (
                    <div key={talent._id} className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 border border-gray-100 overflow-hidden group">
                      <div className="p-5">
                        <div className="flex items-start gap-4 mb-4">
                          {talent.profile ? (
                            <img src={talent.profile} alt={talent.name} className="w-14 h-14 rounded-full object-cover ring-2 ring-[#f4a825]/20 group-hover:ring-[#f4a825]/40 transition-all" />
                          ) : (
                            <div className="w-14 h-14 rounded-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                              <UserCircle className="w-8 h-8 text-gray-400" />
                            </div>
                          )}
                          <div className="flex-1">
                            <h3 className="font-bold text-gray-900 text-lg">{talent.name}</h3>
                            <div className="flex items-center gap-1 text-sm text-gray-400 mt-0.5">
                              <MapPin size={14} />
                              <span>{talent.location || 'Location not specified'}</span>
                            </div>
                          </div>
                        </div>

                        {talent.bio && (
                          <p className="text-gray-600 text-sm mb-3 line-clamp-2 leading-relaxed">{talent.bio}</p>
                        )}

                        {talent.skills && talent.skills.length > 0 && (
                          <div className="flex flex-wrap gap-1.5 mb-4">
                            {talent.skills.slice(0, 4).map((skill: string, idx: number) => (
                              <span key={idx} className="inline-flex items-center gap-1 text-xs bg-gray-50 text-gray-700 px-2 py-1 rounded-full border border-gray-100">
                                {getSkillIcon(skill)}
                                {skill}
                              </span>
                            ))}
                            {talent.skills.length > 4 && (
                              <span className="text-xs bg-gray-50 text-gray-500 px-2 py-1 rounded-full border border-gray-100">
                                +{talent.skills.length - 4}
                              </span>
                            )}
                          </div>
                        )}

                        <div className="flex items-center gap-4 mb-4">
                          {talent.portfolioLink && (
                            <a
                              href={talent.portfolioLink}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1 text-xs text-blue-600 hover:text-blue-700 transition-colors"
                            >
                              <LinkIcon size={12} />
                              Portfolio
                            </a>
                          )}
                          {talent.cv && (
                            <a
                              href={talent.cv}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1 text-xs text-emerald-600 hover:text-emerald-700 transition-colors"
                            >
                              <FileText size={12} />
                              CV
                            </a>
                          )}
                        </div>

                        <button
                          onClick={() => handleContactTalent(talent)}
                          className="w-full bg-gradient-to-r from-[#f4a825] to-[#e09e1a] text-white py-2.5 rounded-lg font-semibold hover:shadow-md transition-all flex items-center justify-center gap-2"
                        >
                          <MessageCircle size={16} />
                          Contact on WhatsApp
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
                      className="px-4 py-2 border border-gray-200 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:border-[#f4a825] hover:text-[#f4a825] transition-all text-sm font-medium"
                    >
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
                            className={`w-9 h-9 rounded-lg text-sm font-medium transition-all ${
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
                      className="px-4 py-2 border border-gray-200 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:border-[#f4a825] hover:text-[#f4a825] transition-all text-sm font-medium"
                    >
                      Next
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>

      {/* Search & Filter Modal */}
      {isSearchModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto animate-in fade-in zoom-in duration-200">
            <div className="bg-gradient-to-r from-[#1a2538] to-[#1d2b4f] px-6 py-4 rounded-t-xl sticky top-0">
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
                  Search by name or bio
                </label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search talents..."
                    value={tempSearchTerm}
                    onChange={(e) => setTempSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:border-[#f4a825] focus:ring-2 focus:ring-[#f4a825]/20 transition-all"
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
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:border-[#f4a825] focus:ring-2 focus:ring-[#f4a825]/20 transition-all mb-3"
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
                    className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:border-[#f4a825] focus:ring-2 focus:ring-[#f4a825]/20 transition-all"
                  />
                </div>
              </div>

              {/* Active Filters Preview */}
              {(tempSearchTerm || tempSelectedSkill || tempSelectedLocation) && (
                <div className="bg-gray-50 rounded-lg p-3">
                  <p className="text-xs font-medium text-gray-500 mb-2">Active filters:</p>
                  <div className="flex flex-wrap gap-2">
                    {tempSearchTerm && (
                      <span className="inline-flex items-center gap-1 text-xs bg-white px-2 py-1 rounded-full border border-gray-200">
                        Search: {tempSearchTerm}
                        <button onClick={() => setTempSearchTerm('')} className="text-gray-400 hover:text-gray-600">
                          <X size={12} />
                        </button>
                      </span>
                    )}
                    {tempSelectedSkill && (
                      <span className="inline-flex items-center gap-1 text-xs bg-white px-2 py-1 rounded-full border border-gray-200">
                        Skill: {tempSelectedSkill}
                        <button onClick={() => setTempSelectedSkill('')} className="text-gray-400 hover:text-gray-600">
                          <X size={12} />
                        </button>
                      </span>
                    )}
                    {tempSelectedLocation && (
                      <span className="inline-flex items-center gap-1 text-xs bg-white px-2 py-1 rounded-full border border-gray-200">
                        Location: {tempSelectedLocation}
                        <button onClick={() => setTempSelectedLocation('')} className="text-gray-400 hover:text-gray-600">
                          <X size={12} />
                        </button>
                      </span>
                    )}
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex gap-3 pt-4 border-t border-gray-100">
                <button
                  onClick={handleResetFilters}
                  className="flex-1 px-4 py-2.5 border border-gray-200 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors"
                >
                  Reset All
                </button>
                <button
                  onClick={handleApplyFilters}
                  className="flex-1 bg-gradient-to-r from-[#f4a825] to-[#e09e1a] text-white py-2.5 rounded-lg font-semibold hover:shadow-md transition-all"
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
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto animate-in fade-in zoom-in duration-200">
            <div className="bg-gradient-to-r from-[#1a2538] to-[#1d2b4f] px-6 py-4 rounded-t-xl">
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
              <div className="bg-gray-50 rounded-lg p-4 border border-gray-100">
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
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:border-[#f4a825] focus:ring-2 focus:ring-[#f4a825]/20 transition-all resize-none"
                  placeholder="Write your message here..."
                />
              </div>

              <button
                onClick={handleSendWhatsApp}
                disabled={isGenerating}
                className="w-full bg-gradient-to-r from-green-600 to-green-700 text-white py-3 rounded-lg font-semibold hover:shadow-lg transition-all flex items-center justify-center gap-2 disabled:opacity-50"
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
        
        @keyframes fade-in {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
        
        @keyframes zoom-in {
          from {
            opacity: 0;
            transform: scale(0.95);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
        
        .animate-in {
          animation-duration: 0.2s;
          animation-fill-mode: both;
        }
        
        .fade-in {
          animation-name: fade-in;
        }
        
        .zoom-in {
          animation-name: zoom-in;
        }
      `}</style>
    </div>
  );
};

export default Hire;