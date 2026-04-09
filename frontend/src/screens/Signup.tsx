import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useGoogleSignupMutation } from '../slices/userApiSlice';
import { setCredentials } from '../slices/authSlice';
import { useDispatch } from 'react-redux';
import { GoogleLogin, CredentialResponse } from '@react-oauth/google';
import { 
  Phone, 
  Calendar, 
  MapPin, 
  Link as LinkIcon,
  Upload,
  FileText,
  X,
  Award,
  Users,
  Sparkles,
  ArrowRight,
  CheckCircle
} from 'lucide-react';

const Signup = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [googleSignup, { isLoading }] = useGoogleSignupMutation();
  
  const [formData, setFormData] = useState({
    phone: '',
    dateOfBirth: '',
    gender: '',
    location: '',
    whatsappNumber: '',
    portfolioLink: '',
    skills: [] as string[],
    interests: [] as string[],
    bio: '',
  });
  
  const [profilePicture, setProfilePicture] = useState<File | null>(null);
  const [cv, setCv] = useState<File | null>(null);
  const [profilePreview, setProfilePreview] = useState<string>('');
  const [cvName, setCvName] = useState<string>('');
  const [skillInput, setSkillInput] = useState('');
  const [interestInput, setInterestInput] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  const handleGoogleSuccess = async (credentialResponse: CredentialResponse) => {
    const googleToken = credentialResponse.credential;
    
    if (!googleToken) {
      console.error('No Google token received');
      return;
    }

    // Validate required fields
    const validationErrors: Record<string, string> = {};
    if (!formData.phone) validationErrors.phone = 'Phone number is required';
    if (!formData.dateOfBirth) validationErrors.dateOfBirth = 'Date of birth is required';
    if (!formData.gender) validationErrors.gender = 'Gender is required';
    if (!formData.location) validationErrors.location = 'Location is required';
    
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      setTouched({
        phone: true,
        dateOfBirth: true,
        gender: true,
        location: true
      });
      return;
    }

    try {
      const submitData = new FormData();
      submitData.append('token', googleToken);
      submitData.append('phone', formData.phone);
      submitData.append('dateOfBirth', formData.dateOfBirth);
      submitData.append('gender', formData.gender);
      submitData.append('location', formData.location);
      submitData.append('whatsappNumber', formData.whatsappNumber || '');
      submitData.append('portfolioLink', formData.portfolioLink || '');
      submitData.append('skills', JSON.stringify(formData.skills));
      submitData.append('interests', JSON.stringify(formData.interests));
      submitData.append('bio', formData.bio || '');
      
      if (profilePicture) {
        submitData.append('profilePicture', profilePicture);
      }
      if (cv) {
        submitData.append('cv', cv);
      }

      const result = await googleSignup(submitData).unwrap();
      dispatch(setCredentials(result));
      navigate('/dashboard');
    } catch (error: any) {
      console.error('Signup failed:', error);
      setErrors({ submit: error.data?.message || 'Signup failed. Please try again.' });
    }
  };

  const handleGoogleError = () => {
    setErrors({ submit: 'Google signup failed. Please try again.' });
  };

  const handleBlur = (field: string) => {
    setTouched({ ...touched, [field]: true });
  };

  const handleProfilePictureChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setProfilePicture(file);
      const previewUrl = URL.createObjectURL(file);
      setProfilePreview(previewUrl);
    }
  };

  const handleCvChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setCv(file);
      setCvName(file.name);
    }
  };

  const addSkill = () => {
    if (skillInput.trim() && !formData.skills.includes(skillInput.trim())) {
      setFormData({ ...formData, skills: [...formData.skills, skillInput.trim()] });
      setSkillInput('');
    }
  };

  const removeSkill = (skill: string) => {
    setFormData({ ...formData, skills: formData.skills.filter(s => s !== skill) });
  };

  const addInterest = () => {
    if (interestInput.trim() && !formData.interests.includes(interestInput.trim())) {
      setFormData({ ...formData, interests: [...formData.interests, interestInput.trim()] });
      setInterestInput('');
    }
  };

  const removeInterest = (interest: string) => {
    setFormData({ ...formData, interests: formData.interests.filter(i => i !== interest) });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1d2b4f] via-[#0d6b57] to-[#f4a825] relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-[#f4a825] rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-[#0d6b57] rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-[#1d2b4f] rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-pulse delay-500"></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Side - Brand Info */}
          <div className="text-white space-y-8">
            <div className="animate-fade-in-up">
              <div className="flex items-center gap-3 mb-6">
                <img src="/logo.png" alt="TeensConnect" className="h-12 w-auto" />
                <div>
                  <h1 className="text-3xl font-bold">TeensConnect</h1>
                  <p className="text-sm opacity-90">Connect • Discover • Grow</p>
                </div>
              </div>
              
              <h2 className="text-4xl lg:text-5xl font-bold mb-4 leading-tight">
                Join the Future of
                <span className="text-[#f4a825]"> Teen Talent</span>
              </h2>
              
              <p className="text-lg opacity-90 mb-8">
                Create your account and unlock opportunities to showcase your skills, connect with mentors, and grow your career.
              </p>
            </div>

            <div className="space-y-6 animate-fade-in-up delay-200">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-[#f4a825] bg-opacity-20 rounded-full flex items-center justify-center">
                  <Award className="w-6 h-6 text-[#f4a825]" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg">Showcase Your Talent</h3>
                  <p className="text-sm opacity-80">Get discovered by top companies and mentors</p>
                </div>
              </div>
              
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-[#f4a825] bg-opacity-20 rounded-full flex items-center justify-center">
                  <Users className="w-6 h-6 text-[#f4a825]" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg">Build Your Network</h3>
                  <p className="text-sm opacity-80">Connect with like-minded teens and industry experts</p>
                </div>
              </div>
              
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-[#f4a825] bg-opacity-20 rounded-full flex items-center justify-center">
                  <Sparkles className="w-6 h-6 text-[#f4a825]" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg">Access Opportunities</h3>
                  <p className="text-sm opacity-80">Find internships, scholarships, and events</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Side - Signup Form */}
          <div className="bg-white rounded-2xl shadow-2xl p-8 lg:p-10 animate-fade-in-up delay-300">
            <div className="mb-6 text-center">
              <h3 className="text-2xl font-bold text-[#1d2b4f] mb-2">Create Account</h3>
              <p className="text-gray-600">Fill in your details to get started</p>
            </div>

            {errors.submit && (
              <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg text-sm">
                {errors.submit}
              </div>
            )}

            <div className="space-y-5 max-h-[500px] overflow-y-auto pr-2 custom-scrollbar">
              {/* Profile Picture Upload */}
              <div>
                <label className="block text-sm font-semibold text-[#1d2b4f] mb-2">
                  Profile Picture
                </label>
                <div className="flex items-center gap-4">
                  {profilePreview ? (
                    <div className="relative">
                      <img 
                        src={profilePreview} 
                        alt="Profile preview" 
                        className="w-20 h-20 rounded-full object-cover border-2 border-[#f4a825]"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          setProfilePicture(null);
                          setProfilePreview('');
                        }}
                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
                      >
                        <X size={14} />
                      </button>
                    </div>
                  ) : (
                    <label className="w-20 h-20 rounded-full border-2 border-dashed border-gray-300 flex items-center justify-center cursor-pointer hover:border-[#f4a825] transition-colors">
                      <Upload className="w-6 h-6 text-gray-400" />
                      <input type="file" accept="image/*" onChange={handleProfilePictureChange} className="hidden" />
                    </label>
                  )}
                  <p className="text-xs text-gray-500">Upload a profile picture (optional)</p>
                </div>
              </div>

              {/* Phone Number */}
              <div>
                <label className="block text-sm font-semibold text-[#1d2b4f] mb-2">
                  Phone Number <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    onBlur={() => handleBlur('phone')}
                    className={`w-full pl-10 pr-4 py-3 border ${touched.phone && errors.phone ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:outline-none focus:border-[#f4a825] focus:ring-2 focus:ring-[#f4a825] focus:ring-opacity-20 transition-colors`}
                    placeholder="+234 123 456 7890"
                  />
                </div>
                {touched.phone && errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone}</p>}
              </div>

              {/* Date of Birth */}
              <div>
                <label className="block text-sm font-semibold text-[#1d2b4f] mb-2">
                  Date of Birth <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="date"
                    value={formData.dateOfBirth}
                    onChange={(e) => setFormData({ ...formData, dateOfBirth: e.target.value })}
                    onBlur={() => handleBlur('dateOfBirth')}
                    className={`w-full pl-10 pr-4 py-3 border ${touched.dateOfBirth && errors.dateOfBirth ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:outline-none focus:border-[#f4a825] focus:ring-2 focus:ring-[#f4a825] focus:ring-opacity-20 transition-colors`}
                  />
                </div>
                {touched.dateOfBirth && errors.dateOfBirth && <p className="text-red-500 text-xs mt-1">{errors.dateOfBirth}</p>}
              </div>

              {/* Gender */}
              <div>
                <label className="block text-sm font-semibold text-[#1d2b4f] mb-2">
                  Gender <span className="text-red-500">*</span>
                </label>
                <div className="flex flex-wrap gap-4">
                  {['male', 'female', 'other', 'prefer-not-to-say'].map((option) => (
                    <label key={option} className="flex items-center gap-2">
                      <input
                        type="radio"
                        name="gender"
                        value={option}
                        checked={formData.gender === option}
                        onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                        onBlur={() => handleBlur('gender')}
                        className="text-[#f4a825] focus:ring-[#f4a825]"
                      />
                      <span className="text-sm capitalize">{option.replace('-', ' ')}</span>
                    </label>
                  ))}
                </div>
                {touched.gender && errors.gender && <p className="text-red-500 text-xs mt-1">{errors.gender}</p>}
              </div>

              {/* Location */}
              <div>
                <label className="block text-sm font-semibold text-[#1d2b4f] mb-2">
                  Location <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    onBlur={() => handleBlur('location')}
                    className={`w-full pl-10 pr-4 py-3 border ${touched.location && errors.location ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:outline-none focus:border-[#f4a825] focus:ring-2 focus:ring-[#f4a825] focus:ring-opacity-20 transition-colors`}
                    placeholder="City, Country"
                  />
                </div>
                {touched.location && errors.location && <p className="text-red-500 text-xs mt-1">{errors.location}</p>}
              </div>

              {/* WhatsApp Number */}
              <div>
                <label className="block text-sm font-semibold text-[#1d2b4f] mb-2">
                  WhatsApp Number
                </label>
                <input
                  type="tel"
                  value={formData.whatsappNumber}
                  onChange={(e) => setFormData({ ...formData, whatsappNumber: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-[#f4a825] focus:ring-2 focus:ring-[#f4a825] focus:ring-opacity-20 transition-colors"
                  placeholder="+234 123 456 7890"
                />
              </div>

              {/* Portfolio Link */}
              <div>
                <label className="block text-sm font-semibold text-[#1d2b4f] mb-2">
                  Portfolio Link
                </label>
                <div className="relative">
                  <LinkIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="url"
                    value={formData.portfolioLink}
                    onChange={(e) => setFormData({ ...formData, portfolioLink: e.target.value })}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-[#f4a825] focus:ring-2 focus:ring-[#f4a825] focus:ring-opacity-20 transition-colors"
                    placeholder="https://your-portfolio.com"
                  />
                </div>
              </div>

              {/* CV Upload */}
              <div>
                <label className="block text-sm font-semibold text-[#1d2b4f] mb-2">
                  Upload CV
                </label>
                <label className="flex items-center gap-3 p-3 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-[#f4a825] transition-colors">
                  <FileText className="w-6 h-6 text-gray-400" />
                  <span className="text-sm text-gray-600">{cvName || 'Click to upload CV (PDF, DOC, DOCX)'}</span>
                  <input type="file" accept=".pdf,.doc,.docx" onChange={handleCvChange} className="hidden" />
                </label>
              </div>

              {/* Skills */}
              <div>
                <label className="block text-sm font-semibold text-[#1d2b4f] mb-2">
                  Skills
                </label>
                <div className="flex gap-2 mb-2">
                  <input
                    type="text"
                    value={skillInput}
                    onChange={(e) => setSkillInput(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && addSkill()}
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-[#f4a825] focus:ring-2 focus:ring-[#f4a825] focus:ring-opacity-20 transition-colors"
                    placeholder="Type a skill and press Enter"
                  />
                  <button
                    type="button"
                    onClick={addSkill}
                    className="px-4 py-2 bg-[#0d6b57] text-white rounded-lg hover:bg-[#0a5545] transition-colors"
                  >
                    Add
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {formData.skills.map((skill) => (
                    <span key={skill} className="px-3 py-1 bg-[#f4a825] bg-opacity-10 text-[#f4a825] rounded-full text-sm flex items-center gap-2">
                      {skill}
                      <button type="button" onClick={() => removeSkill(skill)} className="hover:text-red-500 transition-colors">
                        <X size={14} />
                      </button>
                    </span>
                  ))}
                </div>
              </div>

              {/* Interests */}
              <div>
                <label className="block text-sm font-semibold text-[#1d2b4f] mb-2">
                  Interests
                </label>
                <div className="flex gap-2 mb-2">
                  <input
                    type="text"
                    value={interestInput}
                    onChange={(e) => setInterestInput(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && addInterest()}
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-[#f4a825] focus:ring-2 focus:ring-[#f4a825] focus:ring-opacity-20 transition-colors"
                    placeholder="Type an interest and press Enter"
                  />
                  <button
                    type="button"
                    onClick={addInterest}
                    className="px-4 py-2 bg-[#0d6b57] text-white rounded-lg hover:bg-[#0a5545] transition-colors"
                  >
                    Add
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {formData.interests.map((interest) => (
                    <span key={interest} className="px-3 py-1 bg-[#0d6b57] bg-opacity-10 text-[#0d6b57] rounded-full text-sm flex items-center gap-2">
                      {interest}
                      <button type="button" onClick={() => removeInterest(interest)} className="hover:text-red-500 transition-colors">
                        <X size={14} />
                      </button>
                    </span>
                  ))}
                </div>
              </div>

              {/* Bio */}
              <div>
                <label className="block text-sm font-semibold text-[#1d2b4f] mb-2">
                  Bio
                </label>
                <textarea
                  value={formData.bio}
                  onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                  rows={3}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-[#f4a825] focus:ring-2 focus:ring-[#f4a825] focus:ring-opacity-20 transition-colors resize-none"
                  placeholder="Tell us about yourself..."
                />
              </div>
            </div>

            {/* Google Signup Button */}
            <div className="pt-6 mt-4 border-t border-gray-200">
              <div className="relative mb-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white text-gray-500">Complete signup with</span>
                </div>
              </div>

              <div className="flex justify-center">
                <GoogleLogin
                  onSuccess={handleGoogleSuccess}
                  onError={handleGoogleError}
                  useOneTap={false}
                  theme="filled_blue"
                  size="large"
                  text="signup_with"
                  shape="rectangular"
                  width="100%"
                />
              </div>
              
              {isLoading && (
                <div className="mt-4 text-center text-[#0d6b57] font-semibold flex items-center justify-center gap-2">
                  <div className="w-4 h-4 border-2 border-[#0d6b57] border-t-transparent rounded-full animate-spin"></div>
                  Creating your account...
                </div>
              )}

              {/* Sign In Link */}
              <div className="mt-6 text-center">
                <p className="text-sm text-gray-600">
                  Already have an account?{' '}
                  <Link 
                    to="/signin" 
                    className="text-[#f4a825] font-semibold hover:text-[#e79a13] transition-colors inline-flex items-center gap-1"
                  >
                    Sign In
                    <ArrowRight size={14} />
                  </Link>
                </p>
              </div>

              {/* Terms Info */}
              <div className="mt-4 text-center">
                <p className="text-xs text-gray-400">
                  By signing up, you agree to our Terms of Service and Privacy Policy
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes fade-in-up {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .animate-fade-in-up {
          animation: fade-in-up 0.6s ease-out forwards;
        }
        
        .delay-200 {
          animation-delay: 0.2s;
          opacity: 0;
        }
        
        .delay-300 {
          animation-delay: 0.3s;
          opacity: 0;
        }

        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }

        .custom-scrollbar::-webkit-scrollbar-track {
          background: #f1f1f1;
          border-radius: 10px;
        }

        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #0d6b57;
          border-radius: 10px;
        }

        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #0a5545;
        }
      `}</style>
    </div>
  );
};

export default Signup;