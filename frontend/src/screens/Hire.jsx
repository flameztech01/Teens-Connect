import { useState } from 'react';
import { useSelector } from 'react-redux';
import DashboardSidebar from '../components/DashbordSidebar';
import {
  useGetTalentsQuery,
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
  X,
  Send,
  UserCircle,
  Code,
  Palette,
  Mic,
  Camera,
  PenTool,
  TrendingUp,
  MessageCircle,
  FileText,
  Smartphone,
  Shield,
  Sliders
} from 'lucide-react';

const Hire = () => {
  const { userInfo } = useSelector((state) => state.auth);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSkill, setSelectedSkill] = useState('');
  const [selectedLocation, setSelectedLocation] = useState('');
  const [selectedTalent, setSelectedTalent] = useState(null);
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

  const handleContactTalent = async (talent) => {
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
    } catch (error) {
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

  const getSkillIcon = (skill) => {
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
      <DashboardSidebar />
      
      <div className="lg:ml-72">
        {/* Header - flat gradient, no shadow */}
        <div className="sticky top-0 z-30 bg-gradient-to-r from-[#f4a825] to-[#ff8c00] text-white">
          <div className="px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0 backdrop-blur-sm">
                  <Briefcase className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-lg sm:text-2xl font-bold text-white">Hire Talent</h1>
                  <p className="text-xs sm:text-sm text-white/80 mt-0.5">
                    Discover and connect with talented teens ready to work on your projects
                  </p>
                </div>
              </div>
              
              {/* Search Button - flat white rounded-full */}
              <button
                onClick={() => {
                  setTempSearchTerm(searchTerm);
                  setTempSelectedSkill(selectedSkill);
                  setTempSelectedLocation(selectedLocation);
                  setIsSearchModalOpen(true);
                }}
                className="flex items-center gap-2 px-4 sm:px-5 py-2 bg-white text-[#f4a825] text-sm font-bold rounded-full hover:bg-gray-100 transition-all"
              >
                <Search size={18} />
                <span>Search & Filter</span>
                <Sliders size={16} />
              </button>
            </div>

            {/* Active Filters - flat, no rounded */}
            {hasActiveFilters && (
              <div className="flex flex-wrap items-center gap-2 mt-4 pt-3 border-t border-white/20">
                <span className="text-xs text-white/80">Active filters:</span>
                {searchTerm && (
                  <span className="inline-flex items-center gap-1 text-xs bg-white/20 text-white px-3 py-1 rounded-full">
                    Search: {searchTerm}
                    <button onClick={() => setSearchTerm('')} className="hover:text-white">
                      <X size={12} />
                    </button>
                  </span>
                )}
                {selectedSkill && (
                  <span className="inline-flex items-center gap-1 text-xs bg-white/20 text-white px-3 py-1 rounded-full">
                    Skill: {selectedSkill}
                    <button onClick={() => setSelectedSkill('')} className="hover:text-white">
                      <X size={12} />
                    </button>
                  </span>
                )}
                {selectedLocation && (
                  <span className="inline-flex items-center gap-1 text-xs bg-white/20 text-white px-3 py-1 rounded-full">
                    Location: {selectedLocation}
                    <button onClick={() => setSelectedLocation('')} className="hover:text-white">
                      <X size={12} />
                    </button>
                  </span>
                )}
                <button
                  onClick={handleClearFilters}
                  className="text-xs text-white underline hover:text-gray-200 ml-2"
                >
                  Clear all
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Main Content - full width, no outer card */}
        <div className="px-0 sm:px-4 lg:px-6 py-4 sm:py-6">
          {/* Talents Section */}
          <div>
            <div className="flex justify-between items-center mb-4 px-4 sm:px-0">
              <h2 className="text-lg font-semibold text-gray-900">
                {hasActiveFilters ? 'Search Results' : 'All Talents'}
              </h2>
              <p className="text-sm text-gray-400">{talentsData?.total || 0} talents found</p>
            </div>

            {isLoading ? (
              <div className="text-center py-16 bg-white border-b border-gray-200">
                <div className="inline-block w-10 h-10 border-3 border-gray-200 border-t-[#f4a825] rounded-full animate-spin"></div>
                <p className="text-gray-500 mt-4">Loading talents...</p>
              </div>
            ) : talentsData?.talents?.length === 0 ? (
              <div className="bg-white border-b border-gray-200 px-4 py-12 text-center">
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
                {/* Talents List - flat, divide-y, edge-to-edge */}
                <div className="bg-white divide-y divide-gray-100">
                  {talentsData?.talents?.map((talent) => (
                    <div key={talent._id} className="px-4 py-5 hover:bg-gray-50/50 transition-colors">
                      <div className="flex items-start gap-4">
                        {talent.profile ? (
                          <img src={talent.profile} alt={talent.name} className="w-14 h-14 rounded-full object-cover ring-2 ring-[#f4a825]/20" />
                        ) : (
                          <div className="w-14 h-14 rounded-full bg-gray-100 flex items-center justify-center">
                            <UserCircle className="w-8 h-8 text-gray-400" />
                          </div>
                        )}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2">
                            <div>
                              <h3 className="font-bold text-gray-900 text-base sm:text-lg truncate">{talent.name}</h3>
                              <div className="flex items-center gap-1 text-sm text-gray-400 mt-0.5">
                                <MapPin size={14} />
                                <span>{talent.location || 'Location not specified'}</span>
                              </div>
                            </div>
                            <button
                              onClick={() => handleContactTalent(talent)}
                              className="flex items-center gap-2 px-3 py-2 bg-[#f4a825] text-white text-sm font-medium rounded-full hover:bg-[#e09e1a] transition-all whitespace-nowrap"
                            >
                              <MessageCircle size={14} />
                              <span className="hidden sm:inline">Contact</span>
                            </button>
                          </div>

                          {talent.bio && (
                            <p className="text-gray-600 text-sm mt-2 line-clamp-2 leading-relaxed">{talent.bio}</p>
                          )}

                          {talent.skills && talent.skills.length > 0 && (
                            <div className="flex flex-wrap gap-1.5 mt-3">
                              {talent.skills.slice(0, 4).map((skill, idx) => (
                                <span key={idx} className="inline-flex items-center gap-1 text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded-full">
                                  {getSkillIcon(skill)}
                                  {skill}
                                </span>
                              ))}
                              {talent.skills.length > 4 && (
                                <span className="text-xs bg-gray-100 text-gray-500 px-2 py-1 rounded-full">
                                  +{talent.skills.length - 4}
                                </span>
                              )}
                            </div>
                          )}

                          <div className="flex items-center gap-3 mt-3">
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
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Pagination - flat, no cards */}
                {talentsData && talentsData.pages > 1 && (
                  <div className="flex justify-center gap-3 mt-6 mb-8 px-4 sm:px-0">
                    <button
                      onClick={() => setPage(p => Math.max(1, p - 1))}
                      disabled={page === 1}
                      className="px-4 py-2 text-sm font-medium text-gray-600 disabled:opacity-50 disabled:cursor-not-allowed hover:text-[#f4a825] transition-colors"
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
                            className={`w-8 h-8 rounded-full text-sm font-medium transition-all ${
                              page === pageNum
                                ? 'bg-[#f4a825] text-white'
                                : 'text-gray-600 hover:text-[#f4a825]'
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
                      className="px-4 py-2 text-sm font-medium text-gray-600 disabled:opacity-50 disabled:cursor-not-allowed hover:text-[#f4a825] transition-colors"
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

      {/* Search & Filter Modal - flat, full-width on mobile, no shadow */}
      {isSearchModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white w-full h-full sm:h-auto sm:max-w-lg mx-auto sm:my-8 flex flex-col">
            <div className="bg-[#1a2538] px-4 sm:px-6 py-4 flex justify-between items-center">
              <div className="flex items-center gap-3">
                <Search className="w-5 h-5 text-[#f4a825]" />
                <h2 className="text-lg font-semibold text-white">Search & Filter</h2>
              </div>
              <button
                onClick={() => setIsSearchModalOpen(false)}
                className="text-white/60 hover:text-white transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
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
                    className="w-full pl-10 pr-4 py-2.5 bg-gray-100 rounded-lg focus:outline-none focus:bg-white focus:ring-2 focus:ring-[#f4a825] transition-colors"
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
                  className="w-full px-4 py-2.5 bg-gray-100 rounded-lg focus:outline-none focus:bg-white focus:ring-2 focus:ring-[#f4a825] transition-colors mb-3"
                />
                <div className="flex flex-wrap gap-2">
                  {popularSkills.map(skill => (
                    <button
                      key={skill}
                      onClick={() => setTempSelectedSkill(skill)}
                      className={`text-xs px-3 py-1.5 rounded-full transition-colors ${
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
                    className="w-full pl-10 pr-4 py-2.5 bg-gray-100 rounded-lg focus:outline-none focus:bg-white focus:ring-2 focus:ring-[#f4a825] transition-colors"
                  />
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 pt-4 border-t border-gray-100 mt-auto">
                <button
                  onClick={handleResetFilters}
                  className="flex-1 px-4 py-2.5 text-gray-700 rounded-full font-medium hover:bg-gray-100 transition-colors"
                >
                  Reset All
                </button>
                <button
                  onClick={handleApplyFilters}
                  className="flex-1 bg-[#f4a825] text-white py-2.5 rounded-full font-semibold hover:bg-[#e09e1a] transition-colors"
                >
                  Apply Filters
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Contact Modal - flat, full-width on mobile */}
      {selectedTalent && talentContact && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white w-full h-full sm:h-auto sm:max-w-md mx-auto sm:my-8 flex flex-col">
            <div className="bg-[#1a2538] px-4 sm:px-6 py-4 flex justify-between items-center">
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

            <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-5">
              <div className="bg-gray-50 p-4">
                <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-3">Contact Information</p>
                <div className="space-y-2.5">
                  {talentContact.whatsappNumber && (
                    <div className="flex items-center gap-3 text-sm">
                      <div className="w-7 h-7 bg-green-100 rounded-full flex items-center justify-center">
                        <Smartphone className="w-3.5 h-3.5 text-green-600" />
                      </div>
                      <span className="text-gray-700">{talentContact.whatsappNumber}</span>
                    </div>
                  )}
                  {talentContact.email && (
                    <div className="flex items-center gap-3 text-sm">
                      <div className="w-7 h-7 bg-blue-100 rounded-full flex items-center justify-center">
                        <Mail className="w-3.5 h-3.5 text-blue-600" />
                      </div>
                      <span className="text-gray-700">{talentContact.email}</span>
                    </div>
                  )}
                  {talentContact.phoneNumber && (
                    <div className="flex items-center gap-3 text-sm">
                      <div className="w-7 h-7 bg-gray-100 rounded-full flex items-center justify-center">
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
                  className="w-full px-4 py-2.5 bg-gray-100 rounded-lg focus:outline-none focus:bg-white focus:ring-2 focus:ring-[#f4a825] transition-colors resize-none"
                  placeholder="Write your message here..."
                />
              </div>

              <button
                onClick={handleSendWhatsApp}
                disabled={isGenerating}
                className="w-full bg-green-600 text-white py-3 rounded-full font-semibold hover:bg-green-700 transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
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

export default Hire;