import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  Eye,
  EyeOff,
  Upload,
  FileText,
  X,
  Briefcase,
  Heart,
  ChevronDown,
  Key,
  CheckCircle,
  AlertCircle,
  ArrowLeft,
  Clock,
} from 'lucide-react';
import { useSignupMutation, useVerifyOTPMutation, useResendOTPMutation, useUpdateProfileMutation } from '../slices/userApiSlice';
import { setCredentials } from '../slices/authSlice';

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
const formatPhoneNumber = (countryCode, phoneNumber) => {
  let cleaned = phoneNumber.replace(/\D/g, '');
  if (cleaned.startsWith('0')) {
    cleaned = cleaned.substring(1);
  }
  if (countryCode === '+234' && cleaned.length === 10) {
    return countryCode + cleaned;
  }
  return countryCode + cleaned;
};

// Shared minimal field classes
const fieldBase =
  'w-full px-4 py-3 bg-white/[0.04] border rounded-lg text-white text-sm placeholder-white/25 focus:outline-none focus:border-[#f4a825] focus:ring-1 focus:ring-[#f4a825]/40 transition-all';
const fieldOk = 'border-white/10';
const fieldErr = 'border-red-400/70';
const labelCls = 'block text-xs font-medium text-white/50 tracking-wide mb-1.5';

const Signup = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { userInfo } = useSelector((state) => state.auth);

  // Redirect if already logged in
  useEffect(() => {
    if (userInfo) {
      navigate('/dashboard');
    }
  }, [userInfo, navigate]);

  // Step management
  const [step, setStep] = useState(1);

  // Signup state
  const [signupData, setSignupData] = useState({
    name: '',
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [selectedCountryCode, setSelectedCountryCode] = useState(countryCodes[0]);
  const [showCountryDropdown, setShowCountryDropdown] = useState(false);
  const [signupErrors, setSignupErrors] = useState({});
  const [signupTouched, setSignupTouched] = useState({});

  // OTP state
  const [otp, setOtp] = useState('');
  const [otpEmail, setOtpEmail] = useState('');
  const [otpError, setOtpError] = useState('');
  const [otpSuccess, setOtpSuccess] = useState('');
  const [isResending, setIsResending] = useState(false);
  const [resendTimer, setResendTimer] = useState(0);
  const [otpSentTime, setOtpSentTime] = useState(null); // Track when OTP was sent

  // Profile completion state
  const [profileData, setProfileData] = useState({
    dateOfBirth: '',
    gender: '',
    location: '',
    whatsappNumber: '',
    portfolioLink: '',
    skills: [],
    interests: [],
    bio: '',
  });
  const [profilePicture, setProfilePicture] = useState(null);
  const [cv, setCv] = useState(null);
  const [profilePreview, setProfilePreview] = useState('');
  const [cvName, setCvName] = useState('');
  const [skillInput, setSkillInput] = useState('');
  const [interestInput, setInterestInput] = useState('');
  const [profileErrors, setProfileErrors] = useState({});
  const [profileTouched, setProfileTouched] = useState({});

  // API mutations
  const [signup, { isLoading: isSigningUp }] = useSignupMutation();
  const [verifyOTP, { isLoading: isVerifying }] = useVerifyOTPMutation();
  const [resendOTP, { isLoading: isResendingOTP }] = useResendOTPMutation();
  const [updateProfile, { isLoading: isUpdatingProfile }] = useUpdateProfileMutation();

  // Success/Error messages
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  // Resend timer countdown
  useEffect(() => {
    if (resendTimer > 0) {
      const timer = setTimeout(() => setResendTimer(resendTimer - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [resendTimer]);

  // ==================== STEP 1: SIGNUP ====================
  const validateSignup = () => {
    const errors = {};
    if (!signupData.name) errors.name = 'Full name is required';
    if (!signupData.username) errors.username = 'Username is required';
    if (signupData.username && signupData.username.length < 3) {
      errors.username = 'Username must be at least 3 characters';
    }
    if (!signupData.email) errors.email = 'Email is required';
    if (signupData.email && !/\S+@\S+\.\S+/.test(signupData.email)) {
      errors.email = 'Please enter a valid email';
    }
    if (!signupData.password) errors.password = 'Password is required';
    if (signupData.password && signupData.password.length < 6) {
      errors.password = 'Password must be at least 6 characters';
    }
    if (signupData.password !== signupData.confirmPassword) {
      errors.confirmPassword = 'Passwords do not match';
    }
    if (!signupData.phone) errors.phone = 'Phone number is required';
    if (signupData.phone && signupData.phone.length < 8) {
      errors.phone = 'Please enter a valid phone number';
    }
    return errors;
  };

  const handleSignupSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    const errors = validateSignup();
    if (Object.keys(errors).length > 0) {
      setSignupErrors(errors);
      setSignupTouched({
        name: true,
        username: true,
        email: true,
        password: true,
        confirmPassword: true,
        phone: true,
      });
      return;
    }

    try {
      const formattedPhone = formatPhoneNumber(selectedCountryCode.code, signupData.phone);
      const result = await signup({
        name: signupData.name,
        username: signupData.username,
        email: signupData.email,
        password: signupData.password,
        phone: formattedPhone,
      }).unwrap();

      setOtpEmail(signupData.email);
      const now = new Date();
      setOtpSentTime(now); // Record the time OTP was sent
      setSuccessMessage('OTP sent to your email! Please verify to continue.');
      setStep(2);
      setResendTimer(60);
    } catch (error) {
      setErrorMessage(error.data?.message || 'Signup failed. Please try again.');
    }
  };

  const handleSignupBlur = (field) => {
    setSignupTouched({ ...signupTouched, [field]: true });
  };

  // ==================== STEP 2: OTP VERIFICATION ====================
  const handleVerifyOTP = async (e) => {
    e.preventDefault();
    setOtpError('');
    setOtpSuccess('');
    setErrorMessage('');

    if (!otp || otp.length !== 6) {
      setOtpError('Please enter a valid 6-digit OTP');
      return;
    }

    try {
      const result = await verifyOTP({
        email: otpEmail,
        otp: otp,
      }).unwrap();

      dispatch(setCredentials(result));
      setOtpSuccess('Email verified successfully!');

      setTimeout(() => {
        setStep(3);
      }, 1000);
    } catch (error) {
      console.error('OTP Verification Error:', error);
      if (error.data) {
        setOtpError(error.data.message || 'Invalid OTP. Please try again.');
      } else if (error.status) {
        setOtpError(`Server error (${error.status}). Please try again.`);
      } else {
        setOtpError('Network error. Please check your connection.');
      }
    }
  };

  const handleResendOTP = async () => {
    if (resendTimer > 0) return;

    setIsResending(true);
    setOtpError('');
    setOtpSuccess('');

    try {
      await resendOTP({ email: otpEmail }).unwrap();
      const now = new Date();
      setOtpSentTime(now); // Update sent time on resend
      setOtpSuccess('New OTP sent to your email!');
      setResendTimer(60);
      setTimeout(() => setOtpSuccess(''), 3000);
    } catch (error) {
      setOtpError(error.data?.message || 'Failed to resend OTP');
    } finally {
      setIsResending(false);
    }
  };

  // ==================== STEP 3: COMPLETE PROFILE ====================
  const validateProfile = () => {
    const errors = {};
    if (!profileData.dateOfBirth) errors.dateOfBirth = 'Date of birth is required';
    if (!profileData.gender) errors.gender = 'Gender is required';
    if (!profileData.location) errors.location = 'Location is required';
    return errors;
  };

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    const errors = validateProfile();
    if (Object.keys(errors).length > 0) {
      setProfileErrors(errors);
      setProfileTouched({
        dateOfBirth: true,
        gender: true,
        location: true,
      });
      return;
    }

    try {
      const formattedWhatsapp = profileData.whatsappNumber
        ? formatPhoneNumber(selectedCountryCode.code, profileData.whatsappNumber)
        : '';

      const submitData = new FormData();
      submitData.append('dateOfBirth', profileData.dateOfBirth);
      submitData.append('gender', profileData.gender);
      submitData.append('location', profileData.location);
      submitData.append('whatsappNumber', formattedWhatsapp);
      submitData.append('portfolioLink', profileData.portfolioLink || '');
      submitData.append('skills', JSON.stringify(profileData.skills));
      submitData.append('interests', JSON.stringify(profileData.interests));
      submitData.append('bio', profileData.bio || '');

      if (profilePicture) {
        submitData.append('profilePicture', profilePicture);
      }
      if (cv) {
        submitData.append('cv', cv);
      }

      const result = await updateProfile(submitData).unwrap();
      dispatch(setCredentials({ ...result }));
      setSuccessMessage('Profile completed successfully!');

      setTimeout(() => {
        navigate('/dashboard');
      }, 1500);
    } catch (error) {
      setErrorMessage(error.data?.message || 'Failed to update profile');
    }
  };

  const handleProfileBlur = (field) => {
    setProfileTouched({ ...profileTouched, [field]: true });
  };

  // Profile helpers
  const addSkill = () => {
    if (skillInput.trim() && !profileData.skills.includes(skillInput.trim())) {
      setProfileData({ ...profileData, skills: [...profileData.skills, skillInput.trim()] });
      setSkillInput('');
    }
  };

  const removeSkill = (skill) => {
    setProfileData({ ...profileData, skills: profileData.skills.filter((s) => s !== skill) });
  };

  const addInterest = () => {
    if (interestInput.trim() && !profileData.interests.includes(interestInput.trim())) {
      setProfileData({ ...profileData, interests: [...profileData.interests, interestInput.trim()] });
      setInterestInput('');
    }
  };

  const removeInterest = (interest) => {
    setProfileData({ ...profileData, interests: profileData.interests.filter((i) => i !== interest) });
  };

  const handleProfilePictureChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setProfilePicture(file);
      const previewUrl = URL.createObjectURL(file);
      setProfilePreview(previewUrl);
    }
  };

  const handleCvChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setCv(file);
      setCvName(file.name);
    }
  };

  // ==================== RENDER ====================
  return (
    <div className="h-screen bg-[#0c0c0d] flex">
      {/* LEFT SIDE - IMAGE */}
      <div
        className="relative hidden lg:block w-1/2 h-full bg-cover bg-center flex-shrink-0"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1523240795612-9a054b0db644?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80')",
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-t from-[#0c0c0d] via-[#0c0c0d]/20 to-transparent" />
        <div className="absolute bottom-12 left-10 right-10">
          <div className="flex items-center gap-3 mb-4">
            <img src="/logo.png" alt="Teens Connect Logo" className="w-12 h-12 object-contain" />
            <span className="text-white text-2xl font-medium">Teens Connect</span>
          </div>
          <h1 className="text-white text-3xl lg:text-4xl font-medium leading-snug">
            Where young minds<br />connect and create.
          </h1>
          <p className="text-white/50 text-sm mt-4 max-w-sm leading-relaxed">
            A vibrant community for young people to meet, share ideas, and collaborate on projects that matter.
          </p>
        </div>
      </div>

      {/* RIGHT SIDE - FORM */}
      <div className="flex-1 h-full overflow-y-auto px-6 sm:px-10 lg:px-16 py-6 sm:py-8 lg:py-10">
        <div className="w-full max-w-md mx-auto">
          {/* Mobile Logo */}
          <div className="lg:hidden flex items-center justify-center gap-3 mb-6">
            <img src="/logo.png" alt="Teens Connect Logo" className="w-10 h-10 object-contain" />
            <span className="text-white text-xl font-medium">Teens Connect</span>
          </div>

          {/* Top row: back + step dots */}
          <div className="flex justify-between items-center mb-6">
            <button
              onClick={() => navigate('/')}
              className="text-white/40 hover:text-white transition-colors flex items-center gap-1.5 text-sm"
            >
              <ArrowLeft size={16} />
              Back
            </button>
            <div className="flex gap-1.5">
              {[1, 2, 3].map((s) => (
                <div
                  key={s}
                  className={`h-1.5 rounded-full transition-all ${
                    step === s ? 'w-6 bg-[#f4a825]' : step > s ? 'w-1.5 bg-[#f4a825]/50' : 'w-1.5 bg-white/15'
                  }`}
                />
              ))}
            </div>
          </div>

          {/* Error/Success Messages */}
          {errorMessage && (
            <div className="mb-4 p-3 bg-red-500/10 border border-red-500/20 text-red-300 rounded-xl flex items-center gap-2 text-sm">
              <AlertCircle size={16} className="text-red-400 flex-shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}
          {successMessage && (
            <div className="mb-4 p-3 bg-[#0d6b57]/10 border border-[#0d6b57]/30 text-[#3fd6b4] rounded-xl flex items-center gap-2 text-sm">
              <CheckCircle size={16} className="text-[#3fd6b4] flex-shrink-0" />
              <span>{successMessage}</span>
            </div>
          )}

          {/* ==================== STEP 1: SIGNUP ==================== */}
          {step === 1 && (
            <>
              <h2 className="text-2xl font-medium text-white">Join Teens Connect</h2>
              <p className="text-white/40 text-sm mt-2 mb-6 leading-relaxed">
                Create your account and start connecting with young creators like you.
              </p>

              <form onSubmit={handleSignupSubmit} className="space-y-4">
                <div>
                  <label className={labelCls}>
                    Full name <span className="text-[#f4a825]">*</span>
                  </label>
                  <input
                    type="text"
                    value={signupData.name}
                    onChange={(e) => setSignupData({ ...signupData, name: e.target.value })}
                    onBlur={() => handleSignupBlur('name')}
                    className={`${fieldBase} ${signupTouched.name && signupErrors.name ? fieldErr : fieldOk}`}
                    placeholder="John Doe"
                  />
                  {signupTouched.name && signupErrors.name && (
                    <p className="text-red-400 text-xs mt-1.5">{signupErrors.name}</p>
                  )}
                </div>

                <div>
                  <label className={labelCls}>
                    Username <span className="text-[#f4a825]">*</span>
                  </label>
                  <input
                    type="text"
                    value={signupData.username}
                    onChange={(e) =>
                      setSignupData({ ...signupData, username: e.target.value.toLowerCase().replace(/\s/g, '') })
                    }
                    onBlur={() => handleSignupBlur('username')}
                    className={`${fieldBase} ${signupTouched.username && signupErrors.username ? fieldErr : fieldOk}`}
                    placeholder="johndoe"
                  />
                  {signupTouched.username && signupErrors.username && (
                    <p className="text-red-400 text-xs mt-1.5">{signupErrors.username}</p>
                  )}
                </div>

                <div>
                  <label className={labelCls}>
                    Email address <span className="text-[#f4a825]">*</span>
                  </label>
                  <input
                    type="email"
                    value={signupData.email}
                    onChange={(e) => setSignupData({ ...signupData, email: e.target.value })}
                    onBlur={() => handleSignupBlur('email')}
                    className={`${fieldBase} ${signupTouched.email && signupErrors.email ? fieldErr : fieldOk}`}
                    placeholder="e.g. john@example.com"
                  />
                  {signupTouched.email && signupErrors.email && (
                    <p className="text-red-400 text-xs mt-1.5">{signupErrors.email}</p>
                  )}
                </div>

                <div>
                  <label className={labelCls}>
                    Phone number <span className="text-[#f4a825]">*</span>
                  </label>
                  <div className="flex gap-2">
                    <div className="relative">
                      <button
                        type="button"
                        onClick={() => setShowCountryDropdown(!showCountryDropdown)}
                        className="flex items-center gap-1.5 px-3 h-[46px] bg-white/[0.04] border border-white/10 rounded-lg hover:border-[#f4a825]/60 transition-colors"
                      >
                        <span className="text-base">{selectedCountryCode.flag}</span>
                        <span className="text-sm text-white">{selectedCountryCode.code}</span>
                        <ChevronDown
                          size={13}
                          className={`text-white/30 transition-transform ${showCountryDropdown ? 'rotate-180' : ''}`}
                        />
                      </button>

                      {showCountryDropdown && (
                        <>
                          <div className="fixed inset-0 z-40" onClick={() => setShowCountryDropdown(false)} />
                          <div className="absolute top-full left-0 mt-1 w-56 bg-[#151516] border border-white/10 rounded-xl shadow-2xl z-50 max-h-60 overflow-y-auto">
                            {countryCodes.map((country) => (
                              <button
                                key={country.code}
                                type="button"
                                onClick={() => {
                                  setSelectedCountryCode(country);
                                  setShowCountryDropdown(false);
                                }}
                                className="w-full flex items-center gap-3 px-3 py-2.5 hover:bg-white/5 transition-colors text-left"
                              >
                                <span className="text-base">{country.flag}</span>
                                <span className="text-sm text-white">{country.code}</span>
                                <span className="text-xs text-white/35">{country.country}</span>
                              </button>
                            ))}
                          </div>
                        </>
                      )}
                    </div>

                    <input
                      type="tel"
                      value={signupData.phone}
                      onChange={(e) => setSignupData({ ...signupData, phone: e.target.value.replace(/\D/g, '') })}
                      onBlur={() => handleSignupBlur('phone')}
                      className={`flex-1 ${fieldBase} ${signupTouched.phone && signupErrors.phone ? fieldErr : fieldOk}`}
                      placeholder={`e.g. ${selectedCountryCode.example}`}
                    />
                  </div>
                  {signupTouched.phone && signupErrors.phone && (
                    <p className="text-red-400 text-xs mt-1.5">{signupErrors.phone}</p>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className={labelCls}>Password</label>
                    <div className="relative">
                      <input
                        type={showPassword ? 'text' : 'password'}
                        value={signupData.password}
                        onChange={(e) => setSignupData({ ...signupData, password: e.target.value })}
                        onBlur={() => handleSignupBlur('password')}
                        className={`${fieldBase} pr-9 ${signupTouched.password && signupErrors.password ? fieldErr : fieldOk}`}
                        placeholder="••••••••"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60 transition-colors"
                      >
                        {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className={labelCls}>Confirm password</label>
                    <div className="relative">
                      <input
                        type={showConfirmPassword ? 'text' : 'password'}
                        value={signupData.confirmPassword}
                        onChange={(e) => setSignupData({ ...signupData, confirmPassword: e.target.value })}
                        onBlur={() => handleSignupBlur('confirmPassword')}
                        className={`${fieldBase} pr-9 ${
                          signupTouched.confirmPassword && signupErrors.confirmPassword ? fieldErr : fieldOk
                        }`}
                        placeholder="••••••••"
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60 transition-colors"
                      >
                        {showConfirmPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                      </button>
                    </div>
                  </div>
                </div>
                <p className="text-white/30 text-xs -mt-2">
                  Password must be at least 6 characters.
                </p>
                {signupTouched.password && signupErrors.password && (
                  <p className="text-red-400 text-xs -mt-2">{signupErrors.password}</p>
                )}
                {signupTouched.confirmPassword && signupErrors.confirmPassword && (
                  <p className="text-red-400 text-xs -mt-2">{signupErrors.confirmPassword}</p>
                )}

                <button
                  type="submit"
                  disabled={isSigningUp}
                  className="w-full bg-[#f4a825] text-[#1a1305] py-3 rounded-xl font-semibold text-sm hover:bg-[#e79a13] transition-all disabled:opacity-50 flex items-center justify-center gap-2 mt-2"
                >
                  {isSigningUp ? (
                    <>
                      <div className="w-4 h-4 border-2 border-[#1a1305] border-t-transparent rounded-full animate-spin" />
                      Creating account...
                    </>
                  ) : (
                    'Create account'
                  )}
                </button>

                <p className="text-center text-xs text-white/40 pt-2">
                  Already have an account?{' '}
                  <Link to="/signin" className="text-[#f4a825] font-medium hover:text-[#f4a825]/80 transition-colors">
                    Sign In
                  </Link>
                </p>
              </form>
            </>
          )}

          {/* ==================== STEP 2: OTP VERIFICATION (UPDATED) ==================== */}
          {step === 2 && (
            <>
              <div className="w-11 h-11 bg-[#f4a825]/15 rounded-xl flex items-center justify-center mb-5">
                <Key size={20} className="text-[#f4a825]" />
              </div>
              <h2 className="text-2xl font-medium text-white">Verify your email</h2>
              <p className="text-white/40 text-sm mt-2 leading-relaxed">
                We sent a 6-digit code to <span className="text-white/70">{otpEmail}</span>
              </p>

              {/* Timestamp */}
              <p className="text-white/30 text-xs mt-1 flex items-center gap-1">
                <Clock size={12} />
                {otpSentTime ? `Sent at ${otpSentTime.toLocaleTimeString()}` : 'Sending...'}
                <span className="text-white/20 mx-1">•</span>
                <span>Expires in 10 minutes</span>
              </p>

              {/* Spam warning */}
              <div className="mt-3 p-3 bg-yellow-500/10 border border-yellow-500/20 rounded-xl flex items-start gap-2">
                <AlertCircle size={16} className="text-yellow-400 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-yellow-400 text-xs font-medium">Didn't receive the email?</p>
                  <p className="text-yellow-300/70 text-[11px] leading-relaxed">
                    Check your spam or junk folder. If you still don't see it, click the button below to open Gmail.
                  </p>
                </div>
              </div>

              <form onSubmit={handleVerifyOTP} className="space-y-4 mt-2">
                <div>
                  <label className={labelCls}>Enter OTP code</label>
                  <input
                    type="text"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                    className={`${fieldBase} ${fieldOk} text-center text-xl tracking-[0.5em] py-3.5`}
                    placeholder="000000"
                    maxLength={6}
                    autoFocus
                  />
                  {otpError && (
                    <p className="text-red-400 text-xs mt-1.5 flex items-center gap-1">
                      <AlertCircle size={12} />
                      {otpError}
                    </p>
                  )}
                  {otpSuccess && (
                    <p className="text-[#3fd6b4] text-xs mt-1.5 flex items-center gap-1">
                      <CheckCircle size={12} />
                      {otpSuccess}
                    </p>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={isVerifying || otp.length !== 6}
                  className="w-full bg-[#f4a825] text-[#1a1305] py-3 rounded-xl font-semibold text-sm hover:bg-[#e79a13] transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {isVerifying ? (
                    <>
                      <div className="w-4 h-4 border-2 border-[#1a1305] border-t-transparent rounded-full animate-spin" />
                      Verifying...
                    </>
                  ) : (
                    'Verify email'
                  )}
                </button>

                <div className="flex items-center justify-between pt-1">
                  <button
                    type="button"
                    onClick={handleResendOTP}
                    disabled={isResendingOTP || resendTimer > 0}
                    className="text-xs text-white/40 hover:text-[#f4a825] transition-colors disabled:opacity-50"
                  >
                    {isResendingOTP ? 'Sending...' : resendTimer > 0 ? `Resend in ${resendTimer}s` : 'Resend OTP'}
                  </button>

                  {/* Open Gmail button */}
                  <a
                    href="https://mail.google.com/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-xs text-blue-400 hover:text-blue-300 transition-colors"
                  >
                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M20.283 4.5H3.717C2.447 4.5 1.5 5.447 1.5 6.717v10.566c0 1.27.947 2.217 2.217 2.217h16.566c1.27 0 2.217-.947 2.217-2.217V6.717c0-1.27-.947-2.217-2.217-2.217zM12 12.609L3.717 7.5h16.566L12 12.609zM3 7.5v9.783l4.8-4.8L3 7.5zm4.8 5.283l-4.2 4.2h16.8l-4.2-4.2L12 15.391l-4.2-2.608zm6.4-.483l4.8 4.8V7.5l-4.8 4.8z"/>
                    </svg>
                    Open Gmail
                  </a>
                </div>
              </form>
            </>
          )}

          {/* ==================== STEP 3: COMPLETE PROFILE ==================== */}
          {step === 3 && (
            <>
              <div className="w-11 h-11 bg-[#0d6b57]/20 rounded-xl flex items-center justify-center mb-5">
                <CheckCircle size={20} className="text-[#3fd6b4]" />
              </div>
              <h2 className="text-2xl font-medium text-white">Complete your profile</h2>
              <p className="text-white/40 text-sm mt-2 mb-6 leading-relaxed">
                Tell us more about yourself to get started.
              </p>

              <form onSubmit={handleProfileSubmit} className="space-y-4 pb-6">
                <div>
                  <label className={labelCls}>
                    Date of birth <span className="text-[#f4a825]">*</span>
                  </label>
                  <input
                    type="date"
                    value={profileData.dateOfBirth}
                    onChange={(e) => setProfileData({ ...profileData, dateOfBirth: e.target.value })}
                    onBlur={() => handleProfileBlur('dateOfBirth')}
                    className={`${fieldBase} ${
                      profileTouched.dateOfBirth && profileErrors.dateOfBirth ? fieldErr : fieldOk
                    }`}
                  />
                  {profileTouched.dateOfBirth && profileErrors.dateOfBirth && (
                    <p className="text-red-400 text-xs mt-1.5">{profileErrors.dateOfBirth}</p>
                  )}
                </div>

                <div>
                  <label className={labelCls}>
                    Gender <span className="text-[#f4a825]">*</span>
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {['Male', 'Female', 'Other', 'Prefer not to say'].map((option) => {
                      const value = option.toLowerCase().replace(/ /g, '-');
                      return (
                        <label
                          key={option}
                          className={`flex items-center gap-2 p-2.5 border rounded-lg cursor-pointer transition-all ${
                            profileData.gender === value
                              ? 'border-[#f4a825] bg-[#f4a825]/10'
                              : 'border-white/10 hover:border-[#f4a825]/50'
                          }`}
                        >
                          <input
                            type="radio"
                            name="gender"
                            value={value}
                            checked={profileData.gender === value}
                            onChange={(e) => setProfileData({ ...profileData, gender: e.target.value })}
                            className="text-[#f4a825] focus:ring-[#f4a825] bg-transparent"
                          />
                          <span className="text-xs text-white/80">{option}</span>
                        </label>
                      );
                    })}
                  </div>
                  {profileTouched.gender && profileErrors.gender && (
                    <p className="text-red-400 text-xs mt-1.5">{profileErrors.gender}</p>
                  )}
                </div>

                <div>
                  <label className={labelCls}>
                    Location <span className="text-[#f4a825]">*</span>
                  </label>
                  <input
                    type="text"
                    value={profileData.location}
                    onChange={(e) => setProfileData({ ...profileData, location: e.target.value })}
                    onBlur={() => handleProfileBlur('location')}
                    className={`${fieldBase} ${
                      profileTouched.location && profileErrors.location ? fieldErr : fieldOk
                    }`}
                    placeholder="City, Country"
                  />
                  {profileTouched.location && profileErrors.location && (
                    <p className="text-red-400 text-xs mt-1.5">{profileErrors.location}</p>
                  )}
                </div>

                <div>
                  <label className={labelCls}>WhatsApp number</label>
                  <div className="flex gap-2">
                    <div className="px-3 h-[46px] flex items-center bg-white/[0.04] border border-white/10 rounded-lg">
                      <span className="text-sm text-white">{selectedCountryCode.code}</span>
                    </div>
                    <input
                      type="tel"
                      value={profileData.whatsappNumber}
                      onChange={(e) =>
                        setProfileData({ ...profileData, whatsappNumber: e.target.value.replace(/\D/g, '') })
                      }
                      className={`flex-1 ${fieldBase} ${fieldOk}`}
                      placeholder={`e.g. ${selectedCountryCode.example}`}
                    />
                  </div>
                </div>

                <div>
                  <label className={labelCls}>Portfolio link</label>
                  <input
                    type="url"
                    value={profileData.portfolioLink}
                    onChange={(e) => setProfileData({ ...profileData, portfolioLink: e.target.value })}
                    className={`${fieldBase} ${fieldOk}`}
                    placeholder="https://your-portfolio.com"
                  />
                </div>

                <div>
                  <label className={labelCls}>Profile picture</label>
                  <div className="flex items-center gap-4">
                    {profilePreview ? (
                      <div className="relative">
                        <img
                          src={profilePreview}
                          alt="Profile preview"
                          className="w-14 h-14 rounded-full object-cover border-2 border-[#f4a825]"
                        />
                        <button
                          type="button"
                          onClick={() => {
                            setProfilePicture(null);
                            setProfilePreview('');
                          }}
                          className="absolute -top-1.5 -right-1.5 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
                        >
                          <X size={11} />
                        </button>
                      </div>
                    ) : (
                      <label className="w-14 h-14 rounded-full border border-dashed border-white/20 flex flex-col items-center justify-center cursor-pointer hover:border-[#f4a825] transition-colors">
                        <Upload className="w-4 h-4 text-white/30" />
                        <input type="file" accept="image/*" onChange={handleProfilePictureChange} className="hidden" />
                      </label>
                    )}
                    <p className="text-xs text-white/30">Optional</p>
                  </div>
                </div>

                <div>
                  <label className={labelCls}>Upload CV</label>
                  <label className="flex items-center gap-3 p-3 border border-dashed border-white/15 rounded-lg cursor-pointer hover:border-[#f4a825] transition-colors">
                    <FileText className="w-4 h-4 text-white/30" />
                    <span className="text-xs text-white/50">{cvName || 'Click to upload CV (PDF, DOC, DOCX)'}</span>
                    <input type="file" accept=".pdf,.doc,.docx" onChange={handleCvChange} className="hidden" />
                  </label>
                </div>

                <div>
                  <label className={labelCls}>Skills</label>
                  <div className="flex gap-2 mb-2">
                    <input
                      type="text"
                      value={skillInput}
                      onChange={(e) => setSkillInput(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addSkill())}
                      className={`flex-1 ${fieldBase} ${fieldOk} py-2.5`}
                      placeholder="Type a skill and press Enter"
                    />
                    <button
                      type="button"
                      onClick={addSkill}
                      className="px-4 py-2.5 bg-[#0d6b57] text-white text-sm rounded-lg hover:bg-[#0a5545] transition-all"
                    >
                      Add
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-2 min-h-[40px] p-2.5 bg-white/[0.02] rounded-lg border border-white/5">
                    {profileData.skills.length === 0 ? (
                      <p className="text-white/25 text-xs">No skills added yet</p>
                    ) : (
                      profileData.skills.map((skill) => (
                        <span
                          key={skill}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#f4a825]/15 text-[#f4a825] rounded-md text-xs font-medium"
                        >
                          <Briefcase size={11} />
                          {skill}
                          <button type="button" onClick={() => removeSkill(skill)} className="hover:text-white/70 transition-colors">
                            <X size={12} />
                          </button>
                        </span>
                      ))
                    )}
                  </div>
                </div>

                <div>
                  <label className={labelCls}>Interests</label>
                  <div className="flex gap-2 mb-2">
                    <input
                      type="text"
                      value={interestInput}
                      onChange={(e) => setInterestInput(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addInterest())}
                      className={`flex-1 ${fieldBase} ${fieldOk} py-2.5`}
                      placeholder="Type an interest and press Enter"
                    />
                    <button
                      type="button"
                      onClick={addInterest}
                      className="px-4 py-2.5 bg-[#0d6b57] text-white text-sm rounded-lg hover:bg-[#0a5545] transition-all"
                    >
                      Add
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-2 min-h-[40px] p-2.5 bg-white/[0.02] rounded-lg border border-white/5">
                    {profileData.interests.length === 0 ? (
                      <p className="text-white/25 text-xs">No interests added yet</p>
                    ) : (
                      profileData.interests.map((interest) => (
                        <span
                          key={interest}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#0d6b57]/15 text-[#3fd6b4] rounded-md text-xs font-medium"
                        >
                          <Heart size={11} />
                          {interest}
                          <button type="button" onClick={() => removeInterest(interest)} className="hover:text-white/70 transition-colors">
                            <X size={12} />
                          </button>
                        </span>
                      ))
                    )}
                  </div>
                </div>

                <div>
                  <label className={labelCls}>Bio</label>
                  <textarea
                    value={profileData.bio}
                    onChange={(e) => setProfileData({ ...profileData, bio: e.target.value })}
                    rows={3}
                    className={`${fieldBase} ${fieldOk} resize-none`}
                    placeholder="Tell us about yourself...."
                  />
                </div>

                <button
                  type="submit"
                  disabled={isUpdatingProfile}
                  className="w-full bg-[#f4a825] text-[#1a1305] py-3 rounded-xl font-semibold text-sm hover:bg-[#e79a13] transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {isUpdatingProfile ? (
                    <>
                      <div className="w-4 h-4 border-2 border-[#1a1305] border-t-transparent rounded-full animate-spin" />
                      Saving...
                    </>
                  ) : (
                    'Complete profile'
                  )}
                </button>
              </form>
            </>
          )}
        </div>
      </div>

      <style>{`
        input[type="date"]::-webkit-calendar-picker-indicator {
          filter: invert(0.6);
        }
      `}</style>
    </div>
  );
};

export default Signup;