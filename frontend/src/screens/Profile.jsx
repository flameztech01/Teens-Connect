import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useLocation } from 'react-router-dom';
import DashboardSidebar from '../components/DashbordSidebar';
import { useGetUserByIdQuery, useUpdateProfileMutation } from '../slices/userApiSlice';
import { setCredentials } from '../slices/authSlice';
import {
  UserCircle,
  Mail,
  Phone,
  MapPin,
  Briefcase,
  Calendar,
  Link as LinkIcon,
  Edit2,
  Save,
  X,
  Camera,
  Award,
  Clock,
  CheckCircle,
  AlertCircle,
  Heart,
  Sparkles,
  TrendingUp,
} from 'lucide-react';

// ---- design tokens ----
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

// Helper to calculate profile completion percentage
const getProfileCompletion = (user) => {
  if (!user) return 0;
  
  const fields = [
    { key: 'dateOfBirth', weight: 1 },
    { key: 'gender', weight: 1 },
    { key: 'location', weight: 1 },
    { key: 'whatsappNumber', weight: 1 },
    { key: 'skills', weight: 1 }, // must be non-empty array
    { key: 'interests', weight: 1 }, // must be non-empty array
  ];
  
  let completed = 0;
  let totalWeight = fields.reduce((sum, f) => sum + f.weight, 0);
  
  for (const field of fields) {
    const value = user[field.key];
    if (field.key === 'skills' || field.key === 'interests') {
      if (Array.isArray(value) && value.length > 0) {
        completed += field.weight;
      }
    } else {
      if (value && value !== '') {
        completed += field.weight;
      }
    }
  }
  
  return Math.round((completed / totalWeight) * 100);
};

const Profile = () => {
  const dispatch = useDispatch();
  const location = useLocation();
  const { userInfo } = useSelector((state) => state.auth);
  const [isEditing, setIsEditing] = useState(false);
  const [profilePicture, setProfilePicture] = useState(null);
  const [profilePreview, setProfilePreview] = useState('');

  const [formData, setFormData] = useState({
    name: '',
    username: '',
    email: '',
    phone: '',
    bio: '',
    location: '',
    skills: [],
    interests: [],
    portfolioLink: '',
    whatsappNumber: '',
    dateOfBirth: '',
    gender: '',
    profile: '',
  });

  const [newSkill, setNewSkill] = useState('');
  const [newInterest, setNewInterest] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const { data: userData, isLoading, refetch } = useGetUserByIdQuery(userInfo?._id, {
    skip: !userInfo?._id,
  });

  const [updateProfile, { isLoading: isUpdating }] = useUpdateProfileMutation();

  useEffect(() => {
    if (userData) {
      setFormData({
        name: userData.name || '',
        username: userData.username || '',
        email: userData.email || '',
        phone: userData.phone || '',
        bio: userData.bio || '',
        location: userData.location || '',
        skills: userData.skills || [],
        interests: userData.interests || [],
        portfolioLink: userData.portfolioLink || '',
        whatsappNumber: userData.whatsappNumber || '',
        dateOfBirth: userData.dateOfBirth ? userData.dateOfBirth.split('T')[0] : '',
        gender: userData.gender || '',
        profile: userData.profile || userData.profilePicture || '',
      });
    }
  }, [userData]);

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleProfilePictureChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setProfilePicture(file);
      const previewUrl = URL.createObjectURL(file);
      setProfilePreview(previewUrl);
    }
  };

  const addSkill = () => {
    if (newSkill.trim() && !formData.skills.includes(newSkill.trim())) {
      setFormData({
        ...formData,
        skills: [...formData.skills, newSkill.trim()],
      });
      setNewSkill('');
    }
  };

  const removeSkill = (skill) => {
    setFormData({
      ...formData,
      skills: formData.skills.filter((s) => s !== skill),
    });
  };

  const addInterest = () => {
    if (newInterest.trim() && !formData.interests.includes(newInterest.trim())) {
      setFormData({
        ...formData,
        interests: [...formData.interests, newInterest.trim()],
      });
      setNewInterest('');
    }
  };

  const removeInterest = (interest) => {
    setFormData({
      ...formData,
      interests: formData.interests.filter((i) => i !== interest),
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    try {
      const submitData = new FormData();
      submitData.append('name', formData.name);
      submitData.append('username', formData.username);
      submitData.append('phone', formData.phone);
      submitData.append('bio', formData.bio);
      submitData.append('location', formData.location);
      submitData.append('skills', JSON.stringify(formData.skills));
      submitData.append('interests', JSON.stringify(formData.interests));
      submitData.append('portfolioLink', formData.portfolioLink);
      submitData.append('whatsappNumber', formData.whatsappNumber);
      submitData.append('dateOfBirth', formData.dateOfBirth);
      submitData.append('gender', formData.gender);

      if (profilePicture) {
        submitData.append('profilePicture', profilePicture);
      }

      const result = await updateProfile(submitData).unwrap();
      dispatch(setCredentials({ ...userInfo, ...result }));

      setSuccessMessage('Profile updated successfully!');
      setIsEditing(false);
      setProfilePicture(null);
      setProfilePreview('');
      refetch();

      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (error) {
      setErrorMessage(error.data?.message || 'Failed to update profile');
      setTimeout(() => setErrorMessage(''), 3000);
    }
  };

  const getInitials = (name) => {
    if (!name) return 'U';
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  // Calculate profile completion percentage
  const completionPercentage = getProfileCompletion(userData);
  const isComplete = completionPercentage === 100;
  const showWarning = !isComplete;

  if (isLoading) {
    return (
      <div className="min-h-screen" style={{ backgroundColor: BG }}>
        <DashboardSidebar />
        <div className="lg:ml-72 flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div
              className="inline-block animate-spin rounded-full h-12 w-12 border-4"
              style={{ borderColor: BORDER, borderTopColor: GOLD }}
            />
            <p className="mt-4 text-sm" style={{ color: MUTED }}>Loading profile...</p>
          </div>
        </div>
      </div>
    );
  }

  const displayImage = profilePreview || formData.profile;

  return (
    <div className="min-h-screen" style={{ backgroundColor: BG }}>
      <DashboardSidebar />

      <div className="lg:ml-72 relative">
        {/* Header – dark theme */}
        <div
          className="sticky top-0 z-30"
          style={{ backgroundColor: BG, borderBottom: `1px solid ${BORDER}` }}
        >
          <div className="px-4 sm:px-6 py-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div
                  className="w-10 h-10 shrink-0 rounded-xl flex items-center justify-center"
                  style={{ backgroundColor: GOLD_TINT }}
                >
                  <UserCircle className="w-5 h-5" style={{ color: GOLD }} />
                </div>
                <div>
                  <h1 className="text-base sm:text-lg font-semibold leading-tight" style={{ color: INK }}>
                    My Profile
                  </h1>
                  <p className="text-[11px] sm:text-xs" style={{ color: MUTED }}>
                    Manage your personal information and preferences
                  </p>
                </div>
              </div>

              {!isEditing && (
                <button
                  onClick={() => setIsEditing(true)}
                  className="flex items-center gap-2 px-4 sm:px-5 py-2 rounded-full text-sm font-semibold transition-all hover:scale-105"
                  style={{ backgroundColor: GOLD, color: BG }}
                >
                  <Edit2 size={16} />
                  <span className="hidden sm:inline">Edit Profile</span>
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Main content */}
        <div className="px-3 sm:px-6 py-4 sm:py-6 max-w-6xl mx-auto">
          {/* Incomplete Profile Warning Banner - Compact with progress bar */}
          {showWarning && (
            <div
              className="mb-4 p-3 sm:p-4 rounded-xl flex items-start gap-2 sm:gap-3"
              style={{
                backgroundColor: 'rgba(244,168,37,0.08)',
                border: `1px solid ${GOLD}44`,
              }}
            >
              <AlertCircle size={16} className="sm:w-5 sm:h-5" style={{ color: GOLD }} className="flex-shrink-0 mt-0.5" />
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <p className="font-semibold text-xs sm:text-sm" style={{ color: GOLD }}>
                    <span className="sm:hidden">Profile: {completionPercentage}%</span>
                    <span className="hidden sm:inline">Profile Completion: {completionPercentage}%</span>
                  </p>
                  <span className="text-[10px] sm:text-xs" style={{ color: MUTED }}>
                    {completionPercentage < 100 ? 'Incomplete' : 'Complete'}
                  </span>
                </div>
                <div className="w-full h-1.5 rounded-full mt-1" style={{ backgroundColor: 'rgba(255,255,255,0.1)' }}>
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{
                      width: `${completionPercentage}%`,
                      backgroundColor: completionPercentage >= 80 ? GREEN : GOLD,
                    }}
                  />
                </div>
                {/* Short message for mobile, full message for larger screens */}
                <p className="text-xs sm:text-sm mt-1.5 sm:mt-2 sm:hidden" style={{ color: MUTED }}>
                  {completionPercentage < 100
                    ? 'Complete your profile to get discovered.'
                    : 'Profile complete! You can now be discovered.'}
                </p>
                <p className="text-sm mt-2 hidden sm:block" style={{ color: MUTED }}>
                  {completionPercentage < 100
                    ? 'Complete your profile to be discovered by collaborators and receive exclusive deals.'
                    : 'Your profile is fully complete! You can now be discovered.'}
                </p>
                {location.state?.incomplete && (
                  <p className="text-xs mt-1 hidden sm:block" style={{ color: MUTED }}>
                    You were redirected here to finish setting up your account.
                  </p>
                )}
              </div>
              <button
                onClick={() => {
                  setIsEditing(true);
                  setTimeout(() => {
                    document.querySelector('form')?.scrollIntoView({ behavior: 'smooth' });
                  }, 100);
                }}
                className="px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg text-xs sm:text-sm font-semibold transition hover:opacity-80 flex-shrink-0"
                style={{ backgroundColor: GOLD, color: BG }}
              >
                Edit
              </button>
            </div>
          )}

          {/* Success/Error Messages */}
          {successMessage && (
            <div
              className="mb-4 p-3 rounded-xl flex items-center gap-2"
              style={{
                backgroundColor: 'rgba(34,197,94,0.08)',
                border: `1px solid rgba(34,197,94,0.2)`,
              }}
            >
              <CheckCircle size={18} style={{ color: GREEN }} />
              <span className="text-sm font-medium" style={{ color: GREEN }}>
                {successMessage}
              </span>
            </div>
          )}
          {errorMessage && (
            <div
              className="mb-4 p-3 rounded-xl flex items-center gap-2"
              style={{
                backgroundColor: 'rgba(239,68,68,0.08)',
                border: `1px solid rgba(239,68,68,0.2)`,
              }}
            >
              <AlertCircle size={18} style={{ color: RED }} />
              <span className="text-sm font-medium" style={{ color: RED }}>
                {errorMessage}
              </span>
            </div>
          )}

          <div className="grid lg:grid-cols-3 gap-4 sm:gap-6">
            {/* Left Column – Profile Summary Card */}
            <div className="lg:col-span-1">
              <CardShell glow>
                <div className="flex flex-col items-center">
                  <div className="relative">
                    {displayImage ? (
                      <img
                        src={displayImage}
                        alt={formData.name}
                        className="w-24 h-24 rounded-full object-cover ring-2"
                        style={{ ringColor: GOLD_TINT }}
                      />
                    ) : (
                      <div
                        className="w-24 h-24 rounded-full flex items-center justify-center ring-2"
                        style={{
                          background: `linear-gradient(135deg, ${GOLD}, ${GOLD_DEEP})`,
                          ringColor: GOLD_TINT,
                        }}
                      >
                        <span className="text-white font-bold text-2xl">
                          {getInitials(formData.name)}
                        </span>
                      </div>
                    )}
                    {isEditing && (
                      <label
                        className="absolute bottom-0 right-0 p-1.5 rounded-full cursor-pointer transition-colors ring-2"
                        style={{ backgroundColor: GOLD, ringColor: BG }}
                      >
                        <Camera size={12} style={{ color: BG }} />
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleProfilePictureChange}
                          className="hidden"
                        />
                      </label>
                    )}
                  </div>

                  <div className="text-center mt-4">
                    <h2 className="text-xl font-bold" style={{ color: INK }}>
                      {formData.name}
                    </h2>
                    <p className="text-sm" style={{ color: MUTED }}>
                      @{formData.username}
                    </p>
                  </div>

                  <div
                    className="flex justify-around w-full mt-6 pt-4 border-t"
                    style={{ borderColor: BORDER }}
                  >
                    <div className="text-center">
                      <p className="text-xl font-bold" style={{ color: INK }}>
                        {formData.skills.length}
                      </p>
                      <p className="text-xs" style={{ color: MUTED }}>
                        Skills
                      </p>
                    </div>
                    <div className="text-center">
                      <p className="text-xl font-bold" style={{ color: INK }}>
                        {formData.interests.length}
                      </p>
                      <p className="text-xs" style={{ color: MUTED }}>
                        Interests
                      </p>
                    </div>
                    <div className="text-center">
                      <p className="text-xl font-bold" style={{ color: INK }}>
                        {userData?.profileViews || 0}
                      </p>
                      <p className="text-xs" style={{ color: MUTED }}>
                        Views
                      </p>
                    </div>
                  </div>

                  <div className="w-full mt-6 space-y-2 text-sm">
                    {formData.email && (
                      <div className="flex items-center gap-2" style={{ color: MUTED }}>
                        <Mail size={14} style={{ color: MUTED }} />
                        <span>{formData.email}</span>
                      </div>
                    )}
                    {formData.phone && (
                      <div className="flex items-center gap-2" style={{ color: MUTED }}>
                        <Phone size={14} style={{ color: MUTED }} />
                        <span>{formData.phone}</span>
                      </div>
                    )}
                    {formData.location && (
                      <div className="flex items-center gap-2" style={{ color: MUTED }}>
                        <MapPin size={14} style={{ color: MUTED }} />
                        <span>{formData.location}</span>
                      </div>
                    )}
                    {formData.dateOfBirth && (
                      <div className="flex items-center gap-2" style={{ color: MUTED }}>
                        <Calendar size={14} style={{ color: MUTED }} />
                        <span>{new Date(formData.dateOfBirth).toLocaleDateString()}</span>
                      </div>
                    )}
                  </div>

                  {formData.portfolioLink && (
                    <a
                      href={formData.portfolioLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-4 flex items-center justify-center gap-2 text-sm transition-colors hover:opacity-80"
                      style={{ color: BLUE }}
                    >
                      <LinkIcon size={14} />
                      View Portfolio
                    </a>
                  )}
                </div>
              </CardShell>
            </div>

            {/* Right Column – Edit Form Card */}
            <div className="lg:col-span-2">
              <CardShell glow>
                <div className="border-b pb-4 mb-5" style={{ borderColor: BORDER }}>
                  <h3 className="font-semibold" style={{ color: INK }}>
                    Profile Information
                  </h3>
                </div>

                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-1.5" style={{ color: MUTED }}>
                        Full Name
                      </label>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        disabled={!isEditing}
                        className="w-full px-3.5 py-2.5 rounded-xl focus:outline-none focus:ring-2 transition-colors disabled:opacity-50"
                        style={{
                          backgroundColor: 'rgba(255,255,255,0.04)',
                          color: INK,
                          border: `1px solid ${BORDER}`,
                          focusRing: GOLD,
                        }}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1.5" style={{ color: MUTED }}>
                        Username
                      </label>
                      <input
                        type="text"
                        name="username"
                        value={formData.username}
                        onChange={handleInputChange}
                        disabled={!isEditing}
                        className="w-full px-3.5 py-2.5 rounded-xl focus:outline-none focus:ring-2 transition-colors disabled:opacity-50"
                        style={{
                          backgroundColor: 'rgba(255,255,255,0.04)',
                          color: INK,
                          border: `1px solid ${BORDER}`,
                          focusRing: GOLD,
                        }}
                      />
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-1.5" style={{ color: MUTED }}>
                        Phone Number
                      </label>
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        disabled={!isEditing}
                        className="w-full px-3.5 py-2.5 rounded-xl focus:outline-none focus:ring-2 transition-colors disabled:opacity-50"
                        style={{
                          backgroundColor: 'rgba(255,255,255,0.04)',
                          color: INK,
                          border: `1px solid ${BORDER}`,
                          focusRing: GOLD,
                        }}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1.5" style={{ color: MUTED }}>
                        WhatsApp Number
                      </label>
                      <input
                        type="tel"
                        name="whatsappNumber"
                        value={formData.whatsappNumber}
                        onChange={handleInputChange}
                        disabled={!isEditing}
                        className="w-full px-3.5 py-2.5 rounded-xl focus:outline-none focus:ring-2 transition-colors disabled:opacity-50"
                        style={{
                          backgroundColor: 'rgba(255,255,255,0.04)',
                          color: INK,
                          border: `1px solid ${BORDER}`,
                          focusRing: GOLD,
                        }}
                        placeholder="+234 123 456 7890"
                      />
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-1.5" style={{ color: MUTED }}>
                        Date of Birth
                      </label>
                      <input
                        type="date"
                        name="dateOfBirth"
                        value={formData.dateOfBirth}
                        onChange={handleInputChange}
                        disabled={!isEditing}
                        className="w-full px-3.5 py-2.5 rounded-xl focus:outline-none focus:ring-2 transition-colors disabled:opacity-50"
                        style={{
                          backgroundColor: 'rgba(255,255,255,0.04)',
                          color: INK,
                          border: `1px solid ${BORDER}`,
                          focusRing: GOLD,
                        }}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1.5" style={{ color: MUTED }}>
                        Gender
                      </label>
                      <select
                        name="gender"
                        value={formData.gender}
                        onChange={handleInputChange}
                        disabled={!isEditing}
                        className="w-full px-3.5 py-2.5 rounded-xl focus:outline-none focus:ring-2 transition-colors disabled:opacity-50"
                        style={{
                          backgroundColor: 'rgba(255,255,255,0.04)',
                          color: INK,
                          border: `1px solid ${BORDER}`,
                          focusRing: GOLD,
                        }}
                      >
                        <option value="" style={{ backgroundColor: CARD, color: MUTED }}>
                          Select gender
                        </option>
                        <option value="male" style={{ backgroundColor: CARD, color: INK }}>
                          Male
                        </option>
                        <option value="female" style={{ backgroundColor: CARD, color: INK }}>
                          Female
                        </option>
                        <option value="other" style={{ backgroundColor: CARD, color: INK }}>
                          Other
                        </option>
                        <option
                          value="prefer-not-to-say"
                          style={{ backgroundColor: CARD, color: INK }}
                        >
                          Prefer not to say
                        </option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1.5" style={{ color: MUTED }}>
                      Location
                    </label>
                    <input
                      type="text"
                      name="location"
                      value={formData.location}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                      className="w-full px-3.5 py-2.5 rounded-xl focus:outline-none focus:ring-2 transition-colors disabled:opacity-50"
                      style={{
                        backgroundColor: 'rgba(255,255,255,0.04)',
                        color: INK,
                        border: `1px solid ${BORDER}`,
                        focusRing: GOLD,
                      }}
                      placeholder="City, Country"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1.5" style={{ color: MUTED }}>
                      Portfolio Link
                    </label>
                    <input
                      type="url"
                      name="portfolioLink"
                      value={formData.portfolioLink}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                      className="w-full px-3.5 py-2.5 rounded-xl focus:outline-none focus:ring-2 transition-colors disabled:opacity-50"
                      style={{
                        backgroundColor: 'rgba(255,255,255,0.04)',
                        color: INK,
                        border: `1px solid ${BORDER}`,
                        focusRing: GOLD,
                      }}
                      placeholder="https://your-portfolio.com"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1.5" style={{ color: MUTED }}>
                      Bio
                    </label>
                    <textarea
                      name="bio"
                      value={formData.bio}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                      rows={3}
                      className="w-full px-3.5 py-2.5 rounded-xl focus:outline-none focus:ring-2 transition-colors disabled:opacity-50 resize-none"
                      style={{
                        backgroundColor: 'rgba(255,255,255,0.04)',
                        color: INK,
                        border: `1px solid ${BORDER}`,
                        focusRing: GOLD,
                      }}
                      placeholder="Tell us about yourself..."
                    />
                  </div>

                  {/* Skills */}
                  <div>
                    <label className="block text-sm font-medium mb-1.5" style={{ color: MUTED }}>
                      Skills
                    </label>
                    {isEditing && (
                      <div className="flex gap-2 mb-3">
                        <input
                          type="text"
                          value={newSkill}
                          onChange={(e) => setNewSkill(e.target.value)}
                          onKeyPress={(e) => e.key === 'Enter' && addSkill()}
                          className="flex-1 px-3.5 py-2.5 rounded-xl focus:outline-none focus:ring-2 transition-colors"
                          style={{
                            backgroundColor: 'rgba(255,255,255,0.04)',
                            color: INK,
                            border: `1px solid ${BORDER}`,
                            focusRing: GOLD,
                          }}
                          placeholder="Add a skill"
                        />
                        <button
                          type="button"
                          onClick={addSkill}
                          className="px-4 py-2 rounded-xl font-medium transition-colors hover:opacity-80"
                          style={{ backgroundColor: GREEN, color: '#fff' }}
                        >
                          Add
                        </button>
                      </div>
                    )}
                    <div className="flex flex-wrap gap-2">
                      {formData.skills.map((skill) => (
                        <span
                          key={skill}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium"
                          style={{ backgroundColor: GOLD_TINT, color: GOLD }}
                        >
                          <Award size={12} />
                          {skill}
                          {isEditing && (
                            <button
                              type="button"
                              onClick={() => removeSkill(skill)}
                              className="hover:opacity-80 ml-1 transition-opacity"
                              style={{ color: MUTED }}
                            >
                              <X size={12} />
                            </button>
                          )}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Interests */}
                  <div>
                    <label className="block text-sm font-medium mb-1.5" style={{ color: MUTED }}>
                      Interests
                    </label>
                    {isEditing && (
                      <div className="flex gap-2 mb-3">
                        <input
                          type="text"
                          value={newInterest}
                          onChange={(e) => setNewInterest(e.target.value)}
                          onKeyPress={(e) => e.key === 'Enter' && addInterest()}
                          className="flex-1 px-3.5 py-2.5 rounded-xl focus:outline-none focus:ring-2 transition-colors"
                          style={{
                            backgroundColor: 'rgba(255,255,255,0.04)',
                            color: INK,
                            border: `1px solid ${BORDER}`,
                            focusRing: GOLD,
                          }}
                          placeholder="Add an interest"
                        />
                        <button
                          type="button"
                          onClick={addInterest}
                          className="px-4 py-2 rounded-xl font-medium transition-colors hover:opacity-80"
                          style={{ backgroundColor: BLUE, color: '#fff' }}
                        >
                          Add
                        </button>
                      </div>
                    )}
                    <div className="flex flex-wrap gap-2">
                      {formData.interests.map((interest) => (
                        <span
                          key={interest}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium"
                          style={{ backgroundColor: 'rgba(59,130,246,0.12)', color: BLUE }}
                        >
                          <Heart size={12} />
                          {interest}
                          {isEditing && (
                            <button
                              type="button"
                              onClick={() => removeInterest(interest)}
                              className="hover:opacity-80 ml-1 transition-opacity"
                              style={{ color: MUTED }}
                            >
                              <X size={12} />
                            </button>
                          )}
                        </span>
                      ))}
                    </div>
                  </div>

                  {isEditing && (
                    <div className="flex gap-3 pt-4 border-t" style={{ borderColor: BORDER }}>
                      <button
                        type="button"
                        onClick={() => {
                          setIsEditing(false);
                          setProfilePicture(null);
                          setProfilePreview('');
                          if (userData) {
                            setFormData({
                              name: userData.name || '',
                              username: userData.username || '',
                              email: userData.email || '',
                              phone: userData.phone || '',
                              bio: userData.bio || '',
                              location: userData.location || '',
                              skills: userData.skills || [],
                              interests: userData.interests || [],
                              portfolioLink: userData.portfolioLink || '',
                              whatsappNumber: userData.whatsappNumber || '',
                              dateOfBirth: userData.dateOfBirth
                                ? userData.dateOfBirth.split('T')[0]
                                : '',
                              gender: userData.gender || '',
                              profile: userData.profile || '',
                            });
                          }
                        }}
                        className="flex-1 px-4 py-2.5 rounded-xl font-medium transition-colors hover:opacity-80"
                        style={{ border: `1px solid ${BORDER}`, color: MUTED }}
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        disabled={isUpdating}
                        className="flex-1 py-2.5 rounded-xl font-semibold transition-colors hover:opacity-90 flex items-center justify-center gap-2 disabled:opacity-50"
                        style={{ backgroundColor: GOLD, color: BG }}
                      >
                        {isUpdating ? (
                          <>
                            <div
                              className="w-5 h-5 border-2 border-t-transparent rounded-full animate-spin"
                              style={{ borderColor: BG, borderTopColor: 'transparent' }}
                            />
                            Saving...
                          </>
                        ) : (
                          <>
                            <Save size={18} />
                            Save Changes
                          </>
                        )}
                      </button>
                    </div>
                  )}
                </form>
              </CardShell>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;