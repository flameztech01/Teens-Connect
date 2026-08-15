import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import {
  ArrowLeft,
  MapPin,
  Mail,
  Phone,
  Smartphone,
  Link as LinkIcon,
  FileText,
  Award,
  Heart,
  MessageCircle,
  Send,
  Shield,
  X,
  Loader,
  Copy,
  CheckCircle,
  Briefcase,
  User,
  Calendar,
  Globe,
  Star
} from 'lucide-react';
import {
  useGetTalentByIdQuery,
  useGetTalentContactQuery,
  useGenerateWhatsAppMessageMutation
} from '../slices/hireApiSlice';

// ---- design tokens ----
const BG = '#0b0b0e';
const CARD = '#14141a';
const INK = '#ffffff';
const MUTED = 'rgba(255,255,255,0.5)';
const BORDER = 'rgba(255,255,255,0.06)';
const GOLD = '#f4a825';
const GOLD_DEEP = '#d4911f';
const GOLD_TINT = 'rgba(244,168,37,0.12)';
const GOLD_GLOW = 'rgba(244,168,37,0.2)';
const GREEN = '#22c55e';
const BLUE = '#3b82f6';
const PURPLE = '#8b5cf6';

const TalentId = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { userInfo } = useSelector((state) => state.auth);
  const [messageText, setMessageText] = useState('');
  const [showContactModal, setShowContactModal] = useState(false);
  const [copied, setCopied] = useState(false);

  // Fetch talent details
  const { data: talent, isLoading, error } = useGetTalentByIdQuery(id, { skip: !id });
  // Fetch contact info (needs auth)
  const { data: contactInfo, refetch: refetchContact } = useGetTalentContactQuery(id, {
    skip: !id || !userInfo // only fetch if logged in
  });
  const [generateWhatsAppMessage, { isLoading: isGenerating }] = useGenerateWhatsAppMessageMutation();

  // Pre-fill message when contact modal opens
  useEffect(() => {
    if (talent && showContactModal) {
      setMessageText(
        `Hi ${talent.name}, I came across your profile on TeensConnect and I'm really impressed by your skills. Would love to discuss potential collaboration!`
      );
      if (userInfo) {
        refetchContact();
      }
    }
  }, [talent, showContactModal, userInfo, refetchContact]);

  const handleContact = () => {
    if (!userInfo) {
      alert('Please login to contact talents');
      return;
    }
    setShowContactModal(true);
  };

  const handleSendWhatsApp = async () => {
    if (!talent) return;
    try {
      const result = await generateWhatsAppMessage({
        talentId: talent._id,
        message: messageText
      }).unwrap();
      window.open(result.whatsappLink, '_blank');
      setShowContactModal(false);
    } catch (error) {
      console.error('Error generating WhatsApp link:', error);
      alert(error.data?.message || 'Failed to generate WhatsApp link');
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: BG }}>
        <div className="text-center">
          <Loader className="w-8 h-8 animate-spin mx-auto mb-3" style={{ color: GOLD }} />
          <p className="text-sm" style={{ color: MUTED }}>Loading talent profile...</p>
        </div>
      </div>
    );
  }

  if (error || !talent) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: BG }}>
        <div className="text-center p-8" style={{ backgroundColor: CARD, border: `1px solid ${BORDER}`, borderRadius: '1rem' }}>
          <Briefcase className="w-12 h-12 mx-auto mb-3" style={{ color: MUTED }} />
          <h2 className="text-lg font-semibold" style={{ color: INK }}>Talent not found</h2>
          <p className="text-sm" style={{ color: MUTED }}>The profile you're looking for doesn't exist.</p>
          <button
            onClick={() => navigate('/talents')}
            className="mt-4 px-4 py-2 rounded-lg text-sm font-medium transition hover:opacity-80"
            style={{ backgroundColor: GOLD, color: '#0b0b0e' }}
          >
            Browse Talents
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: BG }}>
      {/* Header with back button */}
      <div className="sticky top-0 z-30" style={{ backgroundColor: BG, borderBottom: `1px solid ${BORDER}` }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3">
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate('/talents')}
              className="p-1.5 rounded-lg transition hover:bg-white/5"
              style={{ color: MUTED }}
            >
              <ArrowLeft size={20} />
            </button>
            <div className="flex-1 min-w-0">
              <h1 className="text-base sm:text-lg font-semibold truncate" style={{ color: INK }}>
                {talent.name}
              </h1>
              <p className="text-xs sm:text-sm truncate" style={{ color: MUTED }}>
                {talent.skills?.slice(0, 3).join(' • ') || 'Talent Profile'}
              </p>
            </div>
            <button
              onClick={handleContact}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs sm:text-sm font-semibold transition hover:opacity-90"
              style={{ backgroundColor: GOLD, color: '#0b0b0e' }}
            >
              <MessageCircle size={14} /> Contact
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6">
        <div className="grid md:grid-cols-3 gap-6">
          {/* Left column: Profile card */}
          <div className="md:col-span-1">
            <div className="rounded-2xl p-5 text-center" style={{ backgroundColor: CARD, border: `1px solid ${BORDER}` }}>
              {/* Avatar */}
              <div className="flex justify-center mb-3">
                {talent.profile ? (
                  <img src={talent.profile} alt={talent.name} className="w-24 h-24 sm:w-28 sm:h-28 rounded-full object-cover ring-4" style={{ ringColor: GOLD_TINT }} />
                ) : (
                  <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full flex items-center justify-center" style={{ background: `linear-gradient(135deg, ${GOLD_DEEP}, ${GOLD})` }}>
                    <span className="text-white font-bold text-3xl">{talent.name?.charAt(0).toUpperCase() || 'U'}</span>
                  </div>
                )}
              </div>

              <h2 className="text-lg font-bold" style={{ color: INK }}>{talent.name}</h2>
              <p className="text-sm" style={{ color: MUTED }}>@{talent.username || 'user'}</p>

              {/* Location */}
              {talent.location && (
                <div className="flex items-center justify-center gap-1 text-xs mt-2" style={{ color: MUTED }}>
                  <MapPin size={14} />
                  <span>{talent.location}</span>
                </div>
              )}

              {/* Bio */}
              {talent.bio && (
                <div className="mt-4 text-left">
                  <p className="text-xs font-medium uppercase tracking-wide mb-1" style={{ color: MUTED }}>About</p>
                  <p className="text-sm leading-relaxed" style={{ color: MUTED }}>{talent.bio}</p>
                </div>
              )}

              {/* Stats */}
              <div className="flex justify-around mt-4 pt-4 border-t" style={{ borderColor: BORDER }}>
                <div>
                  <p className="text-xl font-bold" style={{ color: INK }}>{talent.skills?.length || 0}</p>
                  <p className="text-xs" style={{ color: MUTED }}>Skills</p>
                </div>
                <div>
                  <p className="text-xl font-bold" style={{ color: INK }}>{talent.interests?.length || 0}</p>
                  <p className="text-xs" style={{ color: MUTED }}>Interests</p>
                </div>
                <div>
                  <p className="text-xl font-bold" style={{ color: INK }}>{talent.profileViews || 0}</p>
                  <p className="text-xs" style={{ color: MUTED }}>Views</p>
                </div>
              </div>

              {/* Quick contact buttons */}
              <div className="mt-4 space-y-2">
                {talent.portfolioLink && (
                  <a
                    href={talent.portfolioLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 w-full py-2 rounded-lg text-sm transition hover:opacity-80"
                    style={{ backgroundColor: 'rgba(59,130,246,0.12)', color: BLUE }}
                  >
                    <LinkIcon size={14} /> View Portfolio
                  </a>
                )}
                {talent.cv && (
                  <a
                    href={talent.cv}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 w-full py-2 rounded-lg text-sm transition hover:opacity-80"
                    style={{ backgroundColor: 'rgba(34,197,94,0.12)', color: GREEN }}
                  >
                    <FileText size={14} /> View CV
                  </a>
                )}
              </div>
            </div>
          </div>

          {/* Right column: Details */}
          <div className="md:col-span-2 space-y-5">
            {/* Skills */}
            {talent.skills?.length > 0 && (
              <div className="rounded-2xl p-5" style={{ backgroundColor: CARD, border: `1px solid ${BORDER}` }}>
                <h3 className="text-sm font-semibold flex items-center gap-2 mb-3" style={{ color: INK }}>
                  <Award size={16} style={{ color: GOLD }} /> Skills ({talent.skills.length})
                </h3>
                <div className="flex flex-wrap gap-2">
                  {talent.skills.map((skill, idx) => (
                    <span key={idx} className="px-3 py-1.5 rounded-lg text-xs" style={{ backgroundColor: 'rgba(255,255,255,0.05)', color: MUTED }}>
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Interests */}
            {talent.interests?.length > 0 && (
              <div className="rounded-2xl p-5" style={{ backgroundColor: CARD, border: `1px solid ${BORDER}` }}>
                <h3 className="text-sm font-semibold flex items-center gap-2 mb-3" style={{ color: INK }}>
                  <Heart size={16} style={{ color: GOLD }} /> Interests ({talent.interests.length})
                </h3>
                <div className="flex flex-wrap gap-2">
                  {talent.interests.map((interest, idx) => (
                    <span key={idx} className="px-3 py-1.5 rounded-lg text-xs" style={{ backgroundColor: 'rgba(244,168,37,0.08)', color: GOLD }}>
                      {interest}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Contact Info (only if logged in) */}
            {userInfo && contactInfo && (
              <div className="rounded-2xl p-5" style={{ backgroundColor: CARD, border: `1px solid ${BORDER}` }}>
                <h3 className="text-sm font-semibold flex items-center gap-2 mb-3" style={{ color: INK }}>
                  <Phone size={16} style={{ color: GOLD }} /> Contact Information
                </h3>
                <div className="space-y-3">
                  {contactInfo.whatsappNumber && (
                    <div className="flex items-center gap-3 text-sm">
                      <Smartphone size={16} style={{ color: GREEN }} />
                      <span style={{ color: INK }}>{contactInfo.whatsappNumber}</span>
                      <button
                        onClick={() => copyToClipboard(contactInfo.whatsappNumber)}
                        className="ml-auto transition hover:opacity-70"
                        style={{ color: MUTED }}
                      >
                        {copied ? <CheckCircle size={14} style={{ color: GREEN }} /> : <Copy size={14} />}
                      </button>
                    </div>
                  )}
                  {contactInfo.email && (
                    <div className="flex items-center gap-3 text-sm">
                      <Mail size={16} style={{ color: BLUE }} />
                      <span style={{ color: INK }}>{contactInfo.email}</span>
                    </div>
                  )}
                  {contactInfo.phoneNumber && (
                    <div className="flex items-center gap-3 text-sm">
                      <Phone size={16} style={{ color: PURPLE }} />
                      <span style={{ color: INK }}>{contactInfo.phoneNumber}</span>
                    </div>
                  )}
                  {contactInfo.location && (
                    <div className="flex items-center gap-3 text-sm">
                      <MapPin size={16} style={{ color: MUTED }} />
                      <span style={{ color: INK }}>{contactInfo.location}</span>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Account info */}
            <div className="rounded-2xl p-5" style={{ backgroundColor: CARD, border: `1px solid ${BORDER}` }}>
              <h3 className="text-sm font-semibold flex items-center gap-2 mb-3" style={{ color: INK }}>
                <Calendar size={16} style={{ color: GOLD }} /> Account Info
              </h3>
              <div className="space-y-1 text-sm" style={{ color: MUTED }}>
                <div className="flex justify-between">
                  <span>Joined</span>
                  <span style={{ color: INK }}>{new Date(talent.createdAt).toLocaleDateString()}</span>
                </div>
                <div className="flex justify-between">
                  <span>Member Since</span>
                  <span style={{ color: INK }}>{new Date(talent.createdAt).getFullYear()}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Contact Modal */}
      {showContactModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-md flex items-center justify-center z-50 p-4">
          <div className="rounded-2xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto" style={{ backgroundColor: CARD, border: `1px solid ${BORDER}` }}>
            <div className="px-6 py-4 border-b" style={{ borderColor: BORDER }}>
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <MessageCircle className="w-5 h-5" style={{ color: GOLD }} />
                  <h2 className="text-lg font-semibold" style={{ color: INK }}>Contact {talent.name}</h2>
                </div>
                <button onClick={() => setShowContactModal(false)} className="transition hover:opacity-70" style={{ color: MUTED }}>
                  <X size={20} />
                </button>
              </div>
            </div>
            <div className="p-6 space-y-5">
              {contactInfo?.whatsappNumber ? (
                <>
                  <div className="rounded-xl p-4" style={{ backgroundColor: 'rgba(255,255,255,0.03)', border: `1px solid ${BORDER}` }}>
                    <p className="text-xs font-medium uppercase tracking-wide mb-3" style={{ color: MUTED }}>Contact via WhatsApp</p>
                    <div className="flex items-center gap-3 text-sm">
                      <Smartphone className="w-5 h-5" style={{ color: GREEN }} />
                      <span style={{ color: INK }}>{contactInfo.whatsappNumber}</span>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2" style={{ color: MUTED }}>Your Message</label>
                    <textarea
                      value={messageText}
                      onChange={(e) => setMessageText(e.target.value)}
                      rows={4}
                      className="w-full px-4 py-2.5 rounded-xl focus:outline-none focus:ring-2 resize-none text-sm"
                      style={{
                        backgroundColor: 'rgba(255,255,255,0.04)',
                        color: INK,
                        border: `1px solid ${BORDER}`,
                      }}
                      placeholder="Write your message here..."
                    />
                  </div>
                  <button
                    onClick={handleSendWhatsApp}
                    disabled={isGenerating}
                    className="w-full py-3 rounded-xl font-semibold transition hover:opacity-90 flex items-center justify-center gap-2 disabled:opacity-50"
                    style={{ backgroundColor: GREEN, color: '#fff' }}
                  >
                    {isGenerating ? <Loader className="w-5 h-5 animate-spin" /> : <><Send size={18} /> Send via WhatsApp</>}
                  </button>
                  <div className="flex items-center justify-center gap-2 text-xs" style={{ color: MUTED }}>
                    <Shield size={12} /> <span>You'll be redirected to WhatsApp</span>
                  </div>
                </>
              ) : (
                <div className="text-center py-6">
                  <p style={{ color: MUTED }}>This talent hasn't provided a WhatsApp number.</p>
                  <p className="text-sm" style={{ color: MUTED }}>Please try contacting them via email or phone.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TalentId;