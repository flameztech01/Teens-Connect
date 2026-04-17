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
  CheckCircle,
  User,
  Briefcase,
  Heart,
  Save,
  ChevronDown
} from 'lucide-react';

// Country codes data
const countryCodes = [
  { code: '+234', country: 'Nigeria', flag: '🇳🇬', example: '8029292929' },
  { code: '+1', country: 'USA/Canada', flag: '🇺🇸', example: '2125551234' },
  { code: '+44', country: 'UK', flag: '🇬🇧', example: '7123456789' },
  { code: '+233', country: 'Ghana', flag: '🇬🇭', example: '2029292929' },
  { code: '+254', country: 'Kenya', flag: '🇰🇪', example: '712345678' },
  { code: '+27', country: 'South Africa', flag: '🇿🇦', example: '712345678' },
  { code: '+256', country: 'Uganda', flag: '🇺🇬', example: '712345678' },
  { code: '+255', country: 'Tanzania', flag: '🇹🇿', example: '712345678' },
  { code: '+260', country: 'Zambia', flag: '🇿🇲', example: '966123456' },
  { code: '+263', country: 'Zimbabwe', flag: '🇿🇼', example: '712345678' },
  { code: '+91', country: 'India', flag: '🇮🇳', example: '9876543210' },
  { code: '+92', country: 'Pakistan', flag: '🇵🇰', example: '3123456789' },
  { code: '+880', country: 'Bangladesh', flag: '🇧🇩', example: '1712345678' },
  { code: '+94', country: 'Sri Lanka', flag: '🇱🇰', example: '712345678' },
  { code: '+60', country: 'Malaysia', flag: '🇲🇾', example: '123456789' },
  { code: '+65', country: 'Singapore', flag: '🇸🇬', example: '91234567' },
  { code: '+66', country: 'Thailand', flag: '🇹🇭', example: '812345678' },
  { code: '+84', country: 'Vietnam', flag: '🇻🇳', example: '912345678' },
  { code: '+63', country: 'Philippines', flag: '🇵🇭', example: '9123456789' },
  { code: '+62', country: 'Indonesia', flag: '🇮🇩', example: '8123456789' },
];

// Helper function to format phone number
const formatPhoneNumber = (countryCode: string, phoneNumber: string) => {
  // Remove all non-digit characters
  let cleaned = phoneNumber.replace(/\D/g, '');
  
  // Remove leading zero if present
  if (cleaned.startsWith('0')) {
    cleaned = cleaned.substring(1);
  }
  
  // For Nigeria (+234), ensure it's 10 digits after removing leading zero
  if (countryCode === '+234' && cleaned.length === 10) {
    return countryCode + cleaned;
  }
  
  // For other countries, just return code + cleaned number
  return countryCode + cleaned;
};

const Signup = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [googleSignup, { isLoading }] = useGoogleSignupMutation();
  
  const [selectedCountryCode, setSelectedCountryCode] = useState(countryCodes[0]);
  const [showCountryDropdown, setShowCountryDropdown] = useState(false);
  
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
  const [activeStep, setActiveStep] = useState(1);
  const [showSuccess, setShowSuccess] = useState(false);

  const handleGoogleSuccess = async (credentialResponse: CredentialResponse) => {
    const googleToken = credentialResponse.credential;
    
    if (!googleToken) {
      console.error('No Google token received');
      return;
    }

    // Format phone number with country code
    const formattedPhone = formatPhoneNumber(selectedCountryCode.code, formData.phone);
    const formattedWhatsapp = formData.whatsappNumber ? 
      formatPhoneNumber(selectedCountryCode.code, formData.whatsappNumber) : '';

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
      submitData.append('phone', formattedPhone);
      submitData.append('dateOfBirth', formData.dateOfBirth);
      submitData.append('gender', formData.gender);
      submitData.append('location', formData.location);
      submitData.append('whatsappNumber', formattedWhatsapp);
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
      setShowSuccess(true);
      setTimeout(() => navigate('/dashboard'), 2000);
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

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    // Allow only digits
    const digitsOnly = value.replace(/\D/g, '');
    setFormData({ ...formData, phone: digitsOnly });
  };

  const handleWhatsappChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    // Allow only digits
    const digitsOnly = value.replace(/\D/g, '');
    setFormData({ ...formData, whatsappNumber: digitsOnly });
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

  const nextStep = () => {
    if (activeStep === 1) {
      const step1Errors = validateStep1();
      if (Object.keys(step1Errors).length === 0) {
        setActiveStep(2);
      } else {
        setErrors(step1Errors);
        setTouched({ phone: true, dateOfBirth: true, gender: true, location: true });
      }
    } else {
      setActiveStep(3);
    }
  };

  const prevStep = () => {
    setActiveStep(activeStep - 1);
  };

  const validateStep1 = () => {
    const errors: Record<string, string> = {};
    if (!formData.phone) errors.phone = 'Phone number is required';
    if (formData.phone && formData.phone.length < 8) errors.phone = 'Please enter a valid phone number';
    if (!formData.dateOfBirth) errors.dateOfBirth = 'Date of birth is required';
    if (!formData.gender) errors.gender = 'Gender is required';
    if (!formData.location) errors.location = 'Location is required';
    return errors;
  };

  return (
    <div 
      className="min-h-screen bg-cover bg-center bg-no-repeat relative"
      style={{
        backgroundImage: "url('https://images.unsplash.com/photo-1523240795612-9a054b0db644?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80')"
      }}
    >
      <div className="absolute inset-0 bg-black/70" />
      
      <div className="relative max-w-6xl mx-auto px-4 py-8 lg:py-12">
        <div className="grid lg:grid-cols-2 gap-8 items-start min-h-[90vh]">
          
          {/* Left Side - Brand Info */}
          <div className="hidden lg:block text-white sticky top-12">
            <div className="space-y-8">
              <div>
                <img src="/logo.png" alt="TeensConnect" className="h-16 w-auto mb-6" />
                <h1 className="text-5xl font-bold mb-4 leading-tight">
                  Join the<br />
                  <span className="text-[#f4a825]">Future of Talent</span>
                </h1>
                <p className="text-gray-300 text-lg leading-relaxed">
                  Create your account and unlock opportunities to showcase your skills, connect with mentors, and grow your career.
                </p>
              </div>

              <div className="space-y-6 pt-8">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-[#f4a825]/20 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Award className="w-5 h-5 text-[#f4a825]" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-white">Showcase Your Talent</h3>
                    <p className="text-gray-400 text-sm">Get discovered by top companies and mentors</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-[#f4a825]/20 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Users className="w-5 h-5 text-[#f4a825]" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-white">Build Your Network</h3>
                    <p className="text-gray-400 text-sm">Connect with like-minded teens and industry experts</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-[#f4a825]/20 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Sparkles className="w-5 h-5 text-[#f4a825]" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-white">Access Opportunities</h3>
                    <p className="text-gray-400 text-sm">Find internships, scholarships, and events</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Side - Form */}
          <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
            {showSuccess && (
              <div className="absolute top-4 right-4 left-4 bg-green-500 text-white p-4 rounded-lg flex items-center gap-3 animate-fade-in z-10">
                <CheckCircle size={20} />
                <span>Account created successfully! Redirecting...</span>
              </div>
            )}

            <div className="bg-[#1d2b4f] px-6 py-5">
              <h2 className="text-white text-xl font-bold">Create Account</h2>
              <p className="text-gray-300 text-sm mt-1">Fill in your details to get started</p>
              
              <div className="flex gap-2 mt-4">
                {[1, 2, 3].map((step) => (
                  <div key={step} className="flex-1">
                    <div className={`h-1 rounded-full transition-all ${activeStep >= step ? 'bg-[#f4a825]' : 'bg-white/20'}`} />
                    <p className={`text-xs mt-1 ${activeStep >= step ? 'text-[#f4a825]' : 'text-white/40'}`}>
                      {step === 1 && 'Basic Info'}
                      {step === 2 && 'Profile'}
                      {step === 3 && 'Skills & Bio'}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {errors.submit && (
              <div className="mx-6 mt-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg text-sm">
                {errors.submit}
              </div>
            )}

            <div className="p-6">
              {/* Step 1: Basic Information */}
              {activeStep === 1 && (
                <div className="space-y-4">
                  {/* Phone Number with Country Code */}
                  <div>
                    <label className="block text-sm font-semibold text-[#1d2b4f] mb-2">
                      Phone Number <span className="text-red-500">*</span>
                    </label>
                    <div className="flex gap-2">
                      {/* Country Code Dropdown */}
                      <div className="relative">
                        <button
                          type="button"
                          onClick={() => setShowCountryDropdown(!showCountryDropdown)}
                          className="flex items-center gap-2 px-3 py-3 border border-gray-300 rounded-lg bg-white hover:border-[#f4a825] transition-colors"
                        >
                          <span className="text-lg">{selectedCountryCode.flag}</span>
                          <span className="text-sm font-medium">{selectedCountryCode.code}</span>
                          <ChevronDown size={14} className={`text-gray-400 transition-transform ${showCountryDropdown ? 'rotate-180' : ''}`} />
                        </button>
                        
                        {showCountryDropdown && (
                          <>
                            <div 
                              className="fixed inset-0 z-40"
                              onClick={() => setShowCountryDropdown(false)}
                            />
                            <div className="absolute top-full left-0 mt-1 w-64 bg-white border border-gray-200 rounded-lg shadow-lg z-50 max-h-60 overflow-y-auto">
                              {countryCodes.map((country) => (
                                <button
                                  key={country.code}
                                  type="button"
                                  onClick={() => {
                                    setSelectedCountryCode(country);
                                    setShowCountryDropdown(false);
                                  }}
                                  className="w-full flex items-center gap-3 px-3 py-2 hover:bg-gray-50 transition-colors text-left"
                                >
                                  <span className="text-lg">{country.flag}</span>
                                  <span className="text-sm font-medium">{country.code}</span>
                                  <span className="text-xs text-gray-500">{country.country}</span>
                                </button>
                              ))}
                            </div>
                          </>
                        )}
                      </div>
                      
                      {/* Phone Number Input */}
                      <div className="flex-1 relative">
                        <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                          type="tel"
                          value={formData.phone}
                          onChange={handlePhoneChange}
                          onBlur={() => handleBlur('phone')}
                          className={`w-full pl-10 pr-4 py-3 border ${touched.phone && errors.phone ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:outline-none focus:border-[#f4a825] focus:ring-2 focus:ring-[#f4a825] focus:ring-opacity-20 transition-colors`}
                          placeholder={`e.g., ${selectedCountryCode.example}`}
                        />
                      </div>
                    </div>
                    <p className="text-xs text-gray-400 mt-1">
                      {selectedCountryCode.flag} {selectedCountryCode.code} example: {selectedCountryCode.example}
                    </p>
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
                    <div className="grid grid-cols-2 gap-2">
                      {['Male', 'Female'].map((option) => (
                        <label key={option} className="flex items-center gap-2 p-2 border border-gray-300 rounded-lg cursor-pointer hover:border-[#f4a825] transition-colors">
                          <input
                            type="radio"
                            name="gender"
                            value={option.toLowerCase()}
                            checked={formData.gender === option.toLowerCase()}
                            onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                            className="text-[#f4a825] focus:ring-[#f4a825]"
                          />
                          <span className="text-sm">{option}</span>
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
                </div>
              )}

              {/* Step 2: Profile Information */}
              {activeStep === 2 && (
                <div className="space-y-4">
                  {/* Profile Picture */}
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
                        <label className="w-20 h-20 rounded-full border-2 border-dashed border-gray-300 flex flex-col items-center justify-center cursor-pointer hover:border-[#f4a825] transition-colors">
                          <Upload className="w-6 h-6 text-gray-400" />
                          <span className="text-[10px] text-gray-400 mt-1">Upload</span>
                          <input type="file" accept="image/*" onChange={handleProfilePictureChange} className="hidden" />
                        </label>
                      )}
                      <p className="text-xs text-gray-500">Optional</p>
                    </div>
                  </div>

                  {/* WhatsApp Number with Country Code */}
                  <div>
                    <label className="block text-sm font-semibold text-[#1d2b4f] mb-2">
                      WhatsApp Number
                    </label>
                    <div className="flex gap-2">
                      <div className="px-3 py-3 bg-gray-100 border border-gray-300 rounded-lg">
                        <span className="text-sm font-medium">{selectedCountryCode.code}</span>
                      </div>
                      <div className="flex-1">
                        <input
                          type="tel"
                          value={formData.whatsappNumber}
                          onChange={handleWhatsappChange}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-[#f4a825] focus:ring-2 focus:ring-[#f4a825] focus:ring-opacity-20 transition-colors"
                          placeholder={`e.g., ${selectedCountryCode.example}`}
                        />
                      </div>
                    </div>
                    <p className="text-xs text-gray-400 mt-1">
                      {selectedCountryCode.flag} {selectedCountryCode.code} example: {selectedCountryCode.example}
                    </p>
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
                </div>
              )}

              {/* Step 3: Skills & Bio */}
              {activeStep === 3 && (
                <div className="space-y-4">
                  {/* Skills */}
                  <div>
                    <label className="block text-sm font-semibold text-[#1d2b4f] mb-2">
                      Skills
                    </label>
                    <div className="flex gap-2 mb-3">
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
                    <div className="flex flex-wrap gap-2 min-h-[80px] p-3 bg-gray-50 rounded-lg border border-gray-200">
                      {formData.skills.length === 0 ? (
                        <p className="text-gray-400 text-sm">No skills added yet</p>
                      ) : (
                        formData.skills.map((skill) => (
                          <span key={skill} className="inline-flex items-center gap-2 px-3 py-1.5 bg-[#f4a825] text-white rounded-lg text-sm font-medium">
                            <Briefcase size={14} />
                            {skill}
                            <button type="button" onClick={() => removeSkill(skill)} className="hover:text-gray-200 transition-colors">
                              <X size={14} />
                            </button>
                          </span>
                        ))
                      )}
                    </div>
                  </div>

                  {/* Interests */}
                  <div>
                    <label className="block text-sm font-semibold text-[#1d2b4f] mb-2">
                      Interests
                    </label>
                    <div className="flex gap-2 mb-3">
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
                    <div className="flex flex-wrap gap-2 min-h-[80px] p-3 bg-gray-50 rounded-lg border border-gray-200">
                      {formData.interests.length === 0 ? (
                        <p className="text-gray-400 text-sm">No interests added yet</p>
                      ) : (
                        formData.interests.map((interest) => (
                          <span key={interest} className="inline-flex items-center gap-2 px-3 py-1.5 bg-[#0d6b57] text-white rounded-lg text-sm font-medium">
                            <Heart size={14} />
                            {interest}
                            <button type="button" onClick={() => removeInterest(interest)} className="hover:text-gray-200 transition-colors">
                              <X size={14} />
                            </button>
                          </span>
                        ))
                      )}
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
                      rows={4}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-[#f4a825] focus:ring-2 focus:ring-[#f4a825] focus:ring-opacity-20 transition-colors resize-none"
                      placeholder="Tell us about yourself, your passions, and what you're looking for..."
                    />
                  </div>
                </div>
              )}

              {/* Navigation Buttons */}
              <div className="flex gap-3 mt-8">
                {activeStep > 1 && (
                  <button
                    type="button"
                    onClick={prevStep}
                    className="flex-1 px-6 py-3 border-2 border-gray-300 text-gray-700 font-semibold rounded-lg hover:border-[#f4a825] hover:text-[#f4a825] transition-colors"
                  >
                    Back
                  </button>
                )}
                
                {activeStep < 3 ? (
                  <button
                    type="button"
                    onClick={nextStep}
                    className="flex-1 px-6 py-3 bg-[#f4a825] text-white font-semibold rounded-lg hover:bg-[#e79a13] transition-colors"
                  >
                    Continue
                  </button>
                ) : (
                  <div className="flex-1">
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
                )}
              </div>

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

              {isLoading && (
                <div className="mt-4 text-center text-[#0d6b57] font-semibold flex items-center justify-center gap-2">
                  <div className="w-4 h-4 border-2 border-[#0d6b57] border-t-transparent rounded-full animate-spin"></div>
                  Creating your account...
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;