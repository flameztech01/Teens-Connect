import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Briefcase,
  Search,
  MapPin,
  Link as LinkIcon,
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
  ChevronDown,
  X,
  Loader,
  Send,
  Shield,
  Smartphone,
  Mail,
  Phone,
  Filter,
  Star,
  Sparkles,
  Users,
  MoreVertical,
  Bookmark,
  Copy,
  Eye,
  Plus,
  Bell
} from 'lucide-react';
import {
  useGetTalentsQuery,
  useGetTalentContactQuery,
  useGenerateWhatsAppMessageMutation
} from '../slices/hireApiSlice';

// ---- design tokens ----
const BG = '#0b0b0e';
const CARD = '#14141a';
const CARD_HOVER = '#1c1c24';
const INK = '#ffffff';
const MUTED = 'rgba(255,255,255,0.5)';
const BORDER = 'rgba(255,255,255,0.06)';
const GOLD = '#f4a825';
const GOLD_DEEP = '#d4911f';
const GOLD_TINT = 'rgba(244,168,37,0.12)';
const GOLD_GLOW = 'rgba(244,168,37,0.2)';
const GREEN = '#22c55e';
const RED = '#ef4444';
const BLUE = '#3b82f6';

const Talents = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSkill, setSelectedSkill] = useState('');
  const [selectedLocation, setSelectedLocation] = useState('');
  const [selectedTalent, setSelectedTalent] = useState(null);
  const [messageText, setMessageText] = useState('');
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(12);
  const [tempSearchTerm, setTempSearchTerm] = useState('');
  const [tempSelectedSkill, setTempSelectedSkill] = useState('');
  const [tempSelectedLocation, setTempSelectedLocation] = useState('');

  // Selection state
  const [selectedIds, setSelectedIds] = useState([]);
  const [openMenuId, setOpenMenuId] = useState(null);
  const [limitMenuOpen, setLimitMenuOpen] = useState(false);

  const { data: talentsData, isLoading } = useGetTalentsQuery({
    page,
    limit,
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
    setOpenMenuId(null);
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
    const s = skill.toLowerCase();
    if (s.includes('design') || s.includes('ui') || s.includes('ux')) return <Palette size={12} />;
    if (s.includes('code') || s.includes('programming') || s.includes('react') || s.includes('javascript')) return <Code size={12} />;
    if (s.includes('music') || s.includes('sing')) return <Mic size={12} />;
    if (s.includes('photo') || s.includes('video')) return <Camera size={12} />;
    if (s.includes('write') || s.includes('content')) return <PenTool size={12} />;
    return <TrendingUp size={12} />;
  };

  const popularSkills = ['React', 'JavaScript', 'UI/UX Design', 'Graphic Design', 'Content Writing', 'Video Editing', 'Digital Marketing', 'Python'];

  const hasActiveFilters = searchTerm || selectedSkill || selectedLocation;

  const talents = talentsData?.talents || [];
  const allOnPageSelected = talents.length > 0 && talents.every(t => selectedIds.includes(t._id));

  const toggleSelectAll = () => {
    if (allOnPageSelected) {
      setSelectedIds(prev => prev.filter(id => !talents.some(t => t._id === id)));
    } else {
      setSelectedIds(prev => [...new Set([...prev, ...talents.map(t => t._id)])]);
    }
  };

  const toggleSelectOne = (id) => {
    setSelectedIds(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  };

  const clearSelection = () => setSelectedIds([]);

  const getStatusBadge = (talent) => {
    const status = talent.status || (talent.verified ? 'Verified' : 'Active');
    const styles = {
      Active: { bg: 'rgba(34,197,94,0.12)', color: GREEN },
      Verified: { bg: GOLD_TINT, color: GOLD },
      'Not Active': { bg: 'rgba(239,68,68,0.12)', color: RED },
      Unverified: { bg: 'rgba(255,255,255,0.08)', color: MUTED }
    };
    const s = styles[status] || styles.Active;
    return (
      <span className="text-[10px] font-medium px-2 py-0.5 rounded-md" style={{ backgroundColor: s.bg, color: s.color }}>
        {status}
      </span>
    );
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: BG }}>
      {/* Top Bar */}
      <div className="sticky top-0 z-30" style={{ backgroundColor: BG, borderBottom: `1px solid ${BORDER}` }}>
        <div className="max-w-7xl mx-auto px-3 sm:px-6 py-3">
          <div className="flex items-center justify-between gap-2 sm:gap-4">
            <div className="flex items-center gap-2">
              <div className="p-1.5 sm:p-2 rounded-lg flex items-center justify-center" style={{ backgroundColor: GOLD_TINT }}>
                <Briefcase size={16} className="sm:w-[18px] sm:h-[18px]" style={{ color: GOLD }} />
              </div>
              <div>
                <h1 className="text-sm sm:text-base font-semibold" style={{ color: INK }}>Find Talent</h1>
                <p className="text-[8px] sm:text-[10px] uppercase tracking-wider" style={{ color: MUTED }}>Discover & Hire</p>
              </div>
            </div>

            <div className="flex-1 max-w-xs hidden md:block">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: MUTED }} />
                <input
                  type="text"
                  placeholder="Quick search..."
                  value={searchTerm}
                  onChange={(e) => { setSearchTerm(e.target.value); setPage(1); }}
                  className="w-full pl-9 pr-3 py-1.5 rounded-lg text-xs focus:outline-none"
                  style={{ backgroundColor: 'rgba(255,255,255,0.04)', color: INK, border: `1px solid ${BORDER}` }}
                />
              </div>
            </div>

            <div className="flex items-center gap-1.5 sm:gap-3">
              <button className="p-1.5 sm:p-2 rounded-lg relative" style={{ backgroundColor: 'rgba(255,255,255,0.04)', border: `1px solid ${BORDER}` }}>
                <Bell size={14} className="sm:w-[16px] sm:h-[16px]" style={{ color: MUTED }} />
              </button>
              <button
                onClick={() => {
                  setTempSearchTerm(searchTerm);
                  setTempSelectedSkill(selectedSkill);
                  setTempSelectedLocation(selectedLocation);
                  setIsSearchModalOpen(true);
                }}
                className="flex items-center gap-1 sm:gap-2 px-2 sm:px-3 py-1.5 sm:py-2 rounded-lg text-xs sm:text-sm font-semibold transition hover:opacity-90"
                style={{ backgroundColor: GOLD, color: '#0b0b0e' }}
              >
                <Filter size={12} className="sm:w-[14px] sm:h-[14px]" />
                <span className="hidden sm:inline">Filters</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-3 sm:px-6 py-4 sm:py-6" id="talents-section">
        {/* List header */}
        <div className="rounded-xl mb-3 sm:mb-4" style={{ backgroundColor: CARD, border: `1px solid ${BORDER}` }}>
          <div className="flex flex-wrap items-center justify-between gap-2 px-3 sm:px-4 py-2 sm:py-3">
            <div className="flex items-center gap-2 sm:gap-3">
              <label className="flex items-center gap-1.5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={allOnPageSelected}
                  onChange={toggleSelectAll}
                  className="w-3.5 h-3.5 sm:w-4 sm:h-4 rounded accent-[#f4a825]"
                />
              </label>
              <h2 className="text-sm sm:text-base font-semibold" style={{ color: INK }}>
                {talentsData?.total || 0} Talents
              </h2>
              {hasActiveFilters && (
                <span className="text-[10px] px-1.5 py-0.5 rounded-full" style={{ backgroundColor: GOLD_TINT, color: GOLD }}>
                  Filtered
                </span>
              )}
            </div>

            {selectedIds.length > 0 ? (
              <div className="flex items-center gap-1.5 sm:gap-2">
                <span className="text-[10px] sm:text-xs px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-lg" style={{ backgroundColor: GOLD_TINT, color: GOLD }}>
                  {selectedIds.length} Selected
                </span>
                <button
                  onClick={() => {
                    const first = talents.find(t => t._id === selectedIds[0]);
                    if (first) handleContactTalent(first);
                  }}
                  className="flex items-center gap-1 px-2 sm:px-3 py-1 sm:py-1.5 rounded-lg text-[10px] sm:text-xs font-medium transition hover:opacity-90"
                  style={{ backgroundColor: GOLD, color: '#0b0b0e' }}
                >
                  <MessageCircle size={11} className="sm:w-[12px] sm:h-[12px]" /> Contact
                </button>
                <button
                  onClick={clearSelection}
                  className="flex items-center gap-1 px-2 sm:px-3 py-1 sm:py-1.5 rounded-lg text-[10px] sm:text-xs font-medium"
                  style={{ border: `1px solid ${BORDER}`, color: MUTED }}
                >
                  <X size={11} className="sm:w-[12px] sm:h-[12px]" /> Clear
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-1.5 flex-wrap">
                {hasActiveFilters && (
                  <>
                    {searchTerm && (
                      <span className="inline-flex items-center gap-0.5 text-[10px] px-1.5 py-0.5 rounded-lg" style={{ backgroundColor: GOLD_TINT, color: GOLD }}>
                        {searchTerm}
                        <button onClick={() => setSearchTerm('')} className="hover:opacity-70"><X size={8} /></button>
                      </span>
                    )}
                    {selectedSkill && (
                      <span className="inline-flex items-center gap-0.5 text-[10px] px-1.5 py-0.5 rounded-lg" style={{ backgroundColor: GOLD_TINT, color: GOLD }}>
                        {selectedSkill}
                        <button onClick={() => setSelectedSkill('')} className="hover:opacity-70"><X size={8} /></button>
                      </span>
                    )}
                    {selectedLocation && (
                      <span className="inline-flex items-center gap-0.5 text-[10px] px-1.5 py-0.5 rounded-lg" style={{ backgroundColor: GOLD_TINT, color: GOLD }}>
                        {selectedLocation}
                        <button onClick={() => setSelectedLocation('')} className="hover:opacity-70"><X size={8} /></button>
                      </span>
                    )}
                    <button onClick={handleClearFilters} className="text-[10px] hover:underline" style={{ color: MUTED }}>Clear all</button>
                  </>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Talent Cards Grid - 2 columns on mobile, 4 on large */}
        {isLoading ? (
          <div className="text-center py-12 rounded-xl" style={{ backgroundColor: CARD, border: `1px solid ${BORDER}` }}>
            <Loader className="w-8 h-8 animate-spin mx-auto mb-3" style={{ color: GOLD }} />
            <p className="text-sm" style={{ color: MUTED }}>Loading talents...</p>
          </div>
        ) : talents.length === 0 ? (
          <div className="text-center py-12 rounded-xl" style={{ backgroundColor: CARD, border: `1px solid ${BORDER}` }}>
            <Briefcase className="w-12 h-12 mx-auto mb-3" style={{ color: MUTED }} />
            <h3 className="text-base font-semibold" style={{ color: INK }}>No talents found</h3>
            <p className="text-sm" style={{ color: MUTED }}>Try adjusting your search or filters</p>
            <button onClick={handleClearFilters} className="mt-3 text-sm font-medium hover:opacity-80" style={{ color: GOLD }}>Clear all filters</button>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2 sm:gap-4">
              {talents.map((talent) => {
                const isChecked = selectedIds.includes(talent._id);
                return (
                  <div
                    key={talent._id}
                    className="relative rounded-xl p-2.5 sm:p-4 transition-all duration-200 flex flex-col"
                    style={{
                      backgroundColor: isChecked ? CARD_HOVER : CARD,
                      border: `1px solid ${isChecked ? GOLD : BORDER}`,
                      minHeight: '260px',
                    }}
                  >
                    {/* Top row: checkbox, status, menu */}
                    <div className="flex items-center justify-between mb-2 sm:mb-3">
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={() => toggleSelectOne(talent._id)}
                        className="w-3 h-3 sm:w-4 sm:h-4 rounded accent-[#f4a825]"
                      />
                      <div className="flex items-center gap-1">
                        {getStatusBadge(talent)}
                        <div className="relative">
                          <button
                            onClick={() => setOpenMenuId(openMenuId === talent._id ? null : talent._id)}
                            className="p-0.5 sm:p-1 rounded-md hover:bg-white/5"
                          >
                            <MoreVertical size={12} className="sm:w-[14px] sm:h-[14px]" style={{ color: MUTED }} />
                          </button>
                          {openMenuId === talent._id && (
                            <div
                              className="absolute right-0 top-6 sm:top-7 w-36 sm:w-40 rounded-lg shadow-xl z-20 overflow-hidden"
                              style={{ backgroundColor: CARD_HOVER, border: `1px solid ${BORDER}` }}
                            >
                              <button
                                onClick={() => { navigate(`/talents/${talent._id}`); setOpenMenuId(null); }}
                                className="w-full flex items-center gap-2 px-2 sm:px-3 py-1.5 sm:py-2 text-[10px] sm:text-xs hover:bg-white/5"
                                style={{ color: INK }}
                              >
                                <Eye size={11} className="sm:w-[12px] sm:h-[12px]" /> View Profile
                              </button>
                              <button
                                onClick={() => handleContactTalent(talent)}
                                className="w-full flex items-center gap-2 px-2 sm:px-3 py-1.5 sm:py-2 text-[10px] sm:text-xs hover:bg-white/5"
                                style={{ color: INK }}
                              >
                                <MessageCircle size={11} className="sm:w-[12px] sm:h-[12px]" /> Contact
                              </button>
                              {talent.portfolioLink && (
                                <button
                                  onClick={() => { navigator.clipboard.writeText(talent.portfolioLink); setOpenMenuId(null); }}
                                  className="w-full flex items-center gap-2 px-2 sm:px-3 py-1.5 sm:py-2 text-[10px] sm:text-xs hover:bg-white/5"
                                  style={{ color: INK }}
                                >
                                  <Copy size={11} className="sm:w-[12px] sm:h-[12px]" /> Copy Link
                                </button>
                              )}
                              <button
                                onClick={() => setOpenMenuId(null)}
                                className="w-full flex items-center gap-2 px-2 sm:px-3 py-1.5 sm:py-2 text-[10px] sm:text-xs hover:bg-white/5 border-t"
                                style={{ color: MUTED, borderColor: BORDER }}
                              >
                                <Bookmark size={11} className="sm:w-[12px] sm:h-[12px]" /> Save
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Avatar - centered */}
                    <div className="flex justify-center mb-2 sm:mb-3">
                      {talent.profile ? (
                        <img src={talent.profile} alt={talent.name} className="w-14 h-14 sm:w-20 sm:h-20 rounded-full object-cover ring-2" style={{ ringColor: GOLD_TINT }} />
                      ) : (
                        <div className="w-14 h-14 sm:w-20 sm:h-20 rounded-full flex items-center justify-center" style={{ background: `linear-gradient(135deg, ${GOLD_DEEP}, ${GOLD})` }}>
                          <span className="text-white font-bold text-lg sm:text-2xl">{talent.name?.charAt(0).toUpperCase() || 'U'}</span>
                        </div>
                      )}
                    </div>

                    {/* Name & title */}
                    <div className="text-center mb-1 sm:mb-2">
                      <h3 className="font-semibold text-xs sm:text-base truncate" style={{ color: INK }}>{talent.name}</h3>
                      <p className="text-[10px] sm:text-xs truncate" style={{ color: MUTED }}>{talent.skills?.[0] || 'Talent'}</p>
                    </div>

                    {/* Skills & Location - compact row */}
                    <div className="flex flex-wrap justify-center gap-1 mb-2 sm:mb-3">
                      {talent.skills?.slice(0, 2).map((skill, idx) => (
                        <span key={idx} className="inline-flex items-center gap-0.5 text-[8px] sm:text-[10px] px-1.5 sm:px-2 py-0.5 rounded-md" style={{ backgroundColor: 'rgba(255,255,255,0.05)', color: MUTED }}>
                          {getSkillIcon(skill)}
                          <span className="truncate max-w-[40px] sm:max-w-[60px]">{skill}</span>
                        </span>
                      ))}
                      {(talent.skills?.length || 0) > 2 && <span className="text-[8px] sm:text-[10px]" style={{ color: MUTED }}>+{talent.skills.length - 2}</span>}
                    </div>

                    {/* Location */}
                    <div className="flex items-center justify-center gap-1 text-[10px] sm:text-xs mb-2 sm:mb-3" style={{ color: MUTED }}>
                      <MapPin size={10} className="sm:w-[12px] sm:h-[12px]" />
                      <span className="truncate">{talent.location || 'Remote'}</span>
                    </div>

                    {/* Contact row (portfolio/cv links) - hide on very small screens to save space */}
                    <div className="hidden sm:flex items-center justify-center gap-2 sm:gap-3 mb-2 sm:mb-3">
                      {talent.portfolioLink && (
                        <a href={talent.portfolioLink} target="_blank" rel="noopener noreferrer" className="text-[10px] flex items-center gap-1 transition hover:opacity-80" style={{ color: BLUE }} onClick={e => e.stopPropagation()}>
                          <LinkIcon size={10} className="sm:w-[12px] sm:h-[12px]" /> Portfolio
                        </a>
                      )}
                      {talent.cv && (
                        <a href={talent.cv} target="_blank" rel="noopener noreferrer" className="text-[10px] flex items-center gap-1 transition hover:opacity-80" style={{ color: GREEN }} onClick={e => e.stopPropagation()}>
                          <FileText size={10} className="sm:w-[12px] sm:h-[12px]" /> CV
                        </a>
                      )}
                    </div>

                    {/* Contact button */}
                    <button
                      onClick={() => handleContactTalent(talent)}
                      className="mt-auto w-full py-1 sm:py-1.5 rounded-lg text-[10px] sm:text-xs font-semibold transition hover:opacity-90 flex items-center justify-center gap-1 sm:gap-1.5"
                      style={{ backgroundColor: GOLD, color: '#0b0b0e' }}
                    >
                      <MessageCircle size={10} className="sm:w-[12px] sm:h-[12px]" /> Contact
                    </button>
                  </div>
                );
              })}
            </div>

            {/* Pagination & per-page controls */}
            <div className="flex flex-wrap items-center justify-between gap-2 sm:gap-3 mt-4 sm:mt-6 pt-3 sm:pt-4 border-t" style={{ borderColor: BORDER }}>
              <div className="flex items-center gap-1.5 sm:gap-2 relative">
                <span className="text-[10px] sm:text-xs" style={{ color: MUTED }}>View</span>
                <button
                  onClick={() => setLimitMenuOpen(!limitMenuOpen)}
                  className="flex items-center gap-0.5 px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-lg text-[10px] sm:text-xs"
                  style={{ border: `1px solid ${BORDER}`, color: INK }}
                >
                  {limit} <ChevronDown size={10} className="sm:w-[12px] sm:h-[12px]" />
                </button>
                {limitMenuOpen && (
                  <div className="absolute bottom-6 sm:bottom-8 left-8 sm:left-10 w-16 sm:w-20 rounded-lg shadow-xl z-20 overflow-hidden" style={{ backgroundColor: CARD_HOVER, border: `1px solid ${BORDER}` }}>
                    {[10, 12, 24, 48].map(n => (
                      <button
                        key={n}
                        onClick={() => { setLimit(n); setPage(1); setLimitMenuOpen(false); }}
                        className="w-full text-[10px] sm:text-xs px-2 sm:px-3 py-1.5 sm:py-2 hover:bg-white/5 text-left"
                        style={{ color: n === limit ? GOLD : INK }}
                      >
                        {n}
                      </button>
                    ))}
                  </div>
                )}
                <span className="text-[10px] sm:text-xs" style={{ color: MUTED }}>per page</span>
              </div>

              {talentsData && talentsData.pages > 1 && (
                <div className="flex items-center gap-1 sm:gap-2">
                  <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1} className="px-1.5 sm:px-3 py-1 sm:py-1.5 rounded-lg text-[10px] sm:text-xs font-medium transition disabled:opacity-50 flex items-center gap-0.5 sm:gap-1" style={{ border: `1px solid ${BORDER}`, color: MUTED }}>
                    <ChevronLeft size={10} className="sm:w-[14px] sm:h-[14px]" /> Prev
                  </button>
                  <div className="flex items-center gap-0.5 sm:gap-1.5">
                    {Array.from({ length: Math.min(5, talentsData.pages) }, (_, i) => {
                      let pageNum;
                      if (talentsData.pages <= 5) pageNum = i + 1;
                      else if (page <= 3) pageNum = i + 1;
                      else if (page >= talentsData.pages - 2) pageNum = talentsData.pages - 4 + i;
                      else pageNum = page - 2 + i;
                      const isActive = page === pageNum;
                      return (
                        <button
                          key={pageNum}
                          onClick={() => setPage(pageNum)}
                          className="w-5 h-5 sm:w-7 sm:h-7 rounded-lg text-[10px] sm:text-xs font-medium transition"
                          style={isActive
                            ? { backgroundColor: GOLD, color: '#0b0b0e' }
                            : { border: `1px solid ${BORDER}`, color: MUTED }}
                        >
                          {pageNum}
                        </button>
                      );
                    })}
                    {talentsData.pages > 5 && <span className="text-[10px] px-0.5 sm:px-1" style={{ color: MUTED }}>...</span>}
                  </div>
                  <button onClick={() => setPage(p => Math.min(talentsData.pages, p + 1))} disabled={page === talentsData.pages} className="px-1.5 sm:px-3 py-1 sm:py-1.5 rounded-lg text-[10px] sm:text-xs font-medium transition disabled:opacity-50 flex items-center gap-0.5 sm:gap-1" style={{ border: `1px solid ${BORDER}`, color: MUTED }}>
                    Next <ChevronRight size={10} className="sm:w-[14px] sm:h-[14px]" />
                  </button>
                </div>
              )}
            </div>
          </>
        )}
      </div>

      {/* Search & Filter Modal */}
      {isSearchModalOpen && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-md flex items-center justify-center z-50 p-3 sm:p-4">
          <div className="rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto" style={{ backgroundColor: CARD, border: `1px solid ${BORDER}` }}>
            <div className="px-4 sm:px-6 py-3 sm:py-4 border-b" style={{ borderColor: BORDER }}>
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2 sm:gap-3">
                  <Search className="w-4 h-4 sm:w-5 sm:h-5" style={{ color: GOLD }} />
                  <h2 className="text-base sm:text-lg font-semibold" style={{ color: INK }}>Search & Filter</h2>
                </div>
                <button onClick={() => setIsSearchModalOpen(false)} className="transition hover:opacity-70" style={{ color: MUTED }}>
                  <X size={18} className="sm:w-[20px] sm:h-[20px]" />
                </button>
              </div>
            </div>
            <div className="p-4 sm:p-6 space-y-4 sm:space-y-6">
              <div>
                <label className="block text-xs sm:text-sm font-medium mb-1.5 sm:mb-2" style={{ color: MUTED }}>Search by name, bio, or skills</label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5" style={{ color: MUTED }} />
                  <input type="text" placeholder="Search talents..." value={tempSearchTerm} onChange={(e) => setTempSearchTerm(e.target.value)} className="w-full pl-9 sm:pl-10 pr-3 sm:pr-4 py-2 sm:py-2.5 rounded-xl focus:outline-none focus:ring-2 text-sm" style={{ backgroundColor: 'rgba(255,255,255,0.04)', color: INK, border: `1px solid ${BORDER}` }} />
                </div>
              </div>
              <div>
                <label className="block text-xs sm:text-sm font-medium mb-1.5 sm:mb-2" style={{ color: MUTED }}>Filter by skill</label>
                <input type="text" placeholder="Enter a skill..." value={tempSelectedSkill} onChange={(e) => setTempSelectedSkill(e.target.value)} className="w-full px-3 sm:px-4 py-2 sm:py-2.5 rounded-xl focus:outline-none focus:ring-2 mb-2 sm:mb-3 text-sm" style={{ backgroundColor: 'rgba(255,255,255,0.04)', color: INK, border: `1px solid ${BORDER}` }} />
                <div className="flex flex-wrap gap-1.5 sm:gap-2">
                  {popularSkills.map(skill => (
                    <button
                      key={skill}
                      onClick={() => setTempSelectedSkill(skill)}
                      className="text-[10px] sm:text-xs px-2 sm:px-3 py-1 sm:py-1.5 rounded-full transition"
                      style={tempSelectedSkill === skill
                        ? { backgroundColor: GOLD, color: '#0b0b0e' }
                        : { backgroundColor: 'rgba(255,255,255,0.04)', color: MUTED }}
                    >
                      {skill}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-xs sm:text-sm font-medium mb-1.5 sm:mb-2" style={{ color: MUTED }}>Filter by location</label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5" style={{ color: MUTED }} />
                  <input type="text" placeholder="City, state, or country..." value={tempSelectedLocation} onChange={(e) => setTempSelectedLocation(e.target.value)} className="w-full pl-9 sm:pl-10 pr-3 sm:pr-4 py-2 sm:py-2.5 rounded-xl focus:outline-none focus:ring-2 text-sm" style={{ backgroundColor: 'rgba(255,255,255,0.04)', color: INK, border: `1px solid ${BORDER}` }} />
                </div>
              </div>
              <div className="flex gap-2 sm:gap-3 pt-3 sm:pt-4 border-t" style={{ borderColor: BORDER }}>
                <button onClick={handleResetFilters} className="flex-1 px-3 sm:px-4 py-2 sm:py-2.5 rounded-xl font-medium transition hover:bg-white/5 text-sm" style={{ border: `1px solid ${BORDER}`, color: MUTED }}>Reset All</button>
                <button onClick={handleApplyFilters} className="flex-1 py-2 sm:py-2.5 rounded-xl font-semibold transition hover:opacity-90 text-sm" style={{ backgroundColor: GOLD, color: '#0b0b0e' }}>Apply Filters</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Contact Modal */}
      {selectedTalent && talentContact && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-md flex items-center justify-center z-50 p-3 sm:p-4">
          <div className="rounded-2xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto" style={{ backgroundColor: CARD, border: `1px solid ${BORDER}` }}>
            <div className="px-4 sm:px-6 py-3 sm:py-4 border-b" style={{ borderColor: BORDER }}>
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2 sm:gap-3">
                  <MessageCircle className="w-4 h-4 sm:w-5 sm:h-5" style={{ color: GOLD }} />
                  <h2 className="text-base sm:text-lg font-semibold" style={{ color: INK }}>Contact {selectedTalent.name}</h2>
                </div>
                <button onClick={() => setSelectedTalent(null)} className="transition hover:opacity-70" style={{ color: MUTED }}>
                  <X size={18} className="sm:w-[20px] sm:h-[20px]" />
                </button>
              </div>
            </div>
            <div className="p-4 sm:p-6 space-y-4 sm:space-y-5">
              <div className="rounded-xl p-3 sm:p-4" style={{ backgroundColor: 'rgba(255,255,255,0.03)', border: `1px solid ${BORDER}` }}>
                <p className="text-[10px] sm:text-xs font-medium uppercase tracking-wide mb-2 sm:mb-3" style={{ color: MUTED }}>Contact Information</p>
                <div className="space-y-2 sm:space-y-2.5">
                  {talentContact.whatsappNumber && (
                    <div className="flex items-center gap-2 sm:gap-3 text-xs sm:text-sm">
                      <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-lg flex items-center justify-center" style={{ backgroundColor: 'rgba(34,197,94,0.12)' }}>
                        <Smartphone className="w-3 h-3 sm:w-3.5 sm:h-3.5" style={{ color: GREEN }} />
                      </div>
                      <span style={{ color: INK }}>{talentContact.whatsappNumber}</span>
                    </div>
                  )}
                  {talentContact.email && (
                    <div className="flex items-center gap-2 sm:gap-3 text-xs sm:text-sm">
                      <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-lg flex items-center justify-center" style={{ backgroundColor: 'rgba(59,130,246,0.12)' }}>
                        <Mail className="w-3 h-3 sm:w-3.5 sm:h-3.5" style={{ color: BLUE }} />
                      </div>
                      <span style={{ color: INK }}>{talentContact.email}</span>
                    </div>
                  )}
                  {talentContact.phoneNumber && (
                    <div className="flex items-center gap-2 sm:gap-3 text-xs sm:text-sm">
                      <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-lg flex items-center justify-center" style={{ backgroundColor: 'rgba(255,255,255,0.04)' }}>
                        <Phone className="w-3 h-3 sm:w-3.5 sm:h-3.5" style={{ color: MUTED }} />
                      </div>
                      <span style={{ color: INK }}>{talentContact.phoneNumber}</span>
                    </div>
                  )}
                </div>
              </div>
              <div>
                <label className="block text-xs sm:text-sm font-medium mb-1.5 sm:mb-2" style={{ color: MUTED }}>Your Message</label>
                <textarea value={messageText} onChange={(e) => setMessageText(e.target.value)} rows={4} className="w-full px-3 sm:px-4 py-2 sm:py-2.5 rounded-xl focus:outline-none focus:ring-2 resize-none text-sm" style={{ backgroundColor: 'rgba(255,255,255,0.04)', color: INK, border: `1px solid ${BORDER}` }} placeholder="Write your message here..." />
              </div>
              <button onClick={handleSendWhatsApp} disabled={isGenerating} className="w-full py-2.5 sm:py-3 rounded-xl font-semibold transition hover:opacity-90 flex items-center justify-center gap-2 disabled:opacity-50 text-sm" style={{ backgroundColor: GREEN, color: '#fff' }}>
                {isGenerating ? <Loader className="w-4 h-4 sm:w-5 sm:h-5 animate-spin" /> : <><Send size={16} className="sm:w-[18px] sm:h-[18px]" /> Send via WhatsApp</>}
              </button>
              <div className="flex items-center justify-center gap-1.5 sm:gap-2 text-[10px] sm:text-xs" style={{ color: MUTED }}>
                <Shield size={11} className="sm:w-[12px] sm:h-[12px]" /> <span>You'll be redirected to WhatsApp</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Talents;