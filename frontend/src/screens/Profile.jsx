import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
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
  TrendingUp
} from 'lucide-react';

const Profile = () => {
  const dispatch = useDispatch();
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
    profile: ''
  });

  const [newSkill, setNewSkill] = useState('');
  const [newInterest, setNewInterest] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const { data: userData, isLoading, refetch } = useGetUserByIdQuery(
    userInfo?._id,
    { skip: !userInfo?._id }
  );
  
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
        profile: userData.profile || userData.profilePicture || ''
      });
    }
  }, [userData]);

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
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
        skills: [...formData.skills, newSkill.trim()]
      });
      setNewSkill('');
    }
  };

  const removeSkill = (skill) => {
    setFormData({
      ...formData,
      skills: formData.skills.filter(s => s !== skill)
    });
  };

  const addInterest = () => {
    if (newInterest.trim() && !formData.interests.includes(newInterest.trim())) {
      setFormData({
        ...formData,
        interests: [...formData.interests, newInterest.trim()]
      });
      setNewInterest('');
    }
  };

  const removeInterest = (interest) => {
    setFormData({
      ...formData,
      interests: formData.interests.filter(i => i !== interest)
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
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-100">
        <DashboardSidebar />
        <div className="lg:ml-72 flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="w-12 h-12 border-4 border-[#f4a825] border-t-transparent rounded-full animate-spin mx-auto"></div>
            <p className="text-gray-500 mt-4">Loading profile...</p>
          </div>
        </div>
      </div>
    );
  }

  const displayImage = profilePreview || formData.profile;

  return (
    <div className="min-h-screen bg-gray-100">
      <DashboardSidebar />
      
      <div className="lg:ml-72">
        {/* Header – white, like Facebook */}
        <div className="bg-white border-b border-gray-200 sticky top-0 z-30">
          <div className="px-4 sm:px-6 lg:px-8 py-3 sm:py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-[#f4a825]/10 flex items-center justify-center">
                  <UserCircle className="w-5 h-5 sm:w-6 sm:h-6 text-[#f4a825]" />
                </div>
                <div>
                  <h1 className="text-lg sm:text-2xl font-bold text-gray-900">My Profile</h1>
                  <p className="text-xs sm:text-sm text-gray-500 mt-0.5">
                    Manage your personal information and preferences
                  </p>
                </div>
              </div>
              
              {!isEditing && (
                <button
                  onClick={() => setIsEditing(true)}
                  className="flex items-center gap-2 px-4 sm:px-5 py-2 bg-[#f4a825] text-white text-sm font-semibold rounded-lg hover:bg-[#e09e1a] transition-colors"
                >
                  <Edit2 size={16} />
                  <span className="hidden sm:inline">Edit Profile</span>
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Main content */}
        <div className="px-4 sm:px-6 lg:px-8 py-6 max-w-6xl mx-auto">
          {/* Success/Error Messages */}
          {successMessage && (
            <div className="mb-4 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg flex items-center gap-2">
              <CheckCircle size={18} className="text-green-500" />
              <span className="text-sm font-medium">{successMessage}</span>
            </div>
          )}
          {errorMessage && (
            <div className="mb-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-center gap-2">
              <AlertCircle size={18} className="text-red-500" />
              <span className="text-sm font-medium">{errorMessage}</span>
            </div>
          )}

          <div className="grid lg:grid-cols-3 gap-6">
            {/* Left Column – Profile Summary Card (no shadow) */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                <div className="p-6">
                  <div className="flex flex-col items-center">
                    <div className="relative">
                      {displayImage ? (
                        <img
                          src={displayImage}
                          alt={formData.name}
                          className="w-24 h-24 rounded-full object-cover ring-4 ring-gray-100"
                        />
                      ) : (
                        <div className="w-24 h-24 rounded-full bg-gradient-to-br from-[#f4a825] to-[#e09e1a] flex items-center justify-center ring-4 ring-gray-100">
                          <span className="text-white font-bold text-2xl">
                            {getInitials(formData.name)}
                          </span>
                        </div>
                      )}
                      {isEditing && (
                        <label className="absolute bottom-0 right-0 bg-[#f4a825] p-1.5 rounded-full cursor-pointer hover:bg-[#e09e1a] transition-colors ring-2 ring-white">
                          <Camera size={12} className="text-white" />
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
                      <h2 className="text-xl font-bold text-gray-900">{formData.name}</h2>
                      <p className="text-gray-500 text-sm">@{formData.username}</p>
                    </div>

                    <div className="flex justify-around w-full mt-6 pt-4 border-t border-gray-200">
                      <div className="text-center">
                        <p className="text-xl font-bold text-gray-900">{formData.skills.length}</p>
                        <p className="text-xs text-gray-500">Skills</p>
                      </div>
                      <div className="text-center">
                        <p className="text-xl font-bold text-gray-900">{formData.interests.length}</p>
                        <p className="text-xs text-gray-500">Interests</p>
                      </div>
                      <div className="text-center">
                        <p className="text-xl font-bold text-gray-900">{userData?.profileViews || 0}</p>
                        <p className="text-xs text-gray-500">Views</p>
                      </div>
                    </div>

                    <div className="w-full mt-6 space-y-2 text-sm">
                      {formData.email && (
                        <div className="flex items-center gap-2 text-gray-600">
                          <Mail size={14} className="text-gray-400" />
                          <span>{formData.email}</span>
                        </div>
                      )}
                      {formData.phone && (
                        <div className="flex items-center gap-2 text-gray-600">
                          <Phone size={14} className="text-gray-400" />
                          <span>{formData.phone}</span>
                        </div>
                      )}
                      {formData.location && (
                        <div className="flex items-center gap-2 text-gray-600">
                          <MapPin size={14} className="text-gray-400" />
                          <span>{formData.location}</span>
                        </div>
                      )}
                      {formData.dateOfBirth && (
                        <div className="flex items-center gap-2 text-gray-600">
                          <Calendar size={14} className="text-gray-400" />
                          <span>{new Date(formData.dateOfBirth).toLocaleDateString()}</span>
                        </div>
                      )}
                    </div>

                    {formData.portfolioLink && (
                      <a
                        href={formData.portfolioLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-4 flex items-center justify-center gap-2 text-sm text-blue-600 hover:text-blue-700 transition-colors"
                      >
                        <LinkIcon size={14} />
                        View Portfolio
                      </a>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column – Edit Form Card (no shadow) */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-200">
                  <h3 className="font-semibold text-gray-900">Profile Information</h3>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-5">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">
                        Full Name
                      </label>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        disabled={!isEditing}
                        className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#f4a825]/30 focus:border-[#f4a825] disabled:bg-gray-100 disabled:text-gray-500 transition-colors"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">
                        Username
                      </label>
                      <input
                        type="text"
                        name="username"
                        value={formData.username}
                        onChange={handleInputChange}
                        disabled={!isEditing}
                        className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#f4a825]/30 focus:border-[#f4a825] disabled:bg-gray-100 disabled:text-gray-500 transition-colors"
                      />
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">
                        Phone Number
                      </label>
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        disabled={!isEditing}
                        className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#f4a825]/30 focus:border-[#f4a825] disabled:bg-gray-100 disabled:text-gray-500 transition-colors"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">
                        WhatsApp Number
                      </label>
                      <input
                        type="tel"
                        name="whatsappNumber"
                        value={formData.whatsappNumber}
                        onChange={handleInputChange}
                        disabled={!isEditing}
                        className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#f4a825]/30 focus:border-[#f4a825] disabled:bg-gray-100 disabled:text-gray-500 transition-colors"
                        placeholder="+234 123 456 7890"
                      />
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">
                        Date of Birth
                      </label>
                      <input
                        type="date"
                        name="dateOfBirth"
                        value={formData.dateOfBirth}
                        onChange={handleInputChange}
                        disabled={!isEditing}
                        className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#f4a825]/30 focus:border-[#f4a825] disabled:bg-gray-100 disabled:text-gray-500 transition-colors"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">
                        Gender
                      </label>
                      <select
                        name="gender"
                        value={formData.gender}
                        onChange={handleInputChange}
                        disabled={!isEditing}
                        className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#f4a825]/30 focus:border-[#f4a825] disabled:bg-gray-100 transition-colors"
                      >
                        <option value="">Select gender</option>
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                        <option value="other">Other</option>
                        <option value="prefer-not-to-say">Prefer not to say</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                      Location
                    </label>
                    <input
                      type="text"
                      name="location"
                      value={formData.location}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                      className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#f4a825]/30 focus:border-[#f4a825] disabled:bg-gray-100 disabled:text-gray-500 transition-colors"
                      placeholder="City, Country"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                      Portfolio Link
                    </label>
                    <input
                      type="url"
                      name="portfolioLink"
                      value={formData.portfolioLink}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                      className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#f4a825]/30 focus:border-[#f4a825] disabled:bg-gray-100 disabled:text-gray-500 transition-colors"
                      placeholder="https://your-portfolio.com"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                      Bio
                    </label>
                    <textarea
                      name="bio"
                      value={formData.bio}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                      rows={3}
                      className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#f4a825]/30 focus:border-[#f4a825] disabled:bg-gray-100 disabled:text-gray-500 resize-none transition-colors"
                      placeholder="Tell us about yourself..."
                    />
                  </div>

                  {/* Skills */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                      Skills
                    </label>
                    {isEditing && (
                      <div className="flex gap-2 mb-3">
                        <input
                          type="text"
                          value={newSkill}
                          onChange={(e) => setNewSkill(e.target.value)}
                          onKeyPress={(e) => e.key === 'Enter' && addSkill()}
                          className="flex-1 px-3.5 py-2.5 bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#f4a825]/30 focus:border-[#f4a825] transition-colors"
                          placeholder="Add a skill"
                        />
                        <button
                          type="button"
                          onClick={addSkill}
                          className="px-4 py-2 bg-[#0d6b57] text-white rounded-lg hover:bg-[#0a5545] transition-colors"
                        >
                          Add
                        </button>
                      </div>
                    )}
                    <div className="flex flex-wrap gap-2">
                      {formData.skills.map((skill) => (
                        <span
                          key={skill}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#f4a825]/10 text-[#f4a825] rounded-full text-sm font-medium"
                        >
                          <Award size={12} />
                          {skill}
                          {isEditing && (
                            <button
                              type="button"
                              onClick={() => removeSkill(skill)}
                              className="hover:text-red-500 transition-colors ml-1"
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
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                      Interests
                    </label>
                    {isEditing && (
                      <div className="flex gap-2 mb-3">
                        <input
                          type="text"
                          value={newInterest}
                          onChange={(e) => setNewInterest(e.target.value)}
                          onKeyPress={(e) => e.key === 'Enter' && addInterest()}
                          className="flex-1 px-3.5 py-2.5 bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#f4a825]/30 focus:border-[#f4a825] transition-colors"
                          placeholder="Add an interest"
                        />
                        <button
                          type="button"
                          onClick={addInterest}
                          className="px-4 py-2 bg-[#0d6b57] text-white rounded-lg hover:bg-[#0a5545] transition-colors"
                        >
                          Add
                        </button>
                      </div>
                    )}
                    <div className="flex flex-wrap gap-2">
                      {formData.interests.map((interest) => (
                        <span
                          key={interest}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#0d6b57]/10 text-[#0d6b57] rounded-full text-sm font-medium"
                        >
                          <Heart size={12} />
                          {interest}
                          {isEditing && (
                            <button
                              type="button"
                              onClick={() => removeInterest(interest)}
                              className="hover:text-red-500 transition-colors ml-1"
                            >
                              <X size={12} />
                            </button>
                          )}
                        </span>
                      ))}
                    </div>
                  </div>

                  {isEditing && (
                    <div className="flex gap-3 pt-4 border-t border-gray-200">
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
                              dateOfBirth: userData.dateOfBirth ? userData.dateOfBirth.split('T')[0] : '',
                              gender: userData.gender || '',
                              profile: userData.profile || ''
                            });
                          }
                        }}
                        className="flex-1 px-4 py-2.5 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        disabled={isUpdating}
                        className="flex-1 bg-[#f4a825] text-white py-2.5 rounded-lg font-semibold hover:bg-[#e09e1a] transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                      >
                        {isUpdating ? (
                          <>
                            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
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
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;