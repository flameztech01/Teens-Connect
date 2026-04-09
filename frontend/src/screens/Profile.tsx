import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import DashboardSidebar from "../components/DashbordSidebar"
import { useGetUserByIdQuery, useUpdateProfileMutation } from '../slices/userApiSlice';
import { setCredentials } from '../slices/authSlice';
import {
  UserCircle,
  Mail,
  Phone,
  MapPin,
  Briefcase,
  Calendar,
  Users,
  Link as LinkIcon,
  Edit2,
  Save,
  X,
  Camera,
  Upload,
  Award,
  Clock,
  CheckCircle,
  AlertCircle
} from 'lucide-react';

const Profile = () => {
  const dispatch = useDispatch();
  const { userInfo } = useSelector((state: any) => state.auth);
  const [isEditing, setIsEditing] = useState(false);
  const [profilePicture, setProfilePicture] = useState<File | null>(null);
  const [profilePreview, setProfilePreview] = useState<string>('');
  
  const [formData, setFormData] = useState({
    name: '',
    username: '',
    email: '',
    phone: '',
    bio: '',
    location: '',
    skills: [] as string[],
    interests: [] as string[],
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

  // Fetch user data using the user ID from Redux
  const { data: userData, isLoading, refetch, error } = useGetUserByIdQuery(
    userInfo?._id,
    { skip: !userInfo?._id }
  );
  
  const [updateProfile, { isLoading: isUpdating }] = useUpdateProfileMutation();

  // Log to debug
  useEffect(() => {
    console.log('userInfo from Redux:', userInfo);
    console.log('userData from API:', userData);
  }, [userInfo, userData]);

  // Populate form when userData is available
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

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleProfilePictureChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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

  const removeSkill = (skill: string) => {
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

  const removeInterest = (interest: string) => {
    setFormData({
      ...formData,
      interests: formData.interests.filter(i => i !== interest)
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
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
      console.log('Update result:', result);
      
      // Update Redux store with new user data
      dispatch(setCredentials({ ...userInfo, ...result }));
      
      setSuccessMessage('Profile updated successfully!');
      setIsEditing(false);
      setProfilePicture(null);
      setProfilePreview('');
      refetch();
      
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (error: any) {
      console.error('Update error:', error);
      setErrorMessage(error.data?.message || 'Failed to update profile');
      setTimeout(() => setErrorMessage(''), 3000);
    }
  };

  const getInitials = (name: string) => {
    if (!name) return 'U';
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <DashboardSidebar />
        <div className="lg:ml-64 p-8 flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="w-12 h-12 border-4 border-[#f4a825] border-t-transparent rounded-full animate-spin mx-auto"></div>
            <p className="text-gray-500 mt-4">Loading profile...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    console.error('Error fetching user:', error);
    return (
      <div className="min-h-screen bg-gray-50">
        <DashboardSidebar />
        <div className="lg:ml-64 p-8">
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg">
            <p>Error loading profile. Please try again later.</p>
            <button 
              onClick={() => refetch()} 
              className="mt-2 text-red-700 font-semibold hover:underline"
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  const displayImage = profilePreview || formData.profile || userInfo?.profile;

  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardSidebar />
      
      <div className="lg:ml-64 p-6 lg:p-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-[#1d2b4f] mb-2">My Profile</h1>
          <p className="text-gray-600">Manage your personal information and preferences</p>
        </div>

        {/* Success/Error Messages */}
        {successMessage && (
          <div className="mb-6 bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-lg flex items-center gap-2">
            <CheckCircle size={18} />
            {successMessage}
          </div>
        )}
        {errorMessage && (
          <div className="mb-6 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg flex items-center gap-2">
            <AlertCircle size={18} />
            {errorMessage}
          </div>
        )}

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Column - Profile Image & Stats */}
          <div className="space-y-6">
            {/* Profile Image Card */}
            <div className="bg-white rounded-xl shadow-sm p-6 text-center">
              <div className="relative inline-block">
                {displayImage ? (
                  <img
                    src={displayImage}
                    alt={formData.name || 'User'}
                    className="w-32 h-32 rounded-full object-cover border-4 border-[#f4a825] mx-auto"
                  />
                ) : (
                  <div className="w-32 h-32 rounded-full bg-gradient-to-br from-[#1d2b4f] to-[#0d6b57] flex items-center justify-center mx-auto border-4 border-[#f4a825]">
                    <span className="text-white font-bold text-3xl">
                      {getInitials(formData.name || userInfo?.name || 'User')}
                    </span>
                  </div>
                )}
                {isEditing && (
                  <label className="absolute bottom-0 right-0 bg-[#f4a825] p-2 rounded-full cursor-pointer hover:bg-[#e79a13] transition-colors">
                    <Camera size={16} className="text-[#1d2b4f]" />
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleProfilePictureChange}
                      className="hidden"
                    />
                  </label>
                )}
              </div>
              <h2 className="text-xl font-bold text-[#1d2b4f] mt-4">{formData.name || userInfo?.name || 'User'}</h2>
              <p className="text-gray-500 text-sm">@{formData.username || userInfo?.username || 'username'}</p>
              <div className="mt-4 pt-4 border-t border-gray-100">
                <div className="flex justify-around">
                  <div>
                    <p className="text-2xl font-bold text-[#1d2b4f]">{formData.skills.length || 0}</p>
                    <p className="text-xs text-gray-500">Skills</p>
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-[#1d2b4f]">{formData.interests.length || 0}</p>
                    <p className="text-xs text-gray-500">Interests</p>
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-[#1d2b4f]">{userData?.profileViews || 0}</p>
                    <p className="text-xs text-gray-500">Views</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Contact Info Card */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h3 className="font-semibold text-[#1d2b4f] mb-4 flex items-center gap-2">
                <Mail size={16} />
                Contact Information
              </h3>
              <div className="space-y-3">
                <div className="flex items-center gap-3 text-sm">
                  <Mail size={14} className="text-gray-400" />
                  <span className="text-gray-600">{formData.email || userInfo?.email || 'Not provided'}</span>
                </div>
                {(formData.phone || userInfo?.phone) && (
                  <div className="flex items-center gap-3 text-sm">
                    <Phone size={14} className="text-gray-400" />
                    <span className="text-gray-600">{formData.phone || userInfo?.phone}</span>
                  </div>
                )}
                {formData.whatsappNumber && (
                  <div className="flex items-center gap-3 text-sm">
                    <span className="text-green-600">📱</span>
                    <span className="text-gray-600">{formData.whatsappNumber}</span>
                  </div>
                )}
                {(formData.location || userInfo?.location) && (
                  <div className="flex items-center gap-3 text-sm">
                    <MapPin size={14} className="text-gray-400" />
                    <span className="text-gray-600">{formData.location || userInfo?.location}</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right Column - Edit Form */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-sm p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold text-[#1d2b4f]">Profile Information</h3>
                {!isEditing ? (
                  <button
                    onClick={() => setIsEditing(true)}
                    className="flex items-center gap-2 text-[#f4a825] hover:text-[#e79a13] transition-colors"
                  >
                    <Edit2 size={16} />
                    Edit Profile
                  </button>
                ) : (
                  <div className="flex gap-2">
                    <button
                      onClick={() => {
                        setIsEditing(false);
                        setProfilePicture(null);
                        setProfilePreview('');
                        // Reset form to original data
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
                      className="flex items-center gap-2 text-gray-500 hover:text-gray-700 transition-colors"
                    >
                      <X size={16} />
                      Cancel
                    </button>
                  </div>
                )}
              </div>

              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-[#1d2b4f] mb-2">
                      Full Name
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-[#f4a825] disabled:bg-gray-50 disabled:text-gray-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-[#1d2b4f] mb-2">
                      Username
                    </label>
                    <input
                      type="text"
                      name="username"
                      value={formData.username}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-[#f4a825] disabled:bg-gray-50 disabled:text-gray-500"
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-[#1d2b4f] mb-2">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-[#f4a825] disabled:bg-gray-50 disabled:text-gray-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-[#1d2b4f] mb-2">
                      WhatsApp Number
                    </label>
                    <input
                      type="tel"
                      name="whatsappNumber"
                      value={formData.whatsappNumber}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-[#f4a825] disabled:bg-gray-50 disabled:text-gray-500"
                      placeholder="+234 123 456 7890"
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-[#1d2b4f] mb-2">
                      Date of Birth
                    </label>
                    <input
                      type="date"
                      name="dateOfBirth"
                      value={formData.dateOfBirth}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-[#f4a825] disabled:bg-gray-50 disabled:text-gray-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-[#1d2b4f] mb-2">
                      Gender
                    </label>
                    <select
                      name="gender"
                      value={formData.gender}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-[#f4a825] disabled:bg-gray-50"
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
                  <label className="block text-sm font-semibold text-[#1d2b4f] mb-2">
                    Location
                  </label>
                  <input
                    type="text"
                    name="location"
                    value={formData.location}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-[#f4a825] disabled:bg-gray-50 disabled:text-gray-500"
                    placeholder="City, Country"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-[#1d2b4f] mb-2">
                    Portfolio Link
                  </label>
                  <input
                    type="url"
                    name="portfolioLink"
                    value={formData.portfolioLink}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-[#f4a825] disabled:bg-gray-50 disabled:text-gray-500"
                    placeholder="https://your-portfolio.com"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-[#1d2b4f] mb-2">
                    Bio
                  </label>
                  <textarea
                    name="bio"
                    value={formData.bio}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    rows={3}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-[#f4a825] disabled:bg-gray-50 disabled:text-gray-500 resize-none"
                    placeholder="Tell us about yourself..."
                  />
                </div>

                {/* Skills */}
                <div>
                  <label className="block text-sm font-semibold text-[#1d2b4f] mb-2">
                    Skills
                  </label>
                  {isEditing && (
                    <div className="flex gap-2 mb-2">
                      <input
                        type="text"
                        value={newSkill}
                        onChange={(e) => setNewSkill(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && addSkill()}
                        className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-[#f4a825]"
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
                        className="flex items-center gap-2 px-3 py-1 bg-[#f4a825] bg-opacity-10 text-[#f4a825] rounded-full text-sm"
                      >
                        {skill}
                        {isEditing && (
                          <button
                            type="button"
                            onClick={() => removeSkill(skill)}
                            className="hover:text-red-500 transition-colors"
                          >
                            <X size={14} />
                          </button>
                        )}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Interests */}
                <div>
                  <label className="block text-sm font-semibold text-[#1d2b4f] mb-2">
                    Interests
                  </label>
                  {isEditing && (
                    <div className="flex gap-2 mb-2">
                      <input
                        type="text"
                        value={newInterest}
                        onChange={(e) => setNewInterest(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && addInterest()}
                        className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-[#f4a825]"
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
                        className="flex items-center gap-2 px-3 py-1 bg-[#0d6b57] bg-opacity-10 text-[#0d6b57] rounded-full text-sm"
                      >
                        {interest}
                        {isEditing && (
                          <button
                            type="button"
                            onClick={() => removeInterest(interest)}
                            className="hover:text-red-500 transition-colors"
                          >
                            <X size={14} />
                          </button>
                        )}
                      </span>
                    ))}
                  </div>
                </div>

                {isEditing && (
                  <button
                    type="submit"
                    disabled={isUpdating}
                    className="w-full bg-[#f4a825] text-white py-3 rounded-lg font-semibold hover:bg-[#e79a13] transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
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
                )}
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;