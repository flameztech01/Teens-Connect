import { useState } from 'react';
import { useSelector } from 'react-redux';
import DashboardSidebar from '../components/DashbordSidebar';
import {
  HelpCircle,
  MessageCircle,
  Phone,
  Mail,
  ChevronDown,
  ChevronUp,
  Shield,
  User,
  Lock,
  Briefcase,
  Users,
  Globe,
  AlertCircle,
  Send,
  Copy,
  CheckCircle
} from 'lucide-react';

// ---- design tokens ----
const BG = '#0c0c0d';
const CARD = '#141416';
const INK = '#ffffff';
const MUTED = 'rgba(255,255,255,0.4)';
const BORDER = 'rgba(255,255,255,0.06)';
const GOLD = '#f4a825';
const GOLD_TINT = 'rgba(244,168,37,0.12)';
const GOLD_GLOW = 'rgba(244,168,37,0.25)';
const GREEN = '#22c55e';
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

const Help = () => {
  const { userInfo } = useSelector((state) => state.auth);
  const [openQuestion, setOpenQuestion] = useState(null);
  const [copied, setCopied] = useState(false);

  const faqs = [
    {
      id: 1,
      category: "Account",
      icon: User,
      question: "How do I create an account?",
      answer: "You can create an account by clicking on the 'Sign Up' button on the homepage. You'll need to sign in with Google and then complete your profile with additional information like phone number, location, skills, and interests."
    },
    {
      id: 2,
      category: "Account",
      icon: User,
      question: "How do I update my profile information?",
      answer: "Go to your Profile page from the dashboard sidebar. Click on 'Edit Profile' to update your personal information, skills, interests, and other details. Don't forget to save your changes."
    },
    {
      id: 3,
      category: "Privacy & Security",
      icon: Shield,
      question: "Is my identity really anonymous when posting?",
      answer: "Yes! When you post in the Anonymous Corner, your identity is completely hidden. Only admins can see who posted for moderation purposes, but other users will never know it was you."
    },
    {
      id: 4,
      category: "Privacy & Security",
      icon: Shield,
      question: "How do I change my password?",
      answer: "Go to Settings > Security tab. There you can change your password by entering your current password and then your new password. Make sure your new password is at least 6 characters long."
    },
    {
      id: 5,
      category: "Posts & Content",
      icon: Lock,
      question: "Why is my anonymous post pending?",
      answer: "All anonymous posts go through a moderation process to ensure they follow our community guidelines. An admin will review your post, and it will be approved or rejected within 24 hours."
    },
    {
      id: 6,
      category: "Posts & Content",
      icon: Lock,
      question: "Can I edit or delete my anonymous post?",
      answer: "Once a post is submitted, you cannot edit it. If you need to delete a post, please contact support for assistance."
    },
    {
      id: 7,
      category: "Talent & Hiring",
      icon: Briefcase,
      question: "How do I get featured as a talent?",
      answer: "Complete your profile with skills, portfolio link, and a detailed bio. Users with complete profiles and active engagement are more likely to be featured. You can also reach out to support for consideration."
    },
    {
      id: 8,
      category: "Talent & Hiring",
      icon: Briefcase,
      question: "How do I hire someone through TeensConnect?",
      answer: "Go to the Hire Talent page from your dashboard. You can search and filter talents by skills, location, or name. Click on 'Contact on WhatsApp' to connect with any talent you're interested in."
    },
    {
      id: 9,
      category: "Community",
      icon: Users,
      question: "How do I join the WhatsApp community?",
      answer: "Contact our support team via WhatsApp or call to get the invite link to our growing WhatsApp community where you can connect with other members."
    },
    {
      id: 10,
      category: "Community",
      icon: Users,
      question: "Are there any age restrictions?",
      answer: "TeensConnect is designed for teenagers and young adults. Users should be between 13-25 years old to join the platform."
    },
    {
      id: 11,
      category: "Technical",
      icon: Globe,
      question: "I'm having trouble loading the app. What should I do?",
      answer: "Try refreshing your browser, clearing your cache, or using a different browser. If the issue persists, please contact our support team for assistance."
    },
    {
      id: 12,
      category: "Technical",
      icon: Globe,
      question: "Is TeensConnect available on mobile?",
      answer: "Yes! TeensConnect is fully responsive and works on all mobile devices. You can access it through your mobile browser."
    }
  ];

  const categories = [...new Set(faqs.map(faq => faq.category))];

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: BG }}>
      <DashboardSidebar />
      
      <div className="lg:ml-72 relative">
        {/* Header – dark theme */}
        <div className="sticky top-0 z-30" style={{ backgroundColor: BG, borderBottom: `1px solid ${BORDER}` }}>
          <div className="px-4 sm:px-6 py-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 shrink-0 rounded-xl flex items-center justify-center" style={{ backgroundColor: GOLD_TINT }}>
                <HelpCircle className="w-5 h-5" style={{ color: GOLD }} />
              </div>
              <div>
                <h1 className="text-base sm:text-lg font-semibold leading-tight" style={{ color: INK }}>Help Center</h1>
                <p className="text-[11px] sm:text-xs" style={{ color: MUTED }}>
                  Find answers to common questions or contact our support team
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="px-3 sm:px-6 py-4 sm:py-6">
          <div className="grid lg:grid-cols-3 gap-4 sm:gap-6">
            {/* FAQ Section - Main Content */}
            <div className="lg:col-span-2 space-y-4 sm:space-y-6">
              <CardShell glow>
                <div className="border-b pb-4 mb-4" style={{ borderColor: BORDER }}>
                  <h2 className="text-lg font-semibold" style={{ color: INK }}>
                    Frequently Asked Questions
                  </h2>
                  <p className="text-sm" style={{ color: MUTED }}>
                    Everything you need to know about TeensConnect
                  </p>
                </div>
                
                <div className="divide-y" style={{ borderColor: BORDER }}>
                  {faqs.map((faq) => {
                    const Icon = faq.icon;
                    const isOpen = openQuestion === faq.id;
                    
                    return (
                      <div key={faq.id} className="py-4 first:pt-0 last:pb-0">
                        <button
                          onClick={() => setOpenQuestion(isOpen ? null : faq.id)}
                          className="w-full flex items-start justify-between text-left gap-4"
                        >
                          <div className="flex items-start gap-3">
                            <div className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5" style={{ backgroundColor: GOLD_TINT }}>
                              <Icon size={16} style={{ color: GOLD }} />
                            </div>
                            <div>
                              <span className="text-xs font-medium" style={{ color: GOLD }}>
                                {faq.category}
                              </span>
                              <h3 className="font-semibold mt-0.5" style={{ color: INK }}>
                                {faq.question}
                              </h3>
                            </div>
                          </div>
                          {isOpen ? (
                            <ChevronUp size={18} className="flex-shrink-0 mt-1" style={{ color: MUTED }} />
                          ) : (
                            <ChevronDown size={18} className="flex-shrink-0 mt-1" style={{ color: MUTED }} />
                          )}
                        </button>
                        
                        {isOpen && (
                          <div className="mt-3 pl-11">
                            <p className="text-sm leading-relaxed" style={{ color: MUTED }}>
                              {faq.answer}
                            </p>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </CardShell>
            </div>

            {/* Contact Support Sidebar */}
            <div className="lg:col-span-1 space-y-4 sm:space-y-6">
              {/* Contact Support Card */}
              <CardShell glow className="sticky top-24">
                <div className="border-b pb-4 mb-4" style={{ borderColor: BORDER }}>
                  <div className="flex items-center gap-2">
                    <MessageCircle className="w-5 h-5" style={{ color: GOLD }} />
                    <h3 className="font-semibold" style={{ color: INK }}>
                      Contact Support
                    </h3>
                  </div>
                  <p className="text-sm mt-1" style={{ color: MUTED }}>
                    Get help from our support team
                  </p>
                </div>
                
                <div className="space-y-5">
                  {/* WhatsApp Support */}
                  <div>
                    <div className="flex items-center gap-2 mb-3">
                      <div className="w-8 h-8 rounded-xl flex items-center justify-center" style={{ backgroundColor: 'rgba(34,197,94,0.12)' }}>
                        <MessageCircle size={16} style={{ color: GREEN }} />
                      </div>
                      <span className="text-sm font-medium" style={{ color: MUTED }}>
                        WhatsApp Support
                      </span>
                    </div>
                    <div className="flex items-center justify-between p-3 rounded-xl" style={{ backgroundColor: 'rgba(255,255,255,0.04)', border: `1px solid ${BORDER}` }}>
                      <span className="font-medium" style={{ color: INK }}>
                        08058586759
                      </span>
                      <button
                        onClick={() => copyToClipboard('08058586759')}
                        className="transition-colors hover:opacity-80"
                        style={{ color: GOLD }}
                      >
                        {copied ? <CheckCircle size={18} /> : <Copy size={18} />}
                      </button>
                    </div>
                    <a
                      href="https://wa.me/2348058586759"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-3 w-full flex items-center justify-center gap-2 py-2.5 rounded-xl font-semibold transition-all hover:opacity-90"
                      style={{ backgroundColor: GREEN, color: '#fff' }}
                    >
                      <Send size={16} />
                      Message on WhatsApp
                    </a>
                  </div>

                  {/* Phone Support */}
                  <div className="pt-4 border-t" style={{ borderColor: BORDER }}>
                    <div className="flex items-center gap-2 mb-3">
                      <div className="w-8 h-8 rounded-xl flex items-center justify-center" style={{ backgroundColor: 'rgba(59,130,246,0.12)' }}>
                        <Phone size={16} style={{ color: BLUE }} />
                      </div>
                      <span className="text-sm font-medium" style={{ color: MUTED }}>
                        Phone Support
                      </span>
                    </div>
                    <div className="flex items-center justify-between p-3 rounded-xl" style={{ backgroundColor: 'rgba(255,255,255,0.04)', border: `1px solid ${BORDER}` }}>
                      <span className="font-medium" style={{ color: INK }}>
                        08058586759
                      </span>
                      <button
                        onClick={() => copyToClipboard('08058586759')}
                        className="transition-colors hover:opacity-80"
                        style={{ color: GOLD }}
                      >
                        {copied ? <CheckCircle size={18} /> : <Copy size={18} />}
                      </button>
                    </div>
                    <a
                      href="tel:08058586759"
                      className="mt-3 w-full flex items-center justify-center gap-2 py-2.5 rounded-xl font-semibold transition-all hover:opacity-90"
                      style={{ backgroundColor: BLUE, color: '#fff' }}
                    >
                      <Phone size={16} />
                      Call Now
                    </a>
                    <p className="text-xs mt-2 text-center" style={{ color: MUTED }}>
                      Available: Monday - Friday, 9AM - 6PM
                    </p>
                  </div>

                  {/* Email Support */}
                  <div className="pt-4 border-t" style={{ borderColor: BORDER }}>
                    <div className="flex items-center gap-2 mb-3">
                      <div className="w-8 h-8 rounded-xl flex items-center justify-center" style={{ backgroundColor: 'rgba(139,92,246,0.12)' }}>
                        <Mail size={16} style={{ color: PURPLE }} />
                      </div>
                      <span className="text-sm font-medium" style={{ color: MUTED }}>
                        Email Support
                      </span>
                    </div>
                    <div className="p-3 rounded-xl" style={{ backgroundColor: 'rgba(255,255,255,0.04)', border: `1px solid ${BORDER}` }}>
                      <span className="text-sm" style={{ color: INK }}>
                        hello@teensconnect.com
                      </span>
                    </div>
                    <a
                      href="mailto:hello@teensconnect.com"
                      className="mt-3 w-full flex items-center justify-center gap-2 py-2.5 rounded-xl font-semibold transition-all hover:opacity-90"
                      style={{ backgroundColor: PURPLE, color: '#fff' }}
                    >
                      <Mail size={16} />
                      Send Email
                    </a>
                  </div>
                </div>
              </CardShell>

              {/* Quick Tips Card */}
              <div className="rounded-2xl p-5 border" style={{ backgroundColor: GOLD_TINT, borderColor: `${GOLD}33` }}>
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ backgroundColor: 'rgba(244,168,37,0.2)' }}>
                    <AlertCircle size={14} style={{ color: GOLD }} />
                  </div>
                  <div>
                    <h4 className="font-semibold text-sm" style={{ color: INK }}>Quick Tips</h4>
                    <ul className="text-xs mt-2 space-y-1.5" style={{ color: MUTED }}>
                      <li>• Complete your profile to get discovered</li>
                      <li>• Add skills to attract opportunities</li>
                      <li>• Check your anonymous post status</li>
                      <li>• Join our WhatsApp community</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Help;