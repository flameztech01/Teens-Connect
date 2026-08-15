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

// ---- design tokens (same as dashboard) ----
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
    <div className="min-h-screen" style={{ backgroundColor: BG }}>
      <DashboardSidebar />

      <div className="lg:ml-72 relative">
        {/* Header - Dark theme with gold accent, matching Anonymous */}
        <div className="sticky top-0 z-30" style={{ backgroundColor: BG, borderBottom: `1px solid ${BORDER}` }}>
          <div className="px-4 sm:px-6 py-3">
            <div className="flex items-center justify-between flex-wrap gap-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 shrink-0 rounded-xl flex items-center justify-center" style={{ backgroundColor: GOLD_TINT }}>
                  <Briefcase className="w-5 h-5" style={{ color: GOLD }} />
                </div>
                <div>
                  <h1 className="text-base sm:text-lg font-semibold leading-tight" style={{ color: INK }}>Hire Talent</h1>
                  <p className="text-[11px] sm:text-xs" style={{ color: MUTED }}>
                    Discover and connect with talented teens
                  </p>
                </div>
              </div>

              {/* Search Button - gold on dark */}
              <button
                onClick={() => {
                  setTempSearchTerm(searchTerm);
                  setTempSelectedSkill(selectedSkill);
                  setTempSelectedLocation(selectedLocation);
                  setIsSearchModalOpen(true);
                }}
                className="flex items-center gap-2 px-4 sm:px-5 py-2 rounded-full text-sm font-semibold transition-all hover:scale-105"
                style={{ backgroundColor: GOLD, color: BG }}
              >
                <Search size={18} />
                <span>Search & Filter</span>
                <Sliders size={16} />
              </button>
            </div>

            {/* Active Filters - dark style */}
            {hasActiveFilters && (
              <div className="flex flex-wrap items-center gap-2 mt-3 pt-3 border-t" style={{ borderColor: BORDER }}>
                <span className="text-xs" style={{ color: MUTED }}>Active filters:</span>
                {searchTerm && (
                  <span className="inline-flex items-center gap-1 text-xs px-3 py-1 rounded-full" style={{ backgroundColor: GOLD_TINT, color: GOLD }}>
                    Search: {searchTerm}
                    <button onClick={() => setSearchTerm('')} className="hover:opacity-80">
                      <X size={12} />
                    </button>
                  </span>
                )}
                {selectedSkill && (
                  <span className="inline-flex items-center gap-1 text-xs px-3 py-1 rounded-full" style={{ backgroundColor: GOLD_TINT, color: GOLD }}>
                    Skill: {selectedSkill}
                    <button onClick={() => setSelectedSkill('')} className="hover:opacity-80">
                      <X size={12} />
                    </button>
                  </span>
                )}
                {selectedLocation && (
                  <span className="inline-flex items-center gap-1 text-xs px-3 py-1 rounded-full" style={{ backgroundColor: GOLD_TINT, color: GOLD }}>
                    Location: {selectedLocation}
                    <button onClick={() => setSelectedLocation('')} className="hover:opacity-80">
                      <X size={12} />
                    </button>
                  </span>
                )}
                <button
                  onClick={handleClearFilters}
                  className="text-xs underline hover:opacity-80 ml-2"
                  style={{ color: MUTED }}
                >
                  Clear all
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Main Content */}
        <div className="px-0 sm:px-0 pb-8">
          {/* Talents Section */}
          <div>
            <div className="flex justify-between items-center mb-3 px-3 sm:px-6">
              <h2 className="text-base font-semibold" style={{ color: INK }}>
                {hasActiveFilters ? 'Search Results' : 'All Talents'}
              </h2>
              <p className="text-xs" style={{ color: MUTED }}>{talentsData?.total || 0} talents</p>
            </div>

            {isLoading ? (
              <div className="text-center py-16">
                <div className="inline-block animate-spin rounded-full h-10 w-10 border-3" style={{ borderColor: BORDER, borderTopColor: GOLD }} />
                <p className="text-sm mt-4" style={{ color: MUTED }}>Loading talents...</p>
              </div>
            ) : talentsData?.talents?.length === 0 ? (
              <div className="px-3 sm:px-6">
                <CardShell>
                  <div className="text-center py-8">
                    <Briefcase className="w-16 h-16 mx-auto mb-4" style={{ color: MUTED }} />
                    <h3 className="text-lg font-semibold mb-2" style={{ color: INK }}>No talents found</h3>
                    <p className="text-sm" style={{ color: MUTED }}>Try adjusting your search or filters</p>
                    <button
                      onClick={handleClearFilters}
                      className="mt-4 font-medium hover:opacity-80"
                      style={{ color: GOLD }}
                    >
                      Clear all filters
                    </button>
                  </div>
                </CardShell>
              </div>
            ) : (
              <>
                {/* Talents List - WhatsApp style, full width with thin separators */}
                <div className="divide-y" style={{ borderColor: BORDER }}>
                  {talentsData?.talents?.map((talent) => (
                    <div
                      key={talent._id}
                      className="px-3 sm:px-6 py-3 sm:py-4 transition-all duration-200 hover:bg-white/5 cursor-pointer"
                      onClick={() => handleContactTalent(talent)}
                    >
                      <div className="flex items-start gap-3 sm:gap-4">
                        {talent.profile ? (
                          <img src={talent.profile} alt={talent.name} className="w-12 h-12 sm:w-14 sm:h-14 rounded-full object-cover flex-shrink-0" />
                        ) : (
                          <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full flex items-center justify-center flex-shrink-0" style={{ backgroundColor: 'rgba(255,255,255,0.04)' }}>
                            <UserCircle className="w-7 h-7 sm:w-8 sm:h-8" style={{ color: MUTED }} />
                          </div>
                        )}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2">
                            <div className="min-w-0">
                              <h3 className="font-semibold text-sm sm:text-base truncate" style={{ color: INK }}>{talent.name}</h3>
                              <div className="flex items-center gap-1 text-xs sm:text-sm mt-0.5" style={{ color: MUTED }}>
                                <MapPin size={12} className="sm:w-[14px] sm:h-[14px]" />
                                <span className="truncate">{talent.location || 'Location not specified'}</span>
                              </div>
                            </div>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleContactTalent(talent);
                              }}
                              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-full transition-all hover:scale-105 flex-shrink-0"
                              style={{ backgroundColor: GOLD, color: BG }}
                            >
                              <MessageCircle size={13} />
                              <span className="hidden sm:inline">Contact</span>
                            </button>
                          </div>

                          {talent.bio && (
                            <p className="text-xs sm:text-sm mt-1.5 line-clamp-2 leading-relaxed" style={{ color: MUTED }}>{talent.bio}</p>
                          )}

                          {talent.skills && talent.skills.length > 0 && (
                            <div className="flex flex-wrap gap-1.5 mt-2">
                              {talent.skills.slice(0, 4).map((skill, idx) => (
                                <span key={idx} className="inline-flex items-center gap-1 text-[10px] sm:text-xs px-2 py-0.5 rounded-full" style={{ backgroundColor: 'rgba(255,255,255,0.04)', color: MUTED }}>
                                  {getSkillIcon(skill)}
                                  {skill}
                                </span>
                              ))}
                              {talent.skills.length > 4 && (
                                <span className="text-[10px] sm:text-xs px-2 py-0.5 rounded-full" style={{ backgroundColor: 'rgba(255,255,255,0.04)', color: MUTED }}>
                                  +{talent.skills.length - 4}
                                </span>
                              )}
                            </div>
                          )}

                          <div className="flex items-center gap-3 mt-2">
                            {talent.portfolioLink && (
                              <a
                                href={talent.portfolioLink}
                                target="_blank"
                                rel="noopener noreferrer"
                                onClick={(e) => e.stopPropagation()}
                                className="inline-flex items-center gap-1 text-[10px] sm:text-xs transition-colors hover:opacity-80"
                                style={{ color: BLUE }}
                              >
                                <LinkIcon size={11} />
                                Portfolio
                              </a>
                            )}
                            {talent.cv && (
                              <a
                                href={talent.cv}
                                target="_blank"
                                rel="noopener noreferrer"
                                onClick={(e) => e.stopPropagation()}
                                className="inline-flex items-center gap-1 text-[10px] sm:text-xs transition-colors hover:opacity-80"
                                style={{ color: GREEN }}
                              >
                                <FileText size={11} />
                                CV
                              </a>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Pagination - dark style */}
                {talentsData && talentsData.pages > 1 && (
                  <div className="flex justify-center gap-3 mt-6 px-3 sm:px-6">
                    <button
                      onClick={() => setPage(p => Math.max(1, p - 1))}
                      disabled={page === 1}
                      className="px-4 py-2 text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      style={{ color: MUTED }}
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
                                ? 'bg-[#f4a825] text-[#0c0c0d]'
                                : 'text-gray-400 hover:text-white'
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
                      className="px-4 py-2 text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      style={{ color: MUTED }}
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

      {/* Search & Filter Modal - dark theme */}
      {isSearchModalOpen && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="w-full h-full sm:h-auto sm:max-w-lg mx-auto sm:my-8 flex flex-col" style={{ backgroundColor: CARD, border: `1px solid ${BORDER}` }}>
            <div className="px-4 sm:px-6 py-4 flex justify-between items-center" style={{ borderBottom: `1px solid ${BORDER}` }}>
              <div className="flex items-center gap-3">
                <Search className="w-5 h-5" style={{ color: GOLD }} />
                <h2 className="text-lg font-semibold" style={{ color: INK }}>Search & Filter</h2>
              </div>
              <button
                onClick={() => setIsSearchModalOpen(false)}
                className="transition-colors hover:opacity-80"
                style={{ color: MUTED }}
              >
                <X size={20} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
              {/* Search Input */}
              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: MUTED }}>
                  Search by name or bio
                </label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5" style={{ color: MUTED }} />
                  <input
                    type="text"
                    placeholder="Search talents..."
                    value={tempSearchTerm}
                    onChange={(e) => setTempSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl focus:outline-none focus:ring-2 transition-colors"
                    style={{
                      backgroundColor: 'rgba(255,255,255,0.04)',
                      color: INK,
                      border: `1px solid ${BORDER}`,
                      focusRing: GOLD,
                    }}
                  />
                </div>
              </div>

              {/* Skill Filter */}
              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: MUTED }}>
                  Filter by skill
                </label>
                <input
                  type="text"
                  placeholder="Enter a skill..."
                  value={tempSelectedSkill}
                  onChange={(e) => setTempSelectedSkill(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl focus:outline-none focus:ring-2 transition-colors mb-3"
                  style={{
                    backgroundColor: 'rgba(255,255,255,0.04)',
                    color: INK,
                    border: `1px solid ${BORDER}`,
                    focusRing: GOLD,
                  }}
                />
                <div className="flex flex-wrap gap-2">
                  {popularSkills.map(skill => (
                    <button
                      key={skill}
                      onClick={() => setTempSelectedSkill(skill)}
                      className={`text-xs px-3 py-1.5 rounded-full transition-colors ${
                        tempSelectedSkill === skill
                          ? 'bg-[#f4a825] text-[#0c0c0d]'
                          : 'bg-[rgba(255,255,255,0.04)] text-gray-400 hover:text-white'
                      }`}
                    >
                      {skill}
                    </button>
                  ))}
                </div>
              </div>

              {/* Location Filter */}
              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: MUTED }}>
                  Filter by location
                </label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5" style={{ color: MUTED }} />
                  <input
                    type="text"
                    placeholder="City, state, or country..."
                    value={tempSelectedLocation}
                    onChange={(e) => setTempSelectedLocation(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl focus:outline-none focus:ring-2 transition-colors"
                    style={{
                      backgroundColor: 'rgba(255,255,255,0.04)',
                      color: INK,
                      border: `1px solid ${BORDER}`,
                      focusRing: GOLD,
                    }}
                  />
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 pt-4" style={{ borderTop: `1px solid ${BORDER}` }}>
                <button
                  onClick={handleResetFilters}
                  className="flex-1 px-4 py-2.5 rounded-full font-medium transition-colors hover:bg-white/5"
                  style={{ color: MUTED }}
                >
                  Reset All
                </button>
                <button
                  onClick={handleApplyFilters}
                  className="flex-1 py-2.5 rounded-full font-semibold transition-colors hover:opacity-90"
                  style={{ backgroundColor: GOLD, color: BG }}
                >
                  Apply Filters
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Contact Modal - dark theme */}
      {selectedTalent && talentContact && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="w-full h-full sm:h-auto sm:max-w-md mx-auto sm:my-8 flex flex-col" style={{ backgroundColor: CARD, border: `1px solid ${BORDER}` }}>
            <div className="px-4 sm:px-6 py-4 flex justify-between items-center" style={{ borderBottom: `1px solid ${BORDER}` }}>
              <div className="flex items-center gap-3">
                <MessageCircle className="w-5 h-5" style={{ color: GOLD }} />
                <h2 className="text-lg font-semibold" style={{ color: INK }}>Contact {selectedTalent.name}</h2>
              </div>
              <button
                onClick={() => setSelectedTalent(null)}
                className="transition-colors hover:opacity-80"
                style={{ color: MUTED }}
              >
                <X size={20} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-5">
              <div className="p-4 rounded-xl" style={{ backgroundColor: 'rgba(255,255,255,0.03)' }}>
                <p className="text-xs font-medium uppercase tracking-wide mb-3" style={{ color: MUTED }}>Contact Information</p>
                <div className="space-y-2.5">
                  {talentContact.whatsappNumber && (
                    <div className="flex items-center gap-3 text-sm">
                      <div className="w-7 h-7 rounded-full flex items-center justify-center" style={{ backgroundColor: 'rgba(34,197,94,0.12)' }}>
                        <Smartphone className="w-3.5 h-3.5" style={{ color: GREEN }} />
                      </div>
                      <span style={{ color: INK }}>{talentContact.whatsappNumber}</span>
                    </div>
                  )}
                  {talentContact.email && (
                    <div className="flex items-center gap-3 text-sm">
                      <div className="w-7 h-7 rounded-full flex items-center justify-center" style={{ backgroundColor: 'rgba(59,130,246,0.12)' }}>
                        <Mail className="w-3.5 h-3.5" style={{ color: BLUE }} />
                      </div>
                      <span style={{ color: INK }}>{talentContact.email}</span>
                    </div>
                  )}
                  {talentContact.phoneNumber && (
                    <div className="flex items-center gap-3 text-sm">
                      <div className="w-7 h-7 rounded-full flex items-center justify-center" style={{ backgroundColor: 'rgba(255,255,255,0.04)' }}>
                        <Phone className="w-3.5 h-3.5" style={{ color: MUTED }} />
                      </div>
                      <span style={{ color: INK }}>{talentContact.phoneNumber}</span>
                    </div>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: MUTED }}>
                  Your Message
                </label>
                <textarea
                  value={messageText}
                  onChange={(e) => setMessageText(e.target.value)}
                  rows={4}
                  className="w-full px-4 py-2.5 rounded-xl focus:outline-none focus:ring-2 transition-colors resize-none"
                  style={{
                    backgroundColor: 'rgba(255,255,255,0.04)',
                    color: INK,
                    border: `1px solid ${BORDER}`,
                    focusRing: GOLD,
                  }}
                  placeholder="Write your message here..."
                />
              </div>

              <button
                onClick={handleSendWhatsApp}
                disabled={isGenerating}
                className="w-full py-3 rounded-full font-semibold transition-colors hover:opacity-90 flex items-center justify-center gap-2 disabled:opacity-50"
                style={{ backgroundColor: GREEN, color: '#fff' }}
              >
                {isGenerating ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    <Send size={18} />
                    Send via WhatsApp
                  </>
                )}
              </button>

              <div className="flex items-center justify-center gap-2 text-xs" style={{ color: MUTED }}>
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