import { useState } from 'react';
import { useSelector } from 'react-redux';
import DashboardSidebar from "../components/DashbordSidebar";
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

const Help = () => {
  const { userInfo } = useSelector((state: any) => state.auth);
  const [openQuestion, setOpenQuestion] = useState<number | null>(null);
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

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <DashboardSidebar />
      
      <div className="lg:ml-72">
        {/* Header */}
        <div className="bg-white dark:bg-gray-800 border-b border-gray-100 dark:border-gray-700 sticky top-0 z-30">
          <div className="px-6 lg:px-8 py-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-[#f4a825]/10 flex items-center justify-center">
                <HelpCircle className="w-6 h-6 text-[#f4a825]" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Help Center</h1>
                <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">
                  Find answers to common questions or contact our support team
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="px-6 lg:px-8 py-6">
          <div className="grid lg:grid-cols-3 gap-6">
            {/* FAQ Section - Main Content */}
            <div className="lg:col-span-2 space-y-6">
              <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-100 dark:border-gray-700">
                  <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                    Frequently Asked Questions
                  </h2>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                    Everything you need to know about TeensConnect
                  </p>
                </div>
                
                <div className="divide-y divide-gray-100 dark:divide-gray-700">
                  {faqs.map((faq) => {
                    const Icon = faq.icon;
                    const isOpen = openQuestion === faq.id;
                    
                    return (
                      <div key={faq.id} className="px-6 py-4">
                        <button
                          onClick={() => setOpenQuestion(isOpen ? null : faq.id)}
                          className="w-full flex items-start justify-between text-left gap-4"
                        >
                          <div className="flex items-start gap-3">
                            <div className="w-8 h-8 rounded-lg bg-[#f4a825]/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                              <Icon size={16} className="text-[#f4a825]" />
                            </div>
                            <div>
                              <span className="text-xs text-[#f4a825] font-medium">
                                {faq.category}
                              </span>
                              <h3 className="font-semibold text-gray-900 dark:text-white mt-0.5">
                                {faq.question}
                              </h3>
                            </div>
                          </div>
                          {isOpen ? (
                            <ChevronUp size={18} className="text-gray-400 flex-shrink-0 mt-1" />
                          ) : (
                            <ChevronDown size={18} className="text-gray-400 flex-shrink-0 mt-1" />
                          )}
                        </button>
                        
                        {isOpen && (
                          <div className="mt-3 pl-11">
                            <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed">
                              {faq.answer}
                            </p>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Contact Support Sidebar */}
            <div className="lg:col-span-1 space-y-6">
              {/* Contact Support Card */}
              <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 overflow-hidden sticky top-24">
                <div className="px-6 py-4 border-b border-gray-100 dark:border-gray-700 bg-gradient-to-r from-[#f4a825]/5 to-transparent">
                  <div className="flex items-center gap-2">
                    <MessageCircle className="w-5 h-5 text-[#f4a825]" />
                    <h3 className="font-semibold text-gray-900 dark:text-white">
                      Contact Support
                    </h3>
                  </div>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                    Get help from our support team
                  </p>
                </div>
                
                <div className="p-6 space-y-5">
                  {/* WhatsApp Support */}
                  <div>
                    <div className="flex items-center gap-2 mb-3">
                      <div className="w-8 h-8 rounded-lg bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                        <MessageCircle size={16} className="text-green-600 dark:text-green-400" />
                      </div>
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        WhatsApp Support
                      </span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
                      <span className="text-gray-900 dark:text-white font-medium">
                        08058586759
                      </span>
                      <button
                        onClick={() => copyToClipboard('08058586759')}
                        className="text-[#f4a825] hover:text-[#e09e1a] transition-colors"
                      >
                        {copied ? <CheckCircle size={18} /> : <Copy size={18} />}
                      </button>
                    </div>
                    <a
                      href="https://wa.me/2348058586759"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-3 w-full flex items-center justify-center gap-2 bg-green-600 text-white py-2.5 rounded-xl font-semibold hover:bg-green-700 transition-all"
                    >
                      <Send size={16} />
                      Message on WhatsApp
                    </a>
                  </div>

                  {/* Phone Support */}
                  <div className="pt-4 border-t border-gray-100 dark:border-gray-700">
                    <div className="flex items-center gap-2 mb-3">
                      <div className="w-8 h-8 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                        <Phone size={16} className="text-blue-600 dark:text-blue-400" />
                      </div>
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        Phone Support
                      </span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
                      <span className="text-gray-900 dark:text-white font-medium">
                        08058586759
                      </span>
                      <button
                        onClick={() => copyToClipboard('08058586759')}
                        className="text-[#f4a825] hover:text-[#e09e1a] transition-colors"
                      >
                        {copied ? <CheckCircle size={18} /> : <Copy size={18} />}
                      </button>
                    </div>
                    <a
                      href="tel:08058586759"
                      className="mt-3 w-full flex items-center justify-center gap-2 bg-blue-600 text-white py-2.5 rounded-xl font-semibold hover:bg-blue-700 transition-all"
                    >
                      <Phone size={16} />
                      Call Now
                    </a>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-2 text-center">
                      Available: Monday - Friday, 9AM - 6PM
                    </p>
                  </div>

                  {/* Email Support */}
                  <div className="pt-4 border-t border-gray-100 dark:border-gray-700">
                    <div className="flex items-center gap-2 mb-3">
                      <div className="w-8 h-8 rounded-lg bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
                        <Mail size={16} className="text-purple-600 dark:text-purple-400" />
                      </div>
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        Email Support
                      </span>
                    </div>
                    <div className="p-3 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
                      <span className="text-gray-900 dark:text-white text-sm">
                        hello@teensconnect.com
                      </span>
                    </div>
                    <a
                      href="mailto:hello@teensconnect.com"
                      className="mt-3 w-full flex items-center justify-center gap-2 bg-purple-600 text-white py-2.5 rounded-xl font-semibold hover:bg-purple-700 transition-all"
                    >
                      <Mail size={16} />
                      Send Email
                    </a>
                  </div>
                </div>
              </div>

              {/* Quick Tips Card */}
              <div className="bg-gradient-to-r from-[#f4a825]/10 to-transparent rounded-2xl p-5 border border-[#f4a825]/20">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-[#f4a825]/20 flex items-center justify-center">
                    <AlertCircle size={14} className="text-[#f4a825]" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 dark:text-white text-sm">Quick Tips</h4>
                    <ul className="text-gray-600 dark:text-gray-400 text-xs mt-2 space-y-1.5">
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